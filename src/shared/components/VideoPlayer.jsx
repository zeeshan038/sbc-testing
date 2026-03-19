import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoPlayer = ({ src, title, resolution, qualities = [], onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [duration, setDuration] = useState('0:00');
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [settingsView, setSettingsView] = useState('main');
    const [playbackRate, setPlaybackRate] = useState(1);
    const [quality, setQuality] = useState(resolution || 'Auto');
    const [currentSrc, setCurrentSrc] = useState(src);
    const [bufferedProgress, setBufferedProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const videoRef = useRef(null);
    const containerRef = useRef(null);

    // Sync with prop changes
    useEffect(() => {
        setCurrentSrc(src);
        setQuality(resolution || 'Auto');
    }, [src, resolution]);

    const handleQualityChange = (qObj) => {
        if (!videoRef.current) return;
        const time = videoRef.current.currentTime;
        const wasPlaying = isPlaying;
        
        // Only show loading if it takes longer than a brief moment
        setQuality(qObj.label);
        setCurrentSrc(qObj.url || qObj.key);
        setShowSettings(false);

        const onMetadata = () => {
            if (videoRef.current) {
                videoRef.current.currentTime = time;
                if (wasPlaying) {
                    // Force play if it was playing
                    const playPromise = videoRef.current.play();
                    if (playPromise !== undefined) {
                      playPromise.catch(() => {});
                    }
                }
                videoRef.current.removeEventListener('loadedmetadata', onMetadata);
            }
        };
        videoRef.current.addEventListener('loadedmetadata', onMetadata);
        // Also add onCanPlay as a fallback
        videoRef.current.addEventListener('canplay', onMetadata, { once: true });
    };

    const handleProgress = () => {
        if (videoRef.current) {
            const buffered = videoRef.current.buffered;
            const duration = videoRef.current.duration;
            if (buffered.length > 0 && duration > 0) {
                const end = buffered.end(buffered.length - 1);
                setBufferedProgress((end / duration) * 100);
            }
        }
    };

    const fmt = (t) => {
        if (isNaN(t)) return '0:00';
        const m = Math.floor(t / 60), s = Math.floor(t % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const togglePlay = (e) => {
        e?.stopPropagation();
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
        } else {
            videoRef.current.pause();
        }
    };

    const handleSeek = (e) => {
        e?.stopPropagation();
        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        if (videoRef.current && videoRef.current.duration) {
            videoRef.current.currentTime = pct * videoRef.current.duration;
        }
    };

    const toggleMute = (e) => {
        e?.stopPropagation();
        if (videoRef.current) { 
            videoRef.current.muted = !isMuted; 
            setIsMuted(!isMuted); 
        }
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
        <div ref={containerRef} className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()}>
            <video
                ref={videoRef}
                className="w-full h-full object-contain cursor-pointer"
                src={currentSrc}
                onTimeUpdate={() => {
                    const cur = videoRef.current;
                    if (cur) {
                        setCurrentTime(fmt(cur.currentTime));
                        if (cur.duration > 0) setProgress((cur.currentTime / cur.duration) * 100);
                    }
                    handleProgress();
                }}
                onProgress={handleProgress}
                onWaiting={() => setIsLoading(true)}
                onPlaying={() => setIsLoading(false)}
                onLoadedMetadata={() => { 
                    if (videoRef.current) {
                        setDuration(fmt(videoRef.current.duration));
                        setIsLoading(false);
                    }
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={togglePlay}
                playsInline
            />

            {/* Loading Spinner */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.5 }} // Delay spinner slightly to avoid flicker on fast loads
                        className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                    >
                        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Big play overlay */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div
                        className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center pointer-events-auto cursor-pointer hover:scale-110 transition-transform border border-white/20 shadow-2xl"
                        onClick={togglePlay}
                    >
                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                </div>
            )}

            {/* Bottom controls */}
            <div
                className="absolute bottom-0 left-0 w-full px-4 py-3 flex flex-col gap-2 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/20 rounded-full relative cursor-pointer group/bar" onClick={handleSeek}>
                    {/* Buffer Bar */}
                    <div 
                        className="absolute left-0 h-full bg-white/30 rounded-full transition-all duration-300" 
                        style={{ width: `${bufferedProgress}%` }} 
                    />
                    {/* Active Progress */}
                    <div className="absolute left-0 h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }}>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover/bar:scale-100 transition-transform translate-x-1/2 shadow-lg" />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors focus:outline-none">
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        </button>

                        <div className="flex items-center gap-2">
                            <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors focus:outline-none">
                                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>
                        </div>

                        <span className="text-white/90 text-xs font-medium tabular-nums">{currentTime} / {duration}</span>
                        {quality !== 'Auto' && (
                            <span className="px-1.5 py-0.5 bg-white/20 rounded text-[10px] font-bold text-white uppercase tracking-tight">
                                {quality}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Settings */}
                        <div className="relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowSettings(s => !s); setSettingsView('main'); }}
                                className={`text-white hover:text-blue-400 transition-colors focus:outline-none ${showSettings ? 'text-blue-400' : ''}`}
                            >
                                <Settings className="w-5 h-5" />
                            </button>
                            <AnimatePresence>
                                {showSettings && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-full right-0 mb-2 bg-[#18181b]/95 backdrop-blur-xl rounded-xl border border-white/10 w-48 overflow-hidden z-50 shadow-2xl"
                                    >
                                        {settingsView === 'main' && (
                                            <div className="py-1">
                                                <button className="w-full px-4 py-2.5 hover:bg-white/10 flex items-center justify-between text-xs font-medium transition-colors text-white border-b border-white/5" onClick={() => setSettingsView('speed')}>
                                                    <span className="flex items-center gap-2"><Settings className="w-3.5 h-3.5 opacity-50" /> Speed</span>
                                                    <span className="flex items-center text-[#2b3a8c] dark:text-blue-400 font-bold">{playbackRate === 1 ? 'Normal' : `${playbackRate}x`} <ChevronRight className="w-4 h-4 ml-1 opacity-50" /></span>
                                                </button>
                                                <button className="w-full px-4 py-2.5 hover:bg-white/10 flex items-center justify-between text-xs font-medium transition-colors text-white" onClick={() => setSettingsView('quality')}>
                                                    <span className="flex items-center gap-2">Quality</span>
                                                    <span className="flex items-center text-white/50">{quality} <ChevronRight className="w-4 h-4 ml-1 opacity-50" /></span>
                                                </button>
                                            </div>
                                        )}
                                        {settingsView === 'speed' && (
                                            <div className="py-1">
                                                <button className="w-full px-4 py-2 border-b border-white/5 flex items-center gap-2 text-xs font-bold text-white/50" onClick={() => setSettingsView('main')}>
                                                    <ChevronLeft className="w-4 h-4" /> Back
                                                </button>
                                                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                                                    <button key={rate} className="w-full px-4 py-2 hover:bg-white/10 flex items-center justify-between text-xs transition-colors text-white"
                                                        onClick={() => { setPlaybackRate(rate); if (videoRef.current) videoRef.current.playbackRate = rate; setShowSettings(false); }}>
                                                        <span>{rate === 1 ? 'Normal' : `${rate}x`}</span>
                                                        {playbackRate === rate && <Check className="w-4 h-4 text-blue-500" />}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {settingsView === 'quality' && (
                                            <div className="py-1">
                                                <button className="w-full px-4 py-2 border-b border-white/5 flex items-center gap-2 text-xs font-bold text-white/50" onClick={() => setSettingsView('main')}>
                                                    <ChevronLeft className="w-4 h-4" /> Back
                                                </button>
                                                {qualities.length > 0 ? (
                                                    qualities.map((q, idx) => (
                                                        <button key={idx} className="w-full px-4 py-2 hover:bg-white/10 flex items-center justify-between text-xs transition-colors text-white"
                                                            onClick={() => handleQualityChange(q)}>
                                                            <span className="flex items-center gap-2">
                                                                {q.label}
                                                                {q.isOriginal && <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1 rounded">ORIGINAL</span>}
                                                            </span>
                                                            {quality === q.label && <Check className="w-4 h-4 text-blue-500" />}
                                                        </button>
                                                    ))
                                                ) : (
                                                    ['1080p', '720p', '480p', '360p', '240p', '144p'].map(q => (
                                                        <button key={q} className="w-full px-4 py-2 hover:bg-white/10 flex items-center justify-between text-xs transition-colors text-white"
                                                            onClick={() => { setQuality(q); setShowSettings(false); }}>
                                                            <span>{q}</span>
                                                            {quality === q && <Check className="w-4 h-4 text-blue-500" />}
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors focus:outline-none">
                            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
