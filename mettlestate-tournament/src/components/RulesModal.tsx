import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Users, Trophy, Clock } from 'lucide-react';
import { logger } from '../utils/logger';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const rules = [
    {
      icon: Users,
      title: 'Eligibility',
      description: 'Open to all players aged 16 and above. Players must register with a valid email and gamer tag.',
    },
    {
      icon: Shield,
      title: 'Fair Play',
      description: 'Any form of cheating, hacking, or exploiting will result in immediate disqualification and ban from future tournaments.',
    },
    {
      icon: Clock,
      title: 'Punctuality',
      description: 'Players must be online 15 minutes before their scheduled match. Late arrivals may result in automatic forfeit.',
    },
    {
      icon: Trophy,
      title: 'Tournament Format',
      description: 'Round Robin group stage followed by Double Elimination bracket. All matches are Best of 3, finals are Best of 5.',
    },
  ];

  useEffect(() => {
    if (isOpen) {
      logger.info('RulesModal opened', {
        timestamp: new Date().toISOString(),
        rulesCount: rules.length
      });
    }
  }, [isOpen, rules.length]);

  const handleClose = () => {
    logger.info('RulesModal closed by user', {
      timestamp: new Date().toISOString(),
      closeMethod: 'button'
    });
    onClose();
  };

  const handleBackdropClick = () => {
    logger.info('RulesModal closed by user', {
      timestamp: new Date().toISOString(),
      closeMethod: 'backdrop'
    });
    onClose();
  };

  useEffect(() => {
    logger.debug('RulesModal component mounted');

    return () => {
      logger.debug('RulesModal component unmounted');
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-gray-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                type="button"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Tournament Rules
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {rules.map((rule, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-red-600/20 p-3 rounded-lg flex-shrink-0">
                        <rule.icon className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-white text-lg font-bold mb-2">{rule.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{rule.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
                <h3 className="text-xl font-bold text-red-500 mb-3">Important Notice</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  By registering for this tournament, you agree to abide by all rules and regulations. 
                  Tournament organizers reserve the right to modify rules or disqualify participants who 
                  violate the code of conduct. All decisions made by tournament officials are final.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};