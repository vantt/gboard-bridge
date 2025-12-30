# Troubleshooting Guide

This document captures solutions to common issues encountered during the development and build process of **Voice Typing Bridge**.

---

## 🏗️ Android Build Issues

### 1. Error: "Filename longer than 260 characters"

**Symptoms**: Build fails with `ninja: error: stat(...) filename longer than 260 characters`.
**Cause**: Windows has a path length limit, and React Native's nested dependencies (especially `safe-area-context`) exceed this when deep in the project folder.
**Solution**:
We have created a helper script that uses a **Directory Junction** to shorten the path during build.

- **Run**: `.\fix_build.ps1` (in `android-app` folder).
- **What it does**:
  1.  Creates a temporary junction `D:\tmp_bride_build` pointing to your project.
  2.  Cleans the project.
  3.  Runs the build from the short path.
  4.  Outputs the APK to the original directory.

### 2. Error: "Unsupported class file major version 65" (or 69, etc.)

**Symptoms**: Build fails complaining about Java/JDK version.
**Cause**: Android Gradle Plugin requires JDK 17. You likely have JDK 25 or newer installed.
**Solution**:

- Ensure **JDK 17** is installed.
- The `fix_build.ps1` script and `gradlew.bat` have been configured to hardcode `JAVA_HOME` to `C:\Program Files\Java\jdk-17` to prevent using the wrong version.

### 3. Error: "Unresolved reference: R" or "BuildConfig"

**Symptoms**: Compilation failure in `MainActivity.kt`.
**Cause**: Mismatch between the Android Namespace (in `build.gradle`) and the Kotlin file's `package` declaration.
**Solution**:

- Ensure `MainActivity.kt` imports the correct R class:
  ```kotlin
  import com.voicetypingbridgeandroid.R
  import com.voicetypingbridgeandroid.BuildConfig
  ```

---

## 📱 Runtime Crashes (On Phone)

### 1. Immediate Crash on Startup ("ClassNotFoundException")

**Symptoms**: App closes immediately. Logcat shows `java.lang.ClassNotFoundException: ...MainApplication`.
**Cause**: `AndroidManifest.xml` used a relative path (`.MainApplication`) but the Package Name in `build.gradle` didn't match the folder structure.
**Solution**:

- Use **Fully Qualified Class Names** in `AndroidManifest.xml`:
  ```xml
  <application android:name="com.fgcare.voicetypingbridge.MainApplication" ...>
      <activity android:name="com.fgcare.voicetypingbridge.MainActivity" ...>
  ```

### 2. Immediate Crash (Missing Permissions)

**Symptoms**: App crashes silently or shows permission error.
**Cause**: `react-native-udp` requires Wi-Fi permissions which might be missing if `npx expo prebuild` wasn't run recently.
**Solution**:

- Manually add these to `src/main/AndroidManifest.xml`:
  ```xml
  <uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>
  <uses-permission android:name="android.permission.CHANGE_WIFI_MULTICAST_STATE"/>
  ```

### 3. Red Screen: "Unable to load script"

**Symptoms**: App opens but shows a red error screen about connecting to Metro.
**Cause**: The phone cannot reach the PC's development server (Metro Bundler) via USB.
**Solution**:

- **If using USB**:
  Run this command in a separate terminal:
  ```powershell
  adb reverse tcp:8081 tcp:8081
  ```
  This bridges the phone's localhost to your PC's localhost.
- **Then Reload**: Shake phone -> Reload (or press `R` in Metro terminal).

---

## 🚀 Deployment Scripts

We have created PowerShell scripts in `android-app/` to automate complex tasks:

| Script                | Purpose                              | When to use                             |
| :-------------------- | :----------------------------------- | :-------------------------------------- |
| `fix_build.ps1`       | Builds the APK bypassing Path Limits | When `npx expo run:android` fails.      |
| `install_via_usb.ps1` | Installs the built APK via ADB       | To quickly deploy to a connected phone. |
