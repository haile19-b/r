"use client";

import React, { useEffect, useRef } from "react";

interface ConfettiCanvasProps {
  active: boolean;
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  shape: "circle" | "square" | "star";
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

const COLORS = [
  "#fbbf24", // gold
  "#fef08a", // yellow
  "#4ade80", // green
  "#22d3ee", // cyan
  "#f43f5e", // pink
  "#c084fc", // purple
  "#60a5fa"  // blue
];

export default function ConfettiCanvas({ active, onComplete }: ConfettiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize particles
    const particleCount = 180;
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      // Spawn from bottom center or bottom corners
      const side = Math.random() < 0.5 ? "left" : "right";
      const x = side === "left" ? Math.random() * (canvas.width * 0.3) : canvas.width - Math.random() * (canvas.width * 0.3);
      const y = canvas.height + 20;

      const angle = side === "left" 
        ? -Math.PI / 4 - Math.random() * (Math.PI / 4) // angle between -45 and -90 deg
        : -Math.PI * 3 / 4 + Math.random() * (Math.PI / 4); // angle between -135 and -90 deg

      const speed = 10 + Math.random() * 15;
      
      newParticles.push({
        x,
        y,
        size: 5 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: Math.random() < 0.4 ? "circle" : Math.random() < 0.7 ? "square" : "star",
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: -0.1 + Math.random() * 0.2,
        opacity: 1
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28; // gravity
        p.vx *= 0.98; // air resistance
        p.rotation += p.rotationSpeed;
        
        // slowly fade out after falling past 60% height or after some time
        if (p.vy > 0) {
          p.opacity -= 0.008;
        }

        if (p.opacity <= 0 || p.y > canvas.height + 50 || p.x < -50 || p.x > canvas.width + 50) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "square") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          // Draw star
          drawStar(0, 0, 5, p.size, p.size / 2);
        }

        ctx.restore();
      }

      if (particles.length > 0) {
        animationFrameRef.current = requestAnimationFrame(update);
      } else {
        if (onComplete) onComplete();
      }
    };

    // Cancel previous loop if any
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    update();
  }, [active, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
}
