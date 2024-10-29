import { useState, useCallback } from "react";
import { Upload, Check, Copy, CheckCircle } from "lucide-react";

const VideoUploader = () => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("idle");
    const [hlsLink, setHlsLink] = useState(null);
    const [isCopied, setIsCopied] = useState(false);

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    }, []);

    const onFileChange = useCallback((e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    }, []);

    const uploadFile = async () => {
        if (!file) return;

        setUploadStatus("uploading");

        try {
            // Create a FormData object to hold the video file
            const formData = new FormData();
            formData.append("video", file); // Add the file with the key 'video'

            // Make an API call to upload the video file using fetch
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (response.ok) {
                const responseData = await response.json();
                setUploadStatus("uploaded");
                const { videoKey } = responseData;

                // Extract the specific part you need from the videoKey
                const extractedKey = videoKey.split("/")[1].split(".")[0];

                // Call the status check function with the extracted key
                checkTranscodingStatus(extractedKey);
            } else {
                setUploadStatus("error");
            }
        } catch (error) {
            console.log("Error uploading file:", error);
            setUploadStatus("error");
        }
    };

    const checkTranscodingStatus = async (videoKey) => {
        setUploadStatus("transcoding");
        try {
            // Make a GET request to the check-status endpoint using fetch
            const response = await fetch(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/check-status?videoKey=${videoKey}`
            );

            if (response.ok) {
                const responseData = await response.json();
                const { link } = responseData;
                setHlsLink(link);
                setUploadStatus("completed");
            } else {
                setUploadStatus("error");
            }
        } catch (error) {
            console.log("Error checking transcoding status:", error);
        }
    };

    const copyToClipboard = useCallback(() => {
        if (hlsLink) {
            navigator.clipboard.writeText(hlsLink).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        }
    }, [hlsLink]);

    return (
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-light text-gray-100 mb-6 text-center">
                Try It Now
            </h2>
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    isDragging ? "border-gray-300" : "border-gray-600"
                }`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                {file && uploadStatus === "idle" ? (
                    <div className="text-gray-300">
                        <Check className="w-16 h-16 mx-auto mb-4 text-green-400" />
                        <p className="text-lg font-light">{file.name}</p>
                        <p className="text-sm opacity-70">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                ) : uploadStatus === "idle" ? (
                    <>
                        <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-300 text-lg mb-2 font-light">
                            Drag and drop your video here
                        </p>
                        <p className="text-gray-400 font-light">or</p>
                        <label className="mt-4 inline-block px-4 py-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                            <input
                                type="file"
                                className="hidden"
                                onChange={onFileChange}
                                accept="video/*"
                            />
                            <span className="text-gray-300 font-light">
                                Select a file
                            </span>
                        </label>
                    </>
                ) : uploadStatus !== "completed" ? (
                    <div className="text-gray-300">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-300 mx-auto mb-4"></div>
                        <p className="text-lg font-light">
                            {uploadStatus === "uploading" && "Uploading..."}
                            {uploadStatus === "uploaded" &&
                                "Upload complete. Preparing for transcoding..."}
                            {uploadStatus === "transcoding" &&
                                "Transcoding in progress..."}
                            {uploadStatus === "error" &&
                                "An error occurred. Please try again."}
                        </p>
                    </div>
                ) : (
                    <div className="text-gray-300">
                        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
                        <p className="text-lg font-light">
                            Transcoding complete!
                        </p>
                    </div>
                )}
            </div>
            {file && uploadStatus === "idle" && (
                <button
                    className="mt-6 w-full py-2 px-4 bg-blue-600 text-gray-100 rounded-lg font-light hover:bg-blue-700 transition-colors"
                    onClick={uploadFile}
                >
                    Upload and Transcode
                </button>
            )}
            {hlsLink && (
                <div className="mt-6 text-center">
                    <h2 className="text-xl font-light text-gray-100 mb-2">
                        HLS Link:
                    </h2>
                    <div className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
                        <a
                            href={hlsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline break-all font-light text-sm mr-2"
                        >
                            {hlsLink}
                        </a>
                        <button
                            onClick={copyToClipboard}
                            className="bg-blue-600 text-gray-100 rounded-full p-2 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            aria-label="Copy to clipboard"
                        >
                            {isCopied ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : (
                                <Copy className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {isCopied && (
                        <p className="text-green-400 text-sm mt-2">
                            Copied to clipboard!
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default VideoUploader;
