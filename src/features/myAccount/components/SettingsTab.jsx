import React, { useState } from 'react';
import {
    User, Mail, Briefcase, MapPin, Building2,
    DownloadCloud, HardDrive, ShieldCheck, CreditCard,
    Globe, Trash2, Camera, ChevronRight,
    Zap, Save, Star, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── tiny reusable toggle ── */
const Toggle = ({ checked, onChange, color = '#2b3a8c' }) => (
    <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex items-center w-11 h-6 rounded-full transition-all duration-300 focus:outline-none`}
        style={{ background: checked ? color : '#e5e7eb' }}
    >
        <motion.span
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute w-4.5 h-4.5 bg-white rounded-full shadow-md"
            style={{ left: checked ? '24px' : '3px', top: '3px', width: '18px', height: '18px' }}
        />
    </button>
);

/* ── input field ── */
const Field = ({ label, icon: Icon, type = 'text', placeholder, defaultValue, readOnly = false, hint, options }) => (
    <div className="flex flex-col gap-2">
        <label className="text-[13px] font-bold text-gray-700 flex items-center gap-1.5 ml-1">
            {label}
        </label>
        <div className="relative group/input">
            <div className={`absolute inset-0 rounded-2xl transition-all ${readOnly ? 'bg-gray-50/80 border border-gray-100' : 'bg-gradient-to-b from-gray-50/50 to-gray-100/30 border border-gray-200 group-focus-within/input:ring-4 group-focus-within/input:ring-[#2b3a8c]/10 group-focus-within/input:border-[#2b3a8c] group-focus-within/input:bg-white group-hover/input:border-gray-300'}`} />

            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
                    <Icon className={`w-4.5 h-4.5 transition-colors ${readOnly ? 'text-gray-300' : 'text-gray-400 group-focus-within/input:text-[#2b3a8c]'}`} />
                </div>
            )}

            {options ? (
                <select
                    className={`relative w-full bg-transparent outline-none text-[14px] font-semibold px-4 py-3.5 z-10 appearance-none cursor-pointer ${Icon ? 'pl-[44px]' : ''} ${readOnly ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800'}`}
                    defaultValue={defaultValue}
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
                </select>
            ) : (
                <input
                    type={type}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    className={`relative w-full bg-transparent outline-none text-[14px] font-semibold px-4 py-3.5 z-10 ${Icon ? 'pl-[44px]' : ''} ${readOnly ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800 placeholder-gray-400'}`}
                />
            )}
        </div>
        {hint && (
            <p className="text-[12px] text-gray-400 font-medium ml-1 mt-0.5 flex items-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                {hint}
            </p>
        )}
    </div>
);

