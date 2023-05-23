"""Log to a file and to the Flask-SocketIO server."""
import logging
from custom_handler import SocketIOHandler


def setup_logger(socketio):
    log_format = "%(asctime)s - %(levelname)s - %(name)s - %(message)s"

    # Set up a FileHandler to log messages to a file
    file_handler = logging.FileHandler("app.log")
    file_handler.setLevel(logging.DEBUG)
    file_formatter = logging.Formatter(log_format)
    file_handler.setFormatter(file_formatter)

    # Set up the SocketIOHandler to send log messages to the Flask-SocketIO server
    socket_io_handler = SocketIOHandler(socketio)
    socket_io_handler.setLevel(logging.DEBUG)
    socket_io_formatter = logging.Formatter(log_format)
    socket_io_handler.setFormatter(socket_io_formatter)

    # Disable werkzeug logging
    log = logging.getLogger('werkzeug')
    log.setLevel(logging.ERROR)

    # Configure the root logger
    logging.basicConfig(level=logging.DEBUG, handlers=[file_handler, socket_io_handler])

    return logging.getLogger()
