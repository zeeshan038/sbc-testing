import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Video, Play, Pause, X, Clock, ArrowLeft, Volume2, VolumeX, Maximize, Minimize, SlidersHorizontal, Settings, ChevronLeft, ChevronRight, Check } from 'lucide-react';
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

const VideoPlayer = ({ video, onClose }) => {
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

    const videoRef = useRef(null);
    const playerContainerRef = useRef(null);

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

    // Also auto play on mount
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(() => {
                setIsPlaying(false);
            });
        }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[101] flex items-center justify-center bg-black"
        >
            <div
                ref={playerContainerRef}
                className="bg-black w-full h-full overflow-hidden shadow-2xl relative group flex items-center justify-center"
                onClick={() => { }}
            >
                {/* Header */}
                <div className="absolute top-0 left-0 w-full p-6 flex justify-start items-center bg-gradient-to-b from-black/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="w-10 h-10 rounded-md bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors mr-4 pointer-events-auto"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h3 className="text-[18px] font-bold text-white tracking-wide">{video.title}</h3>
                </div>

                {/* Video */}
                <video
                    ref={videoRef}
                    className="w-full h-full object-contain cursor-none group-hover:cursor-auto"
                    src={video.src}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                    onClick={(e) => togglePlay(e)}
                />

                {/* Big Play Button (when paused) */}
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div
                            className="w-20 h-20 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center pointer-events-auto cursor-pointer transition-transform transform hover:scale-105"
                            onClick={togglePlay}
                        >
                            <Play className="w-8 h-8 text-blue-500 fill-blue-500 ml-1.5" />
                        </div>
                    </div>
                )}

                {/* Bottom Controls */}
                <div
                    className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center gap-4 w-full px-2">
                        <button onClick={togglePlay} className="text-white hover:text-blue-500 transition-colors focus:outline-none">
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        </button>

                        <div className="flex-1 h-1 bg-white/40 rounded-full relative cursor-pointer group/bar" onClick={handleSeek}>
                            <div className="absolute left-0 h-1 bg-blue-500 rounded-full" style={{ width: `${progress}%` }}>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] opacity-0 group-hover/bar:opacity-100 transition-opacity translate-x-1/2 pointer-events-none"></div>
                            </div>
                        </div>

                        <div className="text-white/90 text-[11px] font-medium font-mono min-w-[70px] text-center shrink-0">
                            {currentTime}/{duration}
                        </div>

                        <div className="flex items-center gap-4 text-white/90 ml-2 shrink-0">
                            <button onClick={toggleMute} className="hover:text-blue-500 transition-colors focus:outline-none">
                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                            <div className="relative flex items-center">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); setSettingsView('main'); }}
                                    className={`hover:text-blue-500 transition-colors focus:outline-none ${showSettings ? 'text-blue-500' : ''}`}
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
                                            className="absolute bottom-full right-0 mb-4 bg-black/95 backdrop-blur-xl rounded-xl border border-white/10 w-[260px] overflow-hidden z-[110] text-white shadow-2xl origin-bottom-right shadow-black/50"
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
                                                <div className="py-2 flex flex-col max-h-[300px] overflow-y-auto relative custom-scrollbar">
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
                                                <div className="py-2 flex flex-col max-h-[300px] overflow-y-auto relative custom-scrollbar">
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
                            <button onClick={toggleFullscreen} className="hover:text-blue-500 transition-colors focus:outline-none">
                                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const VideosTab = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);

    return (
        <div className="w-full h-full relative z-10 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-[18px] font-black text-slate-800 dark:text-white">My Videos</h2>
                <span className="text-[13px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                    {mockVideos.length} files
                </span>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {mockVideos.map((video) => (
                    <motion.div
                        key={video.id}
                        whileHover={{ y: -4 }}
                        className="group bg-white dark:bg-[#1E1E2E] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all cursor-pointer flex flex-col"
                        onClick={() => setSelectedVideo(video)}
                    >
                        {/* Thumbnail Area */}
                        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                                    <Play className="w-5 h-5 text-white ml-1 fill-white" />
                                </div>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
                                {video.duration}
                            </div>
                        </div>

                        {/* Video Info */}
                        <div className="p-4">
                            <h3 className="text-[13px] font-bold text-slate-800 dark:text-white truncate mb-1" title={video.title}>
                                {video.title}
                            </h3>
                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {video.date}
                                </div>
                                <span>{video.size}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Video Player Overlay */}
            {createPortal(
                <AnimatePresence>
                    {selectedVideo && (
                        <VideoPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default VideosTab;

