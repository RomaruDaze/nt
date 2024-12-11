from flask import Flask, send_from_directory, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import time
import os
import random

app = Flask(__name__, static_folder='dist', static_url_path='')
CORS(app, resources={r"/*": {"origins": "http://192.168.179.22:5000"}})
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
connected_players = []

@socketio.on('connect')
def handle_connect():
    print(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())) + ' Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())) + ' Client disconnected')

@socketio.on('newPlayer')
def handle_new_player(name):
    if name in connected_players:
        emit('nameTaken', {'message': 'この名前はすでに使用れています。'}, to=request.sid)
    else:
        connected_players.append(name)  
        emit('updatePlayerList', connected_players, broadcast=True) 

andgroup = []
butgroup = []

@socketio.on('startGame')
def handle_start_game(name):
    global andgroup, butgroup
    if random.choice([True, False]):
        andgroup.append(name)
    else:
        butgroup.append(name)

    # Log the updated groups
    print(f"Updated groups: AND: {andgroup}, BUT: {butgroup}")
    
    emit('gameStarted', {'message': 'Game is starting!', 'andgroup': andgroup, 'butgroup': butgroup}, broadcast=True)

@socketio.on('requestPlayerList')
def handle_request_player_list():
    emit('updatePlayerList', {'andgroup': andgroup, 'butgroup': butgroup}, to=request.sid)

@socketio.on('playerClicked')
def handle_player_click(data):
    player = data['player']
    print(f"{player} was clicked.")
    
    # Emit to all clients to notify them of the clicked player
    emit('playerClickedNotification', {'player': player}, broadcast=True)
    
    # Emit the startGame event with the selected player
    emit('startGame', {'selectedPlayer': player}, broadcast=True)

@socketio.on('intercept')
def handle_intercept(data):
    my_name = data['myName']
    selected_player = data['selectedPlayer']
    emit('interceptNotification', {'intercepter': my_name, 'intercepted': selected_player}, broadcast=True)

#Run Server
if __name__ == '__main__':
    print("Server is running on port 5000")
    print("================================")
    socketio.run(app, host='0.0.0.0', port=5000,allow_unsafe_werkzeug=True)  