import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, ArrowUp, ArrowDown, User, Coins   } from 'lucide-react';
import {
Select,
SelectContent,
SelectGroup,
SelectItem,
SelectLabel,
SelectTrigger,
SelectValue,
} from "@/components/ui/select"

interface User {
id: number;
name: string;
username: string;
}

interface LeaderboardEntry extends User {
points: number;
}

export const Leaderboard: React.FC = () => {
const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

const [isUsername, setIsUsername] = useState<boolean>(false);
const [isArrowUp, setIsArrowUp] = useState<boolean>(false);

useEffect(() => {
const fetchLeaderboard = async () => {
  try {
    setLoading(true);
    setError(null);
    
    console.log('Fetching leaderboard data...');
    
    const [response] = await Promise.all([
      fetch('https://jsonplaceholder.typicode.com/users'),
      new Promise(resolve => setTimeout(resolve, 3000))
    ]);
    
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard data');
    }
    
    const users: User[] = await response.json();
    console.log('Fetched users:', users);
    
    const entries: LeaderboardEntry[] = users
      .slice(0, 10)
      .map(user => ({
        ...user,
        points: Math.floor(Math.random() * 9000) + 1000,
      }))
      .sort((a, b) => b.points - a.points);
    
    console.log('Leaderboard entries:', entries);
    setLeaderboard(entries);
    setFilteredLeaderboard(entries);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
    console.error('Error fetching leaderboard:', err);
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

const getRankEmoji = (index: number) => {
if (index === 0) return '🥇';
if (index === 1) return '🥈';
if (index === 2) return '🥉';
return `#${index + 1}`;
};

const getProfileImage = (index: number) => {
if (index === 0) return '/player1.jpg';
if (index === 1) return '/player2.jpg';
if (index === 2) return '/player3.jpg';
return null;
};

const getBorderColor = (index: number) => {
if (index === 0) return 'border-yellow-400';
if (index === 1) return 'border-gray-400';
if (index === 2) return 'border-orange-500';
return 'border-gray-600';
};

const handleSortBy = (value: string) => {
let filtered: LeaderboardEntry[] = [];

setIsArrowUp(value == "arrowUp");

if(value == "arrowUp") {
  if(isUsername){
      filtered = [...leaderboard].sort((a, b) => a.username.localeCompare(b.username));
  } else {
    filtered = [...leaderboard].sort((a, b) => b.points - a.points);
  }
} 
else {
  if(isUsername) {
    filtered = [...leaderboard].sort((a, b) => b.username.localeCompare(a.username));
  } else {
    filtered = [...leaderboard].sort((a, b) => a.points - b.points);
  }
}

setFilteredLeaderboard(filtered);
}

const handleFilterBy = (value: string) => {
setIsUsername(value == "username");
handleSortBy(isArrowUp ? 'arrowUp' : 'arrowDown');
}

console.log('Render state:', { loading, error, leaderboardLength: leaderboard.length });

return (
<section id="leaderboard" className="py-20 px-4 bg-gray-900">
  <div className="max-w-4xl mx-auto">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-bold text-center mb-16"
    >
      Current Leaderboard
    </motion.h2>
    
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="loading"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center items-center h-64"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="relative mb-6"
            >
              <div className="w-20 h-20 border-4 border-gray-700 border-t-red-500 rounded-full"></div>
            </motion.div>
            
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 w-20 h-20 bg-red-500 rounded-full blur-xl"
            />
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-gray-300 text-xl font-semibold mb-4"
          >
            Loading leaderboard
          </motion.p>
          
          <div className="flex gap-3">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.3,
                  ease: "easeInOut"
                }}
                className="w-3 h-3 bg-red-500 rounded-full"
              />
            ))}
          </div>
          
          <div className="w-64 h-1 bg-gray-800 rounded-full mt-8 overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="h-full w-1/3 bg-gradient-to-r from-red-500 to-orange-500"
            />
          </div>
        </motion.div>
      )}
      
      {!loading && error && (
        <motion.div
          key="error"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="flex flex-col justify-center items-center h-64 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
            className="text-7xl mb-6"
          >
            ⚠️
          </motion.div>
          <p className="text-red-500 text-2xl font-bold mb-3">Failed to Load Leaderboard</p>
          <p className="text-gray-400 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Retry
          </motion.button>
        </motion.div>
      )}

    {!loading && !error && leaderboard.length > 0 && (
<div className="flex gap-2 mb-6">
<Select onValueChange={handleSortBy}>
<SelectTrigger className="w-[120px]">
  <SelectValue placeholder="Sort" />
</SelectTrigger>
<SelectContent className="bg-white text-black">
  <SelectGroup>
    <SelectLabel>Sort by</SelectLabel>
    <SelectItem value="arrowDown">
      <div className="flex items-center gap-2">
        <ArrowDown className="w-4 h-4" />
        <span>Descending</span>
      </div>
    </SelectItem>
    <SelectItem value="arrowUp">
      <div className="flex items-center gap-2">
        <ArrowUp className="w-4 h-4" />
        <span>Ascending</span>
      </div>
    </SelectItem>
  </SelectGroup>
</SelectContent>
</Select>

<Select onValueChange={handleFilterBy}>
<SelectTrigger className="w-[120px]">
  <SelectValue placeholder="Filter" />
</SelectTrigger>
<SelectContent className="bg-white text-black">
  <SelectGroup>
    <SelectLabel>Filter by</SelectLabel>
    <SelectItem value="points">
      <div className="flex items-center gap-2">
        <Coins className="w-4 h-4" />
        <span>Points</span>
      </div>
    </SelectItem>
    <SelectItem value="username">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4" />
        <span>Username</span>
      </div>
    </SelectItem>
  </SelectGroup>
</SelectContent>
</Select>
</div>
)}

      {!loading && !error && leaderboard.length > 0 && (
        <motion.div
          key="leaderboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          {filteredLeaderboard.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.15,
                type: "spring",
                stiffness: 80,
                damping: 12
              }}
              whileHover={{ 
                scale: 1.05, 
                x: 10,
                transition: { duration: 0.2 }
              }}
              className={`bg-gradient-to-r ${getRankColor(index)} p-6 rounded-xl flex items-center justify-between ${
                index < 3 ? 'shadow-2xl scale-105 border-2 border-yellow-500/50 ring-2 ring-yellow-500/20' : 'shadow-lg'
              } cursor-pointer transition-shadow hover:shadow-2xl relative overflow-hidden`}
            >
              {index < 3 && (
                <motion.div
                  animate={{
                    x: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 5,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                />
              )}
              
              <div className="flex items-center gap-5 relative z-10">
                {/* Profile Image with Crown for Top 3 */}
                {index < 3 && getProfileImage(index) ? (
                  <div className="relative">
                    {/* Crown for First Place */}
                    {index === 0 && (
                      <motion.div
                        animate={{
                          y: [0, -5, 0],
                          rotate: [-5, 5, -5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20"
                      >
                        <Crown className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="absolute inset-0 w-8 h-8 bg-yellow-400 rounded-full blur-md -z-10"
                        />
                      </motion.div>
                    )}
                    
                    {/* Profile Image */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: index * 0.15 + 0.3, 
                        type: "spring",
                        stiffness: 150,
                        damping: 10
                      }}
                      className={`relative w-16 h-16 rounded-full border-4 ${getBorderColor(index)} overflow-hidden shadow-xl`}
                    >
                      <img 
                        src={getProfileImage(index)!}
                        alt={entry.username}
                        className="w-full h-full object-cover"
                      />
                      {/* Glow effect */}
                      <motion.div
                        animate={{
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className={`absolute inset-0 ${
                          index === 0 ? 'bg-yellow-400/30' :
                          index === 1 ? 'bg-gray-400/30' :
                          'bg-orange-500/30'
                        } blur-sm`}
                      />
                    </motion.div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      delay: index * 0.15 + 0.3, 
                      type: "spring",
                      stiffness: 150,
                      damping: 10
                    }}
                    whileHover={{ 
                      rotate: [0, -10, 10, -10, 0],
                      transition: { duration: 0.5 }
                    }}
                    className="text-4xl font-bold w-16 text-center"
                  >
                    {getRankEmoji(index)}
                  </motion.div>
                )}
                
                <div>
                  <motion.p
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 + 0.4, duration: 0.4 }}
                    className="font-bold text-xl mb-1"
                  >
                    {entry.username}
                  </motion.p>
                </div>
              </div>
              <div className="text-right relative z-10">
                <motion.p
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    delay: index * 0.15 + 0.4, 
                    type: "spring",
                    stiffness: 120,
                    damping: 10
                  }}
                  className="text-3xl font-bold tabular-nums"
                >
                  {entry.points.toLocaleString()}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.15 + 0.6, duration: 0.4 }}
                  className="text-sm text-gray-300 uppercase tracking-wider mt-1"
                >
                  points
                </motion.p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</section>
);
};