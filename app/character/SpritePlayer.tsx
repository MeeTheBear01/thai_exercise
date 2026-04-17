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
    const [posX, setPosX] = useState<number>(0);
    const [direction, setDirection] = useState<number>(1);
    const [screenWidth, setScreenWidth] = useState<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const backgroundImg = '/img/background-forest.png';

    useEffect(() => {
        const updateWidth = () => {
            setScreenWidth(window.innerWidth);
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    useEffect(() => {
        if (screenWidth === 0) return;

        const frameDuration = 1000 / fps;

        intervalRef.current = setInterval(() => {
            setFrame(prev => {
                const next = prev + 1;
                return loop ? next % frameCount : (next < frameCount ? next : prev);
            });

            setPosX(prev => {
                const nextX = prev + speed * direction;
                // ถ้าเดินเลยขอบหน้าจอ
                if (nextX > screenWidth - frameWidth * 3) {
                    setDirection(-1); // เปลี่ยนทิศทางเดินกลับ
                    return screenWidth - frameWidth * 3;
                } else if (nextX < 0) {
                    setDirection(1); // เปลี่ยนทิศทางเดินไปขวา
                    return 0;
                }
                return nextX;
            });
        }, frameDuration);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fps, frameCount, loop, speed, direction, screenWidth, frameWidth]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            background: `url(${backgroundImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
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
                    transform: `translate(${posX}px, 100px) scale(${3 * direction}, 3)`,
                    transition: `transform ${1000 / fps}ms linear`,
                    transformOrigin: 'center center',
                    position: 'absolute',
                    left: 0,
                    bottom: '20%', // ปรับตำแหน่งตัวละครให้อยู่บนพื้น
                }}
            />
        </div>
    );
};

export default SpritePlayer;