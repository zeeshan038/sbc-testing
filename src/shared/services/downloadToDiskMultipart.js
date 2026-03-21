/**
 * Multipart download utility to fetch files in parallel chunks.
 */
export async function downloadToDiskMultipart({
    shortId,
    file,
    password,
    onProgress,
    signal,
    downloadPart // This is the mutation trigger function
}) {
    const PART_SIZE = 5242880; // 5MB
    const totalSize = file.size || 0;
    const fileName = file.fileName || file.name || 'download';
    
    if (totalSize === 0) {
        throw new Error("File size is 0 or unknown.");
    }

    const numParts = Math.ceil(totalSize / PART_SIZE);
    const chunks = new Array(numParts);
    let downloadedBytes = 0;
    const startTime = performance.now();

    const fetchPart = async (partIdx) => {
        if (signal?.aborted) return;

        const start = partIdx * PART_SIZE;
        const end = Math.min(start + PART_SIZE, totalSize);
        const actualPartSize = end - start;

        // 1. Get signed URL for this part from the backend
        const response = await downloadPart({
            id: shortId,
            key: file.objectKey || file.key || file.fileKey,
            partNumber: partIdx + 1,
            partSize: actualPartSize,
            password
        }).unwrap();

        if (!response.status || !response.url) {
            throw new Error(`Failed to get URL for part ${partIdx + 1}`);
        }

        // 2. Fetch the actual data from the signed URL
        const fetchOptions = { signal };
        if (response.range) {
            fetchOptions.headers = {
                'Range': `bytes=${response.range.start}-${response.range.end}`
            };
        }

        const partResponse = await fetch(response.url, fetchOptions);
        if (!partResponse.ok) {
            throw new Error(`Failed to fetch part ${partIdx + 1} from storage`);
        }

        const partBlob = await partResponse.blob();
        chunks[partIdx] = partBlob;
        downloadedBytes += partBlob.size;

        // 3. Update progress
        if (onProgress) {
            const elapsed = (performance.now() - startTime) / 1000;
            const speed = elapsed > 0 ? downloadedBytes / elapsed : 0;
            onProgress({
                downloadedBytes,
                totalBytes: totalSize,
                progress: (downloadedBytes / totalSize) * 100,
                speedBytesPerSecond: speed
            });
        }
    };

    // Parallel fetching with limit (3-5 simultaneous requests)
    const CONCURRENCY_LIMIT = 3;
    const queue = Array.from({ length: numParts }, (_, i) => i);
    
    const worker = async () => {
        while (queue.length > 0 && !signal?.aborted) {
            const partIdx = queue.shift();
            try {
                await fetchPart(partIdx);
            } catch (err) {
                if (err.name === 'AbortError') throw err;
                throw err;
            }
        }
    };

    // Start workers
    const workers = Array.from(
        { length: Math.min(CONCURRENCY_LIMIT, numParts) }, 
        () => worker()
    );

    await Promise.all(workers);

    if (signal?.aborted) {
        const abortErr = new Error('Download aborted');
        abortErr.name = 'AbortError';
        throw abortErr;
    }

    // 4. Assemble and Save
    const finalBlob = new Blob(chunks, { type: file.contentType || 'application/octet-stream' });
    const blobUrl = URL.createObjectURL(finalBlob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

    return { success: true, method: 'multipart' };
}
