#!/usr/bin/env python
import os
import shutil

def setup_directories():
    """Create necessary directories for the application."""
    print("Setting up directories...")
    
    # Create templates directory if it doesn't exist
    if not os.path.exists('templates'):
        print("Creating templates directory...")
        os.makedirs('templates', exist_ok=True)
    
    # Create static directory if it doesn't exist
    if not os.path.exists('static'):
        print("Creating static directory...")
        os.makedirs('static', exist_ok=True)
    
    print("Directory setup complete.")

def ensure_template_exists():
    """Ensure the index.html template exists in the templates directory."""
    template_path = os.path.join('templates', 'index.html')
    
    # Check if the template already exists
    if os.path.exists(template_path):
        print(f"Template {template_path} already exists.")
        return
    
    # Try to find the template in the repo root
    if os.path.exists('index.html'):
        print("Found index.html in repo root, copying to templates directory...")
        shutil.copy('index.html', template_path)
        return
    
    # If we get here, we need to create a basic template
    print("Creating basic index.html template...")
    with open(template_path, 'w') as f:
        f.write("""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sentry.io Python Testing Zone</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <div class="alert alert-info">
            <h1>Sentry.io Python Testing Zone</h1>
            <p>The full template was not found. Please run the setup.py script to initialize the repository properly.</p>
        </div>
        <div class="mt-4">
            <button id="test-sentry" class="btn btn-primary">Test Sentry Connection</button>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.getElementById('test-sentry').addEventListener('click', function() {
            fetch('/test_sentry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
            })
            .catch(error => {
                alert('Error: ' + error);
            });
        });
    </script>
</body>
</html>""")

if __name__ == "__main__":
    setup_directories()
    ensure_template_exists()
    print("Setup complete. You can now run the application with 'python app.py'")