/* ── stat card ── */
const StatCard = ({ icon: Icon, label, value, sub, color, progress }) => (
    <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-transparent transition-shadow flex flex-col gap-3"
        style={{ '--card-color': color }}
    >
        <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
        </div>
        <div>
            <p className="text-[22px] font-black text-gray-900 leading-none">{value}</p>
            {sub && <p className="text-[12px] font-medium text-gray-400 mt-1">{sub}</p>}
        </div>
        {progress !== undefined && (
            <div className="flex flex-col gap-1.5">
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${color}, ${color}aa)` }}
                    />
                </div>
                <div className="flex justify-between text-[11px] font-medium text-gray-400">
                    <span>0 Bytes used</span>
                    <span>30.0 GB</span>
                </div>
            </div>
        )}
    </motion.div>
);

const TABS = ['Profile', 'Billing'];

const SettingsTab = () => {
    const [activeTab, setActiveTab] = useState('Profile');


    return (
        <div className="w-full flex flex-col gap-8 pb-8">

            {/* ── Page Header ── */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-[28px] font-black text-[#1e2a6a] tracking-tight leading-tight">Account Settings</h1>
                    <p className="text-[14px] text-gray-500 font-medium mt-1">Manage your profile, security & preferences</p>
                </div>
                {/* Plan badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2b3a8c] to-[#1e2a6a] text-white px-4 py-2 rounded-xl text-[13px] font-bold shadow-lg shadow-[#2b3a8c]/20 self-start sm:self-auto">
                    <Zap className="w-3.5 h-3.5 text-yellow-300" />
                    Free Plan
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </div>
            </motion.div>

            {/* ── Stats Row ── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <StatCard icon={ShieldCheck} label="Status" value="Active" sub="Account verified" color="#10b981" />
                <StatCard icon={Zap} label="Plan" value="Free" sub="Upgrade available" color="#2b3a8c" />
                <StatCard icon={DownloadCloud} label="Downloads" value="0" sub="Total transfers" color="#8b5cf6" />
                <StatCard icon={HardDrive} label="Storage" value="0 B" sub="of 30 GB used" color="#f59e0b" progress={0.1} />
            </motion.div>

            {/* ── Tab Navigation ── */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex gap-1 p-1 bg-gray-100/80 rounded-2xl w-fit"
            >
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors ${activeTab === tab ? 'text-[#2b3a8c]' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {activeTab === tab && (
                            <motion.div
                                layoutId="settingsTab"
                                className="absolute inset-0 bg-white rounded-xl shadow-sm"
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{tab}</span>
                    </button>
                ))}
            </motion.div>

            {/* ── Tab Content ── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                >

                    {/* ══ PROFILE TAB ══ */}
                    {activeTab === 'Profile' && (
                        <div className="flex flex-col gap-6">
                            {/* Avatar + Name banner */}
                            <div className="relative bg-gradient-to-r from-[#2b3a8c] to-[#1565c0] rounded-2xl p-6 flex items-center gap-6 overflow-hidden">
                                {/* background blobs */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                                <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none" />

                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center ring-4 ring-white/10">
                                        <User className="w-9 h-9 text-white/80" />
                                    </div>
                                    <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                        <Camera className="w-3.5 h-3.5 text-[#2b3a8c]" />
                                    </button>
                                </div>

                                <div className="relative z-10">
                                    <h2 className="text-[20px] font-black text-white leading-tight">Muhammad Zeeshan</h2>
                                    <p className="text-[13px] text-white/60 font-medium mt-0.5">zeeshandev038@gmail.com</p>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-[12px] text-emerald-300 font-bold">Active Account</span>
                                    </div>
                                </div>
                            </div>

                            {/* Form card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 flex flex-col gap-6">
                                <div className="pb-4 border-b border-gray-100">
                                    <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">Personal Information</h3>
                                    <p className="text-[13px] text-gray-500 mt-1">Update your personal details below.</p>
                                </div>

                                <div className="flex flex-col gap-5">
                                    <Field label="Email address" type="email" defaultValue="zeeshandev038@gmail.com" readOnly hint="Email cannot be changed directly. Contact support to update this field." />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <Field label="First name" placeholder="First name" defaultValue="Muhammad Zeeshan" />
                                        <Field label="Last name" placeholder="Last name" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <Field label="Company (Optional)" placeholder="Your company name" />
                                        <Field label="VAT number" placeholder="VAT number" />
                                    </div>
                                </div>

                                <div className="pt-2 mt-4">
                                    <div className="pb-4 border-b border-gray-100 mb-5">
                                        <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">Address Information</h3>
                                        <p className="text-[13px] text-gray-500 mt-1">Used for billing and invoicing</p>
                                    </div>
                                    <div className="flex flex-col gap-5">
                                        <Field label="Street address" placeholder="123 Main Street" />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <Field label="Postal / Zip code" placeholder="00000" />
                                            <Field label="City" placeholder="City" />
                                        </div>
                                        <Field
                                            label="Country"
                                            options={[
                                                { value: 'US', label: 'United States' },
                                                { value: 'UK', label: 'United Kingdom' },
                                                { value: 'CA', label: 'Canada' },
                                                { value: 'PK', label: 'Pakistan' },
                                            ]}
                                            placeholder="Select a country"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Save + danger row */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2">
                                <button className="flex items-center gap-2 text-[13px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2.5 rounded-xl transition-all border border-transparent hover:border-red-100">
                                    <Trash2 className="w-4 h-4" />
                                    Delete account
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 px-8 py-3 bg-[#2b3a8c] hover:bg-[#1e2a6a] text-white text-[14px] font-bold rounded-xl shadow-sm transition-all"
                                >
                                    <Save className="w-4 h-4" />
                                    Save changes
                                </motion.button>
                            </div>
                        </div>
                    )}


                    {/* ══ BILLING TAB ══ */}
                    {activeTab === 'Billing' && (
                        <div className="flex flex-col gap-6">

                            {/* Current plan card */}
                            <div className="relative bg-gradient-to-br from-[#2b3a8c] to-[#1565c0] rounded-2xl p-6 overflow-hidden">
                                <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4 pointer-events-none" />
                                <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Star className="w-4 h-4 text-yellow-300" />
                                            <span className="text-[12px] font-bold text-white/60 uppercase tracking-widest">Current Plan</span>
                                        </div>
                                        <h3 className="text-[26px] font-black text-white">Free Plan</h3>
                                        <p className="text-[13px] text-white/60 mt-1">Up to 50 GB per transfer · Basic features</p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="flex items-center gap-2 px-6 py-3 bg-white text-[#2b3a8c] text-[14px] font-black rounded-xl shadow-xl"
                                    >
                                        <TrendingUp className="w-4 h-4" />
                                        Upgrade Plan
                                    </motion.button>
                                </div>

                                {/* Usage bar */}
                                <div className="relative z-10 mt-6 pt-6 border-t border-white/10">
                                    <div className="flex justify-between text-[12px] font-medium text-white/60 mb-2">
                                        <span>Storage used</span>
                                        <span>0 B / 30 GB</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full w-[0.5%] bg-white/60 rounded-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Payment method */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-5">
                                    <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <CreditCard className="w-4 h-4 text-[#2b3a8c]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[15px] font-bold text-gray-900">Payment Method</h3>
                                        <p className="text-[12px] text-gray-400">Manage your billing details</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center py-10 gap-3">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center">
                                        <CreditCard className="w-7 h-7 text-gray-200" />
                                    </div>
                                    <p className="text-[14px] font-bold text-gray-400">No payment method added</p>
                                    <p className="text-[12px] text-gray-400">Upgrade your plan to add a payment method</p>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="mt-2 px-6 py-2.5 bg-gradient-to-r from-[#2b3a8c] to-[#1e2a6a] hover:opacity-90 text-white text-[13px] font-bold rounded-xl transition-all shadow-md shadow-[#2b3a8c]/20"
                                    >
                                        Add payment method
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    )}


                </motion.div>
            </AnimatePresence>
        </div >
    );
};

export default SettingsTab;
