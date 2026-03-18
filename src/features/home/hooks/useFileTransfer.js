import { useState } from 'react';
import { 
    useInitiateMultipartMutation, 
    useGetPartUrlMutation, 
    useCompleteMultipartMutation, 
    useFinalizeTransferMutation 
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
    const [generatedLink, setGeneratedLink] = useState(null);

    const [initiateMultipart] = useInitiateMultipartMutation();
    const [getPartUrl] = useGetPartUrlMutation();
    const [completeMultipart] = useCompleteMultipartMutation();
    const [finalizeTransfer] = useFinalizeTransferMutation();

    const CHUNK_SIZE = 20 * 1024 * 1024; // 20MB
    const CONCURRENCY_LIMIT = 4;

    const uploadFilePart = async (file, uploadId, key, partNumber, retryCount = 0) => {
        try {
            const start = (partNumber - 1) * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunk = file.slice(start, end);

            // Step A: Get Signed URL
            const { url } = await getPartUrl({ uploadId, key, partNumber }).unwrap();

            // Step B: PUT Binary Data
            const response = await fetch(url, {
                method: 'PUT',
                body: chunk,
            });

            if (!response.ok) throw new Error(`Failed to upload part ${partNumber}`);

            // Capture ETag
            const etag = response.headers.get('ETag');
            if (!etag) throw new Error(`No ETag found for part ${partNumber}`);

            return { PartNumber: partNumber, ETag: etag.replace(/"/g, '') };
        } catch (error) {
            if (retryCount < 3) {
                console.warn(`Retrying part ${partNumber} for ${file.name} (Attempt ${retryCount + 1})`);
                return uploadFilePart(file, uploadId, key, partNumber, retryCount + 1);
            }
            throw error;
        }
    };

    const processFile = async (file, onProgressUpdate) => {
        // Step 1: Initiate Multipart
        const { uploadId, key } = await initiateMultipart({ 
            fileName: file.name, 
            fileType: file.type 
        }).unwrap();

        const totalParts = Math.ceil(file.size / CHUNK_SIZE);
        const parts = [];
        const queue = Array.from({ length: totalParts }, (_, i) => i + 1);
        let activeParts = 0;
        let completedParts = 0;

        return new Promise((resolve, reject) => {
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

                while (queue.length > 0 && activeParts < CONCURRENCY_LIMIT) {
                    const partNumber = queue.shift();
                    activeParts++;
                    
                    uploadFilePart(file, uploadId, key, partNumber)
                        .then((partResult) => {
                            parts.push(partResult);
                            completedParts++;
                            activeParts--;
                            onProgressUpdate(completedParts / totalParts);
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
        }
    };

    return {
        isUploading,
        uploadProgress,
        uploadSpeed,
        generatedLink,
        setGeneratedLink,
        handleTransfer
    };
};
