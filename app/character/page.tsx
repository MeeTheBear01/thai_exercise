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
    src = 'character-walk.svg',
    frameWidth = 50,
    frameHeight = 64,
    frameCount = 4,
    fps = 5,
    loop = true,
    speed = 4,  // กำหนดความเร็วเดิน
}) => {
    const [frame, setFrame] = useState<number>(0);
    const [posX, setPosX] = useState<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const frameDuration = 1000 / fps;

        intervalRef.current = setInterval(() => {
            setFrame(prev => {
                const next = prev + 1;
                return loop ? next % frameCount : (next < frameCount ? next : prev);
            });

            setPosX(prev => {
                const nextX = prev + speed;
                // ถ้าเดินเลยขอบหน้าจอ (หน้าจอขนาด 800px สมมติ)
                if (nextX > 800) {
                    return 100; // กลับไปเริ่มที่ 0 ใหม่
                }
                return nextX;
            });
        }, frameDuration);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fps, frameCount, loop, speed]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'flex-start', // เดินจากซ้ายไปขวา
            alignItems: 'center',         // ✅ จัดให้กลางแนวดิ่ง
            height: '100vh',              // ✅ เต็มความสูงจอ
            overflow: 'hidden',           // ป้องกันภาพล้น
            background: '#eef',           // ใส่พื้นหลังทดสอบ
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
                    transform: `translateX(${posX}px) scale(3)`,  // เลื่อนตำแหน่ง X
                    transition: `transform ${1000 / fps}ms linear`,  // ทำให้เดินนุ่มนวล
                }}
            />
        </div>
    );
};

export default SpritePlayer;