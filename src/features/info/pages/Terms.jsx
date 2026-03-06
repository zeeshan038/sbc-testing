import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, FileText } from 'lucide-react';

const Terms = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 pt-[120px] pb-32 px-6 lg:px-12 relative font-sans">
            {/* Ambient Background Lights */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-4xl mx-auto w-full relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <div className="inline-flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-sm mb-4">
                        <FileText className="w-4 h-4" /> Legal Information
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">Terms of Service</h1>
                    <p className="text-lg text-gray-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Last updated: <strong className="text-gray-300">October 24, 2023</strong>
                    </p>
                </motion.div>

                {/* Content Container */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white/5 backdrop-blur-3xl rounded-[32px] p-8 md:p-14 border border-white/10 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-[80px]" />

                    <div className="space-y-12 relative z-10 text-[15px] leading-relaxed">

                        <section className="group">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="text-blue-500 font-black">01.</span> Agreement to Terms
                            </h2>
                            <p className="text-gray-400 pl-9">By accessing or using SendByCloud, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to all of the terms and conditions outlined here, you may not access or use our services. We reserve the right to update these terms at any given time without prior notice.</p>
                        </section>

                        <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />

                        <section className="group">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="text-blue-500 font-black">02.</span> Service Usage and Transfers
                            </h2>
                            <p className="mb-6 text-gray-400 pl-9">Our service enables you to upload, host, share and transfer files ("Content"). You are completely responsible for the Content that you send via the Service.</p>
                            <div className="pl-9 space-y-4">
                                {[
                                    "You must not upload viruses, malware, or any other malicious code.",
                                    "You must not share illegal or highly inappropriate content.",
                                    "Files are stored temporarily on our servers for the sole purpose of delivery and will be permanently deleted upon expiration of the transfer window."
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        <span className="text-gray-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />

                        <section className="group">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="text-blue-500 font-black">03.</span> User Accounts
                            </h2>
                            <p className="text-gray-400 pl-9">When you register an account with us, you guarantee that you are above the age of 18, and that the information you provide is accurate at all times. Premium subscriptions are billed in advance on a recurring basis as outlined at the time of purchase. Failure to pay may result in immediate suspension.</p>
                        </section>

                        <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />

                        <section className="group">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="text-blue-500 font-black">04.</span> Limitation of Liability
                            </h2>
                            <p className="text-gray-400 pl-9">In no event shall SendByCloud, nor its directors, employees, partners or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or inability to access or use the Service.</p>
                        </section>

                    </div>
                </motion.div>

                <p className="text-center text-gray-600 mt-12 text-sm font-medium">
                    Have questions regarding these terms? <a href="/contact" className="text-blue-400 hover:text-blue-300 transition-colors font-bold group inline-flex items-center gap-1">Contact Support <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /></a>
                </p>

            </div>
        </div>
    );
};

export default Terms;
