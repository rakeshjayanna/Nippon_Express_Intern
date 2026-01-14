@echo off
REM Drop and recreate the nippon_express database
echo Dropping and recreating database nippon_express...
mysql -uroot -p123456 -e "DROP DATABASE IF EXISTS nippon_express; CREATE DATABASE nippon_express CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if %ERRORLEVEL% neq 0 (
    echo Failed to reset database!
    pause
    exit /b 1
)
echo Database reset complete!
pause
