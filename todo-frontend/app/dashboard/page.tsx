'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/api';
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
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [newTaskText, setNewTaskText] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await axios.get<Task[]>('/tasks');
      setTasks(res.data);
    } catch {
      alert('Session expired. Please login again.');
      localStorage.removeItem('token');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTaskText.trim()) return;
    try {
      const res = await axios.post<Task>('/tasks', { text: newTaskText });
      setTasks((prev) => [...prev, res.data]);
      setNewTaskText('');
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    try {
      const res = await axios.put<Task>(`/tasks/${id}`, data);
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      setEditId(null);
      setEditText('');
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
    if (!token) router.push('/');
    else fetchTasks();
  }, []);

  return (
    <div className="p-6">
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter new task"
          className="border p-2 flex-1 rounded"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white shadow-md rounded-xl p-4 border flex flex-col justify-between"
          >
            {editId === task._id ? (
              <>
                <input
                  className="w-full p-2 mb-2 border rounded"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => updateTask(task._id, { text: editText })}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditId(null);
                      setEditText('');
                    }}
                    className="text-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">{task.text}</h2>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(task.createdAt).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>

                <div className="flex justify-between items-center mt-auto">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      task.completed
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditId(task._id);
                        setEditText(task.text);
                      }}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
