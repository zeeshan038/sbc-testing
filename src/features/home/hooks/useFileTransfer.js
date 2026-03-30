import { useState, useRef } from 'react';
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

    // Use refs for values that change rapidly to avoid unnecessary React work
    const uploadedBytesRef = useRef(0);
    const startTimeRef = useRef(0);
    const lastUpdateRef = useRef(0);
    const speedSamplesRef = useRef([]);

    const isMobile =
        typeof window !== 'undefined' ? window.innerWidth < 640 : false;

    const [chunkSize, setChunkSize] = useState(
        isMobile ? 5 * 1024 * 1024 : 20 * 1024 * 1024
    );
    const [concurrencyLimit, setConcurrencyLimit] = useState(
        isMobile ? 2 : 6
    );

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const measureUploadSpeed = async () => {
        try {
            const testSize = 512 * 1024;
            const testData = new Uint8Array(testSize);
            const startTime = performance.now();

            await speedTest({
                body: testData.buffer,
                headers: { 'Content-Type': 'application/octet-stream' }
            }).unwrap();

            const duration = (performance.now() - startTime) / 1000;
            const speedBps = testSize / duration;

            // If Cloudflare multipart follows S3-compatible minimum part size
            const MIN_CHUNK = 5 * 1024 * 1024;
            const MAX_CHUNK = isMobile ? 8 * 1024 * 1024 : 20 * 1024 * 1024;

            // Your rule: speed / 5
            const calculatedChunk = speedBps / 5;

            const nextChunkSize = Math.round(
                clamp(calculatedChunk, MIN_CHUNK, MAX_CHUNK)
            );

            let nextLimit;
            if (speedBps < 2 * 1024 * 1024) nextLimit = 2;
            else if (speedBps < 5 * 1024 * 1024) nextLimit = 3;
            else if (speedBps < 10 * 1024 * 1024) nextLimit = 4;
            else nextLimit = isMobile ? 4 : 5;

            setChunkSize(nextChunkSize);
            setConcurrencyLimit(nextLimit);

            return {
                speedBps,
                chunkSize: nextChunkSize,
                concurrencyLimit: nextLimit
            };
        } catch {
            const fallback = {
                speedBps: null,
                chunkSize: 5 * 1024 * 1024,
                concurrencyLimit: isMobile ? 2 : 4
            };

            setChunkSize(fallback.chunkSize);
            setConcurrencyLimit(fallback.concurrencyLimit);
            return fallback;
        }
    };;

    const uploadFilePart = async (
        file,
        uploadId,
        key,
        partNumber,
        activeChunkSize,
        onProgressDelta,
        retryCount = 0
    ) => {
        const start = (partNumber - 1) * activeChunkSize;
        const end = Math.min(start + activeChunkSize, file.size);
        const chunk = file.slice(start, end);

        const { url } = await getPartUrl({ uploadId, key, partNumber }).unwrap();

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            let lastLoaded = 0;
            let committedBytes = 0;

            xhr.upload.addEventListener('progress', (event) => {
                if (!event.lengthComputable) return;

                const delta = event.loaded - lastLoaded;
                lastLoaded = event.loaded;

                committedBytes += delta;
                onProgressDelta(delta);
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
                    // rollback bytes counted for this failed attempt
                    if (committedBytes > 0) onProgressDelta(-committedBytes);

                    if (retryCount < 3) {
                        resolve(
                            uploadFilePart(
                                file,
                                uploadId,
                                key,
                                partNumber,
                                activeChunkSize,
                                onProgressDelta,
                                retryCount + 1
                            )
                        );
                    } else {
                        reject(new Error(`Status ${xhr.status}`));
                    }
                }
            };

            xhr.onerror = () => {
                if (committedBytes > 0) onProgressDelta(-committedBytes);

                if (retryCount < 3) {
                    resolve(
                        uploadFilePart(
                            file,
                            uploadId,
                            key,
                            partNumber,
                            activeChunkSize,
                            onProgressDelta,
                            retryCount + 1
                        )
                    );
                } else {
                    reject(new Error('Network error'));
                }
            };

            xhr.open('PUT', url);
            xhr.send(chunk);
        });
    };

    /**
     * Process a single file: Multipart initiation + concurrent part uploads.
     */
    const processFile = async (file, onProgressDelta, activeChunkSize, activeConcurrencyLimit) => {
        const { uploadId, key } = await initiateMultipart({
            fileName: file.name,
            fileType: file.type
        }).unwrap();

        const totalParts = Math.ceil(file.size / activeChunkSize);
        const parts = [];
        const queue = Array.from({ length: totalParts }, (_, i) => i + 1);
        let activeParts = 0;
        let isRejected = false;

        return new Promise((resolve, reject) => {
            const failOnce = (err) => {
                if (isRejected) return;
                isRejected = true;
                reject(err);
            };

            const runNext = async () => {
                if (isRejected) return;

                if (queue.length === 0 && activeParts === 0) {
                    try {
                        const sortedParts = [...parts].sort((a, b) => a.PartNumber - b.PartNumber);
                        await completeMultipart({ uploadId, key, parts: sortedParts }).unwrap();
                        resolve({ fileName: file.name, key, size: file.size });
                        return;
                    } catch (err) { failOnce(err); return; }
                }

                while (queue.length > 0 && activeParts < activeConcurrencyLimit && !isRejected) {
                    const partNumber = queue.shift();
                    activeParts++;

                    uploadFilePart(file, uploadId, key, partNumber, activeChunkSize, onProgressDelta)
                        .then((result) => {
                            if (isRejected) return;
                            parts.push(result);
                            activeParts--;
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

    /**
     * Limited parallel worker: Process items with a concurrency limit.
     */
    const runLimitedParallel = async (items, limit, worker) => {
        const results = new Array(items.length);
        let nextIndex = 0;
        const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
            while (true) {
                const i = nextIndex++;
                if (i >= items.length) return;
                results[i] = await worker(items[i], i);
            }
        });
        await Promise.all(runners);
        return results;
    };

    /**
     * Handle the entire transfer: Optimization of progress updates and state.
     */
    const handleTransfer = async () => {
        if (!uploadedFiles.length) return alert('Please add files first');

        setIsUploading(true);
        setUploadProgress(0);
        setUploadSpeed(0);
        setUploadedBytes(0);

        // Reset refs
        uploadedBytesRef.current = 0;
        startTimeRef.current = performance.now();
        lastUpdateRef.current = 0;
        speedSamplesRef.current = [];

        try {
            const adaptive = await measureUploadSpeed();
            const activeChunkSize = adaptive.chunkSize;
            const activeConcurrencyLimit = adaptive.concurrencyLimit;
            const allFiles = [];
            uploadedFiles.forEach(item => item._isFolder ? allFiles.push(...item.files) : allFiles.push(item));
            const totalBytes = allFiles.reduce((acc, f) => acc + f.size, 0);

            const throttleProgressUpdate = (delta) => {
                uploadedBytesRef.current += delta;
                const now = performance.now();

                if (now - lastUpdateRef.current > 150 || uploadedBytesRef.current === totalBytes) {
                    lastUpdateRef.current = now;
                    const totalUploaded = uploadedBytesRef.current;

                    setUploadedBytes(totalUploaded);
                    setUploadProgress(Math.round((totalUploaded / totalBytes) * 100));

                    // Moving window speed (last 3 seconds)
                    const samples = speedSamplesRef.current;
                    samples.push({ time: now, bytes: totalUploaded });
                    while (samples.length > 2 && now - samples[0].time > 3000) samples.shift();

                    if (samples.length >= 2) {
                        const first = samples[0];
                        const last = samples[samples.length - 1];
                        const dt = (last.time - first.time) / 1000;
                        if (dt > 0) setUploadSpeed((last.bytes - first.bytes) / dt);
                    } else {
                        const dt = (now - startTimeRef.current) / 1000;
                        if (dt > 0) setUploadSpeed(totalUploaded / dt);
                    }
                }
            };

            const fileConcurrency = isMobile ? 1 : 2;
            const completedFiles = await runLimitedParallel(allFiles, fileConcurrency, async (file) => {
                return processFile(file, throttleProgressUpdate, activeChunkSize, activeConcurrencyLimit);
            });

            // Final push to ensure UI hits 100%
            setUploadedBytes(totalBytes);
            setUploadProgress(100);

            const finalizeResponse = await finalizeTransfer({
                body: {
                    senderEmail,
                    recevierEmails: recipients,
                    files: completedFiles.map(f => ({ name: f.fileName, key: f.key, size: f.size })),
                    totalSize: totalBytes,
                    expireIn: expiresIn === 'never' ? 'never' : `${expiresIn}d`,
                    password: password || undefined,
                    selfDestruct,
                    downloadable: transferType === 'video' ? isDownloadAble : false,
                    type: transferType === 'video' ? 'Video' : 'File'
                },
                params: {
                    getShareableLink: selectedMethod === 'link',
                    selfDestruct,
                    isDownloadAble: transferType === 'video' ? isDownloadAble : false
                }
            }).unwrap();

            if (finalizeResponse.shortId) setNewTransferId(finalizeResponse.shortId);
            if (selectedMethod === 'link' && finalizeResponse.shareLink) setGeneratedLink(finalizeResponse.shareLink);
            else { alert('Transfer successful!'); setUploadedFiles([]); setRecipients([]); setMessage(''); }

        } catch (err) {
            console.error('Transfer error:', err);
            const details = err?.data?.message || err?.data?.error || err?.message || 'Unknown error';
            alert('Transfer failed: ' + details);
        } finally {
            setIsUploading(false);
        }
    };

    return {
        isUploading,
        uploadProgress,
        uploadSpeed,
        uploadedBytes,
        totalBytes: uploadedFiles.reduce((acc, item) => acc + (item._isFolder ? item.files.reduce((a, b) => a + b.size, 0) : item.size), 0),
        generatedLink,
        newTransferId,
        setGeneratedLink,
        handleTransfer,
        chunkSize,
        concurrencyLimit
    };
};