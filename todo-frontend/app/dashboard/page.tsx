'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/api';
import TaskForm from '@/components/TaskForm';
import TaskItem from '@/components/TaskItem';
import { useRouter } from 'next/navigation';

type Task = {
  _id: string;
  text: string;
  completed: boolean;
  createdAt: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await axios.get<Task[]>('/tasks');
      setTasks(res.data);
    } catch (err) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (text: string) => {
    try {
      const res = await axios.post<Task>('/tasks', { text });
      setTasks((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    try {
      const res = await axios.put<Task>(`/tasks/${id}`, data);
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    } else {
      fetchTasks();
    }
  }, []);

  return (
    <div className="p-4">
      <TaskForm onAdd={addTask} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        ))}
      </div>
    </div>
  );
}
