'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/utils/api';
import TaskForm from '@/components/TaskForm';

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await axios.get<Task[]>('/tasks');
      setTasks(res.data);
    } catch {
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
      setTasks(prev => [res.data, ...prev]);
    } catch (err) {
      console.error('Add task error:', err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err) {
      console.error('Delete task error:', err);
    }
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      const res = await axios.put<Task>(`/tasks/${id}`, { completed });
      setTasks(prev => prev.map(task => (task._id === id ? res.data : task)));
    } catch (err) {
      console.error('Toggle complete error:', err);
    }
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const updateTaskText = async () => {
    if (!editingId || !editText.trim()) return;

    try {
      const res = await axios.put<Task>(`/tasks/${editingId}`, { text: editText });
      setTasks(prev => prev.map(task => (task._id === editingId ? res.data : task)));
      setEditingId(null);
      setEditText('');
    } catch (err) {
      console.error('Update task error:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/');
    else fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <TaskForm onAdd={addTask} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {tasks.map(task => (
          <div key={task._id} className="bg-white shadow rounded-lg p-4 border">
            {editingId === task._id ? (
              <>
                <input
                  type="text"
                  className="w-full p-2 border rounded mb-2"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                />
                <button
                  onClick={updateTaskText}
                  className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditText('');
                  }}
                  className="bg-gray-300 text-black px-4 py-1 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h2
                  className={`text-lg font-semibold mb-2 cursor-pointer ${
                    task.completed ? 'line-through text-gray-400' : ''
                  }`}
                  onClick={() => toggleComplete(task._id, !task.completed)}
                >
                  {task.text}
                </h2>

                <p className="text-sm text-gray-500 mb-2">
                  {new Date(task.createdAt).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>

                <div className="flex justify-between items-center mt-4">
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
                      onClick={() => startEdit(task._id, task.text)}
                      className="text-blue-500 text-sm hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="text-red-500 text-sm hover:underline"
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
