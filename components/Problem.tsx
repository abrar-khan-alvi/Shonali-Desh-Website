import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { CloudRain, Droplets, Users, AlertTriangle, Scan, Search, Siren } from 'lucide-react';

const Problem: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Only enable horizontal scroll on larger screens for better UX
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;

      if (isDesktop) {
        const sections = gsap.utils.toArray(".problem-card");
        const totalWidth = 100 * (sections.length - 1); // Percentage to move

        gsap.to(containerRef.current, {
          xPercent: -1 * (100 - 100 / sections.length * 0.5), // Adjust based on card width
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            // Calculate duration based on number of cards
            end: () => "+=" + (containerRef.current?.offsetWidth || 3000),
          },
        });
      } else {
        // Simple vertical fade up for mobile
        gsap.from(".problem-card", {
          y: 50,
          opacity: 0,
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const problems = [
    {
      id: "intro",
      type: "intro",
      title: "The Crisis in Our Fields",
      description: "Bangladeshi farmers are fighting a war against nature without any weapons.",
    },
    {
      id: 1,
      icon: <CloudRain size={32} className="text-blue-400" />,
      title: "Flash Floods",
      stat: "৳100 Bn",
      statLabel: "LOST ANNUALLY",
      description: "Water levels rise overnight. Without early warnings, harvest becomes a gamble against nature.",
      image: "/images/Flash Floods.png",
      alertLevel: "CRITICAL"
    },
    {
      id: 2,
      icon: <Droplets size={32} className="text-orange-400" />,
      title: "Salinity Spike",
      stat: "-40%",
      statLabel: "YIELD DECREASE",
      description: "Rising sea levels are silently poisoning the soil. Farmers plant seeds in land that can no longer sustain life.",
      image: "/images/Salinity Spike.png",
      alertLevel: "HIGH"
    },
    {
      id: 3,
      icon: <Users size={32} className="text-emerald-400" />,
      title: "Information Gap",
      stat: "1:675",
      statLabel: "EXPERT RATIO",
      description: "Millions of farmers rely on hearsay. Professional advice is a luxury they cannot access.",
      image: "/images/Information Gap.png",
      alertLevel: "SEVERE"
    },
  ];

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="bg-black text-white py-20 md:py-0 md:h-screen flex items-center overflow-hidden relative"
    >
      {/* Background Grid & Noise */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none"></div>

      <div
        ref={containerRef}
        className="flex flex-col md:flex-row gap-0 w-full md:w-[400%]"
      >
        {problems.map((item, index) => {
          if (item.type === "intro") {
            return (
              <div
                key={item.id}
                className="problem-card w-full md:w-screen h-auto md:h-screen flex-shrink-0 flex items-center justify-center relative p-6 bg-black"
              >
                {/* Pulse Animation */}
                <div className="absolute w-[500px] h-[500px] border border-red-500/20 rounded-full animate-ping opacity-20"></div>
                <div className="absolute w-[300px] h-[300px] border border-red-500/30 rounded-full animate-ping opacity-30 delay-75"></div>

                <div className="relative z-20 text-center max-w-4xl">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-red-500 tracking-[0.3em] text-sm font-mono uppercase">System Alert</span>
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  </div>
                  <h2 className="text-6xl md:text-9xl font-bold text-white mb-2 tracking-tighter uppercase">
                    The Invisible <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-black">Enemy.</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-400 mt-8 max-w-2xl mx-auto font-light border-l-2 border-red-900 pl-6 text-left">
                    Climate change isn't coming. <br />
                    <span className="text-white font-semibold">It's already destroying our food security.</span>
                  </p>

                  <div className="mt-12 flex justify-center">
                    <div className="animate-bounce p-3 border border-white/10 rounded-full">
                      <span className="text-xs text-gray-500 uppercase tracking-widest">Initiate Scan &rarr;</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={item.id}
              className="problem-card w-full md:w-screen h-auto md:h-screen flex-shrink-0 flex items-center justify-center p-6 relative bg-black/90 border-r border-white/5"
            >
              {/* Giant Background Number */}
              <div className="absolute top-10 left-10 text-[20vw] font-bold text-white/5 leading-none select-none font-mono">
                0{index}
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 max-w-7xl w-full items-center">

                {/* Visual Side (Left) */}
                <div className="md:col-span-7 relative group">
                  {/* Frame */}
                  <div className="relative rounded-sm overflow-hidden border border-white/20 p-2 bg-white/5 backdrop-blur-sm">
                    {/* Tech Markers */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-red-500 z-20"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-red-500 z-20"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-red-500 z-20"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-red-500 z-20"></div>

                    {/* Image */}
                    <div className="relative overflow-hidden h-[400px] md:h-[500px]">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover filter grayscale contrast-125 brightness-75 group-hover:scale-110 transition-transform duration-700" />
                      {/* Red Tint Overlay */}
                      <div className="absolute inset-0 bg-red-900/30 mix-blend-overlay"></div>
                      {/* Scan Line */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/20 to-transparent w-full h-[10%] animate-[scan_3s_ease-in-out_infinite]"></div>
                    </div>

                    {/* Alert Badge */}
                    <div className="absolute top-6 left-6 bg-red-600/90 backdrop-blur text-white px-4 py-1 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                      <Siren size={14} className="animate-pulse" />
                      Threat Level: {item.alertLevel}
                    </div>
                  </div>
                </div>

                {/* Data Side (Right) */}
                <div className="md:col-span-5 flex flex-col justify-center">
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10">
                    {item.icon}
                  </div>

                  <h3 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-lg text-gray-400 leading-relaxed mb-10 border-l border-white/20 pl-6">
                    {item.description}
                  </p>

                  {/* Stat Block */}
                  <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex items-center justify-between group-hover:bg-white/10 transition-colors">
                    <div>
                      <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Impact Analysis</span>
                      <span className="block text-4xl md:text-5xl font-mono font-bold text-red-500">{item.stat}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs text-gray-500 uppercase tracking-wider">{item.statLabel}</span>
                      <Search className="inline-block mt-2 text-gray-600" size={24} />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes scan {
            0% { top: -10%; opacity: 0; }
            50% { opacity: 1; }
            100% { top: 110%; opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default Problem;