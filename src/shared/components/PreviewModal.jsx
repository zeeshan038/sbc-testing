import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, ImageIcon, Music, Video, File, DownloadCloud } from 'lucide-react';

import VideoPlayer from './VideoPlayer';
import { BASE_URL, home_url } from '../../app/constant';

const FileIcon = ({ type, name, className = '' }) => {
    const extension = name.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
        return <ImageIcon className={`w-6 h-6 sm:w-7 sm:h-7 text-pink-500 ${className}`} />;
    }
    if (['mp4', 'mov', 'avi', 'webm'].includes(extension)) {
        return <Video className={`w-6 h-6 sm:w-7 sm:h-7 text-purple-500 ${className}`} />;
    }
    if (['mp3', 'wav', 'ogg'].includes(extension)) {
        return <Music className={`w-6 h-6 sm:w-7 sm:h-7 text-emerald-500 ${className}`} />;
    }
    if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) {
        return <FileText className={`w-6 h-6 sm:w-7 sm:h-7 text-blue-500 ${className}`} />;
    }

    return <File className={`w-6 h-6 sm:w-7 sm:h-7 text-gray-500 ${className}`} />;
};

const VideoThumbnail = ({ src, alt }) => {
    const videoRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const [thumbnail, setThumbnail] = React.useState(null);
    const [failed, setFailed] = React.useState(false);

    React.useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas || !src) return;

        const captureFrame = () => {
            try {
                const ctx = canvas.getContext('2d');
                canvas.width = video.videoWidth || 320;
                canvas.height = video.videoHeight || 180;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                setThumbnail(canvas.toDataURL('image/jpeg', 0.8));
            } catch (err) {
                setFailed(true);
            }
        };

        const handleLoadedData = () => {
            try {
                video.currentTime = 0.1;
            } catch (err) {
                captureFrame();
            }
        };

        const handleSeeked = () => captureFrame();
        const handleError = () => setFailed(true);

        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('seeked', handleSeeked);
        video.addEventListener('error', handleError);

        return () => {
            video.removeEventListener('loadeddata', handleLoadedData);
            video.removeEventListener('seeked', handleSeeked);
            video.removeEventListener('error', handleError);
        };
    }, [src]);

    if (thumbnail) {
        return (
            <img
                src={thumbnail}
                alt={alt}
                className="w-full h-full object-cover"
            />
        );
    }

    if (failed) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                <Video className="w-6 h-6 text-purple-500" />
            </div>
        );
    }

    return (
        <>
            <video
                ref={videoRef}
                src={src}
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
                style={{ display: 'none' }}
                crossOrigin="anonymous"
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-500 rounded-full animate-spin" />
            </div>
        </>
    );
};

