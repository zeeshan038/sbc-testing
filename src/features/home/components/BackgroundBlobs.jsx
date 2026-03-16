import React from 'react';
import { motion } from 'framer-motion';

const BackgroundBlobs = () => {
    return (
        <>
            <motion.div
                animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 1.1, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-400 opacity-20 rounded-full blur-[100px] pointer-events-none"
            />
            <motion.div
                animate={{ rotate: [360, 270, 180, 90, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500 opacity-15 rounded-full blur-[80px] pointer-events-none"
            />
        </>
    );
};

export default BackgroundBlobs;
