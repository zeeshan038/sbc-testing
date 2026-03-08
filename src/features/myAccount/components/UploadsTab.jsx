import React from 'react';
import { Search, Trash2, HardDrive, Calendar, Clock, CloudUpload, FileText, Share2, MoreVertical, Settings, DownloadCloud, Eye, X } from 'lucide-react';
import PreviewModal from '../../../shared/components/PreviewModal';
import { useState } from 'react';

const UploadsTab = () => {
    const [selectedUpload, setSelectedUpload] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Premium Dummy data
    const uploads = [
        {
            id: 'MydLEwbc',
            emailTo: 'zeeshandev038@gmail.com',
            message: 'Marketing Campaign Materials',
            size: '267.0 KB',
            date: 'Feb 22, 2026',
            status: 'Destroyed',
            downloads: 0,
            fileTypes: ['pdf', 'jpg']
        },
        {
            id: '6S6b9LCm',
            emailTo: 'Not specified',
            message: 'Company Q1 Report',
            size: '471.2 KB',
            date: 'Feb 22, 2026',
            status: 'Active',
            downloads: 1,
            fileTypes: ['pdf']
        },
        {
            id: 'FhCXDjQL',
            emailTo: 'zeeshandev038@gmail.com',
            message: 'Client Presentation',
            size: '42.4 KB',
            date: 'Feb 16, 2026',
            status: 'Destroyed',
            downloads: 2,
            fileTypes: ['pptx']
        },
    ];

    return (
        <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col xl:flex-row xl:items-center gap-4 xl:gap-6">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">My Uploads</h1>
                        <div className="inline-flex items-center gap-5 bg-white dark:bg-zinc-900 border-2 border-gray-100 dark:border-zinc-800 rounded-full px-6 py-3 shadow-md shrink-0">
                            <div className="flex items-center gap-2.5 text-[15px] md:text-[16px]">
                                <HardDrive className="w-5 h-5 text-[#2b3a8c] dark:text-blue-400" />
                                <span className="font-extrabold text-[#2b3a8c] dark:text-white tracking-tight">0 Bytes</span>
                                <span className="text-gray-400 dark:text-zinc-500 font-bold">/ 30.0 GB</span>
                            </div>
                            <div className="w-32 md:w-40 h-3 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner border border-gray-200/50 dark:border-zinc-700/50">
                                <div className="bg-gradient-to-r from-[#2b3a8c] to-blue-400 dark:from-blue-600 dark:to-blue-400 h-full rounded-full w-[2%] shadow-[0_0_12px_rgba(43,58,140,0.6)] dark:shadow-[0_0_12px_rgba(96,165,250,0.6)]" />
                            </div>
                        </div>
                    </div>
                    <p className="text-[15px] text-gray-500 dark:text-zinc-400 font-medium tracking-wide">Manage files you have sent safely and securely.</p>
                </div>

                <div className="relative w-full md:w-[360px] group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-[18px] w-[18px] text-gray-400 dark:text-zinc-500 group-focus-within:text-[#2b3a8c] dark:group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search transfers or emails..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl text-[14px] text-gray-800 dark:text-zinc-200 outline-none focus:border-[#2b3a8c] dark:focus:border-blue-500 focus:ring-4 focus:ring-[#2b3a8c]/10 dark:focus:ring-blue-500/10 transition-all shadow-sm placeholder:text-gray-400 dark:placeholder:text-zinc-500 font-medium"
                    />
                </div>
            </div>

            {/* Cards Container */}
            <div className="grid grid-cols-1 gap-4">
                {uploads.map((upload, idx) => (
                    <div
                        key={idx}
                        className="group bg-white dark:bg-zinc-900/50 border border-gray-100/80 dark:border-zinc-800 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-xl hover:shadow-[#2b3a8c]/5 dark:hover:shadow-blue-900/10 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    >
                        {/* Subtle decorative gradient background on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2b3a8c]/[0.02] dark:from-blue-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="flex items-start gap-5 w-full md:w-auto z-10">
                            {/* Icon Wrapper */}
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 dark:from-zinc-800 to-[#2b3a8c]/10 dark:to-blue-900/20 flex items-center justify-center flex-shrink-0 shadow-inner dark:shadow-none">
                                <CloudUpload className="w-6 h-6 text-[#2b3a8c] dark:text-blue-400" strokeWidth={2} />
                            </div>

                            {/* Main Info */}
                            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-[16px] font-bold text-gray-900 dark:text-white truncate">{upload.message}</h3>
                                    {upload.status === 'Destroyed' ? (
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-md border border-red-100 dark:border-red-500/20 hidden md:inline-block">Destroyed</span>
                                    ) : (
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-500/20 hidden md:inline-block">Active</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500 dark:text-zinc-400">
                                    <span className={`px-2 py-0.5 rounded-md ${upload.emailTo !== 'Not specified' ? 'text-gray-700 dark:text-zinc-300 bg-gray-100/50 dark:bg-zinc-800/50 block truncate max-w-[150px]' : 'text-gray-400 dark:text-zinc-500 italic'}`}>
                                        {upload.emailTo}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><HardDrive className="w-3.5 h-3.5" /> {upload.size}</span>
                                </div>
                            </div>
                        </div>

                        {/* Metadata & Actions */}
                        <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto border-t md:border-t-0 border-gray-100 dark:border-zinc-800 pt-4 md:pt-0 z-10">

                            {/* Stats */}
                            <div className="flex items-center gap-6 text-[13px] font-medium w-full md:w-auto justify-between md:justify-end">
                                <div className="flex flex-col gap-1 items-start md:items-end">
                                    <span className="text-gray-400 dark:text-zinc-500 text-[11px] uppercase tracking-wider font-bold">Downloads</span>
                                    <div className="flex items-center gap-1.5 text-gray-900 dark:text-white font-bold bg-gray-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                                        <DownloadCloud className="w-3.5 h-3.5 text-[#2b3a8c] dark:text-blue-400" />
                                        <span>{upload.downloads}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 items-start md:items-end">
                                    <span className="text-gray-400 dark:text-zinc-500 text-[11px] uppercase tracking-wider font-bold">Sent On</span>
                                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-zinc-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{upload.date}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-px h-10 bg-gray-100 dark:bg-zinc-800"></div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-2 w-full md:w-auto">
                                <button
                                    onClick={() => {
                                        // Mock files based on the upload metadata
                                        const mockFiles = upload.fileTypes.map((type, i) => ({
                                            name: `file-${i + 1}.${type}`,
                                            size: 153600, // 150KB
                                            type: type === 'pdf' ? 'application/pdf' : 'image/jpeg'
                                        }));
                                        setSelectedUpload({ ...upload, files: mockFiles });
                                        setIsPreviewOpen(true);
                                    }}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2b3a8c] hover:bg-[#1e2a6a] dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-[13px] font-semibold rounded-xl transition-all shadow-md shadow-[#2b3a8c]/20 dark:shadow-blue-900/20 hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    <Eye className="w-4 h-4" />
                                    Preview
                                </button>

                                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700/50 text-[13px] font-semibold rounded-xl transition-all shadow-sm">
                                    <Settings className="w-4 h-4" />
                                    Manage
                                </button>

                                <button className="p-2.5 text-gray-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors tooltip-trigger" title="Delete Transfer">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {/* Premium Pagination */}
            <div className="flex items-center justify-between mt-4">
                <span className="text-[13px] font-medium text-gray-500 dark:text-zinc-400">Showing <strong className="text-gray-900 dark:text-white">1-3</strong> of <strong className="text-gray-900 dark:text-white">3</strong> transfers</span>
                <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                    <button className="px-4 py-2 text-[13px] font-semibold text-gray-400 dark:text-zinc-600 rounded-xl cursor-not-allowed">Prev</button>
                    <button className="w-9 h-9 flex items-center justify-center text-[13px] font-bold text-white bg-[#2b3a8c] dark:bg-blue-600 rounded-xl shadow-md shadow-[#2b3a8c]/20 dark:shadow-blue-900/20">1</button>
                    <button className="px-4 py-2 text-[13px] font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 text-[#2b3a8c] dark:hover:text-white rounded-xl transition-all">Next</button>
                </div>
            </div>

            <PreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                files={selectedUpload?.files || []}
            />
        </div>
    );
};

export default UploadsTab;
