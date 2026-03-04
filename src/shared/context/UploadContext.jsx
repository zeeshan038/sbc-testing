import React, { createContext, useContext, useState } from 'react';

const UploadContext = createContext(null);

export const UploadProvider = ({ children }) => {
    const [transferType, setTransferType] = useState('files');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [linkShareType, setLinkShareType] = useState('email');
    const [selfDestruct, setSelfDestruct] = useState(false);
    const [expiresIn, setExpiresIn] = useState('7');

    const handleFiles = (files) => {
        const newFiles = Array.from(files);
        setUploadedFiles((prev) => [...prev, ...newFiles]);
        if (!selectedMethod) setSelectedMethod(null);
    };

    const removeFile = (idx) => {
        setUploadedFiles((prev) => {
            const next = prev.filter((_, i) => i !== idx);
            if (next.length === 0) setSelectedMethod(null);
            return next;
        });
    };

    return (
        <UploadContext.Provider
            value={{
                transferType, setTransferType,
                uploadedFiles, setUploadedFiles,
                selectedMethod, setSelectedMethod,
                linkShareType, setLinkShareType,
                selfDestruct, setSelfDestruct,
                expiresIn, setExpiresIn,
                handleFiles, removeFile,
                hasFiles: uploadedFiles.length > 0
            }}
        >
            {children}
        </UploadContext.Provider>
    );
};

export const useUpload = () => useContext(UploadContext);
