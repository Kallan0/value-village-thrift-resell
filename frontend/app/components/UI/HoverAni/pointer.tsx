import { motion, AnimatePresence } from "framer-motion";

interface HeartCursorProps {
  isVisible: boolean;
  x: number;
  y: number;
}

export default function HeartCursor({ isVisible, x, y }: HeartCursorProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            // The -20 offset is handled here internally to center the 40x40 SVG!
            x: x - 20, 
            y: y - 20 
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none', // Prevents click-blocking
            zIndex: 50
          }}
        >
          <motion.svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#ec4899"
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}