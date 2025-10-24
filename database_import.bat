@echo off
REM ============================================
REM PIFAH Database Import Script for Windows
REM ============================================
REM 
REM This script imports the PIFAH database dump into PostgreSQL on Windows
REM 
REM Prerequisites:
REM   - PostgreSQL installed (psql must be in PATH)
REM   - Database 'pifah' already created
REM   - PostgreSQL service running
REM 
REM Usage:
REM   1. Right-click and "Run as Administrator"
REM   2. Or open Command Prompt as Admin and run: database_import.bat
REM ============================================

echo.
echo ========================================
echo PIFAH Database Import Utility
echo ========================================
echo.

REM Check if psql is available
where psql >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: psql command not found!
    echo Please ensure PostgreSQL bin directory is in your PATH
    echo Example: C:\Program Files\PostgreSQL\16\bin
    echo.
    pause
    exit /b 1
)

echo PostgreSQL command-line tool found.
echo.

REM Prompt for database connection details
set /p DB_HOST="Enter PostgreSQL host (default: localhost): " || set DB_HOST=localhost
set /p DB_PORT="Enter PostgreSQL port (default: 5432): " || set DB_PORT=5432
set /p DB_USER="Enter PostgreSQL username (default: postgres): " || set DB_USER=postgres
set /p DB_NAME="Enter database name (default: pifah): " || set DB_NAME=pifah

echo.
echo ========================================
echo Import Options
echo ========================================
echo 1. Import complete database (schema + data)
echo 2. Import schema only (tables structure)
echo 3. Import data only (requires schema exists)
echo.
set /p IMPORT_CHOICE="Select option (1-3): "

if "%IMPORT_CHOICE%"=="1" (
    set SQL_FILE=pifah_complete.sql
    echo Importing complete database...
) else if "%IMPORT_CHOICE%"=="2" (
    set SQL_FILE=pifah_schema.sql
    echo Importing schema only...
) else if "%IMPORT_CHOICE%"=="3" (
    set SQL_FILE=pifah_data.sql
    echo Importing data only...
) else (
    echo Invalid choice. Exiting...
    pause
    exit /b 1
)

REM Check if SQL file exists
if not exist "%SQL_FILE%" (
    echo.
    echo ERROR: File %SQL_FILE% not found!
    echo Please ensure the SQL dump file is in the same directory as this script.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Starting Import Process
echo ========================================
echo Host: %DB_HOST%
echo Port: %DB_PORT%
echo User: %DB_USER%
echo Database: %DB_NAME%
echo File: %SQL_FILE%
echo.
echo You will be prompted for the PostgreSQL password...
echo.

REM Execute the import
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f %SQL_FILE%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Import Completed Successfully!
    echo ========================================
    echo.
    echo Your PIFAH database has been restored.
    echo You can now start your application.
    echo.
) else (
    echo.
    echo ========================================
    echo Import Failed!
    echo ========================================
    echo.
    echo Please check the error messages above.
    echo Common issues:
    echo   - Database does not exist (create it first)
    echo   - Incorrect password
    echo   - PostgreSQL service not running
    echo   - Permission issues
    echo.
)

pause
