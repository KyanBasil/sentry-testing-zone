// Sentry configuration and initialization
// Note: Sentry is already initialized in the HTML

// We use this global flag
let currentTransaction = null;

// Initialize Sentry with provided DSN
function initializeSentry(dsn) {
    // For the embedded script version, we just confirm it's working
    try {
        if (typeof Sentry === 'undefined') {
            logActivity('Error: Sentry SDK not found. Refresh page or check console.', 'error');
            updateInitStatus('SDK Not Found', false);
            return false;
        }

        // Try to send a test event
        Sentry.captureMessage("Sentry test message - initialization check");
        
        // Add a test event to confirm Sentry is working
        Sentry.addBreadcrumb({
            category: 'test',
            message: 'Manual initialization confirmed',
            level: 'info'
        });
        
        // Set some test tags
        Sentry.setTag("test_session", "true");
        Sentry.setTag("initialized_at", new Date().toISOString());
        
        logActivity('Sentry confirmed working and ready to capture events', 'success');
        updateInitStatus('Ready', true);
        
        window.sentryInitialized = true;
        return true;
    } catch (error) {
        logActivity(`Error confirming Sentry: ${error.message}`, 'error');
        updateInitStatus('Error', false);
        window.sentryInitialized = false;
        return false;
    }
}

// Update the initialization status display
function updateInitStatus(message, success) {
    const statusElement = document.getElementById('init-status');
    if (statusElement) {
        statusElement.classList.remove('success', 'error');
        statusElement.classList.add(success ? 'success' : 'error');
        statusElement.querySelector('span').textContent = message;
    }
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
    if (typeof Sentry === 'undefined') {
        logActivity('Sentry is not initialized. Please check console.', 'warning');
        return false;
    }
    
    // Assume it's initialized if we got this far
    return true;
}

// Log activity to the UI
function logActivity(message, level = 'info') {
    const logElement = document.getElementById('activity-log');
    if (!logElement) {
        console.log(`[${level.toUpperCase()}] ${message}`);
        return;
    }
    
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('p');
    logEntry.classList.add(level);
    logEntry.textContent = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    logElement.appendChild(logEntry);
    logElement.scrollTop = logElement.scrollHeight;
    
    // Also log to console for debugging
    console.log(`[${level.toUpperCase()}] ${message}`);
}

// Check Sentry on page load
document.addEventListener('DOMContentLoaded', function() {
    // Welcome message
    logActivity('Welcome to Sentry.io Testing Zone', 'info');
    
    if (typeof Sentry !== 'undefined') {
        logActivity('Sentry SDK detected. Click "Confirm Sentry Works" to verify', 'info');
        updateInitStatus('SDK Detected', true);
    } else {
        logActivity('Sentry SDK not detected. Check console for errors', 'error');
        updateInitStatus('SDK Not Found', false);
    }
});