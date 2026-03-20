import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { formatBytes, formatSpeed, formatETA } from '../../../shared/utils/formatTransfer';

/**
 * DownloadProgressCard Component
 * Renders a single active download row matching the requested screenshot.
 */
const DownloadProgressCard = ({ 
    fileId, 
    fileName, 
    totalBytes, 
    downloadedBytes, 
    progress, 
    speed, 
    etaSeconds, 
    status, 
    error,
    onCancel 
}) => {
    const isCompleted = status === 'completed';
    const isFailed = status === 'failed';
    const isCancelled = status === 'cancelled';
    const isDownloading = status === 'downloading' || status === 'preparing';

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white dark:bg-[#1a1a24] p-5 border-t border-gray-100 dark:border-white/5"
        >
            <div className="flex flex-col gap-3">
                {/* File Info Header */}
                <div className="flex items-center justify-between text-left">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[#1e2a6a] dark:text-gray-200 font-bold text-[15px] truncate max-w-[300px]">
                            {fileName}
                        </span>
                        <span className="text-gray-400 dark:text-zinc-500 text-[13px] font-medium shrink-0">
                            {formatBytes(totalBytes)}
                        </span>
                    </div>
                    {isCompleted && (
                        <div className="flex items-center gap-1.5 text-green-500">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-[12px] font-bold">Saved successfully</span>
                        </div>
                    )}
                    {isFailed && (
                        <div className="flex items-center gap-1.5 text-red-500" title={error}>
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-[12px] font-bold">Failed</span>
                        </div>
                    )}
                </div>

                {/* Progress Bar Area */}
                <div className="w-full space-y-2">
                    <div className="w-full h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                            className={`h-full ${isFailed ? 'bg-red-500' : isCompleted ? 'bg-green-500' : 'bg-[#3b82f6]'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    
                    <div className="flex items-center justify-between text-left">
                        <div className="flex flex-col">
                            <span className="text-gray-600 dark:text-zinc-400 text-[12px] font-medium">
                                {formatBytes(downloadedBytes)} received
                            </span>
                            {isDownloading && (
                                <div className="flex items-center gap-3 mt-1 text-[11px] font-bold text-gray-400">
                                    <span>{formatSpeed(speed)}</span>
                                    <span>{formatETA(etaSeconds)}</span>
                                </div>
                            )}
                        </div>

                        {isDownloading && (
                            <button
                                onClick={() => onCancel(fileId)}
                                className="px-5 py-2 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-lg text-[13px] font-bold transition-all active:scale-95 flex items-center gap-2"
                            >
                                Cancel
                            </button>
                        )}
                        
                        {isCancelled && (
                            <span className="text-gray-400 text-[12px] font-bold italic">Cancelled</span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DownloadProgressCard;
