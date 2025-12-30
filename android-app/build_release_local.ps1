<#
.SYNOPSIS
    Builds the Android Release APK locally on Windows, bypassing the MAX_PATH (260 char) limitation.

.DESCRIPTION
    React Native / Gradle builds on Windows often fail because the path to intermediate build files 
    exceeds the 260-character limit (MAX_PATH).
    
    This script solves that problem by:
    1. Creating a "Junction" (directory symlink) at a very short path (e.g. D:\tmp_build) 
       that points to this project.
    2. Switching execution to that short path.
    3. Running the standard Gradle build commands from there.
    4. Copying the result back to the 'dist' folder.
    5. Cleaning up the temporary junction.

.NOTES
    Running this script is the recommended way to build the APK locally on Windows.
#>

$ErrorActionPreference = "Stop"
$ProjectRoot = "d:\_1.FWG_PARA\1.Projects\dev\toys\gboard-bride"
$ShortPath = "D:\tmp_bride_build"
$DistDir = "$ProjectRoot\dist"

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
cmd /c "gradlew.bat clean"

# Build
Write-Host ">>> Building Release..."
cmd /c "gradlew.bat assembleRelease"

# Copy Artifact
$ApkPath = "app\build\outputs\apk\release\app-release.apk"
if (Test-Path $ApkPath) {
    Write-Host ">>> Build SUCCESS!"
    if (-not (Test-Path $DistDir)) { New-Item -ItemType Directory -Path $DistDir | Out-Null }
    Copy-Item $ApkPath "$DistDir\GboardBridge.apk" -Force
    Write-Host ">>> APK copied to: $DistDir\GboardBridge.apk"
}
else {
    Write-Error ">>> Build FAILED. APK not found."
}

# Cleanup Junction
Set-Location $ProjectRoot
cmd /c "rmdir $ShortPath"
Write-Host ">>> Cleanup done."

