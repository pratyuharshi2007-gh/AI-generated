/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Point, Direction } from "../types";
import { GRID_SIZE, GAME_SPEED } from "../constants";

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(p => p.x === newFood.x && p.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection("RIGHT");
    setIsGameOver(false);
    setScore(0);
    onScoreChange(0);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case "UP": newHead.y -= 1; break;
        case "DOWN": newHead.y += 1; break;
        case "LEFT": newHead.x -= 1; break;
        case "RIGHT": newHead.x += 1; break;
      }

      // Wall collision
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, score, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp": if (direction !== "DOWN") setDirection("UP"); break;
        case "ArrowDown": if (direction !== "UP") setDirection("DOWN"); break;
        case "ArrowLeft": if (direction !== "RIGHT") setDirection("LEFT"); break;
        case "ArrowRight": if (direction !== "LEFT") setDirection("RIGHT"); break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div id="snake-container" className="relative w-full aspect-square max-w-[500px] bg-black relative">
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,255,65,0.06),rgba(0,255,65,0.02),rgba(0,255,65,0.06))] bg-[length:100%_4px,3px_100%] z-10"></div>
      
      {/* Grid Lines Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(#00ff41 1px, transparent 1px), linear-gradient(90deg, #00ff41 1px, transparent 1px)', backgroundSize: '1fr 1fr' }}></div>

      {/* Grid */}
      <div 
        className="grid w-full h-full relative z-1"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(p => p.x === x && p.y === y);
          const isFood = food.x === x && food.y === y;
          const isHead = snake[0].x === x && snake[0].y === y;

          return (
            <div
              key={i}
              className={`w-full h-full ${
                isSnake ? (isHead ? "bg-primary shadow-[0_0_15px_#00ff41]" : "bg-primary/60") : 
                isFood ? "bg-rose-500 rounded-full animate-pulse shadow-[0_0_15px_#f43f5e]" : ""
              }`}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#050505]/95 backdrop-blur-sm"
          >
            <h2 className="text-4xl font-mono font-bold text-rose-500 mb-4 uppercase italic">Fatal_Error</h2>
            <p className="text-xl font-mono text-primary mb-8 border border-primary/20 px-4 py-1">FINAL_SCORE: {score}</p>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-primary text-black font-bold uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Reboot_Systems
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
