import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu, ArrowUpRight } from 'lucide-react';
import logo from '../../assets/logo2.png';

const navItems = [
    { name: "My Account", path: "/my-account", num: "01", sub: "Manage your profile" },
    { name: "About Us", path: "/about", num: "02", sub: "Our story & mission" },
    { name: "Terms of Service", path: "/terms", num: "03", sub: "Legal information" },
    { name: "Contact Us", path: "/contact", num: "04", sub: "Get in touch" },
];

/* ── animation variants ── */
const overlayVariants = {
    hidden: { clipPath: 'circle(0% at calc(100% - 48px) 40px)' },
    visible: {
        clipPath: 'circle(170% at calc(100% - 48px) 40px)',
        transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
        clipPath: 'circle(0% at calc(100% - 48px) 40px)',
        transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] },
    },
};

const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: (i) => ({
        y: 0, opacity: 1,
        transition: { delay: 0.18 + i * 0.09, duration: 0.6, ease: [0.33, 1, 0.68, 1] },
    }),
    exit: (i) => ({
        y: -40, opacity: 0,
        transition: { delay: i * 0.04, duration: 0.3, ease: 'easeIn' },
    }),
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const [hovered, setHovered] = useState(null);

    const isActive = (path) =>
        location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <>
            {/* ── Top Bar ── */}
            <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-transparent">
                {/* Logo */}
                <Link to="/" className="flex items-center p-2 bg-white rounded-xl shadow-md hover:scale-105 transition-transform">
                    <img src={logo} alt="Logo" className="w-8 h-auto object-contain" />
                </Link>

                {/* Right: Auth + Hamburger */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100/80 p-1 gap-1">
                        <Link to="/login" className="px-4 py-2 rounded-lg text-[14px] font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#2b3a8c] transition-all">
                            Sign in
                        </Link>
                        <Link to="/register"
                            className="px-4 py-2 rounded-lg text-[14px] font-semibold text-white transition-all hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg, #2b3a8c, #1e2a6a)', boxShadow: '0 4px 12px rgba(43,58,140,0.3)' }}>
                            Sign up
                        </Link>
                    </div>

                    {/* Hamburger / Close toggle */}
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setIsOpen(v => !v)}
                        className="relative w-11 h-11 rounded-xl shadow-md border border-gray-100/80 flex items-center justify-center overflow-hidden transition-colors"
                        style={{
                            background: isOpen
                                ? 'linear-gradient(135deg, #2b3a8c, #1e2a6a)'
                                : 'rgba(255,255,255,0.9)',
                        }}
                        aria-label="Toggle navigation"
                    >
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.span key="close"
                                    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <X className="w-5 h-5 text-white" />
                                </motion.span>
                            ) : (
                                <motion.span key="open"
                                    initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <Menu className="w-5 h-5 text-gray-700" />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </nav>

            {/* ── Full-screen Overlay ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="overlay"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 z-[60] flex overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #0d1340 0%, #1a237e 50%, #1565c0 100%)' }}
                    >
                        {/* Aurora blobs */}
                        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full pointer-events-none"
                            style={{ background: 'radial-gradient(circle, rgba(99,120,230,0.4) 0%, transparent 65%)' }} />
                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                            className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
                            style={{ background: 'radial-gradient(circle, rgba(21,101,192,0.5) 0%, transparent 65%)' }} />
                        <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full pointer-events-none"
                            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />

                        {/* Grid overlay texture */}
                        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                        {/* ── Left side: Nav ── */}
                        <div className="relative z-10 flex flex-col justify-center pl-16 md:pl-24 lg:pl-32 pr-8 flex-1 py-28">

                            {/* Logo inside menu */}
                            <motion.div variants={itemVariants} custom={-1} initial="hidden" animate="visible" exit="exit"
                                className="mb-14">
                                <img src={logo} alt="Logo" className="w-28 h-auto object-contain opacity-80 brightness-0 invert" />
                            </motion.div>

                            {/* Nav Items */}
                            <div className="flex flex-col gap-1">
                                {navItems.map((item, i) => (
                                    <motion.div key={item.path} variants={itemVariants} custom={i}
                                        initial="hidden" animate="visible" exit="exit"
                                        onHoverStart={() => setHovered(i)}
                                        onHoverEnd={() => setHovered(null)}
                                    >
                                        <Link
                                            to={item.path}
                                            onClick={() => setIsOpen(false)}
                                            className="group flex items-baseline gap-5 py-3 select-none"
                                        >
                                            {/* Number */}
                                            <span className="text-[13px] font-bold text-white/25 tracking-widest tabular-nums min-w-[28px]">{item.num}</span>

                                            {/* Link text */}
                                            <span className="relative overflow-hidden">
                                                <span
                                                    className="block text-[clamp(2.2rem,5vw,4.2rem)] font-black leading-tight tracking-tight transition-colors duration-200"
                                                    style={{
                                                        color: isActive(item.path) ? '#93c5fd' : hovered === i ? '#ffffff' : 'rgba(255,255,255,0.65)',
                                                        WebkitTextStroke: hovered === i ? '0px' : '0px',
                                                    }}
                                                >
                                                    {item.name}
                                                </span>
                                                {/* animated underline */}
                                                <motion.span
                                                    className="absolute bottom-0 left-0 h-[2px] rounded-full"
                                                    style={{ background: 'linear-gradient(90deg, #60a5fa, #a78bfa)' }}
                                                    initial={{ width: '0%' }}
                                                    animate={{ width: hovered === i ? '100%' : '0%' }}
                                                    transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                                                />
                                            </span>

                                            {/* Arrow icon */}
                                            <motion.span
                                                animate={{ x: hovered === i ? 0 : -8, opacity: hovered === i ? 1 : 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="text-blue-300 mb-1"
                                            >
                                                <ArrowUpRight className="w-6 h-6" />
                                            </motion.span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Subtitle */}
                            <motion.p variants={itemVariants} custom={5} initial="hidden" animate="visible" exit="exit"
                                className="mt-12 text-[13px] text-white/25 font-medium tracking-widest uppercase">
                                Fast · Secure · Beautiful
                            </motion.p>
                        </div>

                        {/* ── Right side: Decorative panel ── */}
                        <motion.div
                            initial={{ opacity: 0, x: 60 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 60 }}
                            transition={{ delay: 0.25, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                            className="hidden lg:flex relative flex-col justify-between w-[360px] py-20 pr-16 pl-8 border-l border-white/5"
                        >
                            {/* Hovered item subtitle */}
                            <div className="mt-20">
                                <AnimatePresence mode="wait">
                                    {hovered !== null && (
                                        <motion.div key={hovered}
                                            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
                                            <p className="text-[12px] text-white/30 font-semibold uppercase tracking-[0.2em] mb-2">
                                                {navItems[hovered].num}
                                            </p>
                                            <p className="text-[22px] font-bold text-white/80 leading-snug">
                                                {navItems[hovered].name}
                                            </p>
                                            <p className="text-[14px] text-white/40 mt-1.5">{navItems[hovered].sub}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Bottom: version / branding */}
                            <div>
                                <div className="w-10 h-[1px] bg-white/20 mb-6" />
                                <p className="text-[12px] text-white/20 font-semibold tracking-widest uppercase mb-1">
                                    SendByCloud
                                </p>
                                <p className="text-[11px] text-white/15">© {new Date().getFullYear()} All rights reserved</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;