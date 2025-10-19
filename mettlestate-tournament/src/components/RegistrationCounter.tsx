import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp } from 'lucide-react';
import { useRegistration } from '../context/RegistrationContext';

export const RegistrationCounter: React.FC = () => {
  const { registrationCount } = useRegistration();
  const maxRegistrations = 128;
  const percentage = (registrationCount / maxRegistrations) * 100;
  const spotsLeft = maxRegistrations - registrationCount;

  return (
    <section className="py-12 px-4 bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Registration Count */}
            <div className="flex items-center gap-6">
              <div className="bg-red-600/20 p-4 rounded-full">
                <Users className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Current Registrations</p>
                <motion.div
                  key={registrationCount}
                  initial={{ scale: 1.3, color: '#ef4444' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl font-bold"
                >
                  {registrationCount}
                </motion.div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 w-full md:w-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Registration Progress</span>
                <span className="text-sm font-semibold text-red-500">{percentage.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">{maxRegistrations} maximum participants</p>
            </div>

            {/* Spots Left */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <span className="text-gray-400 text-sm">Spots Remaining</span>
              </div>
              <motion.div
                key={spotsLeft}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`text-4xl font-bold ${
                  spotsLeft < 20 ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {spotsLeft}
              </motion.div>
            </div>
          </div>

          {/* Alert when spots are low */}
          {spotsLeft < 20 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-center"
            >
              <p className="text-red-400 font-semibold">
                ⚠️ Hurry! Only {spotsLeft} spots remaining!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};