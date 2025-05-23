"use client";

import MusicCarousel from "@/components/MusicCarousel";
import NavButton from "@/components/NavButton";
import ProjectCarousel from "@/components/ProjectCarousel";
import { Mail, Github, Linkedin, Instagram, Link } from "lucide-react";

export default function HomePage() {
  return (
    <div className="h-[100dvh] w-full flex flex-col bg-black text-white overflow-x-hidden">
      <main className="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth overflow-x-hidden">
        {/* HERO SECTION */}
        <section className="h-full flex flex-col justify-center items-center text-center px-6 snap-start ">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-wide mb-12">
            SION GANG
          </h1>
          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            <NavButton href="#aboutme">About</NavButton>
            <NavButton href="#projects">Projects</NavButton>
            <NavButton href="#music">Music</NavButton>
            {/* Uncomment when experience and contact sections are added */}
            {/* <NavButton href="#experience">Experience</NavButton> */}
            {/* <NavButton href="#contact">Contact</NavButton> */}
          </div>
        </section>

        <section
          id="aboutme"
          className="h-full flex flex-col justify-center items-center snap-start scroll-my-[15px] bg-black text-white"
        >
          <h2 className="text-4xl font-bold">About Me</h2>
          <div className="flex flex-col justify-center items-center w-[75%] md:w-1/2  text-center mt-8 space-y-6">
            <p className="text-lg">
              {`Hey! I'm Sion, a Computer Engineering Student at the Univeristy of
              Waterloo.`}
              <br></br>
              {`I'm also a problem solver 🤔, music creator 🎧, tech enthusiast ⚙️, and a former national-stage kicker 🥋`}
            </p>
            <div className="flex items-center gap-6 mt-4">
              <a href="mailto:siongang@gmail.com" target="_blank">
                <Mail className="w-6 h-6 hover:opacity-80 transition" />
              </a>
              <a href="https://github.com/siongang" target="_blank">
                <Github className="w-6 h-6 hover:opacity-80 transition" />
              </a>
              <a
                href="https://www.linkedin.com/in/sion-gang-02262618a/"
                target="_blank"
              >
                <Linkedin className="w-6 h-6 hover:opacity-80 transition" />
              </a>
              <a
                href="https://www.instagram.com/siongang_music/"
                target="_blank"
              >
                <Instagram className="w-6 h-6 hover:opacity-80 transition" />
              </a>
              <a
                href="/SionGangResumePersonal.pdf"
                target="_blank"
                className="flex items-center space-x-1 hover:opacity-80 transition"
              >
                <Link className="w-4 h-4" />
                <span className="underline text-white hover:text-opacity-80 transition">
                  My Resume
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section
          id="projects"
          className="h-full flex flex-col justify-center items-center snap-start scroll-my-[15px] bg-black "
        >
          <div className="flex">
            <h2 className="text-4xl font-bold">Projects</h2>
          </div>
          <div className="flex flex-col items-center justify-center w-1/2">
            <ProjectCarousel />
            <div className="mt-6">
              <a
                href="https://github.com/siongang"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-4 py-2 rounded-full border border-white text-white hover:bg-white hover:text-black transition"
              >
                View More on GitHub →
              </a>
            </div>
          </div>
        </section>

        {/* MUSIC */}
        <section
          id="music"
          className="h-full flex flex-col justify-center items-center snap-start scroll-my-[15px] bg-black "
        >
          <div className="flex flex-col items-center justify-center ">
            <h2 className="text-4xl font-bold">Music</h2>
            <p className="text-sm text-gray-400 mt-2 ml-1">originals composed and produced by yours truly.</p>
          </div>

          <div className="flex flex-row justify-center w-1/2">
            <MusicCarousel />
          </div>
        </section>

        {/* EXPERIENCE */}
        {/* <section
        id="experience"
        className="h-screen flex justify-center items-center snap-start bg-black "
      >
        <h2 className="text-4xl font-bold">Experience</h2>
      </section> */}

        {/* CONTACT */}
        {/* <section
        id="contact"
        className="h-screen flex justify-center items-center snap-start bg-black "
      >
        <h2 className="text-4xl font-bold">Contact</h2>
      </section>
    */}
      </main>

      {/* FOOTER*/}
      <footer className="w-full bg-black text-gray-500 text-xs text-center py-2 border-t border-gray-700">
        <p>
          © {new Date().getFullYear()} Sion Gang. Built with too much instant
          ramen and not enough sleep.
        </p>
      </footer>
    </div>
  );
}
