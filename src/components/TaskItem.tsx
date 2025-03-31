import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Trash2, Edit2, Check, Sparkles } from 'lucide-react';
import { Task, Priority } from '../types';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';

interface TaskItemProps {
  task: Task;
}

const priorityColors = {
  high: 'bg-gradient-to-r from-red-400 to-rose-400 border-red-200 dark:from-red-900 dark:to-rose-900 dark:border-red-800',
  medium: 'bg-gradient-to-r from-yellow-300 to-amber-300 border-yellow-200 dark:from-yellow-900 dark:to-amber-900 dark:border-yellow-800',
  low: 'bg-gradient-to-r from-green-400 to-emerald-400 border-green-200 dark:from-green-900 dark:to-emerald-900 dark:border-green-800',
};

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [showCompletionEffect, setShowCompletionEffect] = useState(false);
  
  const { toggleTask, deleteTask, editTask } = useStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEdit = () => {
    editTask(task.id, editTitle, editPriority);
    setIsEditing(false);
  };

  const handleToggle = () => {
    if (!task.completed) {
      setShowCompletionEffect(true);
      setTimeout(() => setShowCompletionEffect(false), 1000);
    }
    toggleTask(task.id);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        'group flex flex-col p-4 rounded-lg border shadow-sm transition-shadow duration-200',
        'bg-white text-black dark:bg-gray-800 dark:text-gray-300 dark:shadow-lg dark:border-gray-700',
        priorityColors[task.priority],
        task.completed && 'opacity-75'
      )}
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <button {...attributes} {...listeners} className="touch-none">
          <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </button>

        {/* Checkbox for Task Completion */}
        <label className="relative cursor-pointer">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggle}
            className="h-5 w-5 rounded border-gray-300 transition-all duration-200 checked:bg-blue-500 dark:border-gray-600"
          />
          <AnimatePresence>
            {showCompletionEffect && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                className="absolute -inset-1"
              >
                <Sparkles className="w-7 h-7 text-yellow-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </label>

        {/* Task Title & Edit Mode */}
        {isEditing ? (
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 text-black dark:text-black rounded px-2 py-1 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as Priority)}
              className="dark:bg-gray-700 text-black dark: rounded px-2 py-1 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button
              onClick={handleEdit}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-200"
            >
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            </button>
          </div>
        ) : (
          <span className={cn(
            'flex-1 transition-all duration-200 font-bold text-xl',
            task.completed ? 'line-through text-blue-500 dark:text-gray-400' : 'text-blue-900'
          )}>
            {task.title}
          </span>
        )}

        {/* Edit & Delete Buttons */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-200"
          >
            <Edit2 className="w-5 h-5 dark:text-gray-300" />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-200"
          >
            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>

      {/* Task Description */}
      <div className="w-full mt-2">
        <p className="text-sm text-gray-900 dark:text-gray-900">
          {task.description}
        </p>
      </div>
    </motion.div>
  );
};
