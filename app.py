from flask import Flask, send_from_directory
from flask_socketio import SocketIO
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='dist', static_url_path='')
CORS(app, resources={r"/*": {"origins": "http://172.16.232.96:5000"}})
socketio = SocketIO(app)

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory('dist', '404.html')

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)  