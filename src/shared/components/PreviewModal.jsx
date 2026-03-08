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

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-[32px] shadow-[0_32px_128px_rgba(0,0,0,0.4)] overflow-hidden border border-white/20 dark:border-zinc-800"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
                                        <DownloadCloud className="w-6 h-6" />
                                    </div>
                                    Preview Uploads
                                </h2>
                                <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1 font-medium">
                                    You have {files.length} {files.length === 1 ? 'file' : 'files'} ready to transfer
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:scale-110 transition-all active:scale-95"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Files Row */}
                        <div className="p-8 overflow-x-auto scrollbar-hide">
                            <div className="flex gap-6 min-w-max pb-4">
                                {files.map((file, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="w-48 group"
                                    >
                                        <div className="aspect-[4/5] bg-gray-50/50 dark:bg-zinc-800/50 rounded-[28px] border border-gray-100 dark:border-zinc-800 flex flex-col items-center justify-center p-6 gap-4 transition-all duration-300 group-hover:border-blue-400/50 group-hover:bg-blue-50/30 dark:group-hover:bg-blue-900/10 group-hover:shadow-xl group-hover:shadow-blue-500/5 group-hover:-translate-y-2">
                                            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                <FileIcon type={file.type} name={file.name} />
                                            </div>
                                            <div className="text-center w-full">
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate w-full px-2">
                                                    {file.name}
                                                </h3>
                                                <span className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 mt-1 block uppercase tracking-wider">
                                                    {formatBytes(file.size)}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-6 bg-gray-50/50 dark:bg-zinc-800/30 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                                Total Size: {formatBytes(files.reduce((acc, f) => acc + f.size, 0))}
                            </span>
                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/25 active:scale-95"
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
