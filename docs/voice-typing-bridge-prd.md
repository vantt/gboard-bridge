# PRD: Voice Typing Bridge
## Ứng dụng chuyển giọng nói từ Gboard sang Windows

---

## 📋 Document Information

- **Phiên bản:** 1.0
- **Ngày tạo:** 28/12/2025
- **Người tạo:** Product Team
- **Trạng thái:** Draft

---

## 1. Tổng Quan (Overview)

### 1.1 Vấn đề (Problem Statement)

Windows hiện tại có hỗ trợ voice typing rất hạn chế cho tiếng Việt. Người dùng phải:
- Sử dụng các công cụ của bên thứ ba không ổn định
- Chuyển qua Google Docs để dùng voice typing rồi copy/paste
- Gõ tay thủ công mặc dù có nhu cầu nhập liệu bằng giọng nói

Trong khi đó, Gboard trên Android có khả năng nhận dạng giọng nói tiếng Việt rất tốt, hỗ trợ nhiều giọng địa phương và có độ chính xác cao.

### 1.2 Giải pháp (Solution)

Voice Typing Bridge là hệ thống gồm 2 phần:
- **Android App:** Sử dụng Gboard để thu âm và chuyển đổi giọng nói thành text
- **Windows Client:** Nhận text từ Android và mô phỏng keyboard input vào bất kỳ ứng dụng nào đang active

### 1.3 Target Users

- Người dùng làm việc với văn bản tiếng Việt nhiều (content writers, students, office workers)
- Người có nhu cầu nhập liệu nhanh bằng giọng nói
- Người dùng muốn tận dụng điện thoại Android hiện có thay vì mua thiết bị voice input chuyên dụng

---

## 2. Mục Tiêu (Goals)

### 2.1 Business Goals

- Tạo công cụ miễn phí/freemium giúp người dùng tiết kiệm thời gian nhập liệu
- Xây dựng user base ban đầu 1,000+ active users trong 3 tháng đầu
- Đạt rating 4.0+ trên Google Play Store

### 2.2 User Goals

- Gõ giọng nói tiếng Việt trên Windows với độ chính xác cao
- Kết nối phone-PC dễ dàng, nhanh chóng (< 30 giây)
- Sử dụng trên mọi ứng dụng Windows (Word, Excel, browser, IDE, etc.)
- Không cần cài đặt phức tạp hoặc driver đặc biệt

### 2.3 Success Metrics

- **Connection Time:** < 15 giây để kết nối phone với PC
- **Latency:** < 500ms từ khi nói xong đến khi text xuất hiện trên Windows
- **Accuracy:** Phụ thuộc vào Gboard (ước tính 90%+ cho giọng rõ ràng)
- **User Retention:** 40%+ users quay lại sau 7 ngày

---

## 3. User Stories

### 3.1 Core User Stories

**US-001: Kết nối thiết bị**
```
Là một user,
Tôi muốn kết nối phone với PC qua WiFi
Để có thể sử dụng voice typing mà không cần cáp
```

**US-002: Voice typing cơ bản**
```
Là một user,
Tôi muốn nói vào điện thoại và thấy text xuất hiện trên PC
Để nhập liệu nhanh hơn gõ tay
```

**US-003: Sử dụng trên nhiều ứng dụng**
```
Là một user,
Tôi muốn voice typing hoạt động trên bất kỳ app nào đang focus
Để không bị giới hạn chỉ một số phần mềm
```

**US-004: Dừng/tiếp tục nhanh**
```
Là một user,
Tôi muốn dễ dàng pause/resume voice typing
Để kiểm soát khi nào text được gửi lên PC
```

### 3.2 Secondary User Stories

**US-005: Kết nối tự động**
```
Là một frequent user,
Tôi muốn app tự động kết nối với PC đã pair trước đó
Để tiết kiệm thời gian setup mỗi lần
```

**US-006: Multi-device support**
```
Là một user có nhiều PC,
Tôi muốn lưu danh sách PC và chuyển đổi dễ dàng
Để dùng trên PC văn phòng và PC nhà
```

---

## 4. Tính Năng (Features)

### 4.1 MVP Features (Phase 1)

#### F-001: Device Discovery & Pairing
- **Priority:** P0 (Critical)
- **Description:** 
  - Windows client phát broadcast trên mạng local
  - Android app scan và hiển thị danh sách PC có thể kết nối
  - Pairing code 6 số để xác thực
