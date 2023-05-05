// useTaskUpdates.ts
import { useState, useEffect, useContext } from 'react';
import { io, Socket } from 'socket.io-client';
import Task from '../components/pages/task';
import {SocketContext} from "./socket";

const useTaskUpdates = (
  onTaskUpdated: (updatedTask: Task) => void,
  onTaskCreated: (createdTask: Task) => void
): { socket: Socket | null } => {
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;

    socket.on('task_updated', (updatedTask: Task) => {
      onTaskUpdated(updatedTask);
    });

    socket.on('task_created', (createdTask: Task) => {
      onTaskCreated(createdTask);
    });

    return () => {
      socket.off('task_updated');
      socket.off('task_created');
    };
  }, [socket, onTaskUpdated, onTaskCreated]);

  return { socket };
};

export default useTaskUpdates;