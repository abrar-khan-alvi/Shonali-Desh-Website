import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, MessageSquare, MapPin, Zap, Activity } from 'lucide-react';

const Features: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      id: 1,
      title: "Hyperlocal AI Warnings",
      subtitle: "Predict disasters days before they strike.",
      description: "Our proprietary AI analyzes satellite imagery and local weather stations to provide upazila-level warnings. Know about flash floods 48 hours in advance.",
      icon: <MapPin className="text-white" size={24} />,
      color: "bg-blue-600",
      image: "/images/Hyperlocal AI Warnings.png",
    },
    {
      id: 2,
      title: "Real-Time Ground-Truth Data",
      subtitle: "Precision farming starts with truth.",
      description: "Our proprietary IoT field sensors provide live, 24/7 data on crucial metrics like soil salinity, temperature, and moisture. This ground-truth data fuels our AI models, making our predictions more accurate than any other service.",
      icon: <Activity className="text-white" size={24} />,
      color: "bg-orange-600",
      image: "/images/Real-Time Ground-Truth Data.png",
    },
    {
      id: 3,
      title: "Verified Expert Marketplace",
      subtitle: "Professional help in your pocket.",
      description: "No more guesswork. Connect instantly with certified agricultural officers. Send photos, get diagnosis, and receive treatment plans within minutes.",
      icon: <ShieldCheck className="text-white" size={24} />,
      color: "bg-emerald-600",
      image: "/images/Verified Expert Marketplace.png",
    },
    {
      id: 4,
      title: "AI Crop Doctor",
      subtitle: "Instant diagnosis for 50+ diseases.",
      description: "Simply snap a photo of a diseased leaf. Our computer vision model identifies the pathogen and recommends the exact dosage of medicine needed.",
      icon: <MessageSquare className="text-white" size={24} />,
      color: "bg-accent",
      image: "/images/AI Crop Doctor.png",
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the left panel while scrolling through right panel sections
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: leftPanelRef.current,
      });

      // Animate images based on scroll position
      features.forEach((feature, index) => {
        const section = document.getElementById(`feature-text-${index}`);
        const image = document.getElementById(`feature-img-${index}`);

        if (section && image) {
          ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onEnter: () => {
              gsap.to(".feature-img", { opacity: 0, scale: 0.95, duration: 0.5 });
              gsap.to(image, { opacity: 1, scale: 1, duration: 0.5 });
            },
            onEnterBack: () => {
              gsap.to(".feature-img", { opacity: 0, scale: 0.95, duration: 0.5 });
              gsap.to(image, { opacity: 1, scale: 1, duration: 0.5 });
            }
          });
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={containerRef} className="relative bg-bgLight">
      <div className="flex flex-col md:flex-row">

        {/* Left Panel - Pinned Images (Hidden on Mobile) */}
        <div
          ref={leftPanelRef}
          className="hidden md:flex w-1/2 h-screen sticky top-0 bg-gray-900 items-center justify-center overflow-hidden"
        >
          <div className="relative w-full h-full bg-gray-900">
            <div className="absolute inset-0 bg-black/20 z-10"></div>
            {features.map((feature, index) => (
              <img
                key={index}
                id={`feature-img-${index}`}
                src={feature.image}
                alt={feature.title}
                className={`feature-img absolute inset-0 w-full h-full object-contain transition-all duration-700 ${index === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              />
            ))}
            {/* Decorative Overlay */}
            <div className="absolute bottom-10 left-10 z-20 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 max-w-sm">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="text-yellow-400 fill-yellow-400" size={20} />
                <span className="text-white font-bold tracking-wide text-sm uppercase">Live Demo</span>
              </div>
              <p className="text-gray-200 text-sm">Experience the power of Shonali Desh directly on your device. Real-time data processing.</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Scrolling Text */}
        <div ref={rightPanelRef} className="w-full md:w-1/2">
          {features.map((feature, index) => (
            <div
              key={index}
              id={`feature-text-${index}`}
              className="min-h-screen flex flex-col justify-center px-8 md:px-20 py-20 border-b border-gray-200 md:border-none"
            >
              {/* Mobile Image (Visible only on mobile) */}
              <div className="md:hidden mb-8 rounded-xl overflow-hidden shadow-lg h-64">
                <img src={feature.image} alt={feature.title} className="w-full h-full object-contain" />
              </div>

              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-6 shadow-lg transform -rotate-3`}>
                {feature.icon}
              </div>

              <h3 className="text-4xl font-bold text-textDark mb-3">{feature.title}</h3>
              <p className="text-xl text-primary font-medium mb-6">{feature.subtitle}</p>

              <p className="text-lg text-textLight leading-relaxed mb-8">
                {feature.description}
              </p>

              <button className="flex items-center gap-2 text-textDark font-bold hover:text-primary transition-colors group">
                Learn more
                <span className="w-8 h-[2px] bg-primary group-hover:w-12 transition-all"></span>
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;