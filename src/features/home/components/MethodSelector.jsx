import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Mail, Link as LinkIcon } from 'lucide-react';

const TRANSFER_METHODS = [
    {
        id: 'email',
        label: 'Email',
        icon: Mail,
        desc: 'Send to an email address',
        lightBg: 'bg-blue-50',
        lightText: 'text-blue-700',
        ring: 'ring-blue-500/20',
    },
    {
        id: 'link',
        label: 'Link',
        icon: LinkIcon,
        desc: 'Share a download link',
        lightBg: 'bg-blue-50',
        lightText: 'text-blue-700',
        ring: 'ring-blue-500/20',
    },
];

const MethodSelector = ({ selectedMethod, setSelectedMethod }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-2 mt-2"
        >
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">How to share?</p>
            <div className="flex gap-2">
                {TRANSFER_METHODS.map(({ id, label, icon: Icon, lightBg, lightText, ring }) => {
                    const isActive = selectedMethod === id;
                    return (
                        <motion.button
                            key={id}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setSelectedMethod(prev => prev === id ? null : id)}
                            className={`cursor-pointer relative flex items-center gap-1.5 py-1 px-2.5 rounded-xl border transition-all font-semibold text-[12px]
                            ${isActive
                                    ? `${lightBg} ${lightText} border-transparent ring-2 ${ring} shadow-sm dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/40`
                                    : 'bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-gray-100 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:text-gray-700 dark:hover:text-zinc-200'
                                }`}
                        >
                            <Icon className="w-3.5 h-3.5 relative z-10 shrink-0" />
                            <span className="relative z-10">{label}</span>
                            {isActive && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                >
                                    <CheckCircle2 className={`w-3 h-3 ${lightText}`} />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default MethodSelector;
export { TRANSFER_METHODS };
