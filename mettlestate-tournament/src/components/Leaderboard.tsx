import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { User, LeaderboardEntry } from '../types';

export const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const users: User[] = await response.json();
        
        const entries: LeaderboardEntry[] = users
          .slice(0, 10)
          .map(user => ({
            ...user,
            points: Math.floor(Math.random() * 9000) + 1000,
          }))
          .sort((a, b) => b.points - a.points);
        
        setLeaderboard(entries);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankColor = (index: number) => {
    if (index === 0) return 'from-yellow-500 to-yellow-600';
    if (index === 1) return 'from-gray-400 to-gray-500';
    if (index === 2) return 'from-orange-600 to-orange-700';
    return 'from-gray-700 to-gray-800';
  };

  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Current Leaderboard
        </motion.h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`bg-gradient-to-r ${getRankColor(index)} p-4 rounded-lg flex items-center justify-between ${
                  index < 3 ? 'shadow-lg scale-105' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold w-8">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `#${index + 1}`}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{entry.username}</p>
                    <p className="text-sm text-gray-300">{entry.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{entry.points.toLocaleString()}</p>
                  <p className="text-sm text-gray-300">points</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};