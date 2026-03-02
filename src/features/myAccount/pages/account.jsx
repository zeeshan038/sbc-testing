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
    User,
} from "lucide-react";

const tabs = [
    { icon: CloudUpload, label: "My Uploads", sub: "Files you've sent", path: "/my-account/uploads", color: "#6366f1" },
    { icon: DownloadCloud, label: "Received Files", sub: "Files sent to you", path: "/my-account/received", color: "#0ea5e9" },
    { icon: ImageIcon, label: "Backgrounds", sub: "Custom themes", path: "/my-account/backgrounds", color: "#ec4899" },
    { icon: Users, label: "Sub-users", sub: "Team management", path: "/my-account/sub-users", color: "#10b981" },
    { icon: Lock, label: "Password", sub: "Security settings", path: "/my-account/password", color: "#f59e0b" },
    { icon: Settings, label: "My Account", sub: "Account preferences", path: "/my-account/settings", color: "#8b5cf6" },
];

const COLLAPSED = 72;
const EXPANDED = 252;

const Account = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [hoveredIdx, setHoveredIdx] = useState(null);

    const activeIdx = tabs.findIndex(
        (t, i) => location.pathname === t.path || (location.pathname === "/my-account" && i === 0)
    );
    const active = tabs[activeIdx >= 0 ? activeIdx : 0];

    return (
        <div className="w-full h-screen flex overflow-hidden bg-[#f4f6fb] pt-[85px] lg:pt-[90px]">

            {/* ── Sidebar Rail ── */}
            <motion.aside
                animate={{ width: open ? EXPANDED : COLLAPSED }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                onHoverStart={() => setOpen(true)}
                onHoverEnd={() => setOpen(false)}
                className="relative flex-shrink-0 flex flex-col h-full overflow-hidden select-none z-10"
                style={{
                    background: "#ffffff",
                    borderRight: "1px solid #e5e7eb",
                    boxShadow: open ? "4px 0 24px rgba(99,102,241,0.07)" : "none",
                }}
            >
                {/* ── Nav Items ── */}
                <nav className="flex flex-col gap-0.5 px-2 py-4 flex-1 overflow-hidden">
                    {/* Sliding active pill */}
                    {tabs.map((tab, idx) => {
                        const isActive = idx === (activeIdx >= 0 ? activeIdx : 0);
                        return (
                            <Link
                                key={tab.path}
                                to={tab.path}
                                className="relative flex items-center gap-3 h-11 rounded-xl px-2.5 cursor-pointer group"
                                onMouseEnter={() => setHoveredIdx(idx)}
                                onMouseLeave={() => setHoveredIdx(null)}
                            >
                                {/* Active / hover background */}
                                {isActive && (
                                    <motion.div
                                        layoutId="navPill"
                                        className="absolute inset-0 rounded-xl"
                                        style={{
                                            background: `${tab.color}12`,
                                            border: `1.5px solid ${tab.color}25`,
                                        }}
                                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                                    />
                                )}
                                {!isActive && (
                                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                         />
                                )}

                                {/* Icon */}
                                <div
                                    className="relative w-8 h-8 flex-shrink-0 rounded-xl flex items-center justify-center transition-all"
                                    style={{
                                        background: isActive ? `${tab.color}18` : "transparent",
                                    }}
                                >
                                    <tab.icon
                                        className="w-4 h-4 transition-colors duration-150"
                                        style={{ color: isActive ? tab.color : "#1f2937" }}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                </div>

                                {/* Label */}
                                <AnimatePresence>
                                    {open && (
                                        <motion.div
                                            key={`label-${idx}`}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -8 }}
                                            transition={{ duration: 0.14 }}
                                            className="flex-1 min-w-0 overflow-hidden"
                                        >
                                            <p
                                                className="text-[13px] font-bold whitespace-nowrap truncate"
                                                style={{ color: isActive ? tab.color : "#1f2937" }}
                                            >
                                                {tab.label}
                                            </p>
                                            <p className="text-[11px] font-medium whitespace-nowrap truncate" style={{ color: "#6b7280" }}>{tab.sub}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Active indicator dot (collapsed) */}
                                <AnimatePresence>
                                    {isActive && !open && (
                                        <motion.div
                                            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                            className="absolute right-1.5 top-1.5 w-1.5 h-1.5 rounded-full"
                                            style={{ background: tab.color }}
                                        />
                                    )}
                                </AnimatePresence>
                            </Link>
                        );
                    })}
                </nav>

                {/* ── Log Out ── */}
                <div className="px-2 pb-5 border-t border-gray-100 pt-3">
                    <button className="relative flex items-center gap-3 h-11 w-full rounded-xl px-2.5 group cursor-pointer transition-all hover:bg-red-50">
                        <div className="w-8 h-8 flex-shrink-0 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-all">
                            <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" strokeWidth={2} />
                        </div>
                        <AnimatePresence>
                            {open && (
                                <motion.span
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.14 }}
                                    className="text-[13px] font-bold text-gray-400 group-hover:text-red-500 transition-colors whitespace-nowrap"
                                >
                                    Log out
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.aside>

            {/* ── Main Content ── */}
            <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                {/* Outlet */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Account;