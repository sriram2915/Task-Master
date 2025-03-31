import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Moon, Sun, Image, Info, X } from 'lucide-react';
import { Theme } from '../types';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';

const DEFAULT_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1519681393784-d120267933ba',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071',
  'https://images.unsplash.com/photo-1477346611705-65d1883cee1e',
];

export const MenuBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSettings } = useStore();

  const handleThemeChange = (theme: Theme) => {
    updateSettings({ theme });
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-[rgb(var(--card-bg))] p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Settings className="w-6 h-6 text-[rgb(var(--text-primary))]" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed right-0 top-0 h-full w-80 bg-[rgb(var(--card-bg))] shadow-2xl z-50 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Settings</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-[rgb(var(--hover-bg))] rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Background
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {DEFAULT_BACKGROUNDS.map((bg) => (
                      <button
                        key={bg}
                        onClick={() => updateSettings({ backgroundImage: bg })}
                        className={cn(
                          'h-20 rounded-lg overflow-hidden',
                          settings.backgroundImage === bg && 'ring-2 ring-blue-500'
                        )}
                      >
                        <img
                          src={`${bg}?auto=format&fit=crop&w=100&q=60`}
                          alt="Background option"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  <div className="mt-3">
                    <label className="text-sm text-[rgb(var(--text-primary))] opacity-75 mb-1 block">
                      Overlay Opacity
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.backgroundOverlay}
                      onChange={(e) =>
                        updateSettings({
                          backgroundOverlay: parseFloat(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Sun className="w-5 h-5" />
                    Theme
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {(['light', 'dark', 'system'] as Theme[]).map((theme) => (
                      <button
                        key={theme}
                        onClick={() => handleThemeChange(theme)}
                        className={cn(
                          'px-3 py-2 rounded-lg capitalize',
                          settings.theme === theme
                            ? 'bg-blue-500 text-white'
                            : 'bg-[rgb(var(--hover-bg))] hover:bg-opacity-80'
                        )}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    About
                  </h3>
                  <div className="text-sm text-[rgb(var(--text-primary))] opacity-75">
                    <p>Task Master v1.0.0</p>
                    <p className="mt-1">
                      A beautiful and productive task management app with
                      gamification features.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};