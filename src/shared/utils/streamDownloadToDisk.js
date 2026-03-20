export async function fallbackBrowserDownload(url) {
  const a = document.createElement('a');
  a.href = url;
  a.download = '';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function streamDownloadToDisk({
  url,
  fileName,
  onProgress,
  signal
}) {
  if (!window.showSaveFilePicker) {
    console.warn("streamDownloadToDisk: showSaveFilePicker NOT supported in this browser. Falling back to native download.");
    await fallbackBrowserDownload(url);
    return { success: true, method: 'fallback' };
  }

  console.log("streamDownloadToDisk: Starting streamed download for", fileName);

  const handle = await window.showSaveFilePicker({
    suggestedName: fileName,
    types: [
      {
        description: 'Download file',
        accept: {
          'application/octet-stream': ['.*']
        }
      }
    ]
  });

  const writable = await handle.createWritable();

  let response;
  try {
    response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Download failed with status ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Readable stream is not available on this response');
    }

    const contentLengthHeader = response.headers.get('Content-Length');
    const totalBytes = contentLengthHeader ? Number(contentLengthHeader) : 0;

    const reader = response.body.getReader();

    let downloadedBytes = 0;
    const startTime = performance.now();

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      await writable.write(value);

      downloadedBytes += value.byteLength;

      const elapsedSeconds = (performance.now() - startTime) / 1000;
      const speedBytesPerSecond =
        elapsedSeconds > 0 ? downloadedBytes / elapsedSeconds : 0;

      onProgress?.({
        downloadedBytes,
        totalBytes,
        progress: totalBytes > 0 ? downloadedBytes / totalBytes : 0,
        speedBytesPerSecond
      });
    }

    await writable.close();

    return {
      success: true,
      downloadedBytes,
      totalBytes,
      method: 'stream'
    };
  } catch (error) {
    try {
      await writable.abort();
    } catch (_) {}

    throw error;
  }
}
