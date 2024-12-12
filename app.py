from flask import Flask, send_from_directory, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import time
import os
import random

# app = Flask(__name__, static_folder='dist', static_url_path='')
# CORS(app, resources={r"/*": {"origins": "http://192.168.182.140:5000"}})
# socketio = SocketIO(app)

#Socket to Index.html
# @app.route('/')
# def index():
#     return send_from_directory(app.template_folder, 'index.html')

# @app.errorhandler(404)
# def not_found(e):
#     return send_from_directory(app.template_folder, '404.html')

# @app.route('/<path:path>')
# def static_proxy(path):
#     return send_from_directory(app.static_folder, path)

app = Flask(__name__, 
            static_folder='./build/assets',  # For serving static assets
            template_folder='./build')       # For serving index.html
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    try:
        if path.startswith('assets/'):
            return send_from_directory('./build', path)
        return send_from_directory(app.template_folder, 'index.html')
    except Exception as e:
        print(f"Error serving file: {e}")
        return "Error: Make sure to build the frontend first and place it in the 'build' directory"

#RESET
@socketio.on('reset')
def handle_reset():
    global groups, connected_players
    groups = {role: [] for role in groups.keys()}
    connected_players = []
    emit('reset', broadcast=True)


#Effect
connected_players = []

@socketio.on('connect')
def handle_connect():
    print(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())) + ' Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())) + ' Client disconnected')


#Ball Logic
@socketio.on('newPlayer')
def handle_new_player(name):
    if name not in connected_players:
        connected_players.append(name)
    emit('updatePlayerList', connected_players, broadcast=True)
    emit('updateGroups', groups, broadcast=True)

groups = {
    'Logic': [],
    'Process': [],
    'Optimism': [],
    'Facts': [],
    'Danger': [],
    'Emotion': []
}

@socketio.on('startGame')
def handle_start_game(name):
    global groups
    
    # Check if player is already in any group
    for group_players in groups.values():
        if name in group_players:
            return

    # Get available roles (roles with fewer players)
    available_roles = []
    min_players = min(len(players) for players in groups.values())
    for role, players in groups.items():
        if len(players) <= min_players:
            available_roles.append(role)
    
    # Randomly assign to one of the available roles
    selected_role = random.choice(available_roles)
    groups[selected_role].append(name)
    
    print(f"Updated groups: {groups}")
    emit('gameStarted', groups, broadcast=True)
    emit('updateGroups', groups, broadcast=True)

@socketio.on('requestPlayerList')
def handle_request_player_list():
    if any(groups[role] for role in groups):  # If game has started
        emit('updateGroups', groups, to=request.sid)
    else:
        emit('updatePlayerList', connected_players, to=request.sid)

@socketio.on('playerClicked')
def handle_player_click(data):
    player = data['player']
    print(f"{player} was clicked.")
    
    emit('playerClickedNotification', {'player': player}, broadcast=True)
    
    emit('startGame', {'selectedPlayer': player}, broadcast=True)

@socketio.on('intercept')
def handle_intercept(data):
    my_name = data['myName']
    selected_player = data['selectedPlayer']
    emit('interceptNotification', {'intercepter': my_name, 'intercepted': selected_player}, broadcast=True)

@socketio.on('startTimer')
def handle_start_timer(data):
    time = data['time']
    emit('timerUpdate', {'time': time}, broadcast=True)



#Roulette Logic
@socketio.on('makeRoulette')
def handle_make_roulette(data):
    and_group = data.get('andGroup', [])
    but_group = data.get('butGroup', [])
    
    roulette_dict = {name: '肯定的' for name in and_group}
    roulette_dict.update({name: '批判的' for name in but_group})

    items = list(roulette_dict.items())
    random.shuffle(items)
    shuffled_dict = dict(items)
    
    emit('rouletteCreated', shuffled_dict, broadcast=True)

@socketio.on('spinRoulette')
def handle_spin_roulette(data):
    prize_number = data.get('prizeNumber')
    emit('spinRoulette', {'prizeNumber': prize_number}, broadcast=True)

@socketio.on('spinResult')
def handle_spin_result(data):
    result = data.get('result', 'No result')
    emit('broadcastSpinResult', {'result': result}, broadcast=True)


#Run Server
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    socketio.run(app, host='0.0.0.0', port=port)