- **Acceptance Criteria:**
  - App tìm thấy PC trong vòng 5 giây
  - Pairing thành công với code chính xác
  - Hiển thị lỗi rõ ràng nếu không tìm thấy PC

#### F-002: Voice Input Capture
- **Priority:** P0 (Critical)
- **Description:**
  - Hiển thị text field lớn trên Android app
  - Hỗ trợ Gboard voice typing qua mic button
  - Text realtime được capture khi user nói
- **Acceptance Criteria:**
  - Text field focus tự động khi mở app
  - Gboard mic button hoạt động bình thường
  - Không crash khi switch between typing methods

#### F-003: Text Transmission
- **Priority:** P0 (Critical)
- **Description:**
  - Gửi text từ Android sang Windows qua WebSocket/TCP
  - Hỗ trợ incremental update (gửi từng phần khi user đang nói)
  - Buffer để xử lý network hiccups
- **Acceptance Criteria:**
  - Latency < 500ms trong điều kiện WiFi tốt
  - Không bỏ sót text khi network lag nhẹ
  - Tự động reconnect nếu mất kết nối

#### F-004: Keyboard Simulation
- **Priority:** P0 (Critical)
- **Description:**
  - Windows client nhận text và simulate keyboard input
  - Gõ vào app đang active/focus trên Windows
  - Hỗ trợ Unicode/tiếng Việt đầy đủ
- **Acceptance Criteria:**
  - Text xuất hiện đúng vị trí con trỏ
  - Dấu tiếng Việt hiển thị chính xác
  - Hoạt động trên Word, Notepad, browser, IDE

#### F-005: Connection Status
- **Priority:** P0 (Critical)
- **Description:**
  - Hiển thị trạng thái kết nối rõ ràng trên cả 2 bên
  - Indicator: Connected, Disconnected, Connecting
  - PC name/IP hiển thị khi connected
- **Acceptance Criteria:**
  - Status update realtime < 2 giây
  - Visual feedback rõ ràng (màu sắc/icon)

### 4.2 Phase 2 Features

#### F-006: Send Button Mode
- **Priority:** P1 (High)
- **Description:**
  - Toggle mode: Auto-send vs Manual-send
  - Auto: Text tự động gửi khi user nói xong
  - Manual: User nhấn nút "Send" để gửi text
- **Use case:** User muốn review/edit trước khi gửi

#### F-007: Text History
- **Priority:** P1 (High)
- **Description:**
  - Lưu 10 đoạn text gần nhất đã gửi
  - Quick resend từ history
- **Use case:** Gửi lại nội dung vừa nói

#### F-008: Clipboard Mode
- **Priority:** P1 (High)
- **Description:**
  - Option để copy text vào clipboard thay vì typing
  - User tự Ctrl+V khi cần
- **Use case:** Chèn text vào vị trí đặc biệt

### 4.3 Future Features (Phase 3+)

- Hotkey để bật/tắt listening trên Windows
- Multi-language support (English, etc.)
- Desktop notifications khi nhận text
- Connection history và favorites
- Bluetooth connection option
- iOS app support
- Cloud sync settings

---

## 5. Yêu Cầu Kỹ Thuật (Technical Requirements)

### 5.1 Android App

**Platform:**
- Minimum SDK: Android 8.0 (API 26)
- Target SDK: Android 14 (API 34)
- Language: Kotlin hoặc React Native

**Key Components:**
- Input Method Framework integration (Gboard)
- Network service (WebSocket client hoặc TCP socket)
- Background service cho connection maintenance
- Permissions: INTERNET, ACCESS_WIFI_STATE

**Architecture:**
- MVVM pattern (nếu dùng Kotlin)
- Repository pattern cho network communication
- LiveData/Flow cho reactive updates

### 5.2 Windows Client

**Platform:**
- Windows 10/11 (64-bit)
- .NET 6+ hoặc Python 3.9+

**Key Components:**
- WebSocket/TCP server
- Network discovery service (UDP broadcast)
- Keyboard simulation (SendInput API hoặc equivalent)
- System tray application

**Libraries:**
- C#: System.Net.WebSockets, InputSimulator
- Python: websockets, pynput, zeroconf

