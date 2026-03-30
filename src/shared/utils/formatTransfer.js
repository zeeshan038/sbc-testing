/**
 * Formats bytes to human readable string
 */
export const formatBytes = (bytes) => {
    const val = Number(bytes);
    if (isNaN(val) || val <= 0) return '0 B';
    if (val < 1024) return val + ' B';
    if (val < 1024 * 1024) return (val / 1024).toFixed(1) + ' KB';
    if (val < 1024 * 1024 * 1024) return (val / (1024 * 1024)).toFixed(1) + ' MB';
    return (val / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};

/**
 * Formats speed in bytes/sec to human readable bit-rate (Mbps/Kbps)
 */
export const formatSpeed = (bytesPerSecond) => {
    if (!bytesPerSecond || bytesPerSecond <= 0) return '0 Kbps';
    
    // Convert Bytes/s to bits/s
    const bps = bytesPerSecond * 8;
    
    if (bps < 1000) return `${bps.toFixed(0)} bps`;
    
    const kbps = bps / 1000; // Using 1000 for networking standards
    if (kbps < 1000) return `${kbps.toFixed(0)} Kbps`;
    
    const mbps = kbps / 1000;
    return `${mbps.toFixed(1)} Mbps`;
};

/**
 * Formats seconds to estimated time remaining
 */
export const formatETA = (seconds) => {
    if (!seconds || seconds <= 0 || seconds === Infinity) return 'Calculating...';
    
    if (seconds < 60) return `± ${Math.ceil(seconds)} second(s) remaining`;
    
    const minutes = Math.ceil(seconds / 60);
    if (minutes < 60) return `± ${minutes} minute(s) remaining`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `± ${hours}h ${remainingMinutes}m remaining`;
};
