import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';

const FileBadge = ({ ext, color, style, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
        transition={{ opacity: { duration: 0.4, delay }, scale: { duration: 0.4, delay }, y: { duration: 3 + delay, repeat: Infinity, ease: 'easeInOut', delay } }}
        style={style} className="absolute">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-3 py-2 shadow-lg">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black text-white" style={{ background: color }}>{ext}</div>
            <div>
                <div className="w-14 h-1.5 bg-white/20 rounded-full mb-1" />
                <div className="w-10 h-1.5 bg-white/10 rounded-full" />
            </div>
        </div>
    </motion.div>
);

const Register = () => {
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className="min-h-screen w-full flex font-sans dark:bg-zinc-950 bg-[#f8faff] transition-colors duration-300 overflow-y-auto lg:overflow-hidden">

            {/* ── LEFT: Form Panel ── */}
            <div className="w-full lg:w-[50%] flex flex-col lg:justify-center px-6 md:px-14 xl:px-20 min-h-screen py-10 lg:py-12">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }} className="w-full max-w-[400px] mx-auto">

                    {/* Heading */}
                    <div className="mb-8">
                        <h1 className="text-[28px] md:text-[32px] font-black text-[#0a0e2e] dark:text-white tracking-tight leading-tight mb-2">
                            Create your account
                        </h1>
                        <p className="text-[14px] text-gray-400 dark:text-zinc-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#2b3a8c] dark:text-blue-400 font-semibold hover:underline underline-offset-2">Sign in →</Link>
                        </p>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="flex gap-3 mb-6">
                        {[
                            { label: 'Google', svg: <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg> },
                            { label: 'Microsoft', svg: <svg className="w-4 h-4" viewBox="0 0 24 24"><rect x="1.5" y="1.5" width="9.5" height="9.5" fill="#F25022" /><rect x="1.5" y="12" width="9.5" height="9.5" fill="#00A4EF" /><rect x="12" y="1.5" width="9.5" height="9.5" fill="#7FBA00" /><rect x="12" y="12" width="9.5" height="9.5" fill="#FFB900" /></svg> },
                        ].map(({ label, svg }) => (
                            <motion.button key={label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className="flex-1 h-11 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm text-[13px] font-semibold text-gray-700 dark:text-zinc-300">
                                {svg}{label}
                            </motion.button>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800" />
                        <span className="text-[11px] text-gray-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">or with email</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800" />
                    </div>

                    {/* Form */}
                    <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                        <input id="register-name" type="text" placeholder="Full name"
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 focus:border-[#2b3a8c] dark:focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-50/50 dark:focus:ring-blue-500/10 text-[14px] text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 transition-all" />

                        <input id="register-email" type="email" placeholder="Email address"
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 focus:border-[#2b3a8c] dark:focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-50/50 dark:focus:ring-blue-500/10 text-[14px] text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 transition-all" />

                        <div className="relative">
                            <input id="register-password" type={showPass ? 'text' : 'password'} placeholder="Password"
                                className="w-full px-4 py-3 pr-11 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 focus:border-[#2b3a8c] dark:focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-50/50 dark:focus:ring-blue-500/10 text-[14px] text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 transition-all" />
                            <button type="button" onClick={() => setShowPass(p => !p)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors">
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="relative">
                            <input id="register-confirm" type={showConfirm ? 'text' : 'password'} placeholder="Confirm password"
                                className="w-full px-4 py-3 pr-11 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 focus:border-[#2b3a8c] dark:focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-50/50 dark:focus:ring-blue-500/10 text-[14px] text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 transition-all" />
                            <button type="button" onClick={() => setShowConfirm(p => !p)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors">
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            type="submit" id="register-submit"
                            className="w-full py-3 rounded-xl font-bold text-[14px] text-white flex items-center justify-center gap-2 mt-1"
                            style={{ background: 'linear-gradient(135deg, #2b3a8c, #1e2a6a)', boxShadow: '0 6px 20px rgba(43,58,140,0.3)' }}>
                            Create account <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </form>

                    <p className="text-center text-[12px] text-gray-400 dark:text-zinc-500 mt-5 leading-relaxed">
                        By signing up, you agree to our{' '}
                        <a href="#" className="text-[#2b3a8c] dark:text-blue-400 hover:underline">Terms</a>
                        {' & '}
                        <a href="#" className="text-[#2b3a8c] dark:text-blue-400 hover:underline">Privacy Policy</a>
                    </p>

                </motion.div>
            </div>

            {/* ── RIGHT: Dark Creative Panel ── */}
            <div className="hidden lg:flex w-[50%] relative overflow-hidden flex-col"
                style={{ background: 'linear-gradient(145deg, #0a0e2e 0%, #1a237e 50%, #0d47a1 100%)' }}>

                <div className="absolute inset-0 opacity-[0.06]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 65%)' }} />
                <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, delay: 3 }}
                    className="absolute bottom-[-15%] left-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 65%)' }} />

                <div className="relative z-10 flex-1 flex flex-col items-center justify-center pb-12">
                    <div className="relative w-[220px] h-[220px] flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border border-white/8" />
                        <div className="absolute inset-[-36px] rounded-full border border-white/5" />
                        <div className="absolute inset-[-72px] rounded-full border border-white/4" />
                        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-28 h-28 rounded-[32px] flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.06))', border: '1.5px solid rgba(255,255,255,0.2)', boxShadow: '0 0 60px rgba(99,102,241,0.4)' }}>
                            <Cloud className="w-14 h-14 text-white/80" />
                        </motion.div>
                        <FileBadge ext="PDF" color="#ef4444" style={{ top: '-20px', left: '-70px' }} delay={0.3} />
                        <FileBadge ext="MP4" color="#8b5cf6" style={{ top: '-10px', right: '-80px' }} delay={0.6} />
                        <FileBadge ext="ZIP" color="#f59e0b" style={{ bottom: '-10px', left: '-80px' }} delay={0.9} />
                        <FileBadge ext="PNG" color="#10b981" style={{ bottom: '-20px', right: '-70px' }} delay={1.2} />
                        <FileBadge ext="PSD" color="#3b82f6" style={{ top: '80px', left: '-100px' }} delay={1.5} />
                        <FileBadge ext="MP3" color="#ec4899" style={{ top: '80px', right: '-100px' }} delay={1.8} />
                    </div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
                        className="text-center mt-12 px-10">
                        <h2 className="text-[38px] font-black text-white leading-[1.1] tracking-tight mb-3">
                            Any file.<br />
                            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #60a5fa, #c084fc)' }}>Anywhere.</span>
                        </h2>
                        <p className="text-white/50 text-[14px] font-medium leading-relaxed">
                            PDF, video, audio, archives — transfer anything up to 50 GB in seconds.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
                        className="mt-8 w-[280px] bg-white/8 backdrop-blur-xl border border-white/12 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[12px] text-white/60 font-bold">Uploading design_v3.fig</span>
                            </div>
                            <span className="text-[12px] font-black text-white">68%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div animate={{ width: ['10%', '68%'] }} transition={{ duration: 2, delay: 1.2, ease: 'easeOut' }}
                                className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #60a5fa, #c084fc)' }} />
                        </div>
                        <div className="flex justify-between text-[11px] text-white/30 mt-2">
                            <span>1.2 GB / 1.8 GB</span><span>2.1 GB/s</span>
                        </div>
                    </motion.div>
                </div>
            </div>

        </div>
    );
};

export default Register;