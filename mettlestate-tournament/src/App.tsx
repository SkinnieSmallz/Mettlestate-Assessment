import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { EventDetails } from './components/EventDetails';
import { RegistrationForm } from './components/RegistrationForm';
import { Leaderboard } from './components/Leaderboard';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Hero onRegisterClick={() => setIsRegistrationOpen(true)} />
      <EventDetails />
      <Leaderboard />
      <FAQ />
      <Footer />
      
      <RegistrationForm
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
      />
    </div>
  );
};

export default App;