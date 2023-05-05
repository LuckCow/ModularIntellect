import { useState, useEffect } from 'react';
import styled from 'styled-components';
import useTaskUpdates from '../../services/useTaskUpdates';
import Task from "./task";
import {getTasks} from "../../services/api";

const WidgetContainer = styled.div`
  background-color: rgba(40, 44, 52, 0.8);
  border-radius: 10px;
  padding: 1rem;
  width: 90%;
  margin: 0 auto;
  overflow-y: auto;
`;

const WidgetTaskItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(58, 65, 73, 0.8);
  border-radius: 5px;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.5rem;
`;

const WidgetTaskDescription = styled.p`
  color: #f0f0f0;
  font-size: 1rem;
  margin: 0;
`;

const TaskListWidget: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await getTasks();
      setTasks(response.data);
    };

    fetchTasks();
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

  return (
    <WidgetContainer>
      {tasks.map((task, index) => (
        <WidgetTaskItem key={index}>
          <WidgetTaskDescription>{task.description}</WidgetTaskDescription>
        </WidgetTaskItem>
      ))}
    </WidgetContainer>
  );
};

export default TaskListWidget;