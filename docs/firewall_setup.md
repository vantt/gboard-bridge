# Hướng dẫn Cấu hình Firewall cho Voice Typing Bridge

Để điện thoại có thể kết nối được tới máy tính, bạn cần mở cổng (port) trên tường lửa của Windows.

## 1. Mở PowerShell với quyền Admin

1. Nhấn phím **Windows**, gõ `powershell`.
2. Chuột phải vào **Windows PowerShell** chọn **Run as administrator**.

## 2. Các lệnh cấu hình

### Mở cổng (Cho phép kết nối)

Chạy lệnh sau để mở cổng 59101 (cho WebSocket) và 59100 (cho Discovery - nếu cần):

```powershell
# Mở cổng 59101 cho WebSocket (Quan trọng nhất)
netsh advfirewall firewall add rule name="VoiceBridge_TCP" dir=in action=allow protocol=TCP localport=59101 profile=any

# Mở cổng 59100 cho Discovery (Tùy chọn, để scan IP)
netsh advfirewall firewall add rule name="VoiceBridge_UDP" dir=in action=allow protocol=UDP localport=59100 profile=any
```

### Đóng cổng (Xóa quy tắc)

Khi không sử dụng nữa hoặc muốn tắt quyền truy cập:

```powershell
netsh advfirewall firewall delete rule name="VoiceBridge_TCP"
netsh advfirewall firewall delete rule name="VoiceBridge_UDP"
```

### Tắt hoàn toàn Firewall (Dùng để test tạm thời)

**Cảnh báo:** Không khuyến khích dùng lâu dài vì lý do bảo mật.

```powershell
NetSh Advfirewall set allprofiles state off
```

### Bật lại Firewall

```powershell
NetSh Advfirewall set allprofiles state on
```
