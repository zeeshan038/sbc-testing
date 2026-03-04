import React, { useState, useRef, useEffect } from 'react';
import {
    Plus, DownloadCloud, ChevronRight, X,
    File, Folder, Mail, Link as LinkIcon, Video,
    FileText, CheckCircle2, FolderPlus, FilePlus
} from 'lucide-react';
import { useUpload } from '../../../shared/context/UploadContext';
import SettingsModal from '../components/SettingsModal';
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
        linkShareType, setLinkShareType,
        selfDestruct, setSelfDestruct,
        expiresIn, setExpiresIn,
        handleFiles, removeFile,
        hasFiles
    } = useUpload();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [addMenuOpen, setAddMenuOpen] = useState(false);
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
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

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

            <main className="relative z-10 flex items-center h-[calc(100vh-140px)] px-6 md:px-12 lg:px-24 pointer-events-none pb-20 md:pb-0">

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

                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                    className={`w-[320px] bg-white/95 backdrop-blur-2xl border border-white shadow-[0_40px_100px_rgba(43,58,140,0.15)] flex flex-col pointer-events-auto relative z-20 transition-all duration-500 ring-1 ring-black/5 max-h-[500px] overflow-hidden ${isSettingsOpen ? 'rounded-l-[24px] rounded-r-none' : 'rounded-[24px]'}`}
                >
                    <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

                    <div className="flex flex-col h-full relative z-10 bg-white/40 rounded-[inherit] min-h-0">

                        <div className="px-3 pt-3 pb-2 flex items-center justify-between border-b border-gray-100/80 shrink-0">
                            <h2 className="text-[13px] font-extrabold text-[#1e2a6a] flex items-center gap-1.5">
                                <div className="bg-blue-100/50 p-1 rounded-lg text-blue-600 shadow-inner">
                                    <DownloadCloud className="w-3.5 h-3.5" />
                                </div>
                                Transfer files
                            </h2>
                        </div>

                        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2">

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
                                        <div className="flex gap-1.5 mb-2 p-0.5 bg-gray-50/80 rounded-xl border border-gray-100/50 relative overflow-hidden">
                                            {UPLOAD_TYPES.map(({ id, label, icon: Icon }) => (
                                                <motion.button
                                                    key={id}
                                                    onClick={() => setTransferType(id)}
                                                    className={`relative z-10 cursor-pointer flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${transferType === id ? 'text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                                                >
                                                    {transferType === id && (
                                                        <motion.div
                                                            layoutId="activeTab"
                                                            className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100"
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
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => fileInputRef.current?.click()}
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            className={`group relative border-2 border-dashed rounded-[20px] py-3 flex flex-col items-center justify-center text-center transition-all cursor-pointer overflow-hidden
                                            ${isDragging
                                                    ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                                                    : 'border-blue-200/80 bg-gradient-to-b from-[#f8fbff] to-white hover:border-blue-400 hover:bg-blue-50/50'
                                                }`}
                                        >
                                            <div className="absolute inset-0 bg-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center mb-1.5 shadow-[0_8px_16px_rgba(30,66,159,0.08)] group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 ring-1 ring-black/5">
                                                <Plus className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <span className="text-[13px] font-bold text-gray-800 mb-0.5 group-hover:text-blue-700 transition-colors">
                                                {isDragging ? 'Drop to upload' : `Upload ${transferType}`}
                                            </span>
                                            <span className="text-[11px] text-gray-500 font-medium px-4">
                                                Fast transfer up to <strong className="text-gray-700">50 GB</strong>
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
                                        <div className="flex flex-col gap-1.5 max-h-[90px] overflow-y-auto pr-1">
                                            {uploadedFiles.map((file, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    transition={{ delay: idx * 0.04 }}
                                                    className="flex items-center gap-2 bg-blue-50/80 border border-blue-100 rounded-xl px-2.5 py-1.5"
                                                >
                                                    <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                    <span className="text-[11px] font-semibold text-gray-700 flex-1 truncate">{file.name}</span>
                                                    <span className="text-[10px] text-gray-400 shrink-0">{formatBytes(file.size)}</span>
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
                                        <div className="flex items-center justify-between bg-gray-50/80 border border-gray-100/60 rounded-xl px-2.5 py-1.5">
                                            <span className="text-[12px] font-semibold text-gray-600 flex items-center gap-1.5">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                                                {uploadedFiles.length} {uploadedFiles.length === 1 ? 'item' : 'items'}
                                            </span>

                                            {/* + Add menu */}
                                            <div className="relative" ref={addMenuRef}>
                                                <motion.button
                                                    whileHover={{ scale: 1.06 }}
                                                    whileTap={{ scale: 0.94 }}
                                                    onClick={() => setAddMenuOpen(prev => !prev)}
                                                    className="cursor-pointer flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl px-2.5 py-1 transition-all"
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
                                                            className="absolute right-0 top-full mt-1.5 w-[150px] bg-white border border-gray-100 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.1)] overflow-hidden z-50"
                                                        >
                                                            <button
                                                                onClick={() => {
                                                                    setAddMenuOpen(false);
                                                                    fileInputRef.current?.click();
                                                                }}
                                                                className="cursor-pointer w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                                            >
                                                                <FilePlus className="w-3.5 h-3.5" />
                                                                Add File
                                                            </button>
                                                            <div className="h-px bg-gray-100 mx-2" />
                                                            <button
                                                                onClick={() => {
                                                                    setAddMenuOpen(false);
                                                                    folderInputRef.current?.click();
                                                                }}
                                                                className="cursor-pointer w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                                            >
                                                                <FolderPlus className="w-3.5 h-3.5" />
                                                                Add Folder
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
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
                                                                ? `${lightBg} ${lightText} border-transparent ring-2 ${ring} shadow-sm`
                                                                : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100 hover:text-gray-700'
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
                                                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 group-focus-within/input:border-blue-400 group-focus-within/input:bg-white group-hover/input:border-gray-300" />
                                                <input type="email" placeholder="Email to" className="relative w-full bg-transparent outline-none text-[12px] text-gray-800 placeholder-gray-400 font-semibold px-2.5 py-2 z-10" />
                                            </div>
                                            {/* Your email */}
                                            <div className="relative group/input">
                                                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 group-focus-within/input:border-blue-400 group-focus-within/input:bg-white group-hover/input:border-gray-300" />
                                                <input type="email" placeholder="Your email" className="relative w-full bg-transparent outline-none text-[12px] text-gray-800 placeholder-gray-400 font-semibold px-2.5 py-2 z-10" />
                                            </div>
                                            {/* Title */}
                                            <div className="relative group/input">
                                                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 group-focus-within/input:border-blue-400 group-focus-within/input:bg-white group-hover/input:border-gray-300" />
                                                <input type="text" placeholder="Title" className="relative w-full bg-transparent outline-none text-[12px] text-gray-800 placeholder-gray-400 font-semibold px-2.5 py-2 z-10" />
                                            </div>
                                            {/* Message */}
                                            <div className="relative group/input">
                                                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 group-focus-within/input:border-blue-400 group-focus-within/input:bg-white group-hover/input:border-gray-300" />
                                                <textarea placeholder="Message" className="relative w-full bg-transparent outline-none text-[12px] text-gray-800 placeholder-gray-400 font-medium px-2.5 py-2 z-10 resize-none h-[55px]" />
                                            </div>

                                            {/* Expires In */}
                                            <div className="flex items-center justify-between bg-gray-50/80 border border-gray-200 rounded-xl px-2.5 py-1.5 mt-1">
                                                <span className="text-[10px] font-bold text-gray-600 flex items-center gap-1">
                                                    Expires in
                                                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-300 text-gray-400 text-[9px] font-bold cursor-help">?</span>
                                                </span>
                                                <select
                                                    value={expiresIn}
                                                    onChange={(e) => setExpiresIn(e.target.value)}
                                                    className="bg-transparent outline-none text-[11px] font-bold text-[#2b3a8c] cursor-pointer border-none appearance-none pr-1"
                                                >
                                                    <option value="1">1 day</option>
                                                    <option value="2">2 days</option>
                                                    <option value="7">7 days</option>
                                                    <option value="14">14 days</option>
                                                    <option value="30">30 days</option>
                                                    <option value="never">Never</option>
                                                </select>
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
                                        <div className="flex flex-col gap-2">

                                            {/* Title + Message — only when 'Send using email' */}
                                            <AnimatePresence>
                                                {linkShareType === 'email' && (
                                                    <motion.div
                                                        key="link-email-fields"
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="overflow-hidden flex flex-col gap-2"
                                                    >
                                                        <div className="relative group/input">
                                                            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 group-focus-within/input:border-blue-400 group-focus-within/input:bg-white group-hover/input:border-gray-300" />
                                                            <input type="text" placeholder="Title" className="relative w-full bg-transparent outline-none text-[12px] text-gray-800 placeholder-gray-400 font-semibold px-2.5 py-2 z-10" />
                                                        </div>
                                                        <div className="relative group/input">
                                                            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 group-focus-within/input:border-blue-400 group-focus-within/input:bg-white group-hover/input:border-gray-300" />
                                                            <textarea placeholder="Message" className="relative w-full bg-transparent outline-none text-[12px] text-gray-800 placeholder-gray-400 font-medium px-2.5 py-2 z-10 resize-none h-[52px]" />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* How to share */}
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-600 mb-1 flex items-center gap-1">
                                                    How to share the file?
                                                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-300 text-gray-400 text-[9px] font-bold cursor-help">?</span>
                                                </p>
                                                <div className="flex items-center bg-gray-100/70 rounded-xl p-0.5 gap-0.5">
                                                    <button onClick={() => setLinkShareType('email')} className={`cursor-pointer flex-1 py-1.5 rounded-[10px] text-[11px] font-bold transition-all ${linkShareType === 'email' ? 'bg-[#2b3a8c] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Send using email</button>
                                                    <button onClick={() => setLinkShareType('link')} className={`cursor-pointer flex-1 py-1.5 rounded-[10px] text-[11px] font-bold transition-all ${linkShareType === 'link' ? 'bg-[#2b3a8c] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Get a sharable link</button>
                                                </div>
                                            </div>

                                            {/* Self Destruct */}
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-600 mb-1 flex items-center gap-1">
                                                    Enable self destruct?
                                                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-300 text-gray-400 text-[9px] font-bold cursor-help">?</span>
                                                </p>
                                                <div className="flex items-center bg-gray-100/70 rounded-xl p-0.5 gap-0.5">
                                                    <button onClick={() => setSelfDestruct(false)} className={`cursor-pointer flex-1 py-1.5 rounded-[10px] text-[11px] font-bold transition-all ${!selfDestruct ? 'bg-[#2b3a8c] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>No</button>
                                                    <button onClick={() => setSelfDestruct(true)} className={`cursor-pointer flex-1 py-1.5 rounded-[10px] text-[11px] font-bold transition-all ${selfDestruct ? 'bg-[#2b3a8c] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Yes</button>
                                                </div>
                                            </div>

                                            {/* Expires In */}
                                            <div className="flex items-center justify-between bg-gray-50/80 border border-gray-200 rounded-xl px-2.5 py-1.5">
                                                <span className="text-[10px] font-bold text-gray-600 flex items-center gap-1">
                                                    Expires in
                                                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-300 text-gray-400 text-[9px] font-bold cursor-help">?</span>
                                                </span>
                                                <select
                                                    value={expiresIn}
                                                    onChange={(e) => setExpiresIn(e.target.value)}
                                                    className="bg-transparent outline-none text-[11px] font-bold text-[#2b3a8c] cursor-pointer border-none appearance-none pr-1"
                                                >
                                                    <option value="1">1 day</option>
                                                    <option value="2">2 days</option>
                                                    <option value="7">7 days</option>
                                                    <option value="14">14 days</option>
                                                    <option value="30">30 days</option>
                                                    <option value="never">Never</option>
                                                </select>
                                            </div>

                                            {/* Password */}
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-600 mb-1 flex items-center gap-1">
                                                    Protect the upload with a password
                                                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-300 text-gray-400 text-[9px] font-bold cursor-help">?</span>
                                                </p>
                                                <div className="relative group/input">
                                                    <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 group-focus-within/input:border-blue-400 group-focus-within/input:bg-white group-hover/input:border-gray-300" />
                                                    <input type="password" placeholder="Password" className="relative w-full bg-transparent outline-none text-[12px] text-gray-800 placeholder-gray-400 font-semibold px-2.5 py-2 z-10" />
                                                </div>
                                            </div>

                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>{/* end scrollable content */}

                        {/* Transfer Button — pinned at bottom, never scrolls */}
                        <div className="px-3 pb-3 pt-2 shrink-0 border-t border-gray-100/60">
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
            </main>
        </div>
    );
};

export default Home;