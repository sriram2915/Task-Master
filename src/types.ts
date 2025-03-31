export type Priority = 'high' | 'medium' | 'low';

export type Theme = 'light' | 'dark' | 'system';

export interface Settings {
  theme: Theme;
  backgroundImage: string | null;
  backgroundOverlay: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  createdAt: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface UserStats {
  level: number;
  xp: number;
  tasksCompleted: number;
  streak: number;
  lastCompletedAt: number | null;
  achievements: Achievement[];
}