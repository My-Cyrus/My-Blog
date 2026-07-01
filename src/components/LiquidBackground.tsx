import { motion } from 'motion/react';

export function LiquidBackground() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#0A0A0A] overflow-hidden">
      {/* High-end Abstract Gradient Background */}
      <motion.div 
        className="absolute inset-0 opacity-80"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, #0A0A0A 80%)',
        }}
      />
      
      {/* Slow Moving Artistic Orbs */}
      <motion.div
        animate={{
          x: ['-10vw', '10vw', '-5vw', '-10vw'],
          y: ['-10vh', '5vh', '15vh', '-10vh'],
          scale: [1, 1.2, 0.9, 1],
          rotate: [0, 90, 180, 360]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-indigo-600/20 to-purple-500/20 blur-[120px] mix-blend-screen"
      />
      
      <motion.div
        animate={{
          x: ['10vw', '-15vw', '5vw', '10vw'],
          y: ['10vh', '-10vh', '-20vh', '10vh'],
          scale: [1, 1.3, 0.8, 1],
          rotate: [360, 180, 90, 0]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] rounded-[40%] bg-gradient-to-bl from-pink-600/10 to-rose-400/10 blur-[130px] mix-blend-screen"
      />

      <motion.div
        animate={{
          x: ['0vw', '20vw', '-20vw', '0vw'],
          y: ['20vh', '0vh', '-20vh', '20vh'],
          scale: [0.8, 1.1, 1, 0.8],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vw] rounded-full bg-gradient-to-r from-blue-600/10 to-cyan-400/10 blur-[100px] mix-blend-screen"
      />

      {/* Grid overlay for tech-artistic feel */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem'
        }}
      />

      {/* Very subtle noise for texture */}
      <div 
        className="absolute inset-0 opacity-[0.15] dark:opacity-[0.25] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
