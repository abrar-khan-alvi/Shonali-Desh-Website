import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { Linkedin, Github } from 'lucide-react';

const Team: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".team-card",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const teamMembers = [
    {
      name: "Abrar Khan Alvi",
      role: "Project Lead & Systems Architect",
      img: "/images/abrar.jpg",
      linkedin: "https://www.linkedin.com/in/abrarkhanalvi/",
      github: "https://github.com/abrar-khan-alvi",
    },
    {
      name: "Zenun Chowdhury",
      role: "Lead AI/ML Developer",
      img: "/images/zenunchowdhury.png",
      linkedin: "https://www.linkedin.com/in/zenun-chowdhury-770629223/",
      github: "https://github.com/zenuncrack",
    },
    {
      name: "Afia Fahmida Dona",
      role: "Operations & User Experience Lead",
      img: "/images/afiafahmida.png",
      linkedin: "https://www.linkedin.com/in/afia-fahmida-1b1b65243/",
      github: "https://github.com/afiafahmida",
    },
    {
      name: "HM Ziyad",
      role: "IoT & Data Engineer",
      img: "/images/hmziyad.png",
      linkedin: "https://www.linkedin.com/in/hm-ziyad-09154b234/",
      github: "https://github.com/HMZiyad",
    },
  ];

  return (
    <section id="our-team" className="py-32 bg-white relative overflow-hidden" ref={containerRef}>
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-textDark mb-6 tracking-tight">
            Innovators for <span className="text-primary italic">Impact</span>.
          </h2>
          <p className="text-textLight text-xl">
            We are a team of engineers, botanists, and data scientists dedicated to solving the climate crisis in agriculture.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card group relative h-[400px] w-full cursor-pointer perspective">
              <div className="relative w-full h-full transition-transform duration-500 transform-style-3d group-hover:translate-y-[-10px]">
                {/* Image Container */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-500">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="h-1 w-12 bg-accent mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <h3 className="text-white font-bold text-2xl mb-1">{member.name}</h3>
                  <p className="text-gray-300 text-sm mb-4 font-medium tracking-wide">{member.role}</p>

                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white hover:text-primary transition-colors">
                      <Linkedin size={18} />
                    </a>
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white hover:text-primary transition-colors">
                      <Github size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;