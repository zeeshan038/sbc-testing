import React from 'react';
import { Search, Trash2, Eye, Copy, HardDrive, Calendar, Clock, DownloadCloud, FileText, Share2, MoreVertical, X } from 'lucide-react';
import PreviewModal from '../../../shared/components/PreviewModal';
import { useState } from 'react';

const ReceivedFilesTab = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Sample modern data
    const receivedFiles = [
        {
            id: '8b1LvhIx',
            emailFrom: 'coderidrees@gmail.com',
            message: 'Project Assets & Movie clip',
            totalFiles: 3,
            size: '28.2 MB',
            date: 'Feb 21, 2026',
            expiresIn: '7 days',
            fileTypes: ['mp4', 'png', 'pdf']
        },
        {
            id: '9c2MwkJy',
            emailFrom: 'sarah.design@studio.com',
            message: 'Updated Branding Guidelines',
            totalFiles: 1,
            size: '12.4 MB',
            date: 'Feb 20, 2026',
            expiresIn: '6 days',
            fileTypes: ['pdf']
        },
    ];

    return (
        <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Received Files</h1>
                    <p className="text-[14px] text-gray-500 dark:text-zinc-400 mt-1">Manage and preview files shared with you securely.</p>
                </div>

                <div className="relative w-full md:w-[360px] group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-[18px] w-[18px] text-gray-400 dark:text-zinc-500 group-focus-within:text-[#2b3a8c] dark:group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by sender or file name..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl text-[14px] text-gray-800 dark:text-zinc-200 outline-none focus:border-[#2b3a8c] dark:focus:border-blue-500 focus:ring-4 focus:ring-[#2b3a8c]/10 dark:focus:ring-blue-500/10 transition-all shadow-sm placeholder:text-gray-400 dark:placeholder:text-zinc-500 font-medium"
                    />
                </div>
            </div>

            {/* Cards Container */}
            <div className="grid grid-cols-1 gap-4">
                {receivedFiles.map((file, idx) => (
                    <div
                        key={idx}
                        className="group bg-white dark:bg-zinc-900/50 border border-gray-100/80 dark:border-zinc-800 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-xl hover:shadow-[#2b3a8c]/5 dark:hover:shadow-blue-900/10 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    >
                        {/* Subtle decorative gradient background on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2b3a8c]/[0.02] dark:from-blue-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="flex items-start gap-5 w-full md:w-auto z-10">
                            {/* Icon Wrapper */}
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 dark:from-zinc-800 to-[#2b3a8c]/10 dark:to-blue-900/20 flex items-center justify-center flex-shrink-0 shadow-inner dark:shadow-none">
                                <DownloadCloud className="w-6 h-6 text-[#2b3a8c] dark:text-blue-400" strokeWidth={2} />
                            </div>

                            {/* Main Info */}
                            <div className="flex flex-col gap-2 flex-1 min-w-0">
                                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white truncate tracking-tight">{file.message}</h3>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] font-bold text-gray-500 dark:text-zinc-400">
                                    <div className="text-indigo-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-lg max-w-[220px] truncate">
                                        {file.emailFrom}
                                    </div>
                                    <span className="text-gray-300 dark:text-zinc-700 hidden sm:inline">•</span>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-zinc-800/50 rounded-lg text-gray-700 dark:text-zinc-300">
                                        <HardDrive className="w-3.5 h-3.5 text-gray-400" />
                                        <span>{file.size}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Metadata & Actions */}
                        <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto border-t md:border-t-0 border-gray-100 dark:border-zinc-800 pt-4 md:pt-0 z-10">

                            {/* Stats */}
                            <div className="flex items-center gap-6 text-[13px] font-medium w-full md:w-auto justify-between md:justify-end">
                                <div className="flex flex-col gap-1 items-start md:items-end">
                                    <span className="text-gray-400 dark:text-zinc-500 text-[11px] uppercase tracking-wider font-bold">Files</span>
                                    <div className="flex items-center gap-1.5 text-gray-700 dark:text-zinc-300">
                                        <FileText className="w-4 h-4 text-blue-400" />
                                        <span>{file.totalFiles} items</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 items-start md:items-end">
                                    <span className="text-gray-400 dark:text-zinc-500 text-[11px] uppercase tracking-wider font-bold">Expires</span>
                                    <div className="flex items-center gap-1.5 text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-md">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{file.expiresIn}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-px h-10 bg-gray-100 dark:bg-zinc-800"></div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <button
                                    onClick={() => {
                                        // Mock files based on the received file metadata
                                        const mockFiles = file.fileTypes.map((type, i) => ({
                                            name: `received-file-${i + 1}.${type}`,
                                            size: 204800, // 200KB
                                            type: type === 'pdf' ? 'application/pdf' : type === 'mp4' ? 'video/mp4' : 'image/jpeg'
                                        }));
                                        setSelectedFile({ ...file, files: mockFiles });
                                        setIsPreviewOpen(true);
                                    }}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2b3a8c] hover:bg-[#1e2a6a] dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-[13px] font-semibold rounded-xl transition-all shadow-md shadow-[#2b3a8c]/20 dark:shadow-blue-900/20 hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    <Eye className="w-4 h-4" />
                                    Preview
                                </button>

                                <div className="flex items-center gap-1.5">
                                    <button className="p-2.5 text-gray-400 dark:text-zinc-500 hover:text-[#2b3a8c] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors tooltip-trigger" title="Copy Link">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                    <button className="p-2.5 text-gray-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors tooltip-trigger" title="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {/* Premium Pagination */}
            <div className="flex items-center justify-between mt-4">
                <span className="text-[13px] font-medium text-gray-500 dark:text-zinc-400">Showing <strong className="text-gray-900 dark:text-white">1-2</strong> of <strong className="text-gray-900 dark:text-white">2</strong> files</span>
                <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                    <button className="px-4 py-2 text-[13px] font-semibold text-gray-400 dark:text-zinc-600 rounded-xl cursor-not-allowed">Prev</button>
                    <button className="w-9 h-9 flex items-center justify-center text-[13px] font-bold text-white bg-[#2b3a8c] dark:bg-blue-600 rounded-xl shadow-md shadow-[#2b3a8c]/20 dark:shadow-blue-900/20">1</button>
                    <button className="px-4 py-2 text-[13px] font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#2b3a8c] dark:hover:text-white rounded-xl transition-all">Next</button>
                </div>
            </div>

            <PreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                files={selectedFile?.files || []}
            />
        </div>
    );
};

export default ReceivedFilesTab;
