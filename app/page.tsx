// ลบ "use client" ออก - ทำให้เป็น Server Component
import Image from "next/image";
import Exercise1 from "@/public/img/Exercise_1.png";
import ClientButton from "./components/ClientButton"; // สร้าง component แยกสำหรับ button

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="card bg-base-100 w-96 shadow-sm">
          <figure>
            <Image
              src={Exercise1}
              alt="Exercise 1"
              width={300}
              priority
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">แบบฝึกหัดทายเสียงพยัญชนะ</h2>
            <p>แบบทดสอบเพื่อสร้างเสริมความรู้ความเข้าใจเกี่ยวกับพยัญชนะ</p>
            <div className="card-actions justify-end">
              <ClientButton />
            </div>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}