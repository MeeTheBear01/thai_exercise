"use client";
import { useEffect, useState } from "react";
import { Radio, Col, Divider, Row } from "antd";
import type { RadioChangeEvent } from "antd";
import { RedoOutlined } from '@ant-design/icons';
import "../css/styles.css";

import { speak } from "../utils/voice";
import AnimationVoice from "../components/AnimationVoice";
import { PartyPopper } from "../components/PartyPopper";
import Score from "../components/Score";

type AlphabetItem = {
    letter: string;
    voice: string;
};

const Exercise = () => {
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
    };

    const delay = (ms: number) => setTimeout(() => {
        setIsPlaying(false);
    }, ms);

    const handleSubmit = () => {
        if (!letters || !value) return;

        const isCorrect = value === letters.letter;
        if (isCorrect) {
            const prevScore = parseInt(localStorage.getItem("score") || "0", 10);
            const newScore = prevScore + 1;
            setShowParty(true);
            localStorage.setItem("score", newScore.toString());
            setTimeout(() => {
                setShowParty(false);
                generateQuestion();
            }, 2000);
        } else {
            alert("❌ ผิด ลองใหม่");
            generateQuestion();
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

    if (!isReady) {
        return null; // หรือแสดง Loading placeholder ได้
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
                        {!start && (
                            <button className="btn btn-primary" onClick={generateQuestion}>
                                เริ่ม
                            </button>
                        )}
                        <div className="flex flex-col gap-4 p-4 rounded-md w-full">
                            <Radio.Group
                                onChange={onChange}
                                value={value}
                                style={{ display: "flex", flexDirection: isMobile ? "row" : "column", gap: 8, fontSize: 30 }}
                            >
                                {options.map((item) => (
                                    <Radio key={item.letter} value={item.letter} style={{ fontSize: 30 }}>
                                        {item.letter}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </div>
                    </Col>
                </Row>
                <Row>
                    {start && (
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

export default Exercise;
