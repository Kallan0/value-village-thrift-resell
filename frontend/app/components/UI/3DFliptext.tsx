import { useState } from "react";
import { motion } from "framer-motion";

interface Text3DFlipProps {
  children: string;
  className?: string;
  textClassName?: string;
  flipTextClassName?: string;
  rotateDirection?: "top" | "bottom" | "left" | "right";
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | number;
  transition?: any;
}

export default function Text3DFlip({
  children,
  className,
  textClassName,
  flipTextClassName,
  rotateDirection = "top",
  staggerDuration = 0.03,
  staggerFrom = "first",
  transition = { type: "spring", damping: 25, stiffness: 160 },
}: Text3DFlipProps) {
  const characters = children.split("");
  
  // ✅ THE ENDLESS ENGINE: Tracks how many times you've hovered it
  const [flipCount, setFlipCount] = useState(0);

  const getDelay = (index: number) => {
    if (staggerFrom === "first") return index * staggerDuration;
    if (staggerFrom === "last") return (characters.length - 1 - index) * staggerDuration;
    if (staggerFrom === "center") {
      const center = Math.floor(characters.length / 2);
      return Math.abs(center - index) * staggerDuration;
    }
    if (typeof staggerFrom === "number") return Math.abs(staggerFrom - index) * staggerDuration;
    return index * staggerDuration;
  };

  // ✅ Calculates the continuous forward rotation
  const getRotation = (direction: string, count: number) => {
    const step = 90;
    switch (direction) {
      case "top": return { rotateX: count * step };
      case "bottom": return { rotateX: count * -step };
      case "left": return { rotateY: count * -step };
      case "right": return { rotateY: count * step };
      default: return { rotateX: count * step };
    }
  };

  // ✅ Generates 4 sides of a cube mathematically
  const getFaceTransform = (direction: string, faceIndex: number) => {
    const sign = (direction === "top" || direction === "right") ? -1 : 1;
    const angle = sign * faceIndex * 90;
    
    if (direction === "top" || direction === "bottom") {
      return `rotateX(${angle}deg) translateZ(0.5em)`;
    } else {
      return `rotateY(${angle}deg) translateZ(0.5em)`;
    }
  };

  return (
    <motion.div
      // 🚀 Triggers a new forward roll every time the mouse enters
      onMouseEnter={() => setFlipCount((c) => c + 1)}
      className={className}
      style={{ display: 'flex', flexWrap: 'wrap', cursor: 'pointer', perspective: "1000px" }} 
    >
      {characters.map((char, i) => {
        const isSpace = char === " ";
        return (
          <motion.span
            key={i}
            initial={false} // Prevents animation on initial page load
            animate={getRotation(rotateDirection, flipCount)}
            transition={{ ...transition, delay: getDelay(i) }}
            style={{ 
              position: 'relative', 
              display: 'inline-block', 
              transformStyle: "preserve-3d"
            }}
          >
            {/* 🎲 Maps out a 4-sided cube that alternates between your two colors */}
            {[0, 1, 2, 3].map((faceIndex) => (
              <span
                key={faceIndex}
                className={faceIndex % 2 === 0 ? textClassName : flipTextClassName}
                style={{ 
                  position: faceIndex === 0 ? 'relative' : 'absolute', 
                  left: faceIndex === 0 ? 'auto' : 0, 
                  top: faceIndex === 0 ? 'auto' : 0, 
                  height: faceIndex === 0 ? 'auto' : '100%', 
                  width: faceIndex === 0 ? 'auto' : '100%', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  transform: getFaceTransform(rotateDirection, faceIndex),
                  
                  // 🛡️ CRITICAL FIX: Destroys the visual bug/shadow leakage
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }} 
              >
                {isSpace ? "\u00A0" : char}
              </span>
            ))}
          </motion.span>
        );
      })}
    </motion.div>
  );
}