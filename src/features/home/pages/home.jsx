import React, { useState, useRef, useEffect } from 'react';
import {
    Plus, DownloadCloud, X,
    File, Folder, Mail, Link as LinkIcon, Video,
    FileText, CheckCircle2, FolderPlus, FilePlus
} from 'lucide-react';
import { useUpload } from '../../../shared/context/UploadContext';
import SettingsModal from '../components/SettingsModal';
import PreviewModal from '../../../shared/components/PreviewModal';
import { motion, AnimatePresence } from 'framer-motion';

const TRANSFER_METHODS = [
    {
        id: 'email',
        label: 'Email',
        icon: Mail,
        desc: 'Send to an email address',
        lightBg: 'bg-blue-50',
        lightText: 'text-blue-700',
        ring: 'ring-blue-500/20',
    },
    {
        id: 'link',
        label: 'Link',
        icon: LinkIcon,
        desc: 'Share a download link',
        lightBg: 'bg-blue-50',
        lightText: 'text-blue-700',
        ring: 'ring-blue-500/20',
    },
];

const Home = () => {
    const {
        transferType, setTransferType,
        uploadedFiles,
        selectedMethod, setSelectedMethod,
        selfDestruct, setSelfDestruct,
        expiresIn, setExpiresIn,
        message, setMessage,
        handleFiles, removeFile,
        hasFiles
    } = useUpload();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [addMenuOpen, setAddMenuOpen] = useState(false);
    const [plusClicked, setPlusClicked] = useState(false);
    const fileInputRef = useRef(null);
    const folderInputRef = useRef(null);
    const addMenuRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (addMenuRef.current && !addMenuRef.current.contains(e.target)) {
                setAddMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    };

    const totalSize = uploadedFiles.reduce((acc, file) => acc + file.size, 0);
    const MAX_SIZE = 7 * 1024 * 1024 * 1024;

    const UPLOAD_TYPES = [
        { id: 'files', label: 'Files', icon: File },
        { id: 'folders', label: 'Folders', icon: Folder },
        { id: 'video', label: 'Video', icon: Video },
    ];

    return (
        <div className="relative min-h-screen w-full font-sans text-gray-900 overflow-hidden bg-gradient-to-br from-[#f0f4f9] to-[#d6e4f9] pt-[85px] lg:pt-[90px]">

            <motion.div
                animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 1.1, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-400 opacity-20 rounded-full blur-[100px] pointer-events-none"
            />
            <motion.div
                animate={{ rotate: [360, 270, 180, 90, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500 opacity-15 rounded-full blur-[80px] pointer-events-none"
            />

            <main className="relative z-10 flex items-center justify-center lg:justify-between h-[calc(100vh-90px)] px-6 md:px-12 lg:px-32 pointer-events-none">


                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                    className={`w-[320px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-white dark:border-zinc-800 shadow-[0_40px_100px_rgba(43,58,140,0.15)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex flex-col pointer-events-auto relative z-20 transition-all duration-500 ring-1 ring-black/5 dark:ring-white/5 max-h-[500px] overflow-hidden ${isSettingsOpen ? 'rounded-l-[24px] rounded-r-none' : 'rounded-[24px]'}`}
                >
                    <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

                    <div className="flex flex-col h-full relative z-10 bg-white/40 dark:bg-zinc-900/40 rounded-[inherit] min-h-0">

                        <div className="px-3 pt-3 pb-2 flex items-center justify-between border-b border-gray-100/80 dark:border-zinc-800 shrink-0">
                            <h2 className="text-[13px] font-extrabold text-[#1e2a6a] dark:text-blue-400 flex items-center gap-1.5">
                                <div className="bg-blue-100/50 dark:bg-blue-900/30 p-1 rounded-lg text-blue-600 dark:text-blue-400 shadow-inner dark:shadow-none">
                                    <DownloadCloud className="w-3.5 h-3.5" />
                                </div>
                                Transfer files
                            </h2>
                            <AnimatePresence>
                                {hasFiles && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 bg-gray-50/80 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md border border-gray-100/50 dark:border-zinc-700/50"
                                    >
                                        <span className="text-[#2b3a8c] dark:text-blue-400">{formatBytes(totalSize)}</span> / 7 GB
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-2">

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
                                        <div className="flex gap-1.5 mb-2 p-0.5 bg-gray-50/80 dark:bg-zinc-800/80 rounded-xl border border-gray-100/50 dark:border-zinc-700/50 relative overflow-hidden">
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
                                                        <Icon className="w-3.5 h-3.5" />
                                                        {label}
                                                    </span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                className="hidden"
                                onChange={(e) => handleFiles(e.target.files)}
                            />
                            <input
                                ref={folderInputRef}
                                type="file"
                                multiple
                                webkitdirectory=""
                                directory=""
                                className="hidden"
                                onChange={(e) => handleFiles(e.target.files)}
                            />

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
                                            className={`relative border-2 border-dashed rounded-[20px] py-4 flex flex-col items-center justify-center text-center transition-colors cursor-pointer overflow-hidden group
                                                ${isDragging
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-blue-200/80 dark:border-blue-500/30 bg-gradient-to-b from-[#f8fbff] to-white dark:from-zinc-900 dark:to-zinc-800 hover:border-blue-400 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                                                }`}
                                        >
                                            {/* Background tint */}
                                            <motion.div
                                                className="absolute inset-0 bg-blue-400/5"
                                                initial={{ opacity: 0 }}
                                                variants={{ hovered: { opacity: 1 } }}
                                                transition={{ duration: 0.3 }}
                                            />

                                            {/* Plus button with animations */}
                                            <div className="relative w-14 h-14 flex items-center justify-center mb-3">
                                                {/* Orbiting ring */}
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
                                                {/* Second counter-orbiting ring */}
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
                                                {/* Burst ripple on click */}
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
                                                {/* White circle bg */}
                                                <motion.div
                                                    className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-full ring-1 ring-black/5 dark:ring-white/10"
                                                    initial={{ boxShadow: "0 6px 16px rgba(30,66,159,0.08)" }}
                                                    variants={{ hovered: { boxShadow: "0 12px 28px rgba(30,66,159,0.20)" } }}
                                                    transition={{ duration: 0.4 }}
                                                />
                                                {/* Plus icon */}
                                                <motion.div
                                                    className="relative z-10 text-blue-600"
                                                    initial={{ rotate: 0, scale: 1 }}
                                                    variants={{ hovered: { rotate: 45, scale: 1.2 } }}
                                                    whileTap={{ scale: 0.7, rotate: 90 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </motion.div>
                                            </div>

                                            <span
                                                className="text-[13px] font-bold mb-0.5 text-gray-800 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors"
                                            >
                                                {isDragging ? 'Drop to upload' : `Upload ${transferType}`}
                                            </span>
                                            <span className="text-[11px] text-gray-500 dark:text-zinc-400 font-medium px-4">
                                                Fast transfer up to <strong className="text-gray-700 dark:text-zinc-200">50 GB</strong>
                                            </span>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {hasFiles && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-2 overflow-hidden"
                                    >
                                        <div className="flex flex-col gap-1.5 max-h-[90px] overflow-y-auto scrollbar-hide pr-1">
                                            {uploadedFiles.map((file, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    transition={{ delay: idx * 0.04 }}
                                                    className="flex items-center gap-2 bg-blue-50/80 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl px-2.5 py-1.5"
                                                >
                                                    <FileText className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
                                                    <span className="text-[11px] font-semibold text-gray-700 dark:text-zinc-200 flex-1 truncate">{file.name}</span>
                                                    <span className="text-[10px] text-gray-400 dark:text-zinc-500 shrink-0">{formatBytes(file.size)}</span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {hasFiles && (
                                    <motion.div
                                        key="files-bar"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="overflow-visible mb-2"
                                    >
                                        <div className="flex items-center justify-between bg-gray-50/80 dark:bg-zinc-800/80 border border-gray-100/60 dark:border-zinc-700/60 rounded-xl px-2.5 py-1.5">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[12px] font-semibold text-gray-600 dark:text-zinc-300 flex items-center gap-1.5">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                                                    {uploadedFiles.length} {uploadedFiles.length === 1 ? 'item' : 'items'}
                                                </span>
                                                <button
                                                    onClick={() => setIsPreviewOpen(true)}
                                                    className="cursor-pointer text-[11px] font-bold text-gray-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-2 py-0.5 rounded-lg transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-800"
                                                >
                                                    Preview
                                                </button>
                                            </div>

                                            {/* + Add menu */}
                                            {transferType === 'video' ? (
                                                <motion.button
                                                    whileHover={{ scale: 1.06 }}
                                                    whileTap={{ scale: 0.94 }}
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="cursor-pointer flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-100 dark:border-blue-800 rounded-xl px-2.5 py-1 transition-all"
                                                >
                                                    Add video
                                                    <span className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                                                        <Plus className="w-2.5 h-2.5 text-white" />
                                                    </span>
                                                </motion.button>
                                            ) : (
                                                <div className="relative" ref={addMenuRef}>
                                                    <motion.button
                                                        whileHover={{ scale: 1.06 }}
                                                        whileTap={{ scale: 0.94 }}
                                                        onClick={() => setAddMenuOpen(prev => !prev)}
                                                        className="cursor-pointer flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-100 dark:border-blue-800 rounded-xl px-2.5 py-1 transition-all"
                                                    >
                                                        Add more
                                                        <span className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                                                            <Plus className="w-2.5 h-2.5 text-white" />
                                                        </span>
                                                    </motion.button>

                                                    <AnimatePresence>
                                                        {addMenuOpen && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.92, y: -4 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                exit={{ opacity: 0, scale: 0.92, y: -4 }}
                                                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                                                className="absolute right-0 top-full mt-1.5 w-[150px] bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.5)] overflow-hidden z-50"
                                                            >
                                                                <button
                                                                    onClick={() => {
                                                                        setAddMenuOpen(false);
                                                                        fileInputRef.current?.click();
                                                                    }}
                                                                    className="cursor-pointer w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-semibold text-gray-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                                                                >
                                                                    <FilePlus className="w-3.5 h-3.5" />
                                                                    Add File
                                                                </button>
                                                                <div className="h-px bg-gray-100 dark:bg-zinc-700 mx-2" />
                                                                <button
                                                                    onClick={() => {
                                                                        setAddMenuOpen(false);
                                                                        folderInputRef.current?.click();
                                                                    }}
                                                                    className="cursor-pointer w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-semibold text-gray-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                                                                >
                                                                    <FolderPlus className="w-3.5 h-3.5" />
                                                                    Add Folder
                                                                </button>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {hasFiles && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="mb-2"
                                    >
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">How to share?</p>
                                        <div className="flex gap-2">
                                            {TRANSFER_METHODS.map(({ id, label, icon: Icon, lightBg, lightText, ring }) => {
                                                const isActive = selectedMethod === id;
                                                return (
                                                    <motion.button
                                                        key={id}
                                                        whileHover={{ scale: 1.04 }}
                                                        whileTap={{ scale: 0.96 }}
                                                        onClick={() => setSelectedMethod(prev => prev === id ? null : id)}
                                                        className={`cursor-pointer relative flex items-center gap-1.5 py-1.5 px-3 rounded-xl border transition-all font-semibold text-[12px]
                                                        ${isActive
                                                                ? `${lightBg} ${lightText} border-transparent ring-2 ${ring} shadow-sm dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/40`
                                                                : 'bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-gray-100 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:text-gray-700 dark:hover:text-zinc-200'
                                                            }`}
                                                    >
                                                        <Icon className="w-3.5 h-3.5 relative z-10 shrink-0" />
                                                        <span className="relative z-10">{label}</span>
                                                        {isActive && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                            >
                                                                <CheckCircle2 className={`w-3 h-3 ${lightText}`} />
                                                            </motion.div>
                                                        )}
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Email Form — shown only when email method is selected */}
                            <AnimatePresence>
                                {selectedMethod === 'email' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.35, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex flex-col gap-1.5 mb-2 pr-1">
                                            {/* Email to */}
                                            <div className="relative group/input">
                                                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 dark:group-focus-within/input:ring-blue-900/40 group-focus-within/input:border-blue-400 dark:group-focus-within/input:border-blue-500 group-focus-within/input:bg-white dark:group-focus-within/input:bg-zinc-900 group-hover/input:border-gray-300 dark:group-hover/input:border-zinc-600" />
                                                <input type="email" placeholder="Email to" className="relative w-full bg-transparent outline-none text-[12px] text-gray-800 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-500 font-semibold px-2.5 py-2 z-10" />
                                            </div>
                                            {/* Your email */}
                                            <div className="relative group/input">
                                                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 dark:group-focus-within/input:ring-blue-900/40 group-focus-within/input:border-blue-400 dark:group-focus-within/input:border-blue-500 group-focus-within/input:bg-white dark:group-focus-within/input:bg-zinc-900 group-hover/input:border-gray-300 dark:group-hover/input:border-zinc-600" />
                                                <input type="email" placeholder="Your email" className="relative w-full bg-transparent outline-none text-[12px] text-gray-800 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-500 font-semibold px-2.5 py-2 z-10" />
                                            </div>
                                            {/* Message */}
                                            <div className="relative group/input">
                                                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 dark:group-focus-within/input:ring-blue-900/40 group-focus-within/input:border-blue-400 dark:group-focus-within/input:border-blue-500 group-focus-within/input:bg-white dark:group-focus-within/input:bg-zinc-900 group-hover/input:border-gray-300 dark:group-hover/input:border-zinc-600" />
                                                <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} className="relative w-full bg-transparent outline-none text-[12px] text-gray-800 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-500 font-medium px-2.5 py-2 z-10 resize-none h-[55px]" />
                                            </div>

                                            {/* Expires In — email */}
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
                                )}
                            </AnimatePresence>

                            {/* Link fields — shown when link method is selected */}
                            <AnimatePresence>
                                {selectedMethod === 'link' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.35, ease: "easeInOut" }}
                                        className="overflow-hidden mb-2"
                                    >
                                        <div className="flex flex-col gap-4">

                                            {/* Message Field */}
                                            <div className="relative group/input">
                                                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 dark:group-focus-within/input:ring-blue-900/40 group-focus-within/input:border-blue-400 dark:group-focus-within/input:border-blue-500 group-focus-within/input:bg-white dark:group-focus-within/input:bg-zinc-900 group-hover/input:border-gray-300 dark:group-hover/input:border-zinc-600" />
                                                <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} className="relative w-full bg-transparent outline-none text-[12px] text-gray-800 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-500 font-medium px-2.5 py-2 z-10 resize-none h-[60px]" />
                                            </div>

                                            {/* Self Destruct */}
                                            <motion.div
                                                animate={{
                                                    boxShadow: selfDestruct ? '0 0 0 3px rgba(239,68,68,0.08)' : '0 0 0 0px rgba(239,68,68,0)',
                                                }}
                                                transition={{ duration: 0.3 }}
                                                className={`flex items-center justify-between border rounded-xl px-2.5 py-2 cursor-pointer transition-colors duration-300 ${selfDestruct ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50' : 'bg-gray-50/80 dark:bg-zinc-800 border-gray-100 dark:border-zinc-700'}`}
                                                onClick={() => setSelfDestruct(prev => !prev)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <motion.div
                                                        animate={selfDestruct ? { scale: [1, 1.3, 1], rotate: [-5, 5, -5, 0] } : { scale: 1, rotate: 0 }}
                                                        transition={{ duration: 0.5 }}
                                                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 transition-colors duration-300 ${selfDestruct ? 'bg-red-100 dark:bg-red-500/20' : 'bg-gray-100 dark:bg-zinc-700'}`}
                                                    >
                                                        🔥
                                                    </motion.div>
                                                    <div className="flex flex-col">
                                                        <span className={`text-[11px] font-bold transition-colors duration-300 ${selfDestruct ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-zinc-300'}`}>
                                                            Self destruct
                                                        </span>
                                                        <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-medium">Delete after first download</span>
                                                    </div>
                                                </div>
                                                {/* Toggle Switch */}
                                                <div className={`relative w-9 h-5 rounded-full transition-colors duration-300 shrink-0 ${selfDestruct ? 'bg-gradient-to-r from-red-400 to-orange-400 dark:from-red-500 dark:to-orange-500 shadow-[0_0_8px_rgba(239,68,68,0.4)] dark:shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-gray-200 dark:bg-zinc-700'}`}>
                                                    <motion.div
                                                        animate={{ x: selfDestruct ? 16 : 2 }}
                                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                        className="absolute top-[2px] w-4 h-4 bg-white dark:bg-zinc-100 rounded-full shadow-md"
                                                    />
                                                </div>
                                            </motion.div>

                                            {/* Expires In — link */}
                                            <div>
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
                                                                    layoutId="expiry-pill-link"
                                                                    className="absolute inset-0 rounded-lg bg-[#2b3a8c] shadow-[0_2px_8px_rgba(43,58,140,0.4)]"
                                                                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                                                />
                                                            )}
                                                            <span className="relative z-10">{l}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Password */}
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-600 mb-1 flex items-center gap-1">
                                                    Protect the upload with a password
                                                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-300 text-gray-400 text-[9px] font-bold cursor-help">?</span>
                                                </p>
                                                <div className="relative group/input">
                                                    <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 dark:group-focus-within/input:ring-blue-900/40 group-focus-within/input:border-blue-400 dark:group-focus-within/input:border-blue-500 group-focus-within/input:bg-white dark:group-focus-within/input:bg-zinc-900 group-hover/input:border-gray-300 dark:group-hover/input:border-zinc-600" />
                                                    <input type="password" placeholder="Password" className="relative w-full bg-transparent outline-none text-[12px] text-gray-800 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-500 font-semibold px-2.5 py-2 z-10" />
                                                </div>
                                            </div>

                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>{/* end scrollable content */}

                        {/* Transfer Button — pinned at bottom, never scrolls */}
                        <div className="px-3 pb-3 pt-2 shrink-0 border-t border-gray-100/60 dark:border-zinc-800/60">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="cursor-pointer w-full text-white rounded-xl h-9 font-bold text-[13px] flex items-center justify-center gap-2 transition-all border bg-gradient-to-r from-[#2b3a8c] to-[#1e2a6a] hover:from-[#1e2a6a] hover:to-[#151e4d] shadow-[0_6px_16px_rgba(43,58,140,0.3)] hover:shadow-[0_10px_20px_rgba(43,58,140,0.4)] border-[#2b3a8c]"
                            >
                                Transfer
                            </motion.button>
                        </div>

                    </div>{/* end outer wrapper */}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative pointer-events-none hidden lg:flex flex-col items-end gap-6 z-0 max-w-xl pr-4"
                >
                    <h1 className="text-6xl font-black tracking-tight text-[#1e2a6a] text-right leading-[1.1]">
                        Send large files with <br /> absolute <span className="relative inline-block"><span className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 blur-lg opacity-30"></span><span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">simplicity</span></span>.
                    </h1>
                    <p className="text-lg font-medium text-gray-600 text-right max-w-md">
                        Fast, secure and beautifully designed. Share your heaviest projects without breaking a sweat.
                    </p>
                </motion.div>

                <PreviewModal
                    isOpen={isPreviewOpen}
                    onClose={() => setIsPreviewOpen(false)}
                    files={uploadedFiles}
                />
            </main>
        </div>
    );
};

export default Home;