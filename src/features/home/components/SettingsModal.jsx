import React, { useState } from 'react';
import { HelpCircle, ArrowLeft, Mail, Link as LinkIcon, CheckCircle2, ShieldCheck, HardDrive, DownloadCloud } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose }) => {
    const [shareMethod, setShareMethod] = useState('email');
    const [selfDestruct, setSelfDestruct] = useState(false);

    return (
        <div
            className={`absolute top-0 bottom-0 left-full w-[360px] bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] shadow-[20px_0_50px_rgba(0,0,0,0.1)] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-10 ${isOpen
                ? 'translate-x-0 opacity-100 visible rounded-r-[24px] rounded-l-none'
                : 'translate-x-full opacity-0 invisible rounded-[24px]'
                }`}
        >
            {/* Settings Header */}
            <div className="bg-gradient-to-r from-[#2b3a8c] to-[#1e2a6a] px-6 py-4 rounded-tr-[24px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <h3 className="text-[16px] font-bold text-white relative z-10 flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <HelpCircle className="w-4 h-4 text-white" />
                    </div>
                    Transfer Settings
                </h3>
                <p className="text-[12px] text-white/80 mt-1 relative z-10">Customize how your files are shared</p>
            </div>

            <div className="p-6 flex flex-col overflow-y-auto h-full scrollbar-hide py-6 space-y-6">
                {/* Share Method Section */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                            <HelpCircle className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="text-[14px] font-bold text-gray-900">Share Method</h4>
                            <p className="text-[11px] text-gray-500">Choose how recipients access your files</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            className={`relative overflow-hidden rounded-xl py-3 px-4 text-[13px] font-semibold transition-all duration-300 ${shareMethod === 'email'
                                ? 'bg-gradient-to-r from-[#2b3a8c] to-[#1e2a6a] text-white shadow-lg shadow-[#2b3a8c]/25 scale-105'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                            onClick={() => setShareMethod('email')}
                        >
                            {shareMethod === 'email' && (
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 animate-pulse"></div>
                            )}
                            <div className="relative z-10 flex flex-col items-center gap-1">
                                <Mail className="w-4 h-4" />
                                <span>Email</span>
                            </div>
                        </button>
                        <button
                            className={`relative overflow-hidden rounded-xl py-3 px-4 text-[13px] font-semibold transition-all duration-300 ${shareMethod === 'link'
                                ? 'bg-gradient-to-r from-[#2b3a8c] to-[#1e2a6a] text-white shadow-lg shadow-[#2b3a8c]/25 scale-105'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                            onClick={() => setShareMethod('link')}
                        >
                            {shareMethod === 'link' && (
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 animate-pulse"></div>
                            )}
                            <div className="relative z-10 flex flex-col items-center gap-1">
                                <LinkIcon className="w-4 h-4" />
                                <span>Link</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Self Destruct Section */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                            <HelpCircle className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                            <h4 className="text-[14px] font-bold text-gray-900">Auto-Delete</h4>
                            <p className="text-[11px] text-gray-500">Files self-destruct after download</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            className={`relative overflow-hidden rounded-xl py-3 px-4 text-[13px] font-semibold transition-all duration-300 ${!selfDestruct
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 scale-105'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                            onClick={() => setSelfDestruct(false)}
                        >
                            {!selfDestruct && (
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-pulse"></div>
                            )}
                            <div className="relative z-10 flex flex-col items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Keep</span>
                            </div>
                        </button>
                        <button
                            className={`relative overflow-hidden rounded-xl py-3 px-4 text-[13px] font-semibold transition-all duration-300 ${selfDestruct
                                ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25 scale-105'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                            onClick={() => setSelfDestruct(true)}
                        >
                            {selfDestruct && (
                                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 animate-pulse"></div>
                            )}
                            <div className="relative z-10 flex flex-col items-center gap-1">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Delete</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Password Protection Section */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                            <HelpCircle className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                            <h4 className="text-[14px] font-bold text-gray-900">Password Protection</h4>
                            <p className="text-[11px] text-gray-500">Add an extra layer of security</p>
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Enter password (optional)"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-[13px] text-gray-800 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 placeholder-gray-500 transition-all pr-10"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <ShieldCheck className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
