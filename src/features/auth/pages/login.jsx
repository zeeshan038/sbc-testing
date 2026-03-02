import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Zap, Shield, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingCard = ({ style, children, delay = 0 }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }} style={style} className="absolute">
        {children}
    </motion.div>
);

const Login = () => {
    const [showPass, setShowPass] = useState(false);

    return (
        <div className="min-h-screen w-full flex font-sans overflow-hidden" style={{ background: '#f8faff' }}>

            {/* ── LEFT: Form Panel ── */}
            <div className="w-full lg:w-[48%] flex flex-col justify-center px-8 md:px-14 xl:px-20 min-h-screen py-12">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }} className="w-full max-w-[420px] mx-auto">

                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-[12px] font-bold px-3 py-1.5 rounded-full mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Welcome back
                        </div>
                        <h1 className="text-[36px] font-black text-[#0a0e2e] tracking-tight leading-tight mb-2">Sign in to<br />your account</h1>
                        <p className="text-[14px] text-gray-500 font-medium">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-[#2b3a8c] font-bold hover:underline underline-offset-2">Sign up free →</Link>
                        </p>
                    </div>

                    <div className="flex gap-3 mb-8">
                        {[
                            { label: 'Google', svg: <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg> },
                            { label: 'Microsoft', svg: <svg className="w-4 h-4" viewBox="0 0 24 24"><rect x="1.5" y="1.5" width="9.5" height="9.5" fill="#F25022" /><rect x="1.5" y="12" width="9.5" height="9.5" fill="#00A4EF" /><rect x="12" y="1.5" width="9.5" height="9.5" fill="#7FBA00" /><rect x="12" y="12" width="9.5" height="9.5" fill="#FFB900" /></svg> },
                        ].map(({ label, svg }) => (
                            <motion.button key={label} whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                                className="flex-1 h-12 bg-white border border-gray-200 hover:border-gray-300 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-sm hover:shadow-md text-[13px] font-semibold text-gray-700">
                                {svg}{label}
                            </motion.button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">or with email</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-bold text-gray-600 uppercase tracking-wider">Email address</label>
                            <input id="login-email" type="email" placeholder="you@example.com"
                                className="w-full px-4 py-3.5 rounded-2xl bg-white border-2 border-gray-100 focus:border-[#2b3a8c] focus:outline-none text-[14px] text-gray-800 placeholder-gray-400 transition-all shadow-sm" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[12px] font-bold text-gray-600 uppercase tracking-wider">Password</label>
                                <a href="#" className="text-[12px] font-bold text-[#2b3a8c] hover:underline underline-offset-2">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <input id="login-password" type={showPass ? 'text' : 'password'} placeholder="Enter your password"
                                    className="w-full px-4 py-3.5 pr-12 rounded-2xl bg-white border-2 border-gray-100 focus:border-[#2b3a8c] focus:outline-none text-[14px] text-gray-800 placeholder-gray-400 transition-all shadow-sm" />
                                <button type="button" onClick={() => setShowPass(p => !p)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                                    {showPass ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                                </button>
                            </div>
                        </div>
                        <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                            type="submit" id="login-submit"
                            className="w-full py-3.5 rounded-2xl font-bold text-[15px] text-white flex items-center justify-center gap-2 mt-2"
                            style={{ background: 'linear-gradient(135deg, #2b3a8c, #1e2a6a)', boxShadow: '0 8px 24px rgba(43,58,140,0.35)' }}>
                            Sign in <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </form>

                    <p className="text-center text-[12px] text-gray-400 mt-8 font-medium">
                        By continuing, you agree to our{' '}
                        <a href="#" className="text-gray-600 hover:underline font-semibold">Terms</a>
                        {' & '}
                        <a href="#" className="text-gray-600 hover:underline font-semibold">Privacy Policy</a>
                    </p>
                </motion.div>
            </div>

            {/* ── RIGHT: Dark Creative Panel ── */}
            <div className="hidden lg:flex w-[52%] relative overflow-hidden flex-col"
                style={{ background: 'linear-gradient(145deg, #0a0e2e 0%, #1a237e 50%, #0d47a1 100%)' }}>

                <div className="absolute inset-0 opacity-[0.06]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 65%)' }} />
                <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                    className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 65%)' }} />

                <div className="relative z-10 flex-1 flex flex-col justify-center px-12 pb-12">
                    <motion.h2 initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-[52px] font-black text-white leading-[1.1] tracking-tight mb-6">
                        Share files<br />
                        <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #60a5fa, #a78bfa)' }}>
                            without limits.
                        </span>
                    </motion.h2>
                    <motion.p initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.35 }}
                        className="text-white/50 text-[16px] font-medium leading-relaxed max-w-sm">
                        The fastest, most secure way to transfer large files to anyone, anywhere.
                    </motion.p>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex flex-wrap gap-3 mt-10">
                        {[
                            { icon: Zap, label: 'Lightning fast', color: '#fbbf24' },
                            { icon: Shield, label: 'End-to-end encrypted', color: '#34d399' },
                            { icon: Cloud, label: 'Up to 50 GB', color: '#60a5fa' },
                        ].map(({ icon: Icon, label, color }) => (
                            <div key={label} className="flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
                                <Icon className="w-3.5 h-3.5" style={{ color }} />
                                <span className="text-[12px] font-bold text-white/70">{label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <FloatingCard delay={0.6} style={{ top: '22%', right: '8%' }}>
                    <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl px-5 py-4 text-white w-[180px]">
                        <p className="text-[11px] text-white/50 font-bold uppercase tracking-wider mb-1">Transfers today</p>
                        <p className="text-[28px] font-black leading-none">12,483</p>
                        <p className="text-[11px] text-emerald-400 font-bold mt-1">↑ 18% vs yesterday</p>
                    </div>
                </FloatingCard>
                <FloatingCard delay={0.75} style={{ bottom: '18%', right: '12%' }}>
                    <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl px-5 py-4 text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <p className="text-[11px] text-white/60 font-bold">Live transfer</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-32 bg-white/10 rounded-full h-1.5">
                                <motion.div animate={{ width: ['30%', '80%', '30%'] }} transition={{ duration: 3, repeat: Infinity }}
                                    className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #60a5fa, #a78bfa)' }} />
                            </div>
                            <span className="text-[12px] font-black text-white">2.4 GB/s</span>
                        </div>
                    </div>
                </FloatingCard>
            </div>

        </div>
    );
};

export default Login;