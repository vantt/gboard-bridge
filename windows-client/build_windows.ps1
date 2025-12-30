# Build script for Windows Client

$ErrorActionPreference = "Stop"

Write-Host "Installing dependencies..."
pip install -r requirements.txt

Write-Host "Building executable..."
# Clean previous build
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
if (Test-Path "build") { Remove-Item -Recurse -Force "build" }

# Build with PyInstaller
# --onefile: Create a single executable
# --noconsole: Don't show a console window (since it's a tray app)
# --name: Name of the output file
python -m PyInstaller --onefile --noconsole --name "GboardBridge" main.py

Write-Host "Build complete. Executable is located at dist/GboardBridge.exe"
