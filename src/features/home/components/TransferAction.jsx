import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';

const TransferAction = ({
    isUploading,
    uploadProgress,
    isSuccess,
    onTransfer,
    onSettingsOpen,
    isSettingsOpen
}) => {
    return (
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100 dark:border-zinc-800">
            <button
                disabled={isUploading}
                onClick={onTransfer}
                className={`relative flex-1 h-10 rounded-xl font-extrabold text-[13px] tracking-tight transition-all duration-300 transform active:scale-95 shadow-md flex items-center justify-center overflow-hidden group cursor-pointer ${isUploading ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : isSuccess ? 'bg-emerald-500 text-white' : 'bg-[#2b3a8c] text-white hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-500/20'}`}
            >
                {/* Uploading State: Progress Bar Background */}
                {isUploading && (
                    <motion.div
                        className="absolute inset-0 bg-blue-600/10 origin-left z-0"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: uploadProgress / 100 }}
                        transition={{ duration: 0.1 }}
                    />
                )}

                {/* Content */}
                <div className="relative z-10 flex items-center gap-2">
                    {isUploading ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>{uploadProgress}%</span>
                        </>
                    ) : isSuccess ? (
                        <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Done!</span>
                        </>
                    ) : (
                        <span>Transfer</span>
                    )}
                </div>

                {/* Shine effect on hover */}
                {!isUploading && !isSuccess && (
                    <div className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-30deg] group-hover:animate-[shine_1.5s_infinite]" />
                )}
            </button>
        </div>
    );
};

export default TransferAction;
