import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    CloudUpload,
    DownloadCloud,
    Image as ImageIcon,
    Users,
    Lock,
    Settings,
    LogOut,
    Cloud,
    Zap,
    ChevronDown
} from "lucide-react";

// Top navigation items
import { Video as VideoIcon } from "lucide-react";
const navItems = [
    { icon: CloudUpload, label: "My Uploads", path: "/my-account/uploads" },
    { icon: DownloadCloud, label: "Received", path: "/my-account/received" },
    { icon: VideoIcon, label: "Videos", path: "/my-account/videos" },
    { icon: ImageIcon, label: "Backgrounds", path: "/my-account/backgrounds" },
    { icon: Users, label: "Sub-users", path: "/my-account/sub-users" },
    { icon: Lock, label: "Security", path: "/my-account/password" },
    { icon: Settings, label: "Settings", path: "/my-account/settings" },
];

const Account = () => {
    const location = useLocation();
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const activeIdx = navItems.findIndex(
        (t, i) => location.pathname === t.path || (location.pathname === "/my-account" && i === 0)
    );

    return (
        <div className="min-h-screen w-full font-sans overflow-hidden bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">

            <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: 'radial-gradient(circle at 50% -20%, #e0e7ff 0%, transparent 60%)' }} />

            <header className="relative w-full z-40 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-3xl border-b border-indigo-50/80 dark:border-white/10 shadow-[0_4px_32px_rgba(0,0,0,0.03)] dark:shadow-none mt-[80px] lg:mt-[90px]">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-1 rounded-2xl shadow-inner dark:shadow-none">
                        {navItems.map((item, idx) => {
                            const isActive = idx === (activeIdx >= 0 ? activeIdx : 0);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onMouseEnter={() => setHoveredIdx(idx)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                    className="relative px-5 py-2.5 rounded-xl text-[13px] font-bold outline-none transition-colors z-10 block"
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="accountTopbarActive"
                                            className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5)] border border-slate-200/60 dark:border-white/10"
                                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                            style={{ zIndex: -1 }}
                                        />
                                    )}

                                    {!isActive && hoveredIdx === idx && (
                                        <motion.div
                                            layoutId="accountTopbarHover"
                                            className="absolute inset-0 bg-white/50 dark:bg-zinc-800/50 rounded-xl"
                                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                            style={{ zIndex: -1 }}
                                        />
                                    )}

                                    <div className="flex items-center gap-2">
                                        <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-600 dark:text-blue-400' : 'text-slate-400 dark:text-gray-400'}`} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className={`transition-colors ${isActive ? 'text-indigo-900 dark:text-white' : 'text-slate-500 dark:text-gray-400'}`}>{item.label}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Mobile Navigation - Horizontal Scrollable Tabs */}
                    <div className="lg:hidden flex-1 overflow-x-auto no-scrollbar py-2 -mx-2">
                        <div className="flex items-center gap-2 px-2 min-w-max">
                            {navItems.map((item, idx) => {
                                const isActive = idx === (activeIdx >= 0 ? activeIdx : 0);
                                return (
                                    <Link
                                        key={`mobile-${item.path}`}
                                        to={item.path}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[13px] font-bold transition-all whitespace-nowrap ${isActive
                                            ? 'bg-white dark:bg-zinc-800 text-indigo-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-white/10'
                                            : 'text-slate-500 dark:text-gray-400 bg-transparent'
                                            }`}
                                    >
                                        <item.icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-blue-400' : 'text-slate-400 dark:text-gray-400'}`} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="relative">


                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-3 w-64 bg-white dark:bg-zinc-900 backdrop-blur-xl border border-slate-200 dark:border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] rounded-[24px] p-2 z-50 overflow-hidden"
                                >
                                    <div className="p-4 bg-indigo-50/50 dark:bg-blue-900/20 rounded-[18px] mb-2 border border-indigo-100/50 dark:border-blue-500/20">
                                        <p className="text-[13px] font-bold text-slate-800 dark:text-white">Storage Usage</p>
                                        <div className="w-full h-1.5 bg-indigo-100 dark:bg-zinc-700 rounded-full my-3 overflow-hidden">
                                            <div className="h-full bg-indigo-500 dark:bg-blue-500 rounded-full" style={{ width: '84%' }} />
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-slate-500 dark:text-gray-400">42GB used</span>
                                            <span className="text-indigo-600 dark:text-blue-400">84%</span>
                                        </div>
                                    </div>

                                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[16px] transition-colors font-bold text-[13px] outline-none">
                                        <LogOut className="w-4 h-4" />
                                        Sign out of Account
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </header>

            <div className="pt-6 px-3 lg:px-6 pb-12 min-h-screen">
                <div className="max-w-7xl mx-auto flex gap-4 lg:gap-8">

                    {/* The Page Container */}
                    <div className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-[0_8px_40px_rgba(0,0,0,0.03)] dark:shadow-none rounded-[24px] lg:rounded-[32px] overflow-hidden min-h-[600px] transition-colors duration-300">
                        <div className="p-4 sm:p-6 lg:p-10 h-full text-slate-900 dark:text-white">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Account;