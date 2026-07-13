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

  const getFaceTransform = (direction: string, faceIndex: number) => {
    const sign = direction === "top" || direction === "right" ? -1 : 1;
    const angle = sign * faceIndex * 90;

    if (direction === "top" || direction === "bottom") {
      return `rotateX(${angle}deg) translateZ(0.5em)`;
    }

    return `rotateY(${angle}deg) translateZ(0.5em)`;
  };

  return (
    <motion.div
      onMouseEnter={() => setFlipCount((c) => c + 1)}
      className={className}
      style={{ display: "flex", flexWrap: "wrap", cursor: "pointer", perspective: "1000px" }}
    >
      {characters.map((char, i) => {
        const isSpace = char === " ";
        return (
          <motion.span
            key={i}
            initial={false}
            animate={getRotation(rotateDirection, flipCount)}
            transition={{ ...transition, delay: getDelay(i) }}
            style={{
              position: "relative",
              display: "inline-block",
              transformStyle: "preserve-3d",
            }}
          >
            {[0, 1, 2, 3].map((faceIndex) => (
              <span
                key={faceIndex}
                className={faceIndex % 2 === 0 ? textClassName : flipTextClassName}
                style={{
                  position: faceIndex === 0 ? "relative" : "absolute",
                  left: faceIndex === 0 ? "auto" : 0,
                  top: faceIndex === 0 ? "auto" : 0,
                  height: faceIndex === 0 ? "auto" : "100%",
                  width: faceIndex === 0 ? "auto" : "100%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: getFaceTransform(rotateDirection, faceIndex),
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
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