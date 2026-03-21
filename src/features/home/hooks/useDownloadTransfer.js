import { useState, useRef, useCallback } from 'react';
import { downloadToDisk } from '../../../shared/services/downloadToDisk';
import { downloadToDiskMultipart } from '../../../shared/services/downloadToDiskMultipart';
import { 
  useStartDownloadSessionMutation, 
  useCompleteDownloadSessionMutation, 
  useCancelDownloadSessionMutation,
  useDownloadPartMutation
} from '../api/downloadApi';

/**
 * useDownloadTransfer Hook
 * Manages multiple simultaneous streamed downloads with session tracking.
 */
export function useDownloadTransfer() {
    const [downloads, setDownloads] = useState({});
    const controllersRef = useRef({});
    
    // API Mutations
    const [startSession] = useStartDownloadSessionMutation();
    const [completeSession] = useCompleteDownloadSessionMutation();
    const [cancelSession] = useCancelDownloadSessionMutation();
    const [downloadPart] = useDownloadPartMutation();

    const updateDownloadState = useCallback((fileId, newState) => {
        setDownloads(prev => ({
            ...prev,
            [fileId]: {
                ...prev[fileId],
                ...newState
            }
        }));
    }, []);

    const startDownload = async ({ file, transferId, downloadSessionId, password }) => {
        const fileId = file.objectKey || file.key || Math.random().toString(36).substr(2, 9);
        
        // 1. Create local download state row
        setDownloads(prev => ({
            ...prev,
            [fileId]: {
                fileName: file.fileName || file.name,
                totalBytes: file.size || 0,
                downloadedBytes: 0,
                progress: 0,
                speed: 0,
                etaSeconds: 0,
                status: 'preparing',
                error: null
            }
        }));

        const controller = new AbortController();
        controllersRef.current[fileId] = controller;

        try {
            // 2. Notify backend: download-start
            updateDownloadState(fileId, { status: 'preparing' });
            await startSession({ id: transferId, downloadSessionId }).unwrap();

            // 3. Start download (Multipart for large files, otherwise single-stream)
            const isLargeFile = (file.size || 0) > 5242880; // 5MB
            let result;

            const progressHandler = ({ downloadedBytes, totalBytes, progress, speedBytesPerSecond }) => {
                const etaSeconds = speedBytesPerSecond > 0 ? (totalBytes - downloadedBytes) / speedBytesPerSecond : 0;
                
                updateDownloadState(fileId, {
                    downloadedBytes,
                    progress, // Already 0-100
                    speed: speedBytesPerSecond,
                    etaSeconds,
                    status: 'downloading'
                });
            };

            if (isLargeFile) {
                console.log(`useDownloadTransfer: Using multipart download for ${file.fileName || file.name}`);
                result = await downloadToDiskMultipart({
                    shortId: transferId,
                    file,
                    password,
                    signal: controller.signal,
                    downloadPart,
                    onProgress: progressHandler
                });
            } else {
                console.log(`useDownloadTransfer: Using standard download for ${file.fileName || file.name}`);
                result = await downloadToDisk({
                    url: file.url,
                    fileName: file.fileName || file.name,
                    signal: controller.signal,
                    onProgress: progressHandler
                });
            }

            // 4. Notify backend: complete
            if (result.method === 'streamed' || result.method === 'fallback' || result.method === 'multipart') {
                await completeSession({ id: transferId, downloadSessionId }).unwrap();
                updateDownloadState(fileId, { status: 'completed', progress: 100 });
            }

        } catch (error) {
            if (error.name === 'AbortError') {
                console.log(`Download for ${fileId} cancelled.`);
                updateDownloadState(fileId, { status: 'cancelled' });
                try {
                    await cancelSession({ id: transferId, downloadSessionId }).unwrap();
                } catch (_) {}
            } else {
                console.error(`Download error for ${fileId}:`, error);
                updateDownloadState(fileId, { status: 'failed', error: error.message });
                try {
                    await cancelSession({ id: transferId, downloadSessionId }).unwrap();
                } catch (_) {}
            }
        } finally {
            delete controllersRef.current[fileId];
        }
    };

    const cancelDownload = useCallback(async (fileId) => {
        if (controllersRef.current[fileId]) {
            controllersRef.current[fileId].abort();
        }
    }, []);

    const isSupported = !!window.showSaveFilePicker;

    return {
        downloads,
        startDownload,
        cancelDownload,
        isSupported
    };
}
