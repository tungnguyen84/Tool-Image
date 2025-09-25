import React from 'react';
import { CloseIcon } from './icons';

interface ImageModalProps {
    imageUrl: string | null;
    onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fadeIn"
            onClick={onClose}
            style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                `}
            </style>
            <div 
                className="relative max-w-5xl w-full max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <img src={imageUrl} alt="Full screen view" className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl" />
                <button 
                    onClick={onClose}
                    className="absolute -top-4 -right-4 md:top-2 md:right-2 p-2 bg-black/60 rounded-full text-white hover:bg-red-500/80 transition-colors"
                    aria-label="Close image view"
                >
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};