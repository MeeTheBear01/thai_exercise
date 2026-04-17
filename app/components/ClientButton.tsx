// components/ClientButton.tsx
"use client";
import { useRouter } from "next/navigation";

export default function ClientButton() {
  const router = useRouter();

  const handleStartExercise = () => {
    router.push('/exercise/exercise_one');
  };

  return (
    <button 
      className="btn btn-primary btn-lg rounded-full px-12 text-2xl font-black shadow-xl hover:scale-110 active:scale-95 transition-all duration-300" 
      onClick={handleStartExercise}
    >
      เริ่มเลย!!
    </button>
  );
}
