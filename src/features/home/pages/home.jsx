import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

// Hooks
import { useUpload } from '../../../shared/context/UploadContext';
import { useGetTransferQuery, useDownloadTransferMutation } from '../api/homeApi';
import { useFileTransfer } from '../hooks/useFileTransfer';

// Components
import SettingsModal from '../components/SettingsModal';
import PreviewModal from '../../../shared/components/PreviewModal';
import DownloadCard from '../components/DownloadCard';
import SuccessCard from '../components/SuccessCard';
import TransferHeader from '../components/TransferHeader';
import DropZone from '../components/DropZone';
import FileList from '../components/FileList';
import MethodSelector from '../components/MethodSelector';
import EmailTransferForm from '../components/EmailTransferForm';
import LinkTransferForm from '../components/LinkTransferForm';
import TransferAction from '../components/TransferAction';
import BackgroundBlobs from '../components/BackgroundBlobs';

// Utilities
import { formatBytes } from '../../../shared/utils/formatBytes';

const Home = ({ isNavOpen }) => {
    // Context State
    const {
        transferType, setTransferType,
        uploadedFiles, setUploadedFiles,
        selectedMethod, setSelectedMethod,
        selfDestruct, setSelfDestruct,
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

    // Refs
    const fileInputRef = useRef(null);
    const folderInputRef = useRef(null);
    const addMenuRef = useRef(null);

    // API Mutations/Queries
    const [downloadTransfer] = useDownloadTransferMutation();
    const { id: transferId } = useParams();
    const { data: transferData, isLoading: isFetchingTransfer } = useGetTransferQuery(
        { id: transferId, preview: true },
        { skip: !transferId }
    );
      console.log("Transfer Daa............" , transferData)
    // Business Logic Hook
    const totalSize = uploadedFiles.reduce((acc, file) => acc + file.size, 0);
    const {
        isUploading,
        uploadProgress,
        generatedLink,
        setGeneratedLink,
        handleTransfer
    } = useFileTransfer({
        uploadedFiles, setUploadedFiles,
        senderEmail, recipients, setRecipients,
        transferType, expiresIn,
        selectedMethod, selfDestruct, setMessage,
        totalSize, password
    });

    // Event Handlers
    const handleDownload = async () => {
        if (!transferId) return;
        try {
            const response = await downloadTransfer({ id: transferId }).unwrap();
            if (response.status) {
                if (response.files && response.files.length > 1 && response.zipUrl) {
                    // Download all files as a ZIP
                    const link = document.createElement('a');
                    link.href = response.zipUrl;
                    link.download = 'all_files.zip';
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                } else if (response.files && response.files.length > 0) {
                    // Download single file or multiple files individually (fallback)
                    response.files.forEach(file => {
                        const link = document.createElement('a');
                        link.href = file.url;
                        link.download = file.fileName;
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                    });
                }
            }
        } catch (err) {
            console.error("Download error:", err);
            alert("Download failed. Link may have expired or self-destructed.");
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

    return (
        <div className="fixed inset-0 w-screen h-[100svh] font-sans text-gray-900 overflow-hidden bg-gradient-to-br from-[#f0f4f9] to-[#d6e4f9] touch-none overscroll-none">

            <BackgroundBlobs />

            <main className="fixed inset-0 z-10 flex items-center justify-center sm:justify-start lg:justify-between px-4 sm:px-6 md:px-12 lg:px-32 pointer-events-none">

                <motion.div
                    initial={isMobile ? false : { opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: isNavOpen ? 280 : 0 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
                    className={`w-full max-w-[300px] bg-[#12141a] shadow-2xl flex flex-col pointer-events-auto relative z-20 transition-all duration-500 max-h-[85vh] sm:max-h-[520px] overflow-y-auto overflow-x-hidden rounded-[24px] border border-white/5 ${isSettingsOpen ? 'sm:rounded-l-[24px] sm:rounded-r-none' : 'sm:rounded-[24px]'}`}
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

                    {transferId ? (
                        <DownloadCard
                            transferData={transferData}
                            isFetchingTransfer={isFetchingTransfer}
                            onPreview={() => setIsPreviewOpen(true)}
                            onDownload={handleDownload}
                        />
                    ) : generatedLink ? (
                        <SuccessCard
                            shareLink={generatedLink}
                            onReset={() => {
                                setGeneratedLink(null);
                                setUploadedFiles([]);
                                setRecipients([]);
                                setMessage('');
                            }}
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
                                        expiresIn={expiresIn}
                                        setExpiresIn={setExpiresIn}
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
                                        expiresIn={expiresIn}
                                        setExpiresIn={setExpiresIn}
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
                files={transferId && transferData ? transferData.files : uploadedFiles}
                transferId={transferId}
                totalSizeOverride={transferId && transferData ? transferData.transferDetails?.totalSize : null}
                onDownload={transferId ? handleDownload : null}
            />
        </div>
    );
};

export default Home;