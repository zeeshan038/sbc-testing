import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatBytes, formatSpeed, formatETA } from '../../../shared/utils/formatTransfer';

/**
 * DownloadingOverlay Component
 * Renders a circular progress overlay matching the provided reference image.
 */
const DownloadingOverlay = ({ 
    isOpen, 
    progress = 0, 
    downloadedBytes = 0, 
    totalBytes = 0, 
    speed = 0, 
    etaSeconds = 0,
    onCancel
}) => {
    // SVG Circle properties
    const radius = 74;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    // Anchor overlay to the uploader panel (parent is `relative` in `Home`)
                    className="absolute inset-0 z-[300] flex items-start justify-center bg-black/55 backdrop-blur-md p-4 sm:p-5"
                >
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#12141c] w-full max-w-[320px] rounded-[28px] p-5 sm:p-6 flex flex-col items-center text-center shadow-[0_28px_70px_rgba(0,0,0,0.55)] border border-white/5 mt-2 sm:mt-3"
                    >
                        {/* Circular Progress Section */}
                        <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center mb-5 sm:mb-6 shrink-0">
                            {/* Inner Shadow/Glow Background */}
                            <div className="absolute inset-4 rounded-full bg-blue-500/5 blur-2xl" />
                            
                            {/* SVG Ring */}
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 224 224">
                                {/* Track Ring */}
                                <circle
                                    cx="112"
                                    cy="112"
                                    r={radius}
                                    stroke="#2a2d3d"
                                    strokeWidth="10"
                                    fill="transparent"
                                />
                                {/* Progress Ring */}
                                <motion.circle
                                    cx="112"
                                    cy="112"
                                    r={radius}
                                    stroke="#3b82f6"
                                    strokeWidth="10"
                                    strokeDasharray={circumference}
                                    initial={{ strokeDashoffset: circumference }}
                                    animate={{ strokeDashoffset: offset }}
                                    transition={{ duration: 0.5, ease: "linear" }}
                                    strokeLinecap="round"
                                    fill="transparent"
                                />
                            </svg>
                            
                            {/* Percentage Text */}
                            <div className="absolute flex flex-col items-center">
                                <span className="text-[44px] sm:text-[48px] font-black text-white tracking-tighter leading-none">
                                    {Math.round(progress)}%
                                </span>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="space-y-2.5 mb-5 sm:mb-6 w-full px-1">
                            <h2 className="text-[18px] sm:text-[19px] font-bold text-white tracking-tight">Transferring files</h2>
                            
                            <div className="space-y-1">
                                <p className="text-[12.5px] sm:text-[13px] font-semibold text-white/90">
                                    {formatBytes(downloadedBytes)} downloaded of {formatBytes(totalBytes)} ({formatSpeed(speed)})
                                </p>
                                <p className="text-[12px] font-semibold text-zinc-500">
                                    {formatETA(etaSeconds)}
                                </p>
                            </div>
                        </div>

                        {/* Footer Warning */}
                        <p className="text-[11.5px] font-semibold text-zinc-600 max-w-[230px] leading-relaxed">
                            Please keep this window open until the download finishes.
                        </p>

                        {/* Optional Cancel Button - Added for usability as in the previous step */}
                        <button 
                            onClick={onCancel}
                            className="mt-5 sm:mt-6 text-[12px] font-bold text-zinc-500 hover:text-red-500 transition-colors"
                        >
                            Cancel Transfer
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DownloadingOverlay;
