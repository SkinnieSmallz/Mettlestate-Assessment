import React from 'react';
import { Twitter, Youtube, Facebook, Twitch, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  const socialLinks = [
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Linkedin, label: 'Linkedin', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' },
    { icon: Twitch, label: 'Twitch', href: '#' },
  ];

  const handleLogoClick = () => {
    window.open('https://mettlestate.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <button
              onClick={handleLogoClick}
              className="hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-500 rounded mb-4"
              aria-label="Visit Mettlestate website"
            >
              <img 
                src="/mettlestate-logo.png" 
                alt="Mettlestate" 
                className="h-10 mx-auto md:mx-0"
              />
            </button>
            <p className="text-gray-400">Building the future of esports</p>
          </div>
          
          <div className="flex gap-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="bg-gray-800 p-3 rounded-full hover:bg-red-600 transition-colors"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; 2025 Mettlestate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};