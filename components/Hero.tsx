import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, PlayCircle } from 'lucide-react';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax Background Effect
      gsap.to(bgRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Initial Load Animation
      const tl = gsap.timeline();
      tl.fromTo(
        bgRef.current,
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" }
      )
        .fromTo(
          ".hero-title-line",
          { y: 100, opacity: 0, rotate: 2 },
          { y: 0, opacity: 1, rotate: 0, duration: 1, stagger: 0.15, ease: "power3.out" },
          "-=1"
        )
        .fromTo(
          ".hero-subtitle",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(
          ".hero-cta",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" },
          "-=0.4"
        );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-[110vh] w-full flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: "url('/images/banner.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center -mt-20" ref={contentRef}>
        <div className="max-w-5xl mx-auto flex flex-col items-center">

          <div className="overflow-hidden mb-2">
            <span className="hero-title-line inline-block py-1 px-4 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-accent text-sm font-bold tracking-[0.2em] uppercase mb-4">
              AI-Powered Agriculture
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
            <div><span className="hero-title-line block">জলবায়ু পরিবর্তনের</span></div>
            <div><span className="hero-title-line block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500">ঝুঁকি কমান,</span></div>
            <div><span className="hero-title-line block">ফসল বাঁচান।</span></div>
          </h1>

          <p className="hero-subtitle text-lg md:text-xl text-gray-200 mb-10 max-w-2xl font-light leading-relaxed">
            Shonali Desh connects Bangladeshi farmers with verified experts and uses hyperlocal AI to predict weather threats before they happen.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <a
              href="https://www.youtube.com/watch?v=oL2-B-sPhH4"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white text-lg font-semibold rounded-full hover:bg-white hover:text-primaryDark transition-all flex items-center justify-center gap-3 group"
            >
              <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-70">
        <span className="text-white/60 text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;