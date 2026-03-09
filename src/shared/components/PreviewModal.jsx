import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, ImageIcon, Music, Video, File, DownloadCloud } from 'lucide-react';

const FileIcon = ({ type, name }) => {
    const extension = name.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) return <ImageIcon className="w-8 h-8 text-pink-500" />;
    if (['mp4', 'mov', 'avi', 'webm'].includes(extension)) return <Video className="w-8 h-8 text-purple-500" />;
    if (['mp3', 'wav', 'ogg'].includes(extension)) return <Music className="w-8 h-8 text-emerald-500" />;
    if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) return <FileText className="w-8 h-8 text-blue-500" />;

    return <File className="w-8 h-8 text-gray-500" />;
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
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xl"
                    >
                        {/* Animated Glow in backdrop */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
                    </motion.div>

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 40 }}
                        transition={{ type: "spring", damping: 25, stiffness: 350 }}
                        className="relative w-full max-w-4xl bg-white dark:bg-[#0e0e12] rounded-t-[32px] sm:rounded-[32px] shadow-[0_32px_128px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20 dark:border-white/5"
                    >
                        {/* Header */}
                        <div className="p-6 sm:p-10 border-b border-gray-100 dark:border-white/5 flex items-center justify-between relative overflow-hidden">
                            <div className="relative z-10 text-left">
                                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-4">
                                    <div className="p-3 bg-blue-600 dark:bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/30">
                                        <DownloadCloud className="w-6 h-6 sm:w-7 sm:h-7" />
                                    </div>
                                    Preview Uploads
                                </h2>
                                <p className="text-gray-500 dark:text-zinc-400 text-sm sm:text-base mt-2 font-medium">
                                    You have <span className="text-blue-600 dark:text-blue-400 font-bold">{files.length}</span> {files.length === 1 ? 'file' : 'files'} ready to transfer
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800/50 flex items-center justify-center text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all active:scale-90 relative z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Header decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                        </div>

                        {/* Files Row */}
                        <div className="p-6 sm:p-10 overflow-x-auto no-scrollbar">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="flex gap-6 min-w-max pb-4"
                            >
                                {files.map((file, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={itemVariants}
                                        className="w-44 sm:w-52 group"
                                    >
                                        <div className="aspect-[4/5] bg-gray-50/80 dark:bg-[#16161c] rounded-[32px] border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center p-6 gap-6 transition-all duration-500 group-hover:border-blue-500/30 group-hover:bg-white dark:group-hover:bg-[#1a1a24] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] dark:group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:-translate-y-4">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm group-hover:shadow-blue-500/20 group-hover:scale-110 transition-all duration-500 border border-transparent dark:border-white/5">
                                                <FileIcon type={file.type} name={file.name} />
                                            </div>
                                            <div className="text-center w-full space-y-1">
                                                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate w-full px-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {file.name}
                                                </h3>
                                                <span className="text-[11px] sm:text-[12px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest block">
                                                    {formatBytes(file.size)}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 sm:px-10 py-8 bg-gray-50/50 dark:bg-[#0c0c10] border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex flex-col items-center sm:items-start gap-1">
                                <span className="text-[11px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
                                    Overall Capacity
                                </span>
                                <span className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                                    {formatBytes(files.reduce((acc, f) => acc + f.size, 0))}
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-full sm:w-auto px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-black rounded-2xl transition-all shadow-[0_12px_24px_rgba(37,99,235,0.3)] hover:shadow-[0_16px_32px_rgba(37,99,235,0.4)] active:scale-95 hover:-translate-y-1"
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
