# Sentry.io Python Testing Zone

A simple Flask web application designed to help test and demonstrate Sentry.io's error monitoring and performance tracking capabilities with Python integration.

## Features

- Test various types of Python exceptions and see how they're captured in Sentry
- Trigger performance issues for monitoring
- Add custom context, tags, and breadcrumbs
- Create and monitor transactions and spans
- Simple, user-friendly web interface

## Prerequisites

- Python 3.7+
- pip (Python package manager)

## Quick Start

### On Linux/Mac:
```bash
# Clone the repository
git clone https://github.com/KyanBasil/sentry-testing-zone.git
cd sentry-testing-zone

# Run the setup script (this will create a virtual environment, install dependencies and run the app)
chmod +x run.sh
./run.sh
```

### On Windows:
```batch
# Clone the repository
git clone https://github.com/KyanBasil/sentry-testing-zone.git
cd sentry-testing-zone

# Run the setup script (this will create a virtual environment, install dependencies and run the app)
run.bat
```

### Manual Setup:
If the scripts don't work for you, follow these manual steps:

```bash
# Clone the repository
git clone https://github.com/KyanBasil/sentry-testing-zone.git
cd sentry-testing-zone

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate

# Install the required dependencies
pip install -r requirements.txt

# Run the setup script to ensure proper directories
python setup.py

# Run the Flask application
python app.py
```

## Accessing the Application

Once the application is running, open your web browser and navigate to:
```
http://localhost:5000
```

## Using the Testing Zone

1. **Test Sentry Connection:**
   - Click "Test Sentry Connection" to confirm integration is working
   - A test message will be sent to Sentry and logged in the activity log

2. **Trigger Errors:**
   - Use the buttons in the "Error Types" section to trigger different Python exceptions
   - Each error will be captured by Sentry and logged in the activity log
   - Custom errors can be created with your own error message

3. **Test Performance Issues:**
   - Trigger memory-intensive operations, slow requests, or recursion
   - Monitor performance in your Sentry dashboard

4. **Add Context:**
   - Set user context with ID and email
   - Add custom tags to categorize events
   - Create breadcrumbs to trace user actions

5. **Monitor Transactions:**
   - Start a transaction to measure performance
   - Add spans to track specific operations
   - Finish the transaction to complete the performance trace

## Troubleshooting

If you encounter issues:

1. **Check the console output** for any error messages when running the Flask app
2. **Verify your Sentry DSN** is correct in the `app.py` file
3. **Check templates directory** exists and contains `index.html`
4. **Verify Python version** (3.7+ required)
5. **Check if required packages are installed** by running `pip freeze`

## Customizing the DSN

The application uses the pre-configured DSN in the `app.py` file. If you want to use your own Sentry project:

1. Create a new project in your Sentry account
2. Get your DSN from the project settings
3. Update the DSN in `app.py`

## Contributing

Feel free to submit issues or pull requests if you have suggestions for additional error types or features that would be useful for testing Sentry's capabilities.
