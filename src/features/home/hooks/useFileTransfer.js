import { useState } from 'react';
import {
    useInitiateMultipartMutation,
    useGetPartUrlMutation,
    useCompleteMultipartMutation,
    useFinalizeTransferMutation,
    useSpeedTestMutation
} from '../api/homeApi';

export const useFileTransfer = ({
    uploadedFiles,
    setUploadedFiles,
    senderEmail,
    recipients,
    setRecipients,
    transferType,
    expiresIn,
    selectedMethod,
    selfDestruct,
    isDownloadAble,
    setMessage,
    totalSize,
    password
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadSpeed, setUploadSpeed] = useState(0);
    const [uploadedBytes, setUploadedBytes] = useState(0);
    const [generatedLink, setGeneratedLink] = useState(null);

    const [initiateMultipart] = useInitiateMultipartMutation();
    const [getPartUrl] = useGetPartUrlMutation();
    const [completeMultipart] = useCompleteMultipartMutation();
    const [finalizeTransfer] = useFinalizeTransferMutation();
    const [speedTest] = useSpeedTestMutation(); 

    const [chunkSize, setChunkSize] = useState(20 * 1024 * 1024); 
    const [concurrencyLimit, setConcurrencyLimit] = useState(4);

    const measureUploadSpeed = async () => {
        try {
            const testSize = 1 * 1024 * 1024; 
            const testData = new Uint8Array(testSize);
            const startTime = Date.now();
            
            await speedTest({ 
                method: 'POST', 
                body: testData.buffer,
                headers: { 'Content-Type': 'application/octet-stream' }
            }).unwrap();
            
            const duration = (Date.now() - startTime) / 1000;
            const speedBps = testSize / duration;
            
            // Determine optimal parameters
            if (speedBps < 1 * 1024 * 1024) { 
                setChunkSize(5 * 1024 * 1024);
                setConcurrencyLimit(2);
            } else if (speedBps < 5 * 1024 * 1024) { 
                setChunkSize(10 * 1024 * 1024);
                setConcurrencyLimit(3);
            } else if (speedBps < 10 * 1024 * 1024) { 
                setChunkSize(20 * 1024 * 1024); 
                setConcurrencyLimit(4);
            } else { 
                setChunkSize(40 * 1024 * 1024); 
                setConcurrencyLimit(6);
            }
            
            return speedBps;
        } catch (error) {
            console.warn("Speed test failed, using defaults", error);
            return null;
        }
    };

    const uploadFilePart = async (file, uploadId, key, partNumber, onProgress, retryCount = 0) => {
        return new Promise(async (resolve, reject) => {
            try {
                const start = (partNumber - 1) * chunkSize;
                const end = Math.min(start + chunkSize, file.size);
                const chunk = file.slice(start, end);

                // Step A: Get Signed URL
                const { url } = await getPartUrl({ uploadId, key, partNumber }).unwrap();

                const xhr = new XMLHttpRequest();
                
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        onProgress(event.loaded);
                    }
                });

                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            const etag = xhr.getResponseHeader('ETag');
                            if (!etag) {
                                reject(new Error(`No ETag found for part ${partNumber}`));
                            } else {
                                resolve({ PartNumber: partNumber, ETag: etag.replace(/"/g, '') });
                            }
                        } else {
                            if (retryCount < 3) {
                                console.warn(`Retrying part ${partNumber} for ${file.name} (Attempt ${retryCount + 1})`);
                                resolve(uploadFilePart(file, uploadId, key, partNumber, onProgress, retryCount + 1));
                            } else {
                                reject(new Error(`Failed to upload part ${partNumber} with status ${xhr.status}`));
                            }
                        }
                    }
                };

                xhr.onerror = () => {
                    if (retryCount < 3) {
                        console.warn(`Retrying part ${partNumber} for ${file.name} (Attempt ${retryCount + 1})`);
                        resolve(uploadFilePart(file, uploadId, key, partNumber, onProgress, retryCount + 1));
                    } else {
                        reject(new Error(`Network error during part ${partNumber} upload`));
                    }
                };

                xhr.open('PUT', url);
                xhr.send(chunk);

            } catch (error) {
                if (retryCount < 3) {
                    console.warn(`Retrying part ${partNumber} for ${file.name} (Attempt ${retryCount + 1})`);
                    resolve(uploadFilePart(file, uploadId, key, partNumber, onProgress, retryCount + 1));
                } else {
                    reject(error);
                }
            }
        });
    };

    const processFile = async (file, onProgressUpdate) => {
        // Step 1: Initiate Multipart
        const { uploadId, key } = await initiateMultipart({
            fileName: file.name,
            fileType: file.type
        }).unwrap();

        const totalParts = Math.ceil(file.size / chunkSize);
        const parts = [];
        const partProgressMap = new Map();
        const queue = Array.from({ length: totalParts }, (_, i) => i + 1);
        let activeParts = 0;
        let completedPartsCount = 0;

        return new Promise((resolve, reject) => {
            const calculateTotalProgress = () => {
                const totalUploadedForFile = Array.from(partProgressMap.values()).reduce((a, b) => a + b, 0);
                onProgressUpdate(totalUploadedForFile / file.size);
            };

            const runNext = async () => {
                if (queue.length === 0 && activeParts === 0) {
                    try {
                        // Step 4: Complete Multipart
                        await completeMultipart({ uploadId, key, parts }).unwrap();
                        resolve({ fileName: file.name, key, size: file.size });
                        return;
                    } catch (err) {
                        reject(err);
                        return;
                    }
                }

                while (queue.length > 0 && activeParts < concurrencyLimit) {
                    const partNumber = queue.shift();
                    activeParts++;
                    
                    uploadFilePart(file, uploadId, key, partNumber, (bytesUploaded) => {
                        partProgressMap.set(partNumber, bytesUploaded);
                        calculateTotalProgress();
                    })
                        .then((partResult) => {
                            parts.push(partResult);
                            completedPartsCount++;
                            activeParts--;
                            // Ensure it's at 100% for this part
                            const partEnd = partNumber * chunkSize;
                            const partSize = Math.min(chunkSize, file.size - (partNumber - 1) * chunkSize);
                            partProgressMap.set(partNumber, partSize);
                            calculateTotalProgress();
                            runNext();
                        })
                        .catch(reject);
                }
            };

            runNext();
        });
    };

    const handleTransfer = async () => {
        if (!uploadedFiles.length) {
            alert('Please add files first');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setUploadSpeed(0);

        // Optimization: Test speed and set optimal chunk size
        await measureUploadSpeed();

        try {
            // Flatten files
            const allFiles = [];
            uploadedFiles.forEach(item => {
                if (item._isFolder) {
                    allFiles.push(...item.files);
                } else {
                    allFiles.push(item);
                }
            });

            const totalBytes = allFiles.reduce((acc, f) => acc + f.size, 0);
            let uploadedBytesMap = new Map();
            const startTime = Date.now();

            const fileUploadPromises = allFiles.map(file => {
                return processFile(file, (partPercentage) => {
                    const fileUploadedBytes = partPercentage * file.size;
                    uploadedBytesMap.set(file.name, fileUploadedBytes);

                    const totalUploaded = Array.from(uploadedBytesMap.values()).reduce((a, b) => a + b, 0);
                    setUploadedBytes(totalUploaded);
                    setUploadProgress(Math.round((totalUploaded / totalBytes) * 100));

                    const durationInSeconds = (Date.now() - startTime) / 1000;
                    if (durationInSeconds > 0) {
                        setUploadSpeed(totalUploaded / durationInSeconds);
                    }
                });
            });

            const completedFiles = await Promise.all(fileUploadPromises);

            // Step 5: Finalize Transfer
            const finalizeResponse = await finalizeTransfer({
                body: {
                    senderEmail,
                    recevierEmails: recipients,
                    files: completedFiles.map(f => ({
                        name: f.fileName,
                        key: f.key,
                        size: f.size
                    })),
                    totalSize: totalBytes,
                    expireIn: expiresIn === 'never' ? 'never' : `${expiresIn}d`,
                    password: password || undefined,
                    selfDestruct,
                    downloadable: transferType === 'video' ? isDownloadAble : false,
                    type: transferType === 'video' ? 'Video' : 'File'
                },
                params: {
                    getShareableLink: selectedMethod === 'link',
                    selfDestruct: selfDestruct,
                    isDownloadAble: transferType === 'video' ? isDownloadAble : false
                }
            }).unwrap();

            if (selectedMethod === 'link' && finalizeResponse.shareLink) {
                setGeneratedLink(finalizeResponse.shareLink);
            } else {
                alert('Transfer successful!');
                setUploadedFiles([]);
                setRecipients([]);
                setMessage('');
            }
        } catch (err) {
            console.error("Transfer error:", err);
            alert('Transfer failed: ' + (err.data?.message || err.message || 'Unknown error'));
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            setUploadSpeed(0);
            setUploadedBytes(0);
        }
    };

    return {
        isUploading,
        uploadProgress,
        uploadSpeed,
        uploadedBytes,
        totalBytes: uploadedFiles.reduce((acc, item) => acc + (item._isFolder ? item.files.reduce((a, b) => a + b.size, 0) : item.size), 0),
        generatedLink,
        setGeneratedLink,
        handleTransfer
    };
};
