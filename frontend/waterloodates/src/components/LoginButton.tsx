import React, { useState } from "react";

export default function LoginButton() {
  const [jump, setJump] = useState(false);

  // Trigger jump animation on hover start
  const handleMouseEnter = () => setJump(true);
  // Reset after animation ends
  const handleAnimationEnd = () => setJump(false);

  return (
    <div className="relative inline-block">
      <a
        href="/auth/login?returnTo=/dashboard"
        className="flex items-center gap-2 px-4 py-2 bg-[#ff76e8] text-white rounded hover:bg-[#ff96f8] transition"
        onMouseEnter={handleMouseEnter}
      >
        Find Your Match
      </a>

      {/* Heart that jumps out */}
      {jump && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#ff76e8"
          className="w-6 h-6 absolute left-1/2 -translate-x-1/2 bottom-full mb-1 animate-jump-out"
          onAnimationEnd={handleAnimationEnd}
          aria-hidden="true"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 
            3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 
            3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 
            11.54L12 21.35z" />
        </svg>
      )}

      <style jsx>{`
        @keyframes jumpOut {
          0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) translateY(-30px) scale(1.3);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-60px) scale(0.8);
          }
        }
        .animate-jump-out {
          animation: jumpOut 0.6s ease forwards;
        }
      `}</style>
    </div>
  );
}