const PreviewModal = ({
    isOpen,
    onClose,
    files,
    transferId,
    totalSizeOverride,
    onDownload,
    isDownloadAble,
    downloadProgress = 0,
    downloadSpeed = 0,
    isStreaming = false
}) => {
    const [activeImage, setActiveImage] = React.useState(null);
    const [activeVideo, setActiveVideo] = React.useState(null);
    const [isPreparing, setIsPreparing] = React.useState(false);

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
        setIsPreparing(true);
        try {
            await onDownload();
        } finally {
            setIsPreparing(false);
        }
    };

    const displayFiles = (files || []).flatMap((f) => (f._isFolder ? f.files : [f]));
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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 dark:bg-black/90 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 400 }}
                        className="relative w-full max-w-4xl bg-white dark:bg-[#121217] rounded-[24px] shadow-[0_32px_80px_rgba(0,0,0,0.3)] overflow-hidden border border-gray-100 dark:border-white/5 z-10"
                    >
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

                        <div className="p-5 sm:p-8 overflow-y-auto overflow-x-auto no-scrollbar bg-gray-50/10 dark:bg-[#0e0e12]/30 min-h-[300px] max-h-[60vh]">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
                                }}
                                className="flex gap-4 min-w-max pb-2"
                            >
                                {displayFiles.map((file, idx) => {
                                    const fileName = file.name || file.fileName;

                                    const getStreamUrl = (key) =>
                                        transferId ? `${BASE_URL}${home_url}/stream/${transferId}?key=${key}` : null;

                                    const previewUrl =
                                        (transferId && file.key) ? getStreamUrl(file.key) : file.url;

                                    const fileIsImage = previewUrl && isImage(fileName);
                                    const fileIsVideo = previewUrl && isVideo(fileName);
                                    const isPreviewable = fileIsImage || fileIsVideo;
                                    const isDocLike = !isPreviewable;

                                    return (
                                        <motion.div
                                            key={idx}
                                            variants={{
                                                hidden: { opacity: 0, y: 15 },
                                                visible: { opacity: 1, y: 0 }
                                            }}
                                            className="w-36 sm:w-40 group cursor-pointer"
                                            onClick={() => handleFileClick({ ...file, url: previewUrl })}
                                        >
                                            <div className="rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1a1a24] overflow-hidden transition-all duration-300 group-hover:border-blue-500/40 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] dark:group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.3)] relative">

                                                {file.url && !isDownloadAble && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (onDownload) onDownload(file.key);
                                                        }}
                                                        className="absolute top-2 left-2 p-1.5 bg-white/90 dark:bg-zinc-900/90 text-gray-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 rounded-lg shadow-sm border border-gray-100 dark:border-white/5 transition-all z-20 cursor-pointer"
                                                        title="Download file"
                                                    >
                                                        <DownloadCloud className="w-3.5 h-3.5" />
                                                    </button>
                                                )}

                                                <div className="absolute top-2 right-2 z-20 p-1.5 bg-white/90 dark:bg-zinc-900/90 rounded-lg shadow-sm border border-gray-100 dark:border-white/5">
                                                    <FileIcon type={file.type} name={fileName} className="w-4 h-4 sm:w-4 sm:h-4" />
                                                </div>

                                                <div className="h-32 sm:h-36 bg-gray-50 dark:bg-zinc-900/40 overflow-hidden relative">
                                                    {fileIsImage ? (
                                                        <img
                                                            src={previewUrl}
                                                            alt={fileName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : fileIsVideo ? (
                                                        <VideoThumbnail
                                                            src={previewUrl}
                                                            alt={fileName}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center px-4">
                                                            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/5 flex items-center justify-center shadow-sm">
                                                                <FileIcon type={file.type} name={fileName} />
                                                            </div>
                                                            <div className="mt-3 text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                                                                {fileName.split('.').pop()}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {isPreviewable && (
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                                                            <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                                                <span className="bg-white/95 dark:bg-zinc-900/95 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-blue-100 dark:border-white/5 shadow-lg">
                                                                    Preview
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-3 text-center">
                                                    <h3 className="text-[11px] sm:text-[12px] font-bold text-gray-700 dark:text-zinc-200 truncate px-1">
                                                        {fileName}
                                                    </h3>
                                                    <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 block mt-0.5">
                                                        {file.size ? formatBytes(file.size) : '---'}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </div>

                        <div className="px-6 py-5 sm:px-8 sm:py-6 border-t border-gray-50 dark:border-white/5 flex items-center justify-between gap-4 bg-white dark:bg-[#121217]">
                            <div className="flex flex-col items-start">
                                <span className="text-[9px] font-extrabold text-gray-400 dark:text-zinc-500 up  percase tracking-widest mb-0.5">
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
                                        disabled={isPreparing || isStreaming || isDownloadAble}
                                        className="px-6 h-11 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 overflow-hidden relative"
                                    >
                                        {isStreaming ? (
                                            <>
                                                <div
                                                    className="absolute inset-0 bg-blue-400/30 transition-all duration-300"
                                                    style={{ width: `${downloadProgress}%` }}
                                                />
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
                                                <span className="relative z-10">{downloadProgress}% ({formatBytes(downloadSpeed)}/s)</span>
                                            </>
                                        ) : isPreparing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Preparing...
                                            </>
                                        ) : (
                                            <>
                                                <DownloadCloud className="w-4 h-4" />
                                                {isDownloadAble ? 'Download restricted' : 'Download'}
                                            </>
                                        )}
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