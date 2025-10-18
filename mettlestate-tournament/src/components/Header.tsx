import React from 'react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const handleLogoClick = () => {
    window.open('https://mettlestate.com', '_blank', 'noopener,noreferrer');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Height of fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navItems = [
    { label: 'Event Details', onClick: () => scrollToSection('event-details') },
    { label: 'Leaderboard', onClick: () => scrollToSection('leaderboard') },
    { label: 'Rules', onClick: () => scrollToSection('rules') },
    { label: 'Registrations', onClick: () => scrollToSection('registrations') },
    { label: 'FAQs', onClick: () => scrollToSection('faq') },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800"
    >
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Left Side */}
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

          {/* Navigation - Right Side - Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="text-gray-300 hover:text-white transition-colors font-medium relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 transition-all group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2 hover:bg-gray-800 rounded transition-colors"
            onClick={() => {
              const mobileMenu = document.getElementById('mobile-menu');
              if (mobileMenu) {
                mobileMenu.classList.toggle('hidden');
              }
            }}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div id="mobile-menu" className="hidden lg:hidden mt-4 pb-4">
          <div className="flex flex-col gap-4">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick?.();
                  const mobileMenu = document.getElementById('mobile-menu');
                  if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                  }
                }}
                className="text-gray-300 hover:text-white transition-colors font-medium text-left py-2 border-b border-gray-800"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.header>
  );
};