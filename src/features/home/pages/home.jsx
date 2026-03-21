import React, { useState, useRef, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Hooks
import { useUpload } from '../../../shared/context/UploadContext';
import { useGetTransferQuery, useDownloadTransferMutation } from '../api/homeApi';
import { useLazyGetDownloadDetailsQuery } from '../api/downloadApi';
import { useFileTransfer } from '../hooks/useFileTransfer';
import { useDownloadTransfer } from '../hooks/useDownloadTransfer';

// Components
import SettingsModal from '../components/SettingsModal';
import PreviewModal from '../../../shared/components/PreviewModal';
import DownloadCard from '../components/DownloadCard';
import DownloadingOverlay from '../components/DownloadingOverlay';
import SuccessCard from '../components/SuccessCard';
import TransferHeader from '../components/TransferHeader';
import DropZone from '../components/DropZone';
import FileList from '../components/FileList';
import MethodSelector from '../components/MethodSelector';
import EmailTransferForm from '../components/EmailTransferForm';
import LinkTransferForm from '../components/LinkTransferForm';
import TransferAction from '../components/TransferAction';
import BackgroundBlobs from '../components/BackgroundBlobs';
import UploadingCard from '../components/UploadingCard';

// Utilities
import { formatBytes } from '../../../shared/utils/formatBytes';

const Home = ({ isNavOpen }) => {
    // Context State
    const {
        transferType, setTransferType,
        uploadedFiles, setUploadedFiles,
        selectedMethod, setSelectedMethod,
        selfDestruct, setSelfDestruct,
        isDownloadAble, setIsDownloadAble,
        expiresIn, setExpiresIn,
        message, setMessage,
        recipients, setRecipients,
        senderEmail, setSenderEmail,
        password, setPassword,
        handleFiles, removeFile, removeRecipient,
        hasFiles
    } = useUpload();

    // Local UI State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [addMenuOpen, setAddMenuOpen] = useState(false);
    const [recipientInput, setRecipientInput] = useState('');
    const [isMobile] = useState(() => window.innerWidth < 640);
    const [isPreparingZip, setIsPreparingZip] = useState(false);

    // Refs
    const fileInputRef = useRef(null);
    const folderInputRef = useRef(null);
    const addMenuRef = useRef(null);

    // API Mutations/Queries
    const [getDownloadDetails] = useLazyGetDownloadDetailsQuery();
    const [downloadTransfer] = useDownloadTransferMutation();
    const { id: transferId } = useParams();
    const [searchParams] = useSearchParams();
    const isDownloadAbleFromQuery = searchParams.get('isDownloadAble') === 'true';

    const { data: transferData, isLoading: isFetchingTransfer } = useGetTransferQuery(
        { id: transferId, preview: true },
        { skip: !transferId }
    );

    const isRestrictedToDownload = isDownloadAbleFromQuery ||
        transferData?.isDownloadAble ||
        transferData?.transferDetails?.isDownloadAble ||
        transferData?.downloadable ||
        transferData?.transferDetails?.downloadable;
    console.log("Transfer Daa............", transferData)
    // Business Logic Hook
    const totalSize = uploadedFiles.reduce((acc, file) => acc + file.size, 0);
    const {
        isUploading,
        uploadProgress,
        uploadSpeed,
        uploadedBytes,
        totalBytes: currentTransferTotalBytes,
        generatedLink,
        setGeneratedLink,
        newTransferId,
        handleTransfer
    } = useFileTransfer({
        uploadedFiles, setUploadedFiles,
        senderEmail, recipients, setRecipients,
        transferType, expiresIn,
        selectedMethod, selfDestruct, isDownloadAble, setMessage,
        totalSize, password
    });
    
    const activeTransferId = transferId || newTransferId;

    useEffect(() => {
        if (activeTransferId) {
            getDownloadDetails(activeTransferId);
        }
    }, [activeTransferId, getDownloadDetails]);

    const { 
        downloads,
        startDownload,
        cancelDownload,
        isSupported: isStreamSupported
    } = useDownloadTransfer();

    // Event Handlers
    const handleDownload = async (key) => {
        if (!transferId) return;

        // Defensive check: combining all possible flag names and locations
        const isRestrictedToDownload = isDownloadAbleFromQuery ||
            transferData?.isDownloadAble ||
            transferData?.transferDetails?.isDownloadAble ||
            transferData?.downloadable ||
            transferData?.transferDetails?.downloadable;

        if (isRestrictedToDownload) {
            alert("Download is restricted for this video.");
            return;
        }

        try {
            const fetchDownload = async () => {
                const response = await getDownloadDetails(transferId).unwrap();
                if (response.status) {
                    const downloadSessionId = response.downloadSessionId;

                    // If multiple files, check zipStatus
                    if (response.files && response.files.length > 1) {
                        if (response.zipStatus === 'processing') {
                            setIsPreparingZip(true);
                            return false; // Continue polling
                        } else if (response.zipStatus === 'ready' && response.zipUrl) {
                            setIsPreparingZip(false);
                            await startDownload({ 
                                file: {
                                    url: response.zipUrl,
                                    fileName: `${transferId || 'transfer'}.zip`,
                                    size: response.transferDetails?.totalSize || 0,
                                    key: 'zip'
                                },
                                transferId,
                                downloadSessionId,
                                password
                            });
                            return true; // Stop polling
                        } else if (response.zipUrl) {
                            setIsPreparingZip(false);
                            await startDownload({ 
                                file: {
                                    url: response.zipUrl,
                                    fileName: `${transferId || 'transfer'}.zip`,
                                    size: response.transferDetails?.totalSize || 0,
                                    key: 'zip'
                                },
                                transferId,
                                downloadSessionId,
                                password
                            });
                            return true;
                        }
                    } else if (response.files && response.files.length > 0) {
                        // Single file
                        setIsPreparingZip(false);
                        const file = response.files[0];
                        await startDownload({ 
                            file,
                            transferId,
                            downloadSessionId,
                            password
                        });
                        return true;
                    }
                }
                return false;
            };

            const isDone = await fetchDownload();
            if (!isDone) {
                const intervalId = setInterval(async () => {
                    const finished = await fetchDownload();
                    if (finished) clearInterval(intervalId);
                }, 3000);
            }
        } catch (err) {
            console.error("Download error:", err);
            setIsPreparingZip(false);
            alert("Download task failed. Please try again.");
        }
    };

    const handleRecipientKeyDown = (e) => {
        if (['Enter', ' ', ',', 'Tab'].includes(e.key)) {
            if (e.key !== 'Tab' || recipientInput) e.preventDefault();
            const val = recipientInput.trim().replace(/,$/, '');
            if (val) {
                if (!recipients.includes(val)) {
                    setRecipients([...recipients, val]);
                }
                setRecipientInput('');
            }
        } else if (e.key === 'Backspace' && !recipientInput && recipients.length > 0) {
            removeRecipient(recipients.length - 1);
        }
    };

    const handleRecipientBlur = () => {
        const val = recipientInput.trim().replace(/,$/, '');
        if (val) {
            if (!recipients.includes(val)) {
                setRecipients([...recipients, val]);
            }
            setRecipientInput('');
        }
    };

    // Close Add Menu on Click Outside
    useEffect(() => {
        const handler = (e) => {
            if (addMenuRef.current && !addMenuRef.current.contains(e.target)) {
                setAddMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Body Scroll Prevention (iOS/Safari)
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        return () => {
            document.body.style.overflow = originalStyle;
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
        };
    }, []);

    const handlePreview = () => setIsPreviewOpen(true);

    return (
        <div className="fixed inset-0 w-screen h-[100svh] font-sans text-gray-900 overflow-hidden bg-gradient-to-br from-[#f0f4f9] to-[#d6e4f9] touch-none overscroll-none">

            <BackgroundBlobs />

            <main className="fixed inset-0 z-10 flex items-center justify-center sm:justify-start lg:justify-between px-4 sm:px-6 md:px-12 lg:px-32 pointer-events-none">

                <motion.div
                    initial={isMobile ? false : { opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: isNavOpen ? 280 : 0 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
                    className={`w-full max-w-[320px] sm:max-w-[330px] bg-[#12141a] shadow-2xl flex flex-col pointer-events-auto relative z-20 transition-all duration-500 max-h-[85vh] sm:max-h-[560px] overflow-y-auto overflow-x-hidden rounded-[24px] border border-white/5 ${isSettingsOpen ? 'sm:rounded-l-[24px] sm:rounded-r-none' : 'sm:rounded-[24px]'}`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept={transferType === 'video' ? 'video/*' : undefined}
                        className="hidden"
                        onClick={(e) => { e.target.value = ''; }}
                        onChange={(e) => handleFiles(e.target.files)}
                    />
                    <input
                        ref={folderInputRef}
                        type="file"
                        multiple
                        webkitdirectory=""
                        directory=""
                        className="hidden"
                        onClick={(e) => { e.target.value = ''; }}
                        onChange={(e) => handleFiles(e.target.files)}
                    />
                    <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

                    {activeTransferId ? (
                        <>
                            <DownloadCard
                                transferData={transferData}
                                isFetchingTransfer={isFetchingTransfer}
                                onPreview={() => setIsPreviewOpen(true)}
                                onDownload={handleDownload}
                                isDownloadAble={isRestrictedToDownload}
                            />
                            
                            {/* Aggregated Downloading Overlay */}
                            {Object.values(downloads).some(d => d.status === 'downloading' || d.status === 'preparing') && (
                                <DownloadingOverlay
                                    isOpen={true}
                                    {...Object.values(downloads).find(d => d.status === 'downloading' || d.status === 'preparing')}
                                    onCancel={() => {
                                        const activeId = Object.keys(downloads).find(id => downloads[id].status === 'downloading' || downloads[id].status === 'preparing');
                                        if (activeId) cancelDownload(activeId);
                                    }}
                                />
                            )}
                        </>
                    ) : generatedLink ? (
                        <SuccessCard
                            shareLink={generatedLink}
                            isDownloadAble={isDownloadAble}
                            onReset={() => {
                                setGeneratedLink('');
                                setUploadedFiles([]);
                                setRecipients([]);
                                setMessage('');
                                setSelfDestruct(false);
                                setIsDownloadAble(false);
                            }}
                        />
                    ) : isUploading ? (
                        <UploadingCard
                            uploadProgress={uploadProgress}
                            uploadSpeed={uploadSpeed}
                            uploadedBytes={uploadedBytes}
                            totalBytes={currentTransferTotalBytes}
                            formatBytes={formatBytes}
                        />
                    ) : (
                        <div className="flex flex-col relative z-10 bg-white/40 dark:bg-zinc-900/40 rounded-[inherit] min-h-0 flex-1 px-3 py-2.5">

                            <TransferHeader
                                transferType={transferType}
                                hasFiles={hasFiles}
                                totalSize={totalSize}
                                formatBytes={formatBytes}
                            />

                            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide py-1.5">
                                <DropZone
                                    transferType={transferType}
                                    setTransferType={setTransferType}
                                    hasFiles={hasFiles}
                                    fileInputRef={fileInputRef}
                                    folderInputRef={folderInputRef}
                                    handleFiles={handleFiles}
                                />

                                {hasFiles && (
                                    <FileList
                                        uploadedFiles={uploadedFiles}
                                        removeFile={removeFile}
                                        formatBytes={formatBytes}
                                        handleFiles={handleFiles}
                                        fileInputRef={fileInputRef}
                                        folderInputRef={folderInputRef}
                                        onPreview={() => setIsPreviewOpen(true)}
                                        transferType={transferType}
                                        addMenuOpen={addMenuOpen}
                                        setAddMenuOpen={setAddMenuOpen}
                                        addMenuRef={addMenuRef}
                                    />
                                )}

                                {hasFiles && (
                                    <MethodSelector
                                        selectedMethod={selectedMethod}
                                        setSelectedMethod={setSelectedMethod}
                                    />
                                )}

                                {selectedMethod === 'email' && (
                                    <EmailTransferForm
                                        recipients={recipients}
                                        removeRecipient={removeRecipient}
                                        recipientInput={recipientInput}
                                        setRecipientInput={setRecipientInput}
                                        handleRecipientKeyDown={handleRecipientKeyDown}
                                        handleRecipientBlur={handleRecipientBlur}
                                        senderEmail={senderEmail}
                                        setSenderEmail={setSenderEmail}
                                        message={message}
                                        setMessage={setMessage}
                                        password={password}
                                        setPassword={setPassword}
                                        isDownloadAble={isDownloadAble}
                                        setIsDownloadAble={setIsDownloadAble}
                                        expiresIn={expiresIn}
                                        setExpiresIn={setExpiresIn}
                                        transferType={transferType}
                                    />
                                )}

                                {selectedMethod === 'link' && (
                                    <LinkTransferForm
                                        message={message}
                                        setMessage={setMessage}
                                        password={password}
                                        setPassword={setPassword}
                                        selfDestruct={selfDestruct}
                                        setSelfDestruct={setSelfDestruct}
                                        isDownloadAble={isDownloadAble}
                                        setIsDownloadAble={setIsDownloadAble}
                                        expiresIn={expiresIn}
                                        setExpiresIn={setExpiresIn}
                                        transferType={transferType}
                                    />
                                )}
                            </div>

                            {hasFiles && (
                                <TransferAction
                                    isUploading={isUploading}
                                    uploadProgress={uploadProgress}
                                    onTransfer={handleTransfer}
                                    onSettingsOpen={() => setIsSettingsOpen(!isSettingsOpen)}
                                    isSettingsOpen={isSettingsOpen}
                                />
                            )}
                        </div>
                    )}
                </motion.div>
            </main>

            <PreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                files={transferId && transferData ? (transferData.files?.length > 0 ? transferData.files : transferData.transferDetails?.files || []) : uploadedFiles}
                transferId={transferId}
                totalSizeOverride={transferId && transferData ? (transferData.transferDetails?.totalSize || transferData.totalSize) : null}
                onPreview={handlePreview}
                onDownload={transferId ? handleDownload : null}
                isDownloadAble={transferId && isRestrictedToDownload}
            />

            {/* Polling/Processing Overlay */}
            <AnimatePresence>
                {isPreparingZip && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white dark:bg-[#121217] rounded-[32px] p-10 flex flex-col items-center max-w-sm text-center shadow-2xl border border-white/5"
                        >
                            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 relative">
                                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                                <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Preparing your files...</h3>
                            <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">
                                We're bundling your files into a high-speed ZIP archive. This may take a moment depending on the size.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;