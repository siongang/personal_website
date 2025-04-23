import React, { useEffect, useState } from "react";
import Image from "next/image";
export type Project = {
  id: number;
  title: string;
  image_path: string;
  description: string;
  tools: string[];
  links?: {
    name: string;
    url: string;
  }[];
};

type Props = {
  card: Project;
  onClose: () => void;
};

const ProjectModal: React.FC<Props> = ({ card, onClose }) => {
  const [exitingCard, setExitingCard] = useState(false);

  const handleClose = () => {
    setExitingCard(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  
  
  
  return (

    
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div
          className={`bg-[#1e1e1e]/90 text-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl relative ${
            exitingCard ? "fade-out" : "fade-in"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-400 transition"
          >
            ×
          </button>

          {/* Title */}
          <h2 className="text-4xl font-bold mb-6 text-center">{card.title}</h2>

          {/* Tools / Technologies */}
          <div className="mb-6 flex flex-wrap justify-center gap-3">
            {card.tools.map((tool, i) => (
              <span
                key={i}
                className="bg-gray-800 text-white/90 text-sm px-4 py-1 rounded-full shadow-sm"
              >
                {tool}
              </span>
            ))}
          </div>

          {/* Links */}
          {card.links && (
            <div className="mb-8 flex justify-center gap-6 flex-wrap">
              {card.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}

          {/* Image */}
          <div className="mb-8 flex justify-center">
            <Image
              src={card.image_path}
              alt={card.title}
              width={400}
              height={300}
              className="rounded-xl shadow-md object-contain max-h-[300px]"
            />
          </div>

          {/* Description */}
          <p className="text-md leading-relaxed text-gray-300 text-center px-2">
            {card.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
