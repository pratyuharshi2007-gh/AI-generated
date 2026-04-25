/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";

export const GlitchOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-magenta-500 selection:text-white overflow-hidden">
      {/* Constant static noise */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      {/* Chromatic aberration layers */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>

      {/* Randomized Glitch Slices */}
      <motion.div 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-40 opacity-0"
        animate={{ 
          opacity: [0, 0, 0.1, 0, 0.05, 0],
          x: [0, 5, -5, 10, -10, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          times: [0, 0.8, 0.85, 0.9, 0.95, 1] 
        }}
        style={{
          background: 'linear-gradient(rgba(18,16,16,0) 50%,rgba(0,0,0,0.25) 50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))',
          backgroundSize: '100% 4px, 3px 100%'
        }}
      />
    </div>
  );
};
