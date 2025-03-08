# Sentry.io Testing Zone

A simple web application designed to help test and demonstrate Sentry.io's error monitoring and performance tracking capabilities.

## Features

- Test various types of JavaScript errors and see how they're captured in Sentry
- Trigger performance issues for monitoring
- Add custom context, tags, and breadcrumbs
- Create and monitor transactions and spans
- Simple, user-friendly interface

## Usage

1. Clone this repository
2. Open `index.html` in your browser
3. Enter your Sentry DSN (can be found in your Sentry project settings)
4. Click "Initialize Sentry"
5. Use the various buttons to trigger different types of errors and monitoring features

## Error Types

This application can generate the following types of errors:

### JavaScript Exceptions
- Reference Error
- Type Error
- Syntax Error
- Range Error

### Custom Errors
- Custom error with metadata

### Promise Rejections
- Unhandled Promise rejection
- Async function error

### Network & API Errors
- Fetch Error
- XHR Error

### Performance Issues
- Memory Leak simulation
- CPU Spike simulation
- Slow Function execution

### DOM & UI Errors
- DOM Exception
- Animation Error

## Context & Monitoring Features

The application also allows you to test these Sentry features:

- User context setting
- Adding tags 
- Creating breadcrumbs
- Performance monitoring with transactions and spans

## Getting a Sentry DSN

To use this application, you'll need a Sentry DSN (Data Source Name):

1. Sign up or log in to [Sentry.io](https://sentry.io/)
2. Create a new project or use an existing one
3. Go to Project Settings > Client Keys (DSN)
4. Copy your DSN, which will look like: `https://examplePublicKey@o0.ingest.sentry.io/0`

## Contributing

Feel free to submit issues or pull requests if you have suggestions for additional error types or features that would be useful for testing Sentry's capabilities.