import logging
from flask_socketio import SocketIO


class SocketIOHandler(logging.Handler):
    def __init__(self, socketio: SocketIO):
        logging.Handler.__init__(self)
        self.socketio = socketio

    def emit(self, record):
        log_entry = self.format(record)
        self.socketio.emit("new_log", log_entry)
