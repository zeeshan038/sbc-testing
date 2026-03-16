import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, File, Folder, Video } from 'lucide-react';

const DropZone = ({
    transferType,
    setTransferType,
    hasFiles,
    fileInputRef,
    folderInputRef,
    handleFiles
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [plusClicked, setPlusClicked] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);

    const UPLOAD_TYPES = [
        { id: 'files', label: 'Files', icon: File },
        { id: 'folders', label: 'Folders', icon: Folder },
        { id: 'video', label: 'Video', icon: Video },
    ];

    // Note: Icons are passed by name or we can pass the components. 
    // To keep it clean, let's just use the logic from Home.jsx.

    return (
        <>
            <AnimatePresence>
                {!hasFiles && (
                    <motion.div
                        key="type-toggle"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="flex gap-1.5 mb-1.5 p-0.5 bg-gray-50/80 dark:bg-zinc-800/80 rounded-xl border border-gray-100/50 dark:border-zinc-700/50 relative overflow-hidden">
                            {UPLOAD_TYPES.map(({ id, label, icon: Icon }) => (
                                <motion.button
                                    key={id}
                                    onClick={() => setTransferType(id)}
                                    className={`relative z-10 cursor-pointer flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${transferType === id ? 'text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200'}`}
                                >
                                    {transferType === id && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-white dark:bg-zinc-700 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-zinc-600"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-1">
                                        <Icon className="w-3 h-3" />
                                        {label}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!hasFiles && (
                    <motion.div
                        key="dropzone"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden mb-3"
                    >
                        <motion.div
                            whileHover="hovered"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                setPlusClicked(true);
                                transferType === 'folders' ? folderInputRef.current?.click() : fileInputRef.current?.click();
                            }}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={`relative border-2 border-dashed rounded-[18px] py-5 flex flex-col items-center justify-center text-center transition-colors cursor-pointer overflow-hidden group
                                ${isDragging
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-blue-200/80 dark:border-blue-500/30 bg-gradient-to-b from-[#f8fbff] to-white dark:from-zinc-900 dark:to-zinc-800 hover:border-blue-400 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                                }`}
                        >
                            <motion.div
                                className="absolute inset-0 bg-blue-400/5"
                                initial={{ opacity: 0 }}
                                variants={{ hovered: { opacity: 1 } }}
                                transition={{ duration: 0.3 }}
                            />

                            <div className="relative w-11 h-11 flex items-center justify-center mb-2">
                                <motion.div
                                    className="absolute inset-[-6px] rounded-full border-[2px] border-dashed border-blue-400"
                                    initial={{ opacity: 0, rotate: 0 }}
                                    variants={{ hovered: { opacity: 1 } }}
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                                        opacity: { duration: 0.3 }
                                    }}
                                />
                                <motion.div
                                    className="absolute inset-[-12px] rounded-full border border-blue-300/40"
                                    initial={{ opacity: 0, rotate: 0 }}
                                    variants={{ hovered: { opacity: 1 } }}
                                    animate={{ rotate: -360 }}
                                    transition={{
                                        rotate: { duration: 7, repeat: Infinity, ease: "linear" },
                                        opacity: { duration: 0.4, delay: 0.1 }
                                    }}
                                />
                                <AnimatePresence>
                                    {plusClicked && (
                                        <motion.div
                                            key="burst"
                                            className="absolute inset-0 rounded-full bg-blue-400"
                                            initial={{ scale: 0.6, opacity: 0.6 }}
                                            animate={{ scale: 2.8, opacity: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                            onAnimationComplete={() => setPlusClicked(false)}
                                        />
                                    )}
                                </AnimatePresence>
                                <motion.div
                                    className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-full ring-1 ring-black/5 dark:ring-white/10"
                                    initial={{ boxShadow: "0 6px 16px rgba(30,66,159,0.08)" }}
                                    variants={{ hovered: { boxShadow: "0 12px 28px rgba(30,66,159,0.20)" } }}
                                    transition={{ duration: 0.4 }}
                                />
                                <motion.div
                                    className="relative z-10 text-blue-600"
                                    initial={{ rotate: 0, scale: 1 }}
                                    variants={{ hovered: { rotate: 45, scale: 1.2 } }}
                                    whileTap={{ scale: 0.7, rotate: 90 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                                >
                                    <Plus className="w-4 h-4" />
                                </motion.div>
                            </div>

                            <span className="text-[13px] font-bold mb-0.5 text-gray-800 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                                {isDragging ? 'Drop to upload' : `Upload ${transferType}`}
                            </span>
                            <span className="text-[11px] text-gray-500 dark:text-zinc-400 font-medium px-4">
                                Fast transfer up to <strong className="text-gray-700 dark:text-zinc-200">50 GB</strong>
                            </span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default DropZone;
