import React, { useState, useEffect } from 'react';
import type { ImageFile } from '../types';
import { ImageUploader } from './ImageUploader';
import { Section } from './Section';
import { ActionButton } from './ActionButton';
import { Tabs } from './Tabs';
import { WandIcon, TrashIcon } from './icons';

interface ControlPanelProps {
    // Props for "Sáng tạo với AI"
    mergeImageFiles: ImageFile[];
    onMergeFileChange: (id: number, file: File) => void;
    onMergeFileDelete: (id: number) => void;

    // Props for "Sản phẩm AI"
    productAiImageFiles: ImageFile[];
    onProductAiFilesChange: (id: number, file: File) => void;
    onProductAiFilesDelete: (id: number) => void;

    // Common props
    prompt: string;
    setPrompt: (prompt: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    numberOfImages: number;
    setNumberOfImages: (n: number) => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    TABS: string[];
    initialPrompts: { [key: string]: string };
}

// Data for Edit Styles in Tab "Chỉnh sửa ảnh"
const photoShootStyles: { [key: string]: string[] } = {
    "Âm nhạc & Vũ đạo": [
        "Biểu diễn Beatbox", "Biểu diễn Capoeira", "Biểu diễn múa bụng", "Biểu diễn múa đương đại", "Biểu diễn múa lửa", "Biểu diễn nhạc cụ dân tộc", "Biểu diễn nhạc kịch", "Biểu diễn tuồng cổ Việt Nam", "Buổi biểu diễn của một ban nhạc indie", "Buổi biểu diễn nhạc Acoustic", "Buổi hòa nhạc cổ điển", "Cửa hàng đĩa than vintage", "Dàn hợp xướng nhà thờ", "Dàn nhạc giao hưởng", "DJ booth sôi động", "Hát Karaoke", "Lễ hội âm nhạc bãi biển", "Lễ hội âm nhạc Coachella", "Lễ hội âm nhạc EDM", "Lễ hội âm nhạc Rock in Rio", "Lễ hội âm nhạc Tomorrowland", "Lớp học Ballet", "Lớp học hip-hop", "Lớp học khiêu vũ thể thao", "Lớp học múa cột", "Lớp học múa lân", "Lớp học nhảy salsa", "Nhảy Breakdance", "Phòng tập nhảy hiện đại", "Phòng thu âm chuyên nghiệp", "Quán bar nhạc Jazz", "Sàn nhảy Disco thập niên 80", "Soạn nhạc bên cây đàn piano", "Sân khấu cải lương", "Sân khấu nhạc pop K-Pop", "Sân khấu nhạc Rock", "Sân khấu nhạc Trịnh", "Sân khấu Opera", "Trên sân khấu Broadway", "Trong một MV ca nhạc", "Trong một phòng trà", "Trong một vở nhạc kịch", "Trận đấu Dance Battle đường phố", "Vũ công Hula Hawaii", "Vũ điệu Flamenco", "Vũ điệu Samba", "Vũ điệu thổ dân", "Vũ điệu truyền thống Ai-len", "Vũ điệu uyển chuyển của Apsara", "Vũ điệu Tango nồng cháy"
    ],
    "Ảnh Cưới": [
        "Ảnh Cưới Sa mạc cát (Dubai vibes)", "Ảnh Cưới Cánh đồng muối", "Ảnh Cưới Cánh đồng cỏ lau", "Ảnh Cưới Đầm sen mùa hạ", "Ảnh Cưới Vườn hoa tam giác mạch", "Ảnh Cưới Rừng tre Nhật Bản", "Ảnh Cưới Cánh đồng hướng dương", "Ảnh Cưới Hồ trên núi (view mây)", "Ảnh Cưới Bãi đá rêu ven biển", "Ảnh Cưới Ghềnh đá hoang sơ", "Ảnh Cưới Hải đăng gió biển", "Ảnh Cưới Bến cảng & du thuyền đêm", "Ảnh Cưới Rooftop thành phố (skyline)", "Ảnh Cưới Đường tàu cổ", "Ảnh Cưới Cầu kính trên cao", "Ảnh Cưới Hang động đá vôi", "Ảnh Cưới Rừng tràm – đường nước", "Ảnh Cưới Vườn nho Địa Trung Hải", "Ảnh Cưới Vườn xương rồng sa mạc", "Ảnh Cưới Rừng phong lá đỏ (Mùa thu)", "Ảnh Cưới Phố cổ Hà Nội mùa lá vàng", "Ảnh Cưới Sapa mùa sương tuyết", "Ảnh Cưới Đồi cát đỏ Mũi Né", "Ảnh Cưới Cầu gỗ trên đầm", "Ảnh Cưới Nhà thờ hiện đại", "Ảnh Cưới Chùa cổ thanh tịnh", "Ảnh Cưới Vườn Nhật Bản zen garden", "Ảnh Cưới Nhà kính hoa", "Ảnh Cưới Quán bar rooftop (neon hiện đại)", "Ảnh Cưới Thảo nguyên – đàn ngựa", "Ảnh Cưới Bìa rừng thông sương sớm", "Ảnh Cưới Thác nước hùng vĩ", "Ảnh Cưới Con đường hoa giấy", "Ảnh Cưới Làng chài bình minh", "Ảnh Cưới Cầu gỗ xuyên rừng", "Ảnh Cưới Bãi cỏ ven hồ picnic", "Ảnh Cưới Con ngõ tường vàng Hội An vibe", "Ảnh Cưới Xưởng gốm/atelier nghệ thuật", "Ảnh Cưới Garage xe cổ (retro)", "Ảnh Cưới Rạp chiếu phim cũ", "Ảnh Cưới Thư quán/tiệm sách cũ", "Ảnh Cưới Tiệm bánh/coffee lab tối giản", "Ảnh Cưới Studio high-key trắng tinh", "Ảnh Cưới Studio low-key (ánh sáng viền)", "Ảnh Cưới Khói màu nghệ thuật (smoke bomb)", "Ảnh Cưới Pháo giấy confetti", "Ảnh Cưới Dải đèn fairy light trong rừng", "Ảnh Cưới Pháo hoa lễ hội", "Ảnh Cưới Lanter festival (đèn lồng)", "Ảnh Cưới Trên cầu cảng gỗ hoàng hôn", "Ảnh Cưới Đồng lúa mùa gặt", "Ảnh Cưới Cánh đồng hoa lavender", "Ảnh Cưới Vườn cam/vườn táo thu hoạch", "Ảnh Cưới Biệt thự Bắc Âu (Scandinavian)", "Ảnh Cưới Cabin gỗ trên đồi", "Ảnh Cưới Bể bơi vô cực (infinity pool)", "Ảnh Cưới Sân tennis/sân bóng (sporty chic)", "Ảnh Cưới Sân băng/tuyết giả (winter wonderland)", "Ảnh Cưới Đường đèo – xe phân khối lớn", "Ảnh Cưới Đồng hoa cúc họa mi", "Ảnh Cưới Vườn hồng cổ", "Ảnh Cưới Vườn bonsai/tiểu cảnh", "Ảnh Cưới Cối xay gió – đồng cỏ", "Ảnh Cưới Lâu đài gạch đỏ kiểu châu Âu", "Ảnh Cưới Nhà ga vintage", "Ảnh Cưới Kho container (urban industrial)", "Ảnh Cưới Bảo tàng nghệ thuật đương đại (minimal)", "Ảnh Cưới Thuyền gỗ trên sông lãng mạn", "Ảnh Cưới Con đường tán cây (tunnel of trees)", "Ảnh Cưới Đêm sương – đèn ô tô ngược sáng", "Ảnh Cưới Mưa bong bóng xà phòng", "Ảnh Cưới Đồng cỏ lau – váy bay gió", "Ảnh Cưới Balcony căn hộ view thành phố", "Ảnh Cưới Hẻm neon cyberpunk", "Ảnh Cưới Sương mù đồi chè bình minh", "Ảnh Cưới Vườn cam quýt miền nhiệt đới", "Ảnh Cưới Cánh đồng tulip (châu Âu vibes)", "Ảnh Cưới Bãi đá xếp tầng (basalt)", "Ảnh Cưới Lều glamping sang trọng", "Ảnh Cưới Nhà kính xương rồng", "Ảnh Cưới Bờ kè sóng biển – áo dài trắng", "Ảnh Cưới Vách đá nhìn ra biển (cliff view)", "Ảnh Cưới Lối đi gạch bông retro", "Ảnh Cưới Hẻm graffitti nghệ thuật", "Ảnh Cưới Vườn trà/nhà trà Nhật", "Ảnh Cưới Bãi cỏ sân trường chiều hoài niệm", "Ảnh Cưới Bên đàn violin/saxophone (music theme)", "Ảnh Cưới First Look trong rừng", "Ảnh Cưới Buổi sáng chuẩn bị (getting ready)", "Ảnh Cưới Hậu lễ – dạo phố casual", "Ảnh Cưới Drone top-down ở bãi biển", "Ảnh Cưới Ảnh phản chiếu trên vũng nước mưa", "Ảnh Cưới Silhouette trước hoàng hôn", "Ảnh Cưới Ánh nắng xuyên cửa sổ (window light)", "Ảnh Cưới Tường kính kiến trúc hiện đại", "Ảnh Cưới Sảnh khách sạn sang trọng", "Ảnh Cưới Thang cuốn – trung tâm thương mại", "Ảnh Cưới Hành lang gạch đá cổ", "Ảnh Cưới Sân ga tàu điện hiện đại"
    ],
    "Ảnh Kỷ Yếu": [
        "Áo dài trắng tinh khôi", "Bãi biển", "Bình minh trên núi", "Cắm trại qua đêm", "Chiến tranh súng nước", "Chụp cùng thú cưng", "Chụp tại bến xe bus", "Chụp tại di tích lịch sử", "Chụp tại nhà hát lớn", "Chụp tại sân bay", "Chụp tại siêu thị/cửa hàng tiện lợi", "Chụp tại viện bảo tàng", "Chụp trong rừng", "Chụp với bóng bay", "Chụp với pháo khói màu", "Chụp với xe đạp", "Concept 'Băng đảng'", "Concept 'Chuyến tàu thanh xuân'", "Concept 'Chụp ảnh thẻ'", "Concept 'Dạ tiệc cuối năm' (Prom)", "Concept 'Hậu tận thế'", "Concept 'Những kẻ mộng mơ'", "Concept 'Phòng thí nghiệm'", "Concept 'Tạp chí thời trang'", "Concept 'Tháng năm rực rỡ'", "Concept 'Tù nhân'", "Concept bột màu", "Concept Picnic", "Dưới mưa", "Gác lại lo âu", "Hóa trang thành các nghề nghiệp", "Hóa trang thành nhân vật phim", "Khu vui chơi", "Lớp học nấu ăn", "Nông trại (bò sữa, cừu)", "Phong cách Vintage/Retro", "Quay về thập niên 90", "Sân thượng tòa nhà", "Sân trường dấu yêu", "Sân vận động", "Thư viện", "Tiệc ngủ (Pajama Party)", "Trang phục Cử nhân", "Trong lớp học", "Trò chơi dân gian", "Vườn cổ tích", "Đường phố ban đêm", "Đồng phục học sinh", "Đến thăm trại trẻ mồ côi", "Chèo thuyền SUP/Kayak"
    ],
    "Ẩm thực & Đồ uống": [
        "Bàn ăn phong cách Flatlay", "Bàn tiệc Buffet", "Bàn tiệc hải sản tươi sống", "Bàn tiệc phô mai và rượu vang", "Bàn tiệc thịnh soạn", "Bếp chuyên nghiệp", "Bếp lửa hồng nấu ăn", "Bữa sáng trên giường", "Bữa tiệc BBQ sân vườn", "Bữa tiệc Dim Sum", "Bữa tiệc taco", "Bữa tiệc trà chiều kiểu Anh", "Bữa tối lãng mạn dưới nến", "Cận cảnh giọt mật ong", "Cận cảnh một chiếc bánh cưới", "Cận cảnh một ly cocktail đang cháy", "Cận cảnh món ăn (Food styling)", "Cảnh câu cá và chế biến", "Cảnh làm kem gelato", "Cảnh làm mứt Tết", "Cảnh làm pasta tươi", "Cảnh làm phô mai", "Cảnh làm socola thủ công", "Cảnh nướng bánh mì", "Cảnh rót rượu vang", "Cảnh thu hoạch nông sản", "Cảnh vắt sữa bò", "Chợ đêm ẩm thực Đài Loan", "Chợ nông sản địa phương", "Dã ngoại với giỏ picnic", "Lễ hội bia Oktoberfest", "Lễ hội cà phê", "Lễ hội hàu", "Lễ hội ẩm thực quốc tế", "Lò bánh mì truyền thống", "Lớp học làm pizza", "Lớp học làm sushi", "Lớp học nấu ăn", "Nhà hàng trên sân thượng", "Nướng kẹo dẻo bên lửa trại", "Pha chế cà phê nghệ thuật", "Quán ăn đường phố đêm", "Quán bar cocktail sang trọng", "Quán bar nước ép trái cây", "Quán phở Việt Nam", "Quán trà đạo Nhật Bản", "Sô cô la tan chảy", "Tiệm bánh ngọt kiểu Pháp", "Trong một nhà máy bia thủ công", "Vườn cây ăn trái"
    ],
    "Bãi biển": [
        "Anse Source d'Argent, Seychelles", "Bãi biển Anse Intendance, Seychelles", "Bãi biển Anse Lazio, Seychelles", "Bãi biển Baia do Sancho, Brazil", "Bãi biển Bondi, Úc", "Bãi biển Cannon, Oregon", "Bãi biển Cape Vidal, Nam Phi", "Bãi biển Cathedral Cove, New Zealand", "Bãi biển Copacabana, Brazil", "Bãi biển Cát Cò, Cát Bà, Việt Nam", "Bãi biển Cát Hồng, Bahamas", "Bãi biển Diani, Kenya", "Bãi biển Diamond, Iceland", "Bãi biển Elafonissi (Cát hồng), Hy Lạp", "Bãi biển El Nido, Philippines", "Bãi biển Flamenco, Puerto Rico", "Bãi biển Hidden Beach, Mexico", "Bãi biển Honopu, Hawaii", "Bãi biển Hyams, Úc (cát trắng nhất)", "Bãi biển Kelingking, Bali", "Bãi biển Koekohe (Moeraki Boulders), New Zealand", "Bãi biển Lanikai, Hawaii", "Bãi biển Legzira với cổng vòm đá, Ma-rốc", "Bãi biển Long Beach, Phú Quốc, Việt Nam", "Bãi biển Myrtos, Hy Lạp", "Bãi biển Mỹ Khê, Đà Nẵng, Việt Nam", "Bãi biển Navagio (Shipwreck Beach), Hy Lạp", "Bãi biển Noordhoek, Nam Phi", "Bãi biển Oludeniz, Thổ Nhĩ Kỳ", "Bãi biển Pfeiffer (Cát tím), California", "Bãi biển Pink Beach, Indonesia", "Bãi biển Railay, Thái Lan", "Bãi biển Reynisfjara (Cát đen), Iceland", "Bãi biển Seven Mile, Jamaica", "Bãi biển Tulum, Mexico", "Bãi biển Varadero, Cuba", "Bãi biển Vỏ sò (Shell Beach), Úc", "Bãi biển White Beach, Boracay", "Bãi biển Whitehaven, Úc", "Bãi biển Zlatni Rat, Croatia", "Bãi biển phát quang sinh học (Vaadhoo), Maldives", "Bãi biển thủy tinh (Glass Beach), California", "Bãi biển ở quần đảo Whitsunday, Úc", "Bãi biển trên sân bay (Maho Beach), St. Maarten", "Hoàng hôn trên bãi biển", "Phá nước màu ngọc lam ở Bora Bora", "Praia da Marinha, Bồ Đào Nha", "The Baths, British Virgin Islands", "Vịnh Grace, Turks và Caicos", "Vịnh Maya, Thái Lan"
    ],
    "Chụp Ảnh Em Bé": [
        "Bé và anh/chị em", "Bé và bong bóng xà phòng", "Bé và bố mẹ", "Bé và gương", "Bé và sách", "Bé và thú cưng", "Bé chơi với bột mì", "Bé chơi với đồ chơi gỗ", "Bé trong giỏ hoa quả", "Bé trong vườn hoa", "Bé tập lẫy/bò/đi", "Biểu cảm ngộ nghĩnh (Funny faces)", "Chụp ảnh Giáng sinh", "Chụp ảnh Tết", "Chụp ảnh đen trắng nghệ thuật", "Chụp ảnh dưới nước", "Chụp cùng bố mẹ", "Chụp flatlay từ trên xuống", "Chụp khoảnh khắc bé cười", "Chụp khoảnh khắc bé khóc", "Chụp khoảnh khắc tự nhiên khi chơi đùa", "Chụp ngoài trời với thiên nhiên", "Chụp với background tối màu", "Chụp với bóng bay", "Chụp với bóng nước", "Chụp với trang phục len đan", "Chụp với đèn lấp lánh (bokeh)", "Concept 'Cổ động viên'", "Concept 'Du hành gia'", "Concept 'Hoàng tử/Công chúa'", "Concept 'Họa sĩ nhí'", "Concept 'In a box'", "Concept 'Newborn' (bé ngủ)", "Concept 'Nhà khoa học'", "Concept 'Nhạc công nhí'", "Concept 'Nông dân nhí'", "Concept 'Phi công'", "Concept 'Siêu anh hùng nhí'", "Concept 'Thiên thần nhỏ'", "Concept 'Thủy thủ'", "Concept 'Vận động viên nhí'", "Concept 'Đầu bếp nhí'", "Hóa trang thành các nhân vật cổ tích", "Hóa trang thành động vật", "Khoảnh khắc tự nhiên khi chơi đùa", "Ngủ trên mặt trăng/mây", "Tắm trong bồn sữa (Milk bath)", "Thôi nôi (Smash cake)", "Bé trong chậu tắm", "Bé trong lều vải"
    ],
    "Chụp Ảnh Gia Đình": [
        "Bữa tối ấm cúng", "Buổi sáng trên giường ngủ", "Cắm trại trong rừng", "Chơi trò chơi board game", "Chơi với bóng bay", "Chụp ảnh Lifestyle tại nhà", "Chụp ảnh ngược sáng (silhouette) lúc hoàng hôn", "Chụp ảnh phản chiếu (reflection)", "Chụp ảnh với thú cưng", "Chụp ảnh đen trắng", "Chụp tại công viên giải trí", "Chụp tại một hội chợ", "Chụp tại viện bảo tàng", "Chụp tại sân bay (chuẩn bị đi du lịch)", "Chụp trong siêu thị", "Chụp trong tiệm giặt là", "Chụp ảnh dưới nước (hồ bơi)", "Concept 'Bữa tiệc trà'", "Concept 'Chiến tranh gối'", "Concept 'Ngày mưa' trong nhà", "Concept 'Siêu anh hùng'", "Concept 'The Addams Family'", "Cùng nhau đi xe đạp", "Cùng nhau đọc sách", "Cùng nhau thả diều", "Cùng nhau vẽ tranh", "Du lịch biển", "Đi dạo trong thành phố", "Đi hái dâu/trái cây", "Đa thế hệ (Ông bà, cha mẹ, con cháu)", "Đến thăm nông trại", "Đón thành viên mới", "Hóa trang Halloween", "Khoảnh khắc ôm nhau tự nhiên", "Kỷ niệm ngày cưới", "Làm vườn", "Nấu ăn cùng nhau", "Phong cách Vintage", "Picnic cuối tuần", "Thăm một di tích lịch sử", "Thăm vườn bách thú", "Trang phục đồng điệu (matching outfits)", "Trang trí nhà cửa dịp lễ (Giáng sinh, Tết)", "Trở về thăm quê", "Tiệc sinh nhật", "Xem phim tại nhà", "Xây lâu đài cát", "Chơi thể thao", "Đi bộ đường dài", "Chụp ảnh từ trên cao (drone)"
    ],
    "Công trường & Nhà máy": [
        "Bên cạnh máy móc công nghiệp nặng", "Bên trong một lò luyện kim", "Cảnh lắp ráp máy bay", "Cảnh vận hành cần cẩu tháp", "Công trường xây dựng cầu treo", "Công trường xây dựng một con đập thủy điện", "Công trường xây dựng một sân vận động", "Công trường xây dựng tòa nhà chọc trời", "Công trường xây dựng đường hầm", "Công trường xây dựng đường sắt trên cao", "Dây chuyền đóng gói tự động", "Dây chuyền sản xuất dược phẩm", "Dây chuyền sản xuất nước giải khát", "Giàn khoan dầu trên biển", "Khu công nghiệp bị bỏ hoang", "Khu vực bốc dỡ hàng tại cảng", "Khu vực hàn điện", "Lắp ráp tua-bin gió", "Lắp đặt các tấm pin mặt trời", "Lò gạch truyền thống", "Mỏ khai thác đá cẩm thạch", "Mỏ khai thác kim cương", "Mỏ than", "Mỏ vàng", "Nhà máy dệt may", "Nhà máy giấy", "Nhà máy lắp ráp điện tử", "Nhà máy lọc dầu", "Nhà máy sản xuất ô tô", "Nhà máy sản xuất xi măng", "Nhà máy thép", "Nhà máy xử lý nước thải", "Nhà máy điện hạt nhân", "Phá dỡ một tòa nhà cũ", "Phòng điều khiển trung tâm của nhà máy", "Sân bay đang được xây dựng", "Sửa chữa một con tàu lớn trong ụ tàu", "Thi công đường cao tốc", "Xưởng đóng tàu", "Xưởng in ấn", "Xưởng sản xuất đồ gỗ", "Xưởng sản xuất gốm sứ", "Xưởng tái chế kim loại", "Đổ bê tông móng nhà", "Đúc một bức tượng đồng lớn", "Đường băng sân bay", "Khu chế xuất", "Khu công nghệ cao", "Xưởng cơ khí chính xác", "Xưởng sản xuất robot"
    ],
    "Concept Cổ Trang": [
        "Ai Cập cổ đại (Pharaoh, Nữ hoàng)", "Chiến binh Amazon", "Chiến binh Sparta", "Chủ tiệm trà/rượu", "Concept 'Âm dương sư'", "Concept 'Game of Thrones'", "Concept 'Tứ đại mỹ nhân'", "Cung đình Việt Nam (Lý, Trần, Lê, Nguyễn)", "Du ngoạn trên sông", "Giang hồ lãng tử", "Hóa thân thành các nhân vật lịch sử", "Hoàng tử và Lọ Lem (phiên bản cổ)", "Họa sĩ cổ trang", "Hội chợ đèn lồng", "Hồng Lâu Mộng", "Hàn Quốc (Hanbok cổ)", "Hiệp sĩ và công chúa", "La Mã cổ đại", "Lễ hội mùa xuân", "Ninja Nhật Bản", "Nhật Bản (Samurai, Geisha, Onmyoji)", "Phong cách Ba Tư", "Phong cách Kiếm hiệp", "Phong cách Tiên hiệp", "Phong cách ma mị liêu trai", "Phim 'Diên Hy Công Lược'", "Phim 'Tam Sinh Tam Thế'", "Quan lại triều đình", "Tây Du Ký", "Thần thoại Hy Lạp (Các vị thần)", "Thần thoại Bắc Âu (Odin, Thor, Loki)", "Thích khách trong rừng trúc", "Thư sinh và tiểu thư", "Thầy thuốc Đông y", "Trong thư phòng", "Trong tửu lầu", "Trận chiến thành Troy", "Trung cổ Châu Âu (Hiệp sĩ, Công chúa)", "Tướng quân và mỹ nhân", "Tái hiện trận Xích Bích", "Viking (Bắc Âu)", "Võ lâm cao thủ", "Vua Arthur và Hiệp sĩ Bàn tròn", "Yên Chi Thủy Mặc", "Điền viên thôn dã", "Đám cưới cổ trang", "Đánh cờ dưới gốc cây", "Đế vương và Hoàng hậu", "Ẩn sĩ núi sâu", "Đạo sĩ và yêu tinh"
    ],
    "Concept Hiện Đại & Fashion": [
        "Barbiecore", "Biên tập thời trang (Fashion Editorial)", "Chụp Beauty (Tập trung trang điểm)", "Chụp Lookbook sản phẩm", "Chụp ảnh tạp chí (Vogue, Harper's Bazaar)", "Chụp tại sân bay", "Chụp trong tiệm giặt là", "Chụp với kiến trúc Brutalist", "Chụp với ô tô cổ/siêu xe", "Color block (Khối màu)", "Cottagecore", "Cyberpunk & Neon", "Dark Academia", "Denim on denim", "Doanh nhân thành đạt", "Grandmacore", "Haute Couture (Thời trang cao cấp)", "Hiphop style", "Khám phá đô thị (Urban exploration)", "Light Academia", "Menswear", "Mermaidcore", "Normcore (Bình dị)", "Old Money aesthetic", "Phong cách Avant-garde", "Phong cách Clean girl", "Phong cách Du mục (Bohemian)", "Phong cách Edgy/Rock-chic", "Phong cách Futuristic (Tương lai)", "Phong cách Gothic", "Phong cách Monochrome (Đơn sắc)", "Phong cách Preppy (Học đường)", "Phong cách Workwear", "Royalcore", "Sân bóng rổ", "Sân tennis", "Skater style", "Soft girl/E-girl", "Street style (Đường phố)", "Tiệc tùng (Party/Nightlife)", "Tối giản (Minimalism)", "Trên du thuyền", "VSCO girl", "Y2K (Năm 2000)", "Bãi đỗ xe ngầm", "Công sở (Business core)", "Hậu tận thế (Post-apocalyptic)", "Chụp trong studio", "Retro/Vintage (70s, 80s, 90s)", "Thể thao (Athleisure)"
    ],
    "Địa danh Hàn Quốc": [
        "Bảo tàng Quốc gia Hàn Quốc", "Bãi biển Haeundae, Busan", "Chùa Bongeunsa", "Chùa Bulguksa", "Chùa Haeinsa", "Chùa Jogyesa", "Chợ Dongdaemun, Seoul", "Chợ Gwangjang, Seoul", "Chợ Jagalchi, Busan", "COEX Starfield Library", "Công viên Everland", "Công viên Haneul", "Công viên Naksan", "Công viên Olympic, Seoul", "Công viên quốc gia Hallasan", "Công viên quốc gia Seoraksan", "Cung điện Changdeokgung", "Cung điện Gyeongbokgung, Seoul", "Cầu Gwangandaegyo, Busan", "DMZ", "Gyeongju", "Hang động Seokguram", "Ihwa Mural Village", "Insadong, Seoul", "Jeonju Hanok Village", "Khu Gangnam, Seoul", "Khu Hongdae, Seoul", "Khu Myeongdong, Seoul", "Khu phi quân sự (DMZ)", "Lotte World Tower", "Làng Bukchon Hanok", "Làng Jeonju Hanok", "Làng dân gian Hàn Quốc", "Làng văn hóa Gamcheon, Busan", "Petite France", "Pháo đài Hwaseong, Suwon", "Pocheon Art Valley", "Seoul (Gyeongbokgung Palace, N Seoul Tower)", "Sông Hàn (Hangang)", "Suối Cheonggyecheon", "Suwon Hwaseong Fortress", "Thác Cheonjeyeon", "Thành phố Andong", "Thành phố Gyeongju", "Tháp Lotte World", "Tháp N Seoul", "Trung tâm nghệ thuật Dongdaemun Design Plaza (DDP)", "Vườn Juknokwon (Rừng tre)", "Vườn Morning Calm", "Đảo Jeju"
    ],
    "Địa danh Mỹ": [
        "Alcatraz, San Francisco", "Aspen, Colorado", "Bãi biển South Beach, Miami", "Bãi biển Venice, California", "Bãi biển Waikiki, Hawaii", "Bến tàu Hải quân, Chicago", "Bến tàu Santa Monica", "Big Sur, California", "Boston, Massachusetts", "Cầu Brooklyn", "Cầu Cổng Vàng, San Francisco", "Charleston, Nam Carolina", "Chicago (The Bean)", "Công viên Millennium, Chicago", "Công viên Quốc gia Arches", "Công viên Quốc gia Everglades", "Công viên Quốc gia Glacier", "Công viên Quốc gia Grand Canyon", "Công viên Quốc gia Yellowstone", "Công viên Quốc gia Yosemite", "Công viên Quốc gia Zion", "Công viên Trung tâm, New York", "Dải Las Vegas", "Denali, Alaska", "Grand Teton National Park", "Hẻm núi Antelope", "Hẻm núi Bryce", "Hồ Tahoe", "Key West, Florida", "Khu phố Pháp, New Orleans", "Không gian Kim Môn, Seattle", "Los Angeles (Hollywood Sign)", "Móng ngựa (Horseshoe Bend)", "New York (Times Square, Statue of Liberty)", "Nhà Trắng, Washington D.C.", "Núi Rushmore", "Philadelphia, Pennsylvania", "Quảng trường Thời đại, New York", "San Francisco (Golden Gate Bridge)", "Savannah, Georgia", "Sedona, Arizona", "Thác Niagara", "Thung lũng Chết (Death Valley)", "Thung lũng tượng đài (Monument Valley)", "Tòa nhà Empire State", "Tượng Nữ thần Tự do, New York", "Tượng đài Lincoln", "Walt Disney World, Florida", "Willis Tower, Chicago", "Đại lộ Danh vọng Hollywood"
    ],
    "Địa danh Nhật Bản": [
        "Aomori", "Bảo tàng Ghibli", "Chùa Byodo-in", "Chùa Kiyomizu-dera, Kyoto", "Chùa Senso-ji, Tokyo", "Chùa Todai-ji, Nara", "Chùa Vàng Kinkaku-ji, Kyoto", "Con đường triết gia, Kyoto", "Công viên Hitachi Seaside", "Công viên khỉ Jigokudani", "Công viên Nara", "Công viên Tưởng niệm Hòa bình Hiroshima", "Cung điện Hoàng gia Tokyo", "Fukuoka", "Giao lộ Shibuya, Tokyo", "Hakone", "Himeji Castle", "Hiroshima Peace Memorial Park", "Kamakura", "Kanazawa", "Khu vực Hồ ngũ Fuji", "Khu phố Akihabara, Tokyo", "Khu phố Dotonbori, Osaka", "Khu phố Gion, Kyoto", "Khu phố Shinjuku, Tokyo", "Kobe", "Koya-san (Núi Koya)", "Kyoto (Kinkaku-ji, Fushimi Inari)", "Làng lịch sử Shirakawa-go", "Lâu đài Himeji", "Lâu đài Matsumoto", "Lâu đài Osaka", "Lâu đài Shuri", "Lễ hội tuyết Sapporo", "Mt. Fuji", "Nagasaki", "Nikko", "Núi Phú Sĩ", "Okinawa", "Onsen ở Beppu", "Osaka (Dotonbori)", "Rừng tre Arashiyama, Kyoto", "Sapporo Snow Festival", "Shiretoko National Park", "Takayama", "Tháp Tokyo", "Tháp Tokyo Skytree", "Tokyo (Shibuya Crossing, Tokyo Tower)", "Vườn Kenrokuen", "Yokohama"
    ],
    "Địa danh Thế giới": [
        "Bagan, Myanmar", "Bảo tàng Louvre, Pháp", "Bora Bora, Polynesia thuộc Pháp", "Burj Khalifa, UAE", "Cappadocia, Thổ Nhĩ Kỳ", "Chichen Itza, Mexico", "Cinque Terre, Ý", "Cung điện Buckingham, Anh", "Cung điện Versailles, Pháp", "Cầu Tháp London", "Dubrovnik, Croatia", "Điện Kremlin, Nga", "Đảo Galapagos, Ecuador", "Đảo Phục Sinh, Chile", "Đấu trường La Mã, Ý", "Đền Taj Mahal, Ấn Độ", "Đền thờ Hổ (Tiger's Nest), Bhutan", "Fjords of Norway", "Hagia Sophia, Thổ Nhĩ Kỳ", "Hồ Moraine, Canada", "Kim tự tháp Giza, Ai Cập", "Kyoto, Nhật Bản", "London (Tower Bridge)", "Machu Picchu (Peru)", "Neuschwanstein Castle, Đức", "Nhà hát Opera Sydney, Úc", "Nhà thờ Sagrada Familia, Tây Banha", "Núi Bàn, Nam Phi", "Pamukkale, Thổ Nhĩ Kỳ", "Paris (Eiffel Tower)", "Petra (Jordan)", "Plitvice Lakes National Park, Croatia", "Quần thể đền Angkor Wat, Campuchia", "Rome (Colosseum)", "Rạn san hô Great Barrier, Úc", "Salar de Uyuni, Bolivia", "Santorini, Hy Lạp", "Serengeti, Tanzania", "Stonehenge, Anh", "Sydney Opera House (Australia)", "Taj Mahal (India)", "Thác Iguazu, Brazil/Argentina", "Thác Victoria, Zambia/Zimbabwe", "Thành cổ Acropolis, Hy Lạp", "Thành cổ Machu Picchu, Peru", "Thành phố Petra, Jordan", "Thành phố Venice, Ý", "Thánh đường Hồi giáo Sheikh Zayed, UAE", "Tháp Eiffel, Pháp", "Tháp nghiêng Pisa, Ý"
    ],
    "Địa danh Việt Nam": [
        "Bán đảo Sơn Trà", "Biển Hồ Pleiku", "Bưu điện Trung tâm Sài Gòn", "Cánh đồng muối Hòn Khói", "Cánh đồng điện gió Bạc Lạc", "Cao nguyên đá Đồng Văn", "Cầu Vàng Đà Nẵng", "Chùa Bái Đính", "Chùa Một Cột", "Chùa Thiên Mụ", "Chợ nổi Cái Răng, Cần Thơ", "Cố đô Huế", "Côn Đảo", "Cột cờ Lũng Cú", "Dinh Độc Lập", "Ghềnh Đá Đĩa, Phú Yên", "Hà Giang (Mã Pí Lèng)", "Hải đăng Đại Lãnh, Phú Yên", "Hồ Ba Bể", "Hồ Gươm và Đền Ngọc Sơn, Hà Nội", "Làng cổ Đường Lâm", "Làng gốm Bàu Trúc", "Mù Cang Chải", "Mũi Né, Phan Thiết", "Nhà hát Lớn Hà Nội", "Nhà thờ Con Gà, Đà Lạt", "Nhà thờ Đức Bà Sài Gòn", "Ninh Bình (Tràng An)", "Núi Bà Đen, Tây Ninh", "Phố cổ Hội An", "Quần thể danh thắng Tràng An", "Quảng Bình (Hang Sơn Đoòng)", "Rừng tràm Trà Sư", "Ruộng bậc thang Sapa", "Sa Pa", "Thác Bản Giốc", "Thác Datanla, Đà Lạt", "Thánh địa Mỹ Sơn", "Thành phố Đà Lạt", "Tháp Chàm Po Klong Garai", "Văn Miếu - Quốc Tử Giám", "Vịnh Hạ Long", "Vườn quốc gia Cúc Phương", "Vườn quốc gia Phong Nha - Kẻ Bàng", "Y Tý, Lào Cai", "Đảo Cát Bà", "Đảo Lý Sơn", "Đảo Phú Quốc", "Đèo Mã Pí Lèng", "Đồi chè Cầu Đất"
    ],
    "Du lịch Bụi & Phượt": [
        "Bản đồ và la bàn", "Băng qua một cây cầu treo", "Bên một chiếc xe van cắm trại", "Bếp lửa trại đêm", "Cắm trại trên núi", "Check-in tại một cột mốc biên giới", "Con đường mòn đất đỏ", "Cưỡi lạc đà qua sa mạc", "Đi bộ đường dài (trekking) trong rừng", "Đi nhờ xe (hitchhiking)", "Đi thuyền độc mộc trên sông", "Dừng chân ở một ngôi làng hẻo lánh", "Dựng lều trên bãi biển", "Ga tàu cũ", "Ghé một trạm xăng hẻo lánh", "Ghi chép sổ tay hành trình", "Giăng võng ngủ trong rừng", "Khám phá một khu chợ địa phương", "Khám phá hang động", "Lái xe motor trên đèo", "Lặn biển ngắm san hô", "Leo lên một ngọn hải đăng", "Leo núi băng", "Lửa trại trên bãi biển", "Ngủ trong một nhà nghỉ ven đường", "Ngắm bình minh trên đỉnh núi", "Ngắm hoàng hôn trên biển", "Ngắm sao giữa thiên nhiên", "Nhảy từ vách đá xuống hồ", "Ở homestay của người bản địa", "Pha cà phê bằng bếp cồn", "Sửa xe ven đường", "Tắm suối nước nóng tự nhiên", "Thị trấn nhỏ ven đường", "Thả mình trên dòng sông lười", "Thám hiểm một khu rừng nguyên sinh", "Thử một món ăn đường phố lạ", "Trải nghiệm dù lượn", "Uống nước từ một con suối", "Vượt qua một con sông bằng bè", "Vượt qua sa mạc", "Xem bản đồ giấy", "Xin ngủ nhờ nhà dân", "Đi qua một cánh đồng hoang", "Đi xuyên qua một đường hầm tối", "Đọc sách trên võng", "Đốt lửa trại", "Đứng trên một mỏm đá cheo leo", "Ăn đồ hộp", "Ở trọ trong một tu viện"
    ],
    "Dưới nước": [
        "Bơi cùng cá heo", "Bơi cùng cá voi", "Bơi cùng rùa biển", "Bơi cùng sứa", "Cảnh quan san hô mềm", "Chạm trán một con cá mập trắng", "Chụp ảnh macro sinh vật biển", "Chụp ảnh trong một bể bơi vô cực", "Đàn cá mòi di cư", "Đi bộ dưới đáy biển", "Hang động dưới nước", "Khám phá một giếng cenote ở Mexico", "Khám phá một mạch nước phun dưới biển", "Lặn biển ở Rạn san hô Great Barrier", "Lặn cùng cá đuối manta", "Lặn ngắm rạn san hô ban đêm", "Lặn trong một khu rừng tảo bẹ", "Lặn tự do (Freediving)", "Lái một chiếc xe scooter dưới nước", "Ngắm nhìn một con bạch tuộc", "Nghệ thuật điêu khắc dưới nước", "Nghỉ trong một khách sạn dưới nước", "Nhà hàng dưới nước", "Rạn san hô", "Rừng ngập mặn", "Sinh vật phát quang sinh học", "Tàn tích của một con tàu cướp biển", "Thành phố Atlantis", "Thám hiểm một khe nứt kiến tạo dưới biển", "Thám hiểm vực thẳm Mariana", "Thủy cung", "Thử nghiệm bộ đồ lặn cổ điển", "Tìm kiếm một kho báu bị mất", "Trong một chiếc chuông lặn", "Trong một khu rừng san hô đen", "Trong một miệng núi lửa dưới nước", "Trong một viện bảo tàng dưới nước", "Tàu ngầm thám hiểm", "Vẻ đẹp của cá ngựa", "Vẻ đẹp của sứa biển", "Vườn lươn biển", "Vườn san hô nhân tạo", "Xác máy bay chiến đấu từ Thế chiến II", "Xác tàu đắm", "Đi qua một cổng vòm đá dưới nước", "Đàn cá hề trong hải quỳ", "Đàn cá mập đầu búa", "Đàn sứa trôi dạt", "Bơi trong một dòng sông băng tan", "Chơi đùa với hải cẩu"
    ],
    "Giấc mơ & Tiềm thức": [
        "Bay lượn trên bầu trời", "Bị rượt đuổi bởi một cái bóng", "Bước qua một tấm gương", "Căn phòng có đồ nội thất lơ lửng", "Cảnh vật siêu thực", "Cây cối biết nói", "Con đường làm bằng cầu vồng", "Cơn mưa kẹo ngọt", "Cưỡi trên một con vật thần thoại", "Đi bộ trên những đám mây", "Đi lạc trong một thư viện vô tận", "Gặp gỡ một phiên bản khác của chính mình", "Gặp gỡ những sinh vật kỳ lạ", "Hành lang vô tận", "Khiêu vũ với các vì sao", "Khám phá một thành phố bị lãng quên", "Kim tự tháp lơ lửng", "Lạc vào một bức tranh", "Lắng nghe những lời thì thầm", "Lâu đài xây bằng cát", "Leo lên một chiếc thang tới mặt trăng", "Mở một cánh cửa ra một thế giới khác", "Mọi thứ đều bị đảo ngược", "Một đại dương trên bầu trời", "Một hòn đảo bay", "Một khu rừng phát sáng", "Một thành phố làm bằng pha lê", "Nhìn thấy tương lai trong một quả cầu thủy tinh", "Nói chuyện với động vật", "Nói chuyện với tổ tiên", "Rơi tự do", "Sông chảy ngược dòng", "Sơn một giấc mơ thành hiện thực", "Thang máy đi theo đường chéo", "Thế giới lộn ngược", "Thế giới trong một quả cầu tuyết", "Thế giới trong đó thời gian ngừng trôi", "Thế giới trắng đen với một vật thể có màu", "Thấy mình trong một bộ phim", "Thở dưới nước", "Thời gian trôi nhanh hoặc chậm lại", "Thả diều mặt trăng", "Trở nên vô hình", "Trôi dạt trong không gian", "Vẽ một cánh cửa và bước qua nó", "Vượt qua một cây cầu làm bằng ánh sáng", "Đi qua một đường hầm xoáy", "Đồng hồ tan chảy", "Đứng trên mép của một vách đá", "Đại dương biến thành sa mạc"
    ],
    "Giáng Sinh & Noel": [
        "Bà già Noel hiện đại", "Bên lò sưởi ấm cúng", "Bưu thiếp Giáng sinh cổ điển", "Bữa tiệc cuối năm của công ty", "Chuyến tàu tốc hành đến Bắc Cực", "Chụp ảnh gia đình với đồ ngủ Giáng sinh", "Chụp ảnh thú cưng với trang phục Noel", "Chợ Giáng sinh ở châu Âu", "Concept 'Ở nhà một mình'", "Concept 'The Grinch'", "Dạo phố đêm Giáng sinh", "Gia đình quây quần mở quà", "Giáng sinh trắng", "Giấc mơ đêm Giáng sinh", "Gói quà Giáng sinh", "Hát thánh ca", "Hẹn hò dưới cây tầm gửi", "Hóa thân thành thiên thần", "Hóa thân thành yêu tinh", "Làm bánh quy gừng", "Làm nhà bánh gừng", "Lâu đài băng của nữ hoàng tuyết", "Lễ hội ánh sáng", "Mặc áo len Giáng sinh", "Một mình trong đêm Noel", "Ngôi nhà bánh gừng", "Nướng kẹo dẻo bên lửa trại", "Ông già Noel phát quà", "Ông già Noel và những đứa trẻ", "Picnic mùa đông", "Quà tặng bất ngờ", "Thư gửi ông già Noel", "Tiệc Giáng sinh ngoài trời", "Trang trí cây thông Noel", "Trượt băng nghệ thuật", "Tuần lộc của ông già Noel", "Vũ hội Giáng sinh", "Vở kịch 'Kẹp hạt dẻ'", "Viết thiệp Giáng sinh", "Xây người tuyết", "Xưởng đồ chơi của ông già Noel", "Điêu khắc trên băng", "Đếm ngược đến nửa đêm", "Đêm thánh ca", "Đoàn tàu đồ chơi quanh cây thông", "Đọc truyện 'Đêm trước Giáng sinh'", "Uống sô cô la nóng", "Treo tất trên lò sưởi", "Chuẩn bị bữa tối Giáng sinh", "Đi nhà thờ đêm vọng"
    ],
    "Halloween": [
        "Âm binh địa ngục", "Bác sĩ phẫu thuật điên loạn", "Bá tước Dracula", "Bóng ma trong gương", "Bữa tiệc của các linh hồn", "Bù nhìn rơm trên cánh đồng ngô", "Buổi lễ triệu hồi quỷ", "Câu chuyện kinh dị Mỹ", "Chân dung bị ma ám", "Cô dâu của Frankenstein", "Cư dân của thị trấn ma", "Cuộc săn lùng người sói", "Cuộc trốn thoát khỏi nhà thương điên", "Gia đình Addams", "Hóa trang theo phong cách Tim Burton", "Hóa trang xác sống (Zombie)", "Jack-o'-lantern (Bí ngô Halloween)", "Kẻ lang thang trong nghĩa địa", "Kỵ sĩ không đầu", "Lạc vào khu rừng bị nguyền rủa", "Lâu đài của ma cà rồng", "Lễ hội của người chết (Día de Muertos)", "Lời nguyền của xác ướp Ai Cập", "Ma búp bê Annabelle", "Ma cà rồng và thợ săn ma cà rồng", "Nạn nhân của Joker", "Nghĩa địa lúc nửa đêm", "Ngôi nhà ma ám", "Người ngoài hành tinh xâm chiếm", "Nhà khoa học và quái vật", "Những kẻ sống sót hậu tận thế", "Nữ thần Hecate và chó săn địa ngục", "Nữ tu bóng đêm", "Phù thủy ở Salem", "Phù thủy pha chế độc dược", "Rạp xiếc kinh dị", "Sát nhân dưới ánh trăng", "Sinh vật từ đầm lầy", "Tái hiện các poster phim kinh dị", "Tái hiện nhân vật Stephen King", "Thầy bói và quả cầu pha lê", "Thợ săn quái vật", "Tiệc hóa trang 가면 (Masquerade Ball)", "Trò chơi gọi hồn", "Voodoo và bùa ngải", "Vùng đất của các bộ xương", "Vương quốc của quỷ", "Đi xin kẹo (Trick-or-treat)", "Khắc bí ngô", "Bữa tiệc hóa trang"
    ],
    "Hoài niệm & Ký ức": [
        "Bên máy đánh chữ", "Bên một chiếc xe hơi cổ", "Bên một chiếc TV đen trắng", "Buổi chiếu phim trong xe (Drive-in theater)", "Chơi các trò chơi điện tử 8-bit", "Chơi các trò chơi dân gian", "Chụp ảnh bằng máy ảnh phim", "Con đường làng", "Cửa hàng đồ chơi cổ", "Cửa hàng băng đĩa cũ", "Cuốn album ảnh cũ", "Dạo chơi trong một khu chợ trời đồ cũ", "Gác mái cũ", "Ghi âm một cuốn băng cassette", "Góc học tập xưa", "Gọi điện thoại từ bốt điện thoại công cộng", "Lật xem một cuốn niên giám cũ", "Lớp học với bảng đen và phấn trắng", "Mặc quần áo theo phong cách retro", "Nghe nhạc từ máy hát đĩa than", "Nghe radio cassette", "Ngồi trên một chiếc ghế bành cũ", "Ngôi nhà thời thơ ấu", "Nhận một lá thư viết tay", "Phòng chiếu phim cũ", "Phòng tối tráng phim ảnh", "Quán ăn kiểu Mỹ (Diner) thập niên 50", "Rạp chiếu phim ngoài trời", "Sân chơi thời thơ ấu", "Sân ga tàu hỏa cũ", "Sử dụng một chiếc máy tính đời đầu", "Thăm lại ngôi trường cũ", "Thư viện với những cuốn sách bọc da", "Tiệm cắt tóc kiểu cũ", "Tiệm kem cổ điển", "Tiệm tạp hóa xưa", "Trang trí phòng với poster phim cũ", "Trong một bảo tàng lịch sử", "Trong một căn bếp cổ điển", "Trong một hiệu sách cũ", "Trong một quán cà phê vintage", "Trò chuyện bên một đống lửa", "Xem lại những thước phim gia đình cũ", "Đi xe đạp phượng hoàng", "Đi xe buýt cũ", "Đọc một tờ báo cũ", "Đọc truyện tranh cũ", "Đứng bên một cây cầu gỗ", "Đến một khu vui chơi bị bỏ hoang", "Ăn một que kem bông"
    ],
    "Hoàng gia & Quý tộc": [
        "Bắn cung trong khuôn viên lâu đài", "Bên cạnh một cỗ xe ngựa hoàng gia", "Bữa tiệc hoàng gia", "Buổi đấu kiếm của các hiệp sĩ", "Buổi khiêu vũ trong cung điện", "Chân dung hoàng gia chính thức", "Chơi cờ trong thư phòng", "Chơi polo", "Cưỡi ngựa trong rừng", "Dạo chơi trong vườn thượng uyển", "Dự một buổi hòa nhạc riêng tư", "Dự một buổi tiệc trà chiều", "Học viết thư pháp", "Học đàn hạc", "Học thêu thùa", "Khoảnh khắc đăng quang", "Ký một hiệp ước hoàng gia", "Lễ ban phước của hoàng gia", "Lễ diễu hành của hoàng gia", "Lễ đặt tên cho hoàng tử/công chúa", "Lễ hội săn bắn của quý tộc", "Lễ sắc phong hiệp sĩ", "Lâu đài cổ kính", "Lối vào bí mật trong lâu đài", "Mang trên mình bộ áo giáp hiệp sĩ", "Mặc trang phục dạ hội lộng lẫy", "Mở một cuộn giấy da cổ", "Ngắm pháo hoa từ ban công cung điện", "Nghiên cứu bản đồ cổ trong thư viện", "Ngồi trên ngai vàng", "Ngự trên ngai vàng", "Nhận một món quà từ một sứ thần", "Phòng ăn tối hoàng gia", "Phòng thay đồ của nữ hoàng", "Phòng khiêu vũ trong cung điện", "Săn bắn cùng quý tộc", "Thử một chiếc vương miện", "Thư phòng của đức vua", "Tiếp kiến các sứ thần nước ngoài", "Tiễn một hạm đội hoàng gia ra khơi", "Trong một khu vườn mê cung", "Trong phòng chứa kho báu hoàng gia", "Trong phòng trưng bày chân dung tổ tiên", "Uống rượu từ một chiếc cốc bằng vàng", "Viết nhật ký bằng bút lông ngỗng", "Đi thuyền trên hồ trong cung điện", "Đọc một sắc lệnh hoàng gia", "Đeo trang sức hoàng gia", "Đứng trên đỉnh tháp canh của lâu đài", "Đón tiếp một vị vua nước láng giềng"
    ],
    "Khoa học Viễn tưởng & Fantasy": [
        "Bay qua một vành đai tiểu hành tinh", "Bên cạnh một con rồng", "Bên trong một con tàu bị bỏ hoang trong không gian", "Bên trong tàu vũ trụ", "Bước qua một cánh cổng không gian (portal)", "Chiến đấu với quái vật", "Chợ đen công nghệ", "Cưỡi một sinh vật ngoài hành tinh", "Di chuyển bằng dịch chuyển tức thời", "Du hành thời gian", "Gặp gỡ một chủng tộc người ngoài hành tinh cổ đại", "Hành tinh xa lạ", "Học phép thuật trong một tòa tháp", "Khám phá một hành tinh băng giá", "Khám phá một hành tinh sa mạc", "Khám phá một thành phố dưới nước", "Khám phá một thế giới ảo", "Khám phá tàn tích của một nền văn minh ngoài hành tinh", "Khiên năng lượng", "Khu rừng thần tiên", "Lái một chiếc xe bay", "Lâu đài phép thuật", "Lạc vào một chiều không gian khác", "Nói chuyện với một AI có tri giác", "Phòng điều khiển của tương lai", "Phòng thí nghiệm công nghệ cao", "Sinh vật nhân bản", "Sử dụng một thanh gươm ánh sáng", "Thành phố bay trên mây", "Thành phố Cyberpunk về đêm", "Thế giới của người khổng lồ", "Thế giới của người lùn", "Thế giới hậu tận thế", "Thế giới song song", "Thế giới tí hon", "Thế giới trong đó trọng lực yếu", "Thư viện phép thuật cổ xưa", "Tiếp xúc đầu tiên với người ngoài hành tinh", "Trạm không gian quay quanh một hành tinh khí", "Trường học pháp sư", "Trận chiến giữa các vì sao", "Tương tác với robot/AI", "Tương tác với một hình chiếu hologram", "Vũ khí la-de", "Đi bộ trên bề mặt sao Hỏa", "Đi vào một lỗ đen", "Đấu trường của các đấu sĩ robot", "Đứng trước một con tàu vũ trụ khổng lồ", "Đọc một cuốn sách ma thuật cổ", "Ẩn náu trong một thành phố đổ nát"
    ],
    "Kinh dị & Ma quái": [
        "Bệnh viện bỏ hoang", "Bóng người lướt qua hành lang", "Bữa ăn tối với ma cà rồng", "Bữa tiệc của zombie", "Buổi lễ gọi hồn", "Căn gác xép bụi bặm", "Căn hầm tối tăm", "Con búp bê bị ma ám", "Cánh đồng ngô lúc nửa đêm", "Cánh cửa tự đóng sầm", "Cuộc rượt đuổi trong rừng", "Dấu tay trên gương", "Đi lạc trong một khu rừng sương mù", "Gương mặt trong cửa sổ", "Hầm mộ đầy xương người", "Khu rừng u tối", "Lễ hội Halloween kinh dị", "Lời thì thầm từ bóng tối", "Lâu đài của ma cà rồng", "Lạc vào một thị trấn ma", "Nghi lễ tà giáo", "Nghĩa địa lúc nửa đêm", "Ngôi nhà ma ám", "Ngôi mộ mới được đào", "Người bù nhìn sống dậy", "Nhà thờ bị bỏ hoang", "Nhà hát bị ma ám", "Nhìn thấy một doppelgänger", "Những con mắt trong bóng tối", "Phòng thí nghiệm của nhà khoa học điên", "Rạp xiếc bị bỏ hoang", "Sự im lặng đáng sợ", "Thang máy đi xuống một tầng không tồn tại", "Thí nghiệm khoa học thất bại", "Trang trại bị ma ám", "Trốn thoát khỏi một kẻ sát nhân hàng loạt", "Trường học bị bỏ hoang", "Trò chơi trốn tìm chết chóc", "Trong một khách sạn ma ám", "Trong một trại tâm thần bỏ hoang", "Tàu ma", "Vũng máu trên sàn", "Wake up in a coffin", "Xác ướp sống dậy", "Đi qua một cây cầu ọp ẹp", "Đoàn tàu ma", "Đồ vật tự di chuyển", "Đối mặt với nỗi sợ hãi tồi tệ nhất", "Bị chôn sống", "Bị theo dõi"
    ],
    "Lễ hội Thế giới": [
        "Albuquerque International Balloon Fiesta (Mỹ)", "Boryeong Mud Festival (Hàn Quốc)", "Burning Man (Mỹ)", "Carnival of Venice (Ý)", "Cascamorras (Tây Ban Nha)", "Cheese-Rolling Festival (Anh)", "Chinese New Year (Trung Quốc)", "Coachella (Mỹ)", "Dia de los Muertos (Mexico)", "Diwali (Ấn Độ)", "Edinburgh Festival Fringe (Scotland)", "Gion Matsuri (Nhật Bản)", "Harbin International Ice and Snow Festival (Trung Quốc)", "Holi Festival (Ấn Độ)", "Il Palio di Siena (Ý)", "International Highline Meeting Festival (Ý)", "Krampusnacht (Áo)", "La Tomatina (Tây Ban Nha)", "Lantern Festival (Đài Loan)", "Mardi Gras (New Orleans, Mỹ)", "MassKara Festival (Philippines)", "Naadam Festival (Mông Cổ)", "Oktoberfest (Đức)", "Pamplona Bull Run (Tây Ban Nha)", "Pflasterspektakel (Áo)", "Pingxi Lantern Festival (Đài Loan)", "Queen's Day (Hà Lan)", "Rio Carnival (Brazil)", "Running of the Bulls (Tây Ban Nha)", "Saint Patrick's Day (Ireland)", "San Fermin (Tây Ban Nha)", "Sapporo Snow Festival (Nhật Bản)", "Semana Santa (Tây Ban Nha)", "Songkran Water Festival (Thái Lan)", "Sundance Film Festival (Mỹ)", "Tanabata (Nhật Bản)", "Thanksgiving Day Parade (Mỹ)", "The Battle of the Oranges (Ý)", "Thaipusam (Malaysia)", "Tết Nguyên Đán (Việt Nam)", "Up Helly Aa (Scotland)", "White Nights Festival (Nga)", "Winter Light Festival (Nhật Bản)", "Yi Peng Lantern Festival (Thái Lan)", "Lễ hội ném cam (Ý)", "Lễ hội bùn (Hàn Quốc)", "Lễ hội chọi lạc đà (Thổ Nhĩ Kỳ)", "Lễ hội của những người chết (Mexico)", "Lễ hội hóa trang Venice (Ý)", "Lễ hội đèn lồng (Thái Lan)"
    ],
    "Mùa trong năm": [
        "Bão tuyết mùa đông", "Bên một đống lửa trại mùa thu", "Bơi lội trong hồ mùa hè", "Cắm trại mùa hè", "Cảnh sắc mùa thu", "Cơn mưa rào mùa hạ", "Dạo bước dưới mưa tuyết", "Dạo chơi trong một khu rừng mùa thu", "Dã ngoại mùa xuân", "Đi bộ dưới hàng cây lá vàng", "Đi hái dâu tây mùa hè", "Đi hái táo mùa thu", "Đi trượt tuyết mùa đông", "Gia đình sum vầy bên lò sưởi", "Hái hoa mùa xuân", "Khiêu vũ dưới mưa", "Khắc bí ngô mùa thu", "Lái xe qua con đường mùa thu", "Làm người tuyết", "Lễ hội hoa anh đào mùa xuân", "Lễ hội thu hoạch mùa thu", "Lễ tạ ơn", "Lội qua một con suối mát mùa hè", "Nằm trên bãi cỏ ngắm mây mùa hè", "Ngắm hoàng hôn trên bãi biển mùa hè", "Ngắm lá phong đỏ ở Nhật Bản", "Ngắm mưa sao băng mùa hè", "Ngắm những bông tuyết đầu tiên", "Nhảy vào một đống lá khô", "Nướng kẹo dẻo mùa đông", "Picnic dưới gốc cây hoa anh đào", "Thả diều trên một ngọn đồi lộng gió mùa xuân", "Thả đèn hoa đăng mùa thu", "Thưởng thức một ly nước chanh mát lạnh", "Trang trí nhà cửa đón Giáng sinh", "Trượt băng trên hồ đóng băng", "Trồng cây mùa xuân", "Trong một cơn bão mùa hè", "Trong một khu vườn mùa xuân", "Trong một ngôi nhà gỗ ấm cúng mùa đông", "Uống sô cô la nóng mùa đông", "Uống trà đá dưới hiên nhà", "Vui chơi ở công viên nước", "Vườn hoa tulip mùa xuân", "Đi dạo trên bãi biển mùa đông", "Đi qua một cánh đồng hoa hướng dương", "Đón những tia nắng đầu tiên của mùa xuân", "Đốt pháo hoa đêm giao thừa", "Đón Tết Nguyên Đán", "Lễ hội đèn lồng mùa thu"
    ],
    "Ngành nghề": [
        "Bartender pha chế cocktail", "Barista và máy pha cafe", "Bác sĩ phẫu thuật trong phòng mổ", "Bác sĩ thú y", "Bếp trưởng trong một nhà hàng sang trọng", "Cảnh sát tuần tra", "Chuyên gia phân tích dữ liệu", "Chuyên gia trang điểm", "Diễn viên trên phim trường", "DJ chơi nhạc", "Dược sĩ trong nhà thuốc", "Giáo viên trong lớp học", "Họa sĩ trong studio", "Hướng dẫn viên du lịch", "Huấn luyện viên cá nhân tại phòng gym", "Kiến trúc sư bên bản vẽ", "Kỹ sư tại công trường", "Lập trình viên với màn hình code", "Luật sư tại tòa án", "Lính cứu hỏa đang làm nhiệm vụ", "Người mẫu trên sàn catwalk", "Nhà báo tác nghiệp", "Nhà khảo cổ học", "Nhà khoa học trong phòng thí nghiệm", "Nhà ngoại giao tại một hội nghị quốc tế", "Nhà nghiên cứu Nam Cực", "Nhà sản xuất phim", "Nhà tâm lý học", "Nhà thiết kế thời trang", "Nhà văn và máy chữ", "Nhạc công trên sân khấu", "Nhân viên cứu hộ bãi biển", "Nhân viên pha chế nước hoa", "Nhiếp ảnh gia với máy ảnh", "Nông dân trên cánh đồng", "Phi công trong buồng lái", "Phi hành gia", "Thợ cơ khí sửa chữa ô tô", "Thợ cắt tóc", "Thợ gốm", "Thợ kim hoàn", "Thợ lặn chuyên nghiệp", "Thợ làm bánh", "Thợ mộc trong xưởng gỗ", "Thợ mỏ", "Thợ điện", "Thủy thủ trên tàu", "Thư viện viên", "Vũ công trong phòng tập", "Người bán hoa"
    ],
    "Nghệ Thuật & Trừu Tượng": [
        "Bóng và hình (Shadow & Silhouette)", "Chân dung biến dạng", "Chân dung ý niệm (Conceptual portrait)", "Chuyển thể từ một bài thơ/bài hát", "Chụp ảnh hồng ngoại (Infrared)", "Chụp ảnh không trung (Aerial photography)", "Chụp ảnh phơi sáng dài (Long exposure)", "Chụp ảnh tia X (X-ray art)", "Chụp ảnh tốc độ cao (High-speed photography)", "Chụp ảnh vi mô (Microphotography)", "Chụp Macro (Cận cảnh)", "Chụp qua các vật thể (kính, nilon)", "Chụp với khói màu", "Chụp với lửa", "Chụp với máy chiếu", "Chồng ảnh (Double Exposure)", "Hiệu ứng Bokeh nghệ thuật", "Hiệu ứng Kính vạn hoa", "Hiệu ứng vỡ vụn", "Làm mờ chuyển động (Motion blur)", "Lập thể (Cubism)", "Màu nước & Mực loang", "Nghệ thuật cắt dán (Collage)", "Nghệ thuật sắp đặt", "Nghệ thuật sắp đặt ánh sáng", "Nghệ thuật từ thực phẩm", "Nghệ thuật từ đồ tái chế", "Nghệ thuật đối xứng", "Nhiễu ảnh (Glitch Art)", "Phản chiếu (Reflection in water, mirror)", "Phong cách Low Poly", "Phong cách Phim Noir", "Phong cách Tranh sơn dầu", "Phong cách tranh thủy mặc", "Pop Art (Andy Warhol)", "Siêu thực (Surrealism)", "Tan biến (Dispersion)", "Thế giới tí hon", "Tối giản với không gian âm", "Trừu tượng kiến trúc", "Tương phản màu sắc mạnh", "Vẽ trên cơ thể (Body Painting)", "Vẽ trên ảnh", "Vẽ tranh bằng ánh sáng (Light Painting)", "Ấn tượng (Impressionism)", "Chân dung ẩn danh", "Kỹ thuật 'Forced Perspective'", "Chụp dưới nước (Underwater)", "Nghệ thuật động học (Kinetic)", "Phong cách Gothic"
    ],
    "Nghệ thuật trình diễn": [
        "Ảo thuật", "Biểu diễn đường phố", "Biểu diễn xiếc trên không", "Buổi biểu diễn ballet", "Buổi hòa nhạc rock", "Buổi diễn hài độc thoại", "Buổi đọc thơ", "Chương trình biểu diễn ánh sáng", "Chương trình biểu diễn thời trang", "Chương trình múa rối bóng", "Diễn kịch câm", "Diễn kịch ứng tác", "Hát Opera", "Hát tuồng", "Hát chèo", "Hòa nhạc thính phòng", "Kịch nói", "Lễ hội hóa trang", "Múa đương đại", "Múa cột nghệ thuật", "Múa rối nước", "Múa lửa", "Nhạc kịch Broadway", "Nhảy thiết hài (tap dance)", "Nói tiếng bụng", "Opera Trung Quốc", "Performance art", "Sân khấu kịch", "Sân khấu ngoài trời", "Sân khấu thử nghiệm", "Show diễn của Cirque du Soleil", "Tấu hài", "Trình diễn flash mob", "Trình diễn body painting", "Trình diễn patin nghệ thuật", "Trình diễn parkour", "Trình diễn xà đơn", "Trình diễn đi trên dây", "Tuồng cổ", "Vở kịch Shakespeare", "Xiếc thú", "Đi cà kheo", "Đấu vật biểu diễn (WWE)", "Đóng thế trong phim hành động", "Đu dây nghệ thuật", "Đọc truyện", "Lễ hội Cosplay", "Biểu diễn nhạc nước", "Múa bụng", "Hát A cappella"
    ],
    "Nông trại & Đồng quê": [
        "Bên một đống rơm", "Bên một dòng sông yên ả", "Bữa ăn ngoài trời ở sân sau", "Cánh đồng hoa oải hương", "Cánh đồng lúa chín", "Câu cá bên hồ", "Cho gia súc ăn", "Chơi đùa với những chú cún trong trang trại", "Chèo thuyền trên sông", "Cưỡi ngựa trên đồng cỏ", "Dạo chơi trong một ngôi làng cổ", "Đi bộ trên một con đường đất", "Đi hái nấm trong rừng", "Đi hái quả dại", "Đi săn", "Đi xe ngựa", "Đốt lửa trại", "Đuổi theo những con đom đóm", "Gia đình nông dân", "Hái trái cây trong vườn", "Lái một chiếc máy kéo", "Làm việc trong một nhà kho", "Làm vườn rau", "Lùa cừu", "Lượm trứng gà", "Một ngôi nhà gỗ mộc mạc", "Ngắm hoàng hôn trên cánh đồng", "Nghỉ ngơi trên một chiếc võng", "Ngôi nhà bên hồ", "Ngồi trên hàng rào gỗ", "Nhà kho chứa đầy cỏ khô", "Phiên chợ quê", "Picnic bên một con suối", "Sửa chữa hàng rào", "Tắm sông", "Tham gia một lễ hội của làng", "Thăm một cối xay gió", "Thăm một vườn nho", "Thu hoạch ngô", "Trang trại bò sữa", "Trang trại ngựa", "Trèo cây", "Trồng hoa", "Trong một khu rừng thông", "Trong một vườn cây ăn trái", "Uống trà trên hiên nhà", "Vắt sữa bò", "Đàn bò gặm cỏ trên đồi", "Đồi chè xanh mướt", "Đứng bên một cái giếng cổ"
    ],
    "Phật pháp": [
        "Bên gốc cây Bồ Đề", "Bên một hồ sen", "Bên một mandala cát", "Bên một vòng Pháp luân", "Cảnh một nhà sư đi trong tuyết", "Cảnh một ngôi chùa lúc bình minh", "Cảnh quan Bái Đính - Tràng An", "Cảnh quan Chùa Một Cột", "Cảnh quan Chùa Thiên Mụ", "Cảnh quan chùa chiền kiến trúc cổ", "Cảnh quan chùa chiền Myanmar", "Cảnh quan chùa chiền Nhật Bản (Zen)", "Cảnh quan chùa chiền Thái Lan", "Cảnh quan tu viện ở Bhutan", "Chép kinh", "Cùng các nhà sư", "Dâng hương trong chánh điện", "Gõ chuông chùa", "Giữa những lá cờ cầu nguyện Tây Tạng", "Lễ Phật đản", "Lễ Vu Lan báo hiếu", "Lễ tắm Phật", "Nghe giảng pháp", "Ngắm hoa trong chùa", "Nhìn ra thung lũng từ một ngôi chùa", "Quét lá trong sân chùa", "Thiền định trong chùa cổ", "Thiền trà", "Thưởng thức ẩm thực chay", "Thả đèn hoa đăng trên sông", "Trong một hang động thiền", "Trong một khu vườn đá Nhật Bản", "Trong một ngôi chùa trên núi", "Trong một tu viện Phật giáo", "Trước tượng Phật lớn", "Trà đạo trong không gian tĩnh lặng", "Tụng kinh", "Vẽ tranh Thangka", "Đi bộ trên con đường hành hương", "Đi kinh hành trong vườn thiền", "Đi khất thực", "Đi qua cổng Torii của đền", "Điêu khắc tượng Phật", "Đọc kinh sách", "Ánh nến trong đêm tĩnh mịch", "Bên một bảo tháp", "Bên một bức tượng La Hán", "Bên một dòng suối trong khuôn viên chùa", "Cảnh tượng Phật giáo Mật tông", "Cảnh quan một ngôi chùa bị bỏ hoang"
    ],
    "Quán cafe": [
        "Bên trong một thư viện cổ", "Bên trong một trạm xe lửa cũ", "Quán cafe container", "Quán cafe có các trò chơi board game", "Quán cafe có khu vui chơi cho trẻ em", "Quán cafe có khu vực làm việc chung (co-working)", "Quán cafe có lò sưởi", "Quán cafe có nhiều loại cây treo", "Quán cafe có quầy bar pha chế cocktail", "Quán cafe có workshop (làm gốm, vẽ tranh)", "Quán cafe có tường gạch mộc", "Quán cafe có tầm nhìn ra núi", "Quán cafe có trang trí nghệ thuật độc đáo", "Quán cafe có giếng trời", "Quán cafe mèo", "Quán cafe nằm trong một nhà kính", "Quán cafe nằm trên thuyền", "Quán cafe phong cách Bohemian", "Quán cafe phong cách Hy Lạp (Santorini)", "Quán cafe phong cách Ma-rốc", "Quán cafe phong cách Scandinavian", "Quán cafe phong cách công nghiệp (industrial)", "Quán cafe phong cách vintage/retro", "Quán cafe rang xay tại chỗ", "Quán cafe sách", "Quán cafe theo chủ đề phim ảnh", "Quán cafe theo phong cách sáng (light academia)", "Quán cafe theo phong cách tối (dark academia)", "Quán cafe thú cưng (chó, thỏ...)", "Quán cafe tối giản hiện đại", "Quán cafe trên sân thượng với view thành phố", "Quán cafe trong một con hẻm nhỏ", "Quán cafe trong một khu chung cư cũ", "Quán cafe trong một khu vườn bí mật", "Quán cafe trong một tòa nhà lịch sử", "Quán cafe trong vườn Zen Nhật Bản", "Quán cafe trong rừng", "Quán cafe vỉa hè kiểu Paris", "Quán cafe xe buýt (bus cafe)", "Quán cafe yên tĩnh để đọc sách", "Quán cafe ấm cúng có lò sưởi", "Quán cafe với cửa sổ lớn nhìn ra phố", "Quán cafe với nội thất hoàn toàn bằng gỗ", "Quán cafe với nội thất màu pastel", "Quán cafe kiểu quán ăn Mỹ cổ điển (diner)", "Quán cafe bên bờ biển", "Quán cafe bên hồ", "Quán cafe có biểu diễn nhạc sống (acoustic)", "Quán cafe trang trí theo mùa (Giáng sinh, Halloween)", "Quán cafe sách"
    ],
    "Rừng núi": [
        "Cao nguyên Đà Lạt, Việt Nam", "Cao nguyên Scotland", "Con đường mòn Inca đến Machu Picchu", "Công viên Rừng quốc gia Trương Gia giới, Trung Quốc", "Công viên Quốc gia Banff, Canada", "Công viên Quốc gia Glacier, Mỹ", "Công viên Quốc gia Jasper, Canada", "Công viên Quốc gia Yosemite, Mỹ", "Công viên Quốc gia Zion, Mỹ", "Dãy Alps của Thụy Sĩ", "Dãy Andes ở Nam Mỹ", "Dãy Himalaya và đỉnh Everest", "Dãy núi Altai, Trung Á", "Dãy núi Appalachian, Mỹ", "Dãy núi Kavkaz", "Dãy núi Pyrenees, Pháp/Tây Ban Nha", "Dãy núi Rocky ở Canada/Mỹ", "Dãy núi Sierra Nevada, Mỹ", "Dolomites, Ý", "El Chaltén, Argentina", "Hallstatt, Áo", "Landmannalaugar, Iceland", "Milford Sound, New Zealand", "Núi Bromo, Indonesia", "Núi Cầu vồng, Peru", "Núi Phú Sĩ, Nhật Bản", "Patagonia, Argentina/Chile", "Phong cảnh núi Kirkjufell, Iceland", "Rừng Białowieża, Ba Lan/Belarus", "Rừng Crooked Forest, Ba Lan", "Rừng Hallerbos (rừng chuông xanh), Bỉ", "Rừng Hoh Rainforest, Mỹ", "Rừng Monteverde Cloud Forest, Costa Rica", "Rừng Sequoia, Mỹ", "Rừng Waipoua, New Zealand (cây Kauri)", "Rừng rêu ở đảo Yakushima, Nhật Bản", "Rừng tre Arashiyama, Nhật Bản", "Rừng nhiệt đới Amazon", "Rừng Đen, Đức", "Thung lũng Lauterbrunnen, Thụy Sĩ", "Thung lũng mười đỉnh, Canada", "Vườn quốc gia Cửu Trại Câu, Trung Quốc", "Vườn quốc gia Erawan, Thái Lan", "Vườn quốc gia Mount Cook, New Zealand", "Vườn quốc gia Olympic, Mỹ", "Vườn quốc gia Plitvice, Croatia", "Vườn quốc gia Torres del Paine, Chile", "Vườn quốc gia núi Grand Teton, Mỹ", "Vùng núi Fansipan, Việt Nam", "Đỉnh Matterhorn, Thụy Sĩ/Ý"
    ],
    "Sách & Tri thức": [
        "Bàn cờ vua", "Bảo tàng lịch sử", "Bên cạnh bản đồ thế giới", "Bên một chồng sách cao", "Câu lạc bộ tranh luận", "Cửa hàng văn phòng phẩm", "Diễn thuyết trên sân khấu TED", "Giảng đường đại học", "Hiệu sách cũ", "Lớp học vẽ", "Ngồi trong một phòng học cổ xưa", "Nghiên cứu một bộ xương khủng long", "Nghiên cứu bản thảo cổ", "Phòng đọc sách ấm cúng bên lò sưởi", "Phòng lưu trữ tài liệu quốc gia", "Phòng nghiên cứu khoa học", "Phòng làm việc của nhà văn", "Quán cafe sách", "Thảo luận triết học", "Thí nghiệm hóa học", "Thư viện cổ kính", "Triển lãm nghệ thuật", "Viết thư pháp", "Đài quan sát thiên văn", "Đọc sách trong công viên", "Bảo tàng khoa học", "Bên kính hiển vi", "Bên một quả địa cầu", "Chơi ô chữ", "Dịch một văn bản cổ", "Giải một bài toán khó", "Giảng bài trên bục giảng", "Học một ngôn ngữ mới", "Hội thảo khoa học", "Lắp ráp một mô hình phức tạp", "Lập trình trên máy tính", "Lớp học lịch sử nghệ thuật", "Nghiên cứu cây gia phả", "Phân tích một tác phẩm văn học", "Phỏng vấn một nhà khoa học", "Sắp xếp lại các giá sách", "Tham quan một di tích khảo cổ", "Thiết kế một robot", "Tranh luận về một vấn đề chính trị", "Trong một cung thiên văn", "Trong một phòng thí nghiệm vật lý", "Trong một viện bảo tàng nghệ thuật", "Vẽ bản đồ sao", "Viết một bài báo khoa học", "Xem một bộ phim tài liệu"
    ],
    "Siêu xe": [
        "Aston Martin Valkyrie", "Audi R8", "Bugatti Bolide", "Bugatti Chiron", "Chevrolet Corvette Z06", "Ferrari 296 GTB", "Ferrari 812 Superfast", "Ferrari SF90 Stradale", "Ford GT", "Koenigsegg Gemera", "Koenigsegg Jesko", "Lamborghini Aventador", "Lamborghini Huracan", "Lamborghini Revuelto", "Lexus LFA", "Maserati MC20", "McLaren 720S", "McLaren Artura", "Mercedes-AMG One", "Nissan GT-R Nismo", "Pagani Huayra", "Pagani Utopia", "Pininfarina Battista", "Porsche 911 GT3 RS", "Rimac Nevera"
    ],
    "Studio": [
        "Studio có bồn tắm để chụp ảnh milk bath/water", "Studio có bức tường hoa", "Studio có các khối hình học nhiều màu", "Studio có các đạo cụ hình đám mây", "Studio có cầu thang xoắn ốc", "Studio có cửa sổ lớn và ánh sáng tự nhiên", "Studio có giếng trời", "Studio có giường và chăn ga mềm mại", "Studio có một cây đàn piano cổ điển", "Studio có sàn phản chiếu", "Studio có treo đèn lồng và đèn dây", "Studio có tường bê tông thô", "Studio có tường kết cấu độc đáo (textured wall)", "Studio có tường phủ graffiti", "Studio có xích đu treo trong nhà", "Studio chân dung cổ điển với phông nền vải", "Studio kiểu gác xép công nghiệp với tường gạch", "Studio mô phỏng một căn bếp hiện đại", "Studio mô phỏng một căn phòng khách ấm cúng", "Studio mô phỏng một thư viện với kệ sách", "Studio mô phỏng một toa tàu cổ điển", "Studio mô phỏng một văn phòng hiện đại", "Studio mô phỏng một quán bar/cafe", "Studio nhà kính với nhiều cây xanh", "Studio nghệ thuật với giá vẽ và sơn dầu", "Studio phong cách Bohemian với thảm và macrame", "Studio tối đen để chụp ảnh kịch tính (low-key)", "Studio tối giản với nội thất phong cách Scandinavian", "Studio tối giản với phông nền trắng (cyclorama)", "Studio trên sân thượng với view thành phố", "Studio với ánh sáng hoàng hôn nhân tạo", "Studio với ánh sáng màu (gel color lighting)", "Studio với ánh sáng từ cửa sổ kiểu Pháp", "Studio với bong bóng bay", "Studio với các tấm gương vỡ", "Studio với hiệu ứng khói và máy tạo sương mù", "Studio với máy chiếu để tạo background động", "Studio với phông nền giấy nhiều màu sắc", "Studio với phông nền là một bức tranh lớn", "Studio với phông nền lụa bay trong gió", "Studio với phông xanh để ghép cảnh", "Studio với đạo cụ là các loại hoa", "Studio với đạo cụ thể thao", "Studio với đèn chùm pha lê", "Studio cổ điển với đạo cụ và đồ nội thất cổ", "Studio ánh sáng neon và phong cách cyberpunk", "Studio dưới nước (underwater studio)", "Studio mô phỏng một phòng thay đồ sang trọng", "Studio mô phỏng một phòng thí nghiệm", "Phòng tập nhảy với gương lớn"
    ],
    "Trung Thu": [
"Trung Thu Ánh nến lung linh", "Trung Thu Áo dài cổ phục", "Trung Thu Bên cây đa, giếng nước", "Bên mâm cỗ Trung Thu", "Trung Thu Bóng đổ trên giấy", "Trung Thu Chơi các trò chơi dân gian", "Trung Thu Chụp cùng bạn bè", "Trung Thu Chụp flatlay với bánh và trà", "Chụp trong nhà với decor Trung Thu", "Trung Thu Chụp tại chùa hoặc đền", "Trung Thu Chụp tại khu vườn", "Trung Thu Chụp với chó bưởi", "Trung Thu Chụp với hiệu ứng bokeh", "Trung Thu Chụp với mặt nạ giấy bồi", "Trung Thu Chụp với quạt giấy", "Trung Thu Chụp với đèn lồng", "Concept 'Trung Thu Du hành về tuổi thơ'", "Concept 'Trung Thu Giấc mơ đêm rằm'", "Concept 'Ký ức Trung Thu'", "trên cung trăng cùng chị hằng và thỏ", "Concept 'Trung Thu Đoàn viên'", "Concept Cung trăng", "Trên cung trăng cùng chú cuội và thỏ", "Concept Trung Thu Gia đình quây quần", "Trung Thu Góc phố quen", "Hóa thân Chị Hằng", "Hóa thân Chú Cuội", "Hóa thân thành các nhân vật cổ tích", "Trung Thu Kể chuyện bằng ảnh", "Làm bánh Trung Thu", "Trung Thu Nặn tò he", "Trung Thu Phong cách Hiện đại", "Trung Thu Phong cách ma mị, huyền ảo", "Trung Thu Phong cách phim kiếm hiệp", "Trung Thu Phong cách tối giản", "Trung Thu Phố Hàng Mã rực rỡ", "Trung Thu Phố cổ Hội An đêm rằm", "Trung Thu Rước đèn ông sao", "Trung Thu Sân đình làng quê", "Trung Thu Sân thượng ngắm trăng", "Tái hiện sự tích Trung Thu", "Trung Thu Thả đèn hoa đăng", "Trung Thu Uống trà ngắm trăng", "Trung Thu Xem Múa lân", "Trung Thu Đầu lân sư rồng", "Trung Thu Chụp cho em bé", "Chợ quê ngày Tết Trung Thu", "Trung Thu Rạp chiếu bóng ngoài trời", "Trung Thu Chụp với bóng bay hình mặt trăng", "Trung Thu Bên cạnh đầu lân",
"Trung Thu Lồng đèn handmade từ giấy kiếng", "Trung Thu Đèn kéo quân xoay bóng", "Trung Thu Phố đi bộ đêm rằm", "Trung Thu Chụp với thỏ ngọc", "Trung Thu Tò he — con giống Cung Trăng", "Trung Thu Thử trò chơi dân gian (ô ăn quan, đánh chuyền)", "Trung Thu Tà áo thiếu nữ bên đèn lồng", "Trung Thu Trẻ em rước đèn khu tập thể", "Trung Thu Macro bánh nướng, bánh dẻo", "Trung Thu Bàn trà sen cùng ấm chén gốm", "Trung Thu Mâm ngũ quả sáng tạo", "Trung Thu Lân – địa bửu – ông địa vui nhộn", "Trung Thu Hẻm nhỏ treo đèn giấy", "Trung Thu Sân đình trống hội", "Trung Thu Ngõ treo đèn lồng cá chép", "Trung Thu Hát trống quân/quan họ", "Trung Thu Múa rối nước đêm rằm", "Trung Thu Trên cầu gỗ bên sông", "Trung Thu Thuyền thả đèn hoa đăng", "Trung Thu Đường làng lúa chín trăng vàng", "Trung Thu Sân trường đêm hội", "Trung Thu Sân chung cư tổ chức hội trăng rằm", "Trung Thu Rooftop city view nhìn trăng", "Trung Thu Phố cổ với áo yếm, váy lĩnh", "Trung Thu Làng nghề làm đèn lồng", "Trung Thu Xưởng làm bánh thủ công", "Trung Thu Với quạt nan & đèn lồng giấy dầu", "Trung Thu Ngồi bên hiên nhà tre", "Trung Thu Cổng làng treo lồng đèn", "Trung Thu Con đường đèn lồng dài", "Trung Thu Hành lang gỗ cổ phủ ánh đèn", "Trung Thu Ảnh phản chiếu mặt hồ", "Trung Thu Mưa thu & ô giấy dầu", "Trung Thu Studio high-key với props đèn lồng", "Trung Thu Low-key ánh nến & khói trầm", "Trung Thu Đêm sương lành", "Trung Thu Silhouette rước đèn trước trăng tròn", "Trung Thu Time-lapse mây qua trăng", "Trung Thu Gia đình ba thế hệ", "Trung Thu Cặp đôi picnic đêm rằm", "Trung Thu Pet cosplay thỏ ngọc", "Trung Thu Flatlay vé hội chợ/tem phiếu xưa", "Trung Thu Chụp film 35mm grain", "Trung Thu Cyber-lantern (neon hiện đại)", "Trung Thu Steampunk lồng đèn cơ khí", "Trung Thu Phong cách anime phố đèn lồng", "Trung Thu Tối giản nền trắng — một đèn lồng", "Trung Thu Màu pastel cho trẻ nhỏ", "Trung Thu Trắng đen noir ánh nến", "Trung Thu Livestream/short video đêm rằm", "Trung Thu Vẽ mặt nạ giấy bồi DIY", "Trung Thu Thả đèn trời (an toàn, kiểm soát)", "Trung Thu Góc ban công chung cư treo đèn", "Trung Thu Bếp nhà nướng bánh & trà"
],
    "Tạp chí": [
        "Bìa Allure", "Bìa AnOther Magazine", "Bìa Architectural Digest", "Bìa Better Homes and Gardens", "Bìa Bon Appétit", "Bìa Car and Driver", "Bìa Condé Nast Traveler", "Bìa Cosmopolitan", "Bìa Dazed & Confused", "Bìa Elle", "Bìa Entertainment Weekly", "Bìa Esquire", "Bìa Essence", "Bìa Fast Company", "Bìa Food & Wine", "Bìa Forbes", "Bìa Fortune", "Bìa GQ (Gentlemen's Quarterly)", "Bìa Golf Digest", "Bìa Good Housekeeping", "Bìa Harper's Bazaar", "Bìa InStyle", "Bìa L'Officiel", "Bìa Life", "Bìa Marie Claire", "Bìa Men's Health", "Bìa National Geographic", "Bìa Numéro", "Bìa O, The Oprah Magazine", "Bìa PC Magazine", "Bìa Parents", "Bìa People", "Bìa Popular Science", "Bìa Reader's Digest", "Bìa Rolling Stone", "Bìa Seventeen", "Bìa Sports Illustrated", "Bìa Teen Vogue", "Bìa The Economist", "Bìa The New York Times Magazine", "Bìa The New Yorker", "Bìa The Wall Street Journal. Magazine", "Bìa Time", "Bìa Travel + Leisure", "Bìa Vanity Fair", "Bìa Vogue", "Bìa W Magazine", "Bìa Wired", "Bìa Women's Health", "Bìa i-D"
    ],
    "Tâm linh & Huyền bí": [
        "Bên một vòng tròn cây trồng (crop circle)", "Bói bài Tarot", "Buổi lễ tâm linh", "Cầu cơ", "Con mắt thứ ba", "Cổng vào một thế giới khác", "Đọc chỉ tay", "Gặp gỡ một nhà ngoại cảm", "Gặp gỡ một tinh linh thiên nhiên", "Hành hương đến một nơi linh thiêng", "Hiệu ứng hào quang (Aura)", "Hoa văn hình học thần thánh", "Kim tự tháp Ai Cập", "Kim tự tháp Maya", "Lễ trừ tà", "Luân hồi", "Lạc vào một khu rừng thiêng", "Mantra và thiền định", "Mơ thấy điềm báo", "Nghiên cứu các văn tự cổ", "Nghiên cứu về UFO", "Nghi lễ của các Druid", "Ngôi đền bị lãng quên trong rừng", "Nhìn vào một quả cầu pha lê", "Những đường Nazca ở Peru", "Pha chế độc dược", "Sử dụng con lắc", "Thôi miên", "Thăm một ngôi đền cổ", "Thầy bói và quả cầu pha lê", "Thiền định dưới một thác nước", "Thiền định trên đỉnh núi", "Trong một hang động cổ xưa có hình vẽ", "Trong một ngôi chùa Tây Tạng", "Trong một túp lều của pháp sư", "Trong một vòng tròn đá cổ", "Trải nghiệm thoát xác", "Triệu hồi một linh hồn", "Tế lễ dưới ánh trăng tròn", "Vòng tròn chiêm tinh", "Vẽ một vòng tròn ma thuật", "Vẽ bùa hộ mệnh", "Vùng Tam giác quỷ Bermuda", "Đi tìm Chén Thánh", "Đi tìm thành phố Atlantis", "Đền thờ cổ trong rừng", "Đến thăm một nhà tiên tri", "Đọc các ký hiệu bí ẩn", "Đối thoại với một nhà giả kim", "Vòng tròn đá cổ Stonehenge"
    ],
    "Tết Nguyên Đán": [
        "Áo dài cách tân", "Áo dài du xuân", "Áo dài và nón lá", "Bắn pháo hoa đêm giao thừa", "Bày mâm cỗ cúng gia tiên", "Bên cành đào, cành mai", "Bên câu đối đỏ", "Bên cây nêu ngày Tết", "Bên mâm ngũ quả", "Bếp củi nấu bánh chưng", "Cảnh mua sắm Tết", "Cảnh chợ Tết", "Chơi các trò chơi dân gian (bầu cua, ô ăn quan)", "Chúc Tết ông bà", "Chợ hoa Hàng Lược", "Concept 'Chuyến xe về quê ăn Tết'", "Concept 'Em bé Tết'", "Concept 'Tân niên' hiện đại", "Concept 'Tết xưa'", "Cùng gia đình xem Táo Quân", "Cặp đôi du xuân", "Du xuân trên phố", "Dọn dẹp nhà cửa", "Gia đình sum vầy", "Gói bánh chưng, bánh tét", "Hái lộc đầu xuân", "Khay mứt Tết", "Làm mứt Tết", "Làng hoa Sa Đéc", "Làng quất Tứ Liên", "Múa lân sư rồng", "Nhận lì xì", "Phố ông đồ", "Phong cách hoài niệm (nostalgia)", "Sân đình ngày Tết", "Thả cá chép tiễn Táo quân", "Trang trí nhà cửa ngày Tết", "Viết lời chúc đầu năm", "Vườn đào Nhật Tân", "Xin chữ đầu năm", "Xông đất đầu năm", "Đi lễ chùa đầu năm", "Đường hoa Nguyễn Huệ", "Đốt pháo (an toàn)", "Chụp ảnh tại làng cổ (Đường Lâm)", "Chụp ảnh với lồng đèn đỏ", "Chụp ảnh với vật nuôi mặc đồ Tết", "Bầu không khí ấm cúng trong nhà", "Cảnh hái trà đầu xuân", "Cùng bạn bè du xuân"
    ],
    "Tết Thiếu Nhi 1/6": [
        "Anh hùng cứu thế giới", "Bác sĩ nhí khám bệnh cho gấu bông", "Bữa tiệc trà của Alice", "Buổi hòa nhạc rock nhí", "Cắm trại trong nhà", "Cầu thủ bóng đá siêu sao", "Chiến binh dũng cảm", "Chiến tranh súng nước", "Công chúa và hoàng tử Disney", "Công viên giải trí", "Cuộc chiến gối nệm", "Cuộc đua xe công thức 1", "Dạo chơi trong công viên nước", "Du hành về thời khủng long", "Họa sĩ tài năng", "Hóa thân thành động vật", "Khám phá đại dương", "Khám phá hành tinh lạ", "Kho báu cướp biển", "Lạc vào xứ sở kẹo ngọt", "Lễ hội hóa trang", "Lính cứu hỏa dũng cảm", "Lớp học phép thuật", "Nhà ảo thuật nhí", "Nhà khoa học điên", "Nhà thám hiểm rừng xanh", "Nhà thiết kế thời trang", "Nhà vô địch Olympic", "Những người bạn tưởng tượng", "Nông dân vui vẻ", "Phi hành gia vũ trụ", "Phi công lái máy bay", "Rạp xiếc vui nhộn", "Siêu điệp viên 007 nhí", "Tay đua kiệt xuất", "Thả diều trên đồng cỏ", "Thế giới Lego", "Thế giới trong hộp carton", "Tiệc bong bóng xà phòng", "Tiệc ngủ pijama", "Trại hè vui vẻ", "Trang trí bánh kem", "Trò chơi dân gian", "Trở thành nhân vật game", "Trường học quái vật", "Vũ công ballet", "Xây lâu đài cát", "Xem phim ngoài trời", "Xứ sở thần tiên", "Đầu bếp nhí"
    ],
    "Thành thị & Đô thị": [
        "Băng qua đường ở giao lộ đông đúc", "Bên trong một chiếc taxi", "Bên trong một trạm xe buýt", "Bức tường graffiti", "Cảnh quan thành phố từ một cây cầu", "Chờ tàu ở ga tàu điện ngầm", "Chợ đêm", "Con hẻm nhỏ với những quán bar ẩn", "Công viên trung tâm", "Cửa hàng tiện lợi 24/7", "Dạo bước trên một con phố lát đá cuội", "Dạo phố dưới mưa neon", "Đi bộ trên Đại lộ Danh vọng", "Đi dạo trong một khu vườn trên sân thượng", "Đi xe buýt hai tầng", "Đài phun nước trong một quảng trường", "Đạp xe trong thành phố", "Đọc sách trong một công viên thành phố", "Đứng giữa một quảng trường rộng lớn", "Đứng trên ban công của một căn hộ cao tầng", "Giao lộ đông đúc", "Giặt đồ ở tiệm giặt là công cộng", "Góc phố với một quán cà phê vỉa hè", "Hàng rào dây xích", "Hệ thống tàu điện ngầm", "Kiến trúc Brutalist", "Khu phố người Hoa (Chinatown)", "Leo lên thang cứu hỏa", "Lối thoát hiểm khẩn cấp", "Lướt qua các tòa nhà chọc trời", "Một khu chợ trời nhộn nhịp", "Ngắm nhìn đường chân trời của thành phố lúc hoàng hôn", "Ngồi trên bậc thềm của một tòa nhà cổ", "Nhảy qua vũng nước trên vỉa hè", "Những con đường dành cho xe đạp", "Picnic trong công viên", "Quảng trường Thời đại", "Sân thượng tòa nhà chọc trời", "Sân vận động thể thao trong thành phố", "Thang cuốn trong một trung tâm mua sắm", "Thư giãn bên một dòng sông chảy qua thành phố", "Trong một khu chung cư cũ", "Trong một thư viện công cộng", "Tòa nhà chọc trời bằng kính", "Uống cà phê mang đi", "Vỉa hè đông đúc", "Xem một buổi biểu diễn đường phố", "Đi dạo bên bến cảng", "Đèn giao thông", "Ăn ở một xe bán đồ ăn đường phố"
    ],
    "Thể thao": [
        "Bắn cung", "Bi-a (Billiards)", "Bowling", "Bể bơi Olympic", "Chèo thuyền buồm", "Chèo thuyền Kayak", "Chạy trail trong rừng", "CrossFit Box", "Cử tạ", "Cưỡi ngựa", "Diễu hành chiến thắng", "Golf", "Khúc côn cầu trên băng", "Lặn biển (Scuba Diving)", "Leo núi vách đá", "Lướt sóng", "Lướt ván diều (Kitesurfing)", "Lái xe địa hình (Off-road)", "Marathon", "Nhảy dù (Skydiving)", "Parkour trong thành phố", "Phòng tập Gym hiện đại", "Phòng tập Yoga yên tĩnh", "Pilates studio", "Sân bóng chuyền bãi biển", "Sân bóng rổ đường phố", "Sân trượt băng nghệ thuật", "Sân Tennis", "Sân vận động bóng chày", "Sân vận động bóng đá", "Thể dục dụng cụ", "Trượt tuyết", "Trượt tuyết ván (Snowboarding)", "Trượt ván (Skateboarding)", "Vạch đích cuộc đua", "Đánh cầu lông", "Đánh gôn", "Đấu kiếm (Fencing)", "Đấu vật (Wrestling)", "Đấu trường La Mã", "Đường chạy điền kinh", "Đường đua F1", "Đường đua xe đạp địa hình", "Trên khán đài cổ vũ", "Trong phòng thay đồ của đội", "Vinh quang trên bục nhận giải", "Bóng bầu dục", "Bóng nước (Water Polo)", "Đua mô tô", "Đi bộ đường dài (Hiking)"
    ],
    "Thế giới Anh Em": [
        "Đêm poker trong một phòng riêng sang trọng", "Xem trận chung kết thể thao tại một sports bar", "Chuyến đi cắm trại và leo núi", "Câu cá trên hồ vào buổi sáng sớm", "Tiệc nướng BBQ sân vườn với bia thủ công", "Chuyến phượt bằng xe mô tô qua những cung đường đèo", "Lái xe trải nghiệm trên đường đua F1", "Buổi thử rượu whisky và xì gà", "Chơi một vòng golf tại sân golf đẳng cấp", "Trận đấu bóng rổ đường phố", "Xây dựng một đống lửa trại lớn trên bãi biển", "Tham dự lễ hội bia Oktoberfest ở Munich", "Chuyến đi 'boys trip' đến Las Vegas", "Một buổi tập luyện tại phòng gym", "Tham gia một trận đấu súng sơn (paintball)", "Lắp ráp và độ một chiếc xe hơi cổ", "Đêm chơi game console cùng bạn bè", "Chèo thuyền kayak vượt thác", "Khám phá thành phố về đêm", "Một buổi tối trong quán bar speakeasy cổ điển", "Tham gia một lớp học nấu bít tết (steak)", "Chuyến đi săn hoặc khám phá thiên nhiên hoang dã", "Xem một buổi biểu diễn nhạc Rock", "Thử thách sức bền trong một cuộc thi 'Tough Mudder'", "Lặn biển khám phá xác tàu đắm", "Chơi bi-a trong một quán bar", "Chuyến đi bộ đường dài xuyên rừng (trekking)", "Cùng nhau xây một ngôi nhà trên cây", "Tham dự một sự kiện Comic-Con", "Lớp học pha chế cà phê specialty", "Một ngày làm việc tại xưởng mộc", "Tham gia một giải đấu eSports", "Chuyến đi đến một trận đấu quyền anh lớn", "Chụp ảnh concept 'Peaky Blinders'", "Một buổi tối tại câu lạc bộ của các quý ông (Gentlemen's Club)", "Chuyến đi phượt bụi (backpacking) qua châu Âu", "Học cách lái thuyền buồm", "Tham gia một cuộc thi ăn cay", "Chuyến đi xem một buổi phóng tàu vũ trụ", "Một buổi tối nghe nhạc vinyl và thảo luận", "Lớp học võ thuật (như Boxing, Muay Thái)", "Chơi cờ vua trong công viên", "Chuyến đi đến một xưởng sản xuất bia thủ công", "Chụp ảnh concept 'The Godfather'", "Thử thách nhảy dù (skydiving)", "Một ngày trên thuyền câu cá ngoài khơi xa", "Tham dự một buổi đấu giá xe cổ", "Chuyến đi đến một sự kiện Airshow", "Chơi ném rìu (axe throwing)", "Tái hiện một cảnh trong phim hành động yêu thích"
    ],
    "Thế giới Chị Em": [
        "Bữa tiệc trà chiều sang chảnh kiểu Anh", "Ngày spa và chăm sóc sắc đẹp cao cấp", "Chuyến mua sắm tại đại lộ Champs-Élysées, Paris", "Tiệc ngủ Pijama với mặt nạ và phim lãng mạn", "Buổi chụp hình theo concept 'Vogue'", "Brunch và cocktail Mimosa tại nhà hàng sân thượng", "Lớp học cắm hoa nghệ thuật", "Chuyến đi glamping sang chảnh trong rừng", "Tiệc du thuyền ngắm hoàng hôn ở Monaco", "Thưởng thức rượu vang tại một vườn nho ở Tuscany", "Lễ hội âm nhạc Coachella với phong cách Bohemian", "Đêm gala từ thiện lộng lẫy (Met Gala)", "Lớp học làm bánh Macaron kiểu Pháp", "Kỳ nghỉ trên bãi biển Santorini với váy maxi trắng", "Lớp học Yoga và thiền định bên bờ biển", "Chuyến đi 'girl trip' đến Bali", "Dạo phố cổ Hội An với áo dài và đèn lồng", "Buổi thử đồ cưới cùng hội bạn thân", "Tiệc độc thân (Bachelorette party) ở Las Vegas", "Cùng nhau tham gia một lớp học khiêu vũ Salsa", "Đêm nhạc Jazz trong một quán bar speakeasy", "Chụp ảnh 'nàng thơ' trong một vườn hoa oải hương", "Lớp học pha chế cocktail", "Chuyến đi trượt tuyết tại dãy Alps, Thụy Sĩ", "Picnic lãng mạn dưới tháp Eiffel", "Khám phá khu chợ Ma-rốc đầy màu sắc", "Đêm khiêu vũ hóa trang (Masquerade Ball)", "Cùng nhau xem một vở nhạc kịch Broadway", "Chuyến tham quan một lâu đài cổ tích ở Đức", "Lớp học làm gốm thủ công", "Đêm xem phim ngoài trời với bắp rang bơ", "Chụp ảnh concept 'Nữ hoàng' trong cung điện", "Cùng nhau tham gia một workshop làm nước hoa", "Kỳ nghỉ tại một resort 5 sao có hồ bơi vô cực", "Chụp ảnh street style ở Tuần lễ thời trang Milan", "Bữa tối sang trọng tại nhà hàng có sao Michelin", "Cùng nhau đi khinh khí cầu ở Cappadocia, Thổ Nhĩ Kỳ", "Chụp ảnh concept 'Thiên thần Victoria's Secret'", "Tham gia một lớp học vẽ và thưởng thức rượu vang", "Trải nghiệm tắm Onsen truyền thống tại Nhật Bản", "Buổi trình diễn thời trang cá nhân", "Tiệc hồ bơi theo chủ đề nhiệt đới", "Cùng nhau tham gia một cuộc thi marathon từ thiện", "Đêm đọc sách và thảo luận trong một câu lạc bộ", "Chụp ảnh concept 'Mean Girls' với trang phục hồng", "Chuyến đi khám phá nghệ thuật tại bảo tàng Louvre", "Cùng nhau trang trí nhà cửa cho một bữa tiệc lớn", "Lớp học trang điểm chuyên nghiệp", "Trải nghiệm làm 'cô gái Bond' (Bond Girl)", "Chuyến đi tình nguyện và khám phá văn hóa"
    ],
    "Thế giới Cổ Tích & Thần Thoại": [
        "Khu rừng phù phép nơi có các tiên nữ", "Vũ hội hoàng gia của Lọ Lem", "Xứ sở thần tiên của Alice", "Lâu đài của Người đẹp và Quái vật", "Đỉnh núi Olympus của các vị thần Hy Lạp", "Vương quốc Asgard của thần Thor", "Ngôi nhà bánh kẹo của mụ phù thủy (Hansel & Gretel)", "Vương quốc dưới đáy biển của Nàng tiên cá", "Khu rừng Sherwood của Robin Hood", "Hòn đảo Neverland của Peter Pan", "Hang động của rồng Smaug", "Con đường đến Camelot của Vua Arthur", "Mê cung của Minotaur", "Dòng sông Styx ở Địa ngục", "Vườn địa đàng với Cây Tri thức", "Tòa tháp của Rapunzel", "Ngôi nhà của Bảy chú lùn", "Xứ sở mùa đông của Nữ hoàng Tuyết", "Cung điện của Thần đèn (Aladdin)", "Cây cầu Bifrost đến Asgard", "Thư viện vô tận của Borges", "Làng Hobbit", "Thung lũng Rivendell của các Elf", "Cánh đồng Elysian", "Ngôi đền của các Nữ thần Muse", "Dưới gốc Cây Thế giới Yggdrasil", "Đám cưới của công chúa và hoàng tử", "Con đường rải đầy hoa hồng của Người đẹp ngủ trong rừng", "Cánh đồng anh túc trong Xứ sở Oz", "Bên cạnh hồ Gươm trả lại gươm báu", "Trên lưng Phượng hoàng lửa", "Cưỡi trên lưng Kỳ lân", "Trong một cỗ xe bí ngô", "Gặp gỡ Thần Rừng", "Uống trà với người bán mũ điên (Mad Hatter)", "Trận chiến thành Troy", "Vườn treo Babylon", "Chuyến phiêu lưu của Sinbad", "Kim tự tháp Ai Cập và các vị thần", "Trò chuyện với Nhân sư", "Vùng đất của những người khổng lồ", "Vương quốc của yêu tinh", "Bên cạnh một giếng nước điều ước", "Trên một tấm thảm bay", "Trong một khu vườn bí mật", "Chuyến đi của các Argonaut tìm Lông cừu vàng", "Nghe tiếng hát của các nàng Siren", "Cung điện băng giá", "Thử rút thanh gươm Excalibur khỏi đá", "Đánh bại Medusa"
    ],
    "Thế giới Game": [
        "Bản đồ sa mạc trong PUBG", "Bên trong một chiếc tàu vũ trụ (Among Us)", "Chiến trường Call of Duty", "Chiến trường cổ đại trong Age of Empires", "Đấu trường eSports", "Đường đua trong Mario Kart", "Gặp gỡ một nhân vật NPC", "Giao diện người dùng của game", "Hầm ngục tối tăm (Diablo)", "Hòn đảo trong Animal Crossing", "Khám phá một ngôi mộ (Tomb Raider)", "Khu rừng ma thuật trong The Legend of Zelda", "Làng khởi đầu trong một game RPG", "Lâu đài của Bowser (Mario)", "Lâu đài Dracula (Castlevania)", "Lớp học tại Học viện Hogwarts (Hogwarts Legacy)", "Màn hình chọn nhân vật", "Một thành phố trong The Sims", "Mở một hòm kho báu", "Ngồi trên Ngai sắt (Game of Thrones game)", "Nhảy giữa các tòa nhà (Assassin's Creed)", "Nhận một nhiệm vụ mới", "Những con phố của Night City (Cyberpunk 2077)", "Những ngọn núi tuyết của Skyrim", "Phòng chơi game Arcade cổ điển", "Phong cảnh trong game 8-bit", "Săn quái vật trong The Witcher", "Sân vận động trong FIFA", "Thành phố Columbia bay lơ lửng (BioShock Infinite)", "Thành phố Los Santos (GTA)", "Thành phố Rapture dưới nước (BioShock)", "Thế giới được tạo bằng khối (Minecraft)", "Thế giới trong game đối kháng (Street Fighter)", "Thế giới trong một game platformer", "Thế giới trong một game chiến thuật theo lượt", "Thế giới trong một game kinh dị sinh tồn", "Trong một trận đấu MOBA (League of Legends)", "Trong một trận đấu VALORANT", "Trong một trận đấu đối kháng (Mortal Kombat)", "Trận chiến với một con trùm (Boss fight)", "Trốn thoát khỏi một con quái vật (Resident Evil)", "Vùng đất của The Witcher", "Vương quốc Nấm (Mario)", "Vượt qua một màn chơi giải đố", "Đi qua một cánh cổng dịch chuyển", "Đấu trường La Mã trong game", "Đứng trước một cây kỹ năng (skill tree)", "Lái một chiếc Warthog (Halo)", "Phiêu lưu trong thế giới Final Fantasy", "Tham gia một cuộc đột kích (raid) với guild"
    ],
    "Thế giới Phim Ảnh": [
        "Hành lang xanh của The Matrix", "Thành phố Night City (Blade Runner)", "Trường Hogwarts (Harry Potter)", "Vùng Shire của người Hobbit (Lord of the Rings)", "Hành tinh sa mạc Arrakis (Dune)", "Boong tàu Titanic", "Công viên kỷ Jura (Jurassic Park)", "Thành phố Gotham về đêm (Batman)", "Đấu trường sinh tử (The Hunger Games)", "Con tàu vũ trụ Nostromo (Alien)", "Quán bar Mos Eisley Cantina (Star Wars)", "Thành phố Zion dưới lòng đất (The Matrix)", "Bãi biển Normandy (Saving Private Ryan)", "Lâu đài của quái vật (Beauty and the Beast)", "Thành phố trong mơ uốn cong (Inception)", "Xứ sở Oz màu ngọc lục bảo", "Con tàu Black Pearl (Pirates of the Caribbean)", "Hành tinh Pandora (Avatar)", "Khách sạn Overlook (The Shining)", "Căn hộ của Rick Deckard (Blade Runner)", "Vương quốc Wakanda (Black Panther)", "Đấu trường La Mã (Gladiator)", "Ngôi nhà của gia đình Corleone (The Godfather)", "Căn phòng đỏ (Twin Peaks)", "Trạm không gian trong 2001: A Space Odyssey", "Quán cafe Jack Rabbit Slim's (Pulp Fiction)", "Thế giới hậu tận thế (Mad Max: Fury Road)", "Căn nhà trong phim 'Up' với bóng bay", "Cung điện của Sultan ở Agrabah (Aladdin)", "Vùng đất băng giá của Nữ hoàng Elsa (Frozen)", "Hẻm Xéo (Harry Potter)", "Nhà ga Ngã Tư Vua (Harry Potter)", "Con tàu Millenium Falcon (Star Wars)", "Căn bếp trong phim Ratatouille", "Thành phố Metropolis (Superman)", "Đảo Isla Nublar (Jurassic Park)", "Con đường gạch vàng (The Wizard of Oz)", "Phòng chiến tranh (Dr. Strangelove)", "Quán bar 'The Winchester' (Shaun of the Dead)", "Thành phố tương lai trong 'The Fifth Element'", "Ngôi làng của 'Spirited Away'", "Rừng tre trong 'Crouching Tiger, Hidden Dragon'", "Căn hộ của Amélie", "Khách sạn Grand Budapest", "Sàn nhảy trong 'Saturday Night Fever'", "Con tàu Discovery One (2001: A Space Odyssey)", "Bối cảnh Viễn Tây (The Good, the Bad and the Ugly)", "Căn phòng vô tận của Willy Wonka", "Lâu đài trên không của Howl (Howl's Moving Castle)", "Bối cảnh phim Noir trắng đen"
    ],
    "Thế giới tí hon": [
        "Bên trong một chai thủy tinh", "Bên trong một động cơ đồng hồ", "Bên trong một khu vườn địa đàng (terrarium)", "Bên trong một quả cầu tuyết", "Bơi trong một vũng nước mưa", "Chơi đùa với những viên bi", "Chèo thuyền trên một chiếc lá", "Chạy trốn khỏi một con côn trùng", "Cưỡi trên một con vật nhỏ", "Dạo chơi trong một khu vườn", "Du hành trên một chuyến tàu đồ chơi", "Đi bộ trên dây mạng nhện", "Đi lạc trong một bãi cỏ cao", "Dựng một ngôi nhà từ que diêm", "Khám phá một chiếc máy tính cũ từ bên trong", "Khám phá một ngôi nhà búp bê", "Khiêu vũ trên một phím đàn piano", "Làng của người lùn", "Làm một chiếc dù từ một bông hoa bồ công anh", "Leo lên một chồng sách", "Lướt sóng trên một giọt sương", "Nấp sau một cây nấm", "Nghỉ ngơi trên một bông hoa", "Ngủ trong một vỏ hạt dẻ", "Ngắm nhìn một giọt nước rơi", "Nhảy dù từ một cành cây", "Nhảy lò cò trên những phím máy đánh chữ", "Ở trong một tổ chim", "Picnic trên một chiếc bánh quy", "Sống trong một ngôi nhà làm từ ủng", "Tắm trong một chiếc nắp chai", "Thám hiểm một hộp cát", "Thế giới của côn trùng", "Trên bàn cờ vua", "Trên một bàn làm việc", "Trên một chiếc bánh sinh nhật", "Trên một đĩa thức ăn", "Trong một cửa hàng đồ chơi", "Trong một khu rừng rêu", "Trong một mê cung làm từ những quân cờ domino", "Trong một ngăn kéo bàn", "Trong một tiệm bánh", "Trong một túi quần", "Trong một tách trà", "Trèo lên một cây bút chì", "Trốn trong một lọ hoa", "Trượt trên một lan can cầu thang", "Uống một giọt mật hoa", "Vượt qua một con suối nhỏ", "Xây một cây cầu bằng tăm"
    ],
    "Thiên nhiên": [
        "Bắc Cực quang (Aurora Borealis)", "Bãi biển cát đen Reynisfjara, Iceland", "Biển Chết, Jordan/Israel", "Bờ biển Na Pali, Hawaii", "Cánh đồng hoa Bluebonnet, Texas", "Cánh đồng muối Salar de Uyuni, Bolivia", "Cánh đồng đá (Tsingy de Bemaraha), Madagascar", "Cánh cổng tới địa ngục (Darvaza Gas Crater), Turkmenistan", "Cấu trúc Richat (Mắt của Sahara)", "Cực quang phương Bắc (Aurora Borealis)", "Cuộc đại di cư ở Serengeti, Tanzania", "Fly Geyser, Nevada", "Ghềnh đá Đĩa Người khổng lồ, Bắc Ireland", "Hang động băng ở Iceland", "Hang động đom đóm Waitomo, New Zealand", "Hồ Abraham (hồ bong bóng), Canada", "Hồ Baikal, Nga", "Hồ Hillier (hồ màu hồng), Úc", "Hồ Moraine, Canada", "Hồ Natron, Tanzania", "Hồ Plitvice, Croatia", "Hồ Spotted, Canada", "Hẻm núi Antelope, Mỹ", "Hẻm núi Fjaðrárgljúfur, Iceland", "Hẻm núi Sông Blyde, Nam Phi", "Núi Cầu vồng, Peru", "Núi lửa Kawah Ijen với dung nham xanh", "Painted Hills, Oregon", "Rạn san hô Great Barrier, Úc", "Ruộng bậc thang Pamukkale, Thổ Nhĩ Kỳ", "Rừng cây gỗ đỏ, California", "Rừng cong, Ba Lan", "Rừng đá Trương Gia Giới, Trung Quốc", "Rừng nhiệt đới Amazon", "Sa mạc Atacama", "Sa mạc Sahara", "Socotra, Yemen (cây máu rồng)", "Sông băng Perito Moreno, Argentina", "Sông ngầm Puerto Princesa, Philippines", "Thác Angel, Venezuela", "Thác Detian, biên giới Việt-Trung", "Thác Havasu, Grand Canyon", "Thác Seljalandsfoss, Iceland", "Thác Victoria, Châu Phi", "Thor's Well, Oregon", "Vịnh phát quang sinh học, Puerto Rico", "Vườn quốc gia Lençóis Maranhenses, Brazil", "Vườn quốc gia Wadi Rum, Jordan", "Vùng đất Cappadocia, Thổ Nhĩ Kỳ", "Đảo Galapagos, Ecuador"
    ],
    "Trên không": [
        "Bay cùng một đàn chim di cư", "Bay lượn trên dù lượn", "Bay qua một cơn bão", "Bay qua một ngọn núi lửa đang hoạt động", "Bay trong một chiếc máy bay chiến đấu", "Bên ngoài một trạm vũ trụ", "Bữa tối trên một nhà hàng xoay", "Cưỡi một con rồng", "Cưỡi trên một con đại bàng", "Dạo bước trên một cây cầu kính", "Du hành trên một chiếc khinh khí cầu", "Du hành trên một chiếc thuyền bay", "Đi bộ trên một cánh máy bay", "Đi bộ trên những đám mây", "Đi trên một chuyến tàu lượn siêu tốc cao nhất", "Đi trên dây qua hai tòa nhà chọc trời", "Đu dây qua một hẻm núi", "Giữa các vì sao", "Khiêu vũ trên mây", "Lái một chiếc trực thăng", "Lơ lửng trong không trọng lực", "Nhảy dù", "Nhảy dù từ rìa không gian", "Ngắm nhìn từ cửa sổ máy bay", "Ngắm Trái Đất từ Mặt Trăng", "Ngắm sao băng", "Ngồi trên một đám mây", "Ở trong một ngôi nhà trên cây cao chót vót", "Picnic trên một vách đá", "Sống trong một thành phố trên mây", "Thả một chiếc đèn trời", "Thăm một trạm quan sát thời tiết trên núi cao", "Thế giới của các thiên thần", "Thế giới nhìn từ góc nhìn của một con chim", "Thành phố trên mây", "Trong buồng lái máy bay", "Trong một cơn lốc xoáy", "Trong một cabin cáp treo", "Trong một đài quan sát trên đỉnh núi", "Trong một thang máy bằng kính ngoài trời", "Trạm vũ trụ quốc tế ISS", "Trượt zipline qua một khu rừng", "Trên một con tàu vũ trụ liên hành tinh", "Trên một tòa nhà chọc trời đang xây dựng", "Trên khinh khí cầu", "Vượt qua một cây cầu treo trên cao", "Đi qua một cổng vòm cầu vồng", "Đứng trên đỉnh của một tòa nhà chọc trời", "Đứng trên đỉnh Everest", "Ăn tối trên một cần cẩu"
    ],
    "Trung tâm thương mại": [
        "Ánh sáng tự nhiên từ mái vòm kính", "Bãi đậu xe trên sân thượng với view thành phố", "Cầu đi bộ bằng kính giữa các tòa nhà", "Cửa hàng Apple Store với kiến trúc kính", "Cửa hàng bách hóa cao cấp (department store)", "Cửa hàng kẹo nhiều màu sắc", "Cửa hàng flagship của một thương hiệu lớn", "Cửa sổ trưng bày được trang trí công phu", "Galleria Vittorio Emanuele II, Milan", "Hành lang rộng lớn với sàn nhà bóng loáng", "Kiến trúc độc đáo và hiện đại", "Khu ẩm thực (food court) đa dạng", "Khu nghệ thuật sắp đặt", "Khu mua sắm ngoài trời kiểu làng châu Âu", "Khu vực bán đồ điện tử", "Khu vực bán đồ thủ công và nghệ thuật", "Khu vực dành riêng cho trẻ em", "Khu vực nghỉ ngơi với ghế sofa thoải mái", "Khu vực tổ chức sự kiện/sân khấu nhỏ", "Khu vực trưng bày xe hơi sang trọng", "Khu vui chơi công nghệ cao (VR/AR)", "Khu vườn trên sân thượng của TTTM", "Lối vào được thiết kế ấn tượng", "Lối đi được trang trí theo chủ đề", "Lúc TTTM vắng vẻ vào buổi sáng", "Lúc TTTM đông đúc nhộn nhịp", "Mall of America với công viên giải trí bên trong", "Màn hình LED khổng lồ bên ngoài TTTM", "Một cửa hàng sách lớn bên trong TTTM", "Quầy bar trên sân thượng của TTTM", "Rạp chiếu phim IMAX bên trong TTTM", "Sân trượt băng bên trong TTTM", "Siam Paragon, Bangkok", "Sảnh lớn với đài phun nước và giếng trời", "Siêu thị cao cấp bên trong TTTM", "Sự kiện ra mắt sản phẩm", "Thang cuốn với đèn neon", "Thang máy bằng kính trong suốt", "Trước cửa một cửa hàng đồ chơi lớn", "Trước một bức tường logo các thương hiệu", "Trung tâm thương mại Dubai Mall với thủy cung", "Trung tâm thương mại được trang trí Giáng sinh lộng lẫy", "Trung tâm thương mại tương lai ở Tokyo", "Các cửa hàng sang trọng trên đại lộ Rodeo Drive", "Cửa hàng đồ thể thao", "Đi dạo trong giờ vàng (golden hour)", "Đài phun nước nhạc", "Đứng trên ban công nhìn xuống sảnh chính", " фасад của Harrods, London", "Khu vực spa và làm đẹp"
    ],
    "Valentine 14/2": [
        "Bữa sáng trên giường", "Bữa tối lãng mạn dưới ánh nến", "Cầu hôn bất ngờ", "Cặp đôi đầu bếp", "Cặp đôi du lịch", "Cặp đôi game thủ", "Cặp đôi thể thao", "Cặp đôi trong thư viện", "Chuyến dã ngoại ngọt ngào", "Chụp ảnh với bóng bay trái tim", "Chụp ảnh với hoa hồng và sô-cô-la", "Chụp ảnh với thú cưng", "Concept '50 sắc thái'", "Concept 'La La Land'", "Concept 'Lỗi tại các vì sao'", "Concept 'Nàng thơ và họa sĩ'", "Concept 'Ông bà Smith'", "Concept Thần tình yêu Cupid", "Dạo phố đêm Valentine", "Đi xem phim", "Hẹn hò ở hiệu sách", "Hẹn hò ở quán cà phê", "Hẹn hò trên sân thượng", "Khiêu vũ dưới mưa", "Khoảnh khắc đời thường", "Lạc vào Paris - thành phố tình yêu", "Lá thư tình viết tay", "Lời tỏ tình đầu tiên", "Nắm tay nhau đi khắp thế gian", "Nấu ăn cùng nhau", "Nụ hôn đầu", "Picnic cho cặp đôi Valentine", "Tái hiện cảnh phim tình cảm", "Tặng quà Valentine", "Tình yêu học trò", "Tình yêu vượt thời gian", "Trận chiến gối nệm", "Trốn tìm trong công viên", "Vũ hội hóa trang", "Viết tên nhau trên cát", "Xem bình minh/hoàng hôn cùng nhau", "Yêu từ cái nhìn đầu tiên", "Đi thuyền thiên nga trên hồ", "Đi dạo trong một khu vườn hoa hồng", "Đến một buổi hòa nhạc", "Đến một spa dành cho cặp đôi", "Khiêu vũ trong một phòng khiêu vũ lớn", "Làm đồ gốm cùng nhau", "Nhảy bungee cùng nhau", "Tham gia một lớp học khiêu vũ"
    ],
    "Vườn hoa": [
        "Cánh đồng hoa Bluebonnet, Texas", "Cánh đồng hoa Vạn Thành, Đà Lạt", "Cánh đồng hoa anh túc ở California", "Cánh đồng hoa cải ở La Bình, Trung Quốc", "Cánh đồng hoa cẩm tú cầu, Đà Lạt", "Cánh đồng hoa dại ở Namaqualand, Nam Phi", "Cánh đồng hoa hướng dương ở Tuscany, Ý", "Cánh đồng hoa oải hương ở Provence, Pháp", "Cánh đồng hoa tam giác mạch, Hà Giang", "Cánh đồng hoa tulip ở Skagit Valley, Mỹ", "Công viên Hitachi Seaside, Nhật Bản (hoa nemophila, kochia)", "Công viên Inokashira, Nhật Bản", "Làng hoa Nhật Tân, Hà Nội", "Làng hoa Sa Đéc, Việt Nam", "Lễ hội hoa anh đào ở Washington D.C.", "Lễ hội hoa ở Chiang Mai, Thái Lan", "Mê cung bằng cây", "Sa mạc Anza-Borrego khi hoa nở", "Thung lũng hoa Bắc Hà, Việt Nam", "Vườn Boboli, Ý", "Vườn Butchart, Canada", "Vườn Descanso, California", "Vườn Dubai Miracle Garden", "Vườn Filoli, California", "Vườn Hidcote Manor, Anh", "Vườn Kawachi Fuji, Nhật Bản (hoa tử đằng)", "Vườn Kenrokuen, Nhật Bản", "Vườn Keukenhof, Hà Lan (hoa tulip)", "Vườn Longwood, Pennsylvania", "Vườn Majorelle, Ma-rốc", "Vườn Mainau, Đức", "Vườn Nong Nooch Tropical, Thái Lan", "Vườn Powerscourt, Ireland", "Vườn Rikugien, Tokyo", "Vườn Versailles, Pháp", "Vườn Villa d'Este, Ý", "Vườn Villa Taranto, Ý", "Vườn Yu Garden, Thượng Hải", "Vườn bách thảo Brooklyn", "Vườn bách thảo Kew, Anh", "Vườn bách thảo Kirstenbosch, Nam Phi", "Vườn bách thảo Singapore", "Vườn bách thảo sa mạc, Arizona", "Vườn của Monet tại Giverny, Pháp", "Vườn hoa Ashikaga, Nhật Bản (hoa tử đằng)", "Vườn hoa Cầu Đất, Đà Lạt", "Vườn hoa hồng Mottisfont Abbey, Anh", "Vườn hoa hồng Portland", "Vườn lâu đài Sissinghurst, Anh", "Vườn quốc gia Thung lũng các loài hoa, Ấn Độ"
    ],
    "Poster phim (chụp với nhân vật)": [
"Dune: Part Two (2024) — chụp với các nhân vật trong poster phim", "Godzilla x Kong: The New Empire (2024) — chụp với các nhân vật trong poster phim", "Deadpool & Wolverine (2024) — chụp với các nhân vật trong poster phim", "Furiosa: A Mad Max Saga (2024) — chụp với các nhân vật trong poster phim", "Kingdom of the Planet of the Apes (2024) — chụp với các nhân vật trong poster phim", "Joker: Folie à Deux (2024) — chụp với các nhân vật trong poster phim", "Venom: The Last Dance (2024) — chụp với các nhân vật trong poster phim", "Transformers One (2024) — chụp với các nhân vật trong poster phim", "Ultraman: Rising (2024) — chụp với các nhân vật trong poster phim", "Atlas (2024) — chụp với các nhân vật trong poster phim",
"Superman (2025) — chụp với các nhân vật trong poster phim", "Captain America: Brave New World (2025) — chụp với các nhân vật trong poster phim", "Thunderbolts* (2025) — chụp với các nhân vật trong poster phim", "The Fantastic Four (2025) — chụp với các nhân vật trong poster phim", "Jurassic World: Rebirth (2025) — chụp với các nhân vật trong poster phim", "Avatar: Fire and Ash (2025) — chụp với các nhân vật trong poster phim", "TRON: Ares (2025) — chụp với các nhân vật trong poster phim", "M3GAN 2.0 (2025) — chụp với các nhân vật trong poster phim",
"Madame Web (2024) — chụp với các nhân vật trong poster phim", "Kraven the Hunter (2024) — chụp với các nhân vật trong poster phim",
"Iron Man (2008) — chụp với các nhân vật trong poster phim", "The Incredible Hulk (2008) — chụp với các nhân vật trong poster phim", "Iron Man 2 (2010) — chụp với các nhân vật trong poster phim", "Thor (2011) — chụp với các nhân vật trong poster phim", "Captain America: The First Avenger (2011) — chụp với các nhân vật trong poster phim", "The Avengers (2012) — chụp với các nhân vật trong poster phim", "Iron Man 3 (2013) — chụp với các nhân vật trong poster phim", "Thor: The Dark World (2013) — chụp với các nhân vật trong poster phim", "Captain America: The Winter Soldier (2014) — chụp với các nhân vật trong poster phim", "Guardians of the Galaxy (2014) — chụp với các nhân vật trong poster phim", "Avengers: Age of Ultron (2015) — chụp với các nhân vật trong poster phim", "Ant-Man (2015) — chụp với các nhân vật trong poster phim", "Captain America: Civil War (2016) — chụp với các nhân vật trong poster phim", "Doctor Strange (2016) — chụp với các nhân vật trong poster phim", "Guardians of the Galaxy Vol. 2 (2017) — chụp với các nhân vật trong poster phim", "Spider-Man: Homecoming (2017) — chụp với các nhân vật trong poster phim", "Thor: Ragnarok (2017) — chụp với các nhân vật trong poster phim", "Black Panther (2018) — chụp với các nhân vật trong poster phim", "Avengers: Infinity War (2018) — chụp với các nhân vật trong poster phim", "Ant-Man and the Wasp (2018) — chụp với các nhân vật trong poster phim", "Captain Marvel (2019) — chụp với các nhân vật trong poster phim", "Avengers: Endgame (2019) — chụp với các nhân vật trong poster phim", "Spider-Man: Far From Home (2019) — chụp với các nhân vật trong poster phim", "Black Widow (2021) — chụp với các nhân vật trong poster phim", "Shang-Chi and the Legend of the Ten Rings (2021) — chụp với các nhân vật trong poster phim", "Eternals (2021) — chụp với các nhân vật trong poster phim", "Spider-Man: No Way Home (2021) — chụp với các nhân vật trong poster phim", "Doctor Strange in the Multiverse of Madness (2022) — chụp với các nhân vật trong poster phim", "Thor: Love and Thunder (2022) — chụp với các nhân vật trong poster phim", "Black Panther: Wakanda Forever (2022) — chụp với các nhân vật trong poster phim", "Ant-Man and the Wasp: Quantumania (2023) — chụp với các nhân vật trong poster phim", "Guardians of the Galaxy Vol. 3 (2023) — chụp với các nhân vật trong poster phim",
"Batman Begins (2005) — chụp với các nhân vật trong poster phim", "The Dark Knight (2008) — chụp với các nhân vật trong poster phim", "The Dark Knight Rises (2012) — chụp với các nhân vật trong poster phim", "Man of Steel (2013) — chụp với các nhân vật trong poster phim", "Batman v Superman: Dawn of Justice (2016) — chụp với các nhân vật trong poster phim", "Suicide Squad (2016) — chụp với các nhân vật trong poster phim", "Wonder Woman (2017) — chụp với các nhân vật trong poster phim", "Justice League (2017) — chụp với các nhân vật trong poster phim", "Aquaman (2018) — chụp với các nhân vật trong poster phim", "Shazam! (2019) — chụp với các nhân vật trong poster phim", "Joker (2019) — chụp với các nhân vật trong poster phim", "Birds of Prey (2020) — chụp với các nhân vật trong poster phim", "Wonder Woman 1984 (2020) — chụp với các nhân vật trong poster phim", "Zack Snyder's Justice League (2021) — chụp với các nhân vật trong poster phim", "The Suicide Squad (2021) — chụp với các nhân vật trong poster phim", "The Batman (2022) — chụp với các nhân vật trong poster phim", "Black Adam (2022) — chụp với các nhân vật trong poster phim", "Shazam! Fury of the Gods (2023) — chụp với các nhân vật trong poster phim", "The Flash (2023) — chụp với các nhân vật trong poster phim", "Blue Beetle (2023) — chụp với các nhân vật trong poster phim", "Aquaman and the Lost Kingdom (2023) — chụp với các nhân vật trong poster phim",
"Transformers (2007) — chụp với các nhân vật trong poster phim", "Transformers: Revenge of the Fallen (2009) — chụp với các nhân vật trong poster phim", "Transformers: Dark of the Moon (2011) — chụp với các nhân vật trong poster phim", "Transformers: Age of Extinction (2014) — chụp với các nhân vật trong poster phim", "Transformers: The Last Knight (2017) — chụp với các nhân vật trong poster phim", "Bumblebee (2018) — chụp với các nhân vật trong poster phim", "Transformers: Rise of the Beasts (2023) — chụp với các nhân vật trong poster phim"
],
"Poster phim (biến thành nhân vật)": [
"Dune: Part Two (2024)", "Godzilla x Kong: The New Empire (2024)", "Deadpool & Wolverine (2024)", "Furiosa: A Mad Max Saga (2024)", "Kingdom of the Planet of the Apes (2024)", "Joker: Folie à Deux (2024)", "Venom: The Last Dance (2024)", "Transformers One (2024)", "Ultraman: Rising (2024)", "Atlas (2024)",
"Superman (2025)", "Captain America: Brave New World (2025)", "Thunderbolts\* (2025)", "The Fantastic Four (2025)", "Jurassic World: Rebirth (2025)", "Avatar: Fire and Ash (2025)", "TRON: Ares (2025)", "M3GAN 2.0 (2025)",
"Madame Web (2024)", "Kraven the Hunter (2024)",
"Iron Man (2008)", "The Incredible Hulk (2008)", "Iron Man 2 (2010)", "Thor (2011)", "Captain America: The First Avenger (2011)", "The Avengers (2012)", "Iron Man 3 (2013)", "Thor: The Dark World (2013)", "Captain America: The Winter Soldier (2014)", "Guardians of the Galaxy (2014)", "Avengers: Age of Ultron (2015)", "Ant-Man (2015)", "Captain America: Civil War (2016)", "Doctor Strange (2016)", "Guardians of the Galaxy Vol. 2 (2017)", "Spider-Man: Homecoming (2017)", "Thor: Ragnarok (2017)", "Black Panther (2018)", "Avengers: Infinity War (2018)", "Ant-Man and the Wasp (2018)", "Captain Marvel (2019)", "Avengers: Endgame (2019)", "Spider-Man: Far From Home (2019)", "Black Widow (2021)", "Shang-Chi and the Legend of the Ten Rings (2021)", "Eternals (2021)", "Spider-Man: No Way Home (2021)", "Doctor Strange in the Multiverse of Madness (2022)", "Thor: Love and Thunder (2022)", "Black Panther: Wakanda Forever (2022)", "Ant-Man and the Wasp: Quantumania (2023)", "Guardians of the Galaxy Vol. 3 (2023)",
"Batman Begins (2005)", "The Dark Knight (2008)", "The Dark Knight Rises (2012)", "Man of Steel (2013)", "Batman v Superman: Dawn of Justice (2016)", "Suicide Squad (2016)", "Wonder Woman (2017)", "Justice League (2017)", "Aquaman (2018)", "Shazam! (2019)", "Joker (2019)", "Birds of Prey (2020)", "Wonder Woman 1984 (2020)", "Zack Snyder's Justice League (2021)", "The Suicide Squad (2021)", "The Batman (2022)", "Black Adam (2022)", "Shazam! Fury of the Gods (2023)", "The Flash (2023)", "Blue Beetle (2023)", "Aquaman and the Lost Kingdom (2023)",
"Transformers (2007)", "Transformers: Revenge of the Fallen (2009)", "Transformers: Dark of the Moon (2011)", "Transformers: Age of Extinction (2014)", "Transformers: The Last Knight (2017)", "Bumblebee (2018)", "Transformers: Rise of the Beasts (2023)"
],
"Sinh nhật": [
"Bánh kem nến lung linh", "Backdrop bóng bay pastel", "Tiệc vườn ngoài trời", "Phong cách tối giản trắng vàng", "Photo booth polaroid", "Bong bóng chữ Happy Birthday", "Bàn dessert table sang chảnh", "Confetti & pháo giấy", "Birthday picnic thảm caro", "Tiệc hồ bơi nổi bật", "Ánh đèn string light ấm áp", "Góc quà tặng ruy băng", "Cupcake tower nhiều tầng", "Góc wish card treo dây", "Cổng bóng organic", "Chân dung thổi nến close-up", "Chụp với số tuổi khổng lồ", "Bánh kem buttercream hoa tươi", "Tiệc tối rooftop city view", "Góc photobooth neon chữ ký", "Set chụp gia đình quây quần", "Set chụp bạn bè ôm vai", "Bắn pháo kim tuyến khoảnh khắc", "Cắt bánh nghi thức", "Cheers ly champagne", "Backdrop hoa giấy 3D", "Bóng bay bay trần nhà", "Bàn trà bánh vintage", "Trang phục dress code đen trắng", "Chụp cận phụ kiện sinh nhật", "Chụp với thú cưng đeo nón", "Chụp mở quà ngạc nhiên", "Góc game party vui nhộn", "Chụp khói màu nhẹ nhàng", "Chụp in-door studio high-key", "Chụp out-door golden hour", "Ảnh Polaroid kẹp dây", "Góc photobook ký tên", "Bảng chalkboard mốc tuổi", "Phông màn nhũ kim tuyến", "Hình bóng silhouette thổi nến", "Bộ số tuổi đèn led", "Backdrop vải linen tối giản", "Góc kẹo mút & macaron", "Chụp macro chi tiết nến", "Bộ props giấy vui nhộn", "Góc quà handmade", "Bàn quà lưu niệm mini", "Ảnh ôm bánh cute", "Ảnh gia đình hôn má"
],
"Mùa thu": [
"Lá vàng rơi công viên", "Con đường lá phong đỏ", "Cốc cacao khói ấm", "Áo khoác trench coat", "Nắng chiều vàng mềm", "Quả bí ngô pumpkin patch", "Chợ nông sản mùa thu", "Đọc sách bên cửa sổ", "Dã ngoại plaid blanket", "Vườn táo thu hoạch", "Ánh nắng xuyên tán cây", "Cầu gỗ hồ tĩnh lặng", "Ảnh đôi tay cầm lá", "Đường mòn rừng lá khô", "Quán cà phê cửa kính", "Áo len cổ lọ ấm", "Góc bếp nướng bánh táo", "Cành phong áp cửa sổ", "Mưa lất phất áo măng-tô", "Góc ban công chậu cúc", "Bó lúa khô rustic", "Xe đạp vintage giỏ lá", "Hồ nước phản chiếu lá", "Khói bếp chiều làng", "Lễ hội đèn lồng mùa gặt", "Nón len và khăn choàng", "Sách, bút, cà phê", "Lối đi lát đá rêu", "Ảnh macro lá với sương", "Ánh đèn vàng phố cổ", "Vườn nho cuối vụ", "Bánh bí ngô & quế", "Găng tay len cầm cốc", "Gốc cây to & ghế gỗ", "Cúi nhặt lá nâu", "Silhouette giữa lá vàng", "Ánh hoàng hôn khói mờ", "Áo khoác dạ nâu đất", "Cửa hàng sách cũ", "Cổng vòm lá leo", "Chiếc khăn kẻ caro", "Vạt nắng qua tóc", "Đồng cỏ lau mùa chín", "Hồ sen tàn lãng mạn", "Gió heo may thổi tóc", "Bậc thềm phủ lá", "Ghế đá công viên", "Tách trà thảo mộc", "Nến thơm hổ phách", "Hàng cây avenue vàng"
],
"Mùa hạ": [
"Bãi biển nắng vàng", "Sóng biển & ván lướt", "Dừa nghiêng đổ bóng", "Bikini & kính râm", "Hồ bơi phao khổng lồ", "Kem que nhiều màu", "Dã ngoại bờ cát", "Lặn ống thở san hô", "Sunset tropical glow", "Ánh nắng chói flare", "Short jeans & áo thun", "Nón cói & váy maxi", "Chợ đêm ven biển", "Dưa hấu đỏ mọng", "Cocktail nhiệt đới", "Đạp xe ven biển", "Võng giữa rừng dừa", "Đảo đá vôi xanh ngọc", "Trại hè lửa trại", "Đường bờ kè gió mạnh", "Festival âm nhạc ngoài trời", "Câu cá hoàng hôn", "Chụp dưới nước pool", "Bóng râm tán cây", "Hoa giấy rực rỡ", "Khăn bãi biển sọc", "Bóng chuyền bãi biển", "Thuyền kayak trong vịnh", "Chân trần trên cát", "Ánh nắng qua lá cọ", "Dưa gang & dứa", "Đường ven biển đèo đẹp", "Sương mù sớm biển", "Quán bar rooftop nhiệt đới", "Mũ bucket & tote bag", "Màu neon phản quang", "Áo sơ mi Hawaii", "Đèn lồng phố biển", "Đảo hoang nước trong", "Cửa sổ kính trời xanh", "Góc ban công hoa giấy", "Mưa rào mùa hạ", "Cầu cảng gỗ dài", "Ván SUP giữa hồ", "Tảng đá nhảy xuống nước", "Dải nắng backlight tóc", "Ly đá bào trái cây", "Trẻ con chơi cát", "Vườn hướng dương rực", "Đầm sen nở mùa hạ"
],
"Mùa đông": [
"Rừng thông tuyết phủ", "Bông tuyết đậu tóc", "Áo khoác bông dày", "Khăn len & mũ len", "Hơi thở mù sương", "Cốc cacao marshmallow", "Lò sưởi ánh lửa", "Đèn fairy lights ấm", "Cửa sổ băng giá", "Găng tay len đan", "Giày boots trên tuyết", "Làm người tuyết vui", "Tuần lộc & vòng nguyệt quế", "Chợ Giáng Sinh", "Cây thông trang trí", "Hộp quà ruy băng đỏ", "Xe trượt tuyết", "Ánh đèn vàng phố cổ", "Tuyết rơi ban đêm", "Áo choàng dạ tối", "Khăn choàng tartan", "Cặp cốc đôi ấm", "Cửa gỗ phủ tuyết", "Hồ băng trượt patin", "Hơi ấm ôm nhau", "Lá khô đóng băng", "Khói ấm từ ống khói", "Cửa tiệm bánh Giáng Sinh", "Bánh gừng & quế", "Đèn nến cửa sổ", "Mũi đỏ lạnh giá", "Chó husky kéo xe", "Tuyết rơi trên phố", "Tuyết đọng song cửa", "Áo lông cổ ấm", "Bức thư mùa đông", "Đường mòn tuyết trắng", "Tách trà đen nóng", "Bầu trời xám mờ", "Mặt trời mùa đông", "Tranh sương giá kính", "Váy len ấm áp", "Bức tường gạch & đèn vàng", "Cầu gỗ băng tuyết", "Túi chườm tay", "Chăn dệt thừng", "Lều gỗ tuyết phủ", "Tuyết bám lông mi", "Bước chân in tuyết", "Ánh đèn nhà ấm"
],
"Mùa xuân": [
"Đường hoa anh đào", "Mưa xuân lất phất", "Áo khoác mỏng pastel", "Cánh bướm vườn hoa", "Nụ chồi non xanh", "Vườn tulip rực rỡ", "Cánh đồng cải vàng", "Sương sớm long lanh", "Picnic thảm caro nhẹ", "Trà hoa thảo mộc", "Ánh nắng mềm buổi sớm", "Khu vườn hồng nở", "Cầu gỗ bên suối", "Áo đầm hoa nhí", "Lễ hội thả diều", "Góc ban công chậu thảo", "Đàn chim trở về", "Chân trần trên cỏ", "Cây liễu đung đưa", "Cửa sổ rèm voan", "Giọt mưa trên cánh hoa", "Đầm maxi bay nhẹ", "Vườn cam quýt non", "Lấp lánh cầu vồng", "Con đường làng xanh", "Sách & trà bên cửa", "Khăn lụa phất phơ", "Giỏ hoa dại", "Bánh macaron pastel", "Xe đạp giỏ hoa", "Dòng suối trong veo", "Cánh cửa xanh mint", "Ánh nắng backlight hoa", "Đồi cỏ non mướt", "Chụp macro nhụy hoa", "Lễ hội hoa xuân", "Bầy cừu đồng cỏ", "Góc studio high-key", "Áo cardigan mỏng", "Đàn chim sẻ trên dây", "Bảng phấn màu phấn", "Gió xuân phơn phớt", "Cây táo nở trắng", "Vườn oải hương non", "Cánh đồng tam giác mạch", "Cúc họa mi đầu mùa", "Cây cầu hoa giấy", "Đồi chè xanh mướt", "Khung cửa gỗ trắng", "Hồ gương phản hoa"
],
"Thập niên 5x": [
"Diner cổ điển & jukebox", "Xe cổ mui trần thập niên 50", "Áo váy chấm bi poodle skirt", "Kiểu tóc victory rolls", "Son đỏ & mắt mèo (cat-eye)", "Áo khoác da greaser", "Quán soda fountain & milkshake", "Rạp chiếu bóng drive-in", "Bộ ấm trà mid-century", "Phòng khách mid-century modern", "Bàn Formica & ghế chrome", "Radio đèn bóng cổ", "TV đen trắng retro", "Cửa hiệu cắt tóc barber cổ", "Sàn gạch caro đen trắng", "Bowling alley cổ điển", "Máy hát đĩa than & vinyl", "Thư viện báo giấy xưa", "Tủ lạnh pastel cổ điển", "Tiệm giặt ủi laundromat retro", "Đường Route 66 & motel sign", "Biển hiệu neon diner", "Rạp hát bảng đèn marquee", "Trường học xưa & áo varsity", "Thư tín & máy đánh chữ cổ", "Đi giày bít mũi & găng tay satin", "Buổi tiệc cocktail martini", "Ngọc trai & đầm trà (tea dress)", "Giày trượt patin bốn bánh", "Điện thoại quay số rotary", "Ảnh Polaroid đầu đời", "Xe đạp giỏ mây vintage", "Picnic khăn caro đỏ", "Nhà bếp sắc pastel", "Tiệm kẹo kẹo que cổ", "Cửa hàng đĩa than", "Sân ga tàu hơi nước", "Quán kem cửa sổ", "Tiệm sửa radio/TV", "Nhà thờ gỗ & đám cưới cổ", "Bưu điện & thùng thư đỏ", "Cánh cửa kính khung nhôm", "Đồng hồ treo tường sunburst", "Đèn bàn sừng hươu", "Giường sắt đầu cong", "Hẻm sau quán diner", "Ngõ nhỏ gạch đỏ", "Nhà gỗ ngoại ô", "Biển báo đường cổ", "Cửa hàng mũ & găng"
],
"Thập niên 6x": [
"Phong cách Mod & mini skirt", "Go-go boots trắng", "Kẻ op-art đen trắng", "Trang điểm Twiggy", "Xe scooter Vespa", "Carnaby Street vibe", "Nhạc Beatles & suit cổ lửng", "Quán café bohemian", "Poster pop art rực", "Lava lamp & plastic chair", "Hoa dại flower power", "Tie-dye psychedelic", "Xe van VW hippie", "Woodstock cánh đồng", "Peace sign & hạt cườm", "Bead curtains cửa phòng", "Nhà có sunken living room", "Điện thoại quay số màu kẹo", "Bộ loa transistor", "Máy quay 8mm gia đình", "Máy chiếu Super 8", "Máy ghi âm cuộn băng (reel-to-reel)", "Áo cổ lọ đen & mũ beret", "Phòng trưng bày nghệ thuật", "Bữa tiệc fondue sớm", "Đêm nhảy shindig", "Đèn chiếu oil projector", "Cửa hàng đĩa & poster", "Thang cuốn trung tâm mua sắm", "Căn bếp sắc cam/mù tạt", "Bãi biển surf & longboard", "Phòng ký túc xá sinh viên", "Biểu ngữ phản chiến", "Cầu thang chung cư bê tông", "Phòng khách thảm shag mỏng", "Đồng hồ hình học pop", "Bộ ấm trà họa tiết retro", "Bản đồ mặt trăng & tên lửa", "Xem sự kiện đổ bộ Mặt Trăng", "TV màu đầu tiên", "Kệ sách gỗ teak", "Giỏ mây & bình gốm", "Ghế bong bóng (bubble chair)", "Áo khoác da suede tua rua", "Mắt kính phi công", "Máy ảnh film rangefinder", "Đồng hồ cổ tay mặt acrylic", "Cửa hàng tạp hóa cổ", "Cầu đi bộ phố cổ", "Bức tường gạch vẽ tay"
],
"Thập niên 7x": [
"Sàn disco & quả cầu gương", "Quần ống loe bell-bottom", "Giày đế độn platform", "Áo len cổ lọ tông đất", "Tóc afro & râu quai nón", "Boho macramé treo tường", "Ghế mây/rattan & cây xanh", "Thảm shag dày ấm", "Bảng màu cam–nâu–vàng", "Đèn bàn mushroom", "Máy phát đĩa than & cassette", "Radio băng & boombox đầu đời", "Xe wagon ốp gỗ", "Nhà bếp màu avocado", "Quầy bar gia đình", "Bộ nồi fondue tiệc tối", "Tiệm pinball & arcade sơ khai", "Áp-phích phim cổ điển", "Cửa hàng băng đĩa", "Skateboard hồ bơi", "Cột điện thoại công cộng", "Máy ảnh Polaroid SX-70", "Bảng hiệu đèn neon ấm", "Áo sơ mi họa tiết paisley", "Áo khoác da biker", "Xe van dã ngoại", "Lễ hội âm nhạc đồng cỏ", "Cửa hàng đồ cũ vintage", "Phòng khách gỗ ốp tường", "Tivi gỗ màn cong", "Ghế bành da nâu", "Bếp lửa ngoài trời", "Bến xe buýt cổ", "Đài cassette mixtape", "Đêm chiếu phim ngoài trời", "Hồ bơi xanh ngọc & phao", "Đèn treo hình cầu thủy tinh", "Bình gốm men nâu", "Tượng trừu tượng bê tông", "Nhà để xe & xe cơ bắp", "Bức tường đá phiến", "Hành lang motel", "Bốt điện thoại màu đỏ", "Cây dương xỉ treo", "Áo khoác lông cừu sherpa", "Đồng hồ số lật (flip clock)", "Quán café vinyl", "Bảng điều khiển analog synth", "Hàng rào gỗ trắng", "Hồ sen buổi tối"
],
"Thập niên 8x": [
"Neon synthwave & lưới mặt phẳng", "Máy arcade cabinet rực rỡ", "Walkman & băng cassette", "Boombox khổng lồ", "VHS & kệ băng video", "Áo khoác vai độn", "Aerobics leotard & leg warmers", "Băng đô thể thao", "BMX & xe trượt", "Ván trượt roller rink", "Rubik’s Cube", "Máy tính gia đình CRT", "Đĩa mềm & ổ đĩa", "Máy nhắn tin & điện thoại công cộng", "Trung tâm thương mại (mall culture)", "Photo booth dải ảnh", "Siêu xe dáng góc cạnh", "Phong cách Miami pastel", "Tóc phồng & keo xịt", "Khói máy & laser", "MTV trên TV ống", "Graffiti & tàu điện", "Breakdance trên thảm bìa", "Áo khoác da biker sáng màu", "Bảng hiệu neon tiếng Anh–Nhật", "Máy quay VHS cầm tay", "Đồng hồ kỹ thuật số đỏ", "Bộ loa cassette đôi", "Áo gió color-block", "Giày sneaker cổ cao", "Bộ đồ thể thao nylon", "Bàn làm việc máy tính cổ", "Điện thoại bàn dây xoắn", "Game arcade token", "Quán pizza & máy pinball", "Tường gạch & poster dán", "Thẻ thành viên video store", "Túi đeo hông fanny pack", "Bộ hình học Memphis Design", "Ống kính phản quang", "Đêm mưa ánh neon", "Mái nhà bãi đỗ xe", "Bảng điện tử scoreboard", "Đường phố ướt phản chiếu", "Bóng bay kim loại chrome", "Đèn bàn góc tam giác", "Áo thun ban nhạc", "Cửa sổ kính mờ logo", "Bảng quảng cáo lớn", "Điểm chụp trước arcade"
],
"Thập niên 9x": [
"Grunge flannel & Doc Martens", "Choker & kẹp bướm", "Áo denim double", "Băng đeo đầu & áo nỉ", "Máy nhắn tin/beeper", "Điện thoại gập đầu tiên", "Máy tính CRT & Windows 95", "Đĩa CD & Discman", "Băng VHS & máy rewinder", "Máy ảnh dùng một lần", "Purikura/sticker photo", "Skatepark & ván trượt", "Inline rollerblade", "Game console tay cầm retro", "LAN game/quán net", "Internet dial-up", "MiniDV camcorder", "Đèn lava trở lại", "Balo vải canvas", "Máy nghe nhạc băng/đĩa", "Máy chơi game cầm tay", "Tamagotchi thú ảo", "Phong cách hip-hop oldschool", "Quần cargo & bucket hat", "Áo phông logo lớn", "Cửa hàng cho thuê băng đĩa", "Kệ tạp chí & poster", "Bảng tin trường học", "Tủ đồ locker màu sắc", "Xe bus vàng trường", "Sân bóng rổ đường phố", "Vạch kẻ vỉa hè loang", "Đèn neon bowling", "Bữa tiệc nhà garage", "Kẹo cao su & băng dính", "Máy ảnh Polaroid 600", "Tường gạch graffiti", "Sticker laptop & vở", "Bảng điều khiển âm thanh", "Đồng hồ G-shock vibe", "Đèn bàn nhựa màu", "Thẻ điện thoại công cộng", "Bảng quảng cáo giấy dán", "Đồng hồ báo thức radio", "Áo khoác gió mỏng", "Xe sedan hộp vuông", "Túi hộp CD", "Ống nghe Walkman dây", "Đĩa mềm 3.5 inch", "Cửa tiệm game arcade"
],
"Thế hệ Genz": [
"Phòng ngủ LED strip", "Góc gương toàn thân selfie", "Streetwear oversize & techwear", "Giày chunky/sneaker wall", "Túi tote canvas & nón bucket", "Photo dump collage", "Máy ảnh digital CCD retro", "Flash thẳng đêm phố", "0.5 selfie (ultra-wide)", "Grain film aesthetic", "Café tối giản & matcha", "Laptop sticker & bàn phím cơ", "iPad note aesthetic", "Bàn làm việc tối giản trắng", "Plant corner với monstera", "Góc đọc sách nắng nhẹ", "Rooftop bãi đỗ xe", "Skateboard cruiser", "Xe scooter điện", "Projector home cinema", "Gương tròn & rèm voan", "Áo knit/crochet handmade", "Kính nhỏ retro", "Trang điểm clean girl", "Morning routine #thatgirl", "Pilates studio/瑜伽 vibe", "Tumbler to-go thời thượng", "Picnic aesthetic tấm vải trắng", "Bãi cỏ hoàng hôn", "Cầu thang xi măng tối", "Áo khoác varsity hiện đại", "Sticker tường pastel", "Góc decor nến thơm", "Kệ sách màu trung tính", "Bảng moodboard kẹp ảnh", "Góc gaming RGB dịu", "Tai nghe over-ear", "Mặt tiền shop tối giản", "Góc cửa sổ café", "Tường xi măng trần", "Góc chụp gương thang máy", "Giày thể thao trắng sạch", "Bảng lịch dán tường", "Bảng LED chữ neon", "Balo mini & camera strap", "Đèn bàn kiến trúc", "Sàn gỗ sáng & thảm lông", "Áo khoác puffer ngắn", "Áo khoác cargo/utility", "Nail pastel tối giản"
],
"Phong cách thượng lưu": [
"Khách sạn 5⭐ sảnh cẩm thạch", "Đèn chùm pha lê lớn", "Bàn tiệc champagne tower", "Dạ hội black-tie & váy dạ", "Piano grand & phòng nhạc", "Penthouse view skyline", "Du thuyền riêng & bến cảng", "Phòng xì gà & da nâu", "Hầm rượu & decanter pha lê", "Phòng tắm đá cẩm thạch", "Hồ bơi vô cực villa", "Vườn mê cung cắt tỉa", "Phòng trưng bày nghệ thuật", "Bộ đồ ăn bạc & fine dining", "Nhẫn kim cương & đồng hồ cơ", "Xe sang & tài xế riêng", "Sảnh thang máy gỗ óc chó", "Phòng thay đồ haute couture", "Thư viện gỗ sồi cổ điển", "Phòng spa & hammam", "Bộ ấm trà bone china", "Bàn billiards xanh velvet", "Ban công cột đá cổ điển", "Sân polo/golf club", "Vườn nho & château", "Hành lang cột Corinth", "Ốp tường nẹp phào chỉ", "Lò sưởi đá & gương lớn", "Bình hoa lan trắng", "Bộ ghế sofa velvet", "Hành lang thảm đỏ", "Bộ suit may đo bespoke", "Cà vạt lụa & khuy măng sét", "Phòng họp riêng executive", "Rooftop helipad", "Cửa kính khung đồng thau", "Đèn bàn marble & brass", "Bộ vali da cao cấp", "Phòng chiếu phim tại gia", "Phòng thử rượu vang", "Bờ biển riêng hoàng hôn", "Cầu thang xoắn ốc đá", "Bộ dao nĩa vàng rose gold", "Kệ trưng nước hoa", "Bộ khăn trải bàn linen", "Trần vòm & tranh tường", "Sảnh opera/nhà hát", "Bộ sưu tập xe cổ", "Sảnh gallery hành lang dài", "Giường canopy & ga satin", "Máy bay phản lực riêng & siêu xe tại đường băng (doanh nhân áo măng tô, túi da, kính râm; phản chiếu vũng nước)",
"Bước lên trực thăng trên nóc toà nhà (helipad, đèn dẫn đường, suit đen tối giản)",
"Check-in lounge hạng nhất sân bay (champagne, ghế da, boarding pass)",
"Ngồi ghế da trên chuyên cơ (cửa sổ mây, bàn gỗ veneer, ly rượu vang)",
"Du thuyền neo ngoài vịnh lúc hoàng hôn (váy dạ hội, gió bay tóc, ly cocktail)",
"Bến du thuyền & hàng siêu xe đón khách (valet, biển hiệu marina)",
"Penthouse cửa kính toàn cảnh skyline (ghế sofa velvet, đèn chùm pha lê)",
"Phòng khách sạn suite đá cẩm thạch (bồn tắm freestanding, khay champagne)",
"Dinner fine-dining 3 sao (nến, bộ dao nĩa bạc, sommelier rót rượu)",
"Phòng xì gà & whisky (ghế da nâu, decanter pha lê, ánh đèn ấm)",
"Thử đồng hồ cơ cao cấp tại boutique (găng tay trắng, bàn kính)",
"Shopping haute couture trên đại lộ (túi giấy thương hiệu, cửa kính mạ đồng)",
"Bộ sưu tập siêu xe trong garage private (ánh đèn downlight, sàn epoxy bóng)",
"Sảnh khách sạn marble & thang bộ xoắn (đèn chùm pha lê lớn)",
"Hồ bơi vô cực view biển (giường tắm nắng, khăn trắng, kính râm)",
"Rooftop bar nhìn toàn cảnh thành phố (đèn bokeh, ly martini)",
"Phòng họp executive riêng (bàn gỗ lớn, màn hình LED, suit may đo)",
"Ký hợp đồng trên bàn kính (bút máy kim loại, đồng hồ cơ lộ máy)",
"Chauffeur mở cửa Rolls-Royce/Bentley (găng tay, thảm cửa thêu logo)",
"Sân golf private club (xe golf, áo polo, cảnh green mượt)",
"Trường đua polo/đua ngựa (khán đài VIP, ống nhòm, mũ fedora)",
"Thử rượu vang trong hầm (kệ gỗ sồi, ly tulip, nhãn vintage)",
"Spa & hammam trong villa (đá cẩm thạch, áo choàng trắng, nến thơm)",
"Phòng trưng bày nghệ thuật & đấu giá (búa auction, bức tranh cỡ lớn)",
"Rạp chiếu phim tại gia (ghế bọc nhung, máy chiếu 4K, khay bắp rang mạ vàng)",
"Bữa sáng trên ban công penthouse (bánh croissant, báo in, bình hoa lan)",
"Thang máy riêng & sảnh đỗ xe VIP (đèn vàng, biển tên mạ đồng)",
"Hành lang gallery treo tranh & tượng (ánh sáng rọi, nền đá)",
"Tiệc rượu trên boong du thuyền đêm (đèn string light, DJ nhẹ)",
"Private safari lodge sang trọng (xe Land Rover, hoàng hôn savanna, rượu gin)",
"Chalet trượt tuyết cao cấp (lò sưởi đá, rượu vang đỏ, áo lông)",
"Balcony Monaco/đường đua F1 (kính champagne, tiếng động cơ xa)",
"Villa Địa Trung Hải vườn olive (áo linen, bàn ăn ngoài trời, ánh nắng vàng)",
"Hành lang đá cột cổ điển & vòm (váy dạ hội dài, găng tay satin)",
"Thư phòng gỗ óc chó & kệ sách (ghế wingback, địa cầu cổ, đèn bàn brass)",
"Bộ vali da & máy bay phản lực nền mờ (pose đang bước, passport)",
"Bữa trưa business trên du thuyền (hải sản trên đá, rượu trắng)",
"Phòng thay đồ haute couture (gương toàn thân, manocanh, rèm nhung)",
"Helipad city night chụp cùng trực thăng (đèn cảnh báo đỏ, suit bay gió)",
"Lối vào biệt thự cổng sắt & đài phun (siêu xe đỗ phía trước, hàng cọ thẳng hàng)",
"Hồ bơi trong nhà phủ đá onyx (ánh đèn âm, ghế dài gỗ teak)",
"Cầu thang đá cẩm thạch tay vịn đồng (váy đuôi cá, clutch nhỏ)",
"Set brunch resort 5⭐ bên biển (bát trái cây nhiệt đới, khăn lanh)",
"Phòng thử rượu riêng trong château (bản đồ terroir, thùng gỗ)",
"Jet-ski/sea toy bên cạnh siêu du thuyền (đồ bơi sang, áo choàng)",
"Hành lang thảm đỏ sự kiện (photowall, flash máy ảnh, tuxedo)",
"Bộ trà chiều bone china tại lounge (tầng bánh, kẹp ngón tay)",
"Vườn mê cung cắt tỉa & gazebo (váy trắng, nón rộng vành)",
"Phòng gym private view biển (máy chạy gỗ, khăn thêu logo)",
"Bến đỗ trực thăng trước villa biển (áo măng tô, túi duffel da cao cấp)"
],
"Phong cách tổng tài": [
"Văn phòng góc kính corner office", "Bộ suit tối màu may đo", "Cà vạt trơn & cặp da", "Bàn làm việc tối giản", "Background skyline thành phố", "Phòng họp kính & màn hình lớn", "Bảng chiến lược whiteboard", "Bắt tay ký hợp đồng", "Bút máy kim loại & notebook", "Điện thoại call khi đang bước", "Thang máy gương soi", "Cửa xoay sảnh tòa nhà", "Xe sedan đen & tài xế", "Sân bay & phòng chờ hạng thương gia", "Thang máy riêng/đỗ xe VIP", "Đồng hồ cơ & kẹp cà vạt", "Góc whisky & decanter", "Laptop mở KPI dashboard", "Làm việc đêm đèn thành phố", "Ký văn bản trên bàn kính", "Góc thư giãn da nâu", "Kệ sách quản trị", "Phòng podcast/phỏng vấn media", "Phòng họp startup war-room", "Bảng sticky notes sprint", "Trao danh thiếp", "Cửa văn phòng tên mạ", "Lịch trình dày kín", "Làm việc trên xe", "Thẻ ra vào & cổng an ninh", "Đón tiếp đối tác quốc tế", "Rooftop helipad city night", "Tủ áo vest & sơ mi", "Áo măng tô dài & khăn", "Espresso máy bán tự động", "Túi tài liệu mỏng", "Bảng chứng khoán màn hình", "Góc tập gym sáng sớm", "Phòng tiếp khách executive lounge", "Chuyến công tác nhanh", "Check-in khách sạn hạng sang", "Trình chiếu slide pitch", "Phỏng vấn báo tài chính", "Ký NDA/bản hợp đồng", "Đi dạo hành lang đá", "Họp 1-1 đánh giá hiệu suất", "Bàn đứng sit-stand", "Điện thoại thông minh hai máy", "Giao nhận con dấu", "Nhìn qua cửa kính mưa"
],
"Phong cách công sở": [
"Open office sáng & cây xanh", "Bộ blazer & quần tây gọn", "Chân váy bút chì", "Sơ mi trắng/blue basic", "Giày loafer/oxford", "Bàn làm việc gọn gàng", "Màn hình đôi & dock", "Sổ tay & bút ký", "Cốc cà phê văn phòng", "Khay đựng hồ sơ", "Bảng kế hoạch tháng", "Góc họp nhanh stand-up", "Phòng họp kính nhỏ", "Bảng Kanban sticky notes", "Máy in & tủ hồ sơ", "Quầy pantry & barstool", "Góc nghỉ sofa", "Thẻ tên & dây đeo", "Lịch treo tường", "Bảng thông báo nội bộ", "Laptop & tai nghe call", "Bàn phím & chuột công thái học", "Ghế ergonomic", "Bàn đứng nâng hạ", "Đèn bàn task light", "Cây trầu bà/monstera", "Kệ sách tài liệu", "Bảng Gantt in màu", "Máy chiếu & màn kéo", "Điểm check-in lễ tân", "Hành lang thang máy", "Khu đỗ xe đạp", "Tủ locker cá nhân", "Góc để ô & áo mưa", "Giá treo áo khoác", "Bữa trưa hộp & microwave", "Sinh nhật đồng nghiệp", "Casual Friday denim", "Combo cardigan công sở", "Giày sneaker sạch văn phòng", "Họp trình bày slide", "Thảo luận bên bảng kính", "Call online phòng focus", "In tài liệu & đóng bìa", "Đổi name card đối tác", "Khu vực phone booth", "Bàn tiếp khách nhỏ", "Kệ cốc & bình nước", "Hộp cáp & quản lý dây", "Cửa sổ sáng & rèm lá"
]

};

// Define backgroundCategories and backgroundPromptMap for the "Bối cảnh" section.
const backgroundCategories = photoShootStyles;
const backgroundPromptMap: { [key: string]: string } = {};
Object.keys(backgroundCategories).forEach(category => {
    backgroundCategories[category].forEach(style => {
        if (category === 'Siêu xe') {
            backgroundPromptMap[style] = `, bên cạnh một chiếc siêu xe ${style}`;
        } else {
            backgroundPromptMap[style] = `, theo concept chụp ảnh '${style}'`;
        }
    });
});

const artStyles = [
    "Ảnh Daguerreotype", "Ảnh Lomography", "Ảnh Polaroid", "Ảo giác (Psychedelic)", "Ánh sáng Kịch tính (Dramatic Lighting)", "Chân thực (Photorealistic)", "Chồng ảnh (Double Exposure)", "Chụp cận cảnh (Macro)", "Cổ điển (Vintage)", "Cyberpunk", "Đa giác thấp (Low Poly)", "Điện ảnh (Cinematic)", "Đổ bóng hoạt hình (Cel Shading)", "Đơn sắc (Monochrome)", "Giờ Vàng (Golden Hour)", "Giờ Xanh (Blue Hour)", "Góc nhìn Isometric", "Hiệu ứng Bokeh", "Hiệu ứng Tilt-Shift", "Hoạt hình Disney", "Hoạt hình Nhật Bản (Anime/Manga)", "Hoạt hình Pixar", "Hoạt hình Studio Ghibli", "Kết xuất 3D (3D Render)", "Màu nước (Watercolor)", "Nghệ thuật Fantasy", "Nghệ thuật đường phố (Graffiti)", "Nghệ thuật Pixel (Pixel Art)", "Nghệ thuật Pop (Pop Art)", "Nhiễu ảnh (Glitch Art)", "Ống kính mắt cá (Fisheye)", "Phác thảo bút chì (Pencil Sketch)", "Phim đen trắng (Film Noir)", "Phong cách Gothic", "Phơi sáng cao (High Key)", "Phơi sáng dài (Long Exposure)", "Phơi sáng thấp (Low Key)", "Retro", "Siêu thực (Surrealism)", "Sơn dầu (Oil Painting)", "Steampunk", "Tiểu thuyết đồ họa (Graphic Novel)", "Tối giản (Minimalist)", "Tông màu nâu đỏ (Sepia)", "Tranh Lụa (Silk Painting)", "Trừu tượng (Abstract)", "Trường phái Ấn tượng (Impressionism)", "Truyện tranh Mỹ (Comic Book)", "Vaporwave", "Vẽ than (Charcoal Drawing)"
].sort();

const artStylePromptAdditions: { [key: string]: string } = {
    "Chân thực (Photorealistic)": ", theo phong cách siêu thực, chân thực như ảnh chụp",
    "Sơn dầu (Oil Painting)": ", theo phong cách tranh sơn dầu",
    "Màu nước (Watercolor)": ", theo phong cách tranh màu nước",
    "Phác thảo bút chì (Pencil Sketch)": ", theo phong cách phác thảo bút chì",
    "Vẽ than (Charcoal Drawing)": ", theo phong cách vẽ bằng than củi",
    "Hoạt hình Nhật Bản (Anime/Manga)": ", theo phong cách anime/manga",
    "Hoạt hình Disney": ", theo phong cách hoạt hình của Disney",
    "Hoạt hình Pixar": ", theo phong cách hoạt hình 3D của Pixar",
    "Hoạt hình Studio Ghibli": ", theo phong cách hoạt hình của Studio Ghibli",
    "Truyện tranh Mỹ (Comic Book)": ", theo phong cách truyện tranh Mỹ",
    "Tiểu thuyết đồ họa (Graphic Novel)": ", theo phong cách tiểu thuyết đồ họa, u tối và chi tiết",
    "Cyberpunk": ", theo phong cách cyberpunk, với ánh đèn neon và công nghệ tương lai",
    "Steampunk": ", theo phong cách steampunk, với máy hơi nước và bánh răng",
    "Cổ điển (Vintage)": ", theo phong cách ảnh vintage, hoài cổ",
    "Retro": ", theo phong cách retro, màu sắc của thập niên 70-80",
    "Phim đen trắng (Film Noir)": ", theo phong cách phim noir, đen trắng và tương phản cao",
    "Điện ảnh (Cinematic)": ", theo phong cách điện ảnh, cinematic lighting",
    "Ánh sáng Kịch tính (Dramatic Lighting)": ", với ánh sáng kịch tính, tương phản mạnh",
    "Giờ Vàng (Golden Hour)": ", chụp vào giờ vàng với ánh nắng ấm áp",
    "Giờ Xanh (Blue Hour)": ", chụp vào giờ xanh với ánh sáng xanh dịu",
    "Phơi sáng cao (High Key)": ", theo phong cách high-key, tươi sáng và ít bóng tối",
    "Phơi sáng thấp (Low Key)": ", theo phong cách low-key, tối và nhiều bóng đổ",
    "Đơn sắc (Monochrome)": ", theo phong cách đơn sắc (đen trắng)",
    "Tông màu nâu đỏ (Sepia)": ", với tông màu nâu đỏ sepia",
    "Chồng ảnh (Double Exposure)": ", sử dụng kỹ thuật chồng ảnh nghệ thuật",
    "Nhiễu ảnh (Glitch Art)": ", theo phong cách glitch art, nhiễu kỹ thuật số",
    "Siêu thực (Surrealism)": ", theo phong cách siêu thực của Salvador Dalí",
    "Trừu tượng (Abstract)": ", theo phong cách nghệ thuật trừu tượng",
    "Trường phái Ấn tượng (Impressionism)": ", theo phong cách hội họa Ấn tượng",
    "Nghệ thuật Pop (Pop Art)": ", theo phong cách Pop Art của Andy Warhol",
    "Vaporwave": ", theo phong cách vaporwave, với màu hồng và xanh lam neon",
    "Ảnh Polaroid": ", trông giống như một bức ảnh Polaroid",
    "Ảnh Daguerreotype": ", trông giống như một bức ảnh Daguerreotype cổ",
    "Ảnh Lomography": ", theo phong cách ảnh lomography, màu sắc bão hòa và vignette",
    "Ống kính mắt cá (Fisheye)": ", chụp bằng ống kính mắt cá",
    "Hiệu ứng Tilt-Shift": ", với hiệu ứng tilt-shift, làm cho cảnh vật trông như mô hình thu nhỏ",
    "Chụp cận cảnh (Macro)": ", theo phong cách chụp ảnh macro, cực kỳ chi tiết",
    "Phơi sáng dài (Long Exposure)": ", sử dụng kỹ thuật phơi sáng dài để tạo vệt sáng",
    "Hiệu ứng Bokeh": ", với hiệu ứng bokeh lung linh ở hậu cảnh",
    "Nghệ thuật Fantasy": ", theo phong cách nghệ thuật fantasy, huyền ảo",
    "Phong cách Gothic": ", theo phong cách gothic, u tối và trang nghiêm",
    "Tối giản (Minimalist)": ", theo phong cách tối giản",
    "Ảo giác (Psychedelic)": ", theo phong cách ảo giác, màu sắc và hoa văn xoáy",
    "Nghệ thuật đường phố (Graffiti)": ", theo phong cách nghệ thuật đường phố, graffiti",
    "Kết xuất 3D (3D Render)": ", trông như một hình ảnh kết xuất 3D",
    "Đa giác thấp (Low Poly)": ", theo phong cách low poly, hình thành từ các đa giác",
    "Góc nhìn Isometric": ", với góc nhìn isometric",
    "Nghệ thuật Pixel (Pixel Art)": ", theo phong cách pixel art 8-bit",
    "Đổ bóng hoạt hình (Cel Shading)": ", theo phong cách cel-shading, giống như phim hoạt hình",
    "Tranh Lụa (Silk Painting)": ", theo phong cách tranh lụa Á Đông"
};

// Data for new TVC Styles in Tab "Sản phẩm AI"
const tvcStyles: { [key: string]: string[] } = {
    "Người mẫu AI": [
        "Nữ Doanh nhân Thành đạt", "Nữ Vận động viên Yoga", "Nữ Người mẫu Fitness", "Nữ Nghệ sĩ Sáng tạo", "Nữ Bác sĩ Tận tâm", "Nữ Sinh viên Năng động", "Nữ Game thủ Chuyên nghiệp", "Nữ DJ Sôi động", "Nữ Đầu bếp Tài năng", "Nữ Họa sĩ Mộng mơ", "Nữ Nhạc công Cổ điển", "Nữ Phi công Bản lĩnh", "Nữ Cảnh sát Nghiêm nghị", "Nữ Lính cứu hỏa Dũng cảm", "Nữ Nông dân Hiện đại", "Nữ Vận động viên Bơi lội", "Nữ Vũ công Ballet", "Nữ Nhà khoa học", "Nữ Kỹ sư Thông minh", "Nữ Kiến trúc sư", "Nữ Tiếp viên Hàng không", "Nữ Hướng dẫn viên Du lịch", "Nữ Bartender Phong cách", "Nữ Thợ xăm Cá tính", "Nữ Stylist Thời trang",
        "Nam Doanh nhân Lịch lãm", "Nam Vận động viên Gym", "Nam Người mẫu Thời trang", "Nam Nghệ sĩ Lãng tử", "Nam Bác sĩ Chuyên nghiệp", "Nam Sinh viên Trí thức", "Nam Game thủ Tập trung", "Nam DJ Khuấy động", "Nam Đầu bếp Sáng tạo", "Nam Họa sĩ Đường phố", "Nam Nhạc công Rock", "Nam Phi công Lịch lãm", "Nam Cảnh sát Mạnh mẽ", "Nam Lính cứu hỏa Kiên cường", "Nam Nông dân Chân chất", "Nam Vận động viên Bóng đá", "Nam Vũ công Hip-hop", "Nam Nhà khoa học", "Nam Kỹ sư Sáng tạo", "Nam Kiến trúc sư", "Nam Tiếp viên Hàng không", "Nam Hướng dẫn viên Du lịch", "Nam Barista Chuyên nghiệp", "Nam Thợ mộc Lành nghề", "Nam Stylist Cá tính"
    ],
    "Sang trọng & Cao cấp": [
        "Sang trọng & Đẳng cấp", "Tối giản & Tinh tế", "Kim loại quý & Đá quý", "Vẻ đẹp Vượt thời gian", "Trải nghiệm Độc quyền", "Nội thất Cung điện Hoàng gia", "Phong cách Art Deco", "Tiệc du thuyền sang trọng", "Sự kiện Thảm đỏ", "Dòng chảy Lụa & Satin", "Bữa tiệc Black Tie", "Vẻ đẹp Cổ điển (Antique)", "Biệt thự Hiện đại", "Ánh sáng Pha lê", "Chất liệu Nhung cao cấp", "Chi tiết Mạ vàng", "Bữa tối thượng hạng (Fine Dining)", "Không gian trưng bày Nghệ thuật", "Nội thất máy bay tư nhân", "Bộ sưu tập xe hơi cổ", "Cận cảnh Đồng hồ Thụy Sĩ", "Quảng cáo Nước hoa cao cấp", "Vẻ đẹp của Đá cẩm thạch", "Phong cách Vua chúa", "Quầy bar Rượu Cognac & Xì gà", "Trang sức Kim cương", "Đêm nhạc Opera", "Sân Golf độc quyền", "Trải nghiệm Spa 5 sao", "Cửa hàng thời trang cao cấp", "Đen & Vàng sang trọng", "Trắng & Bạc tinh khôi", "Hiệu ứng Ánh kim lỏng", "Họa tiết hình học tinh xảo", "Da thuộc cao cấp", "Phong cách Gatsby vĩ đại", "Vườn thượng uyển riêng tư", "Kiến trúc Tân cổ điển", "Chất liệu Gỗ quý hiếm", "Ánh sáng mềm mại, khuếch tán", "Phong cách Hoàng gia Anh", "Sự kiện Đua ngựa quý tộc", "Căn hộ Penthouse view triệu đô", "Hầm rượu vang cổ", "Phong cách bí ẩn, quyến rũ (Femme Fatale)", "Đơn sắc (Monochrome) cao cấp", "Hiệu ứng Khói & Gương", "Vẻ đẹp điêu khắc", "Thời trang Haute Couture", "Trải nghiệm May đo riêng (Bespoke)"
    ],
    "Năng động & Trẻ trung": [
        "Năng động & Thể thao", "Chuyển động Tốc độ cao", "Âm nhạc Bùng nổ", "Hành động & Mạo hiểm", "Vũ điệu Màu sắc", "Phong cách Đường phố (Street Style)", "Lễ hội Âm nhạc ngoài trời", "Parkour & Freerunning", "Trượt ván & BMX", "Nghệ thuật Graffiti", "Đèn Neon Thành phố đêm", "Phong cách Pop Art", "Retro Thập niên 80", "Grunge Thập niên 90", "Tiệc bãi biển", "Lướt sóng", "Khám phá đô thị (Urban Exploration)", "Trận đấu Dance Battle", "Năng lượng Tuổi trẻ", "Lễ hội bột màu Color Run", "Thể thao mạo hiểm (Extreme Sports)", "Phong cách Cyberpunk năng động", "Chuyến đi phượt (Road Trip)", "Khoảnh khắc tự do, tự tại", "Tiệc hồ bơi mùa hè", "Năng lượng Sân vận động", "Đua xe đường phố", "Phong cách K-Pop", "Hiệu ứng Glitch & Distortion", "Vui nhộn & Tinh nghịch", "Đồ họa Comic/Truyện tranh", "Bùng nổ Năng lượng", "Leo núi trong nhà", "Phong cách Athleisure", "Chuyển động Dừng hình (Freeze-frame)", "Đồ họa Chuyển động (Motion Graphics)", "Năng lượng tích cực", "Khoảnh khắc tự phát", "Phong cách Skater", "Nền gạch & bê tông đô thị", "Ánh sáng loe (Lens Flare)", "Thời trang Oversized", "Trò chơi điện tử Arcade", "Bữa tiệc tại gia", "Nhảy Breakdance", "Tinh thần nổi loạn", "Video tua nhanh (Time-lapse)", "Chụp ảnh góc rộng (Fisheye)", "Phong cách Tối giản trẻ trung", "Đồ uống năng lượng"
    ],
    "Thiên nhiên & Tự nhiên": [
        "Gần gũi Thiên nhiên", "Nguyên liệu Tinh khiết", "Phong cách Mộc mạc", "Ánh nắng Ban mai", "Vẻ đẹp Hữu cơ", "Thế giới Dưới nước", "Bình minh trên đỉnh núi", "Rừng lá mùa thu", "Mùa hoa Anh đào", "Cánh đồng Oải hương", "Vịnh phát quang sinh học", "Hang động Pha lê", "Thác nước hùng vĩ", "Hồ nước tĩnh lặng", "Cồn cát sa mạc", "Rừng rậm nhiệt đới", "Tảng băng trôi", "Rạn san hô đầy màu sắc", "Đồng cỏ giờ vàng", "Cánh đồng hoa dại", "Phong cảnh Núi lửa", "Rừng cây Gỗ đỏ", "Bắc Cực quang", "Sản phẩm và Giọt nước", "Vẻ đẹp của Gỗ", "Hòa mình vào Cây cỏ", "Đá và Khoáng chất", "Phong cách Eco-friendly", "Chiếu sáng tự nhiên", "Cận cảnh Côn trùng", "Thế giới của Nấm", "Bờ biển hoang sơ", "Sương mù buổi sáng", "Bầu trời đầy sao", "Vườn Bách thảo", "Cánh đồng Lúa mì", "Suối nước nóng tự nhiên", "Vườn Zen Nhật Bản", "Phong cảnh Đồng quê", "Hiệu ứng Ánh sáng xuyên qua tán lá", "Bãi biển Cát đen", "Cầu vồng sau mưa", "Tổ ong & Mật ong", "Vườn treo Babylon", "Vẻ đẹp hoang dã (Untamed)", "Kết cấu từ Lá cây", "Cánh đồng Trà xanh", "Hoa nở tua nhanh (Time-lapse)", "Sông băng", "Giọt sương trên lá"
    ],
    "Công nghệ & Tương lai": [
        "Công nghệ Tương lai", "Hiệu ứng Neon & Cyberpunk", "Giao diện Kỹ thuật số", "Khoa học Viễn tưởng", "Robot & AI", "Giao diện Hologram", "Thực tế ảo (VR)", "Thực tế tăng cường (AR)", "Ô tô bay", "Khám phá Không gian", "Thành phố Thông minh", "Thế giới trong Matrix", "Hiệu ứng Glitch nghệ thuật", "Hình ảnh hóa Dữ liệu", "Kiến trúc Tương lai", "Phòng thí nghiệm Sci-Fi", "Nội thất Tàu vũ trụ", "Hành tinh Ngoài Trái Đất", "Công nghệ Hậu tận thế", "Đường cao tốc Ánh sáng", "Vật liệu Thông minh", "Giao diện Người-Máy", "Mạch điện tử phát sáng", "Thế giới Robot", "Công nghệ Nano", "In 3D tiên tiến", "Thành phố dưới nước", "Năng lượng Plasma", "Cổng không gian (Portal)", "Trường năng lượng", "Dịch chuyển tức thời", "Phòng điều khiển Tương lai", "Vũ khí Laser", "Đồ họa Vector phát sáng", "Đô thị Dystopian", "Mạng lưới thần kinh nhân tạo", "Trí tuệ nhân tạo có tri giác", "Thế giới game nhập vai", "Cơ thể nửa người nửa máy (Cyborg)", "Công nghệ Sinh học", "Thành phố không trọng lực", "Tòa nhà chọc trời tương lai", "Phương tiện tự lái", "Nền tinh vân vũ trụ", "Đường hầm siêu tốc (Hyperloop)", "Kết cấu Kim loại lỏng", "Áo giáp Công nghệ cao", "Phòng thí nghiệm Di truyền học", "Thành phố bay", "Chiến tranh Giữa các vì sao"
    ],
    "Ấm cúng & Gần gũi": [
        "Ấm cúng & Thân mật", "Khoảnh khắc Gia đình", "Cảm giác Hoài niệm", "Vị ngon Nhà làm", "Tình bạn Thân thiết", "Phòng khách có Lò sưởi", "Quán cafe sách", "Bếp lửa Trại", "Chăn len & Ca cao nóng", "Cửa sổ ngày mưa", "Ánh sáng Vàng ấm", "Phong cách Hygge (Đan Mạch)", "Bữa ăn tối gia đình", "Ngôi nhà gỗ trong rừng", "Kỷ niệm tuổi thơ", "Thư viết tay", "Giáng sinh ấm áp", "Căn bếp đồng quê", "Vườn sau nhà", "Cuộc dã ngoại", "Đọc sách bên cửa sổ", "Buổi chiều Chủ nhật lười biếng", "Tự tay làm (DIY)", "Tình yêu Thú cưng", "Nướng bánh tại nhà", "Ánh nến lung linh", "Vòng tay ôm", "Quán trà nhỏ", "Chợ phiên cuối tuần", "Đan len", "Bài hát Acoustic", "Khung ảnh cũ", "Phong cách Vintage", "Mùi hương của Sách cũ", "Phòng ngủ ấm cúng", "Buổi trà chiều", "Cuộc trò chuyện thân mật", "Nụ cười hạnh phúc", "Khoảnh khắc đời thường", "Sự chăm sóc", "Bữa sáng trên giường", "Cảm giác an toàn", "Mùi cà phê buổi sáng", "Âm nhạc nhẹ nhàng", "Chuyến đi về quê", "Ngôi làng nhỏ yên bình", "Album ảnh gia đình", "Sự sum vầy", "Tình làng nghĩa xóm", "Cảm giác thuộc về"
    ],
    "Hài hước & Sáng tạo": [
        "Hài hước & Bất ngờ", "Nhân vật Hoạt hình", "Tình huống Trớ trêu", "Phong cách Kỳ quặc", "Kể chuyện Vui nhộn", "Sản phẩm có cảm xúc", "Thú cưng biết nói", "Tỷ lệ Phóng đại", "Logic ngược đời", "Hiệu ứng Stop-motion hài hước", "Pha trộn Kỳ lạ", "Nhân hóa Đồ vật", "Tình huống 'dở khóc dở cười'", "Pha Chế nhạo (Parody)", "Vũ điệu Ngớ ngẩn", "Thử thách Thất bại", "Biểu cảm Khuôn mặt cường điệu", "Thế giới Kẹo ngọt", "Hành động vụng về", "Cuộc đối thoại Vô lý", "Thí nghiệm Khoa học điên rồ", "Người ngoài hành tinh thân thiện", "Siêu anh hùng 'bá đạo'", "Giấc mơ Kỳ lạ", "Sự kiện Bất thường", "Máy móc Rube Goldberg", "Cảnh phim câm", "Đồ vật bay lượn", "Thế giới thu nhỏ", "Hiệu ứng âm thanh vui nhộn", "Sự hoán đổi cơ thể", "Cuộc phiêu lưu của Thức ăn", "Phong cách vẽ tay nguệch ngoạc", "Sự kiện Lịch sử 'chế'", "Câu chuyện cổ tích hiện đại", "Đối thoại của các Bức tượng", "Phép thuật 'lỗi'", "Hành động lén lút hài hước", "Cuộc rượt đuổi vui nhộn", "Sự hiểu lầm tai hại", "Bữa tiệc của Động vật", "Cảnh quay ẩn (Hidden Camera)", "Sự tương phản hài hước", "Lời thoại châm biếm", "Hành động lặp lại (Loop)", "Sự cố trang phục", "Cuộc thi kỳ lạ", "Phản ứng thái quá", "Giọng kể chuyện hài hước", "Cái kết bất ngờ"
    ],
    "Nghệ thuật & Độc đáo": [
        "Stop-motion Sáng tạo", "Màu nước & Mực loang", "Hiệu ứng Ảo ảnh", "Vẽ tay (Hand-drawn)", "Điêu khắc & Sắp đặt", "Nghệ thuật Gấp giấy (Origami)", "Tranh cắt dán (Collage)", "Nghệ thuật đường nét (Line Art)", "Chồng ảnh (Double Exposure)", "Nghệ thuật Khảm (Mosaic)", "Tranh sơn dầu Cổ điển", "Phong cách Siêu thực", "Nghệ thuật Phun sơn (Airbrush)", "Hiệu ứng Tan biến (Dispersion)", "Vẽ tranh bằng Ánh sáng", "Nghệ thuật đối xứng", "Phong cách 'Low Poly'", "Tranh tường (Mural)", "Nghệ thuật Chữ (Typography)", "Nền kết cấu Vết sơn", "Hiệu ứng Kính vạn hoa", "Nghệ thuật X-ray", "Phong cách Pop Art của Andy Warhol", "Nghệ thuật Trừu tượng", "Sản phẩm trong khối Hổ phách", "Thế giới trong chai", "Nghệ thuật sắp đặt từ thực phẩm", "Vẽ trên cơ thể (Body Painting)", "Phong cách Lập thể (Cubism)", "Nghệ thuật Đổ bóng", "Nghệ thuật từ Đồ tái chế", "Tranh sơn mài", "Hiệu ứng Nhiễu ảnh (Glitch)", "Thế giới được dệt bằng len", "Nghệ thuật Gothic", "Tác phẩm Điêu khắc băng", "Phong cách Steampunk", "Tranh thủy mặc", "Sản phẩm hóa thành Cát", "Sự biến dạng nghệ thuật", "Nghệ thuật Sợi chỉ", "Tranh trên kính màu", "Phong cách Baroque", "Nghệ thuật Đương đại", "Chuyển động của Vải lụa", "Hiệu ứng Phim ảnh cũ", "Nghệ thuật Tối giản", "Sự phản chiếu trong Gương vỡ", "Nghệ thuật Động học (Kinetic Art)", "Thế giới đảo ngược"
    ],
    "Chuyên nghiệp & Tin cậy": [
        "Giải pháp Chuyên nghiệp", "Đồ họa Thông tin", "Phỏng vấn Chuyên gia", "Công sở Hiện đại", "Thành công & Đẳng cấp", "Bắt tay Thỏa thuận", "Bài thuyết trình Ấn tượng", "Đội ngũ Đoàn kết", "Góc nhìn của Lãnh đạo", "Biểu đồ Tăng trưởng", "Kiến trúc Doanh nghiệp", "Phòng họp Công nghệ cao", "Sự tập trung cao độ", "Quy trình Sản xuất", "Chứng nhận Chất lượng", "Dịch vụ Khách hàng", "Giao diện Người dùng (UI/UX)", "An ninh & Bảo mật", "Sự chính xác & Chi tiết", "Nghiên cứu & Phát triển", "Tòa nhà Văn phòng hiện đại", "Hình ảnh 'Trước & Sau'", "Cái nhìn sâu sắc từ Dữ liệu", "Sự minh bạch", "Mạng lưới Toàn cầu", "Chuyên gia trong phòng thí nghiệm", "Công nghệ Sạch", "Sự đổi mới", "Hiệu suất Tối ưu", "Bàn làm việc Gọn gàng", "Kiến trúc sư & Bản vẽ", "Luật sư & Tòa án", "Bác sĩ & Bệnh viện", "Sự bền vững", "Giải thưởng & Vinh danh", "Lịch sử & Di sản thương hiệu", "Quy trình làm việc hiệu quả", "Tầm nhìn Tương lai", "Sự hài lòng của Khách hàng", "Cam kết lâu dài", "Xây dựng Niềm tin", "Cấu trúc Tinh thể", "Sơ đồ Mạch điện", "Sự hoàn hảo", "Đối tác Chiến lược", "Phong cách Tối giản công sở", "Sự ngăn nắp, có tổ chức", "Đồng phục Chuyên nghiệp", "Trí tuệ & Kinh nghiệm", "Sự tinh thông"
    ],
    "Sử thi & Điện ảnh": [
        "Cảnh quay Điện ảnh", "Hiệu ứng Slow-motion", "Phong cách Sử thi", "Khung cảnh Rộng lớn", "Trailer Phim Hành động", "Ánh sáng điện ảnh (Cinematic Lighting)", "Góc máy Rộng (Wide-angle)", "Cảnh quay từ trên cao (Drone shot)", "Bầu không khí Bí ẩn", "Hành trình của Người hùng", "Cuộc rượt đuổi Kịch tính", "Vụ nổ Lớn", "Phong cách Phim Noir", "Thế giới Hậu tận thế", "Cuộc chiến Lịch sử", "Khám phá Tàn tích cổ", "Bối cảnh Viễn Tây", "Cảnh trong Cơn bão", "Ánh sáng Loe Αναμορφικό (Anamorphic)", "Màu phim (Film Look)", "Đối đầu Kịch tính", "Khoảnh khắc Lịch sử", "Sự im lặng trước cơn bão", "Cảnh quay một lần (One-shot)", "Bí mật được tiết lộ", "Huyền thoại & Thần thoại", "Phong cách phim của Christopher Nolan", "Phong cách phim của Wes Anderson", "Chiến binh Samurai", "Đấu trường La Mã", "Hiệp sĩ Bàn tròn", "Cướp biển Caribê", "Khung cảnh hùng vĩ của Chúa tể những chiếc nhẫn", "Thế giới Phép thuật Harry Potter", "Cuộc chiến giữa các vì sao (Star Wars)", "Thế giới Cyberpunk của Blade Runner", "Ma trận (The Matrix)", "Thế giới của các vị thần", "Ngày tận thế", "Cuộc đổ bộ bãi biển", "Điệp viên 007", "Khám phá Kho báu", "Sự trỗi dậy của một Đế chế", "Cảnh đăng quang", "Lâu đài Trung cổ", "Cảnh chiến đấu hoành tráng", "Sự hy sinh cao cả", "Hành trình Vượt khó", "Cảnh quay ngược thời gian"
    ],
    "Ẩm thực & Ngon miệng": [
        "Cận cảnh Món ăn (Macro)", "Hiệu ứng \"Food-porn\"", "Nguyên liệu Bay lượn", "Bàn tiệc Thịnh soạn", "Bí quyết Bếp trưởng", "Sô cô la tan chảy", "Hơi nước nóng bốc lên", "Rót mật ong óng ả", "Rắc bột mịn màng", "Trái cây tươi mọng nước", "Lát cắt hoàn hảo", "Phô mai kéo sợi", "Nước sốt sánh mịn", "Bọt khí trong đồ uống", "Vết nướng xém cạnh", "Bữa sáng thịnh soạn", "Bữa tối lãng mạn dưới nến", "Tiệc nướng BBQ ngoài trời", "Ẩm thực đường phố", "Nhà bếp chuyên nghiệp", "Nguyên liệu tươi từ nông trại", "Hải sản tươi sống", "Bánh ngọt & Tráng miệng", "Pha chế Cocktail nghệ thuật", "Nghệ thuật Latte Art", "Món ăn được trang trí đẹp mắt", "Sự kết hợp màu sắc trong món ăn", "Chợ nông sản địa phương", "Vườn rau hữu cơ", "Dàn đầu bếp chuyên nghiệp", "Sự tương phản kết cấu", "Món ăn đang được nấu trên lửa", "Đá viên và đồ uống mát lạnh", "Hương vị bùng nổ (tưởng tượng)", "Quy trình làm bánh mì thủ công", "Nghệ thuật cuộn Sushi", "Bữa ăn gia đình ấm cúng", "Dã ngoại với giỏ thức ăn", "Kẹo ngọt đầy màu sắc", "Gia vị & Thảo mộc", "Ly rượu vang sóng sánh", "Cảnh nấu ăn theo kiểu ASMR", "Lớp kem phủ mịn mượt", "Món ăn trong làn khói", "Sự tươi mới của rau xanh", "Bàn ăn phong cách Flatlay", "Quy trình chế biến từ A-Z", "Món ăn đặc sản vùng miền", "Sự kết hợp ẩm thực Á-Âu", "Món ăn dành cho người sành ăn (Gourmet)"
    ]
};

const tvcStylePromptAdditions: { [key: string]: string } = {
    // Người mẫu AI
    "Nữ Doanh nhân Thành đạt": ", với một người mẫu nữ là doanh nhân thành đạt, người Việt Nam, thần thái tự tin và chuyên nghiệp",
    "Nữ Vận động viên Yoga": ", với một người mẫu nữ là vận động viên yoga, người Việt Nam, dáng vẻ khỏe khoắn, dẻo dai và bình yên",
    "Nữ Người mẫu Fitness": ", với một người mẫu nữ fitness, người Việt Nam, cơ thể săn chắc, khỏe mạnh và tràn đầy năng lượng",
    "Nữ Nghệ sĩ Sáng tạo": ", với một người mẫu nữ là nghệ sĩ, người Việt Nam, phong cách độc đáo, tự do và có chút lãng mạn",
    "Nữ Bác sĩ Tận tâm": ", với một người mẫu nữ là bác sĩ, người Việt Nam, tạo hình ảnh đáng tin cậy, thông minh và tận tâm",
    "Nữ Sinh viên Năng động": ", với một người mẫu nữ là sinh viên, người Việt Nam, trẻ trung, năng động và thông minh",
    "Nữ Game thủ Chuyên nghiệp": ", với một người mẫu nữ là game thủ, người Việt Nam, tập trung, cá tính và hiện đại",
    "Nữ DJ Sôi động": ", với một người mẫu nữ là DJ, người Việt Nam, khuấy động, tràn đầy năng lượng trong ánh đèn sân khấu",
    "Nữ Đầu bếp Tài năng": ", với một người mẫu nữ là đầu bếp, người Việt Nam, chuyên nghiệp, sạch sẽ và đầy đam mê",
    "Nữ Họa sĩ Mộng mơ": ", với một người mẫu nữ là họa sĩ, người Việt Nam, có tâm hồn nghệ thuật, bay bổng",
    "Nữ Nhạc công Cổ điển": ", với một người mẫu nữ là nhạc công, người Việt Nam, chơi violin hoặc piano, thanh lịch và quý phái",
    "Nữ Phi công Bản lĩnh": ", với một người mẫu nữ là phi công, người Việt Nam, trong bộ đồng phục, mạnh mẽ và tự tin",
    "Nữ Cảnh sát Nghiêm nghị": ", với một người mẫu nữ là cảnh sát, người Việt Nam, trong bộ đồng phục, toát lên vẻ nghiêm nghị và đáng tin cậy",
    "Nữ Lính cứu hỏa Dũng cảm": ", với một người mẫu nữ là lính cứu hỏa, người Việt Nam, trang bị đầy đủ, ánh mắt kiên định",
    "Nữ Nông dân Hiện đại": ", với một người mẫu nữ là nông dân, người Việt Nam, làm việc trên cánh đồng công nghệ cao, vui tươi và khỏe khoắn",
    "Nữ Vận động viên Bơi lội": ", với một người mẫu nữ là vận động viên bơi lội, người Việt Nam, thân hình khỏe khoắn, sẵn sàng xuất phát",
    "Nữ Vũ công Ballet": ", với một người mẫu nữ là vũ công ballet, người Việt Nam, uyển chuyển và thanh thoát",
    "Nữ Nhà khoa học": ", với một người mẫu nữ là nhà khoa học, người Việt Nam, trong phòng thí nghiệm, thông minh và tập trung",
    "Nữ Kỹ sư Thông minh": ", với một người mẫu nữ là kỹ sư, người Việt Nam, làm việc tại công trường hoặc nhà máy, năng động",
    "Nữ Kiến trúc sư": ", với một người mẫu nữ là kiến trúc sư, người Việt Nam, bên cạnh bản vẽ hoặc mô hình, sáng tạo",
    "Nữ Tiếp viên Hàng không": ", với một người mẫu nữ là tiếp viên hàng không, người Việt Nam, thân thiện và chuyên nghiệp",
    "Nữ Hướng dẫn viên Du lịch": ", với một người mẫu nữ là hướng dẫn viên du lịch, người Việt Nam, năng động, am hiểu và vui vẻ",
    "Nữ Bartender Phong cách": ", với một người mẫu nữ là bartender, người Việt Nam, pha chế cocktail điêu luyện",
    "Nữ Thợ xăm Cá tính": ", với một người mẫu nữ là thợ xăm, người Việt Nam, phong cách cá tính, đang sáng tạo nghệ thuật",
    "Nữ Stylist Thời trang": ", với một người mẫu nữ là stylist, người Việt Nam, có gu ăn mặc sành điệu, đang phối đồ",
    "Nam Doanh nhân Lịch lãm": ", với một người mẫu nam là doanh nhân lịch lãm, người Việt Nam, mặc vest sang trọng, phong thái đĩnh đạc",
    "Nam Vận động viên Gym": ", với một người mẫu nam gym, người Việt Nam, thân hình vạm vỡ, cơ bắp cuồn cuộn, thể hiện sức mạnh",
    "Nam Người mẫu Thời trang": ", với một người mẫu nam thời trang cao cấp (high-fashion), người Việt Nam, gương mặt góc cạnh và phong cách ấn tượng",
    "Nam Nghệ sĩ Lãng tử": ", với một người mẫu nam là nghệ sĩ, người Việt Nam, mái tóc dài, phong trần và có chiều sâu",
    "Nam Bác sĩ Chuyên nghiệp": ", với một người mẫu nam là bác sĩ hoặc chuyên gia, người Việt Nam, tạo hình ảnh thông thái và đáng tin cậy",
    "Nam Sinh viên Trí thức": ", với một người mẫu nam là sinh viên, người Việt Nam, đeo kính, vẻ ngoài trí thức và hiền lành",
    "Nam Game thủ Tập trung": ", với một người mẫu nam là game thủ, người Việt Nam, đeo tai nghe, tập trung cao độ vào màn hình",
    "Nam DJ Khuấy động": ", với một người mẫu nam là DJ, người Việt Nam, tự tin làm chủ sân khấu, khuấy động đám đông",
    "Nam Đầu bếp Sáng tạo": ", với một người mẫu nam là đầu bếp, người Việt Nam, đang trang trí món ăn một cách tỉ mỉ",
    "Nam Họa sĩ Đường phố": ", với một người mẫu nam là họa sĩ đường phố (graffiti artist), người Việt Nam, bụi bặm và tài năng",
    "Nam Nhạc công Rock": ", với một người mẫu nam là nhạc công rock, người Việt Nam, chơi guitar điện, đầy đam mê và máu lửa",
    "Nam Phi công Lịch lãm": ", với một người mẫu nam là phi công, người Việt Nam, tự tin trong buồng lái",
    "Nam Cảnh sát Mạnh mẽ": ", với một người mẫu nam là cảnh sát, người Việt Nam, trong bộ đồng phục, dáng vẻ mạnh mẽ, bảo vệ",
    "Nam Lính cứu hỏa Kiên cường": ", với một người mẫu nam là lính cứu hỏa, người Việt Nam, gương mặt lấm lem nhưng ánh mắt kiên cường",
    "Nam Nông dân Chân chất": ", với một người mẫu nam là nông dân, người Việt Nam, nụ cười hiền hậu, giữa cánh đồng lúa",
    "Nam Vận động viên Bóng đá": ", với một người mẫu nam là vận động viên bóng đá, người Việt Nam, trong trang phục thi đấu, đầy quyết tâm",
    "Nam Vũ công Hip-hop": ", với một người mẫu nam là vũ công hip-hop, người Việt Nam, thực hiện một động tác vũ đạo ấn tượng",
    "Nam Nhà khoa học": ", với một người mẫu nam là nhà khoa học, người Việt Nam, chăm chú quan sát ống nghiệm",
    "Nam Kỹ sư Sáng tạo": ", với một người mẫu nam là kỹ sư, người Việt Nam, đội mũ bảo hộ, làm việc với máy móc hiện đại",
    "Nam Kiến trúc sư": ", với một người mẫu nam là kiến trúc sư, người Việt Nam, tự tin trình bày về một dự án lớn",
    "Nam Tiếp viên Hàng không": ", với một người mẫu nam là tiếp viên hàng không, người Việt Nam, lịch lãm và thân thiện",
    "Nam Hướng dẫn viên Du lịch": ", với một người mẫu nam là hướng dẫn viên du lịch, người Việt Nam, nhiệt tình, am hiểu văn hóa bản địa",
    "Nam Barista Chuyên nghiệp": ", với một người mẫu nam là barista, người Việt Nam, đang tạo hình nghệ thuật trên ly latte",
    "Nam Thợ mộc Lành nghề": ", với một người mẫu nam là thợ mộc, người Việt Nam, tập trung vào tác phẩm gỗ của mình",
    "Nam Stylist Cá tính": ", với một người mẫu nam là stylist, người Việt Nam, có phong cách thời trang độc đáo, ấn tượng",

    // Sang trọng & Cao cấp
    "Sang trọng & Đẳng cấp": ", theo phong cách quảng cáo xa xỉ, tập trung vào chi tiết tinh xảo và vật liệu cao cấp",
    "Tối giản & Tinh tế": ", theo phong cách tối giản, sạch sẽ với không gian âm và ánh sáng dịu nhẹ",
    "Kim loại quý & Đá quý": ", đặt sản phẩm giữa các yếu tố kim loại quý như vàng, bạc và đá quý lấp lánh",
    "Vẻ đẹp Vượt thời gian": ", trong một bối cảnh cổ điển, vượt thời gian, mang lại cảm giác sang trọng và bền vững",
    "Trải nghiệm Độc quyền": ", tái hiện một trải nghiệm độc quyền, cao cấp chỉ dành cho số ít",
    "Nội thất Cung điện Hoàng gia": ", trong bối cảnh nội thất của một cung điện hoàng gia lộng lẫy",
    "Phong cách Art Deco": ", với các họa tiết hình học và sự sang trọng của phong cách Art Deco",
    "Tiệc du thuyền sang trọng": ", trên một chiếc du thuyền sang trọng giữa biển khơi",
    "Sự kiện Thảm đỏ": ", sản phẩm xuất hiện tại một sự kiện thảm đỏ danh giá",
    "Dòng chảy Lụa & Satin": ", sản phẩm được bao bọc bởi những dải lụa và satin mềm mại",
    "Bữa tiệc Black Tie": ", trong không khí trang trọng của một bữa tiệc black tie",
    "Vẻ đẹp Cổ điển (Antique)": ", đặt cạnh những đồ vật cổ tinh xảo, mang vẻ đẹp cổ điển",
    "Biệt thự Hiện đại": ", trong một căn biệt thự hiện đại với kiến trúc tối giản và sang trọng",
    "Ánh sáng Pha lê": ", được chiếu sáng bởi ánh đèn chùm pha lê lấp lánh",
    "Chất liệu Nhung cao cấp": ", trên nền vải nhung cao cấp, làm nổi bật sự mềm mại và sang trọng",
    "Chi tiết Mạ vàng": ", với các chi tiết được mạ vàng tinh xảo và lấp lánh",
    "Bữa tối thượng hạng (Fine Dining)": ", là một phần của một bữa tối thượng hạng tại nhà hàng Michelin",
    "Không gian trưng bày Nghệ thuật": ", được trưng bày như một tác phẩm nghệ thuật trong một gallery",
    "Nội thất máy bay tư nhân": ", bên trong khoang hạng nhất của một chiếc máy bay tư nhân",
    "Bộ sưu tập xe hơi cổ": ", đặt cạnh một bộ sưu tập xe hơi cổ điển đắt giá",
    "Cận cảnh Đồng hồ Thụy Sĩ": ", với sự chính xác và tinh xảo như một chiếc đồng hồ Thụy Sĩ",
    "Quảng cáo Nước hoa cao cấp": ", theo phong cách quảng cáo nước hoa, đầy gợi cảm và bí ẩn",
    "Vẻ đẹp của Đá cẩm thạch": ", trên một bề mặt đá cẩm thạch sang trọng và bóng bẩy",
    "Phong cách Vua chúa": ", mang phong cách của hoàng gia, vua chúa, quyền lực và giàu có",
    "Quầy bar Rượu Cognac & Xì gà": ", trong một quầy bar sang trọng với rượu cognac và xì gà",
    "Trang sức Kim cương": ", lấp lánh và tỏa sáng như những viên kim cương quý giá",
    "Đêm nhạc Opera": ", trong không gian cổ điển và sang trọng của một nhà hát opera",
    "Sân Golf độc quyền": ", trên sân golf của một câu lạc bộ độc quyền và xa xỉ",
    "Trải nghiệm Spa 5 sao": ", mang lại cảm giác thư giãn và sang trọng của một spa 5 sao",
    "Cửa hàng thời trang cao cấp": ", trưng bày trên kệ của một cửa hàng thời trang cao cấp trên đại lộ",
    "Đen & Vàng sang trọng": ", sử dụng hai tông màu đen và vàng để tạo ra sự sang trọng tuyệt đối",
    "Trắng & Bạc tinh khôi": ", sử dụng hai tông màu trắng và bạc để tạo ra vẻ đẹp tinh khôi và cao cấp",
    "Hiệu ứng Ánh kim lỏng": ", với hiệu ứng kim loại lỏng chảy quanh sản phẩm",
    "Họa tiết hình học tinh xảo": ", kết hợp với các họa tiết hình học (geometric) tinh xảo",
    "Da thuộc cao cấp": ", đặt trên nền da thuộc cao cấp, thể hiện sự bền bỉ và sang trọng",
    "Phong cách Gatsby vĩ đại": ", trong không khí xa hoa, lộng lẫy của những năm 1920",
    "Vườn thượng uyển riêng tư": ", trong một khu vườn thượng uyển được cắt tỉa công phu",
    "Kiến trúc Tân cổ điển": ", trong một không gian kiến trúc tân cổ điển với cột và mái vòm",
    "Chất liệu Gỗ quý hiếm": ", làm từ hoặc đặt trên các loại gỗ quý hiếm, vân gỗ đẹp mắt",
    "Ánh sáng mềm mại, khuếch tán": ", sử dụng ánh sáng mềm mại, được khuếch tán để tạo cảm giác nhẹ nhàng, cao cấp",
    "Phong cách Hoàng gia Anh": ", mang phong cách tinh tế và chuẩn mực của hoàng gia Anh",
    "Sự kiện Đua ngựa quý tộc": ", trong bối cảnh của một sự kiện đua ngựa của giới quý tộc",
    "Căn hộ Penthouse view triệu đô": ", trong một căn hộ penthouse nhìn ra toàn cảnh thành phố về đêm",
    "Hầm rượu vang cổ": ", trong một hầm rượu vang cổ với những chai rượu quý hiếm",
    "Phong cách bí ẩn, quyến rũ (Femme Fatale)": ", mang phong cách bí ẩn, quyến rũ và đầy quyền lực",
    "Đơn sắc (Monochrome) cao cấp": ", sử dụng tông màu đơn sắc nhưng vẫn toát lên vẻ sang trọng",
    "Hiệu ứng Khói & Gương": ", kết hợp hiệu ứng khói và gương để tạo ra chiều sâu và sự huyền ảo",
    "Vẻ đẹp điêu khắc": ", sản phẩm có hình dáng như một tác phẩm điêu khắc nghệ thuật",
    "Thời trang Haute Couture": ", theo phong cách của thời trang cao cấp, độc đáo và tinh xảo",
    "Trải nghiệm May đo riêng (Bespoke)": ", mang lại cảm giác độc bản, được thiết kế riêng",

    // Năng động & Trẻ trung
    "Năng động & Thể thao": ", trong một cảnh quay hành động thể thao, thể hiện sự năng động và hiệu suất cao",
    "Chuyển động Tốc độ cao": ", sử dụng kỹ thuật lia máy tốc độ cao và hiệu ứng mờ chuyển động để tạo cảm giác nhanh và mạnh",
    "Âm nhạc Bùng nổ": ", trong một bối cảnh lễ hội âm nhạc hoặc sàn nhảy sôi động",
    "Hành động & Mạo hiểm": ", trong một cảnh hành động mạo hiểm như leo núi, lướt sóng hoặc đua xe",
    "Vũ điệu Màu sắc": ", với hiệu ứng bột màu hoặc chất lỏng màu sắc bùng nổ xung quanh sản phẩm",
    "Phong cách Đường phố (Street Style)": ", theo phong cách thời trang đường phố, cá tính và bụi bặm",
    "Lễ hội Âm nhạc ngoài trời": ", giữa không khí sôi động của một lễ hội âm nhạc ngoài trời như Coachella",
    "Parkour & Freerunning": ", thực hiện những cú nhảy parkour ngoạn mục trong thành phố",
    "Trượt ván & BMX": ", trong một công viên trượt ván với những pha hành động kỹ thuật",
    "Nghệ thuật Graffiti": ", sản phẩm nổi bật trên nền một bức tường graffiti đầy màu sắc",
    "Đèn Neon Thành phố đêm": ", trong ánh đèn neon rực rỡ của thành phố về đêm",
    "Phong cách Pop Art": ", theo phong cách Pop Art, với màu sắc táo bạo và đường nét truyện tranh",
    "Retro Thập niên 80": ", mang phong cách retro của những năm 80, với màu neon và nhạc synth-pop",
    "Grunge Thập niên 90": ", theo phong cách grunge của những năm 90, gai góc và chân thực",
    "Tiệc bãi biển": ", trong một bữa tiệc bãi biển sôi động với bạn bè",
    "Lướt sóng": ", chinh phục những con sóng lớn, thể hiện tinh thần tự do",
    "Khám phá đô thị (Urban Exploration)": ", khám phá những địa điểm bị bỏ hoang, bí ẩn trong thành phố",
    "Trận đấu Dance Battle": ", là tâm điểm của một trận đấu dance battle nảy lửa",
    "Năng lượng Tuổi trẻ": ", toát lên năng lượng, sự nhiệt huyết và tinh thần của tuổi trẻ",
    "Lễ hội bột màu Color Run": ", trong không khí vui tươi của lễ hội bột màu",
    "Thể thao mạo hiểm (Extreme Sports)": ", gắn liền với các môn thể thao mạo hiểm như nhảy dù, trượt tuyết",
    "Phong cách Cyberpunk năng động": ", trong một thế giới cyberpunk nhưng tập trung vào hành động và tốc độ",
    "Chuyến đi phượt (Road Trip)": ", là người bạn đồng hành trong một chuyến đi phượt ngẫu hứng",
    "Khoảnh khắc tự do, tự tại": ", nắm bắt khoảnh khắc tự do, không ràng buộc",
    "Tiệc hồ bơi mùa hè": ", trong một bữa tiệc hồ bơi mát mẻ và vui nhộn",
    "Năng lượng Sân vận động": ", giữa tiếng hò reo cuồng nhiệt của một sân vận động",
    "Đua xe đường phố": ", trong một cuộc đua xe đường phố đầy kịch tính",
    "Phong cách K-Pop": ", theo phong cách MV K-Pop, với vũ đạo và màu sắc ấn tượng",
    "Hiệu ứng Glitch & Distortion": ", sử dụng hiệu ứng glitch (nhiễu kỹ thuật số) để tạo sự cá tính",
    "Vui nhộn & Tinh nghịch": ", mang tinh thần vui nhộn, tinh nghịch và có chút phá cách",
    "Đồ họa Comic/Truyện tranh": ", với các hiệu ứng và khung hình như trong một cuốn truyện tranh",
    "Bùng nổ Năng lượng": ", tạo ra một vụ nổ năng lượng, màu sắc xung quanh sản phẩm",
    "Leo núi trong nhà": ", trong một phòng tập leo núi nhân tạo đầy thử thách",
    "Phong cách Athleisure": ", theo phong cách thời trang athleisure, khỏe khoắn và thoải mái",
    "Chuyển động Dừng hình (Freeze-frame)": ", bắt trọn một khoảnh khắc hành động ấn tượng bằng kỹ thuật dừng hình",
    "Đồ họa Chuyển động (Motion Graphics)": ", kết hợp với các yếu tố đồ họa chuyển động trẻ trung, hiện đại",
    "Năng lượng tích cực": ", lan tỏa năng lượng tích cực, lạc quan và yêu đời",
    "Khoảnh khắc tự phát": ", ghi lại những khoảnh khắc tự nhiên, không sắp đặt",
    "Phong cách Skater": ", gắn liền với văn hóa trượt ván, tự do và phóng khoáng",
    "Nền gạch & bê tông đô thị": ", nổi bật trên nền gạch, bê tông của không gian đô thị",
    "Ánh sáng loe (Lens Flare)": ", sử dụng hiệu ứng lóe sáng ống kính để tạo cảm giác năng động",
    "Thời trang Oversized": ", theo xu hướng thời trang oversized, thoải mái và cá tính",
    "Trò chơi điện tử Arcade": ", trong không gian đầy màu sắc của một khu trò chơi arcade cổ điển",
    "Bữa tiệc tại gia": ", là trung tâm của một bữa tiệc tại gia sôi động",
    "Nhảy Breakdance": ", kết hợp với những động tác breakdance mạnh mẽ và điêu luyện",
    "Tinh thần nổi loạn": ", thể hiện tinh thần nổi loạn, phá vỡ quy tắc của tuổi trẻ",
    "Video tua nhanh (Time-lapse)": ", sử dụng kỹ thuật tua nhanh thời gian để thể hiện sự hối hả của cuộc sống",
    "Chụp ảnh góc rộng (Fisheye)": ", sử dụng ống kính mắt cá để tạo hiệu ứng hình ảnh độc đáo, vui nhộn",
    "Phong cách Tối giản trẻ trung": ", theo phong cách tối giản nhưng với màu sắc và đường nét trẻ trung",
    "Đồ uống năng lượng": ", mang lại cảm giác sảng khoái, bùng nổ như một lon nước tăng lực",
    
    // Thiên nhiên & Tự nhiên
    "Gần gũi Thiên nhiên": ", đặt sản phẩm trong một khung cảnh thiên nhiên hùng vĩ như rừng rậm, thác nước, hoặc bãi biển",
    "Nguyên liệu Tinh khiết": ", tập trung vào các nguyên liệu tự nhiên, tinh khiết tạo nên sản phẩm",
    "Phong cách Mộc mạc": ", trong một bối cảnh mộc mạc, gần gũi như một ngôi nhà gỗ hoặc một khu vườn quê",
    "Ánh nắng Ban mai": ", được chiếu sáng bởi ánh nắng ban mai ấm áp, tạo cảm giác tươi mới và tràn đầy sức sống",
    "Vẻ đẹp Hữu cơ": ", với các yếu tố hữu cơ, tự nhiên và hình dáng mềm mại",
    "Thế giới Dưới nước": ", chìm trong thế giới dưới nước huyền ảo với san hô và sinh vật biển",
    "Bình minh trên đỉnh núi": ", đón ánh bình minh đầu tiên trên đỉnh núi cao",
    "Rừng lá mùa thu": ", giữa khung cảnh lãng mạn của một khu rừng lá vàng, lá đỏ mùa thu",
    "Mùa hoa Anh đào": ", dưới những tán hoa anh đào nở rộ lãng mạn",
    "Cánh đồng Oải hương": ", giữa cánh đồng hoa oải hương tím ngát trải dài đến tận chân trời",
    "Vịnh phát quang sinh học": ", trong làn nước phát quang sinh học kỳ ảo vào ban đêm",
    "Hang động Pha lê": ", bên trong một hang động pha lê lấp lánh và huyền bí",
    "Thác nước hùng vĩ": ", cảm nhận sức mạnh của thiên nhiên dưới một thác nước hùng vĩ",
    "Hồ nước tĩnh lặng": ", phản chiếu trên mặt hồ phẳng lặng như gương",
    "Cồn cát sa mạc": ", trên những cồn cát mênh mông của sa mạc",
    "Rừng rậm nhiệt đới": ", khám phá hệ sinh thái đa dạng của một khu rừng rậm nhiệt đới",
    "Tảng băng trôi": ", trên hoặc bên cạnh một tảng băng trôi khổng lồ ở vùng cực",
    "Rạn san hô đầy màu sắc": ", bơi lượn giữa một rạn san hô đầy màu sắc và sức sống",
    "Đồng cỏ giờ vàng": ", trên một đồng cỏ bao la trong ánh nắng vàng của hoàng hôn",
    "Cánh đồng hoa dại": ", giữa một cánh đồng hoa dại rực rỡ sắc màu",
    "Phong cảnh Núi lửa": ", trên một vùng đất được hình thành từ dung nham núi lửa",
    "Rừng cây Gỗ đỏ": ", đứng giữa những cây gỗ đỏ khổng lồ, cao vút",
    "Bắc Cực quang": ", dưới bầu trời đêm kỳ ảo của hiện tượng Bắc Cực quang",
    "Sản phẩm và Giọt nước": ", cận cảnh sản phẩm với những giọt nước tinh khiết đọng lại",
    "Vẻ đẹp của Gỗ": ", làm nổi bật vẻ đẹp tự nhiên của vân gỗ",
    "Hòa mình vào Cây cỏ": ", sản phẩm được đặt giữa cây cỏ xanh tươi, hòa mình vào thiên nhiên",
    "Đá và Khoáng chất": ", đặt cạnh những viên đá và khoáng chất có hình thù, màu sắc độc đáo",
    "Phong cách Eco-friendly": ", nhấn mạnh yếu tố thân thiện với môi trường, bền vững",
    "Chiếu sáng tự nhiên": ", sử dụng hoàn toàn ánh sáng tự nhiên để tạo ra hình ảnh chân thực",
    "Cận cảnh Côn trùng": ", cận cảnh sản phẩm với một con côn trùng đẹp như bướm, chuồn chuồn",
    "Thế giới của Nấm": ", trong một thế giới nấm kỳ ảo, đầy màu sắc",
    "Bờ biển hoang sơ": ", trên một bờ biển hoang sơ, không dấu chân người",
    "Sương mù buổi sáng": ", ẩn hiện trong làn sương mù huyền ảo của buổi sáng",
    "Bầu trời đầy sao": ", dưới một bầu trời đêm đầy sao và dải ngân hà",
    "Vườn Bách thảo": ", trong một khu vườn bách thảo với nhiều loài cây quý hiếm",
    "Cánh đồng Lúa mì": ", giữa một cánh đồng lúa mì vàng óng trước mùa thu hoạch",
    "Suối nước nóng tự nhiên": ", thư giãn bên một suối nước nóng tự nhiên bốc hơi",
    "Vườn Zen Nhật Bản": ", trong sự tĩnh lặng và cân bằng của một khu vườn Zen Nhật Bản",
    "Phong cảnh Đồng quê": ", trong một khung cảnh đồng quê yên bình với nhà tranh, cánh đồng",
    "Hiệu ứng Ánh sáng xuyên qua tán lá": ", với những tia nắng xuyên qua tán lá cây, tạo hiệu ứng đẹp mắt",
    "Bãi biển Cát đen": ", trên một bãi biển cát đen độc đáo ở Iceland",
    "Cầu vồng sau mưa": ", xuất hiện cùng với cầu vồng sau cơn mưa",
    "Tổ ong & Mật ong": ", liên quan đến hình ảnh tổ ong và dòng mật ong vàng óng",
    "Vườn treo Babylon": ", trong một khu vườn treo huyền thoại, xanh tươi và kỳ vĩ",
    "Vẻ đẹp hoang dã (Untamed)": ", thể hiện vẻ đẹp hoang dã, không bị thuần hóa của thiên nhiên",
    "Kết cấu từ Lá cây": ", cận cảnh kết cấu của lá cây, gân lá",
    "Cánh đồng Trà xanh": ", trên một đồi chè xanh mướt, bát ngát",
    "Hoa nở tua nhanh (Time-lapse)": ", mô phỏng quá trình một bông hoa nở bằng hiệu ứng time-lapse",
    "Sông băng": ", trong khung cảnh hùng vĩ của một dòng sông băng",
    "Giọt sương trên lá": ", cận cảnh một giọt sương long lanh trên chiếc lá vào buổi sáng",

    // Công nghệ & Tương lai
    "Công nghệ Tương lai": ", trong một bối cảnh tương lai, công nghệ cao với các yếu tố holographic và giao diện tối tân",
    "Hiệu ứng Neon & Cyberpunk": ", trong một thành phố cyberpunk ban đêm với ánh đèn neon rực rỡ",
    "Giao diện Kỹ thuật số": ", sản phẩm tương tác với các giao diện kỹ thuật số, đồ thị và dữ liệu",
    "Khoa học Viễn tưởng": ", trong một bối cảnh khoa học viễn tưởng như trên một con tàu vũ trụ hoặc một hành tinh khác",
    "Robot & AI": ", sản phẩm được lắp ráp hoặc tương tác bởi các cánh tay robot hoặc trí tuệ nhân tạo",
    "Giao diện Hologram": ", sản phẩm được trình chiếu hoặc tương tác với giao diện hologram 3D",
    "Thực tế ảo (VR)": ", trong một không gian thực tế ảo, phá vỡ mọi giới hạn",
    "Thực tế tăng cường (AR)": ", các yếu tố kỹ thuật số xuất hiện trong thế giới thực thông qua công nghệ AR",
    "Ô tô bay": ", trên một con đường trên không với những chiếc ô tô bay",
    "Khám phá Không gian": ", du hành giữa các vì sao, khám phá các hành tinh mới",
    "Thành phố Thông minh": ", trong một thành phố thông minh được kết nối và vận hành bằng AI",
    "Thế giới trong Matrix": ", với những dòng mã màu xanh lá cây rơi xuống như trong phim Ma Trận",
    "Hiệu ứng Glitch nghệ thuật": ", sử dụng hiệu ứng nhiễu, biến dạng kỹ thuật số một cách nghệ thuật",
    "Hình ảnh hóa Dữ liệu": ", sản phẩm được bao quanh bởi những luồng dữ liệu và biểu đồ được hình ảnh hóa",
    "Kiến trúc Tương lai": ", trong một tòa nhà có kiến trúc của tương lai, vượt qua các định luật vật lý",
    "Phòng thí nghiệm Sci-Fi": ", trong một phòng thí nghiệm khoa học viễn tưởng sạch sẽ, tối tân",
    "Nội thất Tàu vũ trụ": ", bên trong một con tàu vũ trụ hiện đại, nhìn ra không gian",
    "Hành tinh Ngoài Trái Đất": ", trên bề mặt của một hành tinh ngoài Trái Đất với phong cảnh kỳ lạ",
    "Công nghệ Hậu tận thế": ", công nghệ được tái chế, lắp ráp trong một thế giới hậu tận thế",
    "Đường cao tốc Ánh sáng": ", di chuyển trên một đường cao tốc làm bằng ánh sáng",
    "Vật liệu Thông minh": ", sản phẩm được làm từ vật liệu thông minh, có khả năng thay đổi hình dạng hoặc màu sắc",
    "Giao diện Người-Máy": ", kết nối trực tiếp với suy nghĩ của con người thông qua giao diện não-máy tính",
    "Mạch điện tử phát sáng": ", các đường mạch điện tử phát sáng chạy trên bề mặt sản phẩm hoặc bối cảnh",
    "Thế giới Robot": ", trong một thế giới nơi robot và con người cùng chung sống",
    "Công nghệ Nano": ", được tạo ra hoặc hoạt động ở cấp độ nano",
    "In 3D tiên tiến": ", sản phẩm được tạo ra từ một máy in 3D tiên tiến",
    "Thành phố dưới nước": ", trong một thành phố mái vòm hiện đại dưới đáy đại dương",
    "Năng lượng Plasma": ", được cung cấp năng lượng bởi các lõi plasma phát sáng",
    "Cổng không gian (Portal)": ", đi qua một cánh cổng không gian để đến một chiều không gian khác",
    "Trường năng lượng": ", được bảo vệ bởi một trường năng lượng vô hình hoặc phát sáng",
    "Dịch chuyển tức thời": ", biến mất ở một nơi và xuất hiện ở nơi khác ngay lập tức",
    "Phòng điều khiển Tương lai": ", trong một phòng điều khiển trung tâm với hàng trăm màn hình",
    "Vũ khí Laser": ", sử dụng hoặc né tránh các tia laser công nghệ cao",

    "Đồ họa Vector phát sáng": ", theo phong cách đồ họa vector với các đường nét phát sáng",
    "Đô thị Dystopian": ", trong một thành phố tương lai u ám, bị kiểm soát (dystopian)",
    "Mạng lưới thần kinh nhân tạo": ", hình ảnh hóa một mạng lưới thần kinh nhân tạo đang hoạt động",
    "Trí tuệ nhân tạo có tri giác": ", tương tác với một trí tuệ nhân tạo có tri giác, có hình dạng vật lý hoặc không",
    "Thế giới game nhập vai": ", trong một thế giới game nhập vai thực tế ảo (MMORPG)",
    "Cơ thể nửa người nửa máy (Cyborg)": ", kết hợp các bộ phận cơ thể người với máy móc công nghệ cao",
    "Công nghệ Sinh học": ", phòng thí nghiệm công nghệ sinh học với các ống nghiệm và cây trồng biến đổi gen",
    "Thành phố không trọng lực": ", trong một thành phố hoặc không gian không có trọng lực",
    "Tòa nhà chọc trời tương lai": ", giữa những tòa nhà chọc trời cao đến tận mây",
    "Phương tiện tự lái": ", di chuyển bằng các phương tiện tự lái trên đường phố tương lai",
    "Nền tinh vân vũ trụ": ", sản phẩm trôi nổi giữa một tinh vân vũ trụ đầy màu sắc",
    "Đường hầm siêu tốc (Hyperloop)": ", di chuyển trong một đường hầm siêu tốc",
    "Kết cấu Kim loại lỏng": ", sản phẩm có kết cấu như kim loại lỏng, có thể thay đổi hình dạng",
    "Áo giáp Công nghệ cao": ", mặc một bộ áo giáp công nghệ cao như Iron Man",
    "Phòng thí nghiệm Di truyền học": ", trong một phòng thí nghiệm di truyền học, giải mã DNA",
    "Thành phố bay": ", trong một thành phố bay lơ lửng trên những đám mây",
    "Chiến tranh Giữa các vì sao": ", trong bối cảnh của một trận chiến không gian hoành tráng",

    // Ấm cúng & Gần gũi
    "Ấm cúng & Thân mật": ", trong một không gian ấm cúng như phòng khách có lò sưởi hoặc một quán cà phê nhỏ",
    "Khoảnh khắc Gia đình": ", sản phẩm là một phần trong khoảnh khắc sum vầy, hạnh phúc của gia đình",
    "Cảm giác Hoài niệm": ", với bộ lọc màu vintage và bối cảnh gợi nhớ về quá khứ, tạo cảm giác hoài niệm",
    "Vị ngon Nhà làm": ", mang lại cảm giác như một sản phẩm được làm thủ công, tại nhà với tình yêu thương",
    "Tình bạn Thân thiết": ", sản phẩm xuất hiện trong một khoảnh khắc vui vẻ, thân thiết giữa những người bạn",
    "Phòng khách có Lò sưởi": ", bên cạnh lò sưởi đang cháy tí tách trong phòng khách ấm cúng",
    "Quán cafe sách": ", trong một góc yên tĩnh của một quán cafe sách",
    "Bếp lửa Trại": ", quây quần bên bếp lửa trại vào ban đêm",
    "Chăn len & Ca cao nóng": ", cuộn mình trong chăn len và thưởng thức một ly ca cao nóng",
    "Cửa sổ ngày mưa": ", nhìn ra khung cảnh mưa rơi qua ô cửa sổ",
    "Ánh sáng Vàng ấm": ", được chiếu sáng bởi ánh sáng vàng ấm áp, tạo cảm giác dễ chịu",
    "Phong cách Hygge (Đan Mạch)": ", theo phong cách sống Hygge của Đan Mạch, tập trung vào sự ấm cúng và hạnh phúc",
    "Bữa ăn tối gia đình": ", trên bàn ăn trong một bữa tối gia đình đầm ấm",
    "Ngôi nhà gỗ trong rừng": ", trong một ngôi nhà gỗ nhỏ xinh giữa rừng cây",
    "Kỷ niệm tuổi thơ": ", gợi lại những kỷ niệm tuổi thơ ngọt ngào",
    "Thư viết tay": ", bên cạnh một lá thư viết tay và một cây bút mực",
    "Giáng sinh ấm áp": ", trong không khí ấm áp và sum vầy của đêm Giáng sinh",
    "Căn bếp đồng quê": ", trong một căn bếp theo phong cách đồng quê, với mùi bánh nướng thơm lừng",
    "Vườn sau nhà": ", trong một khu vườn nhỏ yên bình sau nhà",
    "Cuộc dã ngoại": ", trên một tấm thảm dã ngoại trong công viên vào một ngày đẹp trời",
    "Đọc sách bên cửa sổ": ", là một phần của khung cảnh đọc sách thư thái bên cửa sổ",
    "Buổi chiều Chủ nhật lười biếng": ", trong không khí thư giãn của một buổi chiều Chủ nhật lười biếng",
    "Tự tay làm (DIY)": ", là một sản phẩm tự tay làm, chứa đựng tâm huyết",
    "Tình yêu Thú cưng": ", trong khoảnh khắc vui đùa, âu yếm với thú cưng",
    "Nướng bánh tại nhà": ", trong quá trình nướng bánh vui vẻ tại nhà",
    "Ánh nến lung linh": ", dưới ánh nến lung linh, lãng mạn",
    "Vòng tay ôm": ", mang lại cảm giác ấm áp như một vòng tay ôm",
    "Quán trà nhỏ": ", trong một quán trà nhỏ yên tĩnh với hương trà thơm ngát",
    "Chợ phiên cuối tuần": ", tại một khu chợ phiên cuối tuần nhộn nhịp và thân thiện",
    "Đan len": ", bên cạnh một cuộn len và đôi que đan",
    "Bài hát Acoustic": ", trong không gian mộc mạc của một buổi trình diễn acoustic",
    "Khung ảnh cũ": ", gợi nhớ kỷ niệm bên cạnh những khung ảnh cũ",
    "Phong cách Vintage": ", mang phong cách vintage, hoài cổ và ấm áp",
    "Mùi hương của Sách cũ": ", trong một thư viện hoặc hiệu sách cũ",
    "Phòng ngủ ấm cúng": ", trên chiếc giường êm ái trong một phòng ngủ ấm cúng",
    "Buổi trà chiều": ", trong một buổi trà chiều kiểu Anh thanh lịch",
    "Cuộc trò chuyện thân mật": ", giữa một cuộc trò chuyện thân mật, chân thành",
    "Nụ cười hạnh phúc": ", gắn liền với nụ cười hạnh phúc, tự nhiên",
    "Khoảnh khắc đời thường": ", tôn vinh vẻ đẹp của những khoảnh khắc đời thường, giản dị",
    "Sự chăm sóc": ", thể hiện sự quan tâm, chăm sóc dịu dàng",
    "Bữa sáng trên giường": ", là một phần của bữa sáng được phục vụ trên giường",
    "Cảm giác an toàn": ", mang lại cảm giác an toàn, được che chở",
    "Mùi cà phê buổi sáng": ", trong không khí trong lành của buổi sáng với mùi cà phê thơm lừng",
    "Âm nhạc nhẹ nhàng": ", trong một không gian có âm nhạc nhẹ nhàng, du dương",
    "Chuyến đi về quê": ", trong một chuyến đi về quê thăm gia đình",
    "Ngôi làng nhỏ yên bình": ", trong một ngôi làng nhỏ yên bình, không xô bồ",
    "Album ảnh gia đình": ", xem lại những kỷ niệm trong một cuốn album ảnh gia đình",
    "Sự sum vầy": ", trong không khí sum vầy, đoàn tụ",
    "Tình làng nghĩa xóm": ", thể hiện tình làng nghĩa xóm thân thiết",
    "Cảm giác thuộc về": ", mang lại cảm giác thân thuộc, như được ở nhà",

    // Hài hước & Sáng tạo
    "Hài hước & Bất ngờ": ", tạo một tình huống hài hước, bất ngờ liên quan đến sản phẩm",
    "Nhân vật Hoạt hình": ", sản phẩm tương tác với các nhân vật hoạt hình vui nhộn",
    "Tình huống Trớ trêu": ", đặt sản phẩm vào một tình huống trớ trêu, dở khóc dở cười",
    "Phong cách Kỳ quặc": ", sử dụng màu sắc và hình ảnh kỳ quặc, độc đáo để thu hút sự chú ý",
    "Kể chuyện Vui nhộn": ", kể một câu chuyện ngắn vui nhộn với sản phẩm là nhân vật chính hoặc trung tâm",
    "Sản phẩm có cảm xúc": ", sản phẩm có mắt, miệng và thể hiện cảm xúc như con người",
    "Thú cưng biết nói": ", trong một thế giới nơi thú cưng có thể nói chuyện và tương tác",
    "Tỷ lệ Phóng đại": ", sản phẩm được phóng đại hoặc thu nhỏ một cách vô lý",
    "Logic ngược đời": ", trong một thế giới nơi các định luật vật lý và logic bị đảo ngược",
    "Hiệu ứng Stop-motion hài hước": ", sử dụng kỹ thuật stop-motion để tạo ra các hành động hài hước",
    "Pha trộn Kỳ lạ": ", kết hợp sản phẩm với những thứ hoàn toàn không liên quan một cách hài hước",
    "Nhân hóa Đồ vật": ", các đồ vật vô tri khác trong bối cảnh cũng có sự sống và cảm xúc",
    "Tình huống 'dở khóc dở cười'": ", tạo ra một tình huống khó xử nhưng hài hước",
    "Pha Chế nhạo (Parody)": ", chế nhạo một bộ phim, chương trình truyền hình hoặc một quảng cáo nổi tiếng",
    "Vũ điệu Ngớ ngẩn": ", các nhân vật hoặc chính sản phẩm thực hiện một vũ điệu ngớ ngẩn, vui nhộn",
    "Thử thách Thất bại": ", mô tả một thử thách và những lần thất bại hài hước trước khi thành công",
    "Biểu cảm Khuôn mặt cường điệu": ", các nhân vật có biểu cảm khuôn mặt được cường điệu hóa",
    "Thế giới Kẹo ngọt": ", trong một thế giới được làm hoàn toàn bằng bánh kẹo",
    "Hành động vụng về": ", nhân vật chính có những hành động vụng về, gây ra tình huống hài hước",
    "Cuộc đối thoại Vô lý": ", cuộc đối thoại giữa các nhân vật hoàn toàn vô lý và không ăn nhập",
    "Thí nghiệm Khoa học điên rồ": ", sản phẩm là kết quả của một thí nghiệm khoa học điên rồ",
    "Người ngoài hành tinh thân thiện": ", tương tác với một người ngoài hành tinh thân thiện nhưng ngô nghê",
    "Siêu anh hùng 'bá đạo'": ", một siêu anh hùng với những siêu năng lực 'bá đạo' và vô dụng",
    "Giấc mơ Kỳ lạ": ", bối cảnh diễn ra trong một giấc mơ kỳ lạ và không theo logic",
    "Sự kiện Bất thường": ", một sự kiện bất thường xảy ra trong một bối cảnh hoàn toàn bình thường",
    "Máy móc Rube Goldberg": ", sản phẩm là một phần của một cỗ máy Rube Goldberg phức tạp và hài hước",
    "Cảnh phim câm": ", theo phong cách phim câm, với hành động và biểu cảm cường điệu",
    "Đồ vật bay lượn": ", các đồ vật bay lượn một cách ngẫu nhiên trong không gian",
    "Thế giới thu nhỏ": ", trong một thế giới thu nhỏ, nơi sản phẩm trở nên khổng lồ",
    "Hiệu ứng âm thanh vui nhộn": ", sử dụng các hiệu ứng âm thanh vui nhộn (cartoon sound effects)",
    "Sự hoán đổi cơ thể": ", các nhân vật bị hoán đổi cơ thể cho nhau",
    "Cuộc phiêu lưu của Thức ăn": ", món ăn tự có sự sống và tham gia vào một cuộc phiêu lưu",
    "Phong cách vẽ tay nguệch ngoạc": ", kết hợp với các hình vẽ tay nguệch ngoạc, đơn giản",
    "Sự kiện Lịch sử 'chế'": ", diễn lại một sự kiện lịch sử một cách hài hước và sai sự thật",
    "Câu chuyện cổ tích hiện đại": ", kể lại một câu chuyện cổ tích theo phong cách hiện đại và hài hước",
    "Đối thoại của các Bức tượng": ", các bức tượng trong công viên hoặc bảo tàng có thể nói chuyện",
    "Phép thuật 'lỗi'": ", một phù thủy sử dụng phép thuật nhưng luôn bị 'lỗi'",
    "Hành động lén lút hài hước": ", một nhân vật cố gắng hành động lén lút nhưng luôn gây ra tiếng động",
    "Cuộc rượt đuổi vui nhộn": ", một cuộc rượt đuổi theo phong cách phim hoạt hình Tom & Jerry",
    "Sự hiểu lầm tai hại": ", mọi rắc rối bắt nguồn từ một sự hiểu lầm tai hại",
    "Bữa tiệc của Động vật": ", trong một bữa tiệc do các loài động vật tổ chức",
    "Cảnh quay ẩn (Hidden Camera)": ", theo phong cách một chương trình camera giấu kín, ghi lại phản ứng hài hước",
    "Sự tương phản hài hước": ", tạo ra sự tương phản hài hước, ví dụ một con mèo cư xử như chó",
    "Lời thoại châm biếm": ", sử dụng lời thoại thông minh, châm biếm",
    "Hành động lặp lại (Loop)": ", một hành động hài hước được lặp đi lặp lại",
    "Sự cố trang phục": ", nhân vật gặp sự cố về trang phục một cách hài hước",
    "Cuộc thi kỳ lạ": ", tham gia một cuộc thi với những môn thi đấu kỳ lạ",
    "Phản ứng thái quá": ", nhân vật có phản ứng thái quá với những sự việc nhỏ nhặt",
    "Giọng kể chuyện hài hước": ", có một giọng kể chuyện hài hước, bình luận về các tình huống",
    "Cái kết bất ngờ": ", câu chuyện có một cái kết bất ngờ và hài hước",

    // Nghệ thuật & Độc đáo
    "Stop-motion Sáng tạo": ", tạo một video quảng cáo bằng kỹ thuật stop-motion với các vật thể tự di chuyển",
    "Màu nước & Mực loang": ", sản phẩm hòa quyện vào các hiệu ứng màu nước hoặc mực loang nghệ thuật",
    "Hiệu ứng Ảo ảnh": ", sử dụng các kỹ thuật tạo ảo ảnh quang học để làm nổi bật sản phẩm",
    "Vẽ tay (Hand-drawn)": ", kết hợp sản phẩm với các yếu tố hoạt hình vẽ tay",
    "Điêu khắc & Sắp đặt": ", sản phẩm là một phần của một tác phẩm điêu khắc hoặc nghệ thuật sắp đặt",
    "Nghệ thuật Gấp giấy (Origami)": ", trong một thế giới được làm từ nghệ thuật gấp giấy Origami",
    "Tranh cắt dán (Collage)": ", theo phong cách tranh cắt dán từ nhiều hình ảnh và vật liệu khác nhau",
    "Nghệ thuật đường nét (Line Art)": ", sử dụng các đường nét đơn giản để tạo thành hình ảnh nghệ thuật",
    "Chồng ảnh (Double Exposure)": ", sử dụng kỹ thuật chồng ảnh, kết hợp hình ảnh sản phẩm với một hình ảnh khác (ví dụ: thiên nhiên)",
    "Nghệ thuật Khảm (Mosaic)": ", hình ảnh được tạo thành từ hàng ngàn mảnh ghép nhỏ theo phong cách mosaic",
    "Tranh sơn dầu Cổ điển": ", theo phong cách của một bức tranh sơn dầu cổ điển",
    "Phong cách Siêu thực": ", trong một bối cảnh siêu thực, như trong tranh của Salvador Dalí",
    "Nghệ thuật Phun sơn (Airbrush)": ", với các đường nét mềm mại và chuyển màu mượt mà của kỹ thuật airbrush",
    "Hiệu ứng Tan biến (Dispersion)": ", sản phẩm tan biến thành hàng ngàn mảnh nhỏ",
    "Vẽ tranh bằng Ánh sáng": ", sử dụng kỹ thuật light painting để tạo ra các vệt sáng nghệ thuật xung quanh sản phẩm",
    "Nghệ thuật đối xứng": ", tạo ra một hình ảnh có tính đối xứng hoàn hảo và đẹp mắt",
    "Phong cách 'Low Poly'": ", hình ảnh được tạo thành từ các đa giác (polygon) theo phong cách low poly",
    "Tranh tường (Mural)": ", sản phẩm là một phần của một bức tranh tường nghệ thuật quy mô lớn",
    "Nghệ thuật Chữ (Typography)": ", sử dụng nghệ thuật sắp đặt chữ để tạo thành hình ảnh hoặc làm nổi bật sản phẩm",
    "Nền kết cấu Vết sơn": ", trên một bề mặt có kết cấu của những vệt sơn, màu vẽ",
    "Hiệu ứng Kính vạn hoa": ", hình ảnh được nhân lên và sắp xếp đối xứng như nhìn qua kính vạn hoa",
    "Nghệ thuật X-ray": ", nhìn xuyên qua sản phẩm với hiệu ứng X-quang nghệ thuật",
    "Phong cách Pop Art của Andy Warhol": ", theo phong cách Pop Art của Andy Warhol, với màu sắc rực rỡ và sự lặp lại",
    "Nghệ thuật Trừu tượng": ", thể hiện sản phẩm một cách trừu tượng, không theo hình dạng thực tế",
    "Sản phẩm trong khối Hổ phách": ", sản phẩm được bao bọc trong một khối hổ phách trong suốt",
    "Thế giới trong chai": ", toàn bộ bối cảnh và sản phẩm được đặt trong một chiếc chai thủy tinh",
    "Nghệ thuật sắp đặt từ thực phẩm": ", sử dụng thực phẩm để tạo thành một tác phẩm nghệ thuật sắp đặt",
    "Vẽ trên cơ thể (Body Painting)": ", sản phẩm là một phần của nghệ thuật vẽ trên cơ thể người",
    "Phong cách Lập thể (Cubism)": ", theo phong cách hội họa lập thể, với các góc nhìn khác nhau được thể hiện cùng lúc",
    "Nghệ thuật Đổ bóng": ", tạo ra những chiếc bóng nghệ thuật, có hình dạng đặc biệt từ sản phẩm",
    "Nghệ thuật từ Đồ tái chế": ", bối cảnh được tạo ra hoàn toàn từ đồ vật tái chế",
    "Tranh sơn mài": ", theo phong cách của một bức tranh sơn mài truyền thống",
    "Hiệu ứng Nhiễu ảnh (Glitch)": ", sử dụng hiệu ứng nhiễu kỹ thuật số một cách đầy tính nghệ thuật",
    "Thế giới được dệt bằng len": ", bối cảnh và các chi tiết được làm hoàn toàn bằng len sợi",
    "Nghệ thuật Gothic": ", theo phong cách nghệ thuật Gothic, có chút u tối, bí ẩn và trang nghiêm",
    "Tác phẩm Điêu khắc băng": ", sản phẩm được điêu khắc từ băng hoặc đặt trong một công trình điêu khắc băng",
    "Phong cách Steampunk": ", trong một thế giới Steampunk, với máy hơi nước và bánh răng",
    "Tranh thủy mặc": ", theo phong cách của một bức tranh thủy mặc Á Đông",
    "Sản phẩm hóa thành Cát": ", sản phẩm được tạo thành từ cát hoặc tan biến thành cát",
    "Sự biến dạng nghệ thuật": ", hình ảnh sản phẩm bị biến dạng một cách có chủ đích và nghệ thuật",
    "Nghệ thuật Sợi chỉ": ", sử dụng các sợi chỉ căng để tạo thành hình ảnh (string art)",
    "Tranh trên kính màu": ", theo phong cách của các bức tranh trên kính màu trong nhà thờ",
    "Phong cách Baroque": ", theo phong cách nghệ thuật Baroque, lộng lẫy, cầu kỳ và giàu chi tiết",
    "Nghệ thuật Đương đại": ", theo phong cách của nghệ thuật đương đại, phá cách và đầy ý niệm",
    "Chuyển động của Vải lụa": ", những dải lụa mềm mại bay lượn xung quanh sản phẩm",
    "Hiệu ứng Phim ảnh cũ": ", hình ảnh có các vết xước, hạt nhiễu như một thước phim cũ",
    "Nghệ thuật Tối giản": ", chỉ giữ lại những yếu tố cần thiết nhất, tạo ra một hình ảnh tối giản nhưng ấn tượng",
    "Sự phản chiếu trong Gương vỡ": ", hình ảnh sản phẩm được phản chiếu qua nhiều mảnh gương vỡ",
    "Nghệ thuật Động học (Kinetic Art)": ", sản phẩm là một phần của một tác phẩm nghệ thuật có thể chuyển động",
    "Thế giới đảo ngược": ", trong một thế giới nơi mọi thứ bị đảo ngược, lộn đầu xuống",

    // Chuyên nghiệp & Tin cậy
    "Giải pháp Chuyên nghiệp": ", trình bày sản phẩm như một giải pháp chuyên nghiệp, hiệu quả cho một vấn đề cụ thể",
    "Đồ họa Thông tin": ", sử dụng đồ họa thông tin (infographic) để giải thích các tính năng của sản phẩm",
    "Phỏng vấn Chuyên gia": ", mô phỏng một chuyên gia đang nói về lợi ích và chất lượng của sản phẩm",
    "Công sở Hiện đại": ", sản phẩm được sử dụng trong một môi trường công sở hiện đại, năng động",
    "Thành công & Đẳng cấp": ", gắn liền hình ảnh sản phẩm với sự thành công, quyền lực và đẳng cấp",
    "Bắt tay Thỏa thuận": ", trong khoảnh khắc hai doanh nhân bắt tay chốt một thỏa thuận quan trọng",
    "Bài thuyết trình Ấn tượng": ", sản phẩm là một phần của một bài thuyết trình ấn tượng trước đám đông",
    "Đội ngũ Đoàn kết": ", thể hiện tinh thần đoàn kết, chuyên nghiệp của một đội ngũ",
    "Góc nhìn của Lãnh đạo": ", theo góc nhìn của một nhà lãnh đạo, một CEO thành đạt",
    "Biểu đồ Tăng trưởng": ", bên cạnh một biểu đồ thể hiện sự tăng trưởng vượt bậc",
    "Kiến trúc Doanh nghiệp": ", trong một tòa nhà văn phòng có kiến trúc hiện đại, bề thế",
    "Phòng họp Công nghệ cao": ", trong một phòng họp được trang bị công nghệ cao",
    "Sự tập trung cao độ": ", thể hiện sự tập trung cao độ vào công việc để đạt hiệu quả tốt nhất",
    "Quy trình Sản xuất": ", mô tả quy trình sản xuất hiện đại, chính xác và sạch sẽ",
    "Chứng nhận Chất lượng": ", làm nổi bật các chứng nhận, con dấu đảm bảo chất lượng",
    "Dịch vụ Khách hàng": ", thể hiện sự tận tâm, chuyên nghiệp của đội ngũ dịch vụ khách hàng",
    "Giao diện Người dùng (UI/UX)": ", tập trung vào giao diện người dùng sạch sẽ, trực quan và dễ sử dụng",
    "An ninh & Bảo mật": ", nhấn mạnh yếu tố an ninh, bảo mật, được thể hiện qua hình ảnh ổ khóa, tấm khiên",
    "Sự chính xác & Chi tiết": ", cận cảnh các chi tiết nhỏ, thể hiện sự chính xác và hoàn thiện cao",
    "Nghiên cứu & Phát triển": ", trong một phòng nghiên cứu và phát triển (R&D) hiện đại",
    "Tòa nhà Văn phòng hiện đại": ", đặt trước một tòa nhà văn phòng bằng kính hiện đại",
    "Hình ảnh 'Trước & Sau'": ", thể hiện rõ ràng hiệu quả của sản phẩm qua hình ảnh 'trước và sau'",
    "Cái nhìn sâu sắc từ Dữ liệu": ", biến những dữ liệu phức tạp thành những giải pháp đơn giản, hiệu quả",
    "Sự minh bạch": ", sử dụng các yếu tố trong suốt như kính, acrylic để thể hiện sự minh bạch",
    "Mạng lưới Toàn cầu": ", trên nền bản đồ thế giới, thể hiện mạng lưới hoạt động toàn cầu",
    "Chuyên gia trong phòng thí nghiệm": ", một chuyên gia mặc áo blouse trắng đang làm việc trong phòng thí nghiệm",
    "Công nghệ Sạch": ", trong một môi trường sạch sẽ, tối giản, nhấn mạnh vào công nghệ",
    "Sự đổi mới": ", thể hiện sự đổi mới, đi đầu xu hướng",
    "Hiệu suất Tối ưu": ", mô tả hiệu suất tối ưu của sản phẩm, nhanh và mạnh",
    "Bàn làm việc Gọn gàng": ", trên một bàn làm việc được sắp xếp gọn gàng, chuyên nghiệp",
    "Kiến trúc sư & Bản vẽ": ", bên cạnh một kiến trúc sư và bản vẽ thiết kế chi tiết",
    "Luật sư & Tòa án": ", trong bối cảnh của một văn phòng luật sư hoặc một phiên tòa, thể hiện sự tin cậy",
    "Bác sĩ & Bệnh viện": ", được một bác sĩ giới thiệu trong một bệnh viện hiện đại, sạch sẽ",
    "Sự bền vững": ", nhấn mạnh yếu tố bền vững, lâu dài",
    "Giải thưởng & Vinh danh": ", sản phẩm được trưng bày cùng với các giải thưởng danh giá",
    "Lịch sử & Di sản thương hiệu": ", thể hiện lịch sử lâu đời và di sản của thương hiệu",
    "Quy trình làm việc hiệu quả": ", mô tả một quy trình làm việc được tối ưu hóa và hiệu quả",
    "Tầm nhìn Tương lai": ", thể hiện tầm nhìn tương lai, chiến lược của doanh nghiệp",
    "Sự hài lòng của Khách hàng": ", ghi lại khoảnh khắc hài lòng, vui vẻ của khách hàng khi sử dụng sản phẩm",
    "Cam kết lâu dài": ", thể hiện một cam kết, một lời hứa chắc chắn",
    "Xây dựng Niềm tin": ", hình ảnh mang lại cảm giác tin tưởng, chắc chắn",
    "Cấu trúc Tinh thể": ", sản phẩm có cấu trúc bền vững, hoàn hảo như một tinh thể",
    "Sơ đồ Mạch điện": ", trên nền một sơ đồ mạch điện phức tạp, thể hiện sự thông minh",
    "Sự hoàn hảo": ", hướng tới sự hoàn hảo trong từng chi tiết",
    "Đối tác Chiến lược": ", trong bối cảnh hợp tác giữa các đối tác chiến lược",
    "Phong cách Tối giản công sở": ", theo phong cách tối giản, sử dụng các màu như trắng, xám, đen",
    "Sự ngăn nắp, có tổ chức": ", mọi thứ được sắp xếp một cách ngăn nắp, có tổ chức",
    "Đồng phục Chuyên nghiệp": ", các nhân vật mặc đồng phục thể hiện tính chuyên nghiệp, đồng bộ",
    "Trí tuệ & Kinh nghiệm": ", thể hiện trí tuệ và kinh nghiệm dày dặn",
    "Sự tinh thông": ", nhân vật là một người tinh thông, am hiểu sâu sắc về lĩnh vực của mình",
    
    // Sử thi & Điện ảnh
    "Cảnh quay Điện ảnh": ", sử dụng góc máy, ánh sáng và màu sắc đậm chất điện ảnh",
    "Hiệu ứng Slow-motion": ", quay cận cảnh sản phẩm với hiệu ứng chuyển động chậm đầy nghệ thuật",
    "Phong cách Sử thi": ", trong một bối cảnh hùng vĩ, hoành tráng như một bộ phim sử thi",
    "Khung cảnh Rộng lớn": ", đặt sản phẩm trong một khung cảnh thiên nhiên hoặc đô thị rộng lớn, choáng ngợp",
    "Trailer Phim Hành động": ", tạo một đoạn quảng cáo theo phong cách trailer phim hành động kịch tính",
    "Ánh sáng điện ảnh (Cinematic Lighting)": ", sử dụng kỹ thuật chiếu sáng điện ảnh để tạo chiều sâu và cảm xúc",
    "Góc máy Rộng (Wide-angle)": ", sử dụng góc máy rộng để bao quát toàn bộ khung cảnh hùng vĩ",
    "Cảnh quay từ trên cao (Drone shot)": ", cảnh quay từ trên cao nhìn xuống, như được quay bằng drone",
    "Bầu không khí Bí ẩn": ", trong một bầu không khí mờ ảo, bí ẩn và đầy Spannung",
    "Hành trình của Người hùng": ", sản phẩm đồng hành cùng nhân vật chính trên hành trình của người hùng",
    "Cuộc rượt đuổi Kịch tính": ", trong một cuộc rượt đuổi bằng ô tô hoặc chạy bộ đầy kịch tính",
    "Vụ nổ Lớn": ", một vụ nổ lớn xảy ra ở phía sau, nhân vật chính không ngoảnh lại",
    "Phong cách Phim Noir": ", theo phong cách phim noir, với tông màu đen trắng và độ tương phản cao",
    "Thế giới Hậu tận thế": ", trong một thế giới hoang tàn sau thảm họa, đầy bụi bặm và đổ nát",
    "Cuộc chiến Lịch sử": ", giữa một trận chiến lịch sử hoành tráng với binh lính và ngựa chiến",
    "Khám phá Tàn tích cổ": ", khám phá một ngôi đền hoặc thành phố cổ bị lãng quên trong rừng sâu",
    "Bối cảnh Viễn Tây": ", trong một thị trấn miền viễn Tây hoang dã với các chàng cao bồi",
    "Cảnh trong Cơn bão": ", giữa một cơn bão tố dữ dội trên biển hoặc trên đất liền",
    "Ánh sáng Loe Αναμορφικό (Anamorphic)": ", sử dụng hiệu ứng lóe sáng ngang đặc trưng của ống kính anamorphic",
    "Màu phim (Film Look)": ", màu sắc được chỉnh theo phong cách của các loại phim nhựa nổi tiếng",
    "Đối đầu Kịch tính": ", trong khoảnh khắc đối đầu căng thẳng giữa hai nhân vật",
    "Khoảnh khắc Lịch sử": ", tái hiện một khoảnh khắc lịch sử hoặc một sự kiện có thật",
    "Sự im lặng trước cơn bão": ", không khí tĩnh lặng, căng thẳng ngay trước khi một sự kiện lớn xảy ra",
    "Cảnh quay một lần (One-shot)": ", toàn bộ cảnh được quay trong một lần bấm máy duy nhất, không cắt cảnh",
    "Bí mật được tiết lộ": ", trong khoảnh khắc một bí mật quan trọng được tiết lộ",
    "Huyền thoại & Thần thoại": ", dựa trên các câu chuyện huyền thoại, thần thoại của các nền văn hóa",
    "Phong cách phim của Christopher Nolan": ", theo phong cách phim của Christopher Nolan, phức tạp, hoành tráng và cân não",
    "Phong cách phim của Wes Anderson": ", theo phong cách phim của Wes Anderson, với bố cục đối xứng và màu sắc độc đáo",
    "Chiến binh Samurai": ", trong một trận đấu kiếm của các chiến binh Samurai Nhật Bản",
    "Đấu trường La Mã": ", giữa một trận chiến sinh tử trong Đấu trường La Mã cổ đại",
    "Hiệp sĩ Bàn tròn": ", trong bối cảnh của triều đại vua Arthur và các Hiệp sĩ Bàn tròn",
    "Cướp biển Caribê": ", trên một con tàu cướp biển, khám phá các hòn đảo kho báu",
    "Khung cảnh hùng vĩ của Chúa tể những chiếc nhẫn": ", trong một khung cảnh hùng vĩ như trong phim Chúa tể những chiếc nhẫn",
    "Thế giới Phép thuật Harry Potter": ", trong thế giới phép thuật huyền bí của Harry Potter",
    "Cuộc chiến giữa các vì sao (Star Wars)": ", trong một trận chiến không gian hoặc đấu kiếm ánh sáng như trong Star Wars",
    "Thế giới Cyberpunk của Blade Runner": ", trong một thành phố cyberpunk mưa rơi, đầy neon như trong phim Blade Runner",
    "Ma trận (The Matrix)": ", trong thế giới Ma Trận, với khả năng bẻ cong thực tại",
    "Thế giới của các vị thần": ", trong cuộc chiến của các vị thần trên đỉnh Olympus hoặc Asgard",
    "Ngày tận thế": ", trong bối cảnh ngày tận thế, khi Trái Đất đối mặt với sự hủy diệt",
    "Cuộc đổ bộ bãi biển": ", tái hiện cuộc đổ bộ bãi biển hoành tráng như trong phim Giải cứu binh nhì Ryan",
    "Điệp viên 007": ", theo phong cách của điệp viên James Bond, lịch lãm, hành động và công nghệ cao",
    "Khám phá Kho báu": ", trong một cuộc phiêu lưu tìm kiếm kho báu bị mất như Indiana Jones",
    "Sự trỗi dậy của một Đế chế": ", chứng kiến sự trỗi dậy hoặc sụp đổ của một đế chế vĩ đại",
    "Cảnh đăng quang": ", trong một buổi lễ đăng quang hoàng gia trang trọng và uy nghi",
    "Lâu đài Trung cổ": ", trong hoặc xung quanh một lâu đài trung cổ kiên cố",
    "Cảnh chiến đấu hoành tráng": ", một cảnh chiến đấu với quy mô lớn, hàng ngàn người tham gia",
    "Sự hy sinh cao cả": ", trong khoảnh khắc một nhân vật thực hiện một sự hy sinh cao cả",
    "Hành trình Vượt khó": ", mô tả một hành trình đầy gian khổ để đạt được mục tiêu",
    "Cảnh quay ngược thời gian": ", các hành động diễn ra theo chiều ngược lại của thời gian",
    
    // Ẩm thực & Ngon miệng
    "Cận cảnh Món ăn (Macro)": ", quay cận cảnh, chi tiết các thành phần của món ăn hoặc sản phẩm thực phẩm",
    "Hiệu ứng \"Food-porn\"": ", sử dụng ánh sáng và góc quay để làm món ăn trở nên hấp dẫn và ngon miệng nhất có thể",
    "Nguyên liệu Bay lượn": ", các nguyên liệu tươi ngon bay lượn và kết hợp với nhau trong không trung",
    "Bàn tiệc Thịnh soạn": ", sản phẩm được bày trên một bàn tiệc thịnh soạn, sang trọng",
    "Bí quyết Bếp trưởng": ", mô phỏng một đầu bếp nổi tiếng đang chế biến hoặc giới thiệu sản phẩm",
    "Sô cô la tan chảy": ", dòng sô cô la nóng chảy, sánh mịn bao phủ lấy sản phẩm",
    "Hơi nước nóng bốc lên": ", hơi nước nóng bốc lên từ món ăn, tạo cảm giác tươi mới và nóng hổi",
    "Rót mật ong óng ả": ", dòng mật ong vàng óng được rót một cách chậm rãi, đầy hấp dẫn",
    "Rắc bột mịn màng": ", bột đường hoặc bột ca cao được rắc nhẹ nhàng lên bề mặt sản phẩm",
    "Trái cây tươi mọng nước": ", những lát trái cây tươi mọng nước, lấp lánh",
    "Lát cắt hoàn hảo": ", một lát cắt hoàn hảo qua sản phẩm, để lộ kết cấu bên trong hấp dẫn",
    "Phô mai kéo sợi": ", lớp phô mai nóng chảy, kéo sợi dài khi được nhấc lên",
    "Nước sốt sánh mịn": ", dòng nước sốt sánh mịn được rưới lên món ăn",
    "Bọt khí trong đồ uống": ", những bọt khí li ti sủi lên trong một ly đồ uống mát lạnh",
    "Vết nướng xém cạnh": ", những vết nướng xém cạnh hoàn hảo trên thịt hoặc bánh mì",
    "Bữa sáng thịnh soạn": ", là một phần của một bữa sáng thịnh soạn với trứng, thịt xông khói và bánh mì nướng",
    "Bữa tối lãng mạn dưới nến": ", trong một bữa tối lãng mạn dưới ánh nến",
    "Tiệc nướng BBQ ngoài trời": ", trong một bữa tiệc nướng BBQ ngoài trời vui vẻ",
    "Ẩm thực đường phố": ", trong một khu ẩm thực đường phố nhộn nhịp với nhiều món ăn hấp dẫn",
    "Nhà bếp chuyên nghiệp": ", trong một căn bếp chuyên nghiệp, sạch sẽ và hiện đại",
    "Nguyên liệu tươi từ nông trại": ", nhấn mạnh nguyên liệu tươi ngon, được lấy trực tiếp từ nông trại",
    "Hải sản tươi sống": ", các loại hải sản tươi sống được bày trên đá lạnh",
    "Bánh ngọt & Tráng miệng": ", trong một tiệm bánh ngọt với vô số các loại bánh hấp dẫn",
    "Pha chế Cocktail nghệ thuật": ", một bartender đang pha chế một ly cocktail đầy nghệ thuật",
    "Nghệ thuật Latte Art": ", cận cảnh nghệ thuật tạo hình trên bề mặt ly cà phê latte",
    "Món ăn được trang trí đẹp mắt": ", món ăn được trang trí (plating) một cách tinh tế và đẹp mắt",
    "Sự kết hợp màu sắc trong món ăn": ", sự kết hợp màu sắc rực rỡ, hài hòa của các nguyên liệu",
    "Chợ nông sản địa phương": ", tại một khu chợ nông sản địa phương với rau củ quả tươi ngon",
    "Vườn rau hữu cơ": ", nguyên liệu được thu hoạch từ một vườn rau hữu cơ xanh tốt",
    "Dàn đầu bếp chuyên nghiệp": ", một dàn đầu bếp đang hợp tác một cách chuyên nghiệp trong bếp",
    "Sự tương phản kết cấu": ", thể hiện sự tương phản giữa các kết cấu: giòn, mềm, mịn...",
    "Món ăn đang được nấu trên lửa": ", món ăn đang được nấu trên ngọn lửa bùng cháy",
    "Đá viên và đồ uống mát lạnh": ", đá viên rơi vào ly đồ uống mát lạnh, tạo cảm giác sảng khoái",
    "Hương vị bùng nổ (tưởng tượng)": ", hình ảnh hóa sự bùng nổ của hương vị trong miệng",
    "Quy trình làm bánh mì thủ công": ", mô tả quy trình làm bánh mì thủ công, từ nhào bột đến khi ra lò",
    "Nghệ thuật cuộn Sushi": ", một đầu bếp sushi đang thực hiện các cuộn sushi một cách điêu luyện",
    "Bữa ăn gia đình ấm cúng": ", trong một bữa ăn gia đình ấm cúng, mọi người cùng thưởng thức món ăn",
    "Dã ngoại với giỏ thức ăn": ", một giỏ thức ăn đầy ắp được bày ra trong một buổi dã ngoại",
    "Kẹo ngọt đầy màu sắc": ", trong một thế giới kẹo ngọt đầy màu sắc và vui nhộn",
    "Gia vị & Thảo mộc": ", các loại gia vị và thảo mộc được sắp xếp một cách nghệ thuật",
    "Ly rượu vang sóng sánh": ", cận cảnh ly rượu vang đỏ sóng sánh khi được rót hoặc lắc nhẹ",
    "Cảnh nấu ăn theo kiểu ASMR": ", tập trung vào âm thanh khi nấu ăn: tiếng xèo xèo, tiếng cắt rau...",
    "Lớp kem phủ mịn mượt": ", lớp kem phủ mịn mượt được phết lên bánh một cách hoàn hảo",
    "Món ăn trong làn khói": ", món ăn được phục vụ trong một làn khói huyền ảo (từ đá khô)",
    "Sự tươi mới của rau xanh": ", nhấn mạnh sự tươi mới, giòn ngon của các loại rau xanh",
    "Bàn ăn phong cách Flatlay": ", bàn ăn được sắp xếp và chụp từ trên xuống theo phong cách flatlay",
    "Quy trình chế biến từ A-Z": ", mô tả toàn bộ quy trình chế biến món ăn, từ nguyên liệu thô đến thành phẩm",
    "Món ăn đặc sản vùng miền": ", món ăn là đặc sản của một vùng miền cụ thể, mang đậm văn hóa địa phương",
    "Sự kết hợp ẩm thực Á-Âu": ", thể hiện sự kết hợp hài hòa giữa ẩm thực Á Đông và Châu Âu",
    "Món ăn dành cho người sành ăn (Gourmet)": ", một món ăn cao cấp, dành cho những người có khẩu vị tinh tế"
};


const celebrityPromptMap: { [key: string]: string } = {
    "Taylor Swift": " chụp ảnh cùng với Taylor Swift", "Cristiano Ronaldo": " chụp ảnh cùng với Cristiano Ronaldo", "Lionel Messi": " chụp ảnh cùng với Lionel Messi", "Dwayne 'The Rock' Johnson": " chụp ảnh cùng với Dwayne 'The Rock' Johnson", "Kylie Jenner": " chụp ảnh cùng với Kylie Jenner", "Selena Gomez": " chụp ảnh cùng với Selena Gomez", "Beyoncé": " chụp ảnh cùng với Beyoncé", "Justin Bieber": " chụp ảnh cùng với Justin Bieber", "Ariana Grande": " chụp ảnh cùng với Ariana Grande", "Kim Kardashian": " chụp ảnh cùng với Kim Kardashian", "LeBron James": " chụp ảnh cùng với LeBron James", "Rihanna": " chụp ảnh cùng với Rihanna", "Elon Musk": " chụp ảnh cùng với Elon Musk", "Leonardo DiCaprio": " chụp ảnh cùng với Leonardo DiCaprio", "Tom Cruise": " chụp ảnh cùng với Tom Cruise", "Will Smith": " chụp ảnh cùng với Will Smith", "Zendaya": " chụp ảnh cùng với Zendaya", "BTS (nhóm nhạc)": " chụp ảnh cùng với nhóm nhạc BTS", "BLACKPINK (nhóm nhạc)": " chụp ảnh cùng với nhóm nhạc BLACKPINK", "Billie Eilish": " chụp ảnh cùng với Billie Eilish", "Oprah Winfrey": " chụp ảnh cùng với Oprah Winfrey", "Keanu Reeves": " chụp ảnh cùng với Keanu Reeves", "Chris Hemsworth": " chụp ảnh cùng với Chris Hemsworth", "Robert Downey Jr.": " chụp ảnh cùng với Robert Downey Jr.", "Scarlett Johansson": " chụp ảnh cùng với Scarlett Johansson", "Adele": " chụp ảnh cùng với Adele", "Ed Sheeran": " chụp ảnh cùng với Ed Sheeran", "Shakira": " chụp ảnh cùng với Shakira", "Jennifer Lopez": " chụp ảnh cùng với Jennifer Lopez", "David Beckham": " chụp ảnh cùng với David Beckham", "Vin Diesel": " chụp ảnh cùng với Vin Diesel", "Johnny Depp": " chụp ảnh cùng với Johnny Depp", "Emma Watson": " chụp ảnh cùng với Emma Watson", "Daniel Radcliffe": " chụp ảnh cùng với Daniel Radcliffe", "Tom Hanks": " chụp ảnh cùng với Tom Hanks", "Morgan Freeman": " chụp ảnh cùng với Morgan Freeman", "Brad Pitt": " chụp ảnh cùng với Brad Pitt", "Angelina Jolie": " chụp ảnh cùng với Angelina Jolie", "Serena Williams": " chụp ảnh cùng với Serena Williams", "Roger Federer": " chụp ảnh cùng với Roger Federer", "Michael Jordan": " chụp ảnh cùng với Michael Jordan", "Tiger Woods": " chụp ảnh cùng với Tiger Woods", "Conor McGregor": " chụp ảnh cùng với Conor McGregor", "Jeff Bezos": " chụp ảnh cùng với Jeff Bezos", "Bill Gates": " chụp ảnh cùng với Bill Gates", "Mark Zuckerberg": " chụp ảnh cùng với Mark Zuckerberg", "Dalai Lama": " chụp ảnh cùng với Dalai Lama", "Greta Thunberg": " chụp ảnh cùng với Greta Thunberg", "Malala Yousafzai": " chụp ảnh cùng với Malala Yousafzai", "Pope Francis": " chụp ảnh cùng với Pope Francis",
    "Iron Man": " chụp ảnh cùng với Iron Man", "Captain America": " chụp ảnh cùng với Captain America", "Thor": " chụp ảnh cùng với Thor", "Hulk": " chụp ảnh cùng với Hulk", "Black Widow": " chụp ảnh cùng với Black Widow", "Spider-Man": " chụp ảnh cùng với Spider-Man", "Doctor Strange": " chụp ảnh cùng với Doctor Strange", "Black Panther": " chụp ảnh cùng với Black Panther", "Captain Marvel": " chụp ảnh cùng với Captain Marvel", "Superman": " chụp ảnh cùng với Superman", "Batman": " chụp ảnh cùng với Batman", "Wonder Woman": " chụp ảnh cùng với Wonder Woman", "The Flash": " chụp ảnh cùng với The Flash", "Aquaman": " chụp ảnh cùng với Aquaman", "Joker": " chụp ảnh cùng với Joker", "Harley Quinn": " chụp ảnh cùng với Harley Quinn", "Thanos": " chụp ảnh cùng với Thanos", "Wolverine": " chụp ảnh cùng với Wolverine", "Deadpool": " chụp ảnh cùng với Deadpool", "Harry Potter": " chụp ảnh cùng với Harry Potter", "Hermione Granger": " chụp ảnh cùng với Hermione Granger", "Ron Weasley": " chụp ảnh cùng với Ron Weasley", "Darth Vader": " chụp ảnh cùng với Darth Vader", "Luke Skywalker": " chụp ảnh cùng với Luke Skywalker", "Yoda": " chụp ảnh cùng với Yoda", "James Bond": " chụp ảnh cùng với James Bond", "Indiana Jones": " chụp ảnh cùng với Indiana Jones", "Jack Sparrow": " chụp ảnh cùng với Thuyền trưởng Jack Sparrow", "Gandalf": " chụp ảnh cùng với Gandalf", "Aragorn": " chụp ảnh cùng với Aragorn", "Legolas": " chụp ảnh cùng với Legolas", "Neo": " chụp ảnh cùng với Neo từ phim The Matrix", "Trinity": " chụp ảnh cùng với Trinity từ phim The Matrix", "John Wick": " chụp ảnh cùng với John Wick", "Katniss Everdeen": " chụp ảnh cùng với Katniss Everdeen", "Elsa (Frozen)": " chụp ảnh cùng với Elsa trong phim Frozen", "Sherlock Holmes": " chụp ảnh cùng với Sherlock Holmes", "T-800 (Terminator)": " chụp ảnh cùng với T-800 Terminator", "Ellen Ripley (Alien)": " chụp ảnh cùng với Ellen Ripley trong phim Alien",
    "Frodo Baggins": " chụp ảnh cùng với Frodo Baggins", "Gollum": " chụp ảnh cùng với Gollum", "Rocky Balboa": " chụp ảnh cùng với Rocky Balboa", "Forrest Gump": " chụp ảnh cùng với Forrest Gump", "Vito Corleone": " chụp ảnh cùng với Bố già Vito Corleone", "Hannibal Lecter": " chụp ảnh cùng với Hannibal Lecter", "Jason Bourne": " chụp ảnh cùng với Jason Bourne", "Ethan Hunt": " chụp ảnh cùng với Ethan Hunt", "Dominic Toretto": " chụp ảnh cùng với Dominic Toretto", "Lara Croft": " chụp ảnh cùng với Lara Croft", "King Kong": " chụp ảnh cùng với King Kong", "Godzilla": " chụp ảnh cùng với Godzilla", "Paddington Bear": " chụp ảnh cùng với Gấu Paddington", "Mickey Mouse": " chụp ảnh cùng với Chuột Mickey", "Bugs Bunny": " chụp ảnh cùng với Thỏ Bugs", "Homer Simpson": " chụp ảnh cùng với Homer Simpson", "SpongeBob SquarePants": " chụp ảnh cùng với SpongeBob SquarePants", "Scooby-Doo": " chụp ảnh cùng với Scooby-Doo", "Pikachu": " chụp ảnh cùng với Pikachu", "Naruto Uzumaki": " chụp ảnh cùng với Naruto Uzumaki", "Son Goku": " chụp ảnh cùng với Son Goku", "Sailor Moon": " chụp ảnh cùng với Thủy thủ Mặt trăng", "Winnie the Pooh": " chụp ảnh cùng với Gấu Pooh", "Shrek": " chụp ảnh cùng với Shrek", "Buzz Lightyear": " chụp ảnh cùng với Buzz Lightyear", "Woody": " chụp ảnh cùng với Woody", "Minions": " chụp ảnh cùng với các Minion", "Optimus Prime": " chụp ảnh cùng với Optimus Prime", "Bumblebee": " chụp ảnh cùng với Bumblebee", "Wall-E": " chụp ảnh cùng với Wall-E", "Doraemon": " chụp ảnh cùng với Doraemon"
};

// Fix: Define celebrityOptions from celebrityPromptMap keys for the celebrity dropdown.
const celebrityOptions = Object.keys(celebrityPromptMap).sort();

const mergeImageLabels: { [key: number]: string } = {
    1: "Người mẫu",
    2: "Sản phẩm",
    3: "Trang phục",
    4: "Ảnh tham chiếu",
    5: "Ảnh tham chiếu"
};

const productAiImageLabels: { [key: number]: string } = {
    101: "Sản phẩm",
    102: "Tham chiếu 1",
    103: "Tham chiếu 2",
    104: "Tham chiếu 3",
    105: "Tham chiếu 4"
};

const accessoryOptions = ["Kính mắt", "Vòng tay", "Vòng cổ", "Khuyên tai", "Đồng hồ", "Túi xách", "Mũ", "Khăn choàng"];
const accessoryPromptAdditions: { [key: string]: string } = {
    "Kính mắt": ", đang đeo kính mắt",
    "Vòng tay": ", đang đeo vòng tay",
    "Vòng cổ": ", đang đeo vòng cổ",
    "Khuyên tai": ", đang đeo khuyên tai",
    "Đồng hồ": ", đang đeo đồng hồ",
    "Túi xách": ", có thêm một chiếc túi xách",
    "Mũ": ", đang đội mũ",
    "Khăn choàng": ", có quàng một chiếc khăn choàng",
};

const outfitOptions = [
    { name: 'Áo Dài (Việt Nam)', prompt: 'mặc một bộ Áo Dài truyền thống của Việt Nam' },
    { name: 'Áo Bà Ba (Nam Bộ)', prompt: 'mặc một bộ Áo Bà Ba mộc mạc của Nam Bộ Việt Nam' },
    { name: 'Áo Tứ Thân & Nón Quai Thao (Bắc Bộ)', prompt: 'mặc bộ Áo Tứ Thân và đội Nón Quai Thao của Bắc Bộ Việt Nam' },
    { name: 'Áo dài Nam (Khăn đóng)', prompt: 'mặc một bộ Áo dài nam và đội khăn đóng truyền thống của Việt Nam' },
    { name: 'Trang phục H\'Mông', prompt: 'mặc trang phục sặc sỡ của người H\'Mông Việt Nam' },
    { name: 'Trang phục Thái', prompt: 'mặc trang phục của người dân tộc Thái Việt Nam' },
    { name: 'Trang phục Chăm', prompt: 'mặc trang phục truyền thống của người Chăm Việt Nam' },
    { name: 'Trang phục Ê Đê', prompt: 'mặc trang phục truyền thống của người Ê Đê' },
    { name: 'Trang phục Tày', prompt: 'mặc trang phục của người dân tộc Tày Việt Nam' },
    { name: 'Trang phục Dao Đỏ', prompt: 'mặc trang phục của người Dao Đỏ với khăn đội đầu đặc trưng' },
    { name: 'Áo yếm', prompt: 'mặc một chiếc áo yếm truyền thống của Việt Nam' },
    { name: 'Áo chần bông (Bắc Bộ xưa)', prompt: 'mặc một chiếc áo chần bông của Bắc Bộ xưa' },
    { name: 'Trang phục lính gác Lăng Bác', prompt: 'mặc bộ lễ phục màu trắng của lính gác Lăng Bác' },
    { name: 'Trang phục quan lại triều Nguyễn', prompt: 'mặc trang phục của một vị quan lại thời nhà Nguyễn' },
    { name: 'Trang phục lính triều Nguyễn', prompt: 'mặc quân phục của lính triều Nguyễn' },
    { name: 'Việt phục cách tân', prompt: 'mặc một bộ Việt phục cách tân hiện đại' },
    { name: 'Áo dài học sinh trắng', prompt: 'mặc một tà áo dài trắng tinh khôi của nữ sinh Việt Nam' },
    { name: 'Áo dài cưới truyền thống', prompt: 'mặc bộ áo dài cưới màu đỏ truyền thống của Việt Nam' },
    { name: 'Trang phục múa rối nước', prompt: 'mặc trang phục của nghệ sĩ múa rối nước' },
    { name: 'Trang phục dân quân tự vệ', prompt: 'mặc bộ đồng phục của dân quân tự vệ Việt Nam' },
    { name: 'Áo lam đi chùa', prompt: 'mặc bộ áo lam Phật tử khi đi chùa' },
    { name: 'Qipao/Cheongsam (Trung Quốc)', prompt: 'mặc một chiếc Qipao (sườn xám) của Trung Quốc' },
    { name: 'Kimono (Nhật Bản)', prompt: 'mặc một bộ Kimono truyền thống của Nhật Bản' },
    { name: 'Hanbok (Hàn Quốc)', prompt: 'mặc một bộ Hanbok truyền thống của Hàn Quốc' },
    { name: 'Sari (Ấn Độ)', prompt: 'mặc một bộ Sari lộng lẫy của Ấn Độ' },
    { name: 'Hanfu (Trung Quốc)', prompt: 'mặc một bộ Hanfu cổ trang của Trung Quốc' },
    { name: 'Dirndl (Đức - Nữ)', prompt: 'mặc một bộ Dirndl truyền thống của Đức' },
    { name: 'Lederhosen (Đức - Nam)', prompt: 'mặc một bộ Lederhosen truyền thống của Đức' },
    { name: 'Kilt (Scotland)', prompt: 'mặc một chiếc Kilt của Scotland' },
    { name: 'Dashiki (Tây Phi)', prompt: 'mặc một chiếc áo Dashiki sặc sỡ của Tây Phi' },
    { name: 'Poncho (Nam Mỹ)', prompt: 'mặc một chiếc áo Poncho của Nam Mỹ' },
    { name: 'Kebaya (Indonesia/Malaysia)', prompt: 'mặc một bộ Kebaya của Indonesia' },
    { name: 'Barong Tagalog (Philippines)', prompt: 'mặc một chiếc áo Barong Tagalog của Philippines' },
    { name: 'Kaftan (Trung Đông)', prompt: 'mặc một chiếc Kaftan sang trọng của Trung Đông' },
    { name: 'Djellaba (Ma-rốc)', prompt: 'mặc một chiếc Djellaba của Ma-rốc' },
    { name: 'Bunad (Na Uy)', prompt: 'mặc một bộ Bunad truyền thống của Na Uy' },
    { name: 'Váy Flamenco (Tây Ban Nha)', prompt: 'mặc một chiếc váy Flamenco của Tây Ban Nha' },
    { name: 'Shalwar Kameez (Nam Á)', prompt: 'mặc một bộ Shalwar Kameez của Nam Á' },
    { name: 'Vyshyvanka (Ukraine)', prompt: 'mặc một chiếc áo Vyshyvanka của Ukraine' },
    { name: 'Trang phục Cowboy (Mỹ)', prompt: 'mặc trang phục của một cowboy Mỹ' },
    { name: 'Bikini', prompt: 'mặc bikini' },
    { name: 'Váy chữ A', prompt: 'mặc váy chữ A' },
  { name: 'Váy suông', prompt: 'mặc váy suông' },
  { name: 'Váy ôm', prompt: 'mặc váy ôm' },
  { name: 'Váy xòe', prompt: 'mặc váy xòe' },
  { name: 'Váy maxi', prompt: 'mặc váy maxi' },
  { name: 'Váy midi', prompt: 'mặc váy midi' },
   { name: 'Váy đuôi cá', prompt: 'mặc váy đuôi cá' },
  { name: 'Váy cưới', prompt: 'mặc Váy cưới' },
   { name: 'Váy sơ mi', prompt: 'mặc váy sơ mi' },
  { name: 'Váy hai dây', prompt: 'mặc váy hai dây' },
  { name: 'Áo sơ mi', prompt: 'mặc áo sơ mi' },
  { name: 'Áo thun', prompt: 'mặc áo thun' },
  { name: 'Áo polo', prompt: 'mặc áo polo' },
  { name: 'Áo vest', prompt: 'mặc áo vest' },
  { name: 'Áo khoác blazer', prompt: 'mặc áo khoác blazer' },
  { name: 'Áo hoodie', prompt: 'mặc áo hoodie' },
  { name: 'Quần jean', prompt: 'mặc quần jean' },
  { name: 'Quần tây', prompt: 'mặc quần tây' },
  { name: 'Quần short', prompt: 'mặc quần short' },
  { name: 'Suit', prompt: 'mặc suit' }
  
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
    mergeImageFiles, onMergeFileChange, onMergeFileDelete,
    productAiImageFiles, onProductAiFilesChange, onProductAiFilesDelete,
    prompt, setPrompt, onGenerate, isLoading, numberOfImages, setNumberOfImages,
    activeTab, setActiveTab, TABS, initialPrompts
}) => {
    
    // State for Tab "Sản phẩm AI"
    const [selectedTvcCategory, setSelectedTvcCategory] = useState<string>('');
    const [selectedTvcStyle, setSelectedTvcStyle] = useState<string | null>(null);

    const [selectedArtStyle, setSelectedArtStyle] = useState<string | null>(null);
        
    // State for Tab "Sáng tạo với AI"
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedBackground, setSelectedBackground] = useState<string>('');
    const [selectedOutfit, setSelectedOutfit] = useState<string>('');
    const [selectedCelebrity, setSelectedCelebrity] = useState<string>('');
    const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

    // Sync state when user uploads an outfit image, resetting the dropdown
    useEffect(() => {
        const outfitImage = mergeImageFiles.find(f => f.id === 3);
        if (outfitImage?.preview && selectedOutfit) {
            const currentOutfit = outfitOptions.find(o => o.name === selectedOutfit);
            if (currentOutfit && prompt.includes(currentOutfit.prompt)) {
                setPrompt(prompt.replace(currentOutfit.prompt, "mặc đồ từ ảnh số 3"));
            }
            setSelectedOutfit('');
        }
    }, [mergeImageFiles, selectedOutfit, prompt, setPrompt]);

    const handleTvcCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value;
        setSelectedTvcCategory(newCategory);

        if (selectedTvcStyle && tvcStylePromptAdditions[selectedTvcStyle]) {
            setPrompt(prompt.replace(tvcStylePromptAdditions[selectedTvcStyle], '').trim());
        }
        setSelectedTvcStyle(null);
    };

    const handleTvcStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStyle = e.target.value;
        let newPrompt = prompt;

        if (selectedTvcStyle && tvcStylePromptAdditions[selectedTvcStyle]) {
            newPrompt = newPrompt.replace(tvcStylePromptAdditions[selectedTvcStyle], '');
        }
        
        if (newStyle && tvcStylePromptAdditions[newStyle]) {
            newPrompt += tvcStylePromptAdditions[newStyle];
        }

        setSelectedTvcStyle(newStyle || null);
        setPrompt(newPrompt.trim());
    };

    const handleArtStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStyle = e.target.value;
        let newPrompt = prompt;

        if (selectedArtStyle && artStylePromptAdditions[selectedArtStyle]) {
            newPrompt = newPrompt.replace(artStylePromptAdditions[selectedArtStyle], '');
        }
        
        if (newStyle && artStylePromptAdditions[newStyle]) {
            newPrompt += artStylePromptAdditions[newStyle];
        }

        setSelectedArtStyle(newStyle || null);
        setPrompt(newPrompt.trim());
    };

     const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value;
        setSelectedCategory(newCategory);
        
        if (selectedBackground && backgroundPromptMap[selectedBackground]) {
            setPrompt(prompt.replace(backgroundPromptMap[selectedBackground], '').trim());
        }
        setSelectedBackground('');
    };

    const handleBackgroundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newBackground = e.target.value;
        let newPrompt = prompt;

        if (selectedBackground && backgroundPromptMap[selectedBackground]) {
            newPrompt = newPrompt.replace(backgroundPromptMap[selectedBackground], '');
        }
        
        if (newBackground && backgroundPromptMap[newBackground]) {
            newPrompt += backgroundPromptMap[newBackground];
        }

        setSelectedBackground(newBackground);
        setPrompt(newPrompt.trim());
    };
    
    const handleAccessoryToggle = (accessory: string) => {
        const isSelected = selectedAccessories.includes(accessory);
        const addition = accessoryPromptAdditions[accessory] || '';
        let newPrompt = prompt;
        let newSelection = [...selectedAccessories];

        if (isSelected) {
            newSelection = newSelection.filter(item => item !== accessory);
            newPrompt = newPrompt.replace(addition, '');
        } else {
            newSelection.push(accessory);
            newPrompt += addition;
        }

        setSelectedAccessories(newSelection);
        setPrompt(newPrompt.trim());
    };
    
    const handleOutfitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newOutfitName = e.target.value;
        const newOutfit = outfitOptions.find(o => o.name === newOutfitName);
        const newOutfitPrompt = newOutfit ? newOutfit.prompt : 'mặc đồ phù hợp với bối cảnh';

        const currentOutfitPrompt = outfitOptions.find(o => o.name === selectedOutfit)?.prompt;
        
        let promptToUpdate = prompt;
        let replaced = false;

        // Create an array of possible phrases to replace, ordered by specificity
        const phrasesToFind = [];
        if (currentOutfitPrompt) phrasesToFind.push(currentOutfitPrompt);
        phrasesToFind.push('đang mặc đồ từ ảnh số 3');
        phrasesToFind.push('mặc đồ phù hợp với bối cảnh');

        for (const phrase of phrasesToFind) {
            if (promptToUpdate.includes(phrase)) {
                promptToUpdate = promptToUpdate.replace(phrase, newOutfitPrompt);
                replaced = true;
                break;
            }
        }

        setPrompt(promptToUpdate);
        setSelectedOutfit(newOutfitName);
        
        if (newOutfitName) {
            onMergeFileDelete(3);
        }
    };
    
     const handleCelebrityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCelebrity = e.target.value;
        let newPrompt = prompt;

        if (selectedCelebrity && celebrityPromptMap[selectedCelebrity]) {
            newPrompt = newPrompt.replace(celebrityPromptMap[selectedCelebrity], '');
        }
        
        if (newCelebrity && celebrityPromptMap[newCelebrity]) {
            newPrompt += celebrityPromptMap[newCelebrity];
        }

        setSelectedCelebrity(newCelebrity);
        setPrompt(newPrompt.trim());
    };
    
    const resetAllSelections = () => {
        setSelectedTvcCategory('');
        setSelectedTvcStyle(null);
        setSelectedArtStyle(null);
        setSelectedCategory('');
        setSelectedBackground('');
        setSelectedAccessories([]);
        setSelectedOutfit('');
        setSelectedCelebrity('');
    };

    const handleResetPrompt = () => {
        resetAllSelections();
        setPrompt(initialPrompts[activeTab] || '');
    }
    
    const handleTabChange = (tab: string) => {
        resetAllSelections();
        setPrompt(initialPrompts[tab] || '');
        setActiveTab(tab);
    };

    return (
        <div className="bg-[#1f5f5f]/80 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
            <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={handleTabChange} />
            
            <Section 
                title="Tải Ảnh Lên" 
                subtitle={
                    activeTab === "Sản phẩm AI" ? "Tải ảnh sản phẩm (ảnh đầu tiên) và ảnh tham chiếu bối cảnh." :
                    "Tải ảnh người mẫu, sản phẩm và các ảnh khác."
                }
            >
                {activeTab === "Sáng tạo với AI" && (
                     <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                        {mergeImageFiles.map(img => (
                            <ImageUploader 
                                key={img.id} 
                                imageFile={img} 
                                onFileChange={onMergeFileChange} 
                                onDelete={onMergeFileDelete}
                                label={mergeImageLabels[img.id]} 
                            />
                        ))}
                    </div>
                )}
                {activeTab === "Sản phẩm AI" && (
                     <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                        {productAiImageFiles.map(img => (
                             <ImageUploader 
                                key={img.id} 
                                imageFile={img} 
                                onFileChange={onProductAiFilesChange} 
                                onDelete={onProductAiFilesDelete}
                                label={productAiImageLabels[img.id]} 
                            />
                        ))}
                    </div>
                )}
            </Section>

            {activeTab === "Sáng tạo với AI" && (
                <>
                <Section title="Thêm Phụ Kiện (Tùy chọn)">
                     <div className="flex flex-wrap gap-2">
                        {accessoryOptions.map(opt => (
                            <ActionButton 
                                key={opt} 
                                text={opt} 
                                isActive={selectedAccessories.includes(opt)} 
                                onClick={() => handleAccessoryToggle(opt)} 
                            />
                        ))}
                    </div>
                </Section>

                <Section title="Tùy chỉnh Người mẫu">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="outfit-select" className="block text-sm font-medium text-slate-300 mb-2">Trang phục</label>
                            <select
                                id="outfit-select"
                                value={selectedOutfit}
                                onChange={handleOutfitChange}
                                className="w-full bg-[#154949] border border-[#2e7c7c] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            >
                                <option value="">-- Không chọn --</option>
                                {outfitOptions.sort((a,b) => a.name.localeCompare(b.name)).map(outfit => (
                                    <option key={outfit.name} value={outfit.name}>{outfit.name}</option>
                                ))}
                            </select>
                             <p className="text-xs text-slate-400 mt-1">Chọn sẽ thay thế ảnh trang phục đã tải lên.</p>
                        </div>
                        <div>
                            <label htmlFor="celebrity-select" className="block text-sm font-medium text-slate-300 mb-2">Chụp ảnh cùng (Tùy chọn)</label>
                            <select
                                id="celebrity-select"
                                value={selectedCelebrity}
                                onChange={handleCelebrityChange}
                                className="w-full bg-[#154949] border border-[#2e7c7c] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            >
                                <option value="">-- Không chọn --</option>
                                {celebrityOptions.map(celeb => (
                                    <option key={celeb} value={celeb}>{celeb}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </Section>
                
                <Section title="Bối cảnh">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="category-select" className="block text-sm font-medium text-slate-300 mb-2">Chọn hạng mục bối cảnh</label>
                            <select
                                id="category-select"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="w-full bg-[#154949] border border-[#2e7c7c] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            >
                                <option value="">-- Chọn hạng mục --</option>
                                {Object.keys(backgroundCategories).sort().map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="background-select" className="block text-sm font-medium text-slate-300 mb-2">Chọn bối cảnh cụ thể</label>
                            <select
                                id="background-select"
                                value={selectedBackground}
                                onChange={handleBackgroundChange}
                                disabled={!selectedCategory}
                                className="w-full bg-[#154949] border border-[#2e7c7c] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">-- Chọn bối cảnh --</option>
                                {selectedCategory && backgroundCategories[selectedCategory].sort().map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </Section>
                 <Section title="Phong cách ảnh">
                        <div>
                            <label htmlFor="art-style-select" className="block text-sm font-medium text-slate-300 mb-2">Chọn phong cách</label>
                            <select
                                id="art-style-select"
                                value={selectedArtStyle || ''}
                                onChange={handleArtStyleChange}
                                className="w-full bg-[#154949] border border-[#2e7c7c] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            >
                                <option value="">-- Chọn phong cách --</option>
                                {artStyles.map(style => (
                                    <option key={style} value={style}>{style}</option>
                                ))}
                            </select>
                        </div>
                    </Section>
                </>
            )}

            {activeTab === "Sản phẩm AI" && (
                <Section title="Chọn phong cách ảnh quảng cáo">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="tvc-category-select" className="block text-sm font-medium text-slate-300 mb-2">Hạng mục phong cách</label>
                            <select
                                id="tvc-category-select"
                                value={selectedTvcCategory}
                                onChange={handleTvcCategoryChange}
                                className="w-full bg-[#154949] border border-[#2e7c7c] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            >
                                <option value="">-- Chọn hạng mục --</option>
                                {Object.keys(tvcStyles).sort().map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="tvc-style-select" className="block text-sm font-medium text-slate-300 mb-2">Phong cách cụ thể</label>
                            <select
                                id="tvc-style-select"
                                value={selectedTvcStyle || ''}
                                onChange={handleTvcStyleChange}
                                disabled={!selectedTvcCategory}
                                className="w-full bg-[#154949] border border-[#2e7c7c] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">-- Chọn phong cách --</option>
                                {selectedTvcCategory && tvcStyles[selectedTvcCategory].map(style => (
                                    <option key={style} value={style}>{style}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </Section>
            )}

            <Section title="Tùy chọn đầu ra">
                 <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-2">Số ảnh muốn tạo</h3>
                    <div className="flex flex-wrap gap-2">
                        {[1, 2, 4].map(num => (
                            <ActionButton key={num} text={String(num)} isActive={numberOfImages === num} onClick={() => setNumberOfImages(num)} />
                        ))}
                    </div>
                </div>
            </Section>

            <Section 
                title={activeTab === "Sáng tạo với AI" ? "Công cụ 'Bút vẽ ma thuật' (Chỉnh sửa thông minh)" : "Mô tả yêu cầu"}
            >
                <div className="relative">
                    <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} 
                        placeholder={
                            activeTab === "Sáng tạo với AI" 
                                ? "Ví dụ: 'thêm một con mèo tam thể đang ngủ trên ghế sofa' hoặc 'xóa người đàn ông ở hậu cảnh'..." 
                                : "Mô tả yêu cầu của bạn ở đây..."
                        }
                        className="w-full h-28 bg-[#154949] border border-[#2e7c7c] rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-400"
                    />
                    <div className="absolute bottom-2 right-2 flex items-center gap-4 text-slate-400">
                        <button onClick={handleResetPrompt} className="hover:text-amber-400 transition-colors" title="Đặt lại yêu cầu">
                           <WandIcon className="w-4 h-4" />
                        </button>
                         <button onClick={() => setPrompt('')} className="hover:text-red-400 transition-colors" title="Xoá bỏ">
                           <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </Section>
            
            <button onClick={onGenerate} disabled={isLoading}
                className="w-full text-lg font-bold py-3 px-6 rounded-lg bg-amber-400 text-slate-900 hover:bg-amber-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
                {isLoading ? 'Đang tạo...' : 'Tạo Ảnh'}
            </button>
        </div>
    );
};