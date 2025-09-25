import React, { useState, useCallback, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { DisplayPanel } from './components/DisplayPanel';
import { ImageModal } from './components/ImageModal';
import type { ImageFile, ImageData } from './types';
import { generateImage } from './services/geminiService';
import { defaultImages } from './assets/defaultImages';
import { ZaloIcon, FacebookIcon, YouTubeIcon } from './components/icons';

const initialMergeImageFiles: ImageFile[] = [
    ...defaultImages.map(img => ({ ...img, file: null })),
    { id: 4, file: null, preview: null, mimeType: null },
    { id: 5, file: null, preview: null, mimeType: null },
];

const initialProductAiFiles: ImageFile[] = [
    { id: 101, file: null, preview: null, mimeType: null },
    { id: 102, file: null, preview: null, mimeType: null },
    { id: 103, file: null, preview: null, mimeType: null },
    { id: 104, file: null, preview: null, mimeType: null },
    { id: 105, file: null, preview: null, mimeType: null },
];

const initialPrompts: { [key: string]: string } = {
    "Sáng tạo với AI": "Tạo hình ảnh người trong ảnh đầu tiên đang mặc đồ từ ảnh số 3 và cầm vật thể ở ảnh thứ 2 một cách tự nhiên",
    "Sản phẩm AI": "Tạo một cảnh quay quảng cáo chuyên nghiệp cho sản phẩm trong ảnh đầu tiên, sử dụng các ảnh còn lại làm tham chiếu cho bối cảnh và phong cách, với chất lượng điện ảnh, ánh sáng studio, độ phân giải cao",
};

const TABS = Object.keys(initialPrompts);

const App: React.FC = () => {
    // State for "Sáng tạo với AI" tab
    const [mergeImageFiles, setMergeImageFiles] = useState<ImageFile[]>(initialMergeImageFiles);
    // State for "Sản phẩm AI" tab
    const [productAiImageFiles, setProductAiImageFiles] = useState<ImageFile[]>(initialProductAiFiles);
    
    const [activeTab, setActiveTab] = useState<string>(TABS[0]);
    const [prompt, setPrompt] = useState<string>(initialPrompts[TABS[0]]);

    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [numberOfImages, setNumberOfImages] = useState<number>(1);

    const [generationHistory, setGenerationHistory] = useState<string[][]>([]);
    const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
    const [apiKeyTail, setApiKeyTail] = useState<string>('');

    useEffect(() => {
        if (process.env.API_KEY) {
            const key = process.env.API_KEY;
            if (key.length > 4) {
                setApiKeyTail(`...${key.slice(-4)}`);
            }
        }
    }, []);

    const readFileAsDataURL = (file: File): Promise<{ result: string, mimeType: string }> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve({ result: reader.result as string, mimeType: file.type });
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleMergeFileChange = async (id: number, file: File) => {
        const { result, mimeType } = await readFileAsDataURL(file);
        setMergeImageFiles(prevFiles =>
            prevFiles.map(imageFile =>
                imageFile.id === id
                    ? { ...imageFile, file, preview: result, mimeType }
                    : imageFile
            )
        );
    };

    const handleMergeFileDelete = (id: number) => {
        setMergeImageFiles(prevFiles =>
            prevFiles.map(imageFile =>
                imageFile.id === id
                    ? { ...imageFile, file: null, preview: null, mimeType: null }
                    : imageFile
            )
        );
         // Update prompt based on deleted image
        if (id === 2) { // Sản phẩm
            setPrompt(p => p.replace(" và cầm vật thể ở ảnh thứ 2", "").trim());
        }
        if (id === 3) { // Trang phục
            setPrompt(p => p.replace('đang mặc đồ từ ảnh số 3', 'mặc đồ phù hợp với bối cảnh').trim());
        }
    };
    
    const handleProductAiFilesChange = async (id: number, file: File) => {
        const { result, mimeType } = await readFileAsDataURL(file);
        setProductAiImageFiles(prevFiles =>
            prevFiles.map(imageFile =>
                imageFile.id === id
                    ? { ...imageFile, file, preview: result, mimeType }
                    : imageFile
            )
        );
    };

    const handleProductAiFilesDelete = (id: number) => {
        setProductAiImageFiles(prevFiles =>
            prevFiles.map(imageFile =>
                imageFile.id === id
                    ? { ...imageFile, file: null, preview: null, mimeType: null }
                    : imageFile
            )
        );
    };
    
    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);
        setSelectedImage(null);

        let imagesToProcess: ImageFile[] = [];

        switch(activeTab) {
            case "Sản phẩm AI":
                if (!productAiImageFiles[0].preview) {
                    setError('Vui lòng tải lên ảnh sản phẩm (ảnh đầu tiên).');
                    setIsLoading(false);
                    return;
                }
                imagesToProcess = productAiImageFiles.filter(f => f.preview);
                break;
            case "Sáng tạo với AI":
                const uploadedMergeImages = mergeImageFiles.filter(f => f.preview);
                if (uploadedMergeImages.length < 1 || !uploadedMergeImages[0].preview) {
                    setError('Vui lòng tải lên ít nhất ảnh Người mẫu.');
                    setIsLoading(false);
                    return;
                }
                imagesToProcess = uploadedMergeImages;
                break;
            default:
                setError('Tab không hợp lệ.');
                setIsLoading(false);
                return;
        }

        const finalPrompt = `**MỤC TIÊU: GIỮ NHẬN DIỆN KHUÔN MẶT 90–95% + THÍCH NGHI BỐI CẢNH**

**YÊU CẦU CHÍNH:** Tạo ảnh mới tỉ lệ 16:9, độ phân giải cao. Khuôn mặt người mẫu từ ảnh tham chiếu chính phải giữ **nhận diện cao (≈90–95%)**: cấu trúc mắt–mũi–miệng, xương hàm, đường chân tóc và các đặc điểm nổi bật.

**CHO PHÉP ĐỂ TỰ NHIÊN (tránh mặt “đơ”):**
- **Micro-expression** tự nhiên (ánh mắt có catchlight, môi thư giãn), **nghiêng đầu ≤ 15°**.
- **Thích nghi bối cảnh**: điều chỉnh ánh sáng, tương phản, **màu da** và cân bằng trắng để hòa hợp cảnh/quần áo/phong cách; có thể thay đổi nhẹ makeup và highlight/shadow trên mặt.
- **Blend** cổ & tóc mượt; tỉ lệ đầu–cơ thể chính xác; giữ tỷ lệ và vị trí các mốc khuôn mặt (mắt–mũi–miệng) ổn định.

**NHIỆM VỤ SÁNG TẠO:**
${prompt}

**PHONG CÁCH & KỸ THUẬT:**
Ánh sáng mềm, bóng đổ đúng hướng; DOF nhẹ; màu da trung thực sau khi thích nghi ánh sáng; độ nét vừa phải (không oversharpen); grading điện ảnh hiện đại.

**TRÁNH/NEGATIVE:**
waxy/plastic skin, over-smoothing, over-sharpen, halo/viền ghép, eye misalignment, duplicate teeth, biến dạng ngũ quan, bóng đổ sai hướng, màu da ám lệch không tự nhiên.

**KẾT QUẢ:** Ảnh 16:9 độ phân giải cao; khuôn mặt **giống rõ ràng người gốc** nhưng biểu cảm và màu sắc **hòa nhập bối cảnh** một cách sống động.`;



        try {
            const getBase64FromUrl = async (url: string): Promise<string> => {
                if (url.startsWith('data:')) {
                    return url.split(',')[1];
                }
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
                const blob = await response.blob();
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            };

            const imageDataPromises = imagesToProcess.map(async (f) => {
                if (!f.preview || !f.mimeType) throw new Error("Invalid image file data.");
                const base64Data = await getBase64FromUrl(f.preview);
                return { data: base64Data, mimeType: f.mimeType };
            });
            
            const imageData = await Promise.all(imageDataPromises);
            
            const generationPromises = Array.from({ length: numberOfImages }, () => generateImage(finalPrompt, imageData));
            const results = await Promise.all(generationPromises);
            const allGeneratedImages = results.flat();

            if (allGeneratedImages.length > 0) {
                setGeneratedImages(allGeneratedImages);
                setSelectedImage(allGeneratedImages[0]);
                setGenerationHistory(prev => [allGeneratedImages, ...prev]);
            } else {
                setError('Không thể tạo ảnh. AI không trả về kết quả hình ảnh.');
            }
        } catch (e: any) {
            console.error(e);
            setError(`Đã xảy ra lỗi: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [prompt, numberOfImages, activeTab, mergeImageFiles, productAiImageFiles]);

    const handleSelectVariation = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const handleSelectHistory = (images: string[]) => {
        setGeneratedImages(images);
        setSelectedImage(images[0] || null);
    };
    
    return (
        <div className="min-h-screen bg-[#103c3c] text-white p-4 lg:p-8 font-sans">
            <header className="text-center mb-10 max-w-[1600px] mx-auto">
               
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
                        Tool Sáng Tạo Ảnh Với AI
                    </span>
                </h1>
                <div className="mt-6">
                    <p className="text-lg text-gray-200 mb-3">KẾT NỐI VỚI CỘNG ĐỒNG  SIÊU TOOL ALL IN ONE - KTS PHONG THỦY LƯU HÀ - SĐT 0931681969</p>
                    <div className="flex justify-center items-center gap-x-5">
                        <a href="https://zalo.me/g/fqyure824" target="_blank" rel="noopener" aria-label="Connect on Zalo"
                            className="inline-flex hover:scale-110 transition">
                            <ZaloIcon className="h-12 w-12 drop-shadow" />
                        </a>

                        <a href="https://www.facebook.com/profile.php?id=61579961984812" target="_blank" rel="noopener" aria-label="Connect on Facebook"
                            className="inline-flex hover:scale-110 transition">
                            <FacebookIcon className="h-12 w-12 drop-shadow" />
                        </a>

                        <a href="https://www.youtube.com/@Si%C3%AAuToolAllInOneMMO/" target="_blank" rel="noopener" aria-label="Connect on YouTube"
                            className="inline-flex hover:scale-110 transition">
                            <YouTubeIcon className="h-12 w-12 drop-shadow" />
                        </a>
                    </div>
                </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1600px] mx-auto lg:items-start">
                <ControlPanel
                    mergeImageFiles={mergeImageFiles}
                    onMergeFileChange={handleMergeFileChange}
                    onMergeFileDelete={handleMergeFileDelete}
                    productAiImageFiles={productAiImageFiles}
                    onProductAiFilesChange={handleProductAiFilesChange}
                    onProductAiFilesDelete={handleProductAiFilesDelete}

                    prompt={prompt}
                    setPrompt={setPrompt}
                    onGenerate={handleGenerate}
                    isLoading={isLoading}
                    numberOfImages={numberOfImages}
                    setNumberOfImages={setNumberOfImages}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    TABS={TABS}
                    initialPrompts={initialPrompts}
                />
                <DisplayPanel
                    selectedImage={selectedImage}
                    generatedImages={generatedImages}
                    onSelectVariation={handleSelectVariation}
                    isLoading={isLoading}
                    error={error}
                    onImageClick={setModalImageUrl}
                    generationHistory={generationHistory}
                    onSelectHistory={handleSelectHistory}
                    currentImageSet={generatedImages}
                    apiKeyTail={apiKeyTail}
                />
            </div>
            <ImageModal imageUrl={modalImageUrl} onClose={() => setModalImageUrl(null)} />
        </div>
    );
};

export default App;
