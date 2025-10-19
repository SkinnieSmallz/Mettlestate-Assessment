import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CountdownTimer } from './components/CountdownTimer';
import { RegistrationCounter } from './components/RegistrationCounter';
import { EventDetails } from './components/EventDetails';
import { Leaderboard } from './components/Leaderboard';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { RegistrationForm } from './components/RegistrationForm';
import { RulesModal } from './components/RulesModal';
import { RegistrationsModal } from './components/RegistrationsModal';

const App: React.FC = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(false);

  const handleRegisterClick = () => {
    setIsRegistrationOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header 
        onRulesClick={() => setIsRulesOpen(true)}
        onRegistrationsClick={() => setIsRegistrationsOpen(true)}
      />
      <Hero onRegisterClick={handleRegisterClick} />
      <CountdownTimer />
      <RegistrationCounter />
      <EventDetails />
      <Leaderboard />
      <FAQ />
      <Footer />
      
      <RegistrationForm
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
      />
      
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
      
      <RegistrationsModal
        isOpen={isRegistrationsOpen}
        onClose={() => setIsRegistrationsOpen(false)}
        onRegisterClick={handleRegisterClick}
      />
    </div>
  );
};

export default App;