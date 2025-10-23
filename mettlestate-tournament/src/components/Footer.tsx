import React, { useCallback, useEffect } from 'react';
import { Twitter, Youtube, Facebook, Twitch, Linkedin, type LucideIcon } from 'lucide-react';
import { logger } from '../utils/logger';

interface SocialLink {
  icon: LucideIcon;
  label: string;
  href: string;
}

const socialLinks: SocialLink[] = [
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/mettlestate' },
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/mettlestate' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://za.linkedin.com/company/mettlestate' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/@mettlestate' },
  { icon: Twitch, label: 'Twitch', href: 'https://twitch.tv/mettlestate' },
];

export const Footer: React.FC = () => {
  useEffect(() => {
    logger.debug('Footer component mounted', {
      component: 'Footer',
      socialLinksCount: socialLinks.length
    });

    return () => {
      logger.debug('Footer component unmounted', {
        component: 'Footer'
      });
    };
  }, []);

  useEffect(() => {
    try {
      const invalidLinks = socialLinks.filter(
        link => !link.icon || !link.label || !link.href
      );
      
      if (invalidLinks.length > 0) {
        logger.warn('Invalid social link entries found', { 
          component: 'Footer',
          count: invalidLinks.length,
          invalidLinks
        });
      }

      socialLinks.forEach(link => {
        try {
          new URL(link.href);
          logger.debug('Social link URL validated', {
            component: 'Footer',
            label: link.label,
            href: link.href
          });
        } catch (error) {
          logger.error(`Invalid URL for ${link.label}`, {
            component: 'Footer',
            label: link.label,
            href: link.href,
            error: error instanceof Error ? {
              name: error.name,
              message: error.message
            } : String(error)
          });
        }
      });

      logger.info('Social links validation completed', {
        component: 'Footer',
        totalLinks: socialLinks.length,
        validLinks: socialLinks.length - invalidLinks.length
      });
    } catch (error) {
      logger.error('Error during social links validation', {
        component: 'Footer',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }, []);

  const handleLogoClick = useCallback(() => {
    try {
      const url = 'https://mettlestate.com';
      
      logger.info('Footer logo clicked', {
        component: 'Footer',
        targetUrl: url,
        timestamp: new Date().toISOString()
      });

      const w = window.open('', '_blank');
      
      if (w) {
        try { 
          w.opener = null;
          logger.debug('Window opener set to null', {
            component: 'Footer'
          });
        } catch (openerError) {
          logger.warn('Failed to set opener to null', {
            component: 'Footer',
            error: openerError instanceof Error ? openerError.message : String(openerError)
          });
        }
        
        w.location.href = url;
        logger.debug('Window location set successfully', {
          component: 'Footer',
          url
        });
      } else {
        logger.warn('Window.open returned null - possible popup blocker', {
          component: 'Footer',
          url
        });
      }
    } catch (error) {
      logger.error('Failed to open logo link', {
        component: 'Footer',
        targetUrl: 'https://mettlestate.com',
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : String(error)
      });
    }
  }, []);

  const handleSocialClick = useCallback((label: string, href: string) => {
    try {
      logger.info('Social link clicked', { 
        component: 'Footer',
        label, 
        href,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      logger.error('Error tracking social link click', {
        component: 'Footer',
        label,
        href,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }, []);

  const handleLogoError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    logger.error('Footer logo image failed to load', {
      component: 'Footer',
      src: '/mettlestate-logo.png',
      errorType: 'image_load_error',
      action: 'hiding image element'
    });
    e.currentTarget.style.display = 'none';
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <button
              onClick={(e) => {
                handleLogoClick();
                e.currentTarget.blur();
              }}
              className="group rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 mb-4"
              aria-label="Visit Mettlestate website"
              type="button"
            >
              <img
                src="/mettlestate-logo.png"
                alt="Mettlestate logo"
                className="h-10 mx-auto md:mx-0 transition-all duration-300 ease-out
                           group-hover:scale-110 
                           group-hover:drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]
                           group-hover:brightness-110
                           group-active:scale-95"
                onError={handleLogoError}
                loading="lazy"
              />
            </button>
            <p className="text-gray-400">Building the future of esports</p>
          </div>
         
          <nav aria-label="Social media links">
            <div className="flex gap-6">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                
                return (
                  <a
                    key={`${social.label}-${index}`}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit our ${social.label} page`}
                    onClick={() => handleSocialClick(social.label, social.href)}
                    className="bg-gray-800 p-3 rounded-full hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <IconComponent 
                      className="w-5 h-5" 
                      aria-hidden="true"
                    />
                  </a>
                );
              })}
            </div>
          </nav>
        </div>
       
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} Mettlestate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};