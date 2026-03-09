import React, { useState } from 'react';
import { Image as ImageIcon, Plus, UploadCloud, Link as LinkIcon, Clock, Trash2, Eye, PlayCircle, Crown, Search, Settings2 } from 'lucide-react';

const BackgroundsTab = () => {
    const [isAdding, setIsAdding] = useState(false);

    const [backgrounds, setBackgrounds] = useState([
        {
            id: '1',
            fileName: 'Spring_Campaign_BG.jpg',
            url: 'https://mysite.com/spring',
            duration: '15s',
            size: '2.4 MB',
            status: 'Active'
        },
        {
            id: '2',
            fileName: 'Corporate_Video_Loop.mp4',
            url: 'https://mysite.com/promo',
            duration: '30s',
            size: '14.2 MB',
            status: 'Inactive'
        }
    ]);

    return (
        <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

            {/* Ultra-Premium Header & Trial Banner */}
            <div className="relative w-full overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1e2a6a] via-[#2b3a8c] to-[#4a55a2] dark:from-blue-900/80 dark:via-blue-800/80 dark:to-indigo-900/80 p-6 sm:p-8 md:p-12 shadow-xl shadow-[#2b3a8c]/20 dark:shadow-none border border-transparent dark:border-white/10">
                {/* Abstract shapes for premium feel */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-400 opacity-10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md border border-white/10 flex items-center gap-1.5 whitespace-nowrap">
                                <Crown className="w-3.5 h-3.5 text-yellow-300" /> Premium Trial
                            </span>
                            <span className="text-white/80 text-[12px] font-medium flex items-center gap-1.5 whitespace-nowrap">
                                <Clock className="w-3.5 h-3.5" /> 24 Days Left
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">Custom Backgrounds</h1>
                        <p className="text-white/70 text-[14px] sm:text-[15px] font-medium max-w-2xl leading-relaxed">
                            Transform your transfer pages into immersive brand experiences. Create a lasting impression with stunning full-screen images and high-definition video loops.
                        </p>
                    </div>

                    {!isAdding && (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-zinc-800 text-[#2b3a8c] dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-700 text-[14px] font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 whitespace-nowrap group self-start"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            Create New Background
                        </button>
                    )}
                </div>
            </div>

            {/* Smart Add Background Form Layout */}
            {isAdding && (
                <div className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[24px] p-6 sm:p-8 shadow-sm flex flex-col gap-6 sm:gap-8 animate-in fade-in slide-in-from-top-4 duration-500 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-6">
                        <h2 className="text-[20px] font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <span className="flex items-center justify-center w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-[#2b3a8c] dark:text-blue-400 rounded-xl">
                                <ImageIcon className="w-5 h-5" />
                            </span>
                            Setup Brand Background
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                        {/* Drag Area - Takes up 3 columns */}
                        <div className="lg:col-span-3 flex flex-col gap-3">
                            <label className="text-[13px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest pl-1">Media File</label>
                            <div className="w-full h-full min-h-[280px] border-2 border-dashed border-gray-200 dark:border-zinc-700 hover:border-[#2b3a8c] dark:hover:border-blue-500 bg-gray-50/50 dark:bg-zinc-800/30 hover:bg-[#2b3a8c]/[0.02] dark:hover:bg-blue-500/5 rounded-[20px] flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer group">
                                <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-zinc-500 group-hover:text-[#2b3a8c] dark:group-hover:text-blue-400 group-hover:scale-110 shadow-sm transition-all duration-300">
                                    <UploadCloud className="w-8 h-8" />
                                </div>
                                <div className="text-center px-6">
                                    <h4 className="text-[16px] font-bold text-gray-800 dark:text-white mb-1">Drag & drop your breathtaking media</h4>
                                    <p className="text-[14px] text-gray-400 dark:text-zinc-500 font-medium">JPEG, PNG, or MP4 up to 20MB</p>
                                </div>
                            </div>
                        </div>

                        {/* Settings - Takes up 2 columns */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <div className="flex flex-col gap-3">
                                <label className="text-[13px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest pl-1">Target URL <span className="text-gray-400 dark:text-zinc-500 font-normal lowercase">(Optional)</span></label>
                                <div className="relative group">
                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500 group-focus-within:text-[#2b3a8c] dark:group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="https://yourwebsite.com/campaign"
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-[14px] text-gray-800 dark:text-zinc-200 outline-none focus:bg-white dark:focus:bg-zinc-800 focus:border-[#2b3a8c] dark:focus:border-blue-500 focus:ring-4 focus:ring-[#2b3a8c]/10 dark:focus:ring-blue-500/10 transition-all font-medium"
                                    />
                                </div>
                                <p className="text-[12px] text-gray-400 dark:text-zinc-500 mt-1 pl-1">Make the entire background clickable for users.</p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-[13px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest pl-1">Display Duration</label>
                                <div className="relative group">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500 group-focus-within:text-[#2b3a8c] dark:group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        type="number"
                                        placeholder="e.g. 15 (seconds)"
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-[14px] text-gray-800 dark:text-zinc-200 outline-none focus:bg-white dark:focus:bg-zinc-800 focus:border-[#2b3a8c] dark:focus:border-blue-500 focus:ring-4 focus:ring-[#2b3a8c]/10 dark:focus:ring-blue-500/10 transition-all font-medium"
                                    />
                                </div>
                                <p className="text-[12px] text-gray-400 dark:text-zinc-500 mt-1 pl-1">Leave empty to loop infinitely or use default.</p>
                            </div>

                            <div className="mt-auto flex items-center justify-end gap-3 pt-6">
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="px-6 py-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 text-[14px] font-bold rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setBackgrounds([{ id: 'new', fileName: 'Newly_Added_Design.mp4', url: '-', duration: 'Default', size: 'Unknown', status: 'Active' }, ...backgrounds]);
                                        setIsAdding(false);
                                    }}
                                    className="px-8 py-3 bg-[#2b3a8c] dark:bg-blue-600 hover:bg-[#1e2a6a] dark:hover:bg-blue-700 text-white text-[14px] font-bold rounded-xl transition-all shadow-md shadow-[#2b3a8c]/20 dark:shadow-blue-900/20"
                                >
                                    Upload & Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* List / Empty State */}
            {!isAdding && (
                <div className="flex flex-col gap-6">
                    {/* Controls Row */}
                    {backgrounds.length > 0 && (
                        <div className="flex items-center justify-between">
                            <h3 className="text-[16px] font-bold text-gray-800 dark:text-white">Your Active Media</h3>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-400 dark:text-zinc-400 hover:text-[#2b3a8c] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"><Settings2 className="w-5 h-5" /></button>
                            </div>
                        </div>
                    )}

                    {backgrounds.length === 0 ? (
                        <div className="w-full border-2 border-dashed border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-900 rounded-[24px] flex flex-col items-center justify-center p-20 animate-in fade-in duration-500">
                            <div className="w-24 h-24 bg-white dark:bg-zinc-800 shadow-sm rounded-full flex items-center justify-center mb-6">
                                <ImageIcon className="w-10 h-10 text-gray-300 dark:text-zinc-600" strokeWidth={1.5} />
                            </div>
                            <h2 className="text-[20px] font-bold text-gray-800 dark:text-white mb-2">No aesthetic additions yet</h2>
                            <p className="text-gray-500 dark:text-zinc-400 text-[15px] font-medium max-w-sm text-center">
                                Upload beautiful images or videos to make your file transfers an extension of your brand identity.
                            </p>
                            <button
                                onClick={() => setIsAdding(true)}
                                className="mt-8 px-6 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-[#2b3a8c]/30 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-[#2b3a8c] dark:text-white text-[14px] font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
                            >
                                <UploadCloud className="w-4 h-4" /> Start Uploading
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5">
                            {backgrounds.map((bg, idx) => (
                                <div
                                    key={idx}
                                    className="group flex flex-col md:flex-row items-center gap-6 p-4 pr-6 bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-[20px] shadow-sm hover:shadow-xl hover:shadow-[#2b3a8c]/5 dark:hover:shadow-blue-900/10 transition-all duration-300 relative overflow-hidden"
                                >
                                    {/* Real-feel thumbnail area */}
                                    <div className="relative w-full md:w-[240px] h-[140px] md:h-[120px] rounded-[14px] bg-gray-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0 group-hover:shadow-md transition-shadow">
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/5 dark:bg-gray-800/20 group-hover:bg-gray-800/10 dark:group-hover:bg-gray-800/40 transition-colors">
                                            {bg.fileName.includes('mp4') ? <PlayCircle className="w-10 h-10 text-white shadow-sm opacity-80" /> : <ImageIcon className="w-8 h-8 text-white shadow-sm opacity-80" />}
                                        </div>
                                        {/* Status Badge inside image */}
                                        <div className="absolute top-3 right-3 flex">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white rounded-md shadow-sm backdrop-blur-md ${bg.status === 'Active' ? 'bg-emerald-500/80 dark:bg-emerald-600/80' : 'bg-gray-800/50 dark:bg-zinc-900/80'}`}>
                                                {bg.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Data Area */}
                                    <div className="flex flex-col gap-3 flex-1 w-full min-w-0">
                                        <h3 className="text-[18px] font-bold text-gray-900 dark:text-white truncate pr-4">{bg.fileName}</h3>

                                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[13px]">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-zinc-800/50 text-gray-600 dark:text-zinc-300 font-medium rounded-lg border border-transparent dark:border-zinc-700/50">
                                                <LinkIcon className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-400" />
                                                <span className="truncate max-w-[120px] sm:max-w-[200px]">{bg.url !== '-' ? bg.url : 'No Link'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-zinc-800/50 text-gray-600 dark:text-zinc-300 font-medium rounded-lg border border-transparent dark:border-zinc-700/50">
                                                <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-400" />
                                                <span>{bg.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-400 dark:text-zinc-500 font-medium ml-1">
                                                <span>{bg.size}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Large Action Buttons */}
                                    <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-zinc-800 mt-2 md:mt-0">
                                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#2b3a8c]/5 dark:bg-blue-900/20 hover:bg-[#2b3a8c] dark:hover:bg-blue-600 text-[#2b3a8c] dark:text-blue-400 hover:text-white dark:hover:text-white text-[14px] font-bold rounded-xl transition-all">
                                            Preview
                                        </button>
                                        <button
                                            onClick={() => setBackgrounds(backgrounds.filter(b => b.id !== bg.id))}
                                            className="p-3 text-gray-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent hover:border-red-100 dark:hover:border-red-500/20 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BackgroundsTab;
