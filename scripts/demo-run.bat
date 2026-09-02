@echo off
REM StackGeist Pinterest Sandbox Demo Runner
REM Double-click this file to run the sandbox demo end-to-end while you record.
REM
REM Everything is pre-configured. Zero typing during the demo — just hit record,
REM double-click this .bat, watch the output scroll, stop recording.
REM
REM Expected runtime: ~10 seconds. Video length: ~30-45 seconds if you narrate.

cd /d "%~dp0\.."

REM PINTEREST_SANDBOX_TOKEN must be set in your environment before running this demo
set BOARD_MAP={"Gaming Setup Ideas":"1123366769493831407","Small Space Gaming":"1123366769493831408","Budget Desk Setups":"1123366769493831409","Cable Management":"1123366769493831410","Desk Setup Guides":"1123366769493831411"}
set CSV_PATH=marketing/pinterest/pinterest-setup-expansion-v1.csv
set MAX_PINS=3

echo.
echo Running: node scripts/demo-run.mjs
echo.
node scripts/demo-run.mjs

echo.
pause
