'use client';
import React, { useEffect, useRef, useState } from 'react';
import './SpritePlayer.css';
import PowerTune from '../components/PowerTune';

interface SpritePlayerProps {
    src: string;
    frameWidth: number;
    frameHeight: number;
    frameCount: number;
    fps?: number;
    loop?: boolean;
    speed?: number;
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
    const [isMuted, setIsMuted] = useState<boolean>(true);
    
    // 🍔 State สำหรับการกิน
    const [isEating, setIsEating] = useState<boolean>(false);
    
    // 📊 Tamagotchi Stats
    const [stats, setStats] = useState({
        hunger: 80,
        energy: 90,
        hygiene: 70,
        strength: 100
    });

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const backgroundImg = '/img/background-forest.png'; 
    const bgMusicUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';
    const eatingSprite = '/Gemini_Generated_Image_eeemraeeemraeeem.png'; // รูปกินอาหารที่คุณให้มา

    // คำนวณ Scale ตามขนาดหน้าจอ
    const getScale = () => {
        if (screenWidth < 640) return 1.5;
        if (screenWidth < 1024) return 2;
        return 3;
    };
    const characterScale = getScale();

    useEffect(() => {
        const updateWidth = () => setScreenWidth(window.innerWidth);
        updateWidth();
        window.addEventListener('resize', updateWidth);
        
        // Setup BGM
        audioRef.current = new Audio(bgMusicUrl);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.2;

        return () => {
            window.removeEventListener('resize', updateWidth);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // 🕒 ระบบลดค่าพลังงาน (Stats Decay)
    useEffect(() => {
        statsIntervalRef.current = setInterval(() => {
            setStats(prev => ({
                hunger: Math.max(0, prev.hunger - 0.2),
                energy: Math.max(0, prev.energy - 0.1),
                hygiene: Math.max(0, prev.hygiene - 0.05),
                strength: Math.max(0, prev.strength - 0.1)
            }));
        }, 1000);

        return () => {
            if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
        };
    }, []);

    // 🚶 แอนิเมชันเดินและกิน
    useEffect(() => {
        if (screenWidth === 0) return;
        const frameDuration = 1000 / fps;
        
        intervalRef.current = setInterval(() => {
            // จัดการเฟรม (ถ้ากินใช้ 4 เฟรม ถ้าเดินใช้ frameCount จาก props)
            const currentMaxFrames = isEating ? 4 : frameCount;
            setFrame(prev => (prev + 1) % currentMaxFrames);

            // จัดการการเดิน (เดินเฉพาะตอนไม่ได้กิน)
            if (!isEating) {
                setPosX(prev => {
                    const nextX = prev + speed * direction;
                    const charWidth = frameWidth * characterScale;
                    if (nextX > screenWidth - charWidth) {
                        setDirection(-1);
                        return screenWidth - charWidth;
                    } else if (nextX < 0) {
                        setDirection(1);
                        return 0;
                    }
                    return nextX;
                });
            }
        }, frameDuration);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [fps, frameCount, speed, direction, screenWidth, frameWidth, isEating, characterScale]);

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isMuted) audioRef.current.play().catch(e => console.log(e));
        else audioRef.current.pause();
        setIsMuted(!isMuted);
    };

    // 🍱 ฟังก์ชันกินอาหาร
    const handleEat = () => {
        if (isEating) return;
        setIsEating(true);
        setFrame(0); // เริ่มเฟรมแรกของการกิน
        
        // เพิ่มค่าความหิว
        setStats(prev => ({ ...prev, hunger: Math.min(100, prev.hunger + 20) }));

        // กินเสร็จใน 2 วินาทีแล้วกลับไปเดิน
        setTimeout(() => {
            setIsEating(false);
            setFrame(0);
        }, 2000);
    };

    return (
        <div className="game-container" style={{ backgroundImage: `url(${backgroundImg})` }}>
            
            {/* 🎵 UI Buttons */}
            <div className="game-controls">
                <button className="control-btn music-btn" onClick={toggleMusic}>
                    {isMuted ? '🔇' : '🔊'}
                </button>
                <button 
                    className={`control-btn eat-btn ${isEating ? 'active' : ''}`} 
                    onClick={handleEat}
                >
                    🍱 กินอาหาร
                </button>
            </div>

            {/* 🔋 Power Tube UI */}
            <PowerTune stats={stats} />

            {/* Character ( Froakie ) */}
            <div
                className="sprite-player"
                style={{
                    width: `${frameWidth}px`,
                    height: `${frameHeight}px`,
                    backgroundImage: `url(${isEating ? eatingSprite : src})`, // สลับรูป Sprite
                    backgroundPosition: `-${frame * (isEating ? (1024 / 4) : frameWidth)}px 0px`, // คำนวณตำแหน่งเฟรมกิน (สมมติรูปกว้าง 1024px)
                    backgroundSize: isEating ? 'auto 100%' : `${frameWidth * frameCount}px ${frameHeight}px`,
                    transform: `translate(${posX}px, 0) scale(${characterScale * direction}, ${characterScale})`,
                    left: 0,
                    bottom: '15%',
                    position: 'absolute',
                }}
            />
        </div>
    );
};

export default SpritePlayer;
