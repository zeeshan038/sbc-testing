import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DownloadCloud } from 'lucide-react';

const TransferHeader = ({ transferType, hasFiles, totalSize, formatBytes }) => {
    return (
        <div className="px-3 pt-2.5 pb-1.5 flex items-center justify-between border-b border-gray-100/80 dark:border-zinc-800 shrink-0">
            <h2 className="text-[12px] font-extrabold text-[#1e2a6a] dark:text-blue-400 flex items-center gap-1">
                <div className="bg-blue-100/50 dark:bg-blue-900/30 p-1 rounded-lg text-blue-600 dark:text-blue-400 shadow-inner dark:shadow-none">
                    <DownloadCloud className="w-3 h-3" />
                </div>
                Transfer {transferType === 'video' ? 'videos' : transferType}
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
    );
};

export default TransferHeader;
