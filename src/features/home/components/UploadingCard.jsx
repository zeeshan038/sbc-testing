import { formatSpeed } from '../../../shared/utils/formatTransfer';

const UploadingCard = ({ uploadProgress, uploadSpeed, uploadedBytes, totalBytes, formatBytes }) => {
    const calculateRemainingTime = () => {
        if (uploadSpeed <= 0) return null;
        const remainingBytes = totalBytes - uploadedBytes;
        const seconds = Math.ceil(remainingBytes / uploadSpeed);
        
        if (seconds < 60) return `± ${seconds} Second(s) remaining`;
        const minutes = Math.ceil(seconds / 60);
        return `± ${minutes} Minute(s) remaining`;
    };

    const remainingTime = calculateRemainingTime();

    // SVG Circle properties
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (uploadProgress / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center relative z-10 bg-[#12141c] rounded-[inherit] w-full max-w-[320px] sm:max-w-[330px] min-h-[520px] lg:min-h-[560px] flex-1 px-8 py-10 text-center"
        >
            {/* Circular Progress Section */}
            <div className="relative w-56 h-56 flex items-center justify-center mb-10 shrink-0">
                {/* Inner Shadow/Glow Background */}
                <div className="absolute inset-4 rounded-full bg-blue-500/5 blur-2xl" />
                
                {/* SVG Ring */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 224 224">
                    {/* Track Ring */}
                    <circle
                        cx="112"
                        cy="112"
                        r={radius}
                        stroke="#2a2d3d"
                        strokeWidth="12"
                        fill="transparent"
                    />
                    {/* Progress Ring */}
                    <motion.circle
                        cx="112"
                        cy="112"
                        r={radius}
                        stroke="#3b82f6"
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 0.2, ease: "linear" }}
                        strokeLinecap="round"
                        fill="transparent"
                    />
                </svg>
                
                {/* Percentage Text */}
                <div className="absolute flex flex-col items-center">
                    <span className="text-[52px] font-black text-white tracking-tighter leading-none">
                        {Math.round(uploadProgress)}%
                    </span>
                </div>
            </div>

            {/* Text Content */}
            <div className="space-y-4 mb-10 w-full px-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Transferring files</h2>
                
                <div className="space-y-1">
                    <p className="text-[15px] font-medium text-white opacity-90">
                        {formatBytes(uploadedBytes)} uploaded of {formatBytes(totalBytes)} ({formatSpeed(uploadSpeed)})
                    </p>
                    {remainingTime && (
                        <p className="text-[14px] font-medium text-zinc-500">
                            {remainingTime}
                        </p>
                    )}
                </div>
            </div>

            {/* Footer Warning */}
            <p className="text-[13px] font-medium text-zinc-600 max-w-[200px] leading-relaxed">
                Please keep this window open until the upload finishes.
            </p>

            {/* Background glowing orb */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-[#3b82f6]/5 to-transparent blur-3xl -z-10 pointer-events-none"
            />
        </motion.div>
    );
};

export default UploadingCard;
