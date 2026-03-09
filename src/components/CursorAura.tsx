"use client";

import { useEffect, useState } from "react";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

export default function CursorAura() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const pointerX = useMotionValue(-9999);
  const pointerY = useMotionValue(-9999);
  const haloX = useSpring(pointerX, { stiffness: 320, damping: 36, mass: 0.34 });
  const haloY = useSpring(pointerY, { stiffness: 320, damping: 36, mass: 0.34 });

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const media = window.matchMedia("(pointer: fine)");
    const updateEnabled = () => setEnabled(media.matches);
    updateEnabled();

    const handleMove = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      setActive((current) => (current ? current : true));
    };

    const handleLeave = (event: MouseEvent) => {
      if (event.relatedTarget === null) {
        setActive(false);
      }
    };

    const handleBlur = () => {
      setActive(false);
    };

    media.addEventListener("change", updateEnabled);
    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handleMove, { passive: true });
    window.addEventListener("mouseout", handleLeave);
    window.addEventListener("blur", handleBlur);

    return () => {
      media.removeEventListener("change", updateEnabled);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleMove);
      window.removeEventListener("mouseout", handleLeave);
      window.removeEventListener("blur", handleBlur);
    };
  }, [pointerX, pointerY, reduceMotion]);

  if (reduceMotion || !enabled) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="pointer-events-none fixed inset-0 z-[1] hidden xl:block"
    >
      <motion.div
        style={{ x: haloX, y: haloY }}
        className="absolute left-0 top-0 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,170,115,0.1),rgba(216,170,115,0.03)_42%,transparent_70%)] blur-[86px]"
      />
      <motion.div
        style={{ x: pointerX, y: pointerY }}
        className="absolute left-0 top-0 h-[8rem] w-[8rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(125,183,176,0.14),rgba(216,170,115,0.08)_38%,rgba(216,170,115,0.015)_62%,transparent_76%)] blur-[44px]"
      />
    </motion.div>
  );
}
