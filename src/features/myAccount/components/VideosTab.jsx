import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Trash2, HardDrive, Calendar, Video, Play, Pause, X, Clock, ArrowLeft, Volume2, VolumeX, Maximize, Minimize, SlidersHorizontal, Settings, ChevronLeft, ChevronRight, Check, ChevronUp, ChevronDown } from 'lucide-react';
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

const VideoPlayer = ({ videos, initialIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const video = videos[currentIndex];

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [duration, setDuration] = useState('0:00');
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [settingsView, setSettingsView] = useState('main'); // 'main', 'speed', 'quality'
    const [playbackRate, setPlaybackRate] = useState(1);
    const [quality, setQuality] = useState('Auto');
    const [showDetails, setShowDetails] = useState(true);

    const videoRef = useRef(null);
    const playerContainerRef = useRef(null);
    const scrollingRef = useRef(false);

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const togglePlay = (e) => {
        if (e) e.stopPropagation();
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const dur = videoRef.current.duration;
            setCurrentTime(formatTime(current));
            if (dur > 0) {
                setProgress((current / dur) * 100);
            }
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(formatTime(videoRef.current.duration));
        }
    };

    const handleSeek = (e) => {
        if (e) e.stopPropagation();
        const bar = e.currentTarget;
        const clickPosition = e.clientX - bar.getBoundingClientRect().left;
        const percentage = clickPosition / bar.offsetWidth;
        if (videoRef.current) {
            videoRef.current.currentTime = percentage * videoRef.current.duration;
        }
    };

    const toggleMute = (e) => {
        if (e) e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleFullscreen = (e) => {
        if (e) e.stopPropagation();
        if (!document.fullscreenElement) {
            playerContainerRef.current?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Auto play on mount and when video changes
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(() => {
                setIsPlaying(false);
            });
        }
    }, [currentIndex]);

    const handleWheel = (e) => {
        if (scrollingRef.current) return;
        if (e.deltaY > 40) { // scroll down -> next
            if (currentIndex < videos.length - 1) {
                scrollingRef.current = true;
                setCurrentIndex(prev => prev + 1);
                setTimeout(() => scrollingRef.current = false, 800);
            }
        } else if (e.deltaY < -40) { // scroll up -> prev
            if (currentIndex > 0) {
                scrollingRef.current = true;
                setCurrentIndex(prev => prev - 1);
                setTimeout(() => scrollingRef.current = false, 800);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[101] flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-xl gap-6"
            onWheel={handleWheel}
        >
            {/* Random animated background effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/30 opacity-70 pointer-events-none blur-3xl animate-pulse" />

            <div
                ref={playerContainerRef}
                className="bg-black w-full max-w-6xl aspect-video max-h-[75vh] relative group flex items-center justify-center rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)] ring-1 ring-white/10 mx-6 object-contain shrink-0"
                onClick={() => { }}
            >
                {/* Close btn */}
                <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors pointer-events-auto shadow-lg"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Video container with AnimatePresence for smooth transitions */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full absolute inset-0"
                    >
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover cursor-pointer"
                            src={video.src}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onClick={(e) => togglePlay(e)}
                            loop
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Big Play Button (when paused) */}
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div
                            className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center pointer-events-auto cursor-pointer transition-transform transform hover:scale-105 shadow-xl border border-white/20"
                            onClick={togglePlay}
                        >
                            <Play className="w-8 h-8 text-white fill-white ml-1.5" />
                        </div>
                    </div>
                )}



                {/* Bottom Controls */}
                <div
                    className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end bg-gradient-to-t from-black/90 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center gap-3 w-full px-2">
                        <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors focus:outline-none">
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        </button>

                        <div className="flex-1 h-1.5 bg-white/20 rounded-full relative cursor-pointer group/bar overflow-hidden" onClick={handleSeek}>
                            <div className="absolute left-0 h-1.5 bg-blue-500 rounded-full transition-all duration-75" style={{ width: `${progress}%` }}>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-0 group-hover/bar:opacity-100 transition-opacity translate-x-1/2 pointer-events-none"></div>
                            </div>
                        </div>

                        <div className="text-white/80 text-[10px] font-medium font-mono min-w-[65px] text-center shrink-0 tracking-wider">
                            {currentTime}/{duration}
                        </div>

                        <div className="flex items-center gap-4 ml-4 shrink-0">
                            <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors focus:outline-none">
                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                            <div className="relative flex items-center">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); setSettingsView('main'); }}
                                    className={`text-white hover:text-blue-400 transition-colors focus:outline-none ${showSettings ? 'text-blue-400' : ''}`}
                                >
                                    <Settings className="w-4 h-4" />
                                </button>

                                <AnimatePresence>
                                    {showSettings && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute bottom-full right-0 mb-4 bg-black/95 backdrop-blur-xl rounded-xl border border-white/10 w-[260px] overflow-hidden z-[110] text-white shadow-2xl origin-bottom-right"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {settingsView === 'main' && (
                                                <div className="py-2">
                                                    <button className="w-full px-5 py-3 hover:bg-white/10 flex items-center justify-between text-[13px] font-medium transition-colors"
                                                        onClick={() => setSettingsView('quality')}
                                                    >
                                                        <span className="flex items-center gap-3">Quality</span>
                                                        <span className="flex items-center text-white/50 text-[12px]">
                                                            {quality} <ChevronRight className="w-4 h-4 ml-1 text-white/60" />
                                                        </span>
                                                    </button>
                                                    <button className="w-full px-5 py-3 hover:bg-white/10 flex items-center justify-between text-[13px] font-medium transition-colors"
                                                        onClick={() => setSettingsView('speed')}
                                                    >
                                                        <span className="flex items-center gap-3">Playback speed</span>
                                                        <span className="flex items-center text-white/50 text-[12px]">
                                                            {playbackRate === 1 ? 'Normal' : `${playbackRate}x`} <ChevronRight className="w-4 h-4 ml-1 text-white/60" />
                                                        </span>
                                                    </button>
                                                </div>
                                            )}
                                            {settingsView === 'speed' && (
                                                <div className="py-2 flex flex-col max-h-[300px] overflow-y-auto custom-scrollbar">
                                                    <div className="px-3 pb-2 mb-2 border-b border-white/10 sticky top-0 bg-black/95 z-10 backdrop-blur-md">
                                                        <button className="flex items-center gap-2 text-[13px] hover:text-white/70 transition-colors py-1 px-2 font-medium" onClick={() => setSettingsView('main')}>
                                                            <ChevronLeft className="w-4 h-4 -ml-1" /> Playback speed
                                                        </button>
                                                    </div>
                                                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(rate => (
                                                        <button key={rate} className="w-full px-5 py-2.5 hover:bg-white/10 flex items-center gap-2 text-[13px] transition-colors"
                                                            onClick={() => {
                                                                setPlaybackRate(rate);
                                                                if (videoRef.current) videoRef.current.playbackRate = rate;
                                                                setShowSettings(false);
                                                            }}
                                                        >
                                                            <span className="w-5 flex justify-center">{playbackRate === rate && <Check className="w-4 h-4 text-blue-500" />}</span>
                                                            <span className="font-medium">{rate === 1 ? 'Normal' : rate}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            {settingsView === 'quality' && (
                                                <div className="py-2 flex flex-col max-h-[300px] overflow-y-auto custom-scrollbar">
                                                    <div className="px-3 pb-2 mb-2 border-b border-white/10 sticky top-0 bg-black/95 z-10 backdrop-blur-md">
                                                        <button className="flex items-center gap-2 text-[13px] hover:text-white/70 transition-colors py-1 px-2 font-medium" onClick={() => setSettingsView('main')}>
                                                            <ChevronLeft className="w-4 h-4 -ml-1" /> Quality
                                                        </button>
                                                    </div>
                                                    {['Auto', '1080p', '720p', '480p', '360p', '144p'].map(q => (
                                                        <button key={q} className="w-full px-5 py-2.5 hover:bg-white/10 flex items-center gap-2 text-[13px] transition-colors"
                                                            onClick={() => {
                                                                setQuality(q);
                                                                setShowSettings(false);
                                                            }}
                                                        >
                                                            <span className="w-5 flex justify-center">{quality === q && <Check className="w-4 h-4 text-blue-500" />}</span>
                                                            <span className="font-medium">{q} {q === '1080p' && <span className="ml-1.5 text-[9px] bg-red-600 px-1 rounded font-bold uppercase tracking-wider py-[1px]">HD</span>}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors focus:outline-none">
                                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Progress Indicators for Reels */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
                    {videos.map((_, i) => (
                        <div key={i} className={`w-1.5 rounded-full transition-all duration-500 shadow-sm ${i === currentIndex ? 'h-8 bg-white/90' : 'h-1.5 bg-white/30'}`} />
                    ))}
                </div>
            </div>

            {/* Details Section (Name & Description) OUTSIDE VIDEO */}
            <div className="w-full max-w-6xl mx-6 px-2 flex flex-col z-20">
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-5 relative border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
                        className="absolute -top-4 right-6 bg-white/20 hover:bg-white/30 backdrop-blur-md p-1.5 rounded-full text-white transition-colors shadow-lg border border-white/20"
                    >
                        {showDetails ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>

                    <AnimatePresence>
                        {showDetails ? (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <h3 className="text-[18px] font-bold text-white tracking-wide mb-2 leading-tight">{video.title}</h3>
                                <p className="text-[14px] text-white/70 leading-relaxed max-w-4xl">
                                    This is an amazing video recording. Scroll up or down with your mouse wheel or trackpad to see the next/previous videos in your library just like reels!
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="pt-1"
                            >
                                <h3 className="text-[16px] font-bold text-white tracking-wide truncate">{video.title}</h3>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

const VideosTab = () => {
    const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);

    return (
        <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Videos</h1>
                    <p className="text-[14px] text-gray-500 mt-1">Manage and preview your recorded videos securely.</p>
                </div>

                <div className="relative w-full md:w-[360px] group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-[18px] w-[18px] text-gray-400 group-focus-within:text-[#2b3a8c] transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search videos..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-[14px] text-gray-800 outline-none focus:border-[#2b3a8c] focus:ring-4 focus:ring-[#2b3a8c]/10 transition-all shadow-sm placeholder:text-gray-400 font-medium"
                    />
                </div>
            </div>


            {/* Cards Container */}
            <div className="grid grid-cols-1 gap-4">
                {mockVideos.map((video, idx) => (
                    <div
                        key={idx}
                        className="group bg-white border border-gray-100/80 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-xl hover:shadow-[#2b3a8c]/5 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    >
                        {/* Subtle decorative gradient background on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2b3a8c]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="flex items-start gap-5 w-full md:w-auto z-10">
                            {/* Icon Wrapper */}
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-[#2b3a8c]/10 flex items-center justify-center flex-shrink-0 shadow-inner">
                                <Video className="w-6 h-6 text-[#2b3a8c]" strokeWidth={2} />
                            </div>

                            {/* Main Info */}
                            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-[16px] font-bold text-gray-900 truncate">{video.title}</h3>
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 hidden md:inline-block">Active</span>
                                </div>
                                <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500">
                                    <span className="text-gray-700 bg-gray-100/50 block truncate max-w-[150px] px-2 py-0.5 rounded-md">
                                        MP4 File
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><HardDrive className="w-3.5 h-3.5" /> {video.size}</span>
                                </div>
                            </div>
                        </div>

                        {/* Metadata & Actions */}
                        <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 z-10">
                            {/* Stats */}
                            <div className="flex items-center gap-6 text-[13px] font-medium w-full md:w-auto justify-between md:justify-end">
                                <div className="flex flex-col gap-1 items-start md:items-end">
                                    <span className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">Duration</span>
                                    <div className="flex items-center gap-1.5 text-gray-900 font-bold bg-gray-50 px-2 py-0.5 rounded-md">
                                        <Clock className="w-3.5 h-3.5 text-[#2b3a8c]" />
                                        <span>{video.duration}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 items-start md:items-end">
                                    <span className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">Generated</span>
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{video.date}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-px h-10 bg-gray-100"></div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-2 w-full md:w-auto">
                                <button onClick={() => setSelectedVideoIndex(idx)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 text-[13px] font-semibold rounded-xl transition-all shadow-sm">
                                    <Play className="w-4 h-4 fill-current" />
                                    Preview
                                </button>
                                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-[13px] font-semibold rounded-xl transition-all shadow-sm">
                                    <Settings className="w-4 h-4" />
                                    Manage
                                </button>
                                <button className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors tooltip-trigger" title="Delete Video">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Premium Pagination */}
            <div className="flex items-center justify-between mt-4">
                <span className="text-[13px] font-medium text-gray-500">Showing <strong className="text-gray-900">1-3</strong> of <strong className="text-gray-900">3</strong> videos</span>
                <div className="flex items-center gap-2 bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                    <button className="px-4 py-2 text-[13px] font-semibold text-gray-400 rounded-xl cursor-not-allowed">Prev</button>
                    <button className="w-9 h-9 flex items-center justify-center text-[13px] font-bold text-white bg-[#2b3a8c] rounded-xl shadow-md shadow-[#2b3a8c]/20">1</button>
                    <button className="px-4 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 text-[#2b3a8c] rounded-xl transition-all">Next</button>
                </div>
            </div>

            {/* Video Player Overlay */}
            {createPortal(
                <AnimatePresence>
                    {selectedVideoIndex !== null && (
                        <VideoPlayer videos={mockVideos} initialIndex={selectedVideoIndex} onClose={() => setSelectedVideoIndex(null)} />
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default VideosTab;

