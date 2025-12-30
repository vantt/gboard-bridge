# Deployment & Installation Guide: Voice Typing Bridge

**Voice Typing Bridge** allows you to use your Android phone's specialized voice typing (Gboard) to type directly onto your Windows PC.

---

## 🖥️ Windows Client

You have two options to run the Windows Client: running directly from Python source code or creating a standalone executable (`.exe`).

### Option 1: Run from Source (Recommended for Developers)

1.  **Install Python**: Ensure Python 3.9+ is installed. [Download Here](https://www.python.org/downloads/).
2.  **Open Terminal**: Navigate to the `windows-client` folder:
    ```powershell
    cd d:\_1.FWG_PARA\1.Projects\dev\toys\gboard-bride\windows-client
    ```
3.  **Install Dependencies**:
    ```powershell
    pip install -r requirements.txt
    ```
4.  **Run Application**:
    ```powershell
    python main.py
    ```
    _A yellow/green icon will appear in your System Tray._

### Option 2: Create Standalone `.exe` (For End Users)

You can package the application so it runs without Python installed.

1.  **Install PyInstaller**:
    ```powershell
    pip install pyinstaller
    ```
2.  **Build the Executable**:
    ```powershell
    pyinstaller --noconsole --onefile --icon=icon.ico --name="VoiceBridge" main.py
    ```
    _(Note: If you don't have an `icon.ico`, you can remove the `--icon` flag or creating one)_
3.  **Locate the Exe**: The `VoiceBridge.exe` will be in the `dist/` folder.
4.  **Deploy**: You can copy this `.exe` strictly to any Windows PC (on the same network) and run it.

---

## 📱 Android App

To test on your phone without publishing to the Google Play Store, we use **Expo Go**.

### Method 1: Testing with Expo Go (Fastest & Easiest)

This method allows you to run the app on your physical device instantly.

1.  **Install "Expo Go"**:
    - Open **Google Play Store** on your Android phone.
    - Search for and install **"Expo Go"**.
2.  **Start Development Server**:
    - On your PC, verify you have Node.js installed.
    - Navigate to the `android-app` folder:
      ```powershell
      cd d:\_1.FWG_PARA\1.Projects\dev\toys\gboard-bride\android-app
      ```
    - Install dependencies (if not done):
      ```powershell
      npm install
      ```
    - Start the app:
      ```powershell
      npx expo start
      ```
3.  **Scan & Run**:
    - A QR code will appear in your terminal (or in the browser tab that opens).
    - Open **Expo Go** on your phone.
    - Tap **"Scan QR code"**.
    - Scan the code from your PC screen.
    - The app will load and connect to your local dev server.

### Method 2: Build Native APK (Recommended for UDP)

The UDP Discovery feature requires a **Native Build** (Development Client). We have automated this process to handle Windows limitations.

1.  **Build the APK**:

    - Run the helper script (bypasses Windows Path Limit issues):
      ```powershell
      .\fix_build.ps1
      ```
    - _Result_: Generates `app-debug.apk` in `android/app/build/outputs/apk/debug/`.

2.  **Install on Phone**:

    - **Option A: Automatic (USB)**
      1.  Connect phone via USB (Enable USB Debugging).
      2.  Run:
          ```powershell
          .\install_via_usb.ps1
          ```
    - **Option B: Manual**
      - Copy the APK file to your phone and install it manually.

3.  **Run & Debug**:
    - **Start Server**: Run `npx expo start` in your terminal.
    - **USB Connection**: If using USB, run `adb reverse tcp:8081 tcp:8081` so the phone can find the server.
    - **Open App**: Open "Gboard Bride" on your phone. It should connect to the server.

> [!INFO]
> See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed fixes on Crashes, Build Errors, and Connection issues.

---

## 🔗 Connecting & Testing

1.  **Ensure Same Network**: Connect both PC and Phone to the **same WiFi**.
2.  **Windows Firewall**:
    - When you run `main.py` or the `.exe` for the first time, Windows Firewall setup might pop up.
    - **Allow Access** for both Private and Public networks (since local WiFi might be categorized differently).
3.  **Verify Flow**:
    - Open Android App -> "Scan for PC".
    - Select your PC.
    - Tap the Text Box -> Tap Gboard Mic -> Speak.
    - Text should appear on your Windows PC in the active window.

---

## ❓ FAQ

**Q: App cannot find my PC?**
A:

- Check if both are on the same WiFi (e.g., 192.168.1.x).
- Disable Windows Firewall temporarily to test.
- Ensure the Windows app is running (check System Tray).

**Q: Text is doubled?**
A: Disable "Auto Send" in the Android app and use the "Send" button manually, or clear the text box after speaking.
