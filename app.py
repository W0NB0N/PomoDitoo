from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize 16x16 pixel grid (black by default)
pixels = [['#000000' for _ in range(16)] for _ in range(16)]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/set_pixel', methods=['POST'])
def set_pixel():
    data = request.json
    x, y, color = data['x'], data['y'], data['color']
    pixels[y][x] = color
    # Notify all clients to update this pixel
    socketio.emit('update_pixel', {'x': x, 'y': y, 'color': color})
    return jsonify(success=True)

@app.route('/set_grid', methods=['POST'])
def set_grid():
    global pixels
    pixels = request.json['pixels']
    socketio.emit('update_grid', {'pixels': pixels})
    return jsonify(success=True)

@socketio.on('request_grid')
def handle_request_grid():
    emit('update_grid', {'pixels': pixels})

if __name__ == '__main__':
    print("running...")
    socketio.run(app, debug=True)
