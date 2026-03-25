"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useInView, useReducedMotion } from "framer-motion";

interface TextScrambleProps {
  text: string;
  speed?: number;
  trigger?: "inView" | "hover" | "immediate";
  className?: string;
  as?: "span" | "div";
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

export default function TextScramble({
  text,
  speed = 30,
  trigger = "inView",
  className = "",
  as: Tag = "span",
}: TextScrambleProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(trigger === "immediate" ? "" : text);
  const [isHovering, setIsHovering] = useState(false);
  const hasPlayed = useRef(false);

  const scramble = useCallback(() => {
    if (hasPlayed.current && trigger !== "hover") return;
    hasPlayed.current = true;

    let frame = 0;
    const totalFrames = text.length;
    const interval = setInterval(() => {
      const resolved = text.slice(0, frame);
      const remaining = text.length - frame;
      const scrambled = Array.from({ length: remaining }, () =>
        CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join("");
      setDisplay(resolved + scrambled);
      frame++;
      if (frame > totalFrames) {
        clearInterval(interval);
        setDisplay(text);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, trigger]);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(text);
      return;
    }
    if (trigger === "immediate") {
      return scramble();
    }
    if (trigger === "inView" && isInView) {
      return scramble();
    }
  }, [isInView, reduceMotion, scramble, text, trigger]);

  useEffect(() => {
    if (reduceMotion || trigger !== "hover") return;
    if (isHovering) {
      hasPlayed.current = false;
      return scramble();
    }
  }, [isHovering, reduceMotion, scramble, trigger]);

  const hoverProps =
    trigger === "hover"
      ? {
          onMouseEnter: () => setIsHovering(true),
          onMouseLeave: () => {
            setIsHovering(false);
            setDisplay(text);
          },
        }
      : {};

  if (Tag === "span") {
    return (
      <span ref={ref as React.Ref<HTMLSpanElement>} className={className} {...hoverProps}>
        {display}
      </span>
    );
  }

  return (
    <div ref={ref} className={className} {...hoverProps}>
      {display}
    </div>
  );
}
