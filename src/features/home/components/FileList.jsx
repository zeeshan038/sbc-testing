import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Folder, Plus, X, FilePlus, FolderPlus } from 'lucide-react';

const FileList = ({
    uploadedFiles,
    removeFile,
    formatBytes,
    handleFiles,
    fileInputRef,
    folderInputRef,
    onPreview,
    transferType,
    addMenuOpen,
    setAddMenuOpen,
    addMenuRef
}) => {
    return (
        <div className="flex flex-col gap-2">
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-1 overflow-hidden"
                >
                    <div className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto scrollbar-hide pr-1">
                        {uploadedFiles.map((file, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ delay: idx * 0.04 }}
                                className="flex items-center gap-2 bg-blue-50/80 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl px-2.5 py-1.5"
                            >
                                {file._isFolder ? (
                                    <Folder className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
                                ) : (
                                    <FileText className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
                                )}
                                <span className="text-[11px] font-semibold text-gray-700 dark:text-zinc-200 flex-1 truncate">{file.name}</span>
                                {file._isFolder && (
                                    <span className="text-[9px] font-bold text-blue-500 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-800/40 px-1.5 py-0.5 rounded-md shrink-0">
                                        {file.fileCount} {file.fileCount === 1 ? 'file' : 'files'}
                                    </span>
                                )}
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
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-visible"
            >
                <div className="flex items-center justify-between bg-gray-50/80 dark:bg-zinc-800/80 border border-gray-100/60 dark:border-zinc-700/60 rounded-xl px-2.5 py-1.5">
                    <div className="flex items-center gap-3">
                        <span className="text-[12px] font-semibold text-gray-600 dark:text-zinc-300 flex items-center gap-1.5">
                            {uploadedFiles.length} {uploadedFiles.length === 1 ? 'item' : 'items'}
                        </span>
                        <button
                            onClick={onPreview}
                            className="cursor-pointer text-[11px] font-bold text-gray-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-2 py-0.5 rounded-lg transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-800"
                        >
                            Preview
                        </button>
                    </div>

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
        </div>
    );
};

export default FileList;
