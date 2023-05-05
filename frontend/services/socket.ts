import socketio from "socket.io-client";
import { Socket } from "socket.io-client";
import React from "react";

export const socket = socketio('http://127.0.0.1:5000');

interface SocketContextValue {
  socket: Socket;
}

export const SocketContext = React.createContext<SocketContextValue>({
  socket: {} as Socket,
});