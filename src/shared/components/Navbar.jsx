import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo5.jpeg';

const navItems = [
    { name: "My Account", path: "/my-account" },
    { name: "Terms of service", path: "/terms" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-8 py-5 bg-transparent">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center transition-transform hover:scale-105 active:scale-95 z-50">
                <img src={logo} alt="Logo" className="h-8 md:h-12 w-auto object-contain rounded-md shadow-sm" title="SendByCloud" />
            </Link>

            {/* Right Side: Desktop Menu & Mobile Toggle */}
            <div className="flex items-center gap-4">
                {/* Desktop Nav Items */}
                <div className="hidden lg:flex items-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] px-2 py-1.5 border border-white/20 dark:border-zinc-800/50">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`px-4 py-2 rounded-full text-[14px] font-bold transition-all duration-200 ${isActive(item.path)
                                ? 'text-[#2e3e8e] dark:text-blue-400 bg-blue-50/80 dark:bg-blue-500/10'
                                : 'text-[#334155] dark:text-gray-300 hover:text-[#2e3e8e] dark:hover:text-white hover:bg-gray-50/50 dark:hover:bg-white/5'
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Auth Actions */}
                <div className="hidden sm:flex items-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] pl-5 pr-1.5 py-1.5 border border-white/20 dark:border-zinc-800/50 gap-3">
                    <Link to="/login" className="text-[14px] font-bold text-[#1e2a6a] dark:text-gray-300 hover:text-[#2e3e8e] dark:hover:text-white transition-colors pr-1">
                        Sign in
                    </Link>
                    <Link to="/register" className="px-5 py-2.5 rounded-full text-[14px] font-bold text-white bg-[#2e3e8e] hover:bg-[#1e2a6a] transition-all duration-200 shadow-md hover:shadow-lg active:scale-95">
                        Sign up
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex lg:hidden items-center justify-center w-11 h-11 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-white/20 dark:border-zinc-800/50 shadow-lg z-50 transition-transform active:scale-90"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                        <X className="w-6 h-6 text-[#2e3e8e] dark:text-gray-200" />
                    ) : (
                        <Menu className="w-6 h-6 text-[#2e3e8e] dark:text-gray-200" />
                    )}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                        />

                        {/* Menu Content */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[85%] max-w-xs bg-white dark:bg-zinc-950 shadow-2xl z-40 lg:hidden flex flex-col"
                        >
                            <div className="flex flex-col h-full pt-24 pb-10 px-6">
                                {/* Nav Links */}
                                <div className="flex flex-col gap-2 mb-10">
                                    <p className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2 px-4">Menu</p>
                                    {navItems.map((item, index) => (
                                        <motion.div
                                            key={item.path}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + index * 0.05 }}
                                        >
                                            <Link
                                                to={item.path}
                                                className={`flex items-center px-4 py-3.5 rounded-2xl text-[16px] font-bold transition-all ${isActive(item.path)
                                                    ? 'bg-blue-50 dark:bg-blue-500/10 text-[#2e3e8e] dark:text-blue-400'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                                    }`}
                                            >
                                                {item.name}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-auto flex flex-col gap-4">
                                    <p className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2 px-4">Account</p>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <Link
                                            to="/login"
                                            className="flex items-center gap-3 px-4 py-4 rounded-2xl text-[16px] font-bold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all shadow-sm"
                                        >
                                            <LogIn className="w-5 h-5 text-[#2e3e8e] dark:text-blue-400" />
                                            Sign in
                                        </Link>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <Link
                                            to="/register"
                                            className="flex items-center gap-3 px-4 py-4 rounded-2xl text-[16px] font-bold text-white bg-[#2e3e8e] hover:bg-[#1e2a6a] transition-all shadow-lg active:scale-95"
                                        >
                                            <UserPlus className="w-5 h-5" />
                                            Sign up
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;