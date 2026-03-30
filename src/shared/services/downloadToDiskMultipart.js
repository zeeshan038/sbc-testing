/**
 * High-Performance Multipart download utility.
 * Uses a "Sign-Ahead" URL pump and 10 parallel workers to saturate bandwidth.
 */
export async function downloadToDiskMultipart({
    shortId,
    file,
    password,
    onProgress,
    signal,
    downloadPart
}) {
    const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB Chunks
    const totalSize = file.size || 0;
    const fileName = file.fileName || file.name || 'download';
    const numChunks = Math.ceil(totalSize / CHUNK_SIZE);
    
    // 1. Initialize State
    const chunks = new Array(numChunks);
    let downloadedBytes = 0;
    
    // Performance Tracking (8s rolling window)
    const samples = [];
    const WINDOW_MS = 8000;

    /**
     * Lookahead URL Pump: Pre-signs URLs so workers are never idle.
     */
    const createUrlPump = (concurrency) => {
        const URL_AHEAD = Math.min(numChunks, concurrency + 4);
        const resolvers = Array.from({ length: numChunks }, () => {
            let resolve, reject;
            const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
            return { promise, resolve, reject };
        });

        let pumpIdx = 0;
        let pumpActiveCount = 0;

        const pump = () => {
            while (pumpActiveCount < URL_AHEAD && pumpIdx < numChunks) {
                const idx = pumpIdx++;
                const partNumber = idx + 1;
                const start = idx * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, totalSize);

                pumpActiveCount++;
                downloadPart({
                    id: shortId,
                    key: file.objectKey || file.key || file.fileKey,
                    partNumber,
                    partSize: end - start,
                    password
                }).unwrap()
                  .then(res => resolvers[idx].resolve(res))
                  .catch(err => resolvers[idx].reject(err))
                  .finally(() => {
                      pumpActiveCount--;
                      pump();
                  });
            }
        };

        const refreshUrl = (idx) => {
            let res, rej;
            const p = new Promise((r, j) => { res = r; rej = j; });
            resolvers[idx] = { promise: p, resolve: res, reject: rej };
            pumpActiveCount++;
            const partNumber = idx + 1;
            const start = idx * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, totalSize);
            downloadPart({
                id: shortId,
                key: file.objectKey || file.key || file.fileKey,
                partNumber,
                partSize: end - start,
                password
            }).unwrap()
              .then(res => res)
              .then(res => res(res.url))
              .catch(rej)
              .finally(() => { pumpActiveCount--; pump(); });
        };

        pump(); // Start Immediately
        return { resolvers, pump, refreshUrl };
    };

    const CONCURRENCY = 10;
    const { resolvers, pump, refreshUrl } = createUrlPump(CONCURRENCY);

    // 2. Fetcher Worker
    const fetchChunk = async (idx, retryCount = 0) => {
        if (signal?.aborted) return;

        try {
            const { url, range } = await resolvers[idx].promise;
            pump(); // Refill pump

            const fetchOptions = { signal };
            if (range) {
                fetchOptions.headers = { 'Range': `bytes=${range.start}-${range.end}` };
            }

            const response = await fetch(url, fetchOptions);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const blob = await response.blob();
            chunks[idx] = blob;
            downloadedBytes += blob.size;

            // Update smoothed speed
            const now = performance.now();
            samples.push({ time: now, bytes: downloadedBytes });
            while (samples.length > 0 && now - samples[0].time > WINDOW_MS) samples.shift();
            
            const first = samples[0];
            const last = samples[samples.length - 1];
            const dt = (last.time - first.time) / 1000;
            const smoothedSpeed = dt > 0 ? (last.bytes - first.bytes) / dt : 0;

            if (onProgress) {
                onProgress({
                    downloadedBytes,
                    totalBytes: totalSize,
                    progress: (downloadedBytes / totalSize) * 100,
                    speedBytesPerSecond: Math.round(smoothedSpeed)
                });
            }
        } catch (err) {
            if (err.name === 'AbortError') throw err;
            if (retryCount < 3) {
                console.warn(`Retry chunk ${idx}, attempt ${retryCount + 1}`);
                return fetchChunk(idx, retryCount + 1);
            }
            throw err;
        }
    };

    // 3. Worker Pool Management
    const queue = Array.from({ length: numChunks }, (_, i) => i);
    const worker = async (staggerMs = 0) => {
        if (staggerMs > 0) await new Promise(r => setTimeout(r, staggerMs));
        while (queue.length > 0 && !signal?.aborted) {
            const idx = queue.shift();
            await fetchChunk(idx);
        }
    };

    const workers = Array.from({ length: Math.min(CONCURRENCY, numChunks) }, (_, i) => worker(i * 30));
    await Promise.all(workers);

    if (signal?.aborted) throw new Error("Download aborted");

    // 4. Assemble and Save
    const finalBlob = new Blob(chunks, { type: file.contentType || 'application/octet-stream' });
    const blobUrl = URL.createObjectURL(finalBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

    return { success: true };
}
