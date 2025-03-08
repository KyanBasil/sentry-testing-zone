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

## Installation

1. Clone this repository:
```bash
git clone https://github.com/KyanBasil/sentry-testing-zone.git
cd sentry-testing-zone
```

2. Create a virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

3. Install the required dependencies:
```bash
pip install -r requirements.txt
```

## Usage

1. Run the Flask application:
```bash
python app.py
```

2. Open your web browser and navigate to:
```
http://localhost:5000
```

3. Use the web interface to test different Sentry features:
   - Click "Test Sentry Connection" to confirm integration is working
   - Trigger various error types to see how they're captured
   - Set user context, tags, and breadcrumbs
   - Create transactions and spans for performance monitoring

## Error Types

This application can generate the following types of errors:

### Python Exceptions
- Division by Zero
- Index Error
- Key Error
- Name Error
- Type Error
- Attribute Error
- Import Error
- Custom Exception

### Performance Issues
- Recursive Function Calls
- Memory-Intensive Operations
- Slow Requests

## Sentry Features

The application demonstrates these Sentry features:

- Exception monitoring
- User context setting
- Tags & custom attributes
- Breadcrumbs
- Performance monitoring with transactions and spans

## Sentry Configuration

The application is pre-configured with a Sentry DSN. If you want to use your own Sentry project:

1. Create a new project in your Sentry account
2. Get your DSN from the project settings
3. Update the DSN in `app.py`

## Contributing

Feel free to submit issues or pull requests if you have suggestions for additional error types or features that would be useful for testing Sentry's capabilities.
