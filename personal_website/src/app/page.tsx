'use client';

import NavButton from '@/components/NavButton';
import ProjectCarousel from '@/components/ProjectCarousel';

export default function HomePage() {
  return (
    <main
      className="h-screen w-full overflow-x-hidden  snap-y snap-mandatory scroll-smooth bg-black text-white"
    >
      {/* HERO SECTION */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6 snap-start">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-wide mb-12">
          SION GANG
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
          <NavButton href="#projects">Projects</NavButton>
          <NavButton href="#music">Music</NavButton>
          <NavButton href="#experience">Experience</NavButton>
          <NavButton href="#contact">Contact</NavButton>
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="projects"
        className="h-screen flex flex-col justify-center items-center snap-start bg-[#111]"
      >
        <div className="flex">  
          <h2 className="text-4xl font-bold">Projects</h2>
        </div>
        <div className = "flex flex-row w-1/2">
        <ProjectCarousel />
        </div>
      </section>

      {/* MUSIC */}
      <section
        id="music"
        className="h-screen flex justify-center items-center snap-start bg-[#181818]"
      >
        <h2 className="text-4xl font-bold">Music</h2>
      </section>

      {/* EXPERIENCE */}
      <section
        id="experience"
        className="h-screen flex justify-center items-center snap-start bg-[#222]"
      >
        <h2 className="text-4xl font-bold">Experience</h2>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="h-screen flex justify-center items-center snap-start bg-[#282828]"
      >
        <h2 className="text-4xl font-bold">Contact</h2>
      </section>
    </main>
  );
}
