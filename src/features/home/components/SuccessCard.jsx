import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, Check } from 'lucide-react';

const SuccessCard = ({ shareLink, onReset, isDownloadAble }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center h-full">
            {/* Celebration Icon */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-100/50 rounded-full blur-2xl transform scale-150 opacity-50" />
                <div className="relative">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Confetti / Party Popper Style */}
                        <path d="M45 75L35 85M45 75L70 50" stroke="#2b3a8c" strokeWidth="4" strokeLinecap="round"/>
                        <circle cx="85" cy="35" r="5" fill="#f43f5e" />
                        <rect x="25" y="45" width="8" height="8" rx="2" transform="rotate(25 25 45)" fill="#2b3a8c" />
                        <path d="M100 65C100 65 105 70 110 65" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
                        <path d="M20 20L30 30" stroke="#2b3a8c" strokeWidth="3" strokeLinecap="round"/>
                        {/* Simple Success/Link Icon focus */}
                        <path d="M40 80L80 40" stroke="#2b3a8c" strokeWidth="5" strokeLinecap="round"/>
                        <path d="M65 85C65 85 75 95 85 85" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M25 60C25 60 35 55 40 65" stroke="#2b3a8c" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    {/* Floating Success Check */}
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full shadow-lg"
                    >
                        <CheckCircle2 className="w-6 h-6" />
                    </motion.div>
                </div>
            </div>

            <h2 className="text-[28px] font-extrabold text-[#111827] dark:text-gray-100 mb-1">Success!</h2>
            {isDownloadAble && (
                <div className="flex justify-center mb-3">
                    <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-900/40">
                       🚫 Download Restricted
                    </span>
                </div>
            )}
            <p className="text-[15px] text-gray-500 dark:text-zinc-400 font-medium leading-relaxed mb-8">
                Your file(s) have been uploaded, you<br /> can use the link below.
            </p>

            {/* Link Input Field */}
            <div className="w-full mb-8">
                <div className="relative group">
                    <input 
                        type="text" 
                        readOnly 
                        value={shareLink}
                        className="w-full bg-white dark:bg-zinc-800 border-2 border-gray-100 dark:border-zinc-700 rounded-2xl px-4 py-4 text-[14px] font-semibold text-gray-700 dark:text-zinc-300 outline-none pr-12 focus:border-blue-500 transition-all shadow-sm"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Primary Action Button */}
            <button 
                onClick={handleCopy}
                className="w-full bg-[#2b3a8c] hover:bg-[#1a235a] text-white rounded-full py-4 font-bold text-[16px] shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-2 group relative overflow-hidden active:scale-[0.98]"
            >
                {copied ? (
                    <>
                        <Check className="w-5 h-5" />
                        Copied!
                    </>
                ) : (
                    <>
                        <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Copy URL
                    </>
                )}
            </button>

            {/* Secondary Action */}
            <button 
                onClick={onReset}
                className="mt-6 text-[14px] font-bold text-gray-400 hover:text-[#2b3a8c] transition-colors"
            >
                Send more files
            </button>
        </div>
    );
};

export default SuccessCard;
