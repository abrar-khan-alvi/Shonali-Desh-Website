import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Facebook, Twitter, Instagram, ArrowUp } from 'lucide-react';

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal Animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
        }
      });

      tl.fromTo(".footer-content-up", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
      );

      // Background Blob Float Animation
      gsap.to(".footer-blob", {
        y: "20px",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 2
      });

    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!footerRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const xPos = (clientX / innerWidth - 0.5) * 50;
    const yPos = (clientY / innerHeight - 0.5) * 50;

    gsap.to(".footer-blob-1", { x: xPos, y: yPos, duration: 2, ease: "power2.out" });
    gsap.to(".footer-blob-2", { x: -xPos, y: -yPos, duration: 2, ease: "power2.out" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      id="waitlist" 
      ref={footerRef}
      onMouseMove={handleMouseMove}
      className="bg-gray-950 text-white relative pt-32 pb-10 overflow-hidden"
    >
      
      {/* Abstract Interactive Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="footer-blob footer-blob-1 absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
          <div className="footer-blob footer-blob-2 absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]"></div>
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03]" 
               style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
          </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Main Center Content */}
        <div className="flex flex-col items-center text-center mb-24 border-b border-gray-800/50 pb-20">
            <div className="footer-content-up max-w-4xl mx-auto">
                <div className="inline-block px-3 py-1 rounded-full bg-green-900/30 border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-wider mb-8">
                    Join the Movement
                </div>
                <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1]">
                    Ready to Secure <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Your Harvest?</span>
                </h2>
                <p className="text-gray-400 text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                    Don't let another season go to waste. <br/> Join the revolution today and access the future of farming.
                </p>
            </div>
        </div>

        {/* Footer Bottom Links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">Shonali Desh</h3>
            <p className="text-gray-500 text-sm">Innovating Agriculture in Bangladesh</p>
          </div>
          
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram].map((Icon, idx) => (
                <a 
                    key={idx}
                    href="#" 
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
                >
                    <Icon size={20} />
                </a>
            ))}
          </div>
          
           {/* Scroll Top Button */}
           <button 
                onClick={scrollToTop}
                className="group flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
           >
                <span className="text-sm font-medium">Back to Top</span>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                    <ArrowUp size={18} />
                </div>
           </button>
        </div>

        <div className="mt-16 text-center border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-600 text-xs">
            <p>&copy; {new Date().getFullYear()} Shonali Desh. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;