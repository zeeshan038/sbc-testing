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
    const [newTransferId, setNewTransferId] = useState(null);
    const [generatedLink, setGeneratedLink] = useState(null);

    const [initiateMultipart] = useInitiateMultipartMutation();
    const [getPartUrl] = useGetPartUrlMutation();
    const [completeMultipart] = useCompleteMultipartMutation();
    const [finalizeTransfer] = useFinalizeTransferMutation();
    const [speedTest] = useSpeedTestMutation();
    
    // ... (measureUploadSpeed and uploadFilePart remain unchanged)
    
    // (I will use multi_replace if needed, but for now I'm just showing the logic)

    // Kept for optional UI/debug use, but actual upload uses local values returned by measureUploadSpeed
    const [chunkSize, setChunkSize] = useState(20 * 1024 * 1024);
    const [concurrencyLimit, setConcurrencyLimit] = useState(4);

    const measureUploadSpeed = async () => {
        try {
            const testSize = 10 * 1024 * 1024; // 10MB
            const testData = new Uint8Array(testSize);
            const startTime = performance.now();

            await speedTest({
                body: testData.buffer,
                headers: { 'Content-Type': 'application/octet-stream' }
            }).unwrap();

            const duration = (performance.now() - startTime) / 1000;
            const speedBps = testSize / duration;

            let nextChunkSize = 20 * 1024 * 1024;
            let nextConcurrencyLimit = 4;

            if (speedBps < 1 * 1024 * 1024) {
                nextChunkSize = 5 * 1024 * 1024;
                nextConcurrencyLimit = 2;
            } else if (speedBps < 5 * 1024 * 1024) {
                nextChunkSize = 10 * 1024 * 1024;
                nextConcurrencyLimit = 3;
            } else if (speedBps < 10 * 1024 * 1024) {
                nextChunkSize = 20 * 1024 * 1024;
                nextConcurrencyLimit = 4;
            } else {
                nextChunkSize = 40 * 1024 * 1024;
                nextConcurrencyLimit = 6;
            }

            // Optional: keep state updated for UI/debugging
            setChunkSize(nextChunkSize);
            setConcurrencyLimit(nextConcurrencyLimit);

            return {
                speedBps,
                chunkSize: nextChunkSize,
                concurrencyLimit: nextConcurrencyLimit
            };
        } catch (error) {
            console.warn('Speed test failed, using defaults', error);

            const fallback = {
                speedBps: null,
                chunkSize: 20 * 1024 * 1024,
                concurrencyLimit: 4
            };

            setChunkSize(fallback.chunkSize);
            setConcurrencyLimit(fallback.concurrencyLimit);

            return fallback;
        }
    };

    const uploadFilePart = async (
        file,
        uploadId,
        key,
        partNumber,
        activeChunkSize,
        onProgress,
        retryCount = 0
    ) => {
        return new Promise(async (resolve, reject) => {
            try {
                const start = (partNumber - 1) * activeChunkSize;
                const end = Math.min(start + activeChunkSize, file.size);
                const chunk = file.slice(start, end);

                const { url } = await getPartUrl({ uploadId, key, partNumber }).unwrap();

                const xhr = new XMLHttpRequest();

                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        onProgress(event.loaded);
                    }
                });

                xhr.onreadystatechange = () => {
                    if (xhr.readyState !== 4) return;

                    if (xhr.status >= 200 && xhr.status < 300) {
                        const etag = xhr.getResponseHeader('ETag');

                        if (!etag) {
                            reject(new Error(`No ETag found for part ${partNumber}`));
                            return;
                        }

                        resolve({
                            PartNumber: partNumber,
                            ETag: etag.replace(/"/g, '')
                        });
                    } else {
                        if (retryCount < 3) {
                            console.warn(
                                `Retrying part ${partNumber} for ${file.name} (Attempt ${retryCount + 1})`
                            );
                            resolve(
                                uploadFilePart(
                                    file,
                                    uploadId,
                                    key,
                                    partNumber,
                                    activeChunkSize,
                                    onProgress,
                                    retryCount + 1
                                )
                            );
                        } else {
                            reject(
                                new Error(
                                    `Failed to upload part ${partNumber} with status ${xhr.status}`
                                )
                            );
                        }
                    }
                };

                xhr.onerror = () => {
                    if (retryCount < 3) {
                        console.warn(
                            `Retrying part ${partNumber} for ${file.name} (Attempt ${retryCount + 1})`
                        );
                        resolve(
                            uploadFilePart(
                                file,
                                uploadId,
                                key,
                                partNumber,
                                activeChunkSize,
                                onProgress,
                                retryCount + 1
                            )
                        );
                    } else {
                        reject(new Error(`Network error during part ${partNumber} upload`));
                    }
                };

                xhr.open('PUT', url);
                xhr.send(chunk);
            } catch (error) {
                if (retryCount < 3) {
                    console.warn(
                        `Retrying part ${partNumber} for ${file.name} (Attempt ${retryCount + 1})`
                    );
                    resolve(
                        uploadFilePart(
                            file,
                            uploadId,
                            key,
                            partNumber,
                            activeChunkSize,
                            onProgress,
                            retryCount + 1
                        )
                    );
                } else {
                    reject(error);
                }
            }
        });
    };

    const processFile = async (
        file,
        onProgressUpdate,
        activeChunkSize,
        activeConcurrencyLimit
    ) => {
        const { uploadId, key } = await initiateMultipart({
            fileName: file.name,
            fileType: file.type
        }).unwrap();

        const totalParts = Math.ceil(file.size / activeChunkSize);
        const parts = [];
        const partProgressMap = new Map();
        const queue = Array.from({ length: totalParts }, (_, i) => i + 1);
        let activeParts = 0;
        let isRejected = false;

        return new Promise((resolve, reject) => {
            const calculateTotalProgress = () => {
                const totalUploadedForFile = Array.from(partProgressMap.values()).reduce(
                    (a, b) => a + b,
                    0
                );
                onProgressUpdate(totalUploadedForFile / file.size);
            };

            const failOnce = (err) => {
                if (isRejected) return;
                isRejected = true;
                reject(err);
            };

            const runNext = async () => {
                if (isRejected) return;

                if (queue.length === 0 && activeParts === 0) {
                    try {
                        const sortedParts = [...parts].sort(
                            (a, b) => a.PartNumber - b.PartNumber
                        );

                        await completeMultipart({
                            uploadId,
                            key,
                            parts: sortedParts
                        }).unwrap();

                        resolve({
                            fileName: file.name,
                            key,
                            size: file.size
                        });
                        return;
                    } catch (err) {
                        failOnce(err);
                        return;
                    }
                }

                while (
                    queue.length > 0 &&
                    activeParts < activeConcurrencyLimit &&
                    !isRejected
                ) {
                    const partNumber = queue.shift();
                    activeParts++;

                    uploadFilePart(
                        file,
                        uploadId,
                        key,
                        partNumber,
                        activeChunkSize,
                        (bytesUploaded) => {
                            partProgressMap.set(partNumber, bytesUploaded);
                            calculateTotalProgress();
                        }
                    )
                        .then((partResult) => {
                            if (isRejected) return;

                            parts.push(partResult);
                            activeParts--;

                            const partSize = Math.min(
                                activeChunkSize,
                                file.size - (partNumber - 1) * activeChunkSize
                            );

                            partProgressMap.set(partNumber, partSize);
                            calculateTotalProgress();
                            runNext();
                        })
                        .catch((err) => {
                            activeParts--;
                            failOnce(err);
                        });
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
        setUploadedBytes(0);

        try {
            const {
                chunkSize: activeChunkSize,
                concurrencyLimit: activeConcurrencyLimit
            } = await measureUploadSpeed();

            // Flatten files
            const allFiles = [];
            uploadedFiles.forEach((item) => {
                if (item._isFolder) {
                    allFiles.push(...item.files);
                } else {
                    allFiles.push(item);
                }
            });

            const totalBytes = allFiles.reduce((acc, f) => acc + f.size, 0);
            const uploadedBytesMap = new Map();
            const startTime = performance.now();
            const completedFiles = [];

            // Upload files sequentially to avoid massive real concurrency
            for (const file of allFiles) {
                const result = await processFile(
                    file,
                    (partPercentage) => {
                        const fileId = `${file.name}-${file.size}-${file.lastModified}`;
                        const fileUploadedBytes = partPercentage * file.size;

                        uploadedBytesMap.set(fileId, fileUploadedBytes);

                        const totalUploaded = Array.from(uploadedBytesMap.values()).reduce(
                            (a, b) => a + b,
                            0
                        );

                        setUploadedBytes(totalUploaded);
                        setUploadProgress(
                            Math.round((totalUploaded / totalBytes) * 100)
                        );

                        const durationInSeconds =
                            (performance.now() - startTime) / 1000;

                        if (durationInSeconds > 0) {
                            setUploadSpeed(totalUploaded / durationInSeconds);
                        }
                    },
                    activeChunkSize,
                    activeConcurrencyLimit
                );

                completedFiles.push(result);
            }

            const finalizeResponse = await finalizeTransfer({
                body: {
                    senderEmail,
                    recevierEmails: recipients,
                    files: completedFiles.map((f) => ({
                        name: f.fileName,
                        key: f.key,
                        size: f.size
                    })),
                    totalSize: totalBytes,
                    expireIn: expiresIn === 'never' ? 'never' : `${expiresIn}d`,
                    password: password || undefined,
                    selfDestruct,
                    downloadable:
                        transferType === 'video' ? isDownloadAble : false,
                    type: transferType === 'video' ? 'Video' : 'File'
                },
                params: {
                    getShareableLink: selectedMethod === 'link',
                    selfDestruct,
                    isDownloadAble:
                        transferType === 'video' ? isDownloadAble : false
                }
            }).unwrap();

            if (finalizeResponse.shortId) {
                setNewTransferId(finalizeResponse.shortId);
            }

            if (selectedMethod === 'link' && finalizeResponse.shareLink) {
                setGeneratedLink(finalizeResponse.shareLink);
            } else {
                alert('Transfer successful!');
                setUploadedFiles([]);
                setRecipients([]);
                setMessage('');
            }
        } catch (err) {
            console.error('Transfer error:', err);
            alert(
                'Transfer failed: ' +
                    (err.data?.message || err.message || 'Unknown error')
            );
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
        totalBytes: uploadedFiles.reduce(
            (acc, item) =>
                acc +
                (item._isFolder
                    ? item.files.reduce((a, b) => a + b.size, 0)
                    : item.size),
            0
        ),
        generatedLink,
        newTransferId,
        setGeneratedLink,
        handleTransfer,
        chunkSize,
        concurrencyLimit
    };
};