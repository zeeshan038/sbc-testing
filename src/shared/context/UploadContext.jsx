import {
    createContext,
    useContext,
    useState
} from 'react';

const UploadContext = createContext(null);

export const UploadProvider = ({ children }) => {
    const [transferType, setTransferType] = useState('files');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [linkShareType, setLinkShareType] = useState('email');
    const [selfDestruct, setSelfDestruct] = useState(false);
    const [expiresIn, setExpiresIn] = useState('7');
    const [message, setMessage] = useState('');
    const [recipients, setRecipients] = useState([]);
    const [senderEmail, setSenderEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleFiles = (files) => {
        const newFiles = Array.from(files);

        // Check if this is a folder upload (files have webkitRelativePath)
        const isFolder = newFiles.length > 0 && newFiles[0].webkitRelativePath;

        if (isFolder) {
            // Group files by their top-level folder name
            const folderMap = {};
            newFiles.forEach((file) => {
                const parts = file.webkitRelativePath.split('/');
                const folderName = parts[0];
                if (!folderMap[folderName]) {
                    folderMap[folderName] = { files: [], totalSize: 0 };
                }
                folderMap[folderName].files.push(file);
                folderMap[folderName].totalSize += file.size;
            });

            const folderEntries = Object.entries(folderMap).map(([name, data]) => ({
                _isFolder: true,
                name,
                size: data.totalSize,
                files: data.files,
                fileCount: data.files.length,
            }));

            setUploadedFiles((prev) => [...prev, ...folderEntries]);
        } else {
            setUploadedFiles((prev) => [...prev, ...newFiles]);
        }

        if (!selectedMethod) setSelectedMethod('email');
    };

    const removeRecipient = (idx) => {
        setRecipients((prev) => prev.filter((_, i) => i !== idx));
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
                message, setMessage,
                recipients, setRecipients,
                senderEmail, setSenderEmail,
                password, setPassword,
                handleFiles, removeFile, removeRecipient,
                hasFiles: uploadedFiles.length > 0
            }}
        >
            {children}
        </UploadContext.Provider>
    );
};

export const useUpload = () => useContext(UploadContext);
