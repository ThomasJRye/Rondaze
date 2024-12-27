from flask import Flask, send_from_directory
import os

app = Flask(__name__)

# Serve static files like JS, CSS, and HTML from the current directory
@app.route('/<path:filename>')
def serve_static_files(filename):
    return send_from_directory(os.getcwd(), filename)

@app.route('/')
def serve_index():
    return send_from_directory(os.getcwd(), 'index.html')

if __name__ == "__main__":
    app.run(debug=True, use_reloader=True)