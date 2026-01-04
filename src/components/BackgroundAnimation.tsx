import { motion } from "framer-motion";

export const BackgroundAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/5 to-background opacity-50" />

      {/* SVG Grain Filter */}
      <svg className="invisible absolute w-0 h-0">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.6"
            stitchTiles="stitch"
          />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="purpleNoise" />
        </filter>
      </svg>

      {/* Flowing Waves */}
      <div className="absolute inset-0 opacity-80 dark:opacity-60">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Wave 1 - Primary (Coral) */}
          <motion.path
            fill="hsl(var(--primary))"
            fillOpacity="0.3"
            initial={{ d: "M0 50 Q 25 40 50 50 T 100 50 V 100 H 0 Z" }}
            animate={{
              d: [
                "M0 50 Q 25 40 50 50 T 100 50 V 100 H 0 Z",
                "M0 50 Q 25 60 50 50 T 100 50 V 100 H 0 Z",
                "M0 50 Q 25 40 50 50 T 100 50 V 100 H 0 Z",
              ],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Wave 2 - Secondary (Lavender) */}
          <motion.path
            fill="hsl(var(--secondary))"
            fillOpacity="0.4"
            initial={{ d: "M0 60 Q 30 70 50 60 T 100 60 V 100 H 0 Z" }}
            animate={{
              d: [
                "M0 60 Q 30 70 50 60 T 100 60 V 100 H 0 Z",
                "M0 60 Q 30 50 50 60 T 100 60 V 100 H 0 Z",
                "M0 60 Q 30 70 50 60 T 100 60 V 100 H 0 Z",
              ],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          {/* Wave 3 - Accent (Sage) */}
          <motion.path
            fill="hsl(var(--accent))"
            fillOpacity="0.5"
            initial={{ d: "M0 40 Q 40 30 60 40 T 100 40 V 100 H 0 Z" }}
            animate={{
              d: [
                "M0 40 Q 40 30 60 40 T 100 40 V 100 H 0 Z",
                "M0 40 Q 40 50 60 40 T 100 40 V 100 H 0 Z",
                "M0 40 Q 40 30 60 40 T 100 40 V 100 H 0 Z",
              ],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </svg>
      </div>

      {/* Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ filter: "url(#noiseFilter)" }} />
    </div>
  );
};