**Security:**
- Local network only (không expose ra internet)
- Pairing code authentication
- Optional: encryption cho text transmission

### 5.3 Communication Protocol

**Discovery Protocol:**
```
UDP Broadcast (port 59100)
Message: "VOICE_TYPING_BRIDGE_SERVER|<PC_NAME>|<VERSION>"
```

**Pairing Protocol:**
```
1. Client → Server: PAIR_REQUEST|<6_digit_code>
2. Server: Hiển thị code cho user confirm
3. Server → Client: PAIR_SUCCESS|<session_token> hoặc PAIR_FAILED
```

**Text Transmission:**
```json
{
  "type": "text_input",
  "text": "nội dung",
  "mode": "append|replace",
  "timestamp": 1234567890
}
```

### 5.4 Network Requirements

- Same WiFi network (192.168.x.x hoặc 10.x.x.x)
- Port requirements:
  - UDP 59100: Discovery
  - TCP 59101: WebSocket connection
- Firewall: Windows client cần allow incoming connections

---

## 6. User Interface

### 6.1 Android App - Screens

**Screen 1: Connection Screen**
- Scan button (quét tìm PC)
- Danh sách PC khả dụng
- Connection status indicator
- Settings button

**Screen 2: Input Screen**
- Text field lớn (chiếm 60% màn hình)
- Mic indicator (khi đang voice typing)
- Clear button
- Send mode toggle (auto/manual)
- Send button (nếu manual mode)
- Connection status mini (góc trên)

**Screen 3: Settings**
- Connection history
- Auto-connect toggle
- Send mode preference
- About/Version

### 6.2 Windows Client - UI

**System Tray Icon:**
- Green: Connected
- Yellow: Waiting for connection
- Red: Disconnected
- Gray: Service stopped

**Tray Menu:**
- Status: "Connected to [Phone name]"
- Show pairing code
- Disconnect
- Settings
- Exit

**Settings Window:**
- Port configuration
- Auto-start with Windows
- Notification preferences
- Allowed devices list

---

## 7. Non-Functional Requirements

### 7.1 Performance

- **Connection establishment:** < 15 giây
- **Text transmission latency:** < 500ms (median), < 1s (95th percentile)
- **CPU usage:** < 5% khi idle, < 15% khi active typing
- **Memory footprint:** 
  - Android: < 100MB
  - Windows: < 50MB
- **Battery impact:** Minimal (< 5% drain per hour active use)

### 7.2 Reliability

- **Connection stability:** 99% uptime trong session 1 giờ
- **Auto-reconnect:** Tự động reconnect trong vòng 10 giây nếu mất kết nối
- **Data integrity:** 100% text được truyền chính xác (không bị mất chữ)
- **Crash rate:** < 0.1% (1 crash per 1000 sessions)

### 7.3 Usability

- **First-time setup:** User có thể kết nối thành công trong < 2 phút
- **Learning curve:** User hiểu cách dùng cơ bản sau 1 lần thử
- **Error messages:** Rõ ràng, bằng tiếng Việt, có hướng dẫn khắc phục

### 7.4 Security

- **Network isolation:** Chỉ hoạt động trên mạng local
- **Authentication:** Pairing code bắt buộc cho kết nối mới
- **Data privacy:** Không log hoặc upload nội dung user gõ
- **Permissions:** Minimal permissions, giải thích rõ lý do

### 7.5 Compatibility

**Android:**
- Gboard version 11.0+ (hầu hết device hiện tại)
- Hỗ trợ cả WiFi 2.4GHz và 5GHz
- Dark mode support

**Windows:**
- Windows 10 (1809+) và Windows 11
- Hỗ trợ cả laptop và desktop
- Multi-monitor support

---

## 8. User Flow

### 8.1 First-Time Setup Flow

```
1. User cài Windows client
   └─> Auto start, hiện system tray icon (yellow)
   └─> Hiển thị pairing code "123456"

2. User cài Android app
   └─> Mở app, nhấn "Scan for PC"
   └─> App tìm thấy PC: "DESKTOP-ABC (192.168.1.100)"

3. User chọn PC từ danh sách
   └─> App hiển thị: "Enter pairing code shown on PC"
   └─> User nhập "123456"

4. Pairing thành công
   └─> Android: "Connected to DESKTOP-ABC"
   └─> Windows: Tray icon chuyển green, notification "Phone connected"

5. User bắt đầu dùng voice typing
   └─> Nhấn mic trên Gboard
   └─> Nói: "Xin chào đây là test"
   └─> Text xuất hiện trên Notepad (app đang active)
```

