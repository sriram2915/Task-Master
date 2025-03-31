import { create } from 'zustand';
import { Task, Priority, UserStats, Achievement, Settings, Theme } from '../types';

interface Store {
  tasks: Task[];
  stats: UserStats;
  settings: Settings;
  addTask: (title: string, description: string, priority: Priority) => void;
  editTask: (id: string, title: string, priority: Priority) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  reorderTasks: (tasks: Task[]) => void;
  updateSettings: (settings: Partial<Settings>) => void;
}

const DEFAULT_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1519681393784-d120267933ba',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071',
  'https://images.unsplash.com/photo-1477346611705-65d1883cee1e',
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-task',
    title: 'Getting Started',
    description: 'Complete your first task',
    icon: '🌟',
    unlocked: false,
  },
  {
    id: 'productive-day',
    title: 'Productive Day',
    description: 'Complete 5 tasks in a day',
    icon: '🎯',
    unlocked: false,
  },
  {
    id: 'master-organizer',
    title: 'Master Organizer',
    description: 'Have tasks in all priority levels',
    icon: '📊',
    unlocked: false,
  },
];

const calculateLevel = (xp: number) => Math.floor(xp / 100) + 1;

const loadFromStorage = () => {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const stats = JSON.parse(localStorage.getItem('stats') || JSON.stringify({
    level: 1,
    xp: 0,
    tasksCompleted: 0,
    streak: 0,
    lastCompletedAt: null,
    achievements: INITIAL_ACHIEVEMENTS,
  }));
  const settings = JSON.parse(localStorage.getItem('settings') || JSON.stringify({
    theme: 'system' as Theme,
    backgroundImage: DEFAULT_BACKGROUNDS[0],
    backgroundOverlay: 0.5,
  }));
  return { tasks, stats, settings };
};

export const useStore = create<Store>((set, get) => {
  const { tasks: initialTasks, stats: initialStats, settings: initialSettings } = loadFromStorage();

  const saveToStorage = (tasks: Task[], stats: UserStats, settings: Settings) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('stats', JSON.stringify(stats));
    localStorage.setItem('settings', JSON.stringify(settings));
  };

  const updateStreak = (stats: UserStats): UserStats => {
    const now = new Date();
    const lastCompleted = stats.lastCompletedAt ? new Date(stats.lastCompletedAt) : null;
    
    if (!lastCompleted) {
      return {
        ...stats,
        streak: 1,
        lastCompletedAt: now.getTime(),
      };
    }

    const isNextDay = 
      now.getDate() === lastCompleted.getDate() + 1 &&
      now.getMonth() === lastCompleted.getMonth() &&
      now.getFullYear() === lastCompleted.getFullYear();

    const isSameDay =
      now.getDate() === lastCompleted.getDate() &&
      now.getMonth() === lastCompleted.getMonth() &&
      now.getFullYear() === lastCompleted.getFullYear();

    if (isNextDay) {
      return {
        ...stats,
        streak: stats.streak + 1,
        lastCompletedAt: now.getTime(),
      };
    } else if (isSameDay) {
      return {
        ...stats,
        lastCompletedAt: now.getTime(),
      };
    } else {
      return {
        ...stats,
        streak: 1,
        lastCompletedAt: now.getTime(),
      };
    }
  };

  const checkAchievements = (stats: UserStats, tasks: Task[]) => {
    const updatedAchievements = [...stats.achievements];

    if (stats.tasksCompleted >= 1) {
      updatedAchievements[0].unlocked = true;
    }

    if (stats.tasksCompleted >= 5) {
      updatedAchievements[1].unlocked = true;
    }

    const priorities = new Set(tasks.map(task => task.priority));
    if (priorities.size === 3) {
      updatedAchievements[2].unlocked = true;
    }

    return updatedAchievements;
  };

  return {
    tasks: initialTasks,
    stats: initialStats,
    settings: initialSettings,

    addTask: (title: string, description: string, priority: Priority) => {
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        description,
        priority,
        completed: false,
        createdAt: Date.now(),
      };

      set(state => {
        const newTasks = [...state.tasks, newTask];
        const newStats = { ...state.stats };
        newStats.achievements = checkAchievements(newStats, newTasks);
        
        saveToStorage(newTasks, newStats, state.settings);
        return { tasks: newTasks, stats: newStats };
      });
    },

    editTask: (id: string, title: string, priority: Priority) => {
      set(state => {
        const newTasks = state.tasks.map(task =>
          task.id === id ? { ...task, title, priority } : task
        );
        saveToStorage(newTasks, state.stats, state.settings);
        return { tasks: newTasks };
      });
    },

    deleteTask: (id: string) => {
      set(state => {
        const newTasks = state.tasks.filter(task => task.id !== id);
        saveToStorage(newTasks, state.stats, state.settings);
        return { tasks: newTasks };
      });
    },

    toggleTask: (id: string) => {
      set(state => {
        const newTasks = state.tasks.map(task =>
          task.id === id ? { ...task, completed: !task.completed } : task
        );
        
        const taskCompleted = newTasks.find(t => t.id === id)?.completed;
        let newStats = { ...state.stats };
        
        if (taskCompleted) {
          newStats.tasksCompleted += 1;
          newStats.xp += 10;
          newStats.level = calculateLevel(newStats.xp);
          newStats = updateStreak(newStats);
          newStats.achievements = checkAchievements(newStats, newTasks);
        }

        saveToStorage(newTasks, newStats, state.settings);
        return { tasks: newTasks, stats: newStats };
      });
    },

    reorderTasks: (tasks: Task[]) => {
      set(state => {
        saveToStorage(tasks, state.stats, state.settings);
        return { tasks };
      });
    },

    updateSettings: (newSettings: Partial<Settings>) => {
      set(state => {
        const settings = { ...state.settings, ...newSettings };
        saveToStorage(state.tasks, state.stats, settings);
        return { settings };
      });
    },
  };
});
