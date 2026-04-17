"use client";
import { useEffect, useState } from "react";
import { Radio, Col, Divider, Row, Modal, Progress, Button } from "antd";
import type { RadioChangeEvent } from "antd";
import { RedoOutlined, ArrowLeftOutlined, CloseCircleFilled } from '@ant-design/icons';
import "../css/styles.css";
import { useRouter } from "next/navigation";

import { speak, playEffect } from "../utils/voice";
import AnimationVoice from "../components/AnimationVoice";
import { PartyPopper } from "../components/PartyPopper";
import Score from "../components/Score";

type AlphabetItem = {
    letter: string;
    voice: string;
};

const ExcerciseOne = () => {
    const [alphabet, setAlphabet] = useState<AlphabetItem[]>([]);
    const [letters, setLetters] = useState<AlphabetItem | null>(null);
    const [options, setOptions] = useState<AlphabetItem[]>([]);
    const [value, setValue] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [start, setStart] = useState<boolean>(false);
    const [isReady, setIsReady] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [correctVoice, setCorrectVoice] = useState<string | null>(null);
    const [showParty, setShowParty] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const router = useRouter();

    const getRandomItem = (exclude?: string): AlphabetItem => {
        let result: AlphabetItem;
        do {
            result = alphabet[Math.floor(Math.random() * alphabet.length)];
        } while (result.letter === exclude);
        return result;
    };

    const shuffle = (array: any[]) => {
        return array
            .map((item) => ({ item, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ item }) => item);
    };

    const generateQuestion = () => {
        setStart(true);
        if (alphabet.length === 0) return;
        if (questionCount >= 10) {
            setIsFinished(true);
            setStart(false);
            return;
        }
        const correct = getRandomItem();
        const distractor1 = getRandomItem(correct.letter);
        const distractor2 = getRandomItem(correct.letter + distractor1.letter);
        const allOptions = shuffle([correct, distractor1, distractor2]);
        setLetters(correct);
        setOptions(allOptions);
        setValue(null);
        
        speak(correct.voice, {
            onStart: () => setIsPlaying(true),
            onEnd: () => setIsPlaying(false)
        });
        
        setCorrectVoice(correct.voice);
        setQuestionCount((prev) => prev + 1);
    };

    const handleSubmit = () => {
        if (!letters || !value) return;
        const isCorrect = value === letters.letter;
        if (isCorrect) {
            playEffect('correct'); // เล่นเสียงไชโยเมื่อตอบถูก
            const newScore = score + 1;
            setScore(newScore);
            localStorage.setItem("score", newScore.toString());
            setShowParty(true);

            setTimeout(() => {
                setShowParty(false);
                if (questionCount >= 10) {
                    setIsFinished(true);
                    setStart(false);
                } else {
                    generateQuestion();
                }
            }, 2000);
        } else {
            playEffect('incorrect'); // เล่นเสียงตึ๊งเมื่อตอบผิด
            setShowErrorModal(true);
        }
    };

    const handleErrorModalOk = () => {
        setShowErrorModal(false);
        setValue(null); // เคลียร์ตัวเลือกที่ผิด
        replayVoice();  // เล่นเสียงให้ฟังอีกรอบ
    };

    const onChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
    };

    useEffect(() => {
        fetch("/thai-alphabet.json")
            .then((res) => res.json())
            .then((data) => {
                setAlphabet(data);
                setIsReady(true);
            });

        const mediaQuery = window.matchMedia("(max-width: 639px)");
        setIsMobile(mediaQuery.matches);
        const handler = (e: any) => setIsMobile(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        const storedScore = localStorage.getItem("score");
        setScore(parseInt(storedScore || "0"));
    }, []);

    const replayVoice = () => {
        setIsSpinning(true);
        if (correctVoice) {
            speak(correctVoice, {
                onStart: () => setIsPlaying(true),
                onEnd: () => setIsPlaying(false)
            });
        }
        setTimeout(() => setIsSpinning(false), 1000);
    };

    const handlePlayAgain = () => {
        setQuestionCount(0);
        setIsFinished(false);
        localStorage.setItem("score", "0");
        setScore(0);
        setStart(false);
        setLetters(null);
        setOptions([]);
    };

    if (typeof window === "undefined") return null;

    return (
        <div className="min-h-screen bg-kids-pattern p-4 md:p-8 flex flex-col items-center">
            {/* Header Area */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-8">
                <button 
                  className="btn btn-circle btn-ghost text-primary text-2xl"
                  onClick={() => router.push("/")}
                >
                  <ArrowLeftOutlined />
                </button>
                <div className="flex-1 px-8">
                    <Progress 
                      percent={questionCount * 10} 
                      status="active" 
                      strokeColor={{ '0%': '#10b981', '100%': '#3b82f6' }}
                      // แก้ไข Warning: ใช้ size แทน strokeWidth ในบางเวอร์ชันของ antd5 หรือกำหนดค่าแบบ object
                      size={["100%", 15]} 
                    />
                    <p className="text-center font-bold text-slate-500 mt-1">ข้อที่ {questionCount} / 10</p>
                </div>
            </div>

            <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 items-stretch justify-center">
                <PartyPopper play={showParty} />
                
                {/* Voice & Character Side */}
                <div className="glass-card p-8 flex flex-col items-center justify-center flex-1 min-h-[400px]">
                    <div className="animate-bounce-slow mb-6">
                        <AnimationVoice isPlaying={isPlaying} />
                    </div>
                    
                    <button 
                      onClick={replayVoice}
                      className={`btn btn-circle btn-lg btn-primary shadow-lg transition-all active:scale-90 ${isSpinning ? "animate-spin" : ""}`}
                    >
                        <RedoOutlined className="text-2xl" />
                    </button>
                    <p className="mt-4 font-bold text-primary">ฟังเสียงอีกครั้ง</p>
                </div>

                {/* Question Side */}
                <div className="glass-card p-8 flex flex-col items-center justify-center flex-1">
                    {!start && !isFinished ? (
                        <div className="text-center">
                            <h2 className="text-3xl font-bold mb-6 text-slate-700">พร้อมหรือยังจ๊ะ?</h2>
                            <button className="btn btn-primary btn-xl rounded-full px-12 text-2xl shadow-xl hover:scale-110 transition-transform" onClick={generateQuestion}>
                                เริ่มเล่นเลย!
                            </button>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center">
                            <h2 className="text-2xl font-bold mb-8 text-slate-600">ตัวอักษรไหนคือเสียงนี้?</h2>
                            
                            <div className="radio-custom w-full">
                                {letters && options.length > 0 && (
                                    <Radio.Group
                                        onChange={onChange}
                                        value={value}
                                        className="flex flex-wrap justify-center gap-6"
                                        disabled={isFinished}
                                    >
                                        {options.map((item, index) => (
                                            <Radio key={`${item.letter}-${index}`} value={item.letter}>
                                                {item.letter}
                                            </Radio>
                                        ))}
                                    </Radio.Group>
                                )}
                            </div>

                            {start && !isFinished && (
                                <button
                                    className="btn btn-secondary btn-lg rounded-full mt-12 px-12 text-xl shadow-lg transition-all hover:scale-105 active:scale-95"
                                    onClick={handleSubmit}
                                    disabled={!value}
                                >
                                    ส่งคำตอบ
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-8">
                <Score score={score} />
            </div>

            {/* Error Modal (เปลี่ยนมาใช้ State-driven Modal แทน static Modal.error) */}
            <Modal
                open={showErrorModal}
                onOk={handleErrorModalOk}
                onCancel={handleErrorModalOk}
                centered
                closable={false}
                footer={[
                  <Button key="ok" type="primary" size="large" onClick={handleErrorModalOk} className="rounded-full px-8">
                    ลองใหม่
                  </Button>
                ]}
            >
                <div className="text-center p-4">
                    <CloseCircleFilled className="text-6xl text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-700 mb-2">อุ๊ย! ยังไม่ถูกจ้า</h2>
                    <p className="text-lg text-slate-500">ลองฟังเสียงอีกรอบ แล้วเลือกใหม่อีกครั้งนะคนเก่ง</p>
                </div>
            </Modal>

            {/* Finished Modal */}
            <Modal
                open={isFinished}
                onOk={handlePlayAgain}
                onCancel={() => { router.push("/") }}
                title={null}
                footer={null}
                centered
                closable={false}
            >
                <div className="text-center p-8">
                    <h1 className="text-5xl mb-4">🏆</h1>
                    <h2 className="text-3xl font-bold text-primary mb-2">ยินดีด้วยจ้า!</h2>
                    <p className="text-xl text-slate-500 mb-6">เก่งมากเลย ตอบครบ 10 ข้อแล้ว</p>
                    <div className="bg-slate-100 p-6 rounded-3xl mb-8">
                        <p className="text-lg">คะแนนที่ได้</p>
                        <h3 className="text-5xl font-black text-secondary">{score} / 10</h3>
                    </div>
                    <div className="flex gap-4">
                        <button className="btn btn-primary flex-1 rounded-full" onClick={handlePlayAgain}>เล่นอีกรอบ</button>
                        <button className="btn btn-outline flex-1 rounded-full" onClick={() => router.push("/")}>กลับหน้าหลัก</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ExcerciseOne;
