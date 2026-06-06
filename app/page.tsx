"use client";

import React, { useState, useEffect } from "react";
import ConfettiCanvas from "./components/ConfettiCanvas";

export default function Home() {
  const [name, setName] = useState("R");
  const [confettiActive, setConfettiActive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // States for interactive SVG law elements
  const [scaleTilt, setScaleTilt] = useState(0); // degrees of scale rotation
  const [gavelActive, setGavelActive] = useState(false); // gavel rotation trigger
  const [activeBook, setActiveBook] = useState<number | null>(null); // sliding book state

  // Interactive Reveal States
  const [isRevealed, setIsRevealed] = useState(false); // true when wishes folder is opened
  const [currentWishIndex, setCurrentWishIndex] = useState(0); // cycles 0 -> 1 -> 2 -> 3

  // Array of multiple wishes to display interactively
  const wishesList = [
    {
      label: "Exhibit A // The Primary Motion",
      text: "Happy birth day gemini girl, wish all the best 'haile'",
      accent: "bg-emerald-650",
      border: "border-emerald-200"
    },
    {
      label: "Exhibit B // The Caffeine Decree",
      text: "May your law school case books be short, your study sessions be fast, and your iced espresso cups be infinite! ☕",
      accent: "bg-indigo-600",
      border: "border-indigo-200"
    },
    {
      label: "Exhibit C // The Legal Decree",
      text: "May the law be on your side, the cake be on your table! ⚖️🎂",
      accent: "bg-amber-500",
      border: "border-amber-200"
    },
    {
      label: "Exhibit D // The Nostalgia Brief",
      text: "Cheers to surviving another year, just like we survived high school calculus and caffeinated exams together! 🎂",
      accent: "bg-rose-500",
      border: "border-rose-200"
    }
  ];

  // Retrieve name parameter from URL queries on client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const nameParam = params.get("name");
      if (nameParam) {
        const cleanName = nameParam.trim();
        setName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1).substring(0, 15));
      }
    }
  }, []);

  // Grand Opening: Trigger confetti 3 times quickly at page start
  useEffect(() => {
    // Burst 1
    setConfettiActive(true);
    const reset1 = setTimeout(() => setConfettiActive(false), 50);

    // Burst 2 (450ms delay)
    const burst2 = setTimeout(() => {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 50);
    }, 450);

    // Burst 3 (900ms delay)
    const burst3 = setTimeout(() => {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 50);
    }, 900);

    return () => {
      clearTimeout(reset1);
      clearTimeout(burst2);
      clearTimeout(burst3);
    };
  }, []);

  // Reveal or cycle wishes when "Wishes" or wax seal is clicked
  const handleReveal = () => {
    if (!isRevealed) {
      setIsRevealed(true);
      setCurrentWishIndex(0);
      triggerCelebrate();
      showToastNotification("🔓 Sealed document opened!");
    } else {
      // Cycle to the next wish in a loop
      setCurrentWishIndex(prev => (prev + 1) % wishesList.length);
      triggerCelebrate();
      showToastNotification(`📋 Showing Exhibit ${(currentWishIndex + 2) > wishesList.length ? "A" : String.fromCharCode(65 + currentWishIndex + 1)}`);
    }
  };

  // Reset to initial page state when "Celebrate R" is clicked
  const handleResetCelebrate = () => {
    setIsRevealed(false);
    setCurrentWishIndex(0);
    triggerCelebrate();
    showToastNotification("🎉 Envelope re-sealed with grand celebration!");
  };

  const triggerCelebrate = () => {
    setConfettiActive(true);
    // Reset trigger
    setTimeout(() => setConfettiActive(false), 100);
  };

  const showToastNotification = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Interactivity handlers
  const handleScaleClick = () => {
    setScaleTilt(prev => (prev === 0 ? -6 : prev === -6 ? 6 : 0));
    showToastNotification("⚖️ Scale balance adjusted!");
  };

  const handleGavelClick = () => {
    setGavelActive(true);
    showToastNotification("🔨 Court is in session! Objection overruled.");
    setTimeout(() => setGavelActive(false), 200);
  };

  const activeWish = wishesList[currentWishIndex];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between overflow-x-hidden relative py-12 px-4 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-emerald-600/10 blur-[100px] pointer-events-none" />

      {/* Confetti Particle System */}
      <ConfettiCanvas active={confettiActive} />

      {/* Main Content Card */}
      <main className="max-w-lg w-full mx-auto bg-zinc-900/60 border border-zinc-800 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl space-y-8 z-10 relative">
        
        {/* Zodiac Star Emojis */}
        <div className="absolute -top-4 -right-4 bg-zinc-850 border border-zinc-800 text-zinc-300 px-3.5 py-2 rounded-full text-2xl animate-float shadow-lg">
          ♊
        </div>

        {/* Hero Header */}
        <section className="text-center space-y-2">
          <div className="text-[10px] tracking-widest font-mono text-emerald-400 font-bold uppercase">
            June 06 // Happy Birthday
          </div>
          <h1 className="text-3xl font-extrabold font-sans tracking-tight text-white">
            Happy Birthday, <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-indigo-300">Gemini Girl!</span>
          </h1>
          {name !== "R" && (
            <p className="text-xs text-zinc-400 font-mono">
              Dedicated to: <span className="text-white font-semibold">{name}</span>
            </p>
          )}
        </section>

        {/* Interactive Envelope / Case File reveal */}
        <section className="relative min-h-[190px] flex items-center justify-center transition-all duration-500">
          {!isRevealed ? (
            /* Closed Wax Sealed Envelope */
            <button
              onClick={handleReveal}
              className="w-full bg-[#3c2a1c] border-2 border-[#5c4033] hover:border-amber-700/60 rounded-xl p-8 text-center shadow-lg relative overflow-hidden group cursor-pointer focus:outline-none flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:scale-101 active:scale-99"
            >
              {/* Folder Line Textures */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#5c4033]/20 border-b border-l border-[#5c4033] transform rotate-45 translate-x-8 -translate-y-8" />
              
              {/* Pulsating Instruction Banner for clear visual cues */}
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold px-3 py-1.5 rounded-full text-xs animate-pulse-slow">
                ⚠️ Click the "Wishes" button below to open case file
              </div>

              <span className="text-[10px] font-mono tracking-widest text-amber-500/60 font-bold uppercase select-none">
                Exhibit A // Classification: Secret
              </span>
              
              <h3 className="font-serif text-lg font-bold text-amber-100 select-none">
                Confidential Birthday Brief
              </h3>

              {/* Red Wax Seal Button */}
              <div className="relative w-14 h-14 bg-rose-700 rounded-full flex items-center justify-center shadow-lg border-2 border-rose-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-rose-600">
                <span className="text-amber-100 text-lg font-bold font-serif select-none">♊</span>
                {/* Ribbon details */}
                <div className="absolute bottom-[-10px] left-3 w-3 h-6 bg-rose-800 -rotate-12 border border-rose-900 rounded-b" />
                <div className="absolute bottom-[-12px] right-3 w-3.5 h-6.5 bg-rose-800 rotate-15 border border-rose-900 rounded-b" />
              </div>

              <span className="text-[10px] font-mono text-amber-500/70 select-none group-hover:text-amber-400">
                Or tap the Wax Seal to open
              </span>
            </button>
          ) : (
            /* Single Opened Card with Transition Key */
            <div 
              key={currentWishIndex} 
              className={`w-full bg-[#fefdf0] border-2 ${activeWish.border} p-6 rounded-xl text-left shadow-lg relative overflow-hidden transition-all duration-350 ease-out transform text-zinc-900 animate-wiggle-custom`}
            >
              <div className={`absolute top-0 left-0 w-1.5 h-full ${activeWish.accent}`} />
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-mono tracking-widest text-zinc-400 font-bold uppercase select-none">
                  {activeWish.label}
                </span>
                <span className="text-[9px] font-mono font-bold text-zinc-400 select-none">
                  {currentWishIndex + 1} / {wishesList.length}
                </span>
              </div>
              <blockquote className="font-serif text-base md:text-lg font-bold italic leading-relaxed text-indigo-950">
                "{activeWish.text}"
              </blockquote>
              <div className="mt-3 text-[10px] text-right font-mono text-zinc-400 italic animate-pulse-slow">
                Click "Wishes" again to see next wish →
              </div>
            </div>
          )}
        </section>

        {/* Visual Law-Related Interactive Elements */}
        <section className="space-y-4">
          <h3 className="font-mono text-xs font-bold text-zinc-500 uppercase tracking-wider text-center">
            ⚖️ Interactive Legal Exhibits
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {/* 1. Scale of Justice */}
            <button
              onClick={handleScaleClick}
              className="bg-zinc-950/45 border border-zinc-850/80 p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-colors hover:bg-zinc-900 group cursor-pointer focus:outline-none"
              title="Click to balance the scale"
            >
              <svg 
                className="w-10 h-10 text-emerald-400 transition-transform duration-300"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ transform: `rotate(${scaleTilt}deg)` }}
              >
                {/* Pillar */}
                <line x1="12" y1="3" x2="12" y2="21" />
                <line x1="9" y1="21" x2="15" y2="21" />
                
                {/* Balance Beam */}
                <line x1="5" y1="7" x2="19" y2="7" />
                
                {/* Left Pan */}
                <line x1="5" y1="7" x2="2" y2="15" />
                <line x1="5" y1="7" x2="8" y2="15" />
                <path d="M2 15h6a3 3 0 0 1-6 0z" />
                
                {/* Right Pan */}
                <line x1="19" y1="7" x2="16" y2="15" />
                <line x1="19" y1="7" x2="22" y2="15" />
                <path d="M16 15h6a3 3 0 0 1-6 0z" />
              </svg>
              <span className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200">Scale</span>
            </button>

            {/* 2. Gavel */}
            <button
              onClick={handleGavelClick}
              className="bg-zinc-950/45 border border-zinc-850/80 p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-colors hover:bg-zinc-900 group cursor-pointer focus:outline-none"
              title="Click to strike the gavel"
            >
              <svg
                className="w-10 h-10 text-indigo-400 transition-transform duration-100"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: gavelActive ? "rotate(-25deg) translateY(4px)" : "rotate(0deg)",
                  transformOrigin: "bottom right"
                }}
              >
                {/* Sound block */}
                <path d="M14 20h8" />
                <path d="M16 20a2 2 0 0 0 4 0" />

                {/* Gavel head */}
                <rect x="5" y="6" width="6" height="10" rx="1" transform="rotate(45 8 11)" />
                {/* Gavel handle */}
                <line x1="8" y1="11" x2="19" y2="11" transform="rotate(45 8 11)" />
              </svg>
              <span className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200">Gavel</span>
            </button>

            {/* 3. Law Books Stack */}
            <div
              className="bg-zinc-950/45 border border-zinc-850/80 p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-colors hover:bg-zinc-900 group cursor-pointer select-none"
              title="Hover to browse books"
            >
              <div className="relative w-10 h-10 flex items-end justify-center">
                {/* Book 1 (bottom) */}
                <div 
                  onMouseEnter={() => setActiveBook(1)}
                  onMouseLeave={() => setActiveBook(null)}
                  className="absolute bottom-0 w-8 h-2.5 bg-emerald-500/80 rounded border-t border-emerald-400 transition-transform duration-300"
                  style={{ transform: activeBook === 1 ? "translateX(4px)" : "translateX(0)" }}
                />
                {/* Book 2 (middle) */}
                <div 
                  onMouseEnter={() => setActiveBook(2)}
                  onMouseLeave={() => setActiveBook(null)}
                  className="absolute bottom-[11px] w-7 h-2.5 bg-indigo-500/80 rounded border-t border-indigo-400 transition-transform duration-300"
                  style={{ transform: activeBook === 2 ? "translateX(-4px)" : "translateX(0)" }}
                />
                {/* Book 3 (top) */}
                <div 
                  onMouseEnter={() => setActiveBook(3)}
                  onMouseLeave={() => setActiveBook(null)}
                  className="absolute bottom-[22px] w-6 h-2.5 bg-amber-500/80 rounded border-t border-amber-400 transition-transform duration-300"
                  style={{ transform: activeBook === 3 ? "translateY(-4px)" : "translateY(0)" }}
                />
              </div>
              <span className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200">Books</span>
            </div>
          </div>
        </section>

        {/* Action CTAs */}
        <section className="flex gap-3 pt-2">
          {/* Celebrate Button resets page state back to closed envelope + fires confetti */}
          <button
            onClick={handleResetCelebrate}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-emerald-900/20 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            🎉 Celebrate {name}!
          </button>

          {/* Wishes Button cycles wishes */}
          <button
            onClick={handleReveal}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-indigo-900/20 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            ✍️ Wishes
          </button>
        </section>
      </main>

      {/* Floating toast notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-lg px-4 py-3 shadow-2xl flex items-center gap-2 animate-wiggle-custom text-xs font-mono">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-[10px] text-zinc-650 font-mono mt-8 z-10">
        <div>Compiled with 💚 for Gemini Girl R.</div>
        <div className="mt-0.5">© June 6, 2026 // Haile.</div>
      </footer>
    </div>
  );
}
