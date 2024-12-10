from flask import Flask, send_from_directory
from flask_socketio import SocketIO
from flask_cors import CORS
import time
import os

app = Flask(__name__, static_folder='dist', static_url_path='')
CORS(app, resources={r"/*": {"origins": "http://172.16.232.96:5000"}})
socketio = SocketIO(app)


#Socket to Index.html
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory('dist', '404.html')

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(app.static_folder, path)


#Effect
room_names = []  

@socketio.on('connect')
def handle_connect():
    print(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())) + ' Client connected')
    socketio.emit('sentRoomName', room_names)

@socketio.on('disconnect')
def handle_disconnect():
    print(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())) + ' Client disconnected')

@socketio.on('requestRoomNames')
def handle_request_room_names():
    socketio.emit('sentRoomName', room_names)  

@socketio.on('sendRoomName')
def handle_send_room_name(data):
    if data not in room_names:  
        room_names.append(data) 
    print(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())) + ' Send Room Name: ' + data) 
    socketio.emit('sentRoomName', room_names)



#Run Server
if __name__ == '__main__':
    print("Server is running on port 5000")
    print("================================")
    socketio.run(app, host='0.0.0.0', port=5000)  