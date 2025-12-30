$ErrorActionPreference = "Stop"
$ProjectRoot = "d:\_1.FWG_PARA\1.Projects\dev\toys\gboard-bride"
$ShortPath = "D:\tmp_bride_build"

Write-Host ">>> Method: Directory Junction (Link) on same drive to bypass Path Limit..."
Write-Host ">>> Target: $ShortPath"

# Cleanup previous link if exists
if (Test-Path $ShortPath) {
    Write-Host ">>> Cleaning up previous junction..."
    cmd /c "rmdir $ShortPath"
}

# Create Junction
Write-Host ">>> Creating Junction..."
cmd /c "mklink /J $ShortPath $ProjectRoot"

if (-not (Test-Path "$ShortPath\android-app")) {
    Write-Error "Failed to create junction. Please ensure D: drive is writable."
    exit 1
}

# Go to short path
Write-Host ">>> Switching to Short Path: $ShortPath\android-app\android..."
Set-Location "$ShortPath\android-app\android"

# Clean
Write-Host ">>> Cleaning..."
.\gradlew.bat clean

# Build
Write-Host ">>> Building (AssembleDebug)..."
.\gradlew.bat app:assembleDebug

if ($LASTEXITCODE -eq 0) {
    Write-Host ">>> Build SUCCESS!"
    Write-Host ">>> You can find the APK in: $ShortPath\android-app\android\app\build\outputs\apk\debug"
}
else {
    Write-Error ">>> Build FAILED."
}
