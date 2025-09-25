'use client';
import React, { useEffect, useRef, useState } from 'react';
import './SpritePlayer.css';

interface SpritePlayerProps {
    src: string;
    frameWidth: number;
    frameHeight: number;
    frameCount: number;
    fps?: number;
    loop?: boolean;
    speed?: number;  // ความเร็วเดิน (px ต่อเฟรม)
}

const SpritePlayer: React.FC<SpritePlayerProps> = ({
    src,
    frameWidth,
    frameHeight,
    frameCount,
    fps = 5,
    loop = true,
    speed = 4,
}) => {
    const [frame, setFrame] = useState<number>(0);
    const [posX, setPosX] = useState<number>(400);
    const [direction, setDirection] = useState<number>(1);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const backgroundImg = '/img/background-forest.png';
    useEffect(() => {
        const frameDuration = 1000 / fps;

        intervalRef.current = setInterval(() => {
            setFrame(prev => {
                const next = prev + 1;
                return loop ? next % frameCount : (next < frameCount ? next : prev);
            });

            setPosX(prev => {
                const nextX = prev + speed * direction;
                // ถ้าเดินเลยขอบหน้าจอ (หน้าจอขนาด 800px สมมติ)
                if (nextX > 800) {
                    setDirection(-1); // เปลี่ยนทิศทางเดินกลับ
                    return 800; // อยู่ที่ขอบขวา
                } else if (nextX < 400) {
                    setDirection(1); // เปลี่ยนทิศทางเดินไปขวา
                    return 400; // อยู่ที่ขอบซ้าย
                }
                return nextX;
            });
        }, frameDuration);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fps, frameCount, loop, speed, direction]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'flex-start', // เดินจากซ้ายไปขวา
            alignItems: 'center',         // ✅ จัดให้กลางแนวดิ่ง
            height: '100vh',              // ✅ เต็มความสูงจอ
            overflow: 'hidden',           // ป้องกันภาพล้น
            background: `url(${backgroundImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            <div
                className="sprite-player"
                style={{
                    width: `${frameWidth}px`,
                    height: `${frameHeight}px`,
                    backgroundImage: `url(${src})`,
                    backgroundPosition: `-${frame * frameWidth}px 0px`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: `${frameWidth * frameCount}px ${frameHeight}px`,
                    transform: `translate(${posX}px, 100px) scale(${3 * direction}, 3)`,  // เลื่อนตำแหน่ง X
                    transition: `transform ${1000 / fps}ms linear`,  // ทำให้เดินนุ่มนวล
                    transformOrigin: 'center center',
                }}
            />
        </div>
    );
};

export default SpritePlayer;