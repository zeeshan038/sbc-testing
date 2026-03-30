import { useRef, useState } from 'react';
import { streamDownloadToDisk } from '../../../shared/utils/streamDownloadToDisk';
import { 
  useStartDownloadSessionMutation, 
  useCompleteDownloadSessionMutation, 
  useCancelDownloadSessionMutation 
} from '../api/downloadApi';

export function useStreamDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedBytes, setDownloadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [downloadError, setDownloadError] = useState(null);

  const [startSession] = useStartDownloadSessionMutation();
  const [completeSession] = useCompleteDownloadSessionMutation();
  const [cancelSession] = useCancelDownloadSessionMutation();

  const abortRef = useRef(null);
  const sessionInfoRef = useRef(null);

  const startDownload = async ({ url, fileName, transferId, downloadSessionId }) => {
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadedBytes(0);
    setTotalBytes(0);
    setDownloadSpeed(0);
    setDownloadError(null);
    
    sessionInfoRef.current = { id: transferId, downloadSessionId };

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await startSession({ id: transferId, downloadSessionId }).unwrap();

      const result = await streamDownloadToDisk({
        url,
        fileName,
        signal: controller.signal,
        onProgress: ({
          downloadedBytes,
          totalBytes,
          progress,
          speedBytesPerSecond
        }) => {
          setDownloadedBytes(downloadedBytes);
          setTotalBytes(totalBytes);
          setDownloadProgress(Math.round(progress * 100));
          setDownloadSpeed(speedBytesPerSecond);
        }
      });

      await completeSession({ id: transferId, downloadSessionId }).unwrap();

      return result;
    } catch (error) {
      if (error.name === 'AbortError') {
        await cancelSession({ id: transferId, downloadSessionId }).unwrap();
      } else {
        setDownloadError(error.message || 'Download failed');
        try {
          await cancelSession({ id: transferId, downloadSessionId }).unwrap();
        } catch (_) {}
      }
      throw error;
    } finally {
      setIsDownloading(false);
      abortRef.current = null;
      sessionInfoRef.current = null;
    }
  };

  const cancelDownload = async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
  };

  return {
    isDownloading,
    downloadProgress,
    downloadedBytes,
    totalBytes,
    downloadSpeed,
    downloadError,
    startDownload,
    cancelDownload
  };
}
