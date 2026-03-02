import React, { useState } from 'react';
import { Plus, Link as LinkIcon, DownloadCloud, ChevronRight, X, File, Folder } from 'lucide-react';
import SettingsModal from '../components/SettingsModal';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [transferType, setTransferType] = useState('files'); // 'files' or 'folders'

    return (
        <div className="relative min-h-screen w-full font-sans text-gray-900 overflow-hidden bg-gradient-to-br from-[#f0f4f9] to-[#d6e4f9] pt-[85px] lg:pt-[90px]">
            {/* Abstract floating shapes for premium vibe */}
            <motion.div
                animate={{
                    rotate: [0, 90, 180, 270, 360],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-400 opacity-20 rounded-full blur-[100px] pointer-events-none"
            />
            <motion.div
                animate={{
                    rotate: [360, 270, 180, 90, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500 opacity-15 rounded-full blur-[80px] pointer-events-none"
            />

            {/* Main Container - Left Aligned */}
            <main className="relative z-10 flex items-center h-[calc(100vh-140px)] px-6 md:px-12 lg:px-24 pointer-events-none pb-20 md:pb-0">

                {/* Visual Content (Right side on desktop) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute right-24 pointer-events-none hidden lg:flex flex-col items-end gap-6 z-0 max-w-xl"
                >
                    <h1 className="text-6xl font-black tracking-tight text-[#1e2a6a] text-right leading-[1.1]">
                        Send large files with <br /> absolute <span className="relative inline-block"><span className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 blur-lg opacity-30"></span><span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">simplicity</span></span>.
                    </h1>
                    <p className="text-lg font-medium text-gray-600 text-right max-w-sm">
                        Fast, secure and beautifully designed. Share your heaviest projects without breaking a sweat.
                    </p>
                </motion.div>

                {/* White Transfer Card - Premium aesthetic */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                    className={`w-[320px] bg-white/95 backdrop-blur-2xl border border-white shadow-[0_40px_100px_rgba(43,58,140,0.15)] flex flex-col pointer-events-auto relative z-20 transition-all duration-500 ring-1 ring-black/5 ${isSettingsOpen ? 'rounded-l-[24px] rounded-r-none' : 'rounded-[24px]'}`}
                >
                    {/* Settings Modal (Slides out to the right) */}
                    <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

                    <div className="p-4 md:p-5 flex flex-col h-full relative z-10 bg-white/40 rounded-[inherit] overflow-hidden max-h-[480px]">

                        {/* Top Action Header */}
                        <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-gray-100/80">
                            <h2 className="text-[14px] font-extrabold text-[#1e2a6a] flex items-center gap-1.5">
                                <div className="bg-blue-100/50 p-1.5 rounded-xl text-blue-600 shadow-inner">
                                    <DownloadCloud className="w-4 h-4" />
                                </div>
                                Transfer files
                            </h2>
                        </div>

                        {/* Upload Types */}
                        <div className="flex gap-3 mb-3 p-1 bg-gray-50/80 rounded-2xl border border-gray-100/50 relative overflow-hidden">
                            <motion.button
                                onClick={() => setTransferType('files')}
                                className={`relative z-10 cursor-pointer flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-colors ${transferType === 'files' ? 'text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {transferType === 'files' && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-1.5"><File className="w-4 h-4" />Files</span>
                            </motion.button>
                            <motion.button
                                onClick={() => setTransferType('folders')}
                                className={`relative z-10 cursor-pointer flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-colors ${transferType === 'folders' ? 'text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {transferType === 'folders' && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-1.5"><Folder className="w-4 h-4" />Folders</span>
                            </motion.button>
                        </div>

                        {/* Drag and Drop Area */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative border-2 border-dashed border-blue-200/80 rounded-[20px] py-2.5 flex flex-col items-center justify-center text-center mb-3 bg-gradient-to-b from-[#f8fbff] to-white hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="w-8 h-16 bg-white rounded-full flex items-center justify-center mb-1.5 shadow-[0_8px_16px_rgba(30,66,159,0.08)] group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 ring-1 ring-black/5" style={{ borderRadius: '50%' }}>
                                <Plus className="w-4.5 h-4.5 text-blue-600" />
                            </div>
                            <span className="text-[13px] font-bold text-gray-800 mb-0.5 group-hover:text-blue-700 transition-colors">Upload {transferType}</span>
                            <span className="text-[11px] text-gray-500 font-medium px-4">Fast transfer up to <strong className="text-gray-700">50 GB</strong></span>
                        </motion.div>

                        {/* Forms - Scrollable */}
                        <div className="flex flex-col gap-2 mb-3 overflow-y-auto max-h-[240px] pr-2">
                            <div className="flex flex-col space-y-3">
                                <div className="relative group/input">
                                    <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 group-focus-within/input:border-blue-400 group-focus-within/input:bg-white group-hover/input:border-gray-300"></div>
                                    <input type="email" placeholder="Email to" className="relative w-full bg-transparent outline-none text-[13px] text-gray-800 placeholder-gray-400 font-semibold px-3 py-2.5 z-10" />
                                </div>
                                <div className="relative group/input">
                                    <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 group-focus-within/input:border-blue-400 group-focus-within/input:bg-white group-hover/input:border-gray-300"></div>
                                    <input type="email" placeholder="Your email" className="relative w-full bg-transparent outline-none text-[13px] text-gray-800 placeholder-gray-400 font-semibold px-3 py-2.5 z-10" />
                                </div>
                            </div>

                            {/* Title / Message */}
                            <div className="relative group/input mt-1">
                                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 group-focus-within/input:border-blue-400 group-focus-within/input:bg-white group-hover/input:border-gray-300"></div>
                                <input type="text" placeholder="Title" className="relative w-full bg-transparent outline-none text-[13px] text-gray-800 placeholder-gray-400 font-semibold px-3 py-2.5 z-10" />
                            </div>

                            <div className="relative group/input">
                                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 group-focus-within/input:border-blue-400 group-focus-within/input:bg-white group-hover/input:border-gray-300"></div>
                                <textarea placeholder="Message" className="relative w-full bg-transparent outline-none text-[13px] text-gray-800 placeholder-gray-400 font-medium px-3 py-2.5 z-10 resize-none h-[80px]" />
                            </div>
                        </div>

                        {/* Submit Button Area */}
                        <div className="flex items-center gap-3 mt-auto">


                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="cursor-pointer flex-1 bg-gradient-to-r from-[#2b3a8c] to-[#1e2a6a] hover:from-[#1e2a6a] hover:to-[#151e4d] text-white rounded-2xl h-12 font-bold text-[15px] flex items-center justify-center gap-2 transition-all shadow-[0_8px_20px_rgba(43,58,140,0.3)] hover:shadow-[0_12px_25px_rgba(43,58,140,0.4)] border border-[#2b3a8c]"
                            >
                                Transfer
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`cursor-pointer w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-all ${isSettingsOpen ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500/20 shadow-inner' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 shadow-sm border border-gray-200/50'}`}
                                onClick={() => setIsSettingsOpen(prev => !prev)}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={isSettingsOpen ? 'close' : 'open'}
                                        initial={{ opacity: 0, rotate: -90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: 90 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        {isSettingsOpen ? <X className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Home;