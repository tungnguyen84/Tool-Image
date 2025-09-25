
import type { ImageFile } from '../types';

const image1 = {
    id: 1,
    preview: 'https://i.postimg.cc/L8s5LLyV/z7027559163749-4b2f861680783edf11e27dbaa702fb11.jpg',
    mimeType: 'image/jpeg',
};

const image2 = {
    id: 2,
    preview: 'https://i.postimg.cc/D0FyZXJL/tuixachlvlouisvuittongrenellepmmautrang8.jpg',
    mimeType: 'image/jpeg',
};

const image3 = {
    id: 3,
    preview: 'https://i.postimg.cc/QM2d2Pj6/dam-body-nu-cup-nguc-tua-rua-sexy-quyen-ru-thoi-trang-nu-3.jpg',
    mimeType: 'image/jpeg',
};


export const defaultImages: Omit<ImageFile, 'file'>[] = [
    image1,
    image2,
    image3,
];
