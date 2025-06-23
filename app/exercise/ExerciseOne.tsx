"use client";
import { useEffect, useState } from "react";
import { Radio, Col, Divider, Row, Modal } from "antd";
import type { RadioChangeEvent } from "antd";
import { RedoOutlined } from '@ant-design/icons';
import "../css/styles.css";
import { useRouter } from "next/navigation";

import { speak } from "../utils/voice";
import AnimationVoice from "../components/AnimationVoice";
import { PartyPopper } from "../components/PartyPopper";
import Score from "../components/Score";

type AlphabetItem = {
    letter: string;
    voice: string;
};

const ExerciseOne = () => {
    const [alphabet, setAlphabet] = useState<AlphabetItem[]>([]);
    const [letters, setLetters] = useState<AlphabetItem | null>(null);
    const [options, setOptions] = useState<AlphabetItem[]>([]);
    const [value, setValue] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false); // เปลี่ยนเป็น false
    const [start, setStart] = useState<boolean>(false);
    const [isReady, setIsReady] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false); // เปลี่ยนเป็น false
    const [correctVoice, setCorrectVoice] = useState<string | null>(null);
    const [showParty, setShowParty] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    // ใช้ useCallback หรือ useMemo สำหรับ functions ที่ใช้ random
    const getRandomItem = (exclude?: string): AlphabetItem | null => {
        if (alphabet.length === 0) return null;
        
        let result: AlphabetItem;
        let attempts = 0;
        const maxAttempts = 50; // ป้องกัน infinite loop
        
        do {
            result = alphabet[Math.floor(Math.random() * alphabet.length)];
            attempts++;
        } while (result.letter === exclude && attempts < maxAttempts);
        
        return result;
    };

    const shuffle = (array: AlphabetItem[]): AlphabetItem[] => {
        // ใช้ Fisher-Yates shuffle algorithm แทน
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const generateQuestion = () => {
        if (!isMounted || alphabet.length === 0) return;
        
        setStart(true);
        
        if (questionCount >= 10) {
            setIsFinished(true);
            setStart(false);
            return;
        }
        
        const correct = getRandomItem();
        if (!correct) return;
        
        const distractor1 = getRandomItem(correct.letter);
        const distractor2 = getRandomItem(correct.letter + (distractor1?.letter || ''));
        
        if (!distractor1 || !distractor2) return;
        
        const allOptions = shuffle([correct, distractor1, distractor2]);
        
        setLetters(correct);
        setOptions(allOptions);
        setValue(null);
        setCorrectVoice(correct.voice);
        
        // Delay การเล่นเสียงและ animation
        setTimeout(() => {
            if (isMounted) {
                speak(correct.voice);
                setIsPlaying(true);
                setTimeout(() => setIsPlaying(false), 1500);
            }
        }, 100);
        
        setQuestionCount((prev) => prev + 1);
    };

    const handleSubmit = () => {
        if (!letters || !value || !isMounted) return;
        
        const isCorrect = value === letters.letter;
        
        if (isCorrect) {
            const newScore = score + 1;
            setScore(newScore);
            setShowParty(true);
            
            // อัพเดท localStorage
            try {
                localStorage.setItem("score", newScore.toString());
            } catch (error) {
                console.warn("Could not save to localStorage:", error);
            }
            
            setTimeout(() => {
                if (isMounted) {
                    setShowParty(false);
                    if (questionCount >= 10) {
                        setIsFinished(true);
                        setStart(false);
                    } else {
                        generateQuestion();
                    }
                }
            }, 2000);
        } else {
            alert("❌ ผิด ลองใหม่");
            if (questionCount >= 10) {
                setIsFinished(true);
                setStart(false);
            } else {
                generateQuestion();
            }
        }
    };

    const onChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
    };

    const replayVoice = () => {
        if (!isMounted || !correctVoice) return;
        
        setIsSpinning(true);
        speak(correctVoice);
        setIsPlaying(true);
        
        setTimeout(() => {
            if (isMounted) {
                setIsPlaying(false);
                setIsSpinning(false);
            }
        }, 1500);
    };

    const handlePlayAgain = () => {
        setQuestionCount(0);
        setIsFinished(false);
        // setScore(0);
        setStart(false);
        setValue(null);
        setLetters(null);
        setOptions([]);
        
        if (isMounted) {
            try {
                localStorage.setItem("score", "0");
            } catch (error) {
                console.warn("Could not save to localStorage:", error);
            }
        }
    };

    // Main useEffect
    useEffect(() => {
        setIsMounted(true);
        
        // Load alphabet data
        fetch("/thai-alphabet.json")
            .then((res) => res.json())
            .then((data) => {
                setAlphabet(data);
                setIsReady(true);
            })
            .catch((error) => {
                console.error("Failed to load alphabet data:", error);
            });

        // Load score from localStorage
        try {
            const savedScore = localStorage.getItem("score");
            if (savedScore) {
                setScore(parseInt(savedScore, 10) || 0);
            }
        } catch (error) {
            console.warn("Could not read from localStorage:", error);
        }
    }, []);

    // Media query useEffect - แยกออกมา
    useEffect(() => {
        if (!isMounted) return;
        
        const mediaQuery = window.matchMedia("(max-width: 639px)");
        setIsMobile(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mediaQuery.addEventListener("change", handler);

        return () => mediaQuery.removeEventListener("change", handler);
    }, [isMounted]);

    // Score update useEffect
    useEffect(() => {
        if (isFinished && isMounted) {
            try {
                const currentScore = localStorage.getItem("score");
                if (currentScore) {
                    setScore(parseInt(currentScore, 10) || 0);
                }
            } catch (error) {
                console.warn("Could not read from localStorage:", error);
            }
        }
    }, [isFinished, isMounted]);

    // Loading state
    if (!isMounted || !isReady) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }
    
    return (
        <>
            <div className="flex flex-row justify-center items-center">
                <Score />
            </div>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center h-screen">
                <PartyPopper play={showParty} />
                <div className="flex flex-col items-center gap-4">
                    <AnimationVoice isPlaying={isPlaying} />
                    <RedoOutlined
                        onClick={replayVoice}
                        className={`text-4xl cursor-pointer transition-transform duration-300 ${
                            isSpinning ? "animate-spin" : "hover:scale-110"
                        }`}
                    />
                </div>
                
                {/* Desktop Divider */}
                <div className="hidden md:block">
                    <Divider type="vertical" style={{ height: "80vh" }} />
                </div>

                {/* Mobile Divider */}
                <div className="block md:hidden">
                    <Divider type="horizontal" style={{ width: "80vw" }} />
                </div>
                
                <Row>
                    <Col>
                        {!start && !isFinished && (
                            <button 
                                className="btn btn-primary" 
                                onClick={generateQuestion}
                                disabled={!isReady || alphabet.length === 0}
                            >
                                เริ่ม
                            </button>
                        )}
                        
                        {isFinished && (
                            <Modal
                                open={isFinished}
                                onOk={handlePlayAgain}
                                onCancel={() => router.push("/")}
                                title="ยินดีด้วย!"
                            >
                                <h2>คุณตอบครบ 10 ข้อแล้ว!</h2>
                                <h3>คะแนนของคุณคือ {score} / 10</h3>
                            </Modal>
                        )}
                        
                        <div className="flex flex-col gap-4 p-4 rounded-md w-full">
                            {letters && options.length > 0 && (
                                <Radio.Group
                                    onChange={onChange}
                                    value={value}
                                    style={{ 
                                        display: "flex", 
                                        flexDirection: isMobile ? "row" : "column", 
                                        gap: 8, 
                                        fontSize: 30 
                                    }}
                                    disabled={isFinished}
                                >
                                    {options.map((item, index) => (
                                        <Radio 
                                            key={`${item.letter}-${index}`} 
                                            value={item.letter} 
                                            style={{ fontSize: 30 }}
                                        >
                                            {item.letter}
                                        </Radio>
                                    ))}
                                </Radio.Group>
                            )}
                        </div>
                    </Col>
                </Row>
                
                <Row>
                    {start && !isFinished && letters && (
                        <button
                            className="btn btn-secondary mt-4"
                            onClick={handleSubmit}
                            disabled={!value}
                        >
                            ตอบ ({questionCount}/10)
                        </button>
                    )}
                </Row>
            </div>
        </>
    );
};

export default ExerciseOne;