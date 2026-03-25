"use client";

import { useEffect } from "react";

type BodyStyleSnapshot = {
  overflow: string;
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
  overscrollBehavior: string;
  paddingRight: string;
};

type HtmlStyleSnapshot = {
  overflow: string;
  overscrollBehavior: string;
};

const scrollLockState: {
  count: number;
  scrollY: number;
  bodySnapshot: BodyStyleSnapshot | null;
  htmlSnapshot: HtmlStyleSnapshot | null;
} = {
  count: 0,
  scrollY: 0,
  bodySnapshot: null,
  htmlSnapshot: null,
};

function applyScrollLock() {
  const body = document.body;
  const html = document.documentElement;
  const scrollbarCompensation = window.innerWidth - html.clientWidth;

  scrollLockState.scrollY = window.scrollY;
  scrollLockState.bodySnapshot = {
    overflow: body.style.overflow,
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
    overscrollBehavior: body.style.overscrollBehavior,
    paddingRight: body.style.paddingRight,
  };
  scrollLockState.htmlSnapshot = {
    overflow: html.style.overflow,
    overscrollBehavior: html.style.overscrollBehavior,
  };

  body.style.overflow = "hidden";
  body.style.position = "fixed";
  body.style.top = `-${scrollLockState.scrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.overscrollBehavior = "none";
  body.style.paddingRight =
    scrollbarCompensation > 0 ? `${scrollbarCompensation}px` : "";

  html.style.overflow = "hidden";
  html.style.overscrollBehavior = "none";
}

function releaseScrollLock() {
  const body = document.body;
  const html = document.documentElement;

  if (scrollLockState.bodySnapshot) {
    body.style.overflow = scrollLockState.bodySnapshot.overflow;
    body.style.position = scrollLockState.bodySnapshot.position;
    body.style.top = scrollLockState.bodySnapshot.top;
    body.style.left = scrollLockState.bodySnapshot.left;
    body.style.right = scrollLockState.bodySnapshot.right;
    body.style.width = scrollLockState.bodySnapshot.width;
    body.style.overscrollBehavior =
      scrollLockState.bodySnapshot.overscrollBehavior;
    body.style.paddingRight = scrollLockState.bodySnapshot.paddingRight;
  }

  if (scrollLockState.htmlSnapshot) {
    html.style.overflow = scrollLockState.htmlSnapshot.overflow;
    html.style.overscrollBehavior =
      scrollLockState.htmlSnapshot.overscrollBehavior;
  }

  window.scrollTo(0, scrollLockState.scrollY);
  scrollLockState.bodySnapshot = null;
  scrollLockState.htmlSnapshot = null;
}

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) {
      return;
    }

    scrollLockState.count += 1;

    if (scrollLockState.count === 1) {
      applyScrollLock();
    }

    return () => {
      scrollLockState.count = Math.max(0, scrollLockState.count - 1);

      if (scrollLockState.count === 0) {
        releaseScrollLock();
      }
    };
  }, [locked]);
}
