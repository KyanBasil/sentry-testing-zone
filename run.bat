@echo off
echo Sentry Testing Zone Setup and Run Script

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is required but not installed. Please install Python and try again.
    exit /b 1
)

REM Check if pip is installed
pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo pip is required but not installed. Please install pip and try again.
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Run setup script to ensure directories exist
echo Setting up application directories...
python setup.py

REM Run the Flask application
echo Starting the Flask application...
echo You can access the application at http://localhost:5000
python app.py

pause
