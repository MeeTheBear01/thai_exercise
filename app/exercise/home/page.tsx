"use client";
import Image from "next/image";
import Exercise1 from "@/public/img/Exercise_1.png";
import ClientButton from "@/app/components/ClientButton";
import "../../css/styles.css"

export default function Home() {
  return (
    <div className="min-h-screen bg-kids-pattern flex flex-col items-center justify-center p-4 md:p-8">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-300 rounded-full blur-3xl opacity-50 animate-pulse"></div>

      <main className="w-full max-w-4xl flex flex-col items-center gap-12 relative z-10">
        {/* Title Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-primary drop-shadow-sm">
            ฝึกอ่านภาษาไทย
          </h1>
          <p className="text-xl md:text-2xl font-bold text-slate-500">
            มาสนุกกับการเรียนรู้พยัญชนะไทยกันเถอะ!
          </p>
        </div>

        {/* Main Menu Card */}
        <div className="glass-card overflow-hidden group hover:scale-[1.02] transition-transform duration-500 w-full max-w-md">
          <div className="relative h-64 w-full bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-8">
            <div className="animate-bounce-slow relative w-full h-full">
              <Image
                src={Exercise1}
                alt="Exercise 1"
                fill
                className="object-contain drop-shadow-xl"
                priority
              />
            </div>
          </div>
          
          <div className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-700">ทายเสียงพยัญชนะ</h2>
              <p className="text-slate-500 font-medium">
                ฝึกฟังเสียงและเลือกพยัญชนะให้ถูกต้อง <br />
                มาสะสมคะแนนให้ครบ 10 ข้อกันนะ!
              </p>
            </div>
            
            <div className="flex justify-center pt-4">
              <ClientButton />
            </div>
          </div>
        </div>

        {/* Footer info */}
        <footer className="text-slate-400 font-bold text-sm mt-8">
          © 2024 Thai Reading App - เพื่อการเรียนรู้ของเด็กไทย
        </footer>
      </main>
    </div>
  );
}
