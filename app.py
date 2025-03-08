import os
import uuid
import time
import random
import traceback
from datetime import datetime

import sentry_sdk
from sentry_sdk import set_user, set_tag, add_breadcrumb, start_transaction, capture_message, capture_exception
from sentry_sdk.integrations.flask import FlaskIntegration
from flask import Flask, render_template, request, jsonify, send_from_directory

# Initialize Sentry SDK with the provided DSN
sentry_sdk.init(
    dsn="https://9f4c73356acf99265361d90b06d304f3@o4508876433326080.ingest.us.sentry.io/4508939723145216",
    # Add request headers and IP for users
    send_default_pii=True,
    # Set traces_sample_rate to 1.0 to capture 100% of transactions for tracing
    traces_sample_rate=1.0,
    # Set profiles_sample_rate to 1.0 to profile 100% of sampled transactions
    profiles_sample_rate=1.0,
    # Add Flask integration
    integrations=[FlaskIntegration()]
)

# Initialize Flask app
app = Flask(__name__)

# Initialize transactions dictionary at app startup
app.transactions = {}

# Home page
@app.route('/')
def index():
    return render_template('index.html')

# Serve static files
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

# Test Sentry connection
@app.route('/test_sentry', methods=['POST'])
def test_sentry():
    try:
        # Send a test message to Sentry
        capture_message("Sentry Test: Connection verified", level="info")
        return jsonify({"status": "success", "message": "Test message sent to Sentry"})
    except Exception as e:
        capture_exception(e)
        return jsonify({"status": "error", "message": str(e)})

# Set user context
@app.route('/set_user', methods=['POST'])
def set_user_context():
    try:
        # Get JSON data safely
        data = request.get_json(silent=True) or {}
        user_id = data.get('user_id', '')
        email = data.get('email', '')
        
        # Set user context in Sentry
        set_user({
            "id": user_id,
            "email": email,
            "ip_address": request.remote_addr
        })
        
        return jsonify({"status": "success", "message": f"User context set: ID={user_id}, Email={email}"})
    except Exception as e:
        capture_exception(e)
        return jsonify({"status": "error", "message": str(e)})

# Set tag
@app.route('/set_tag', methods=['POST'])
def set_tag_endpoint():
    try:
        # Get JSON data safely
        data = request.get_json(silent=True) or {}
        key = data.get('key', '')
        value = data.get('value', '')
        
        # Set tag in Sentry
        set_tag(key, value)
        
        return jsonify({"status": "success", "message": f"Tag set: {key}={value}"})
    except Exception as e:
        capture_exception(e)
        return jsonify({"status": "error", "message": str(e)})

# Add breadcrumb
@app.route('/add_breadcrumb', methods=['POST'])
def add_breadcrumb_endpoint():
    try:
        # Get JSON data safely
        data = request.get_json(silent=True) or {}
        message = data.get('message', '')
        category = data.get('category', 'custom')
        
        # Add breadcrumb in Sentry
        add_breadcrumb(
            category=category,
            message=message,
            level="info"
        )
        
        return jsonify({"status": "success", "message": f"Breadcrumb added: {message} ({category})"})
    except Exception as e:
        capture_exception(e)
        return jsonify({"status": "error", "message": str(e)})

# Start transaction
@app.route('/start_transaction', methods=['POST'])
def start_transaction_endpoint():
    try:
        transaction_id = str(uuid.uuid4())
        # Get JSON data safely
        data = request.get_json(silent=True) or {}
        name = data.get('name', f"Transaction {transaction_id}")
        op = data.get('op', 'test')
        
        # Start transaction in Sentry
        transaction = start_transaction(name=name, op=op)
        app.transactions[transaction_id] = transaction
        
        return jsonify({
            "status": "success", 
            "message": f"Transaction started: {name}",
            "transaction_id": transaction_id
        })
    except Exception as e:
        capture_exception(e)
        return jsonify({"status": "error", "message": str(e)})

# Add span to transaction
@app.route('/add_span', methods=['POST'])
def add_span():
    try:
        # Get JSON data safely
        data = request.get_json(silent=True) or {}
        transaction_id = data.get('transaction_id', '')
        name = data.get('name', 'Test Span')
        op = data.get('op', 'test.operation')
        
        # Check if transaction exists
        if transaction_id not in app.transactions:
            return jsonify({
                "status": "error", 
                "message": "No active transaction found with that ID"
            })
        
        # Get transaction and start a child span
        transaction = app.transactions[transaction_id]
        with transaction.start_child(op=op, description=name) as span:
            # Simulate some work
            time.sleep(0.5)
            
        return jsonify({
            "status": "success", 
            "message": f"Span added to transaction: {name}"
        })
    except Exception as e:
        capture_exception(e)
        return jsonify({"status": "error", "message": str(e)})

