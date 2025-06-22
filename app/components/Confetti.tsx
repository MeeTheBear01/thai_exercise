// components/Confetti.tsx
"use client";
import { useEffect, useState } from "react";

const Confetti = () => {
  const [confettis, setConfettis] = useState<Array<{ id: number; x: number }>>([]);

  useEffect(() => {
    const newConfettis = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // random left position
    }));
    setConfettis(newConfettis);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
      {confettis.map(({ id, x }) => (
        <div
          key={id}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: `${x}%`,
            top: `0%`,
            backgroundColor: randomColor(),
            animation: "fall 2s ease-out forwards",
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

const randomColor = () => {
  const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#F72585"];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default Confetti;
