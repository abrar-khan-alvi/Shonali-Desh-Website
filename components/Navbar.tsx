import React, { useState, useEffect } from 'react';
import { Menu, X, Sprout } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Problem', href: '#problem' },
    { name: 'Features', href: '#features' },
    { name: 'Our Team', href: '#our-team' },
    { name: 'Join Us', href: '#join-us' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b border-transparent ${isScrolled
        ? 'bg-white/80 backdrop-blur-md border-gray-100 py-3 shadow-sm'
        : 'bg-transparent py-6'
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <img
            src="/images/Logo.png"
            alt="Shonali Desh Logo"
            className="h-10 w-10 object-contain"
          />
          <span className={`font-bold text-xl tracking-tight transition-colors ${isScrolled ? 'text-primaryDark' : 'text-white'}`}>
            Shonali Desh
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm font-semibold uppercase tracking-wider transition-colors hover:text-accent ${isScrolled
                ? 'text-textDark'
                : 'text-white/90'
                }`}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#join-us"
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all transform hover:scale-105 shadow-lg ${isScrolled
              ? 'bg-primary text-white hover:bg-primaryDark'
              : 'bg-white text-primary hover:bg-gray-100'
              }`}
          >
            Join Waitlist
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X size={28} className={isScrolled ? 'text-textDark' : 'text-white'} />
          ) : (
            <Menu size={28} className={isScrolled ? 'text-textDark' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <div
        className={`absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl md:hidden flex flex-col items-center overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[500px] py-8 opacity-100' : 'max-h-0 py-0 opacity-0'
          }`}
      >
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="text-textDark font-medium text-lg py-3 hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.name}
          </a>
        ))}
        <a
          href="#join-us"
          className="mt-4 px-8 py-3 bg-primary text-white rounded-full font-semibold shadow-md active:scale-95 transition-transform"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Join Waitlist
        </a>
      </div>
    </nav>
  );
};

export default Navbar;