"use client";

import React, { useState, useEffect } from "react";

export const ScrollIndicator: React.FC = () => {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bodyHeight = document.body.offsetHeight;
      const buffer = 100;

      setIsAtBottom(scrollPosition >= bodyHeight - buffer);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`pointer-events-none fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent transition-opacity duration-300 ${
        isAtBottom ? "opacity-0" : "opacity-100"
      }`}
    />
  );
};
