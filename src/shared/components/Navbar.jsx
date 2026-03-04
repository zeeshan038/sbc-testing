import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo2.png';

const navItems = [
    { name: "My Account", path: "/my-account" },
    { name: "Terms of service", path: "/terms" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
];

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-5 bg-transparent">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center transition-transform hover:opacity-90">
                <img src={logo} alt="Logo" className="h-8 w-auto object-contain rounded-md" title="SendByCloud" />
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {/* Nav Menu Pill */}
                <div className="flex items-center bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.06)] px-2 py-1.5 border border-gray-100">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`px-4 py-2 rounded-full text-[14px] font-bold transition-colors ${isActive(item.path) ? 'text-[#1e2a6a] bg-blue-50/60' : 'text-[#334155] hover:text-[#1e2a6a]'
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Auth Pill */}
                <div className="flex items-center bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.06)] pl-5 pr-1.5 py-1.5 border border-gray-100 gap-3">
                    <Link to="/login" className="text-[14px] font-bold text-[#1e2a6a] hover:text-[#2b3a8c] transition-colors pr-1">
                        Sign in
                    </Link>

                    <Link to="/register" className="px-5 py-2.5 rounded-full text-[14px] font-bold text-white bg-[#2e3e8e] hover:bg-[#202c6b] transition-colors shadow-sm">
                        Sign up
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;