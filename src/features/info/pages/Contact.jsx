import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, ArrowRight } from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-[120px] pb-24 px-6 lg:px-12 relative overflow-hidden font-sans">
            {/* Dynamic Background */}
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

                {/* Left Side - Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full lg:w-1/2 flex flex-col"
                >
                    <div className="inline-flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-sm mb-6">
                        <Mail className="w-4 h-4" /> Get in Touch
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-8 tracking-tight leading-tight">
                        Let's build something together.
                    </h1>
                    <p className="text-lg text-gray-400 leading-relaxed mb-14 max-w-lg">
                        We'd love to hear from you. Our friendly team is always here to chat and help you with any questions about our enterprise plans, technical support, or file transfer limitations.
                    </p>

                    <div className="flex flex-col gap-10">
                        {/* Contact Items */}
                        <div className="flex items-start gap-6 group">
                            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg shrink-0 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-all duration-300 group-hover:scale-110">
                                <Mail className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="flex flex-col pt-1.5">
                                <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email us</span>
                                <span className="text-lg font-bold text-white transition-colors group-hover:text-blue-400 cursor-pointer">hello@sendbycloud.com</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-6 group">
                            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg shrink-0 group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-all duration-300 group-hover:scale-110">
                                <MapPin className="w-6 h-6 text-purple-400" />
                            </div>
                            <div className="flex flex-col pt-1.5">
                                <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Visit us</span>
                                <span className="text-lg font-bold text-white transition-colors leading-relaxed">123 Innovation Drive<br />Tech District, San Francisco 94105</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-6 group">
                            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg shrink-0 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 transition-all duration-300 group-hover:scale-110">
                                <Phone className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div className="flex flex-col pt-1.5">
                                <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Call us</span>
                                <span className="text-lg font-bold text-white transition-colors group-hover:text-emerald-400 cursor-pointer">+1 (555) 123-4567</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side - Form */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="w-full lg:w-1/2"
                >
                    <div className="bg-white/5 backdrop-blur-3xl rounded-[32px] p-8 md:p-12 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-br from-blue-500/10 to-transparent blur-[80px] pointer-events-none" />

                        <form className="flex flex-col gap-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2.5">
                                    <label className="text-[13px] font-bold text-gray-400 ml-1">First name</label>
                                    <input type="text" placeholder="John" className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-2xl text-[15px] font-medium text-white outline-none focus:bg-black/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600 shadow-inner" />
                                </div>
                                <div className="flex flex-col gap-2.5">
                                    <label className="text-[13px] font-bold text-gray-400 ml-1">Last name</label>
                                    <input type="text" placeholder="Doe" className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-2xl text-[15px] font-medium text-white outline-none focus:bg-black/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600 shadow-inner" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2.5">
                                <label className="text-[13px] font-bold text-gray-400 ml-1">Email address</label>
                                <input type="email" placeholder="john@company.com" className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-2xl text-[15px] font-medium text-white outline-none focus:bg-black/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600 shadow-inner" />
                            </div>

                            <div className="flex flex-col gap-2.5">
                                <label className="text-[13px] font-bold text-gray-400 ml-1">How can we help?</label>
                                <textarea placeholder="Tell us about your project or issue..." className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-2xl text-[15px] font-medium text-white outline-none focus:bg-black/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600 resize-none h-[150px] shadow-inner" />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center justify-center gap-3 mt-4 w-full h-[60px] bg-white text-black rounded-2xl font-bold text-[16px] transition-all hover:bg-gray-100 group shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                            >
                                Send message
                                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </motion.button>
                        </form>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default Contact;
