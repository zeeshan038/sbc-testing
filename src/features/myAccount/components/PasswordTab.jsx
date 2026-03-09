import { useState } from 'react';
import {
    Eye,
    EyeOff,
    ShieldCheck,
    KeyRound,
    Mail,
    Smartphone,
    Info,
    AlertCircle
} from 'lucide-react';

const PasswordTab = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showReEnterPassword, setShowReEnterPassword] = useState(false);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    return (
        <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

            {/* Ultra-Premium Hero Banner */}
            <div className="relative w-full overflow-hidden rounded-[24px] bg-gradient-to-br from-[#111827] via-[#1e2a6a] to-[#2b3a8c] dark:from-zinc-900/90 dark:via-blue-900/80 dark:to-indigo-900/80 p-6 sm:p-8 md:p-12 shadow-xl shadow-[#2b3a8c]/20 dark:shadow-none border border-transparent dark:border-white/10">
                {/* Abstract glowing shapes */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-400 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500 opacity-10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md border border-emerald-500/20 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5" /> Account Protected
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">Security Settings</h1>
                    <p className="text-white/70 text-[14px] sm:text-[15px] font-medium max-w-2xl leading-relaxed">
                        Manage your password and advanced security preferences. We recommend keeping Two-Factor Authentication enabled for maximum protection.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">

                {/* Left Column: Password Update Module */}
                <div className="xl:col-span-3 flex flex-col gap-6">
                    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[24px] p-8 shadow-sm relative overflow-hidden group hover:shadow-lg hover:shadow-[#2b3a8c]/5 dark:hover:shadow-blue-900/10 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 dark:from-blue-900/20 to-transparent rounded-bl-full opacity-50 pointer-events-none"></div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-blue-50/80 dark:bg-blue-900/20 text-[#2b3a8c] dark:text-blue-400 rounded-2xl flex items-center justify-center shadow-inner dark:shadow-none">
                                <KeyRound className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-[20px] font-bold text-gray-900 dark:text-white">Change Password</h2>
                                <p className="text-[13px] text-gray-500 dark:text-zinc-400 font-medium mt-0.5">Ensure your account is using a long, random password to stay secure.</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-widest pl-1">Current Password</label>
                                <div className="relative group/input">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl text-[14px] font-medium text-gray-800 dark:text-zinc-200 outline-none focus:bg-white dark:focus:bg-zinc-800 focus:border-[#2b3a8c] dark:focus:border-blue-500 focus:ring-4 focus:ring-[#2b3a8c]/10 dark:focus:ring-blue-500/10 transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-[#2b3a8c] dark:hover:text-blue-400 transition-colors"
                                    >
                                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="w-full h-px bg-gray-100 dark:bg-zinc-800 my-2"></div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-widest pl-1">New Password</label>
                                <div className="relative group/input">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl text-[14px] font-medium text-gray-800 dark:text-zinc-200 outline-none focus:bg-white dark:focus:bg-zinc-800 focus:border-[#2b3a8c] dark:focus:border-blue-500 focus:ring-4 focus:ring-[#2b3a8c]/10 dark:focus:ring-blue-500/10 transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-[#2b3a8c] dark:hover:text-blue-400 transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-widest pl-1">Confirm New Password</label>
                                <div className="relative group/input">
                                    <input
                                        type={showReEnterPassword ? "text" : "password"}
                                        placeholder="Type it again to verify"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl text-[14px] font-medium text-gray-800 dark:text-zinc-200 outline-none focus:bg-white dark:focus:bg-zinc-800 focus:border-[#2b3a8c] dark:focus:border-blue-500 focus:ring-4 focus:ring-[#2b3a8c]/10 dark:focus:ring-blue-500/10 transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowReEnterPassword(!showReEnterPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-[#2b3a8c] dark:hover:text-blue-400 transition-colors"
                                    >
                                        {showReEnterPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-center md:justify-end">
                                <button className="px-8 py-3.5 bg-[#2b3a8c] dark:bg-blue-600 hover:bg-[#1e2a6a] dark:hover:bg-blue-700 text-white text-[14px] font-bold rounded-xl transition-all shadow-md shadow-[#2b3a8c]/20 dark:shadow-blue-900/20 hover:-translate-y-0.5">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: 2FA Module */}
                <div className="xl:col-span-2 flex flex-col gap-6">
                    <div className={`bg-white dark:bg-zinc-900 border rounded-[24px] p-5 sm:p-8 shadow-sm transition-all duration-500 relative overflow-hidden flex flex-col h-full ${is2FAEnabled ? 'border-emerald-200 dark:border-emerald-900/50 shadow-emerald-500/5' : 'border-gray-100 dark:border-zinc-800'}`}>
                        {/* Status Glow */}
                        <div className={`absolute top-0 right-0 w-40 h-40 blur-3xl rounded-full opacity-20 dark:opacity-10 pointer-events-none transition-colors duration-500 ${is2FAEnabled ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-zinc-500'}`}></div>

                        <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-4 mb-6 relative z-10 text-center sm:text-left">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner dark:shadow-none transition-colors duration-500 shrink-0 ${is2FAEnabled ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-gray-50 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500'}`}>
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-[18px] sm:text-[20px] font-black text-gray-900 dark:text-white tracking-tight">Two-Factor Auth</h2>
                                <div className="flex justify-center sm:justify-start">
                                    <span className={`inline-flex items-center gap-1.5 mt-1 text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${is2FAEnabled ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-gray-200 dark:border-zinc-700'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${is2FAEnabled ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                        {is2FAEnabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="text-[14px] text-gray-500 dark:text-zinc-400 font-bold leading-relaxed mb-8 flex-1 relative z-10 text-center sm:text-left">
                            Add an extra layer of security to your account. When logging in, you'll need to provide a unique code sent to your email.
                        </p>

                        <div className="bg-gray-50/80 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-[20px] p-4 sm:p-5 flex flex-col gap-4 relative z-10">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
                                    <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center shadow-sm text-blue-600 dark:text-blue-400 border border-transparent dark:border-zinc-700 shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[14px] font-black text-gray-900 dark:text-white tracking-tight">Email Verification</span>
                                        <span className="text-[12px] text-gray-500 dark:text-zinc-500 font-bold truncate">zeeshandev038@gmail.com</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                                    className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${is2FAEnabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-zinc-700'}`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ease-in-out ${is2FAEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>

                            {is2FAEnabled ? (
                                <div className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-xl p-3 flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                                    <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <p className="leading-tight">Account protected. Codes will be sent to your inbox upon every login attempt.</p>
                                </div>
                            ) : (
                                <div className="text-[12px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-xl p-3 flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <p className="leading-tight">Highly recommended: Enable 2FA to prevent unauthorized access.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PasswordTab;
