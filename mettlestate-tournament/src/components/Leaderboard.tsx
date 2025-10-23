import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, ArrowUp, ArrowDown, User, Coins, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { logger } from '../utils/logger';

interface User {
  id: number;
  name: string;
  username: string;
}

interface LeaderboardEntry extends User {
  points: number;
}

type SortOrder = 'asc' | 'desc';
type FilterType = 'points' | 'username';

export const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterType, setFilterType] = useState<FilterType>('points');

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  useEffect(() => {
    logger.debug('Leaderboard component mounted');
    return () => {
      logger.debug('Leaderboard component unmounted', {
        finalEntriesCount: leaderboard.length
      });
    };
  }, []);

  const sortLeaderboard = useCallback((
    entries: LeaderboardEntry[],
    order: SortOrder,
    filter: FilterType
  ): LeaderboardEntry[] => {
    try {
      const sorted = [...entries];
      if (filter === 'username') {
        sorted.sort((a, b) => {
          const comparison = a.username.localeCompare(b.username);
          return order === 'asc' ? comparison : -comparison;
        });
      } else {
        sorted.sort((a, b) => {
          const comparison = b.points - a.points;
          return order === 'desc' ? comparison : -comparison;
        });
      }
      logger.info('Leaderboard sorted successfully', {
        component: 'Leaderboard',
        order,
        filter,
        entriesCount: sorted.length
      });
      return sorted;
    } catch (err) {
      logger.error('Failed to sort leaderboard', {
        component: 'Leaderboard',
        order,
        filter,
        entriesCount: entries.length,
        error: err instanceof Error ? {
          name: err.name,
          message: err.message,
          stack: err.stack
        } : String(err)
      });
      return entries;
    }
  }, []);

  const fetchLeaderboard = useCallback(async (isRetry: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      if (isRetry) {
        logger.info('Retrying leaderboard fetch', { 
          component: 'Leaderboard',
          retryCount,
          attempt: retryCount + 1,
          maxRetries: MAX_RETRIES
        });
      } else {
        logger.info('Fetching leaderboard data', {
          component: 'Leaderboard',
          timestamp: new Date().toISOString()
        });
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const [response] = await Promise.all([
        fetch('https://jsonplaceholder.typicode.com/users', {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        }),
        new Promise(resolve => setTimeout(resolve, 3000))
      ]);

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format - expected JSON');
      }

      const users: User[] = await response.json();

      if (!Array.isArray(users)) {
        throw new Error('Invalid data format - expected array');
      }

      if (users.length === 0) {
        logger.warn('Received empty leaderboard data', {
          component: 'Leaderboard'
        });
      }

      logger.info('Successfully fetched leaderboard', {
        component: 'Leaderboard',
        userCount: users.length,
        timestamp: new Date().toISOString()
      });

      const entries: LeaderboardEntry[] = users
        .slice(0, 10)
        .map(user => {
          if (!user.id || !user.username) {
            logger.warn('Invalid user data encountered', { 
              component: 'Leaderboard',
              user,
              hasId: !!user.id,
              hasUsername: !!user.username
            });
          }
          return {
            ...user,
            id: user.id || Math.random(),
            username: user.username || 'Unknown',
            name: user.name || 'Unknown',
            points: Math.floor(Math.random() * 9000) + 1000,
          };
        });

      const sortedEntries = sortLeaderboard(entries, sortOrder, filterType);
      setLeaderboard(entries);
      setFilteredLeaderboard(sortedEntries);
      setRetryCount(0);

      logger.info('Leaderboard updated successfully', {
        component: 'Leaderboard',
        entriesCount: entries.length,
        sortOrder,
        filterType
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      
      logger.error('Failed to fetch leaderboard', {
        component: 'Leaderboard',
        retryCount,
        isRetry,
        errorType: err instanceof Error ? err.name : 'Unknown',
        errorMessage,
        error: err instanceof Error ? {
          name: err.name,
          message: err.message,
          stack: err.stack
        } : String(err),
        timestamp: new Date().toISOString()
      });

      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Network error - please check your connection');
        logger.warn('Network error detected', {
          component: 'Leaderboard',
          errorType: 'NetworkError'
        });
      } else if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out - please try again');
        logger.warn('Request timeout detected', {
          component: 'Leaderboard',
          errorType: 'TimeoutError'
        });
      } else {
        setError(errorMessage);
      }

      if (retryCount < MAX_RETRIES) {
        logger.info('Scheduling retry', {
          component: 'Leaderboard',
          retryCount: retryCount + 1,
          maxRetries: MAX_RETRIES,
          delay: RETRY_DELAY
        });
        
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, RETRY_DELAY);
      } else {
        logger.error('Max retries reached, giving up', {
          component: 'Leaderboard',
          maxRetries: MAX_RETRIES,
          finalError: errorMessage
        });
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount, sortLeaderboard, sortOrder, filterType]);

  useEffect(() => {
    if (retryCount === 0) {
      fetchLeaderboard(false);
    } else if (retryCount > 0 && retryCount <= MAX_RETRIES) {
      fetchLeaderboard(true);
    }
  }, [retryCount]);

  const handleSortOrder = useCallback((value: string) => {
    try {
      const newOrder: SortOrder = value === 'arrowDown' ? 'desc' : 'asc';
      
      logger.info('Sort order changed', {
        component: 'Leaderboard',
        previousOrder: sortOrder,
        newOrder,
        filterType
      });
      
      setSortOrder(newOrder);
      const sorted = sortLeaderboard(leaderboard, newOrder, filterType);
      setFilteredLeaderboard(sorted);
    } catch (err) {
      logger.error('Failed to change sort order', {
        component: 'Leaderboard',
        value,
        error: err instanceof Error ? err.message : String(err)
      });
    }
  }, [leaderboard, sortOrder, filterType, sortLeaderboard]);

  const handleFilterBy = useCallback((value: string) => {
    try {
      const newFilter = value as FilterType;
      
      logger.info('Filter type changed', {
        component: 'Leaderboard',
        previousFilter: filterType,
        newFilter,
        sortOrder
      });
      
      setFilterType(newFilter);
      const sorted = sortLeaderboard(leaderboard, sortOrder, newFilter);
      setFilteredLeaderboard(sorted);
    } catch (err) {
      logger.error('Failed to change filter type', {
        component: 'Leaderboard',
        value,
        error: err instanceof Error ? err.message : String(err)
      });
    }
  }, [leaderboard, sortOrder, filterType, sortLeaderboard]);

  const handleRetry = useCallback(() => {
    logger.info('Manual retry triggered by user', {
      component: 'Leaderboard'
    });
    setRetryCount(0);
    setError(null);
  }, []);

  const getRankColor = (index: number): string => {
    if (index === 0) return 'from-yellow-600 to-yellow-700';
    if (index === 1) return 'from-gray-400 to-gray-500';
    if (index === 2) return 'from-orange-600 to-orange-700';
    return 'from-gray-700 to-gray-800';
  };

  const getBorderColor = (index: number): string => {
    if (index === 0) return 'border-yellow-400';
    if (index === 1) return 'border-gray-300';
    if (index === 2) return 'border-orange-500';
    return 'border-gray-500';
  };

  const getTop3ByPoints = useCallback((): Set<number> => {
    const sortedByPoints = [...leaderboard].sort((a, b) => b.points - a.points);
    return new Set(sortedByPoints.slice(0, 3).map(user => user.id));
  }, [leaderboard]);

  const top3UserIds = getTop3ByPoints();

  const getRankByPoints = useCallback((userId: number): number => {
    const sortedByPoints = [...leaderboard].sort((a, b) => b.points - a.points);
    return sortedByPoints.findIndex(user => user.id === userId);
  }, [leaderboard]);
  
  const getProfileImage = (userId: number): string | null => {
  const actualRank = getRankByPoints(userId);
  
  const localImages: { [key: number]: string } = {
    0: '/player1.jpg',
    1: '/player2.jpg',
    2: '/player3.jpg',
  };
  
  return localImages[actualRank] || null;
};

  return (
    <section id="leaderboard" className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
            Leaderboard
          </h1>
          <p className="text-gray-400 text-lg">Top players competing for glory</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading && leaderboard.length === 0 ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mb-4"
              />
              <p className="text-gray-400 text-lg">Loading leaderboard...</p>
              {retryCount > 0 && (
                <p className="text-gray-500 text-sm mt-2">
                  Retry attempt {retryCount} of {MAX_RETRIES}
                </p>
              )}
            </motion.div>
          ) : error && leaderboard.length === 0 ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-red-900/20 border border-red-500/50 rounded-xl p-8 text-center"
            >
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-500 mb-2">Error Loading Leaderboard</h3>
              <p className="text-gray-300 mb-6">{error}</p>
              {retryCount >= MAX_RETRIES && (
                <button
                  onClick={handleRetry}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              )}
              {retryCount > 0 && retryCount < MAX_RETRIES && (
                <p className="text-gray-400 text-sm mt-4">
                  Retrying automatically... ({retryCount}/{MAX_RETRIES})
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex gap-4 mb-6 justify-end">
                <Select onValueChange={handleSortOrder} defaultValue="arrowDown">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectGroup>
                      <SelectLabel>Sort order</SelectLabel>
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

                <Select onValueChange={handleFilterBy} defaultValue="points">
                  <SelectTrigger className="w-[140px]">
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

              <div className="space-y-4">
                {filteredLeaderboard.map((entry, index) => {
                  const isTop3 = top3UserIds.has(entry.id);
                  const actualRank = getRankByPoints(entry.id);
                  
                  return (
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
                      className={`bg-gradient-to-r ${isTop3 ? getRankColor(actualRank) : 'from-gray-700 to-gray-800'} p-6 rounded-xl flex items-center justify-between ${
                        isTop3 ? 'shadow-2xl scale-105 border-2 border-yellow-500/50 ring-2 ring-yellow-500/20' : 'shadow-lg'
                      } cursor-pointer transition-shadow hover:shadow-2xl relative overflow-hidden`}
                    >
                      {isTop3 && (
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
                        {isTop3 && getProfileImage(entry.id) ? (
                          <div className="relative">
                            {actualRank === 0 && (
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
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{
                                delay: index * 0.15 + 0.3,
                                type: "spring",
                                stiffness: 150,
                                damping: 10
                              }}
                              className={`relative w-16 h-16 rounded-full border-4 ${getBorderColor(actualRank)} overflow-hidden shadow-xl`}
                            >
                              <img
                                src={getProfileImage(entry.id)!}
                                alt={entry.username}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  logger.warn('Failed to load profile image', {
                                    component: 'Leaderboard',
                                    index,
                                    username: entry.username,
                                    userId: entry.id,
                                    actualRank: getRankByPoints(entry.id),
                                    src: getProfileImage(entry.id),
                                    action: 'using fallback image'
                                  });
                                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23374151" width="64" height="64"/%3E%3C/svg%3E';
                                }}
                              />
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
                                  actualRank === 0 ? 'bg-yellow-400/30' :
                                  actualRank === 1 ? 'bg-gray-400/30' :
                                  'bg-orange-500/30'
                                } blur-sm`}
                              />
                            </motion.div>
                          </div>
                        ) : (
                          filterType === 'points' ? (
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
                              className="text-4xl font-bold w-16 text-center text-gray-400"
                            >
                              {sortOrder === 'asc' 
                                ? filteredLeaderboard.length - index 
                                : index + 1}
                            </motion.div>
                          ) : null
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
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};