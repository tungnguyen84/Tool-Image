
export interface ImageFile {
    id: number;
    file: File | null;
    preview: string | null;
    mimeType: string | null;
}

export interface ImageData {
    data: string; // base64 encoded string
    mimeType: string;
}
