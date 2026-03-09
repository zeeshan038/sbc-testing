import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Trash2, HardDrive, Calendar, Video, Play, Pause, X, Clock, Volume2, VolumeX, Maximize, Minimize, Settings, ChevronLeft, ChevronRight, Check, ArrowLeft } from 'lucide-react';
import logo from '../../../assets/logo2.png';
import { motion, AnimatePresence } from 'framer-motion';

const mockVideos = [
    {
        id: 1,
        title: 'Interview_Recording.mp4',
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: '0:10',
        size: '45 MB',
        date: 'Yesterday',
        thumbnail: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: 2,
        title: 'Interview_Recording.mp4',
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: '0:10',
        size: '45 MB',
        date: 'Yesterday',
        thumbnail: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: 3,
        title: 'Tutorial_Screen_Record.mp4',
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: '0:10',
        size: '128 MB',
        date: 'Oct 15, 2023',
        thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=400'
    },
];

/* ─────────────────────────────────────────────────────────
   Individual inline video player used inside the feed
───────────────────────────────────────────────────────── */
const InlinePlayer = ({ video }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [duration, setDuration] = useState('0:00');
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [settingsView, setSettingsView] = useState('main');
    const [playbackRate, setPlaybackRate] = useState(1);
    const [quality, setQuality] = useState('Auto');

    const videoRef = useRef(null);
    const containerRef = useRef(null);

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const fmt = (t) => {
        if (isNaN(t)) return '0:00';
        const m = Math.floor(t / 60), s = Math.floor(t % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const togglePlay = (e) => {
        e?.stopPropagation();
        if (!videoRef.current) return;
        if (isPlaying) { videoRef.current.pause(); } else { videoRef.current.play(); }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        e?.stopPropagation();
        const bar = e.currentTarget;
        const pct = (e.clientX - bar.getBoundingClientRect().left) / bar.offsetWidth;
        if (videoRef.current) videoRef.current.currentTime = pct * videoRef.current.duration;
    };

    const toggleMute = (e) => {
        e?.stopPropagation();
        if (videoRef.current) { videoRef.current.muted = !isMuted; setIsMuted(!isMuted); }
    };

    const toggleFullscreen = (e) => {
        e?.stopPropagation();
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(() => { });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handler);
        return () => document.removeEventListener('fullscreenchange', handler);
    }, []);

    return (
        <div style={{
            height: isMobile ? '50vh' : '65vh',
            width: '100%',
            flexShrink: 0,
            scrollSnapAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '0 16px' : '0 24px'
        }}>
            <div
                ref={containerRef}
                className="bg-black w-full max-w-4xl aspect-video relative group flex items-center justify-center rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.7)] border border-white/10"
            >

                <video
                    ref={videoRef}
                    className="w-full h-full object-cover cursor-pointer"
                    src={video.src}
                    onTimeUpdate={() => {
                        const cur = videoRef.current;
                        if (cur) {
                            setCurrentTime(fmt(cur.currentTime));
                            if (cur.duration > 0) setProgress((cur.currentTime / cur.duration) * 100);
                        }
                    }}
                    onLoadedMetadata={() => { if (videoRef.current) setDuration(fmt(videoRef.current.duration)); }}
                    onClick={togglePlay}
                    loop
                    playsInline
                />

                {/* Big play overlay */}
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div
                            className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center pointer-events-auto cursor-pointer hover:scale-105 transition-transform border border-white/10 shadow-xl"
                            onClick={togglePlay}
                        >
                            <Play className="w-6 h-6 text-white fill-white ml-1" />
                        </div>
                    </div>
                )}

                {/* Bottom controls */}
                <div
                    className="absolute bottom-0 left-0 w-full px-4 py-3 flex items-center gap-3 bg-gradient-to-t from-black/80 to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors focus:outline-none shrink-0">
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    <div className="flex-1 h-1 bg-white/30 rounded-full relative cursor-pointer group/bar overflow-hidden" onClick={handleSeek}>
                        <div className="absolute left-0 h-1 bg-blue-500 rounded-full" style={{ width: `${progress}%` }}>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover/bar:opacity-100 translate-x-1/2 pointer-events-none" />
                        </div>
                    </div>

                    <span className="text-white/80 text-[10px] font-mono shrink-0">{currentTime}/{duration}</span>

                    <div className="flex items-center gap-3 text-white/80 shrink-0">
                        <button onClick={toggleMute} className="hover:text-white transition-colors focus:outline-none">
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>

                        {/* Settings */}
                        <div className="relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowSettings(s => !s); setSettingsView('main'); }}
                                className={`hover:text-white transition-colors focus:outline-none ${showSettings ? 'text-blue-400' : ''}`}
                            >
                                <Settings className="w-4 h-4" />
                            </button>
                            <AnimatePresence>
                                {showSettings && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={{ duration: 0.13 }}
                                        className="absolute bottom-[110%] right-0 bg-black/95 backdrop-blur-xl rounded-xl border border-white/10 w-[220px] overflow-hidden z-[200] text-white shadow-2xl origin-bottom-right"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {settingsView === 'main' && (
                                            <div className="py-2">
                                                <button className="w-full px-5 py-3 hover:bg-white/10 flex items-center justify-between text-[13px] font-medium transition-colors" onClick={() => setSettingsView('quality')}>
                                                    <span>Quality</span>
                                                    <span className="flex items-center text-white/50 text-[12px]">{quality} <ChevronRight className="w-4 h-4 ml-1" /></span>
                                                </button>
                                                <button className="w-full px-5 py-3 hover:bg-white/10 flex items-center justify-between text-[13px] font-medium transition-colors" onClick={() => setSettingsView('speed')}>
                                                    <span>Playback speed</span>
                                                    <span className="flex items-center text-white/50 text-[12px]">{playbackRate === 1 ? 'Normal' : `${playbackRate}x`} <ChevronRight className="w-4 h-4 ml-1" /></span>
                                                </button>
                                            </div>
                                        )}
                                        {settingsView === 'speed' && (
                                            <div className="py-2 flex flex-col max-h-[240px] overflow-y-auto">
                                                <div className="px-3 pb-2 mb-1 border-b border-white/10 sticky top-0 bg-black/95">
                                                    <button className="flex items-center gap-2 text-[13px] py-1 px-2 hover:text-white/70" onClick={() => setSettingsView('main')}><ChevronLeft className="w-4 h-4" /> Playback speed</button>
                                                </div>
                                                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(rate => (
                                                    <button key={rate} className="w-full px-5 py-2.5 hover:bg-white/10 flex items-center gap-2 text-[13px] transition-colors"
                                                        onClick={() => { setPlaybackRate(rate); if (videoRef.current) videoRef.current.playbackRate = rate; setShowSettings(false); }}>
                                                        <span className="w-5 flex justify-center">{playbackRate === rate && <Check className="w-4 h-4 text-blue-500" />}</span>
                                                        <span>{rate === 1 ? 'Normal' : rate}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {settingsView === 'quality' && (
                                            <div className="py-2 flex flex-col max-h-[240px] overflow-y-auto">
                                                <div className="px-3 pb-2 mb-1 border-b border-white/10 sticky top-0 bg-black/95">
                                                    <button className="flex items-center gap-2 text-[13px] py-1 px-2 hover:text-white/70" onClick={() => setSettingsView('main')}><ChevronLeft className="w-4 h-4" /> Quality</button>
                                                </div>
                                                {['Auto', '1080p', '720p', '480p', '360p', '144p'].map(q => (
                                                    <button key={q} className="w-full px-5 py-2.5 hover:bg-white/10 flex items-center gap-2 text-[13px] transition-colors"
                                                        onClick={() => { setQuality(q); setShowSettings(false); }}>
                                                        <span className="w-5 flex justify-center">{quality === q && <Check className="w-4 h-4 text-blue-500" />}</span>
                                                        <span>{q}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button onClick={toggleFullscreen} className="hover:text-white transition-colors focus:outline-none">
                            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Title */}
            <p className="mt-3 w-full max-w-3xl text-[14px] text-white/80 font-medium pl-1">{video.title}</p>
        </div>
    );
};


const VideoFeedOverlay = ({ videos, startIndex, onClose }) => {
    const scrollRef = useRef(null);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const slotRatio = isMobile ? 0.5 : 0.65;
    const paddingRatio = (1 - slotRatio) / 2;

    // Scroll to the starting video on open
    useEffect(() => {
        if (scrollRef.current && startIndex >= 0) {
            const vh = window.innerHeight;
            scrollRef.current.scrollTop = startIndex * (slotRatio * vh);
        }
    }, [startIndex, videos.length, isMobile]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed', inset: 0, zIndex: 200,
                display: 'flex', flexDirection: 'column',
            }}
        >
            {/* Dark animated background */}
            <div className="absolute inset-0 bg-[#0e0e16]">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/15 via-purple-600/15 to-pink-600/20 blur-3xl animate-pulse pointer-events-none" />
            </div>

            {/* Floating logo top-left */}
            <div className="absolute top-5 left-6 z-[300] pointer-events-none">
                <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
            </div>

            {/* Close Button top-right */}
            <button
                onClick={onClose}
                className="fixed top-5 right-6 z-[400] w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all active:scale-95 shadow-lg border border-white/10"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Scrollable feed */}
            <div
                ref={scrollRef}
                className="feed-scroll"
                style={{
                    position: 'relative',
                    zIndex: 10,
                    width: '100%',
                    height: '100vh',
                    overflowY: 'scroll',
                    scrollSnapType: 'y mandatory',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    paddingTop: `${paddingRatio * 100}vh`,
                    paddingBottom: `${paddingRatio * 100}vh`,
                }}
            >
                <style>{`
                    .feed-scroll::-webkit-scrollbar { display: none; }
                `}</style>
                {videos.map((video) => (
                    <InlinePlayer key={video.id} video={video} />
                ))}
            </div>
        </motion.div>
    );
};

/* ─────────────────────────────────────────────────────────
   Main Videos Tab (list view)
───────────────────────────────────────────────────────── */
const VideosTab = () => {
    const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);

    return (
        <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">My Videos</h1>
                    <p className="text-[14px] text-gray-500 dark:text-zinc-400 mt-1">Manage and preview your recorded videos securely.</p>
                </div>

                <div className="relative w-full md:w-[360px] group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-[18px] w-[18px] text-gray-400 dark:text-zinc-500 group-focus-within:text-[#2b3a8c] dark:group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search videos..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl text-[14px] text-gray-800 dark:text-zinc-200 outline-none focus:bg-white dark:focus:bg-zinc-800 focus:border-[#2b3a8c] dark:focus:border-blue-500 focus:ring-4 focus:ring-[#2b3a8c]/10 dark:focus:ring-blue-500/10 transition-all shadow-sm placeholder:text-gray-400 dark:placeholder:text-zinc-500 font-medium"
                    />
                </div>
            </div>

            {/* Cards Container */}
            <div className="grid grid-cols-1 gap-4">
                {mockVideos.map((video, idx) => (
                    <div
                        key={idx}
                        className="group bg-white dark:bg-zinc-900 border border-gray-100/80 dark:border-zinc-800 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-xl hover:shadow-[#2b3a8c]/5 dark:hover:shadow-blue-900/10 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2b3a8c]/[0.02] dark:from-blue-400/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="flex items-start gap-5 w-full md:w-auto z-10">
                            {/* Thumbnail */}
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 dark:from-blue-900/20 to-[#2b3a8c]/10 dark:to-blue-800/10 flex items-center justify-center flex-shrink-0 shadow-inner dark:shadow-none">
                                {video.thumbnail ? (
                                    <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <Video className="w-6 h-6 text-[#2b3a8c] dark:text-blue-400" strokeWidth={2} />
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-[16px] font-bold text-gray-900 dark:text-white truncate">{video.title}</h3>
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-800/30 hidden md:inline-block">Active</span>
                                </div>
                                <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500 dark:text-zinc-400">
                                    <span className="text-gray-700 dark:text-zinc-300 bg-gray-100/50 dark:bg-zinc-800/50 block truncate max-w-[150px] px-2 py-0.5 rounded-md">MP4 File</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><HardDrive className="w-3.5 h-3.5" /> {video.size}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto border-t md:border-t-0 border-gray-100 dark:border-zinc-800 pt-4 md:pt-0 z-10">
                            <div className="flex items-center gap-6 text-[13px] font-medium w-full md:w-auto justify-between md:justify-end">
                                <div className="flex flex-col gap-1 items-start md:items-end">
                                    <span className="text-gray-400 dark:text-zinc-500 text-[11px] uppercase tracking-wider font-bold">Duration</span>
                                    <div className="flex items-center gap-1.5 text-gray-900 dark:text-white font-bold bg-gray-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                                        <Clock className="w-3.5 h-3.5 text-[#2b3a8c] dark:text-blue-400" />
                                        <span>{video.duration}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 items-start md:items-end">
                                    <span className="text-gray-400 dark:text-zinc-500 text-[11px] uppercase tracking-wider font-bold">Generated</span>
                                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-zinc-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{video.date}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:block w-px h-10 bg-gray-100 dark:bg-zinc-800"></div>

                            <div className="flex items-center justify-end gap-2 w-full md:w-auto">
                                <button
                                    onClick={() => setSelectedVideoIndex(idx)}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-[13px] font-semibold rounded-xl transition-all shadow-sm"
                                >
                                    <Play className="w-4 h-4 fill-current" />
                                    Preview
                                </button>
                                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700 text-[13px] font-semibold rounded-xl transition-all shadow-sm">
                                    <Settings className="w-4 h-4" />
                                    Manage
                                </button>
                                <button className="p-2.5 text-gray-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors" title="Delete Video">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
                <span className="text-[13px] font-medium text-gray-500 dark:text-zinc-400">Showing <strong className="text-gray-900 dark:text-white">1-3</strong> of <strong className="text-gray-900 dark:text-white">3</strong> videos</span>
                <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                    <button className="px-4 py-2 text-[13px] font-semibold text-gray-400 dark:text-zinc-500 rounded-xl cursor-not-allowed">Prev</button>
                    <button className="w-9 h-9 flex items-center justify-center text-[13px] font-bold text-white bg-[#2b3a8c] dark:bg-blue-600 rounded-xl shadow-md shadow-[#2b3a8c]/20 dark:shadow-blue-900/20">1</button>
                    <button className="px-4 py-2 text-[13px] font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 text-[#2b3a8c] dark:text-blue-400 rounded-xl transition-all">Next</button>
                </div>
            </div>

            {/* Fullscreen Video Feed Overlay */}
            {createPortal(
                <AnimatePresence>
                    {selectedVideoIndex !== null && (
                        <VideoFeedOverlay
                            videos={mockVideos}
                            startIndex={selectedVideoIndex}
                            onClose={() => setSelectedVideoIndex(null)}
                        />
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default VideosTab;
