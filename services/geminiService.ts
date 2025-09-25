
import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (prompt: string, images: ImageData[]): Promise<string[]> => {
    try {
        const imageParts = images.map(image => ({
            inlineData: {
                data: image.data,
                mimeType: image.mimeType,
            },
        }));

        const contents = {
            parts: [{ text: prompt }, ...imageParts],
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents,
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const generatedImages: string[] = [];
        if (response.candidates && response.candidates.length > 0) {
            for (const candidate of response.candidates) {
                if (candidate.content && candidate.content.parts) {
                    for (const part of candidate.content.parts) {
                        if (part.inlineData) {
                            const base64ImageBytes = part.inlineData.data;
                            const mimeType = part.inlineData.mimeType;
                            const imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
                            generatedImages.push(imageUrl);
                        }
                    }
                }
            }
        }
        
        if (generatedImages.length === 0) {
            console.warn("API response did not contain any images.", response);
        }

        return generatedImages;

    } catch (error) {
        console.error("Error generating image with Gemini API:", error);
        throw new Error("Failed to generate image. Please check the console for more details.");
    }
};
