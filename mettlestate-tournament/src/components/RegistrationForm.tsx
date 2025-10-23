import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegistration } from '../context/RegistrationContext';
import { logger } from '../utils/logger';

const registrationSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .refine(name => /^[a-zA-Z\s'-]+$/.test(name), {
      message: 'Name can only contain letters, spaces, hyphens and apostrophes'
    }),
  
  gamerTag: z
    .string()
    .min(3, 'Gamer tag must be at least 3 characters')
    .max(20, 'Gamer tag must be less than 20 characters')
    .refine(tag => /^[a-zA-Z0-9_-]+$/.test(tag), {
      message: 'Gamer tag can only contain letters, numbers, underscores and hyphens'
    }),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .refine(email => email.indexOf('@') > 0, {
      message: 'Please enter a valid email address'
    }),
  
  favoriteGame: z
    .string()
    .min(2, 'Please enter your favorite game')
    .max(100, 'Game title is too long'),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ isOpen, onClose }) => {
  const { incrementRegistration } = useRegistration();
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  React.useEffect(() => {
    logger.debug('RegistrationForm component mounted');

    return () => {
      logger.debug('RegistrationForm component unmounted');
    };
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      logger.info('RegistrationForm opened', {
        component: 'RegistrationForm',
        timestamp: new Date().toISOString()
      });
    }
  }, [isOpen]);

  const handleClose = React.useCallback(() => {
    try {
      logger.info('Closing registration form', {
        component: 'RegistrationForm',
        action: 'close_button_clicked',
        formState: {
          hasErrors: Object.keys(errors).length > 0,
          isSubmitting,
          showSuccess
        }
      });

      reset();
      
      setSubmitError(null);
      
      setShowSuccess(false);

      logger.debug('Form cleared successfully', {
        component: 'RegistrationForm'
      });

      onClose();
    } catch (error) {
      logger.error('Error closing registration form', {
        component: 'RegistrationForm',
        error: error instanceof Error ? error.message : String(error)
      });
      onClose();
    }
  }, [onClose, reset, errors, isSubmitting, showSuccess]);

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      setSubmitError(null);
      
      logger.info('Registration attempt started', { 
        component: 'RegistrationForm',
        gamerTag: data.gamerTag,
        emailDomain: data.email.split('@')[1],
        favoriteGame: data.favoriteGame,
        timestamp: new Date().toISOString()
      });

      // API call simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Registration counter incrementation
      try {
        incrementRegistration();
        logger.debug('Registration counter incremented', {
          component: 'RegistrationForm',
          gamerTag: data.gamerTag
        });
      } catch (contextError) {
        logger.warn('Failed to increment registration counter', { 
          component: 'RegistrationForm',
          error: contextError instanceof Error ? contextError.message : String(contextError),
          gamerTag: data.gamerTag 
        });
      }
      
      logger.info('Registration completed successfully', { 
        component: 'RegistrationForm',
        gamerTag: data.gamerTag,
        timestamp: new Date().toISOString()
      });

      setShowSuccess(true);
      
      setTimeout(() => {
        logger.debug('Auto-closing form after success', {
          component: 'RegistrationForm',
          gamerTag: data.gamerTag
        });
        setShowSuccess(false);
        reset();
        onClose();
      }, 2000);

    } catch (error) {
      logger.error('Registration submission failed', {
        component: 'RegistrationForm',
        formData: {
          gamerTag: data.gamerTag,
          emailDomain: data.email.split('@')[1],
          favoriteGame: data.favoriteGame,
        },
        step: 'form_submission',
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : String(error),
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });

      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred. Please try again.';
      
      setSubmitError(errorMessage);
    }
  };

  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      logger.info('Form validation errors', { 
        component: 'RegistrationForm',
        errors: Object.keys(errors).map(key => ({
          field: key,
          message: errors[key as keyof RegistrationFormData]?.message
        })),
        timestamp: new Date().toISOString()
      });
    }
  }, [errors]);

  const handleDismissError = React.useCallback(() => {
    logger.debug('User dismissed error message', {
      component: 'RegistrationForm',
      errorMessage: submitError
    });
    setSubmitError(null);
  }, [submitError]);

  React.useEffect(() => {
    return () => {
      setSubmitError(null);
      setShowSuccess(false);
    };
  }, []);

  const formFields = [
    { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
    { name: 'gamerTag', label: 'Gamer Tag', type: 'text', placeholder: 'ProGamer123' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
    { name: 'favoriteGame', label: 'Favourite Game Title', type: 'text', placeholder: 'Valorant' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700 relative overflow-hidden">
              <motion.div
                animate={{
                  background: [
                    'radial-gradient(circle at 0% 0%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 100% 100%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 0% 0%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)',
                  ],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute inset-0 pointer-events-none"
              />

              <AnimatePresence mode="wait">
                {showSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 relative z-10"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                    >
                      <CheckCircle className="w-24 h-24 text-green-500 mb-4" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-center mb-2">Success!</h2>
                    <p className="text-gray-400 text-center">
                      Registration complete. Check your email for confirmation.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleClose}
                      className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                      type="button"
                      aria-label="Close registration form"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                    
                    <motion.h2
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent relative z-10"
                    >
                      Register Now
                    </motion.h2>

                    <AnimatePresence>
                      {submitError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3 relative z-10"
                        >
                          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-red-500 text-sm font-medium">Registration Failed</p>
                            <p className="text-red-400 text-sm mt-1">{submitError}</p>
                          </div>
                          <button
                            onClick={handleDismissError}
                            className="text-red-400 hover:text-red-300"
                            aria-label="Dismiss error"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10" noValidate>
                      {formFields.map((field, index) => (
                        <motion.div
                          key={field.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                        >
                          <label htmlFor={field.name} className="block text-sm font-medium mb-2">
                            {field.label}
                          </label>
                          <motion.input
                            {...register(field.name as keyof RegistrationFormData)}
                            type={field.type}
                            id={field.name}
                            placeholder={field.placeholder}
                            whileFocus={{ scale: 1.02, borderColor: '#ef4444' }}
                            transition={{ duration: 0.2 }}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500 text-white placeholder:text-gray-500 transition-all"
                            aria-invalid={!!errors[field.name as keyof RegistrationFormData]}
                            aria-describedby={errors[field.name as keyof RegistrationFormData] ? `${field.name}-error` : undefined}
                          />
                          <AnimatePresence>
                            {errors[field.name as keyof RegistrationFormData] && (
                              <motion.p
                                id={`${field.name}-error`}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-red-500 text-sm mt-1"
                                role="alert"
                              >
                                {errors[field.name as keyof RegistrationFormData]?.message}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                      
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                      >
                        {isSubmitting && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                          </motion.div>
                        )}
                        <span className={isSubmitting ? 'opacity-0' : 'opacity-100'}>
                          {isSubmitting ? 'Registering...' : 'Complete Registration'}
                        </span>
                      </motion.button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};