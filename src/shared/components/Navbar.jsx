import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, selectIsAuthenticated, logOut } from '../../store/authSlice';
import logo from '../../assets/logo5.jpeg';

const navItems = [
    { name: "My Account", path: "/my-account" },
    { name: "Terms of service", path: "/terms" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
];

const Navbar = ({ onMenuToggle }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const currentUser = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        setIsMenuOpen(false);
        setIsUserDropdownOpen(false);
        if (onMenuToggle) onMenuToggle(false);
    }, [location.pathname]);

    const handleToggle = () => {
        const newState = !isMenuOpen;
        setIsMenuOpen(newState);
        if (onMenuToggle) onMenuToggle(newState);
    };

    const handleLogout = () => {
        dispatch(logOut());
        navigate('/login');
    };

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <nav className="absolute top-0 left-0 w-full z-50 px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3.5 bg-white dark:bg-zinc-950 md:bg-transparent md:dark:bg-transparent border-b border-gray-100 dark:border-zinc-900 md:border-none transition-all duration-300">
            <div className="flex items-center justify-between w-full relative max-w-[1600px] mx-auto">
                {/* Mobile: Burger Toggle (Left) */}
                <button
                    onClick={handleToggle}
                    className="flex md:hidden items-center justify-center w-8 h-8 z-[100] transition-transform active:scale-90"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                        <X className="w-6 h-6 text-black/70 dark:text-white/70" />
                    ) : (
                        <Menu className="w-6 h-6 text-black/70 dark:text-white/70" />
                    )}
                </button>

                {/* Logo (Centered on Mobile, Left on Desktop) */}
                <Link
                    to="/"
                    className="flex items-center transition-transform hover:scale-105 active:scale-95 z-10 
                               absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
                >
                    <img src={logo} alt="Logo" className="h-6 md:h-7 lg:h-9 w-auto object-contain rounded-md transition-all" title="SendByCloud" />
                </Link>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    {/* Desktop Nav Items */}
                    <div className="hidden md:flex items-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] px-1.5 lg:px-2 py-1 lg:py-1.5 border border-white/20 dark:border-zinc-800/50">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-[12px] lg:text-[14px] font-bold transition-all duration-200 ${isActive(item.path)
                                    ? 'text-[#2e3e8e] dark:text-blue-400 bg-blue-50/80 dark:bg-blue-500/10'
                                    : 'text-[#334155] dark:text-gray-300 hover:text-[#2e3e8e] dark:hover:text-white hover:bg-gray-50/50 dark:hover:bg-white/5'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile/Desktop Conditional Auth */}
                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/register"
                                className="text-[14px] md:hidden md:text-[15px] font-bold text-zinc-900 dark:text-zinc-100 px-2 hover:opacity-70 transition-opacity"
                            >
                                Sign up
                            </Link>

                            {/* Desktop Auth Actions */}
                            <div className="hidden md:flex items-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] pl-4 lg:pl-5 pr-1 lg:pr-1.5 py-1 lg:py-1.5 border border-white/20 dark:border-zinc-800/50 gap-2 lg:gap-3">
                                <Link to="/login" className="text-[12px] lg:text-[14px] font-bold text-[#1e2a6a] dark:text-gray-300 hover:text-[#2e3e8e] dark:hover:text-white transition-colors pr-1">
                                    Sign in
                                </Link>
                                <Link to="/register" className="px-3 lg:px-5 py-1.5 lg:py-2.5 rounded-full text-[12px] lg:text-[14px] font-bold text-white bg-[#2e3e8e] hover:bg-[#1e2a6a] transition-all duration-200 shadow-md hover:shadow-lg active:scale-95">
                                    Sign up
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div 
                            className="relative"
                            onMouseEnter={() => setIsUserDropdownOpen(true)}
                            onMouseLeave={() => setIsUserDropdownOpen(false)}
                        >
                            <div className="flex items-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] px-3 lg:px-4 py-1.5 lg:py-2 border border-white/20 dark:border-zinc-800/50 gap-2 lg:gap-3 cursor-pointer group">
                                <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-[#2e3e8e] flex items-center justify-center text-white">
                                    <UserIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                </div>
                                <span className="text-[12px] lg:text-[14px] font-black text-[#1e2a6a] dark:text-white">
                                    {currentUser?.name || 'User'}
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-400 transition-transform duration-300 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            <AnimatePresence>
                                {isUserDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden z-[120]"
                                    >
                                        <div className="p-4 border-b border-gray-50 dark:border-zinc-800">
                                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                                            <p className="text-[14px] font-bold text-gray-900 dark:text-white truncate">{currentUser?.email}</p>
                                        </div>
                                        <div className="p-1.5">
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[14px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group"
                                            >
                                                <span>Log out</span>
                                                <LogOut className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-[calc(100%+8px)] left-3 right-3 bg-white dark:bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[24px] z-[110] md:hidden border border-gray-100 dark:border-zinc-800 overflow-hidden"
                        >
                            <div className="flex flex-col py-4">
                                {navItems.map((item, index) => (
                                    <div key={item.path} className="flex flex-col">
                                        <Link
                                            to={item.path}
                                            className={`flex items-center justify-between px-6 py-4 transition-colors group ${index === 0 ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-800 dark:text-zinc-200'
                                                } hover:bg-gray-50 dark:hover:bg-white/5`}
                                        >
                                            <span className="text-[17px] font-semibold tracking-tight">
                                                {item.name}
                                            </span>
                                            {item.hasDropdown && (
                                                <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                                            )}
                                        </Link>
                                        <div className="mx-6 h-[1px] bg-gray-100/80 dark:bg-zinc-800/50" />
                                    </div>
                                ))}
                                {!isAuthenticated ? (
                                    <Link
                                        to="/login"
                                        className="flex items-center px-6 py-5 text-zinc-800 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <span className="text-[17px] font-semibold tracking-tight">Log in</span>
                                    </Link>
                                ) : (
                                    <div className="flex flex-col">
                                        <div className="px-6 py-4 bg-gray-50/50 dark:bg-white/5">
                                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                                            <p className="text-[15px] font-bold text-zinc-900 dark:text-white truncate">{currentUser?.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center justify-between px-6 py-5 text-red-600 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                        >
                                            <span className="text-[17px] font-semibold tracking-tight">Log out</span>
                                            <LogOut className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;