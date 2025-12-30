# 🎙️ Gboard Bride (Voice Typing Bridge)

**Biến điện thoại Android của bạn thành Micro nhập liệu chuyên nghiệp cho Windows.**

---

### 🚀 Tại sao bạn cần Gboard Bride?

Bạn muốn nhập liệu bằng giọng nói tiếng Việt trên máy tính nhưng:

- ❌ Voice typing có sẵn của Windows nhận diện tiếng Việt quá tệ?
- ❌ Phải gõ đi gõ lại vì sai lỗi chính tả liên tục?
- ❌ Phải dùng Google Docs để nhập giọng nói rồi copy-paste thủ công rất mất thời gian?

**Gboard Bride là giải pháp dành cho bạn!**
Ứng dụng này tận dụng sức mạnh nhận diện giọng nói **vô đối** của **Gboard** trên Android để gõ văn bản trực tiếp vào **bất kỳ ứng dụng nào** trên Windows (Word, Excel, Chat, Code Editor...).

✅ **Chính xác tuyệt đối**: Thừa hưởng 100% khả năng của Google Speech-to-Text.
✅ **Tốc độ ánh sáng**: Nói là chữ hiện ngay trên màn hình PC.
✅ **Không dây**: Kết nối qua WiFi, nằm sofa vẫn gõ được báo cáo.
✅ **Zero Setup**: Không cần cài driver phức tạp.

---

### 🏁 Cài đặt & Sử dụng (3 Bước)

Bạn chỉ mất 2 phút để bắt đầu!

#### Bước 1: Chuẩn bị trên Windows (PC)

1. Tải và cài đặt **Windows Client** (hoặc chạy từ source code nếu bạn là dev).
2. Chạy file `run_server.bat` (hoặc `main.py`).
3. Đảm bảo máy tính và điện thoại đang dùng chung một mạng WiFi.
   - _Lưu ý_: Lần đầu chạy, Windows Firewall có thể hỏi quyền truy cập, hãy chọn **Allow** (Private networks).

#### Bước 2: Cài đặt trên Android

1. Cài đặt file APK vào điện thoại Android.
2. Mở ứng dụng **Voice Bridge**.

#### Bước 3: Kết nối & Nhập liệu

1. Trên điện thoại, nhấn **Scan**. Chọn tên máy tính của bạn hiện ra trong danh sách.
2. Nhập mã Pairing hiển thị trên màn hình máy tính (nếu có).
3. Đặt con trỏ chuột vào nơi bạn muốn nhập văn bản trên máy tính (ví dụ: mở file Word).
4. Trên điện thoại, nhấn vào ô nhập liệu để bàn phím Gboard hiện lên -> Nhấn icon Micro 🎙️ -> **NÓI!**
5. Chữ sẽ xuất hiện phép màu trên màn hình máy tính của bạn ✨.

---

### 📚 Tài liệu chi tiết

Nếu bạn gặp vấn đề hoặc muốn tìm hiểu sâu hơn:

- **[Hướng dẫn Cài đặt Chi tiết (Deployment Guide)](docs/deployment_guide.md)**: Hướng dẫn cài đặt môi trường, build app từ source.
- **[Khắc phục sự cố (Troubleshooting)](docs/TROUBLESHOOTING.md)**: Xử lý lỗi không tìm thấy PC, không gõ được tiếng Việt...
- **[Cấu hình Firewall (Firewall Setup)](docs/firewall_setup.md)**: Hướng dẫn chi tiết nếu Windows chặn kết nối.

---

### 🛠️ Dành cho Developer

Project gồm 2 phần chính:

- **Android App**: Viết bằng React Native (Expo).
- **Windows Client**: Viết bằng Python.

Xem chi tiết kiến trúc trong [Product Requirements Document (PRD)](docs/voice-typing-bridge-prd.md).

---

_Made with ❤️ for faster typing._
