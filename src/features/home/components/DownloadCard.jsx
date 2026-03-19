import  { useState } from 'react';
import { motion } from 'framer-motion';
import { DownloadCloud, Flag, Loader2, ChevronDown } from 'lucide-react';

const DownloadCard = ({ transferData, isFetchingTransfer, onPreview, onDownload, isDownloadAble: isDownloadAbleProp, downloadable }) => {
    console.log("Downloadable............" , isDownloadAbleProp)
    const [isDownloading, setIsDownloading] = useState(false);
    const [showQualities, setShowQualities] = useState(false);

    if (isFetchingTransfer) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-sm font-medium text-gray-500">Retrieving transfer details...</p>
            </div>
        );
    }

    if (!transferData) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-[28px] flex items-center justify-center mb-6 shadow-sm border border-red-100 dark:border-red-900/30">
                    <Flag className="w-10 h-10" />
                </div>
                <h3 className="text-[20px] font-bold text-[#1e2a6a] dark:text-gray-100 mb-2">Transfer not found</h3>
                <p className="text-[14px] text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">
                    This link may have expired,<br /> been deleted, or is invalid.
                </p>
                <div className="mt-8 w-full">
                   <button 
                    onClick={() => window.location.href = '/'}
                    className="w-full py-2.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-xl font-bold text-[13px] hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                   >
                     Go to Homepage
                   </button>
                </div>
            </div>
        );
    }

    const { files = [], transferDetails = {} } = transferData || {};
    // Fallback if data is not nested as expected
    const finalFiles = files.length > 0 ? files : (transferDetails.files || []);
    const finalTransferDetails = transferDetails.shortId ? transferDetails : (transferData.transferDetails || {});
    
    // Helper to check for true boolean or "true" string
    const isTrue = (val) => val === true || val === 'true';

    // Final check for isDownloadAble combining prop, nested data and query
    // Checking all case variations since the backend field might be named differently
    const isRestricted = isTrue(isDownloadAbleProp) || 
                        isTrue(downloadable) ||
                        isTrue(finalTransferDetails.isDownloadAble) || 
                        isTrue(finalTransferDetails.downloadable) || 
                        isTrue(finalTransferDetails.isDownloadable) || 
                        isTrue(transferData.isDownloadAble) || 
                        isTrue(transferData.downloadable) ||
                        isTrue(transferData.isDownloadable);

    const { totalSize, expireIn } = finalTransferDetails;
    
    // Display "Expires in [time]" instead of a full date if it's a duration like "7d"
    const expiryText = expireIn ? `Expires in ${expireIn}` : 'No expiry set';

    const formatBytes = (bytes) => {
        if (!bytes) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    };

    const handleDownloadClick = async (key) => {
        if (isRestricted) return;
        setIsDownloading(true);
        await onDownload(key);
        setIsDownloading(false);
    };

    const singleVideo = finalFiles.length === 1 && finalFiles[0].qualities?.length > 0 ? finalFiles[0] : null;

    return (
        <div className="flex flex-col min-h-0 h-full">
            {/* Header / Icon Section */}
            <div className="flex flex-col items-center justify-center pt-10 pb-6 px-6 shrink-0">
                <div className="relative mb-6">
                    {/* Shadow/Glow behind icon */}
                    <div className="absolute inset-x-0 bottom-0 top-1/2 bg-blue-100/30 rounded-full blur-2xl transform scale-150 opacity-40" />
                    <div className="relative">
                        <svg width="110" height="85" viewBox="0 0 110 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Cloud Shape */}
                            <path d="M78.5 70C91.4787 70 102 59.4787 102 46.5C102 34.1951 92.548 24.103 80.48 22.756C77.42 8.65 64.91 0 50 0C37.89 0 27.42 5.75 20.8 14.54C10.1 16.51 2 25.84 2 37.12C2 49.76 12.24 60 24.88 60" stroke="#2b3a8c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                            {/* Down Arrow */}
                            <path d="M52 35V75M52 75L38 61M52 75L66 61" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>

                <h2 className="text-[20px] font-bold text-[#1e2a6a] dark:text-gray-100 mb-1">Your download is ready</h2>
                <p className="text-[14px] text-gray-500 font-medium">{expiryText}</p>
            </div>

            {/* Spacer to push content down */}
            <div className="flex-1" />

            {/* Transfer Info Section - Bottom aligned */}
            <div className="bg-gray-50/80 dark:bg-zinc-800/80 mx-4 p-4 rounded-xl border border-gray-100 dark:border-zinc-700/50 mb-4 flex items-center justify-between shadow-sm">
                <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-gray-700 dark:text-zinc-300">{finalFiles.length} {finalFiles.length === 1 ? 'File' : 'Files'}</span>
                    <span className="text-[11px] text-gray-500 font-medium">{formatBytes(totalSize)} Total size</span>
                </div>
                <button 
                    onClick={onPreview}
                    className="text-[14px] font-bold text-[#2b3a8c] hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                    Preview files
                </button>
            </div>

            {/* Footer / Buttons Section */}
            <div className="px-5 pb-6 pt-1 flex items-center gap-3 shrink-0 relative">
                <button className="w-12 h-12 flex items-center justify-center bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all shadow-sm">
                    <Flag className="w-5 h-5" />
                </button>

                {singleVideo && !isRestricted ? (
                    <div className="flex-1 relative">
                        <button 
                            onClick={() => setShowQualities(!showQualities)}
                            disabled={isDownloading}
                            className="w-full h-12 bg-[#2b3a8c] hover:bg-[#1a235a] text-white rounded-[24px] font-bold text-[15px] shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isDownloading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Starting...
                                </>
                            ) : (
                                <>
                                    Download Quality
                                    <ChevronDown className="w-5 h-5 ml-1" />
                                </>
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {showQualities && (
                            <>
                                {/* Backdrop for closing when clicking outside */}
                                <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setShowQualities(false)} 
                                />
                                <div className="absolute bottom-full left-0 right-0 mb-3 bg-white dark:bg-zinc-800 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-black/50 border border-gray-100 dark:border-zinc-700 py-2 z-50 overflow-hidden transform-gpu">
                                    <div className="px-3 pb-2 mb-2 border-b border-gray-100 dark:border-zinc-700">
                                        <p className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 px-2 uppercase tracking-wider">Select Download Quality</p>
                                    </div>
                                    <div className="max-h-56 overflow-y-auto no-scrollbar">
                                        {[...singleVideo.qualities].sort((a, b) => b.isOriginal ? 1 : a.isOriginal ? -1 : 0).map((q, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setShowQualities(false);
                                                    handleDownloadClick(q.key);
                                                }}
                                                className="w-full text-left px-5 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 text-[13px] font-bold text-gray-700 dark:text-zinc-300 transition-colors flex items-center justify-between group"
                                            >
                                                <span>{q.label} {q.isOriginal && <span className="text-[10px] text-gray-400 ml-1 font-medium">(Original)</span>}</span>
                                                <DownloadCloud className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <button 
                        onClick={handleDownloadClick}
                        disabled={isDownloading || isRestricted}
                        className="flex-1 h-12 bg-[#2b3a8c] hover:bg-[#1a235a] text-white rounded-[24px] font-bold text-[15px] shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isDownloading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Starting...
                            </>
                        ) : (
                            isRestricted ? 'Download restricted' : (finalFiles.length > 1 ? 'Download all' : 'Download')
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default DownloadCard;
