import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, ImageIcon, Music, Video, File, DownloadCloud } from 'lucide-react';

import VideoPlayer from './VideoPlayer';
import { BASE_URL, home_url } from '../../app/constant';

const FileIcon = ({ type, name }) => {
    const extension = name.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) return <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 text-pink-500" />;
    if (['mp4', 'mov', 'avi', 'webm'].includes(extension)) return <Video className="w-6 h-6 sm:w-7 sm:h-7 text-purple-500" />;
    if (['mp3', 'wav', 'ogg'].includes(extension)) return <Music className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-500" />;
    if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) return <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />;

    return <File className="w-6 h-6 sm:w-7 sm:h-7 text-gray-500" />;
};

const PreviewModal = ({ isOpen, onClose, files, transferId, totalSizeOverride, onDownload }) => {
    const [activeImage, setActiveImage] = React.useState(null);
    const [activeVideo, setActiveVideo] = React.useState(null);
    const [isDownloading, setIsDownloading] = React.useState(false);

    const formatBytes = (bytes) => {
        const val = Number(bytes);
        if (isNaN(val) || val <= 0) return '0 B';
        if (val < 1024) return val + ' B';
        if (val < 1024 * 1024) return (val / 1024).toFixed(1) + ' KB';
        if (val < 1024 * 1024 * 1024) return (val / (1024 * 1024)).toFixed(1) + ' MB';
        return (val / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    };

    const handleDownloadClick = async () => {
        if (!onDownload) return;
        setIsDownloading(true);
        try {
            await onDownload();
        } finally {
            setIsDownloading(false);
        }
    };

    const displayFiles = files.flatMap((f) => (f._isFolder ? f.files : [f]));
    const totalDisplayFiles = displayFiles.length;

    const totalCalculatedSize = displayFiles.reduce((acc, f) => acc + (Number(f.size) || 0), 0);
    const finalSize = totalSizeOverride || totalCalculatedSize;

    const handleClose = () => {
        setActiveImage(null);
        setActiveVideo(null);
        onClose();
    };

    const isImage = (name) => {
        return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes((name || '').split('.').pop().toLowerCase());
    };

    const isVideo = (name) => {
        return ['mp4', 'mov', 'avi', 'webm'].includes((name || '').split('.').pop().toLowerCase());
    };

    const handleFileClick = (file) => {
        const name = file.name || file.fileName;
        if (isImage(name)) {
            setActiveImage(file.url);
        } else if (isVideo(name)) {
            const getStreamUrl = (key) => transferId ? `${BASE_URL}${home_url}/stream/${transferId}?key=${key}` : null;
            
            const activeUrl = (transferId && file.key) ? getStreamUrl(file.key) : file.url;
            
            setActiveVideo({ 
                url: activeUrl, 
                title: name,
                resolution: file.resolution || file.metadata?.resolution,
                qualities: (file.qualities || []).map(q => ({
                    ...q,
                    url: (transferId && q.key) ? getStreamUrl(q.key) : q.url
                }))
            });
        }
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
                        className="absolute inset-0 bg-black/60 dark:bg-black/90 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 400 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-[#121217] rounded-[24px] shadow-[0_32px_80px_rgba(0,0,0,0.3)] overflow-hidden border border-gray-100 dark:border-white/5 z-10"
                    >
                        {/* Header */}
                        <div className="p-5 sm:p-8 border-b border-gray-50 dark:border-white/5 flex items-center justify-between relative overflow-hidden">
                            <div className="relative z-10 text-left">
                                <h2 className="text-[18px] sm:text-[20px] font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <div className="p-1.5 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/20">
                                        <DownloadCloud className="w-4.5 h-4.5" />
                                    </div>
                                    Preview Transfer
                                </h2>
                                <p className="text-gray-500 dark:text-zinc-400 text-[11px] sm:text-xs mt-0.5 font-medium">
                                    You have <span className="text-blue-600 dark:text-blue-400 font-bold">{totalDisplayFiles}</span> {totalDisplayFiles === 1 ? 'file' : 'files'} in this transfer
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-9 h-9 rounded-full bg-gray-50 dark:bg-zinc-800/50 flex items-center justify-center text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white transition-all active:scale-90 relative z-10 cursor-pointer border border-gray-100 dark:border-white/5"
                            >
                                <X className="w-4.5 h-4.5" />
                            </button>
                        </div>

                        {/* Files Area */}
                        <div className="p-5 sm:p-8 overflow-x-auto no-scrollbar bg-gray-50/10 dark:bg-[#0e0e12]/30">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
                                }}
                                className="flex gap-4 min-w-max pb-2"
                            >
                                {displayFiles.map((file, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={{
                                            hidden: { opacity: 0, y: 15 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                        className="w-32 sm:w-36 group cursor-pointer"
                                        onClick={() => handleFileClick(file)}
                                    >
                                        <div className="aspect-[4/5] bg-white dark:bg-[#1a1a24] rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center p-3 gap-3 transition-all duration-300 group-hover:border-blue-500/40 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] dark:group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.3)] overflow-hidden relative">
                                            {/* Single Download Icon */}
                                            {file.url && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const link = document.createElement('a');
                                                        link.href = file.url;
                                                        link.download = file.name || file.fileName;
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        link.remove();
                                                    }}
                                                    className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-zinc-900/90 text-gray-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 rounded-lg shadow-sm border border-gray-100 dark:border-white/5 transition-all z-20 cursor-pointer"
                                                    title="Download file"
                                                >
                                                    <DownloadCloud className="w-3.5 h-3.5" />
                                                </button>
                                            )}

                                            <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl bg-gray-50 dark:bg-zinc-800/80 flex items-center justify-center border border-gray-50 dark:border-white/5 transition-transform duration-300 group-hover:scale-105 overflow-hidden shrink-0">
                                                {file.url && isImage(file.name || file.fileName) ? (
                                                    <img 
                                                        src={file.url} 
                                                        alt={file.name || file.fileName} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : file.url && isVideo(file.name || file.fileName) ? (
                                                    <video 
                                                        src={file.url} 
                                                        className="w-full h-full object-cover px-0.5"
                                                        muted
                                                        playsInline
                                                    />
                                                ) : (
                                                    <FileIcon type={file.type} name={file.name || file.fileName} />
                                                )}
                                            </div>
                                            <div className="text-center w-full min-w-0 z-10">
                                                <h3 className="text-[11px] sm:text-[12px] font-bold text-gray-700 dark:text-zinc-200 truncate w-full px-1">
                                                    {file.name || file.fileName}
                                                </h3>
                                                <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 block">
                                                    {file.size ? formatBytes(file.size) : '---'}
                                                </span>
                                            </div>
                                            
                                            {file.url && (isImage(file.name || file.fileName) || isVideo(file.name || file.fileName)) && (
                                                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors flex items-center justify-center">
                                                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                                        <span className="bg-white/90 dark:bg-zinc-900/90 text-blue-600 dark:text-blue-400 text-[9px] font-bold px-2 py-1 rounded-lg border border-blue-100 dark:border-white/5 shadow-lg">Click to View</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-5 sm:px-8 sm:py-6 border-t border-gray-50 dark:border-white/5 flex items-center justify-between gap-4 bg-white dark:bg-[#121217]">
                            <div className="flex flex-col items-start">
                                <span className="text-[9px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">
                                    Total Size
                                </span>
                                <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                    {formatBytes(finalSize)}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                {onDownload && (
                                    <button
                                        onClick={handleDownloadClick}
                                        disabled={isDownloading}
                                        className="px-6 h-11 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isDownloading ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <DownloadCloud className="w-4 h-4" />
                                        )}
                                        Download
                                    </button>
                                )}
                                <button
                                    onClick={handleClose}
                                    className="px-8 h-11 bg-[#202d71] hover:bg-blue-600 text-white text-[14px] font-bold rounded-xl transition-all shadow-[0_4px_12px_rgba(32,45,113,0.2)] hover:shadow-[0_8px_16px_rgba(32,45,113,0.3)] active:scale-95"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Full Size Preview Overlay (Image or Video) */}
                    <AnimatePresence>
                        {(activeImage || activeVideo) && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
                                onClick={() => { setActiveImage(null); setActiveVideo(null); }}
                            >
                                <motion.button
                                    className="absolute top-20 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all z-[120]"
                                    onClick={(e) => { e.stopPropagation(); setActiveImage(null); setActiveVideo(null); }}
                                >
                                    <X className="w-6 h-6" />
                                </motion.button>
                                
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="w-full max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {activeImage && (
                                        <img 
                                            src={activeImage} 
                                            alt="Full Preview" 
                                            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/5"
                                        />
                                    )}
                                    {activeVideo && (
                                        <div className="w-full">
                                            <VideoPlayer 
                                                src={activeVideo.url} 
                                                title={activeVideo.title}
                                                resolution={activeVideo.resolution}
                                                qualities={activeVideo.qualities}
                                                onClose={() => setActiveVideo(null)}
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PreviewModal;
