import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Shield, Zap, Cloud, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../../../store/authSlice';
import FloatingLoader from '../../../shared/components/floatingLoader';
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider } from '../../../../firebase';
import { useRegisterMutation, useSignInWithGoogleMutation } from '../api/auth';
import { useEffect } from 'react';
import logo from '../../../assets/logo5.jpeg';
import secureDataImg from '../../../assets/secure_data_3d.png';
import cloudTransferImg from '../../../assets/cloud_transfer_3d.png';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isSocialLoading, setIsSocialLoading] = useState(false);


    const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
    const [signInWithGoogle, { isLoading: isGoogleLoading }] = useSignInWithGoogleMutation();

    useEffect(() => {
        const checkRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    setIsSocialLoading(true);
                    
                    // Get the Firebase ID Token
                    const idToken = await result.user.getIdToken();
                    
                    // Send idToken to backend
                    const userData = await signInWithGoogle({ idToken }).unwrap();

                    // Store token + display name for navbar rendering.
                    try {
                        if (userData?.token) window.localStorage.setItem('token', userData.token);
                        if (userData?.user?.name) window.localStorage.setItem('name', userData.user.name);
                    } catch {
                        // Ignore storage errors
                    }

                    dispatch(setCredentials({ ...userData }));
                    navigate('/');
                }
            } catch (err) {
                console.error("Redirect Result Error:", err);
                setErrorMsg(err?.data?.message || err?.message || 'Google Sign-In failed.');
            } finally {
                setIsSocialLoading(false);
            }
        };
        checkRedirectResult();
    }, [dispatch, navigate, signInWithGoogle]);

    const handleGoogleSignIn = async () => {
        setErrorMsg('');
        setIsSocialLoading(true);
        try {
            await signInWithRedirect(auth, googleProvider);
        } catch (err) {
            console.error(err);
            setIsSocialLoading(false);
            if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
                setErrorMsg(err?.data?.message || err?.message || 'Google Sign-In failed.');
            }
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        
        try {
            const userData = await register({ name, email, password }).unwrap();

            // Store token + display name for navbar rendering.
            try {
                if (userData?.token) window.localStorage.setItem('token', userData.token);
                if (userData?.user?.name) window.localStorage.setItem('name', userData.user.name);
            } catch {
                // Ignore storage errors
            }

            dispatch(setCredentials({ ...userData }));
            navigate('/');
        } catch (err) {
            setErrorMsg(err?.data?.msg || err?.error || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row font-sans bg-white dark:bg-zinc-950 transition-colors duration-300">
            
            {/* Left Side: Form */}
            <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col justify-center px-6 py-12 md:px-12 lg:px-20 bg-[#f8faff] dark:bg-zinc-950 relative overflow-hidden pt-24 md:pt-32">

                {/* Background Decoration */}
                <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
                
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 w-full max-w-[450px] mx-auto md:mx-0"
                >
                    {/* Header */}
                    <div className="mb-6 text-left">
                        <h1 className="text-[32px] font-black text-[#0a0e2e] dark:text-white tracking-tight leading-tight mb-2">
                            Sign up
                        </h1>
                        <p className="text-[14px] text-gray-500 dark:text-zinc-400 font-medium">
                            Start sending files securely today
                        </p>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button className="h-12 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl flex items-center justify-center gap-2 transition-all">
                            <svg className="w-4 h-4" viewBox="0 0 24 24"><rect x="1.5" y="1.5" width="9.5" height="9.5" fill="#F25022" /><rect x="1.5" y="12" width="9.5" height="9.5" fill="#00A4EF" /><rect x="12" y="1.5" width="9.5" height="9.5" fill="#7FBA00" /><rect x="12" y="12" width="9.5" height="9.5" fill="#FFB900" /></svg>
                            <span className="text-[13px] font-bold text-gray-600 dark:text-zinc-300">Microsoft</span>
                        </button>
                        <button 
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isSocialLoading || isGoogleLoading}
                            className="h-12 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                            <span className="text-[13px] font-bold text-gray-600 dark:text-zinc-300">Google</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6 text-gray-100 dark:text-zinc-900">
                        <div className="flex-1 h-px bg-current" />
                        <span className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase font-black tracking-widest">or register</span>
                        <div className="flex-1 h-px bg-current" />
                    </div>

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleRegister}>
                        {errorMsg && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl"
                            >
                                <p className="text-[13px] text-red-600 dark:text-red-400 font-bold flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    {errorMsg}
                                </p>
                            </motion.div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                    className="w-full h-12 px-4 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 focus:border-[#2b3a8c] dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-[14px] dark:text-white font-medium shadow-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@company.com"
                                    required
                                    className="w-full h-12 px-4 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 focus:border-[#2b3a8c] dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-[14px] dark:text-white font-medium shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[12px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a strong password"
                                    required
                                    className="w-full h-12 px-4 pr-11 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 focus:border-[#2b3a8c] dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-[14px] dark:text-white font-medium shadow-sm"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isRegisterLoading}
                            className={`w-full h-14 rounded-xl bg-[#2b3a8c] hover:bg-[#1e2a6a] dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-black text-[15px] transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.98] ${isRegisterLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isRegisterLoading ? (
                             <FloatingLoader />
                            ) : 'Create Account'}
                        </button>
                    </form>


                    <div className="mt-10 flex items-center justify-between text-[13px] font-medium">
                        <p className="text-gray-400">
                            Already have an account? <Link to="/login" className="text-[#0a0e2e] dark:text-white font-bold hover:underline">Sign in</Link>
                        </p>
                        <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300">Privacy Policy</a>
                    </div>
                </motion.div>
            </div>

            {/* Right Side: Showcase (Same as Login for consistency) */}
            <div className="hidden md:flex flex-1 bg-[#1a2b6d] relative overflow-hidden items-center justify-center p-12">
                <div className="absolute top-0 right-0 w-full h-full opacity-30">
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-400/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 w-full h-full max-w-[800px] flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="bg-white dark:bg-zinc-900 rounded-[24px] p-6 shadow-2xl z-30 w-60 flex flex-col items-center"
                    >
                        <div className="relative w-32 h-32 mb-6 mt-1">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-gray-100 dark:text-zinc-800" />
                                <motion.circle
                                    initial={{ strokeDashoffset: 364 }}
                                    animate={{ strokeDashoffset: 0 }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                    cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" strokeDasharray="364" fill="transparent" className="text-blue-600"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[28px] font-black text-gray-900 dark:text-white mt-1">100<span className="text-[16px] font-bold">%</span></span>
                            </div>
                        </div>
                        <h3 className="text-[18px] font-black text-gray-900 dark:text-white mb-1">Secure Transfer</h3>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, -12, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[12%] right-[12%] z-20"
                    >
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1 overflow-hidden shadow-xl border border-white/20">
                            <img src={secureDataImg} alt="Data" className="w-40 h-48 object-cover rounded-[14px]" />
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-[12%] right-[18%] z-20"
                    >
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1 overflow-hidden shadow-xl border border-white/20">
                            <img src={cloudTransferImg} alt="Cloud" className="w-48 h-40 object-cover rounded-[14px]" />
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                        className="absolute bottom-[20%] left-[10%] z-20"
                    >
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-xl flex items-center gap-3 pr-5">
                            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                                <Shield className="text-white w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-black text-[12px]">E2EE Support</span>
                                <span className="text-white/50 text-[10px] font-bold uppercase tracking-tight">End-to-end</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Register;