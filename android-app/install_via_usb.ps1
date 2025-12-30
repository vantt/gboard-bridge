param (
    [string]$Type = "Release"
)

$ErrorActionPreference = "Stop"

# ... (ADB check remains) ...

$ProjectRoot = "d:\_1.FWG_PARA\1.Projects\dev\toys\gboard-bride"

if ($Type -eq "Release") {
    $ApkPath = "$ProjectRoot\dist\GboardBridge.apk"
}
elseif ($Type -eq "Debug") {
    $ApkPath = "$ProjectRoot\android-app\android\app\build\outputs\apk\debug\app-debug.apk"
}
else {
    Write-Error "Unknown Type: $Type. Use 'Release' or 'Debug'."
    exit 1
}

Write-Host ">>> Installing $Type APK from: $ApkPath"

if (-not (Test-Path $ApkPath)) {
    Write-Error "APK not found at: $ApkPath"
    exit 1
}

Write-Host ">>> Please Connect Device via USB and Enable USB Debugging..."
Write-Host ">>> Waiting for device..."

& $Adb wait-for-device

Write-Host ">>> Device found! Installing APK..."

# -r: Replace existing app, -d: Allow version downgrade
& $Adb install -r $ApkPath

if ($LASTEXITCODE -eq 0) {
    Write-Host ">>> INSTALL SUCCESS! Please check your phone."
}
else {
    Write-Error ">>> Install Failed. Try uninstalling the old app from your phone first."
}
