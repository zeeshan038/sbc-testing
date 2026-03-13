import { motion } from "framer-motion";

const FloatingLoader = () => {
    return (
        <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((dot) => (
                <motion.div
                    key={dot}
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: dot * 0.1
                    }}
                    className="w-1.5 h-1.5 bg-white rounded-full"
                />
            ))}
        </div>
    );
};

export default FloatingLoader;