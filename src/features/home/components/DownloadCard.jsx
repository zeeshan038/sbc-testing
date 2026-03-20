import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DownloadCloud, Flag, Loader2, ChevronDown, Check } from 'lucide-react';
import { formatBytes } from '../../../shared/utils/formatTransfer';

const DownloadCard = ({ 
    transferData, 
    isFetchingTransfer, 
    onPreview, 
    onDownload, 
    isDownloadAble
}) => {
    const [isPreparing, setIsPreparing] = useState(false);
    const [showQualities, setShowQualities] = useState(false);

    if (isFetchingTransfer) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4 h-full bg-[#12141c] rounded-[inherit]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-sm font-medium text-gray-500">Retrieving transfer details...</p>
            </div>
        );
    }

    const { files = [], transferDetails = {} } = transferData || {};
    const finalFiles = files.length > 0 ? files : (transferDetails.files || []);
    const totalSize = transferData?.totalSize || transferDetails?.totalSize || 0;
    const expireIn = transferDetails?.expireIn || transferData?.expireIn || '7d';

    const singleVideo = finalFiles.length === 1 && finalFiles[0].qualities?.length > 0 ? finalFiles[0] : null;

    return (
        <div className="flex flex-col items-center justify-between h-full bg-[#12141c] rounded-[inherit] p-6 sm:p-7 text-center relative overflow-hidden">
            {/* Header / Icon Section */}
            <div className="flex flex-col items-center w-full">
                <div className="relative mb-5 sm:mb-6 mt-2 sm:mt-3">
                    {/* Cloud Icon with Red Arrow */}
                    <svg width="96" height="72" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Outer Cloud Glow */}
                        <path 
                            d="M84.5 75C98.4787 75 110 63.4787 110 49.5C110 36.1951 99.548 25.103 86.48 23.756C83.42 8.65 69.91 0 54 0C40.89 0 29.42 6.75 22.8 16.54C11.1 18.51 2 28.84 2 41.12C2 54.76 13.24 66 26.88 66" 
                            stroke="#2b3a8c" 
                            strokeWidth="4" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="opacity-50"
                        />
                        <path 
                            d="M84.5 75C98.4787 75 110 63.4787 110 49.5C110 36.1951 99.548 25.103 86.48 23.756C83.42 8.65 69.91 0 54 0C40.89 0 29.42 6.75 22.8 16.54C11.1 18.51 2 28.84 2 41.12C2 54.76 13.24 66 26.88 66" 
                            stroke="#3b82f6" 
                            strokeWidth="4.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                        {/* Red Down Arrow */}
                        <path d="M54 35V75M54 75L40 61M54 75L68 61" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                <h2 className="text-[22px] sm:text-[24px] font-bold text-white mb-1.5 tracking-tight">Your download is ready</h2>
                <p className="text-[14px] sm:text-[15px] text-zinc-500 font-semibold">Expires in {expireIn}</p>
            </div>

            {/* File Info Box */}
            <div className="w-full bg-[#1c1e26] rounded-2xl p-4 sm:p-5 flex items-center justify-between mb-6 sm:mb-7 border border-white/5">
                <div className="flex flex-col text-left">
                    <h3 className="text-[15px] sm:text-[16px] font-bold text-white mb-0.5">
                        {finalFiles.length} {finalFiles.length === 1 ? 'File' : 'Files'}
                    </h3>
                    <span className="text-[12px] sm:text-[13px] text-zinc-500 font-semibold">
                        {formatBytes(totalSize)} Total size
                    </span>
                </div>
                <button 
                    onClick={onPreview}
                    className="text-[13px] sm:text-[14px] font-bold text-[#3b82f6] hover:text-blue-400 transition-colors"
                >
                    Preview files
                </button>
            </div>

            {/* Bottom Actions */}
            <div className="w-full flex items-center gap-3 mt-auto">
                <button 
                    className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-[#1c1e26] hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-red-500 transition-all border border-white/5 active:scale-95"
                    title="Report transfer"
                >
                    <Flag className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <div className="flex-1 relative">
                    {singleVideo && !isDownloadAble ? (
                        <div className="relative w-full">
                            <button 
                                onClick={() => setShowQualities(!showQualities)}
                                disabled={isPreparing}
                                className="w-full h-12 sm:h-14 bg-[#2b3a8c] hover:bg-blue-700 text-white rounded-full font-bold text-[14px] sm:text-[16px] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 px-6"
                            >
                                {isPreparing ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : null}
                                Download 
                                <ChevronDown className="w-5 h-5" />
                            </button>
                            
                            <AnimatePresence>
                                {showQualities && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowQualities(false)} />
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute bottom-full left-0 right-0 mb-3 bg-[#1c1e26] rounded-2xl shadow-2xl border border-white/10 py-3 z-50 overflow-hidden"
                                        >
                                            <div className="px-5 py-2 border-b border-white/5 mb-1.5">
                                                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Select Quality</p>
                                            </div>
                                            <div className="max-h-60 overflow-y-auto no-scrollbar">
                                                {[...singleVideo.qualities].sort((a,b) => b.isOriginal ? 1 : -1).map((q, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => {
                                                            setShowQualities(false);
                                                            onDownload(q.key);
                                                        }}
                                                        className="w-full text-left px-5 py-3.5 hover:bg-blue-600/20 text-[13px] sm:text-[14px] font-bold text-white flex items-center justify-between group transition-colors"
                                                    >
                                                        <span>{q.label}</span>
                                                        <DownloadCloud className="w-4.5 h-4.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <button 
                            onClick={() => onDownload()}
                            disabled={isPreparing || isDownloadAble}
                            className="w-full h-12 sm:h-14 bg-[#2b3a8c] hover:bg-blue-700 text-white rounded-full font-bold text-[14px] sm:text-[16px] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 shadow-xl"
                        >
                            {isPreparing ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <DownloadCloud className="w-5 h-5" />}
                            {isDownloadAble ? 'Restricted' : (finalFiles.length > 1 ? 'Download all' : 'Download')}
                        </button>
                    )}
                </div>
            </div>

            {/* Subtle glow behind everything */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none" />
        </div>
    );
};

export default DownloadCard;
