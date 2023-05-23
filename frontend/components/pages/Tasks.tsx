import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Page from "./Page";
import { getTasks, createTask, deleteTask, updateTask } from '../../services/api';
import Task from "./task";
import { io, Socket } from 'socket.io-client';
import useTaskUpdates from "../../services/useTaskUpdates";

const TaskListContainer = styled.div`
  background-color: rgba(40, 44, 52, 0.8);
  border-radius: 10px;
  padding: 1rem;
  width: 80%;
  position: relative;
`;

const TasksContainer = styled.div`
  max-height: 80vh;
  overflow-y: auto;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(58, 65, 73, 0.8);
  border-radius: 5px;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
`;

const TaskInput = styled.input`
  background: transparent;
  border: none;
  color: #f0f0f0;
  font-size: 1rem;
  width: 100%;
  &:focus {
    outline: none;
  }
`;

const AddTaskButton = styled.button`
  background-color: rgba(58, 65, 73, 0.8);
  border: none;
  border-radius: 5px;
  color: #f0f0f0;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
`;

const DeleteTaskButton = styled.button`
  background-color: transparent;
  border: none;
  color: #f0f0f0;
  cursor: pointer;
  font-size: 1rem;
  margin-left: 0.5rem;
`;

const Title = styled.h2`
  color: #f0f0f0;
  margin-bottom: 1rem;
`;

const TaskSource = styled.span`
  color: #f0f0f0;
  font-size: 0.8rem;
  margin-left: 1rem;
  font-style: italic;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  padding: 0 1rem;
  background-color: rgba(40, 44, 52, 0.8);
  z-index: 10;
`;

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getTasks();
      setTasks(response.data);
    };

    fetchData();
  }, []);

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
  };

  const handleTaskCreated = (createdTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, createdTask]);
  };

  const { socket } = useTaskUpdates(handleTaskUpdated, handleTaskCreated);

  const handleUpdateTask = async (index: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[index].description = value;
    setTasks(newTasks);
    // Save the updated task to the backend
    await updateTask(newTasks[index].id, newTasks[index]);
  };


    const handleAddTask = async () => {
      const newTask: Task = {
        id: Date.now().toString(), // Use a timestamp as a simple unique identifier
        description: 'New Task',
        source: 'user',
        order: tasks.length,
        isCompleted: false,
      };

      setTasks([...tasks, newTask]);
      await createTask(newTask);
    };


  const handleDeleteTask = async (index: number) => {
    const taskId = tasks[index].id;
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    await deleteTask(taskId);
  };

  return (
    <Page title="Tasks - for Autonomous Execution">
      <TaskListContainer>
        <Header>
          <Title>Task List</Title>
          <AddTaskButton onClick={handleAddTask}>Add Task</AddTaskButton>
        </Header>
        <TasksContainer>
          {tasks.map((task, index) => (
            <TaskItem key={index}>
              <TaskInput
                value={task.description}
                onChange={(e) => handleUpdateTask(index, e.target.value)}
              />
              <TaskSource>Source: {task.source}</TaskSource>
              <DeleteTaskButton onClick={() => handleDeleteTask(index)}>
                Delete
              </DeleteTaskButton>
            </TaskItem>
          ))}
        </TasksContainer>
      </TaskListContainer>
    </Page>
  );
};

export default Tasks;
