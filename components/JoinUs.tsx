import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Tractor, GraduationCap, ArrowRight, MousePointer2 } from 'lucide-react';
import FarmerModal from './FarmerModal';
import ExpertModal from './ExpertModal';

const JoinUs: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<'farmer' | 'expert' | null>(null);
  const [isFarmerModalOpen, setIsFarmerModalOpen] = useState(false);
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);

  // Refs for 3D tilt effect
  const farmerCardRef = useRef<HTMLDivElement>(null);
  const expertCardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Intro Animation
      gsap.fromTo(".join-title-char",
        { y: 100, opacity: 0, rotateX: -90 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.05,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          }
        }
      );

      gsap.fromTo(".perspective-card",
        { y: 100, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 3D Tilt Logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardRef: React.RefObject<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation (-15deg to 15deg)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10; // Inverted for natural feel
    const rotateY = ((x - centerX) / centerX) * 10;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 1000,
      transformOrigin: "center center"
    });

    // Move content slightly opposite for parallax
    gsap.to(card.querySelectorAll('.card-content'), {
      x: (x - centerX) / 20,
      y: (y - centerY) / 20,
      duration: 0.5,
      ease: "power2.out"
    });

    // Move glare
    gsap.to(card.querySelectorAll('.card-glare'), {
      x: x,
      y: y,
      opacity: 0.6, // show glare
      duration: 0.1
    });
  };

  const handleMouseLeave = (cardRef: React.RefObject<HTMLDivElement>) => {
    if (!cardRef.current) return;

    setHoveredCard(null);

    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.7,
      ease: "elastic.out(1, 0.5)",
      clearProps: "all"
    });

    gsap.to(cardRef.current.querySelectorAll('.card-content'), {
      x: 0,
      y: 0,
      duration: 0.7
    });

    gsap.to(cardRef.current.querySelectorAll('.card-glare'), {
      opacity: 0,
      duration: 0.3
    });
  };

  return (
    <section id="join-us" ref={containerRef} className="py-32 bg-gray-900 relative overflow-hidden perspective-1000">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-900 to-black"></div>
        {/* Animated blobs */}
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] transition-all duration-1000 ${hoveredCard === 'farmer' ? 'opacity-100 scale-125' : 'opacity-30 scale-100'}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px] transition-all duration-1000 ${hoveredCard === 'expert' ? 'opacity-100 scale-125' : 'opacity-30 scale-100'}`}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm mb-6 uppercase tracking-widest hover:bg-white/10 transition-colors">
            <MousePointer2 size={14} />
            <span>Choose your path</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            {"Join the Revolution".split("").map((char, i) => (
              <span key={i} className="join-title-char inline-block whitespace-pre">{char}</span>
            ))}
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light">
            We are building an ecosystem where technology meets tradition.
            <br className="hidden md:block" /> Select your role to begin.
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto h-[600px] md:h-[500px]">

          {/* Farmer Card */}
          <div
            ref={farmerCardRef}
            className={`perspective-card relative w-full h-full rounded-3xl cursor-pointer group transition-all duration-500 ${hoveredCard === 'expert' ? 'blur-sm opacity-50 scale-95' : 'opacity-100 scale-100'}`}
            onMouseMove={(e) => handleMouseMove(e, farmerCardRef)}
            onMouseLeave={() => handleMouseLeave(farmerCardRef)}
            onMouseEnter={() => setHoveredCard('farmer')}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Card Content Wrapper */}
            <div className="absolute inset-0 bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              {/* Background Img */}
              <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-110 transition-transform duration-1000 ease-out"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-58197bd47f3b?q=80&w=2070&auto=format&fit=crop')" }}
              ></div>
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primaryDark via-primaryDark/80 to-transparent opacity-90"></div>

              {/* Glare Effect */}
              <div
                className="card-glare absolute w-64 h-64 bg-white/20 blur-[60px] rounded-full pointer-events-none opacity-0 mix-blend-overlay"
                style={{ transform: 'translate(-50%, -50%)' }}
              ></div>

              {/* Floating Content */}
              <div className="card-content relative h-full flex flex-col justify-end p-10 md:p-14 z-20" style={{ transform: "translateZ(30px)" }}>
                <div className="mb-auto transform group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-8 shadow-[0_0_30px_rgba(72,187,120,0.3)]">
                    <Tractor size={32} className="text-green-400" />
                  </div>
                </div>

                <h3 className="text-4xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">I am a Farmer</h3>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                  Secure your harvest with AI-driven weather alerts and connect with verified agricultural officers instantly.
                </p>

                <button onClick={() => setIsFarmerModalOpen(true)} className="flex items-center gap-4 text-white font-bold text-lg group/btn w-fit">
                  <span className="border-b-2 border-green-500 pb-1">Join the Waitlist</span>
                  <div className="bg-green-500 p-2 rounded-full transform group-hover/btn:translate-x-2 transition-transform">
                    <ArrowRight size={20} />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Expert Card */}
          <div
            ref={expertCardRef}
            className={`perspective-card relative w-full h-full rounded-3xl cursor-pointer group transition-all duration-500 ${hoveredCard === 'farmer' ? 'blur-sm opacity-50 scale-95' : 'opacity-100 scale-100'}`}
            onMouseMove={(e) => handleMouseMove(e, expertCardRef)}
            onMouseLeave={() => handleMouseLeave(expertCardRef)}
            onMouseEnter={() => setHoveredCard('expert')}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Card Content Wrapper */}
            <div className="absolute inset-0 bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              {/* Background Img */}
              <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-110 transition-transform duration-1000 ease-out"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop')" }}
              ></div>
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent opacity-95"></div>

              {/* Glare Effect */}
              <div
                className="card-glare absolute w-64 h-64 bg-white/20 blur-[60px] rounded-full pointer-events-none opacity-0 mix-blend-overlay"
                style={{ transform: 'translate(-50%, -50%)' }}
              ></div>

              {/* Floating Content */}
              <div className="card-content relative h-full flex flex-col justify-end p-10 md:p-14 z-20" style={{ transform: "translateZ(30px)" }}>
                <div className="mb-auto transform group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-8 shadow-[0_0_30px_rgba(214,158,46,0.3)]">
                    <GraduationCap size={32} className="text-accent" />
                  </div>
                </div>

                <h3 className="text-4xl font-bold text-white mb-4 group-hover:text-accent transition-colors">I am an Expert</h3>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                  Share your knowledge, diagnose crop diseases remotely, and earn recognition for your contribution.
                </p>

                <button onClick={() => setIsExpertModalOpen(true)} className="flex items-center gap-4 text-white font-bold text-lg group/btn w-fit">
                  <span className="border-b-2 border-accent pb-1">Apply for Access</span>
                  <div className="bg-accent p-2 rounded-full transform group-hover/btn:translate-x-2 transition-transform">
                    <ArrowRight size={20} />
                  </div>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      <FarmerModal isOpen={isFarmerModalOpen} onClose={() => setIsFarmerModalOpen(false)} />
      <ExpertModal isOpen={isExpertModalOpen} onClose={() => setIsExpertModalOpen(false)} />
    </section>
  );
};

export default JoinUs;