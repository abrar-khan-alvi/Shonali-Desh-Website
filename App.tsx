import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Features from './components/Features';
import Team from './components/Team';
import JoinUs from './components/JoinUs';
import Footer from './components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger globally
gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  useEffect(() => {
    // Global GSAP settings or cleanup if needed
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Features />
        <Team />
        <JoinUs />
      </main>
      <Footer />
    </div>
  );
};

export default App;