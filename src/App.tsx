import React, { useEffect } from 'react';
import { Layout } from 'lucide-react';
import { motion } from 'framer-motion';
import { AddTask } from './components/AddTask';
import { TaskList } from './components/TaskList';
import { Stats } from './components/Stats';
import { MenuBar } from './components/MenuBar';
import { useStore } from './store/useStore';

function App() {
  const { settings } = useStore();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
      if (settings.theme === 'system') {
        document.documentElement.setAttribute(
          'data-theme',
          mediaQuery.matches ? 'dark' : 'light'
        );
      } else {
        document.documentElement.setAttribute('data-theme', settings.theme);
      }
    };

    mediaQuery.addEventListener('change', updateTheme);
    updateTheme();

    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [settings.theme]);

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {settings.backgroundImage && (
        <>
          <div
            className="fixed inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${settings.backgroundImage})` }}
          />
          {/* <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[rgb(var(--bg-primary))] to-[rgb(var(--bg-primary))] opacity-90" /> */}
          <div
            className="fixed inset-0 bg-black transition-opacity duration-500"
             style={{ opacity: settings.backgroundOverlay }}
          />
          
        </>
      )}

      <div className="relative">
        <MenuBar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-3 mb-8"
          >
            <Layout className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Task Master</h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <AddTask />
              <TaskList />
            </div>
            <div>
              <Stats />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;