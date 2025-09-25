import React from 'react';
import { DownloadIcon, ZoomIcon } from './icons';

interface DisplayPanelProps {
    selectedImage: string | null;
    generatedImages: string[];
    onSelectVariation: (imageUrl: string) => void;
    isLoading: boolean;
    error: string | null;
    onImageClick: (imageUrl: string) => void;
    generationHistory: string[][];
    onSelectHistory: (images: string[]) => void;
    currentImageSet: string[];
    apiKeyTail: string;
}

const SkeletonLoader: React.FC = () => (
    <div className="w-full aspect-square bg-slate-700/50 rounded-xl animate-pulse"></div>
);

export const DisplayPanel: React.FC<DisplayPanelProps> = ({
    selectedImage,
    generatedImages,
    onSelectVariation,
    isLoading,
    error,
    onImageClick,
    generationHistory,
    onSelectHistory,
    currentImageSet,
    apiKeyTail
}) => {
    const handleDownload = (imageUrl: string, index: number) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        // Simple way to get extension. Assumes base64 string format.
        const mimeType = imageUrl.substring(imageUrl.indexOf(':') + 1, imageUrl.indexOf(';'));
        const extension = mimeType.split('/')[1] || 'png';
        link.download = `generated-image-${index + 1}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadAll = () => {
        generatedImages.forEach((img, index) => {
            // A slight delay might help browsers handle multiple downloads, but triggering directly is often fine.
            setTimeout(() => handleDownload(img, index), index * 100);
        });
    };

    return (
        <div className="bg-[#1f5f5f]/80 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
            <div className="flex items-center justify-center bg-[#103c3c] rounded-xl mb-6">
                {isLoading && (
                    <div className="text-center p-8">
                        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-amber-400 mx-auto"></div>
                        <p className="mt-4 text-lg">Đang tạo hình ảnh AI...</p>
                        <p className="text-sm text-slate-400">Quá trình này có thể mất vài phút.</p>
                        {apiKeyTail && <p className="text-xs text-slate-500 mt-2 font-mono">API Key: {apiKeyTail}</p>}
                    </div>
                )}
                {error && <p className="text-red-400 text-center p-8">{error}</p>}
                {!isLoading && !error && selectedImage && (
                    <div className="relative group cursor-pointer" onClick={() => onImageClick(selectedImage)}>
                        <img src={selectedImage} alt="Generated result" className="max-w-full h-auto rounded-lg" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                            <ZoomIcon className="w-12 h-12 text-white" />
                        </div>
                    </div>
                )}
                {!isLoading && !error && !selectedImage && (
                     <div className="text-center text-slate-400 p-8">
                        <p className="text-2xl mb-2">Xem trước ảnh của bạn</p>
                        <p>Hình ảnh do AI tạo sẽ xuất hiện ở đây sau khi bạn nhấp vào "Tạo ảnh".</p>
                    </div>
                )}
            </div>

            {generatedImages.length > 0 && !isLoading && (
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-md font-semibold">Chọn một ảnh:</h3>
                        <button 
                            onClick={handleDownloadAll} 
                            className="flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#154949] text-slate-200 hover:bg-[#2e7c7c] transition-colors"
                        >
                            <DownloadIcon className="w-4 h-4 mr-1.5" />
                            Tải tất cả
                        </button>
                    </div>
                    <div className="flex space-x-4 overflow-x-auto pb-2">
                        {generatedImages.map((img, index) => (
                            <div key={index} className="flex-shrink-0 relative group">
                                <button
                                    onClick={() => onSelectVariation(img)}
                                    className={`w-28 h-28 rounded-lg overflow-hidden transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${selectedImage === img ? 'ring-4 ring-amber-500 shadow-lg' : 'ring-2 ring-transparent hover:ring-amber-400'}`}
                                >
                                    <img src={img} alt={`Variation ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                                <button
                                    onClick={() => handleDownload(img, index)}
                                    className="absolute bottom-1 right-1 z-10 p-1.5 bg-black/40 rounded-full text-white hover:bg-amber-500 transition-all duration-200 opacity-0 group-hover:opacity-100"
                                    aria-label="Download image"
                                    title="Tải ảnh"
                                >
                                    <DownloadIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {generationHistory.length > 0 && !isLoading && (
                <div className="mt-6 pt-6 border-t border-[#2e7c7c]/50">
                    <h3 className="text-md font-semibold mb-3">Lịch sử tạo ảnh</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {generationHistory.map((imageSet, index) => {
                            const isActive = imageSet.length > 0 && currentImageSet.length > 0 && imageSet[0] === currentImageSet[0];
                            if (imageSet.length === 0) return null;
                            return (
                                <button 
                                    key={index}
                                    onClick={() => onSelectHistory(imageSet)}
                                    className={`w-full flex items-center p-2 rounded-lg transition-colors text-left ${isActive ? 'bg-amber-500/20' : 'bg-[#103c3c] hover:bg-[#2e7c7c]'}`}
                                >
                                    <img src={imageSet[0]} alt={`History item ${index + 1}`} className="w-12 h-12 object-cover rounded-md mr-4 flex-shrink-0" />
                                    <div className="flex-grow">
                                        <p className="text-sm font-medium text-slate-200">Lần tạo #{generationHistory.length - index}</p>
                                        <p className="text-xs text-slate-400">{imageSet.length} ảnh</p>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};