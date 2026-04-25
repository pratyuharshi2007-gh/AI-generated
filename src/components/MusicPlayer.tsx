/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { motion } from "motion/react";
import { SONGS } from "../constants";

export const MusicPlayer: React.FC = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const song = SONGS[currentSongIndex];
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + (100 / song.duration);
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, song.duration]);

  const handleTogglePlay = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentSongIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
    setProgress(0);
  };

  return (
    <div className="w-full bg-[#111] border border-white/10 p-4 rounded-xl flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <div className="relative group">
          <img 
            src={song.coverUrl} 
            alt={song.title} 
            className="w-16 h-16 object-cover rounded-lg border border-white/10 grayscale hover:grayscale-0 transition-all duration-500"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white truncate">{song.title}</h3>
          <p className="text-[10px] text-zinc-500 truncate uppercase tracking-widest">{song.artist}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary shadow-[0_0_10px_#00ff41]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center text-zinc-400">
            <button onClick={handlePrev} className="hover:text-primary transition-colors cursor-pointer">
              <SkipBack size={16} />
            </button>
            <button onClick={handleTogglePlay} className="text-white hover:text-primary transition-colors cursor-pointer">
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
            <button onClick={handleNext} className="hover:text-primary transition-colors cursor-pointer">
               <SkipForward size={16} />
            </button>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            {Math.floor((progress / 100) * song.duration / 60)}:{(Math.floor((progress / 100) * song.duration % 60)).toString().padStart(2, '0')} / {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
};
