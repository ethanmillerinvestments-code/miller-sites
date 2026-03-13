"use client";

import type { CSSProperties } from "react";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

type Bloom = {
  tone: "warm" | "cool";
  style: CSSProperties;
};

type Thread = {
  tone: "warm" | "cool" | "mixed";
  style: CSSProperties;
};

type Mote = {
  tone: "warm" | "cool";
  style: CSSProperties;
};

type Plate = {
  tone: "warm" | "cool";
  style: CSSProperties;
};

const blooms: Bloom[] = [
  {
    tone: "warm",
    style: {
      top: "4%",
      left: "-10%",
      width: "30rem",
      height: "30rem",
      ["--ambient-duration" as string]: "19s",
      ["--ambient-delay" as string]: "-4s",
    },
  },
  {
    tone: "cool",
    style: {
      top: "15%",
      right: "-9%",
      width: "24rem",
      height: "24rem",
      ["--ambient-duration" as string]: "22s",
      ["--ambient-delay" as string]: "-8s",
    },
  },
  {
    tone: "cool",
    style: {
      top: "46%",
      left: "-6%",
      width: "27rem",
      height: "27rem",
      ["--ambient-duration" as string]: "23s",
      ["--ambient-delay" as string]: "-6s",
    },
  },
  {
    tone: "cool",
    style: {
      top: "74%",
      left: "66%",
      width: "20rem",
      height: "20rem",
      ["--ambient-duration" as string]: "19s",
      ["--ambient-delay" as string]: "-9s",
    },
  },
];

const threads: Thread[] = [
  {
    tone: "warm",
    style: {
      top: "13%",
      left: "12%",
      width: "34rem",
      ["--ambient-duration" as string]: "17s",
      ["--ambient-delay" as string]: "-3s",
    },
  },
  {
    tone: "mixed",
    style: {
      top: "38%",
      right: "9%",
      width: "28rem",
      ["--ambient-duration" as string]: "20s",
      ["--ambient-delay" as string]: "-10s",
    },
  },
  {
    tone: "cool",
    style: {
      top: "60%",
      left: "4%",
      width: "40rem",
      ["--ambient-duration" as string]: "18s",
      ["--ambient-delay" as string]: "-7s",
    },
  },
  {
    tone: "warm",
    style: {
      top: "36%",
      left: "12%",
      width: "0.35rem",
      height: "0.35rem",
      ["--ambient-duration" as string]: "13s",
      ["--ambient-delay" as string]: "-6s",
    },
  },
];

const motes: Mote[] = [
  {
    tone: "cool",
    style: {
      top: "20%",
      right: "18%",
      width: "0.52rem",
      height: "0.52rem",
      ["--ambient-duration" as string]: "15s",
      ["--ambient-delay" as string]: "-9s",
    },
  },
  {
    tone: "warm",
    style: {
      top: "54%",
      left: "16%",
      width: "0.4rem",
      height: "0.4rem",
      ["--ambient-duration" as string]: "16s",
      ["--ambient-delay" as string]: "-4s",
    },
  },
  {
    tone: "cool",
    style: {
      top: "76%",
      right: "24%",
      width: "0.48rem",
      height: "0.48rem",
      ["--ambient-duration" as string]: "14s",
      ["--ambient-delay" as string]: "-10s",
    },
  },
];

const plates: Plate[] = [
  {
    tone: "warm",
    style: {
      top: "8%",
      right: "-2%",
      width: "26rem",
      height: "22rem",
      ["--ambient-duration" as string]: "28s",
      ["--ambient-delay" as string]: "-6s",
    },
  },
  {
    tone: "cool",
    style: {
      top: "42%",
      left: "-6%",
      width: "24rem",
      height: "20rem",
      ["--ambient-duration" as string]: "31s",
      ["--ambient-delay" as string]: "-12s",
    },
  },
  {
    tone: "warm",
    style: {
      top: "70%",
      right: "8%",
      width: "22rem",
      height: "18rem",
      ["--ambient-duration" as string]: "26s",
      ["--ambient-delay" as string]: "-10s",
    },
  },
];

export default function SiteAtmosphere() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const bloomY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "-15%"]);
  const plateY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "-25%"]);
  const threadY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "-10%"]);
  const moteY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "-7.5%"]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div className="ambient-grid" />
      <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(216,170,115,0.08),transparent)] opacity-70" />

      <motion.div style={{ y: plateY }}>
        {plates.map((plate, index) => (
          <div
            key={`plate-${index}`}
            className={`ambient-plate ${
              plate.tone === "warm" ? "ambient-plate-warm" : "ambient-plate-cool"
            }`}
            style={plate.style}
          />
        ))}
      </motion.div>

      <motion.div style={{ y: bloomY }}>
        {blooms.map((bloom, index) => (
          <div
            key={`bloom-${index}`}
            className={`ambient-bloom ${
              bloom.tone === "warm" ? "ambient-bloom-warm" : "ambient-bloom-cool"
            }`}
            style={bloom.style}
          />
        ))}
      </motion.div>

      <motion.div style={{ y: threadY }}>
        {threads.map((thread, index) => (
          <div
            key={`thread-${index}`}
            className={`ambient-thread ${
              thread.tone === "warm"
                ? "ambient-thread-warm"
                : thread.tone === "cool"
                  ? "ambient-thread-cool"
                  : "ambient-thread-mixed"
            }`}
            style={thread.style}
          />
        ))}
      </motion.div>

      <motion.div style={{ y: moteY }}>
        {motes.map((mote, index) => (
          <span
            key={`mote-${index}`}
            className={`ambient-mote ${
              mote.tone === "warm" ? "ambient-mote-warm" : "ambient-mote-cool"
            }`}
            style={mote.style}
          />
        ))}
      </motion.div>

      <div className="ambient-vignette" />
    </div>
  );
}
