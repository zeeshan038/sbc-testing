import React from 'react';
import { motion } from 'framer-motion';

const UploadingCard = ({ uploadProgress, uploadSpeed, formatBytes }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
            className="flex flex-col items-center justify-center relative z-10 bg-white/40 dark:bg-zinc-900/40 rounded-[inherit] min-h-[400px] flex-1 px-6 py-8 text-center"
        >
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                {/* Background Track */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="46"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        className="text-gray-200 dark:text-zinc-800/80"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="46"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray="289"
                        strokeDashoffset={289 - (289 * uploadProgress) / 100}
                        strokeLinecap="round"
                        className="text-[#2b3a8c] dark:text-blue-500"
                        initial={{ strokeDashoffset: 289 }}
                        animate={{ strokeDashoffset: 289 - (289 * uploadProgress) / 100 }}
                        transition={{ ease: "easeOut", duration: 0.3 }}
                    />
                </svg>
                
                {/* Progress Percentage inside */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span 
                        className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tighter"
                    >
                        {Math.round(uploadProgress)}%
                    </span>
                </div>
                
                {/* Pulsing ring behind */}
                <div className="absolute inset-0 animate-ping rounded-full border-4 border-[#2b3a8c]/20 z-[-1]" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                Transferring files
            </h3>
            <p className="text-gray-500 dark:text-zinc-400 text-[15px] font-medium leading-relaxed max-w-[250px] mb-6">
                Please keep this window open until the upload finishes.
            </p>
            
            {uploadSpeed > 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2.5 bg-white/60 dark:bg-black/40 px-5 py-2.5 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm backdrop-blur-md"
                >
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[15px] font-bold text-gray-800 dark:text-gray-200 tracking-tight">
                        {formatBytes(uploadSpeed)}/s
                    </span>
                </motion.div>
            )}
            {/* Background glowing orb */}
            <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full bg-gradient-to-tr from-[#2b3a8c]/10 to-blue-400/10 blur-3xl -z-10 pointer-events-none"
            />
        </motion.div>
    );
};

export default UploadingCard;
