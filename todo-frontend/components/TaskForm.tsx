'use client';

import { useState } from 'react';

type Props = {
  onAdd: (text: string) => void;
};

export default function TaskForm({ onAdd }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onAdd(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
      <input
        type="text"
        placeholder="Enter your task"
        className="flex-1 border p-2 rounded"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add
      </button>
    </form>
  );
}
