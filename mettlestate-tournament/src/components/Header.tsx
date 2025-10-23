import React, { useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { logger } from '../utils/logger';

interface HeaderProps {
  onRulesClick: () => void;
  onRegistrationsClick: () => void;
}

interface NavItem {
  label: string;
  onClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRulesClick, onRegistrationsClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    logger.debug('Header component mounted', {
      component: 'Header'
    });

    return () => {
      logger.debug('Header component unmounted', {
        component: 'Header',
        mobileMenuWasOpen: mobileMenuOpen
      });
    };
  }, [mobileMenuOpen]);

  const handleLogoClick = useCallback(() => {
    try {
      const url = 'https://mettlestate.com';
      
      logger.info('Logo clicked', {
        component: 'Header',
        targetUrl: url,
        timestamp: new Date().toISOString()
      });

      const newWindow = window.open(url, '_blank', 'noopener');

      if (newWindow) {
        try { 
          newWindow.opener = null;
          logger.debug('New window opened successfully', {
            component: 'Header',
            url
          });
        } catch (openerError) {
          logger.warn('Failed to set opener to null', {
            component: 'Header',
            error: openerError instanceof Error ? openerError.message : String(openerError)
          });
        }
      } else {
        logger.warn('Window.open returned null - possible popup blocker', {
          component: 'Header',
          url
        });
      }
    } catch (error) {
      logger.error('Failed to open new tab', {
        component: 'Header',
        targetUrl: 'https://mettlestate.com',
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : String(error)
      });
    }
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    try {
      const element = document.getElementById(sectionId);
      
      if (!element) {
        logger.warn('Section element not found', { 
          component: 'Header',
          sectionId 
        });
        return;
      }

      logger.info('Scrolling to section', { 
        component: 'Header',
        sectionId 
      });

      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        logger.debug('Smooth scroll executed', {
          component: 'Header',
          sectionId,
          offsetPosition
        });
      } else {
        window.scrollTo(0, offsetPosition);
        logger.debug('Fallback scroll executed (smooth scroll not supported)', {
          component: 'Header',
          sectionId,
          offsetPosition
        });
      }
    } catch (error) {
      logger.error('Failed to scroll to section', {
        component: 'Header',
        sectionId,
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : String(error)
      });
      
      try {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView();
          logger.info('Fallback scrollIntoView successful', {
            component: 'Header',
            sectionId
          });
        }
      } catch (fallbackError) {
        logger.error('Fallback scroll also failed', {
          component: 'Header',
          sectionId,
          error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
        });
      }
    }
  }, []);

  const toggleMobileMenu = useCallback(() => {
    try {
      const newState = !mobileMenuOpen;
      setMobileMenuOpen(newState);
      
      logger.info('Mobile menu toggled', { 
        component: 'Header',
        previousState: mobileMenuOpen,
        newState,
        action: newState ? 'opened' : 'closed'
      });
    } catch (error) {
      logger.error('Failed to toggle mobile menu', {
        component: 'Header',
        currentState: mobileMenuOpen,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }, [mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    try {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
        logger.info('Mobile menu closed', {
          component: 'Header'
        });
      }
    } catch (error) {
      logger.error('Failed to close mobile menu', {
        component: 'Header',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }, [mobileMenuOpen]);

  const handleNavClick = useCallback((onClick: () => void, label: string) => {
    try {
      logger.info('Navigation item clicked', { 
        component: 'Header',
        label,
        mobileMenuOpen,
        timestamp: new Date().toISOString()
      });
      
      onClick();
      closeMobileMenu();
    } catch (error) {
      logger.error('Navigation click handler failed', {
        component: 'Header',
        label,
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : String(error)
      });
    }
  }, [closeMobileMenu, mobileMenuOpen]);

  const handleLogoError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    logger.error('Logo image failed to load', {
      component: 'Header',
      src: '/mettlestate-logo.png',
      errorType: 'image_load_error',
      action: 'hiding image element'
    });
    e.currentTarget.style.display = 'none';
  }, []);

  const navItems: NavItem[] = [
    { label: 'Event Details', onClick: () => scrollToSection('event-details') },
    { label: 'Leaderboard', onClick: () => scrollToSection('leaderboard') },
    { label: 'Registrations', onClick: onRegistrationsClick },
    { label: 'Rules', onClick: onRulesClick },
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
          <button
            onClick={(e) => {
              handleLogoClick();
              e.currentTarget.blur();
            }}
            className="group rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 mb-4"
            type="button"
          >
            <img 
              src="/mettlestate-logo.png" 
              alt="Mettlestate logo" 
              className="h-10 transition-all duration-300 ease-out
                        group-hover:scale-110 
                        group-hover:drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]
                        group-hover:brightness-110
                        group-active:scale-95"
              onError={handleLogoError}
              loading="eager"
            />
          </button>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navItems.map((item, index) => (
              <button
                key={`nav-${item.label}-${index}`}
                onClick={() => handleNavClick(item.onClick, item.label)}
                className="text-gray-300 hover:text-white transition-colors font-medium relative group focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
                type="button"
              >
                {item.label}
                <span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 transition-all group-hover:w-full"
                  aria-hidden="true"
                ></span>
              </button>
            ))}
          </nav>

          <button
            className="lg:hidden text-white p-2 hover:bg-gray-800 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            type="button"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.nav
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden mt-4 pb-4"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item, index) => (
                <button
                  key={`mobile-nav-${item.label}-${index}`}
                  onClick={() => handleNavClick(item.onClick, item.label)}
                  className="text-gray-300 hover:text-white transition-colors font-medium text-left py-2 border-b border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2"
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};