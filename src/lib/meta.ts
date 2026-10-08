/**
 * Thông tin bộ truyện. Chỉnh sửa ở đây nếu muốn đổi tên/tiêu đề chương.
 * Ảnh trong public/manga đặt tên theo dạng `<chương>-<thứ tự>.png`.
 */
export const MANGA = {
  title: "Ngọn Đuốc Bình Minh",
  subtitle: "Hành trình tìm đường cứu nước 1911 – 1945",
  description:
    "Truyện tranh lịch sử kể lại hành trình của người thanh niên Nguyễn Tất Thành: từ nỗi đau mất nước, những năm bôn ba năm châu, ánh sáng của Luận cương, việc thành lập Đảng, tiếng gọi Pác Bó cho đến mùa thu Tổng khởi nghĩa 1945 và bản Tuyên ngôn Độc lập. (Sản phẩm có thêm các tình tiết giả định VD: các lời thoại của nhân vật. Nhưng vẫn đảm bảo nội dung chính sát với thực tế.)",
  author: "Sưu tầm & biên soạn",
  genres: ["Lịch sử", "Chính luận", "Truyện tranh"],
  status: "Hoàn thành",
};

export type ChapterMeta = {
  title: string;
  era?: string;
  tagline?: string;
};

export const CHAPTER_META: Record<number, ChapterMeta> = {
  1: {
    title: "Nỗi Đau Mất Nước",
    era: "Trung Kỳ, đầu thế kỷ XX",
    tagline: "Cứu nước bằng con đường nào?",
  },
  2: {
    title: "Bôn Ba Năm Châu Và Ánh Sáng Luận Cương",
    era: "1911 – 1920",
    tagline: "Bình minh trong căn phòng trọ",
  },
  3: {
    title: "Gieo Hạt Giống Cách Mạng Và Thành Lập Đảng",
    era: "1920 – 1930",
    tagline: "Sự chia rẽ và nguy cơ bế tắc",
  },
  4: {
    title: "Vượt Qua Sóng Gió Và Tiếng Gọi Pác Bó",
    era: "1930 – 1941",
    tagline: "Phải trở về!",
  },
  5: {
    title: "Tổng Khởi Nghĩa Và Tuyên Ngôn Độc Lập",
    era: "1941 – 1945",
    tagline: "Kỷ nguyên độc lập, tự do",
  },
};
