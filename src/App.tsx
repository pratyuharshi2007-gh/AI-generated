/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { SnakeGame } from "./components/SnakeGame";
import { MusicPlayer } from "./components/MusicPlayer";
import { GlitchOverlay } from "./components/GlitchOverlay";
import { Cpu, Terminal, Activity } from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <GlitchOverlay>
      <div className="max-w-[1280px] mx-auto px-8 py-8 flex flex-col min-h-screen">
        {/* Header Section */}
        <header className="flex justify-between items-end mb-12 border-b border-primary/20 pb-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold mb-1">SYSTEM VERSION 4.2.0</span>
            <h1 className="text-7xl font-black tracking-tighter leading-none italic uppercase text-[#f0f0f0] drop-shadow-[0_0_15px_rgba(0,255,65,0.3)]">
              Synth Snake
            </h1>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Network Status</div>
            <div className="flex items-center gap-2 text-xl font-mono text-primary animate-pulse">
              <Activity size={18} />
              STABLE_CONNECTION
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="flex flex-1 gap-8 items-start">
          {/* Audio Sidebar (Left) */}
          <aside className="w-80 flex flex-col gap-6 sticky top-8">
            <div className="bg-[#111] border border-white/10 p-6 rounded-xl">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-white/5 pb-3">Audio Feed</h2>
              <MusicPlayer />
            </div>

            <div className="bg-[#111] border border-white/10 p-6 rounded-xl">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-white/5 pb-2">System_Logs</h2>
              <div className="space-y-2 text-[10px] font-mono text-zinc-500 h-24 overflow-y-auto">
                <p>&gt; Initializing game matrix...</p>
                <p className="text-primary/70">&gt; Core logic active.</p>
                <p>&gt; User ID authenticated.</p>
                {score > 0 && <p className="text-primary">&gt; Score spike detected: {score}</p>}
              </div>
            </div>
          </aside>

          {/* Game Viewport (Center) */}
          <section className="flex-1 flex flex-col items-center justify-center p-8 bg-[#111]/30 border border-white/5 rounded-2xl">
            <div className="relative p-2 bg-primary/20 rounded-xl">
              <SnakeGame onScoreChange={setScore} />
              <div className="absolute -bottom-10 left-0 right-0 flex justify-center opacity-30">
                <span className="text-[10px] font-mono tracking-widest">[W][A][S][D] TO NAVIGATE // ARROWS ACTIVE</span>
              </div>
            </div>
          </section>

          {/* Stats Sidebar (Right) */}
          <aside className="w-80 flex flex-col gap-6 sticky top-8">
            <div className="bg-[#111] border border-white/10 p-8 rounded-xl flex flex-col items-center text-center">
              <div className="text-[10px] uppercase text-zinc-500 tracking-[0.3em] mb-2">Current Score</div>
              <motion.div 
                key={score}
                initial={{ scale: 1.1, color: "#fff" }}
                animate={{ scale: 1, color: "#00ff41" }}
                className="text-6xl font-mono font-black mb-8"
              >
                {score.toLocaleString()}
              </motion.div>
              
              <div className="w-full space-y-4 pt-6 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase text-zinc-500">Multiplier</span>
                  <span className="font-mono text-white">x{(1 + score/100).toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase text-zinc-500">High Score</span>
                  <span className="font-mono text-zinc-600">03,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase text-zinc-400">Status</span>
                  <span className="font-mono text-primary animate-pulse italic">ACTIVE</span>
                </div>
              </div>
            </div>

            <div className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-xl">
              <div className="text-[10px] uppercase text-rose-400 tracking-[0.2em] mb-4 flex justify-between">
                <span>Visualizer</span>
                <span className="opacity-50">SYNC: AUTO</span>
              </div>
              <div className="flex items-end gap-1.5 h-24">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-rose-500/80 rounded-t-sm"
                    animate={{ 
                      height: [`${20 + Math.random() * 60}%`, `${30 + Math.random() * 70}%`, `${20 + Math.random() * 60}%`]
                    }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
            </div>
          </aside>
        </main>

        {/* Footer Bar */}
        <footer className="mt-12 flex justify-between items-center text-zinc-600 text-[10px] uppercase tracking-[0.3em] border-t border-white/5 pt-8">
          <div>Session ID: RX-9912-KB-{Math.floor(Math.random() * 1000)}</div>
          <div className="flex gap-8">
            <span>Latency: 2ms</span>
            <span>FPS: 60</span>
            <span>Scale: Responsive</span>
          </div>
          <div className="text-primary/40 font-bold">Aesthetix Engine // Active_v4</div>
        </footer>
      </div>
    </GlitchOverlay>
  );
}
