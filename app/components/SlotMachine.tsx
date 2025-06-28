'use client';
import React, { useState, useRef } from 'react';
import Spinner from './Spinner';
import RepeatButton from './RepeatButton';
import WinningSound from './WinningSound';
import { SpinnerHandle } from '../utils/SpinnerHandle';

const LOSER_MESSAGES = [
    'Not quite', 'Stop gambling', 'Hey, you lost!',
    'Ouch! I felt that', "Don't beat yourself up",
    'There goes the college fund', 'I have a cat. You have a loss',
    "You're awesome at losing", 'Coding is hard',
    "Don't hate the coder"
];

const SlotMachine = () => {
    const [winner, setWinner] = useState<boolean | null>(null);
    const [matches, setMatches] = useState<number[]>([]);
    const spinnerRefs = useRef<Array<SpinnerHandle | null>>([]);

    const handleFinish = (value: number) => {
        setMatches((prev) => {
            const newMatches = [...prev, value];
            if (newMatches.length === 3) {
                const first = newMatches[0];
                setWinner(newMatches.every((match) => match === first));
            }
            return newMatches;
        });
    };

    const handleClick = () => {
        setWinner(null);
        setMatches([]);
        spinnerRefs.current.forEach((s) => s?.reset());
    };

    const getLoserMessage = () =>
        LOSER_MESSAGES[Math.floor(Math.random() * LOSER_MESSAGES.length)];

    return (
        <div>
            {winner && <WinningSound />}
            <h1 className="text-white">
                {winner === null ? 'Waiting…' : winner ? '🤑 Pure skill! 🤑' : getLoserMessage()}
            </h1>

            <div className="spinner-container">
                {[1000, 1400, 2200].map((timer, i) => (
                    <Spinner
                        key={i}
                        timer={timer}
                        onFinish={handleFinish}
                        ref={(el) => {
                            spinnerRefs.current[i] = el;
                        }}

                    />
                ))}
                <div className="gradient-fade" />
            </div>

            {winner !== null && <RepeatButton onClick={handleClick} />}
        </div>
    );
};

export default SlotMachine;
