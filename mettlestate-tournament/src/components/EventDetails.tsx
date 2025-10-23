import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, DollarSign, Target, type LucideIcon } from 'lucide-react';
import { logger } from '../utils/logger';

interface EventDetail {
  icon: LucideIcon;
  label: string;
  value: string;
}

export const EventDetails: React.FC = () => {
  const details: EventDetail[] = [
    { icon: Calendar, label: 'Date & Time', value: 'August 10, 2025 at 6PM SAST' },
    { icon: MapPin, label: 'Location', value: 'Online - Streamed live on Twitch' },
    { icon: DollarSign, label: 'Prize Pool', value: 'R50,000' },
    { icon: Target, label: 'Format', value: 'Round Robin, Double Elimination' },
  ];

  useEffect(() => {
    logger.debug('EventDetails component mounted', {
      component: 'EventDetails',
      detailsCount: details.length
    });

    return () => {
      logger.debug('EventDetails component unmounted', {
        component: 'EventDetails'
      });
    };
  }, []);

  useEffect(() => {
    try {
      const invalidDetails = details.filter(d => !d.icon || !d.label || !d.value);
      
      if (invalidDetails.length > 0) {
        logger.warn('Invalid detail entries found', {
          component: 'EventDetails',
          count: invalidDetails.length,
          invalidDetails: invalidDetails.map((detail, idx) => ({
            index: idx,
            hasIcon: !!detail.icon,
            hasLabel: !!detail.label,
            hasValue: !!detail.value,
            label: detail.label || 'missing'
          }))
        });
      } else {
        logger.info('Event details validated successfully', {
          component: 'EventDetails',
          totalDetails: details.length,
          validDetails: details.length
        });
      }

      details.forEach((detail, index) => {
        if (detail.label && detail.label.length > 50) {
          logger.warn('Event detail label is very long', {
            component: 'EventDetails',
            index,
            label: detail.label,
            labelLength: detail.label.length
          });
        }
        if (detail.value && detail.value.length > 100) {
          logger.warn('Event detail value is very long', {
            component: 'EventDetails',
            index,
            label: detail.label,
            valueLength: detail.value.length
          });
        }
      });

      logger.debug('Event details content', {
        component: 'EventDetails',
        details: details.map(d => ({
          label: d.label,
          value: d.value
        }))
      });
    } catch (error) {
      logger.error('Error validating event details', {
        component: 'EventDetails',
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : String(error)
      });
    }
  }, []);

  return (
    <section
      id="event-details"
      className="py-20 px-4 bg-gradient-to-b from-black/90 to-gray-900"
      aria-labelledby="event-details-heading"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          id="event-details-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Event Details
        </motion.h2>
       
        <div className="grid md:grid-cols-2 gap-8">
          {details.map((detail, index) => {
            const IconComponent = detail.icon;
           
            return (
              <motion.div
                key={`${detail.label}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:border-red-500 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-red-600/20 p-3 rounded-lg flex-shrink-0">
                    <IconComponent
                      className="w-6 h-6 text-red-500"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-400 text-sm mb-1">
                      {detail.label}
                    </h3>
                    <p className="text-white text-lg font-semibold break-words">
                      {detail.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};