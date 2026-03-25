"use client";

import React, { useRef, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { useTheme } from "../lib/theme-provider";

const StarsAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext("2d", { alpha: false });
    if (!c) return;

    const applyCanvasStyles = () => {
      // Light theme uses a very light slate (slate-50 is 248, 250, 252). Dark uses black.
      c.fillStyle = theme === "dark" ? "rgba(0, 0, 0, 0.1)" : "rgba(248, 250, 252, 0.1)";
      c.strokeStyle = theme === "dark" ? "rgba(22, 174, 240, 0.35)" : "rgba(22, 174, 240, 0.5)";
      c.lineCap = "round";
    };

    const updateCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.translate(w / 2, h / 2);
      applyCanvasStyles();
    };

    updateCanvasSize();

    class Star {
      x: number;
      y: number;
      px: number;
      py: number;
      z: number;
      canvasWidth: number;
      canvasHeight: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.x = Math.random() * canvasWidth - canvasWidth / 2;
        this.y = Math.random() * canvasHeight - canvasHeight / 2;
        this.px = 0;
        this.py = 0;
        this.z = Math.random() * 4;
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.px = this.x;
        this.py = this.y;
        this.z += speed;
        this.x += this.x * (speed * 0.2) * this.z;
        this.y += this.y * (speed * 0.2) * this.z;
        const halfWidth = canvasWidth / 2;
        const halfHeight = canvasHeight / 2;
        if (
          this.x > halfWidth + 50 ||
          this.x < -halfWidth - 50 ||
          this.y > halfHeight + 50 ||
          this.y < -halfHeight - 50
        ) {
          this.x = Math.random() * canvasWidth - halfWidth;
          this.y = Math.random() * canvasHeight - halfHeight;
          this.px = this.x;
          this.py = this.y;
          this.z = 0;
        }
      }

      show(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = this.z;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.px, this.py);
        ctx.stroke();
      }
    }

    let count = 1500;
    if (isMobile) {
      count = 500;
    }

    const speed = 0.02;
    const logicalW = () => window.innerWidth;
    const logicalH = () => window.innerHeight;
    let stars = Array.from(
      { length: count },
      () => new Star(logicalW(), logicalH())
    );

    let animationFrameId: number;

    const draw = () => {
      const w = logicalW();
      const h = logicalH();
      const halfWidth = w / 2;
      const halfHeight = h / 2;
      applyCanvasStyles();
      c.fillRect(-halfWidth, -halfHeight, w, h);
      for (const s of stars) {
        s.update(w, h);
        s.show(c);
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      updateCanvasSize();
      const w = logicalW();
      const h = logicalH();
      stars = Array.from(
        { length: count },
        () => new Star(w, h)
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        /* z-0: z-index -1 sat under html/body background after globals overscroll fix */
        zIndex: 0,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
      }}
    />
  );
};

export default StarsAnimation;
