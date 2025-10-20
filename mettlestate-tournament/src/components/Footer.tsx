import React from 'react';
import { Twitter, Youtube, Facebook, Twitch, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  const socialLinks = [
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/mettlestate' },
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/mettlestate' },
    { icon: Linkedin, label: 'Linkedin', href: 'https://za.linkedin.com/company/mettlestate' },
    { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/@mettlestate' },
    { icon: Twitch, label: 'Twitch', href: 'https://twitch.tv/mettlestate' },
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
              className="group focus:outline-none focus:ring-2 focus:ring-red-500 rounded mb-4"
              aria-label="Visit Mettlestate website"
            >
              <img
                src="/mettlestate-logo.png"
                alt="Mettlestate"
                className="h-10 mx-auto md:mx-0 transition-all duration-300 ease-out
                           group-hover:scale-110 
                           group-hover:drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]
                           group-hover:brightness-110
                           group-active:scale-95"
              />
            </button>
            <p className="text-gray-400">Building the future of esports</p>
          </div>
         
          <div className="flex gap-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
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