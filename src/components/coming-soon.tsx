"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import FlyingButton from "@/components/flying-button/FlyingButton";

const ease = [0.16, 1, 0.3, 1] as const;

export default function ComingSoon() {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const y = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const bgX = useTransform(x, (v) => v * -30);
  const bgY = useTransform(y, (v) => v * -30);

  function handleMove(e: React.PointerEvent) {
    if (reduceMotion) return;
    mouseX.set(e.clientX / window.innerWidth - 0.5);
    mouseY.set(e.clientY / window.innerHeight - 0.5);
  }

  return (
    <main
      onPointerMove={handleMove}
      className="relative flex flex-1 flex-col overflow-hidden bg-black font-[family-name:var(--font-outfit)] text-white"
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
          src="/hero-dark.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover blur-xl"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.25)_60%,rgba(0,0,0,0.6)_100%)]" />

      {/* Lifts off from the bottom edge and hovers in the middle for good */}
      <div className="absolute inset-0 z-10">
        <FlyingButton
          theme="dark"
          size="huge"
          autoFly
          carryCursor={false}
          thrustColor="#ffffff"
          buttonColor="#0a0a0a"
          textColor="#ffffff"
        >
          {/* Negative margin cancels the trailing letter-spacing so it stays centred */}
          <span className="-mr-[0.2em] font-semibold tracking-[0.2em]">
            COMING SOON
          </span>
        </FlyingButton>
      </div>
    </main>
  );
}
