$ErrorActionPreference = "Stop"

# Find ADB
$Adb = "adb"
try {
    if ($env:ANDROID_HOME) {
        $PossibleAdb = Join-Path $env:ANDROID_HOME "platform-tools\adb.exe"
        if (Test-Path $PossibleAdb) { $Adb = $PossibleAdb }
    }
}
catch {}

$ApkPath = "d:\_1.FWG_PARA\1.Projects\dev\toys\gboard-bride\android-app\android\app\build\outputs\apk\debug\app-debug.apk"

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
