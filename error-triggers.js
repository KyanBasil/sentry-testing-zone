// Functions to trigger various types of errors for Sentry testing

// JavaScript standard errors
function triggerReferenceError() {
    if (!checkSentryInitialized()) return;
    try {
        // Reference a variable that doesn't exist
        const result = undefinedVariable.property;
        return result; // This line never executes
    } catch (error) {
        Sentry.captureException(error);
        logActivity('Reference error triggered and captured', 'error');
    }
}

function triggerTypeError() {
    if (!checkSentryInitialized()) return;
    try {
        // Try to call a non-function
        const obj = {};
        obj.nonExistentFunction();
    } catch (error) {
        Sentry.captureException(error);
        logActivity('Type error triggered and captured', 'error');
    }
}

function triggerSyntaxError() {
    if (!checkSentryInitialized()) return;
    try {
        // We can't directly create a syntax error in valid code,
        // so we'll use eval to create one at runtime
        eval('function() { console.log("This is invalid syntax"); }');
    } catch (error) {
        Sentry.captureException(error);
        logActivity('Syntax error triggered and captured', 'error');
    }
}

function triggerRangeError() {
    if (!checkSentryInitialized()) return;
    try {
        // Create an array with an invalid length
        const arr = new Array(-1);
    } catch (error) {
        Sentry.captureException(error);
        logActivity('Range error triggered and captured', 'error');
    }
}

// Custom error
function triggerCustomError() {
    if (!checkSentryInitialized()) return;
    
    const message = document.getElementById('custom-error-message').value || 'This is a custom error';
    
    try {
        // Create and throw a custom error
        const customError = new Error(message);
        customError.name = 'CustomTestError';
        customError.metadata = {
            importance: 'high',
            category: 'test',
            timestamp: Date.now()
        };
        throw customError;
    } catch (error) {
        Sentry.captureException(error);
        logActivity(`Custom error triggered and captured: ${message}`, 'error');
    }
}

// Promise errors
function triggerPromiseError() {
    if (!checkSentryInitialized()) return;
    
    // Create a promise that rejects
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Promised operation failed'));
        }, 100);
    });
    
    // Intentionally not catching to demonstrate unhandled promise rejection
    promise.then(result => {
        console.log('This should not execute');
    });
    
    logActivity('Unhandled promise rejection triggered', 'warning');
}

async function triggerAsyncError() {
    if (!checkSentryInitialized()) return;
    
    try {
        // Async function that throws
        await (async () => {
            throw new Error('Error in async function');
        })();
    } catch (error) {
        Sentry.captureException(error);
        logActivity('Async function error triggered and captured', 'error');
    }
}

// Network errors
function triggerFetchError() {
    if (!checkSentryInitialized()) return;
    
    // Try to fetch a non-existent URL
    fetch('https://non-existent-domain-for-testing-sentry.xyz/resource')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            Sentry.captureException(error);
            logActivity(`Fetch error triggered and captured: ${error.message}`, 'error');
        });
}

function triggerXHRError() {
    if (!checkSentryInitialized()) return;
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://non-existent-domain-for-testing-sentry.xyz/resource');
    
    xhr.onerror = function() {
        const error = new Error('XHR request failed');
        Sentry.captureException(error);
        logActivity('XHR error triggered and captured', 'error');
    };
    
    xhr.send();
}

// Performance issues
function triggerMemoryLeak() {
    if (!checkSentryInitialized()) return;
    
    // Simulate a memory leak by creating a large array
    // This is just a demonstration and won't cause actual issues
    const memoryLeakSimulation = [];
    
    const fillMemory = function() {
        for (let i = 0; i < 10000; i++) {
            memoryLeakSimulation.push(new Array(10000).fill('memory leak simulation'));
        }
    };
    
    try {
        fillMemory();
        logActivity('Memory leak simulation triggered', 'warning');
        // Clean up to prevent actual issues
        setTimeout(() => {
            memoryLeakSimulation.length = 0;
            logActivity('Memory leak simulation cleaned up', 'info');
        }, 1000);
    } catch (error) {
        Sentry.captureException(error);
        logActivity(`Memory error triggered and captured: ${error.message}`, 'error');
    }
}

