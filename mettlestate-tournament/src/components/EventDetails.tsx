import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, DollarSign, Target } from 'lucide-react';

export const EventDetails: React.FC = () => {
  const details = [
    { icon: Calendar, label: 'Date & Time', value: 'August 10, 2025 at 6PM SAST' },
    { icon: MapPin, label: 'Location', value: 'Online - Streamed live on Twitch' },
    { icon: DollarSign, label: 'Prize Pool', value: 'R50,000' },
    { icon: Target, label: 'Format', value: 'Round Robin, Double Elimination' },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black/90 to-gray-900">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Event Details
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {details.map((detail, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:border-red-500 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="bg-red-600/20 p-3 rounded-lg">
                  <detail.icon className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm mb-1">{detail.label}</h3>
                  <p className="text-white text-lg font-semibold">{detail.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};