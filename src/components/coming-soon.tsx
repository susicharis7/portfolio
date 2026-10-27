"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

const letter: Variants = {
  hidden: { opacity: 0, y: 60, filter: "blur(16px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease },
  },
};

function BlurWord({
  text,
  delay,
  className,
}: {
  text: string;
  delay: number;
  className?: string;
}) {
  return (
    <motion.span
      aria-hidden
      className={`flex ${className ?? ""}`}
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.07, delayChildren: delay }}
    >
      {text.split("").map((char, i) => (
        <motion.span key={i} variants={letter} className="inline-block">
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function ComingSoon() {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const y = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const bgX = useTransform(x, (v) => v * -30);
  const bgY = useTransform(y, (v) => v * -30);
  const textX = useTransform(x, (v) => v * 14);
  const textY = useTransform(y, (v) => v * 14);

  function handleMove(e: React.PointerEvent) {
    if (reduceMotion) return;
    mouseX.set(e.clientX / window.innerWidth - 0.5);
    mouseY.set(e.clientY / window.innerHeight - 0.5);
  }

  return (
    <main
      onPointerMove={handleMove}
      className="relative flex flex-1 flex-col overflow-hidden bg-[#eef2f7] font-[family-name:var(--font-outfit)] text-[#0f1a2a]"
    >
      {/* Blurred hero background, slowly settling in and drifting with the cursor */}
      <motion.div
        className="absolute -inset-16"
        style={{ x: bgX, y: bgY }}
        initial={{ scale: 1.25, opacity: 0 }}
        animate={{ scale: 1.05, opacity: 1 }}
        transition={{ duration: 2.4, ease }}
      >
        <Image
          src="/hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover blur-2xl"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0.35)_45%,rgba(238,242,247,0.1)_100%)]" />

      <motion.header
        className="relative z-10 flex items-center px-6 pt-6 sm:px-12 sm:pt-10"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.4, ease }}
      >
        <Image src="/logo.png" alt="Haris Sušić" width={44} height={44} />
      </motion.header>

      <motion.section
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-4"
        style={{ x: textX, y: textY }}
      >
        <h1 className="flex flex-col items-center text-[clamp(3.5rem,17vw,13rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.03em]">
          <span className="sr-only">Coming soon</span>
          <BlurWord text="Coming" delay={0.2} />
          <BlurWord
            text="Soon"
            delay={0.6}
            className="[filter:url(#outline)]"
          />
        </h1>

        {/* Outline = glyph minus an eroded copy. Unlike text-stroke, this
            doesn't draw the font's internal overlapping contours. */}
        <svg aria-hidden className="absolute size-0">
          <filter id="outline">
            <feMorphology in="SourceAlpha" operator="erode" radius="2" result="inner" />
            <feComposite in="SourceGraphic" in2="inner" operator="out" />
          </filter>
        </svg>
      </motion.section>

      <motion.footer
        className="relative z-10 flex items-end justify-between px-6 pb-6 text-[11px] font-medium uppercase tracking-[0.3em] text-[#0f1a2a]/60 sm:px-12 sm:pb-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.6, ease }}
      >
        <span>Sarajevo, BiH</span>
        <span>© {new Date().getFullYear()}</span>
      </motion.footer>
    </main>
  );
}