function triggerCPUSpike() {
    if (!checkSentryInitialized()) return;
    
    logActivity('CPU spike simulation started', 'warning');
    
    // Start a transaction to track performance
    const transaction = Sentry.startTransaction({
        name: 'cpu-spike-test',
        op: 'test'
    });
    
    // Perform CPU-intensive operation
    const startTime = performance.now();
    let result = 0;
    
    // Fibonacci calculation (inefficient algorithm intentionally)
    function fibonacci(n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    try {
        // Calculate Fibonacci numbers
        result = fibonacci(35); // Adjust number based on device performance
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        transaction.setData({
            'fibonacci_result': result,
            'execution_time_ms': duration
        });
        
        transaction.finish();
        
        logActivity(`CPU spike simulation completed in ${duration.toFixed(2)}ms`, 'info');
    } catch (error) {
        Sentry.captureException(error);
        transaction.finish();
        logActivity(`CPU spike error: ${error.message}`, 'error');
    }
}

function triggerSlowFunction() {
    if (!checkSentryInitialized()) return;
    
    logActivity('Slow function simulation started', 'warning');
    
    // Create a transaction for performance monitoring
    const transaction = Sentry.startTransaction({
        name: 'slow-function-test',
        op: 'test'
    });
    
    // Set current transaction for any spans created
    Sentry.configureScope(scope => {
        scope.setSpan(transaction);
    });
    
    try {
        // Create a span for the slow operation
        const span = transaction.startChild({
            op: 'slow-operation',
            description: 'Inefficient sorting algorithm'
        });
        
        // Generate large random array
        const array = Array.from({length: 10000}, () => Math.random());
        
        // Inefficient bubble sort implementation
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array.length - 1; j++) {
                if (array[j] > array[j + 1]) {
                    const temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                }
            }
            // Add a small delay to make it more visible
            if (i % 100 === 0) {
                const subspan = span.startChild({
                    op: 'progress-update',
                    description: `Completed ${(i / array.length * 100).toFixed(1)}%`
                });
                subspan.finish();
            }
        }
        
        span.finish();
        transaction.finish();
        
        logActivity('Slow function simulation completed', 'info');
    } catch (error) {
        Sentry.captureException(error);
        if (transaction) transaction.finish();
        logActivity(`Slow function error: ${error.message}`, 'error');
    }
}

// DOM & UI Errors
function triggerDOMError() {
    if (!checkSentryInitialized()) return;
    
    try {
        // Try to modify a read-only property
        document.createElement('div').tagName = 'INVALID';
    } catch (error) {
        Sentry.captureException(error);
        logActivity('DOM exception triggered and captured', 'error');
    }
}

function triggerAnimationError() {
    if (!checkSentryInitialized()) return;
    
    try {
        // Create temporary element for animation
        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.width = '100px';
        element.style.height = '100px';
        element.style.backgroundColor = 'red';
        element.style.left = '-999px';
        document.body.appendChild(element);
        
        // Intentionally cause animation frame issues
        let frameCount = 0;
        const maxFrames = 10;
        
        function animateWithError(timestamp) {
            if (frameCount < maxFrames) {
                frameCount++;
                
                // Access invalid property to trigger error
                if (frameCount === 5) {
                    element.animate(null, 1000).nonExistentMethod();
                }
                
                requestAnimationFrame(animateWithError);
            } else {
                // Clean up
                document.body.removeChild(element);
            }
        }
        
        requestAnimationFrame(animateWithError);
        
        logActivity('Animation error triggered', 'warning');
    } catch (error) {
        Sentry.captureException(error);
        logActivity(`Animation error captured: ${error.message}`, 'error');
    }
}