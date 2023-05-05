// src/api.ts
import axios from "axios";
import Task from "../components/pages/task";

const API_BASE_URL = "http://127.0.0.1:5000";

export const getTasks = () => axios.get(`${API_BASE_URL}/tasks`);
export const createTask = (task: Task) => axios.post(`${API_BASE_URL}/tasks`, task);
export const updateTask = (id: string, task: Task) => axios.put(`${API_BASE_URL}/tasks/${id}`, task);
export const deleteTask = (id: string) => axios.delete(`${API_BASE_URL}/tasks/${id}`);
export const reorderTasks = (tasks: Task[]) => axios.put(`${API_BASE_URL}/tasks/reorder`, tasks);
