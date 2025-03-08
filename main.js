// Main app logic and event handlers
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI elements and event handlers
    setupEventListeners();
    
    // Welcome message
    logActivity('Welcome to Sentry.io Testing Zone', 'info');
    logActivity('Please enter your Sentry DSN and initialize Sentry to begin testing', 'info');
});

// Set up all event listeners
function setupEventListeners() {
    // Sentry initialization
    document.getElementById('initialize-sentry').addEventListener('click', function() {
        const dsn = document.getElementById('dsn-input').value.trim();
        if (!dsn) {
            logActivity('Please enter a valid Sentry DSN', 'warning');
            return;
        }
        initializeSentry(dsn);
    });
    
    // Error trigger buttons
    document.querySelectorAll('.trigger-btn').forEach(button => {
        button.addEventListener('click', function() {
            const errorType = this.getAttribute('data-error-type');
            triggerErrorByType(errorType);
        });
    });
    
    // User context
    document.getElementById('set-user').addEventListener('click', function() {
        const userId = document.getElementById('user-id').value.trim();
        const userEmail = document.getElementById('user-email').value.trim();
        
        if (!userId && !userEmail) {
            logActivity('Please enter at least a user ID or email', 'warning');
            return;
        }
        
        setUserContext(userId, userEmail);
    });
    
    // Tags
    document.getElementById('set-tag').addEventListener('click', function() {
        const tagKey = document.getElementById('tag-key').value.trim();
        const tagValue = document.getElementById('tag-value').value.trim();
        
        if (!tagKey || !tagValue) {
            logActivity('Please enter both a tag key and value', 'warning');
            return;
        }
        
        setTag(tagKey, tagValue);
    });
    
    // Breadcrumbs
    document.getElementById('add-breadcrumb').addEventListener('click', function() {
        const message = document.getElementById('breadcrumb-message').value.trim();
        const category = document.getElementById('breadcrumb-category').value.trim() || 'custom';
        
        if (!message) {
            logActivity('Please enter a breadcrumb message', 'warning');
            return;
        }
        
        addBreadcrumb(message, category);
    });
    
    // Transactions
    document.getElementById('start-transaction').addEventListener('click', function() {
        startTransaction();
    });
    
    document.getElementById('add-span').addEventListener('click', function() {
        addSpan();
    });
    
    document.getElementById('finish-transaction').addEventListener('click', function() {
        finishTransaction();
    });
    
    // Clear log
    document.getElementById('clear-log').addEventListener('click', function() {
        document.getElementById('activity-log').innerHTML = '';
        logActivity('Log cleared', 'info');
    });
}

// Map error type to trigger function
function triggerErrorByType(errorType) {
    // Ensure Sentry is initialized
    if (!checkSentryInitialized()) {
        logActivity('Please initialize Sentry first', 'warning');
        return;
    }
    
    // Add a breadcrumb for the error trigger action
    addBreadcrumb(`User triggered ${errorType} error`, 'user-action');
    
    // Call the appropriate error trigger function
    switch (errorType) {
        case 'reference':
            triggerReferenceError();
            break;
        case 'type':
            triggerTypeError();
            break;
        case 'syntax':
            triggerSyntaxError();
            break;
        case 'range':
            triggerRangeError();
            break;
        case 'custom':
            triggerCustomError();
            break;
        case 'promise':
            triggerPromiseError();
            break;
        case 'async':
            triggerAsyncError();
            break;
        case 'fetch':
            triggerFetchError();
            break;
        case 'xhr':
            triggerXHRError();
            break;
        case 'memory':
            triggerMemoryLeak();
            break;
        case 'cpu':
            triggerCPUSpike();
            break;
        case 'slowfunc':
            triggerSlowFunction();
            break;
        case 'dom':
            triggerDOMError();
            break;
        case 'animation':
            triggerAnimationError();
            break;
        default:
            logActivity(`Unknown error type: ${errorType}`, 'warning');
    }
}