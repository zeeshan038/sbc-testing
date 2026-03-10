import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, ImageIcon, Music, Video, File, DownloadCloud } from 'lucide-react';

const FileIcon = ({ type, name }) => {
    const extension = name.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) return <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 text-pink-500" />;
    if (['mp4', 'mov', 'avi', 'webm'].includes(extension)) return <Video className="w-6 h-6 sm:w-7 sm:h-7 text-purple-500" />;
    if (['mp3', 'wav', 'ogg'].includes(extension)) return <Music className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-500" />;
    if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) return <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />;

    return <File className="w-6 h-6 sm:w-7 sm:h-7 text-gray-500" />;
};

const PreviewModal = ({ isOpen, onClose, files }) => {
    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.06
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // Flatten all files: expand folder entries into their individual files
    const displayFiles = files.flatMap((f) => (f._isFolder ? f.files : [f]));

    const totalDisplayFiles = displayFiles.length;

    const handleClose = () => {
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-md"
                    >
                        {/* Animated Glow in backdrop */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
                    </motion.div>

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 400 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-[#121217] rounded-[24px] shadow-[0_32px_80px_rgba(0,0,0,0.3)] overflow-hidden border border-gray-100 dark:border-white/5"
                    >
                        {/* Header */}
                        <div className="p-5 sm:p-8 border-b border-gray-50 dark:border-white/5 flex items-center justify-between relative overflow-hidden">
                            <div className="relative z-10 text-left">
                                <h2 className="text-[18px] sm:text-[20px] font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <div className="p-1.5 bg-blue-600 rounded-lg text-white">
                                        <DownloadCloud className="w-4.5 h-4.5" />
                                    </div>
                                    Preview Uploads
                                </h2>
                                <p className="text-gray-500 dark:text-zinc-400 text-[11px] sm:text-xs mt-0.5 font-medium italic">
                                    You have <span className="text-blue-600 dark:text-blue-400 font-semibold">{totalDisplayFiles}</span> {totalDisplayFiles === 1 ? 'file' : 'files'} ready to transfer
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-8 h-8 rounded-full bg-gray-50 dark:bg-zinc-800/50 flex items-center justify-center text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white transition-all active:scale-90 relative z-10 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Files Row */}
                        <div className="p-5 sm:p-8 overflow-x-auto no-scrollbar bg-gray-50/30 dark:bg-[#0e0e12]/30">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="flex gap-4 min-w-max pb-2"
                            >
                                {displayFiles.map((file, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={itemVariants}
                                        className="w-32 sm:w-36 group"
                                    >
                                        <div className="aspect-[4/5] bg-white dark:bg-[#1a1a24] rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center p-3 gap-3 transition-all duration-300 group-hover:border-blue-500/20 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] dark:group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.3)]">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-50 dark:bg-zinc-800/80 flex items-center justify-center border border-gray-50 dark:border-white/5 transition-transform duration-300 group-hover:scale-110">
                                                <FileIcon type={file.type} name={file.name} />
                                            </div>
                                            <div className="text-center w-full space-y-0.5">
                                                <h3 className="text-[11px] sm:text-[12px] font-semibold text-gray-700 dark:text-zinc-200 truncate w-full px-1">
                                                    {file.name}
                                                </h3>
                                                <span className="text-[9px] font-medium text-gray-400 dark:text-zinc-500 block">
                                                    {formatBytes(file.size)}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-5 sm:px-8 sm:py-6 border-t border-gray-50 dark:border-white/5 flex items-center justify-between gap-4">
                            <div className="flex flex-col items-start">
                                <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">
                                    Total Size
                                </span>
                                <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                    {formatBytes(displayFiles.reduce((acc, f) => acc + f.size, 0))}
                                </span>
                            </div>
                            <button
                                onClick={handleClose}
                                className="px-8 h-10 bg-[#202d71] hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_8px_16px_rgba(37,99,235,0.3)] active:scale-95"
                            >
                                Done
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PreviewModal;
