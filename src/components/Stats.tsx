import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Check, Flame } from 'lucide-react';
import { useStore } from '../store/useStore';

const getMotivationalMessage = (tasksCompleted: number): string => {
  if (tasksCompleted === 0) return "🚀 Ready to start your productive journey?";
  if (tasksCompleted < 3) return "👍 Great start! Keep the momentum going!";
  if (tasksCompleted < 5) return "🔥 You're on fire! Don't stop now!";
  if (tasksCompleted < 10) return "💪 Incredible progress! You're unstoppable!";
  return "🏆 You're a productivity master! 🎉";
};

export const Stats: React.FC = () => {
  const { stats } = useStore();
  const xpToNextLevel = 100;
  const progress = (stats.xp % xpToNextLevel) / xpToNextLevel * 100;
  const motivationalMessage = getMotivationalMessage(stats.tasksCompleted);

  return (
    <div className="relative bg-gradient-to-br from-purple-50 to-blue-50 p-1 rounded-lg shadow-2xl overflow-hidden">
      <div className="bg-white rounded-lg p-6">
        {/* Streak Button in Top Right Corner */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full shadow-lg hover:animate-pulse focus:outline-none"
        >
          {stats.streak > 0 ? `🔥 ${stats.streak} Day${stats.streak > 1 ? 's' : ''} Streak` : "Start Streak"}
        </motion.button>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="bg-gradient-to-br from-green-500 to-teal-400 p-3 rounded-full shadow-md">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Level {stats.level}</h2>
            <div className="text-sm text-gray-500">
              {stats.xp} XP total • {stats.tasksCompleted} tasks completed
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">Progress to Level {stats.level + 1}</span>
            <span className="text-gray-600">{stats.xp % xpToNextLevel}/{xpToNextLevel} XP</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        <motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.3 }}
  className="mb-6 text-center p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg shadow-inner"
>
  <p className="bg-gradient-to-r from-blue-800 to-pink-800 bg-clip-text text-transparent font-extrabold text-lg animate-pulse">
    {motivationalMessage}
  </p>
</motion.div>


        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2 ">
            <Star className="w-5 h-5 text-yellow-500" />
            Achievements
          </h3>
          <div className="grid grid-cols-1 gap-3">
          {stats.achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  achievement.unlocked
                    ? 'bg-gradient-to-r from-green-700 to-green-200 border-green-400'
                    : 'bg-gradient-to-r from-gray-500 to-gray-200 border-gray-300'
                }`}
              >
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <div className="font-medium text-gray-950">{achievement.title}</div>
                  <div className="text-sm text-gray-100">
                    {achievement.description}
                  </div>
                </div>
                {achievement.unlocked && (
                  <Check strokeWidth={8} className="w-5 h-5 text-green-400 ml-auto" />
                )}
              </motion.div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};
