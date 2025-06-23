// components/ClientButton.tsx
"use client";
import { useRouter } from "next/navigation";

export default function ClientButton() {
  const router = useRouter();

  const handleStartExercise = () => {
    router.push('/exercise');
  };

  return (
    <button className="btn btn-primary" onClick={handleStartExercise}>
      เริ่มเลย!!
    </button>
  );
}