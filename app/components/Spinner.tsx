'use client';
import React, {
  useState, useEffect, useRef,
  useCallback, forwardRef, useImperativeHandle,
} from 'react';
import { SpinnerHandle } from '../utils/SpinnerHandle';
const ICON_HEIGHT = 188;

type SpinnerProps = {
  timer: number;
  onFinish: (position: number) => void;
};

const Spinner = forwardRef<SpinnerHandle, SpinnerProps>(({ onFinish, timer }, ref) => {
  const [position, setPosition] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timer);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const multiplierRef = useRef(Math.floor(Math.random() * 3) + 1);
  const startPositionRef = useRef(Math.floor(Math.random() * 9) * ICON_HEIGHT * -1);
  const speedRef = useRef(ICON_HEIGHT * multiplierRef.current);

  const reset = useCallback(() => {
    clearInterval(timerRef.current as NodeJS.Timeout);
    startPositionRef.current = Math.floor(Math.random() * 9) * ICON_HEIGHT * -1;
    multiplierRef.current = Math.floor(Math.random() * 3) + 1;
    speedRef.current = ICON_HEIGHT * multiplierRef.current;
    setPosition(startPositionRef.current);
    setTimeRemaining(timer);

    timerRef.current = setInterval(() => tick(), 100);
  }, [timer]);

  const getSymbolFromPosition = useCallback(() => {
    const totalSymbols = 9;
    const maxPosition = ICON_HEIGHT * (totalSymbols - 1) * -1;
    const moved = (timer / 100) * multiplierRef.current;
    let currentPosition = startPositionRef.current;

    for (let i = 0; i < moved; i++) {
      currentPosition -= ICON_HEIGHT;
      if (currentPosition < maxPosition) currentPosition = 0;
    }

    onFinish(currentPosition);
  }, [timer, onFinish]);

  const tick = useCallback(() => {
    setTimeRemaining((prev) => {
      if (prev <= 0) {
        clearInterval(timerRef.current as NodeJS.Timeout);
        getSymbolFromPosition();
        return 0;
      }
      setPosition((prevPosition) => prevPosition - speedRef.current);
      return prev - 100;
    });
  }, [getSymbolFromPosition]);

  useEffect(() => {
    reset();
    return () => clearInterval(timerRef.current as NodeJS.Timeout);
  }, [reset]);

  useImperativeHandle(ref, () => ({ reset }), [reset]);

  return <div className="icons" style={{ backgroundPosition: `0px ${position}px` }} />;
});

Spinner.displayName = 'Spinner';
export default Spinner;
