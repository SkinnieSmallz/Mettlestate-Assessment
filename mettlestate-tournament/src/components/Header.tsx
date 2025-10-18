import React from 'react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const handleLogoClick = () => {
    window.open('https://mettlestate.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800"
    >
      <div className="px-4 py-4">
        <button
          onClick={handleLogoClick}
          className="hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
          aria-label="Visit Mettlestate website"
        >
          <img 
            src="/mettlestate-logo.png" 
            alt="Mettlestate" 
            className="h-10"
          />
        </button>
      </div>
    </motion.header>
  );
};