# Finish transaction
@app.route('/finish_transaction', methods=['POST'])
def finish_transaction():
    try:
        # Get JSON data safely
        data = request.get_json(silent=True) or {}
        transaction_id = data.get('transaction_id', '')
        
        # Check if transaction exists
        if transaction_id not in app.transactions:
            return jsonify({
                "status": "error", 
                "message": "No active transaction found with that ID"
            })
        
        # Finish transaction
        transaction = app.transactions[transaction_id]
        transaction.finish()
        del app.transactions[transaction_id]
        
        return jsonify({
            "status": "success", 
            "message": f"Transaction finished: {transaction.name}"
        })
    except Exception as e:
        capture_exception(e)
        return jsonify({"status": "error", "message": str(e)})

# Error trigger endpoints
@app.route('/trigger/<error_type>', methods=['POST'])
def trigger_error(error_type):
    try:
        add_breadcrumb(
            category="error.trigger",
            message=f"User triggered {error_type} error",
            level="info"
        )
        
        # Get JSON data safely for custom errors
        data = {}
        if request.is_json:
            data = request.get_json(silent=True) or {}
        
        if error_type == "division_zero":
            # Division by zero error
            result = 1 / 0
            return jsonify({"result": result})
            
        elif error_type == "index_error":
            # Index error
            items = [1, 2, 3]
            item = items[10]
            return jsonify({"item": item})
            
        elif error_type == "key_error":
            # Key error
            empty_dict = {}
            value = empty_dict["nonexistent_key"]
            return jsonify({"value": value})
            
        elif error_type == "name_error":
            # Name error (undefined variable)
            result = undefined_variable + 10  # noqa: F821
            return jsonify({"result": result})
            
        elif error_type == "type_error":
            # Type error
            result = "string" + 10
            return jsonify({"result": result})
            
        elif error_type == "attribute_error":
            # Attribute error
            obj = object()
            result = obj.nonexistent_attribute
            return jsonify({"result": result})
            
        elif error_type == "import_error":
            # Import error
            import nonexistent_module  # noqa: F401
            return jsonify({"status": "imported"})
            
        elif error_type == "custom":
            # Custom error with message from request
            message = data.get('message', 'This is a custom error')
            
            class CustomError(Exception):
                pass
                
            raise CustomError(message)
            
        elif error_type == "unhandled":
            # Simulated unhandled exception
            def nested_function():
                raise ValueError("This is an unhandled error")
                
            nested_function()
            return jsonify({"status": "This should not be returned"})
            
        elif error_type == "recursive":
            # Stack overflow through recursion
            def recursive_function(depth=0):
                if depth > 20:  # Limit for safety
                    return
                recursive_function(depth + 1)
                
            recursive_function()
            return jsonify({"status": "Recursion completed"})
            
        elif error_type == "memory":
            # Memory-intensive operation (simulated)
            large_list = [random.random() for _ in range(1000000)]
            result = sum(large_list)
            return jsonify({"result": result})
            
        elif error_type == "slow_request":
            # Slow request simulation
            time.sleep(5)
            return jsonify({"status": "Slow request completed"})
            
        else:
            return jsonify({
                "status": "error", 
                "message": f"Unknown error type: {error_type}"
            })
            
    except Exception as e:
        # Capture the exception in Sentry
        capture_exception(e)
        
        # Return the error details to the client
        return jsonify({
            "status": "error",
            "error_type": type(e).__name__,
            "message": str(e),
            "traceback": traceback.format_exc()
        })

# Create a simple route that returns all the available requirements for GitHub Pages
@app.route('/requirements.json')
def requirements():
    return jsonify({
        "flask": "2.3.3",
        "sentry_sdk": "1.39.1"
    })

# Add a basic health check endpoint
@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "sentry": "initialized"
    })

if __name__ == '__main__':
    # Create templates directory if it doesn't exist
    os.makedirs('templates', exist_ok=True)
    
    # Create static directory if it doesn't exist
    os.makedirs('static', exist_ok=True)
    
    # Run the Flask app
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
