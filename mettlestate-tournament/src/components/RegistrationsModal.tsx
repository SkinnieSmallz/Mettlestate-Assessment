import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, CheckCircle, AlertCircle, Trophy } from 'lucide-react';

interface RegistrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
}

interface RegisteredPlayer {
  id: number;
  gamerTag: string;
  name: string;
  favoriteGame: string;
  registeredDate: string;
  status: 'Confirmed' | 'Pending';
}

export const RegistrationsModal: React.FC<RegistrationsModalProps> = ({ isOpen, onClose, onRegisterClick }) => {
  const registrationSteps = [
    {
      icon: Users,
      title: 'Create Account',
      description: 'Fill out the registration form with your details and gamer tag.',
    },
    {
      icon: CheckCircle,
      title: 'Confirm Email',
      description: 'Check your email for confirmation link and activate your account.',
    },
    {
      icon: Calendar,
      title: 'Check Schedule',
      description: 'View your match schedule and join the Discord server for updates.',
    },
  ];

  const registrationInfo = [
    { label: 'Registration Opens', value: 'July 1, 2025' },
    { label: 'Registration Closes', value: 'August 9, 2025 at 11:59 PM SAST' },
    { label: 'Maximum Participants', value: '128 Players' },
    { label: 'Current Registrations', value: '87 / 128' },
  ];

  // Dummy registered players data
  const registeredPlayers: RegisteredPlayer[] = [
    { id: 1, gamerTag: 'ShadowStrike', name: 'Alex Johnson', favoriteGame: 'Valorant', registeredDate: 'Aug 1, 2025', status: 'Confirmed' },
    { id: 2, gamerTag: 'PhoenixRising', name: 'Sarah Chen', favoriteGame: 'Apex Legends', registeredDate: 'Aug 2, 2025', status: 'Confirmed' },
    { id: 3, gamerTag: 'ThunderBolt_99', name: 'Marcus Williams', favoriteGame: 'Fortnite', registeredDate: 'Aug 2, 2025', status: 'Confirmed' },
    { id: 4, gamerTag: 'IceQueen', name: 'Emma Davis', favoriteGame: 'PUBG', registeredDate: 'Aug 3, 2025', status: 'Pending' },
    { id: 5, gamerTag: 'NightHawk', name: 'James Anderson', favoriteGame: 'Call of Duty', registeredDate: 'Aug 3, 2025', status: 'Confirmed' },
    { id: 6, gamerTag: 'DragonSlayer', name: 'Lisa Martinez', favoriteGame: 'Valorant', registeredDate: 'Aug 4, 2025', status: 'Confirmed' },
    { id: 7, gamerTag: 'VortexGaming', name: 'Ryan Thompson', favoriteGame: 'Apex Legends', registeredDate: 'Aug 4, 2025', status: 'Confirmed' },
    { id: 8, gamerTag: 'BlazeFury', name: 'Jessica Lee', favoriteGame: 'Overwatch', registeredDate: 'Aug 5, 2025', status: 'Pending' },
    { id: 9, gamerTag: 'SilentAssassin', name: 'David Kim', favoriteGame: 'Counter-Strike', registeredDate: 'Aug 5, 2025', status: 'Confirmed' },
    { id: 10, gamerTag: 'CyberPunk_X', name: 'Michael Brown', favoriteGame: 'Valorant', registeredDate: 'Aug 6, 2025', status: 'Confirmed' },
    { id: 11, gamerTag: 'QuantumLeap', name: 'Amanda White', favoriteGame: 'Fortnite', registeredDate: 'Aug 6, 2025', status: 'Confirmed' },
    { id: 12, gamerTag: 'StormBreaker', name: 'Chris Garcia', favoriteGame: 'Apex Legends', registeredDate: 'Aug 7, 2025', status: 'Pending' },
  ];

  const handleRegister = () => {
    onClose();
    onRegisterClick();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-gray-900 rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                type="button"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Registration Information
              </h2>

              {/* Registration Status */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {registrationInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center"
                  >
                    <p className="text-gray-400 text-xs mb-2">{info.label}</p>
                    <p className="text-white text-sm font-bold">{info.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Registration Steps */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-center mb-6">How to Register</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {registrationSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition-all">
                        <div className="flex flex-col items-center text-center">
                          <div className="bg-red-600/20 p-4 rounded-full mb-4">
                            <step.icon className="w-6 h-6 text-red-500" />
                          </div>
                          <div className="absolute -top-3 -left-3 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                          <p className="text-gray-400 text-sm">{step.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Registered Players Section */}
              <div className="mb-8">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Trophy className="w-6 h-6 text-red-500" />
                  <h3 className="text-2xl font-bold text-center">Recent Registrations</h3>
                </div>
                
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-900">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">#</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Gamer Tag</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Favorite Game</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {registeredPlayers.map((player, index) => (
                          <motion.tr
                            key={player.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-700/50 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm text-gray-400">{player.id}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-white">{player.gamerTag}</td>
                            <td className="px-4 py-3 text-sm text-gray-300 hidden md:table-cell">{player.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-400 hidden lg:table-cell">{player.favoriteGame}</td>
                            <td className="px-4 py-3 text-sm text-gray-400 hidden sm:table-cell">{player.registeredDate}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                player.status === 'Confirmed' 
                                  ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
                                  : 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
                              }`}>
                                {player.status}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="bg-gray-900 px-4 py-3 text-center text-sm text-gray-400">
                    Showing 12 of 87 registered players
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-xl p-6 text-center">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-2">Ready to Compete?</h3>
                <p className="text-gray-300 text-sm mb-6 max-w-2xl mx-auto">
                  Registration is filling up fast! Secure your spot in the Legends of Victory: Battle Royale Cup. 
                  Only 41 spots remaining!
                </p>
                <button
                  onClick={handleRegister}
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-10 rounded-full text-lg shadow-2xl transition-all transform hover:scale-105"
                >
                  Register Now
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};