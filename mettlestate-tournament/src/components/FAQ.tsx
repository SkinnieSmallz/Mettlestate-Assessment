import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { FAQItem } from '../types';
import { logger } from '../utils/logger';

  const faqs: FAQItem[] = [
    {
      question: 'How do I register for the tournament?',
      answer: 'Click the "Register Now" button at the top of the page and fill out the registration form with your details. Registration closes 24 hours before the event starts.',
    },
    {
      question: 'What are the minimum requirements to participate?',
      answer: 'You need a stable internet connection, a gaming PC or console that meets your game\'s requirements, and a Discord account for communication during the tournament.',
    },
    {
      question: 'How is the prize pool distributed?',
      answer: 'The R50,000 prize pool is distributed as follows: 1st place receives R25,000, 2nd place receives R15,000, and 3rd place receives R10,000.',
    },
    {
      question: 'Can I participate if I\'m not from South Africa?',
      answer: 'Yes! This is an online tournament open to players worldwide. However, prize distribution may be affected by international transfer fees.',
    },
  ];

  export const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    logger.debug('FAQ component mounted', {
      component: 'FAQ',
      faqCount: faqs.length
    });

    return () => {
      logger.debug('FAQ component unmounted', {
        component: 'FAQ',
        openIndex
      });
    };
  }, [openIndex]);

  useEffect(() => {
    try {
      const invalidFaqs = faqs.filter(faq => !faq.question || !faq.answer);
      
      if (invalidFaqs.length > 0) {
        logger.warn('Invalid FAQ entries found', { 
          component: 'FAQ',
          count: invalidFaqs.length,
          invalidFaqs: invalidFaqs.map((faq, idx) => ({
            index: idx,
            hasQuestion: !!faq.question,
            hasAnswer: !!faq.answer
          }))
        });
      }
      
      if (faqs.length === 0) {
        logger.warn('No FAQ items provided', {
          component: 'FAQ'
        });
      } else {
        logger.info('FAQ items validated', {
          component: 'FAQ',
          totalFaqs: faqs.length,
          validFaqs: faqs.length - invalidFaqs.length
        });
      }

      faqs.forEach((faq, index) => {
        if (faq.question && faq.question.length > 200) {
          logger.warn('FAQ question is very long', {
            component: 'FAQ',
            index,
            questionLength: faq.question.length
          });
        }
        if (faq.answer && faq.answer.length > 1000) {
          logger.warn('FAQ answer is very long', {
            component: 'FAQ',
            index,
            answerLength: faq.answer.length
          });
        }
      });
    } catch (error) {
      logger.error('Error validating FAQ data', {
        component: 'FAQ',
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : String(error)
      });
    }
  }, []);

  const handleToggle = useCallback((index: number) => {
    try {
      if (index < 0 || index >= faqs.length) {
        logger.warn('Invalid FAQ index', {
          component: 'FAQ',
          index,
          maxIndex: faqs.length - 1
        });
        return;
      }

      setOpenIndex(prev => {
        const newIndex = prev === index ? null : index;
        
        if (newIndex !== null) {
          logger.info('FAQ item opened', { 
            component: 'FAQ',
            index, 
            question: faqs[index]?.question,
            timestamp: new Date().toISOString()
          });
        } else {
          logger.info('FAQ item closed', {
            component: 'FAQ',
            index,
            question: faqs[index]?.question
          });
        }
        
        return newIndex;
      });
    } catch (error) {
      logger.error('Error toggling FAQ', {
        component: 'FAQ',
        index,
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : String(error)
      });
    }
  }, []);

  const handleKeyDown = useCallback((
    event: React.KeyboardEvent,
    index: number
  ) => {
    try {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        
        logger.debug('FAQ keyboard interaction', {
          component: 'FAQ',
          key: event.key,
          index,
          question: faqs[index]?.question
        });
        
        handleToggle(index);
      }
    } catch (error) {
      logger.error('Error handling keyboard event', {
        component: 'FAQ',
        index,
        key: event.key,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }, [handleToggle]);

  useEffect(() => {
    if (openIndex !== null) {
      logger.debug('Current open FAQ index changed', {
        component: 'FAQ',
        openIndex,
        question: faqs[openIndex]?.question
      });
    }
  }, [openIndex]);

  return (
    <section 
      id="faq" 
      className="py-20 px-4 bg-black"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-3xl mx-auto">
        <motion.h2
          id="faq-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
        >
          Frequently Asked Questions
        </motion.h2>
        
        {faqs.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>No FAQs available at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={`faq-${index}-${faq.question.slice(0, 20)}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-800 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => handleToggle(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                  className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-900 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset"
                >
                  <span className="font-semibold text-lg pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 bg-gray-900/50 text-gray-300">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};