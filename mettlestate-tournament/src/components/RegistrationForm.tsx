import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const registrationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  gamerTag: z.string().min(3, 'Gamer tag must be at least 3 characters').max(20, 'Gamer tag must be less than 20 characters'),
  email: z.string().email('Please enter a valid email address'),
  favoriteGame: z.string().min(2, 'Please enter your favorite game'),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    alert(`Registration successful for ${data.gamerTag}!`);
    console.log('Form data:', data);
    
    reset();
    onClose();
  };

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
          {/* Animated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
          
          {/* Animated Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700 relative overflow-hidden">
              {/* Animated Background Gradient */}
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

              {/* Close Button with Hover Animation */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                type="button"
              >
                <X className="w-6 h-6" />
              </motion.button>
              
              {/* Animated Title */}
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent relative z-10"
              >
                Register Now
              </motion.h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
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
                    />
                    <AnimatePresence>
                      {errors[field.name as keyof RegistrationFormData] && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors[field.name as keyof RegistrationFormData]?.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
                
                {/* Animated Submit Button */}
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};