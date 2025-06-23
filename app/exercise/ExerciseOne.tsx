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

const ExcerciseOne = () => {
    const [alphabet, setAlphabet] = useState<AlphabetItem[]>([]);
    const [letters, setLetters] = useState<AlphabetItem | null>(null);
    const [options, setOptions] = useState<AlphabetItem[]>([]);
    const [value, setValue] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [start, setStart] = useState<boolean>(false);
    const [isReady, setIsReady] = useState(false);
    const [isSpinning, setIsSpinning] = useState(true);
    const [correctVoice, setCorrectVoice] = useState<string | null>(null);
    const [showParty, setShowParty] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [score, setScore] = useState(0);
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
        speak(correct.voice);
        setCorrectVoice(correct.voice);
        delay(1500);
        setQuestionCount((prev) => prev + 1);
    };

    const delay = (ms: number) => setTimeout(() => {
        setIsPlaying(false);
    }, ms);

    const handleSubmit = () => {
        if (!letters || !value) return;
        const isCorrect = value === letters.letter;
        if (isCorrect) {
            const newScore = score + 1; // ✅ เพิ่มคะแนนใน state
            setScore(newScore);         // ✅ อัปเดต state
            localStorage.setItem("score", newScore.toString()); // ✅ อัปเดต localStorage
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

    useEffect(() => {
        fetch("/thai-alphabet.json")
            .then((res) => res.json())
            .then((data) => {
                setAlphabet(data);
                setIsReady(true); // โหลดเสร็จค่อย render UI
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

    const handleAnimationEnd = () => {
        setIsSpinning(false); // หมุนจบแล้วหยุด
    };

    const replayVoice = () => {
        setIsSpinning(true);
        if (correctVoice) {
            speak(correctVoice);
            setIsPlaying(true)
        }
        delay(1500);
    };

    const handlePlayAgain = () => {
        setQuestionCount(0);
        setIsFinished(false);
        localStorage.setItem("score", "0");
        setStart(false);
    };

    if (typeof window === "undefined") return null;

    return (
        <>
            <div className="flex flex-row justify-center items-center">
                <Score score={score} />
            </div>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center h-screen">
                <PartyPopper play={showParty} />
                <div className="flex flex-col items-center gap-4">
                    <AnimationVoice isPlaying={isPlaying} />
                    {/* <ReloadSingle /> */}
                    <RedoOutlined
                        onClick={replayVoice}
                        onAnimationEnd={handleAnimationEnd}
                        className={`text-4xl cursor-pointer ${isSpinning ? "animate-spin-slow" : ""
                            }`}
                    />
                </div>
                <div className="hidden md:block">
                    <Divider type="vertical" style={{ height: "80vh" }} />
                </div>

                {/* สำหรับมือถือ */}
                <div className="block md:hidden">
                    <Divider type="horizontal" style={{ width: "80vw" }} />
                </div>
                <Row>
                    <Col>
                        {!start && !isFinished && (
                            <button className="btn btn-primary" onClick={generateQuestion}>
                                เริ่ม
                            </button>
                        )}
                        {isFinished && (
                            <Modal
                                open={isFinished}
                                onOk={handlePlayAgain}
                                onCancel={() => { router.push("/") }}
                                title="ยินดีด้วย!"
                            >
                                <h2>คุณตอบครบ 10 ข้อแล้ว!</h2>
                                <h3>คะแนนของคุณคือ {score}</h3>
                            </Modal>
                        )}
                        <div className="flex flex-col gap-4 p-4 rounded-md w-full">
                            {letters && options.length > 0 && (
                                <Radio.Group
                                    onChange={onChange}
                                    value={value}
                                    style={{ display: "flex", flexDirection: isMobile ? "row" : "column", gap: 8, fontSize: 30 }}
                                    disabled={isFinished}
                                >
                                    {options.map((item, index) => (
                                        <Radio key={`${item.letter}-${index}`} value={item.letter} style={{ fontSize: 30 }}>
                                            {item.letter}
                                        </Radio>
                                    ))}
                                </Radio.Group>
                            )}
                        </div>
                    </Col>
                </Row>
                <Row>
                    {start && !isFinished && (
                        <button
                            className="btn btn-secondary mt-4"
                            onClick={handleSubmit}
                            disabled={!value}
                        >
                            ตอบ
                        </button>
                    )}
                </Row>
            </div>
        </>
    );
};

export default ExcerciseOne;
