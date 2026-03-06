import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Heart, Users, Sparkles, ArrowRight } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-[120px] pb-32 px-6 lg:px-12 relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
            <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[1000px] h-[400px] bg-indigo-500/10 blur-[150px] opacity-50 pointer-events-none" />

            <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-24 max-w-3xl"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl px-5 py-2 rounded-full text-[13px] font-bold text-blue-400 uppercase tracking-widest mb-8 border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
                    >
                        <Sparkles className="w-4 h-4" /> Who we are
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50">
                        Redefining how the world shares.
                    </h1>
                    <p className="text-xl text-gray-400 font-medium leading-relaxed mb-10">
                        We're on a mission to completely revolutionize the way creative professionals and businesses transfer their most important assets securely across the globe.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-black px-8 py-4 rounded-full font-bold text-[15px] flex items-center justify-center gap-2 mx-auto hover:bg-gray-100 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                    >
                        Meet the team <ArrowRight className="w-4 h-4" />
                    </motion.button>
                </motion.div>

                {/* Number Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-5xl mb-32"
                >
                    {[
                        { num: "50M+", label: "Files transferred" },
                        { num: "99.9%", label: "Uptime SLA" },
                        { num: "120+", label: "Countries" },
                        { num: "24/7", label: "Expert support" }
                    ].map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center">
                            <h4 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">{stat.num}</h4>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full relative z-10">

                    {/* Card 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        whileHover={{ y: -10 }}
                        className="bg-white/5 backdrop-blur-2xl rounded-[32px] p-8 md:p-10 border border-white/10 flex flex-col items-center text-center group overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-3xl flex items-center justify-center mb-8 relative border border-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                            <Zap className="w-8 h-8 relative z-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Lightning Fast</h3>
                        <p className="text-gray-400 font-medium text-[15px] leading-relaxed relative z-10">Built on a globally distributed edge network, our transfers utilize maximum bandwidth available to both sender and receiver without throttling.</p>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        whileHover={{ y: -10 }}
                        className="bg-white/5 backdrop-blur-2xl rounded-[32px] p-8 md:p-10 border border-white/10 flex flex-col items-center text-center group overflow-hidden relative md:translate-y-12"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="w-20 h-20 bg-purple-500/20 text-purple-400 rounded-3xl flex items-center justify-center mb-8 relative border border-purple-500/30 group-hover:scale-110 transition-transform duration-500">
                            <ShieldCheck className="w-8 h-8 relative z-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Military Security</h3>
                        <p className="text-gray-400 font-medium text-[15px] leading-relaxed relative z-10">AES-256 encryption at rest and TLS 1.3 in transit. We employ strict compliance standards to ensure your corporate intellectual property is untouchable.</p>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        whileHover={{ y: -10 }}
                        className="bg-white/5 backdrop-blur-2xl rounded-[32px] p-8 md:p-10 border border-white/10 flex flex-col items-center text-center group overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-3xl flex items-center justify-center mb-8 relative border border-indigo-500/30 group-hover:scale-110 transition-transform duration-500">
                            <Globe className="w-8 h-8 relative z-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Accessible Anywhere</h3>
                        <p className="text-gray-400 font-medium text-[15px] leading-relaxed relative z-10">Whether on your phone, tablet or desktop, SendByCloud delivers a seamless, pixel-perfect experience across all modern devices and workflows.</p>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default About;
