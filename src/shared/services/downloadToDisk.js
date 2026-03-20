/**
 * Shared utility for direct-to-disk streaming downloads.
 * Uses File System Access API if available, otherwise falls back to native download.
 */

const fallbackBrowserDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export async function downloadToDisk({
    url,
    fileName,
    onProgress,
    signal
}) {
    const hasFileSystemAccess = !!window.showSaveFilePicker;
    let writable = null;
    let handle = null;
    let chunks = [];

    try {
        console.log(`downloadToDisk: Starting in-website download for ${fileName} (${hasFileSystemAccess ? 'streaming' : 'buffered'})`);
        
        // 1. If we have File System Access, ask for location early
        if (hasFileSystemAccess) {
            handle = await window.showSaveFilePicker({
                suggestedName: fileName,
            });
            writable = await handle.createWritable();
        }

        // 2. Start fetching the data
        const response = await fetch(url, { signal });
        if (!response.ok) throw new Error(`Fetch failed with status ${response.status}`);
        if (!response.body) throw new Error('Response body is null');

        const reader = response.body.getReader();
        const contentLength = +response.headers.get('Content-Length') || 0;
        let downloadedBytes = 0;
        const startTime = performance.now();

        // 3. Process the stream
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            downloadedBytes += value.byteLength;

            // Handle writing or buffering
            if (writable) {
                await writable.write(value);
            } else {
                chunks.push(value);
            }

            // Update UI Progress
            if (onProgress) {
                const elapsed = (performance.now() - startTime) / 1000;
                const speed = elapsed > 0 ? downloadedBytes / elapsed : 0;
                const progress = contentLength ? downloadedBytes / contentLength : 0;

                onProgress({
                    downloadedBytes,
                    totalBytes: contentLength,
                    progress: progress * 100, // Normalized to 0-100
                    speedBytesPerSecond: speed
                });
            }
        }

        // 4. Finalize
        if (writable) {
            await writable.close();
        } else {
            // Browsers like Firefox/Safari: provide the file now
            const blob = new Blob(chunks);
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
            chunks = []; // Clear memory
        }

        return { success: true, method: hasFileSystemAccess ? 'streamed' : 'buffered' };

    } catch (error) {
        if (writable) {
            try { await writable.abort(); } catch (_) {}
        }
        
        if (error.name === 'AbortError') {
            console.log("downloadToDisk: Download cancelled.");
            throw error;
        }
        
        console.error("downloadToDisk: Error during download:", error);
        throw error;
    }
}
