'use client';

type Task = {
  _id: string;
  text: string;
  completed: boolean;
  createdAt: string;
};

export default function TaskItem({
  task,
  onUpdate,
  onDelete,
}: {
  task: Task;
  onUpdate: (id: string, data: object) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-between border border-gray-200">
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
          onClick={() => onUpdate(task._id, { completed: !task.completed })}
          className={`text-xs px-2 py-1 rounded-full cursor-pointer ${
            task.completed
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {task.completed ? 'Completed' : 'Pending'}
        </span>
        <button
          onClick={() => onDelete(task._id)}
          className="text-red-500 text-sm hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
