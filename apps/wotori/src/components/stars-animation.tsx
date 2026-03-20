"use client";

import React, { useRef, useEffect } from "react";
import { isMobile } from "react-device-detect";

const StarsAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext("2d");
    if (!c) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
    const stars = Array.from(
      { length: count },
      () => new Star(canvas.width, canvas.height)
    );

    c.fillStyle = "rgba(255, 255, 255, 0.1)";
    c.strokeStyle = "rgb(22, 174, 240, 0.3)";
    c.translate(canvas.width / 2, canvas.height / 2);

    let animationFrameId: number;

    const draw = () => {
      const halfWidth = canvas.width / 2;
      const halfHeight = canvas.height / 2;
      c.fillRect(-halfWidth, -halfHeight, canvas.width, canvas.height);
      for (const s of stars) {
        s.update(canvas.width, canvas.height);
        s.show(c);
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      updateCanvasSize();
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.translate(canvas.width / 2, canvas.height / 2);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100vw",
        height: "100vh",
      }}
    />
  );
};

export default StarsAnimation;