### 8.2 Daily Usage Flow

```
1. User mở Android app
   └─> App tự động connect với PC đã pair trước đó
   └─> Hiển thị input screen

2. User focus vào Word document trên PC

3. User nhấn mic button trên Gboard
   └─> Nói nội dung
   └─> Text realtime xuất hiện trong Word

4. User tiếp tục nói hoặc chỉnh sửa bằng Gboard

5. Khi xong, user close app hoặc để background
```

---

## 9. Risk & Mitigations

### 9.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Network instability gây mất text | High | Medium | Buffer + retry mechanism, offline queue |
| Gboard API changes | High | Low | Dùng standard Input Method Framework, không rely vào Gboard-specific APIs |
| Windows security software block | Medium | Medium | Code signing, clear documentation, whitelist instructions |
| Unicode/tiếng Việt rendering issues | High | Low | Extensive testing, fallback to clipboard mode |
| Battery drain trên Android | Medium | Medium | Optimize network polling, use WorkManager |

### 9.2 Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low user adoption | High | Medium | Focus on ease of use, viral marketing, tutorial videos |
| Competition từ similar apps | Medium | High | Differentiate bằng UI/UX tốt, tích hợp sâu với Gboard |
| User privacy concerns | Medium | Low | Clear privacy policy, open source option |

---

## 10. Success Criteria

### 10.1 MVP Launch Success

Sau 1 tháng từ khi launch MVP:
- ✅ 500+ downloads trên Google Play
- ✅ 200+ active weekly users
- ✅ Rating >= 4.0 với ít nhất 20 reviews
- ✅ < 1% crash rate
- ✅ 50%+ completion rate cho first-time setup

### 10.2 Product-Market Fit

Sau 3 tháng:
- ✅ 3,000+ downloads
- ✅ 1,000+ active weekly users
- ✅ 40%+ 7-day retention
- ✅ 20%+ 30-day retention
- ✅ NPS score > 30

---

## 11. Timeline & Milestones

### Phase 1: MVP (8 tuần)

**Week 1-2: Foundation**
- Setup project structure (Android + Windows)
- Implement basic network discovery
- Pairing mechanism

**Week 3-4: Core Features**
- Text input capture trên Android
- Text transmission protocol
- Keyboard simulation trên Windows

**Week 5-6: Integration & Testing**
- End-to-end testing
- Performance optimization
- Bug fixes

**Week 7-8: Polish & Launch**
- UI/UX refinement
- Documentation
- Beta testing
- Play Store submission

### Phase 2: Enhancement (4 tuần)

- Send button mode
- Text history
- Clipboard mode
- Settings screen

### Phase 3: Growth (Ongoing)

- Marketing & user acquisition
- Feature requests implementation
- Platform expansion (iOS, Mac)

---

## 12. Open Questions

1. **Business model:** Freemium? Ads? One-time purchase?
2. **Branding:** Tên app chính thức? Logo design?
3. **Privacy policy:** Hosting ở đâu? Có thu thập analytics không?
4. **Support:** Forum? Discord? Email support?
5. **Localization:** Chỉ tiếng Việt hay multi-language ngay từ đầu?

---

## 13. Appendix

### 13.1 Competitor Analysis

| App | Pros | Cons | Price |
|-----|------|------|-------|
| Remote Mouse | Stable, nhiều features | UI cũ, không focus vào voice | Free + $2.99 Pro |
| Unified Remote | Nhiều remote options | Phức tạp, không optimize cho voice typing | Free + $4.99 Pro |
| KDE Connect | Open source, miễn phí | Setup phức tạp, không có voice focus | Free |

**Differentiation:** Voice Typing Bridge sẽ focus 100% vào voice typing experience, UI đơn giản, setup nhanh.

### 13.2 References

- [Gboard API Documentation](https://developer.android.com/develop/ui/views/touch-and-input/keyboard-input/commands)
- [Windows SendInput API](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-sendinput)
- [WebSocket Protocol RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455)

---

**Document End**

*PRD này sẽ được update theo feedback và thay đổi requirements.*
