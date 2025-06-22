"use client";

import confetti from "canvas-confetti";
import { useEffect } from "react";

export const PartyPopper = (props: { play: boolean }) => {
  const { play } = props

  const fireConfetti = () => {
    const end = Date.now() + 2 * 1000; // ยิง 2 วินาที

    const colors = ["#bb0000", "#003dcb", "15be00"];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });

      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      // confetti({
      //   particleCount: 5,
      //   angle: 90,
      //   spread: 70,
      //   origin: { x: 0.5, y: 1 },
      //   colors,
      // });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  useEffect(() => {
    if (play) {
      fireConfetti();
    }
  }, [play]);

  return null;
};
