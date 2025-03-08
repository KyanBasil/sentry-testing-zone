// Sentry configuration and initialization
let sentryInitialized = false;
let currentTransaction = null;

// Initialize Sentry with provided DSN
function initializeSentry(dsn) {
    try {
        Sentry.init({
            dsn: dsn,
            integrations: [
                new Sentry.BrowserTracing(),
                new Sentry.Replay({
                    maskAllText: false,
                    blockAllMedia: false,
                }),
            ],
            // Performance monitoring
            tracesSampleRate: 1.0,
            // Session replay
            replaysSessionSampleRate: 1.0,
            replaysOnErrorSampleRate: 1.0,
            // Enable debug mode for testing
            debug: true,
            // Environment
            environment: 'testing',
            // Release tracking
            release: 'sentry-testing-zone@1.0.0',
        });
        
        sentryInitialized = true;
        logActivity('Sentry initialized successfully', 'success');
        updateInitStatus('Initialized', true);
        return true;
    } catch (error) {
        logActivity(`Failed to initialize Sentry: ${error.message}`, 'error');
        updateInitStatus('Failed to initialize', false);
        return false;
    }
}

// Update the initialization status display
function updateInitStatus(message, success) {
    const statusElement = document.getElementById('init-status');
    statusElement.classList.remove('success', 'error');
    statusElement.classList.add(success ? 'success' : 'error');
    statusElement.querySelector('span').textContent = message;
}

// Set user context for Sentry
function setUserContext(userId, email) {
    if (!checkSentryInitialized()) return;
    
    try {
        Sentry.setUser({
            id: userId,
            email: email,
            ip_address: '{{auto}}',
        });
        
        logActivity(`User context set: ID=${userId}, Email=${email}`, 'info');
        return true;
    } catch (error) {
        logActivity(`Failed to set user context: ${error.message}`, 'error');
        return false;
    }
}

// Set a tag for Sentry
function setTag(key, value) {
    if (!checkSentryInitialized()) return;
    
    try {
        Sentry.setTag(key, value);
        logActivity(`Tag set: ${key}=${value}`, 'info');
        return true;
    } catch (error) {
        logActivity(`Failed to set tag: ${error.message}`, 'error');
        return false;
    }
}

// Add a breadcrumb
function addBreadcrumb(message, category) {
    if (!checkSentryInitialized()) return;
    
    try {
        Sentry.addBreadcrumb({
            message: message,
            category: category,
            level: 'info',
            timestamp: Date.now() / 1000,
        });
        
        logActivity(`Breadcrumb added: ${message} (${category})`, 'info');
        return true;
    } catch (error) {
        logActivity(`Failed to add breadcrumb: ${error.message}`, 'error');
        return false;
    }
}

// Start a transaction for performance monitoring
function startTransaction(name = 'Test Transaction', op = 'test') {
    if (!checkSentryInitialized()) return;
    
    try {
        if (currentTransaction) {
            logActivity('Warning: Ending previous unfinished transaction', 'warning');
            currentTransaction.finish();
        }
        
        currentTransaction = Sentry.startTransaction({
            name: name,
            op: op,
        });
        
        Sentry.configureScope(scope => {
            scope.setSpan(currentTransaction);
        });
        
        logActivity(`Transaction started: ${name}`, 'info');
        return true;
    } catch (error) {
        logActivity(`Failed to start transaction: ${error.message}`, 'error');
        return false;
    }
}

// Add a span to the current transaction
function addSpan(name = 'Test Span', op = 'test.operation') {
    if (!checkSentryInitialized()) return;
    if (!currentTransaction) {
        logActivity('No active transaction to add span to', 'warning');
        return false;
    }
    
    try {
        const span = currentTransaction.startChild({
            op: op,
            description: name
        });
        
        // Simulate some work
        setTimeout(() => {
            span.finish();
            logActivity(`Span finished: ${name}`, 'info');
        }, 500);
        
        logActivity(`Span added: ${name}`, 'info');
        return true;
    } catch (error) {
        logActivity(`Failed to add span: ${error.message}`, 'error');
        return false;
    }
}

// Finish the current transaction
function finishTransaction() {
    if (!checkSentryInitialized()) return;
    if (!currentTransaction) {
        logActivity('No active transaction to finish', 'warning');
        return false;
    }
    
    try {
        currentTransaction.finish();
        logActivity(`Transaction finished: ${currentTransaction.name}`, 'success');
        currentTransaction = null;
        return true;
    } catch (error) {
        logActivity(`Failed to finish transaction: ${error.message}`, 'error');
        return false;
    }
}

// Helper to check if Sentry is initialized
function checkSentryInitialized() {
    if (!sentryInitialized) {
        logActivity('Sentry is not initialized. Please initialize it first.', 'warning');
        return false;
    }
    return true;
}

// Log activity to the UI
function logActivity(message, level = 'info') {
    const logElement = document.getElementById('activity-log');
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('p');
    logEntry.classList.add(level);
    logEntry.textContent = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    logElement.appendChild(logEntry);
    logElement.scrollTop = logElement.scrollHeight;
}