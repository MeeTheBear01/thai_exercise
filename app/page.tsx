"use client";
import Image from "next/image";
import Exercise1 from "@/public/img/Exercise_1.png";
import { speak } from "./utils/voice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter();


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="card bg-base-100 w-96 shadow-sm">
          <figure>
            <Image
              src={Exercise1}
              alt="Exercise 1"
              width={300}
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">แบบฝึกหัดทายเสียงพยัญชนะ</h2>
            <p>แบบทดสอบเพื่อสร้างเสริมความรู้ความเข้าใจเกี่ยวกับพยัญชนะ</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary" onClick={() => router.push('/exercise')}>
                เริ่มเลย!!
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
