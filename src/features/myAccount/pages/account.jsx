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
        <div className="min-h-screen w-full font-sans overflow-hidden" style={{ background: '#f8fafc' }}>

            <div className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: 'radial-gradient(circle at 50% -20%, #e0e7ff 0%, transparent 60%)' }} />

            <header className="relative w-full z-40 bg-white/70 backdrop-blur-3xl border-b border-indigo-50/80 shadow-[0_4px_32px_rgba(0,0,0,0.03)] mt-[80px] lg:mt-[90px]">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                    <nav className="hidden lg:flex items-center gap-1.5 bg-slate-50 border border-slate-100 p-1 rounded-2xl shadow-inner">
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
                                            className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-200/60"
                                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                            style={{ zIndex: -1 }}
                                        />
                                    )}

                                    {!isActive && hoveredIdx === idx && (
                                        <motion.div
                                            layoutId="accountTopbarHover"
                                            className="absolute inset-0 bg-white/50 rounded-xl"
                                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                            style={{ zIndex: -1 }}
                                        />
                                    )}

                                    <div className="flex items-center gap-2">
                                        <item.icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className={isActive ? 'text-indigo-900' : 'text-slate-500'}>{item.label}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="relative">


                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-3 w-64 bg-white backdrop-blur-xl border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)] rounded-[24px] p-2 z-50 overflow-hidden"
                                >
                                    <div className="p-4 bg-indigo-50/50 rounded-[18px] mb-2 border border-indigo-100/50">
                                        <p className="text-[13px] font-bold text-slate-800">Storage Usage</p>
                                        <div className="w-full h-1.5 bg-indigo-100 rounded-full my-3 overflow-hidden">
                                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '84%' }} />
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-slate-500">42GB used</span>
                                            <span className="text-indigo-600">84%</span>
                                        </div>
                                    </div>

                                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-[16px] transition-colors font-bold text-[13px] outline-none">
                                        <LogOut className="w-4 h-4" />
                                        Sign out of Account
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </header>

            <div className="pt-6 px-4 pb-12 min-h-screen">
                <div className="max-w-7xl mx-auto flex gap-8">

                    {/* The Page Container */}
                    <div className="flex-1 bg-white border border-slate-200/80 shadow-[0_8px_40px_rgba(0,0,0,0.03)] rounded-[32px] overflow-hidden min-h-[600px]">
                        <div className="p-6 lg:p-10 h-full">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Account;