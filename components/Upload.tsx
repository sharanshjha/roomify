import { CheckCircle2, ImageIcon, UploadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router";
import {
    PROGRESS_INTERVAL_MS,
    PROGRESS_STEP,
    REDIRECT_DELAY_MS,
    UPLOAD_ACCEPT_ATTR,
    UPLOAD_ACCEPTED_MIME_TYPES,
    UPLOAD_MAX_SIZE_MB,
} from "lib/constants";

type UploadProps = {
    maxSizeMB?: number;
    acceptedMimeTypes?: readonly string[];
    accept?: string;
    onComplete?: (base64Data: string) => void;
};

const Upload = ({
    maxSizeMB = UPLOAD_MAX_SIZE_MB,
    acceptedMimeTypes = UPLOAD_ACCEPTED_MIME_TYPES,
    accept = UPLOAD_ACCEPT_ATTR,
    onComplete,
}: UploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const { isSignedIn } = useOutletContext<AuthContext>();
    const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearProgressInterval = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            clearProgressInterval();
        };
    }, []);

    const validateFile = (selectedFile: File) => {
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        const isAllowedType = acceptedMimeTypes.includes(selectedFile.type);

        if (!isAllowedType) {
            setError("Only JPEG and PNG files are allowed.");
            return false;
        }

        if (selectedFile.size > maxSizeBytes) {
            setError(`File is too large. Max allowed size is ${maxSizeMB}MB.`);
            return false;
        }

        setError(null);
        return true;
    };

    const processFile = (selectedFile: File) => {
        if (!isSignedIn) {
            return;
        }
        if (!validateFile(selectedFile)) {
            return;
        }

        setFile(selectedFile);
        setProgress(0);

        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            if (typeof result !== "string") {
                return;
            }

            clearProgressInterval();
            progressIntervalRef.current = setInterval(() => {
                setProgress((prev) => {
                    const next = Math.min(prev + PROGRESS_STEP, 100);
                    if (next === 100) {
                        clearProgressInterval();
                        setTimeout(() => {
                            onComplete?.(result);
                        }, REDIRECT_DELAY_MS);
                    }
                    return next;
                });
            }, PROGRESS_INTERVAL_MS);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isSignedIn) {
            return;
        }

        const selectedFile = event.target.files?.[0];
        if (!selectedFile) {
            return;
        }

        processFile(selectedFile);
        event.currentTarget.value = "";
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (!isSignedIn) {
            return;
        }
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (!isSignedIn) {
            return;
        }
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        if (!isSignedIn) {
            return;
        }

        const selectedFile = event.dataTransfer.files?.[0];
        if (!selectedFile) {
            return;
        }

        processFile(selectedFile);
    };

  return (
    <div className="upload">
        {
            !file ? (
                <div
                    className={`dropzone ${isDragging ? "is-dragging" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        className="drop-input"
                        accept={accept}
                        disabled={!isSignedIn}
                        onChange={handleFileChange}
                    />
                    <div className="drop-content">
                        <div className="drop-icon"><UploadIcon size={20}/></div>
                        <p>
                            {
                                isSignedIn? (
                                    "Click to Upload or Just Drag and drop"
                                ) : (
                                    "Sign in or Sign Up with Puter to upload"
                                )
                            }
                        </p>
                        <p className="help" >Maximum file size {maxSizeMB}MB</p>
                        {error ? <p className="help text-red-500">{error}</p> : null}
                    </div>
                    </div>
            ) : (
                <div className="upload-status"><div className="status-content">
                    <div className="status-icon">{
                        progress === 100 ? (
                            <CheckCircle2 className="check" />
                        ) : (
                            <ImageIcon className="image"/>
                        )
                        }</div>
                        <h3>{file.name}</h3>
                        <div className="progress">
                            <div className="bar" style={{width:`${progress}%`}} />
                            <p className="status-text">{
                                progress < 100 ? 'Analyzing Floor Plan' : 'Redirecting...'
}</p>
                        </div>
                </div>
                    </div>
            )
        }
    </div>
  )
}

export default Upload
