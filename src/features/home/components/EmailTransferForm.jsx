import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const EmailTransferForm = ({
    recipients,
    removeRecipient,
    recipientInput,
    setRecipientInput,
    handleRecipientKeyDown,
    handleRecipientBlur,
    senderEmail,
    setSenderEmail,
    message,
    setMessage,
    password,
    setPassword,
    isDownloadAble,
    setIsDownloadAble,
    expiresIn,
    setExpiresIn,
    transferType
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
        >
            <div className="flex flex-col gap-1.5 mb-2 pr-1">
                <div className="flex flex-col gap-1.5">
                    {recipients.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 px-0.5 mb-1">
                            {recipients.map((email, i) => (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    key={email}
                                    className="flex items-center gap-1.5 bg-[#efeff0] dark:bg-zinc-800 border border-transparent rounded-lg px-2.5 py-1 group/tag transition-all hover:bg-[#e4e4e5] dark:hover:bg-zinc-700"
                                >
                                    <span className="text-[11px] font-bold text-[#404145] dark:text-zinc-300 leading-none">{email}</span>
                                    <button
                                        onClick={() => removeRecipient(i)}
                                        className="text-[#95979d] hover:text-[#404145] dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors flex items-center justify-center cursor-pointer"
                                    >
                                        <X className="w-3 h-3 stroke-[3]" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                    <div className="relative group/input">
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 dark:group-focus-within/input:ring-blue-900/40 group-focus-within/input:border-blue-400 dark:group-focus-within/input:border-blue-500 group-focus-within/input:bg-white dark:group-focus-within/input:bg-zinc-900 group-hover/input:border-gray-300 dark:group-hover/input:border-zinc-600" />
                        <input
                            type="text"
                            value={recipientInput}
                            onChange={(e) => setRecipientInput(e.target.value)}
                            onKeyDown={handleRecipientKeyDown}
                            onBlur={handleRecipientBlur}
                            placeholder="Email to"
                            className="relative w-full bg-transparent outline-none text-[12px] text-gray-800 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-500 font-semibold px-2.5 py-1.5 z-10"
                        />
                    </div>
                </div>

                <div className="relative group/input">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 dark:group-focus-within/input:ring-blue-900/40 group-focus-within/input:border-blue-400 dark:group-focus-within/input:border-blue-500 group-focus-within/input:bg-white dark:group-focus-within/input:bg-zinc-900 group-hover/input:border-gray-300 dark:group-hover/input:border-zinc-600" />
                    <input
                        type="email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="Your email"
                        className="relative w-full bg-transparent outline-none text-[12px] text-gray-800 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-500 font-semibold px-2.5 py-1.5 z-10"
                    />
                </div>
                <div className="relative group/input">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 dark:group-focus-within/input:ring-blue-900/40 group-focus-within/input:border-blue-400 dark:group-focus-within/input:border-blue-500 group-focus-within/input:bg-white dark:group-focus-within/input:bg-zinc-900 group-hover/input:border-gray-300 dark:group-hover/input:border-zinc-600" />
                    <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} className="relative w-full bg-transparent outline-none text-[12px] text-gray-800 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-500 font-medium px-2.5 py-1.5 z-10 resize-none h-[45px]" />
                </div>

                {transferType === 'video' && (
                    <motion.div
                        animate={{
                            boxShadow: isDownloadAble ? '0 0 0 3px rgba(59,130,246,0.08)' : '0 0 0 0px rgba(59,130,246,0)',
                        }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-center justify-between border rounded-xl px-2.5 py-2 cursor-pointer transition-colors duration-300 ${isDownloadAble ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50' : 'bg-gray-50/80 dark:bg-zinc-800 border-gray-100 dark:border-zinc-700'}`}
                        onClick={() => setIsDownloadAble(prev => !prev)}
                    >
                        <div className="flex items-center gap-2">
                            <motion.div
                                animate={isDownloadAble ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 transition-colors duration-300 ${isDownloadAble ? 'bg-blue-100 dark:bg-blue-500/20' : 'bg-gray-100 dark:bg-zinc-700'}`}
                            >
                                🚫
                            </motion.div>
                            <div className="flex flex-col">
                                <span className={`text-[11px] font-bold transition-colors duration-300 ${isDownloadAble ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-zinc-300'}`}>
                                    Downloadable
                                </span>
                                <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-medium">Disable video downloads</span>
                            </div>
                        </div>
                        <div className={`relative w-9 h-5 rounded-full transition-colors duration-300 shrink-0 ${isDownloadAble ? 'bg-gradient-to-r from-blue-400 to-indigo-400 dark:from-blue-500 dark:to-indigo-500 shadow-[0_0_8px_rgba(59,130,246,0.4)] dark:shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-gray-200 dark:bg-zinc-700'}`}>
                            <motion.div
                                animate={{ x: isDownloadAble ? 16 : 2 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className="absolute top-[2px] w-4 h-4 bg-white dark:bg-zinc-100 rounded-full shadow-md"
                            />
                        </div>
                    </motion.div>
                )}

                <div>
                    <p className="text-[10px] text-gray-500 mb-1.5 mt-1">
                        Protect the upload with a password
                    </p>
                    <div className="relative group/input">
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 dark:group-focus-within/input:ring-blue-900/40 group-focus-within/input:border-blue-400 dark:group-focus-within/input:border-blue-500 group-focus-within/input:bg-white dark:group-focus-within/input:bg-zinc-900 group-hover/input:border-gray-300 dark:group-hover/input:border-zinc-600" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password"
                            className="relative w-full bg-transparent outline-none text-[12px] text-gray-800 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-500 font-semibold px-2.5 py-1.5 z-10"
                        />
                    </div>
                </div>

                <div className="mt-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">⏰ Expires in</p>
                    <div className="relative flex items-center bg-gray-100 dark:bg-zinc-800 rounded-xl p-[3px] gap-[2px]">
                        {[{ v: '1', l: '1d' }, { v: '3', l: '3d' }, { v: '7', l: '7d' }, { v: 'never', l: '∞' }].map(({ v, l }) => (
                            <button
                                key={v}
                                onClick={() => setExpiresIn(v)}
                                className="relative flex-1 text-center text-[10px] font-bold py-1 rounded-lg z-10 transition-colors duration-200 cursor-pointer"
                                style={{ color: expiresIn === v ? '#fff' : '#9ca3af' }}
                            >
                                {expiresIn === v && (
                                    <motion.span
                                        layoutId="expiry-pill-email"
                                        className="absolute inset-0 rounded-lg bg-[#2b3a8c] shadow-[0_2px_8px_rgba(43,58,140,0.4)]"
                                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                    />
                                )}
                                <span className="relative z-10">{l}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default EmailTransferForm;
