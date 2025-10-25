"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function RevealOnScroll({ children, delayClass = '', animationClass = 'animate-fade-in-up' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback: show immediately
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${visible ? animationClass : 'opacity-0 translate-y-2'} ${delayClass}`}>
      {children}
    </div>
  );
}
