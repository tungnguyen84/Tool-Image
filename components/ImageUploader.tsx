import React, { useRef } from 'react';
import type { ImageFile } from '../types';
import { PlusIcon, CloseIcon } from './icons';

interface ImageUploaderProps {
    imageFile: ImageFile;
    onFileChange: (id: number, file: File) => void;
    onDelete: (id: number) => void;
    label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ imageFile, onFileChange, onDelete, label }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileChange(imageFile.id, file);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        onDelete(imageFile.id);
    }
    
    const uploaderContent = imageFile.preview ? (
        <img src={imageFile.preview} alt={`Upload ${imageFile.id}`} className="w-full h-full object-cover" />
    ) : (
        <div className="flex flex-col items-center justify-center text-slate-400">
            <PlusIcon className="w-6 h-6 mb-1" />
            <span className="text-xs">Tải ảnh</span>
        </div>
    );

    return (
        <div className="flex flex-col items-center">
            <div className="relative group w-full">
                {imageFile.preview && (
                     <button 
                        onClick={handleDelete}
                        className="absolute top-1 right-1 z-10 p-1 bg-black/50 rounded-full text-white hover:bg-red-500 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        aria-label="Remove image"
                        title="Xoá ảnh"
                    >
                        <CloseIcon className="w-3 h-3" />
                    </button>
                )}
                <div
                    onClick={handleClick}
                    className={`aspect-square rounded-lg cursor-pointer overflow-hidden transition-all duration-200
                        ${imageFile.preview
                            ? 'bg-slate-700 border-2 border-transparent hover:border-amber-500'
                            : 'bg-transparent border-2 border-dashed border-[#2e7c7c] hover:border-amber-400 hover:bg-[#154949] flex items-center justify-center'}`
                    }
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/png, image/jpeg"
                    />
                    {uploaderContent}
                </div>
            </div>
            {label && <span className="text-xs text-slate-300 mt-2">{label}</span>}
        </div>
    );
};