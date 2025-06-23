"use client";
import dynamic from "next/dynamic";
const Exercise = dynamic(() => import("./ExerciseOne"), {
    ssr: false,
});

export default function Page() {
    return <Exercise />;
}