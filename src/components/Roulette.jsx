import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import theme from "../config/theme";
import raffleConfig from "../config/raffleConfig";

function fitName(name, maxLength) {
  return name.length > maxLength ? `${name.slice(0, maxLength)}…` : name;
}

export default function Roulette({ participants, isSpinning, targetAngle }) {
  const canvasRef = useRef(null);
  const currentAngleRef = useRef(0);
  const tweenRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState(400);

  useEffect(() => {
    const updateSize = () => {
      const available = Math.min(window.innerWidth - 40, window.innerHeight - 220);
      setCanvasSize(Math.max(260, Math.min(440, available)));
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const drawWheel = (angle) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const center = canvasSize / 2;
    const radius = center - 12;
    const total = participants.length;

    if (canvas.width !== canvasSize * dpr || canvas.height !== canvasSize * dpr) {
      canvas.width = canvasSize * dpr;
      canvas.height = canvasSize * dpr;
      canvas.style.width = `${canvasSize}px`;
      canvas.style.height = `${canvasSize}px`;
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, canvasSize, canvasSize);

    if (!total) {
      context.beginPath();
      context.arc(center, center, radius, 0, Math.PI * 2);
      context.fillStyle = theme.primaryFaded;
      context.fill();
      context.strokeStyle = theme.border;
      context.lineWidth = 3;
      context.stroke();
      context.fillStyle = theme.muted;
      context.font = "600 14px Inter, system-ui, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("Sin participantes", center, center);
      return;
    }

    const segmentAngle = (Math.PI * 2) / total;
    context.save();
    context.translate(center, center);
    context.rotate((angle * Math.PI) / 180);

    participants.forEach((name, index) => {
      const start = segmentAngle * index;
      const end = start + segmentAngle;
      const middle = start + segmentAngle / 2;

      context.beginPath();
      context.moveTo(0, 0);
      context.arc(0, 0, radius, start, end);
      context.closePath();
      context.fillStyle = theme.wheelColors[index % theme.wheelColors.length];
      context.fill();
      context.strokeStyle = "rgba(255,255,255,.34)";
      context.lineWidth = 1.5;
      context.stroke();

      context.save();
      context.rotate(middle);
      context.fillStyle = "#FFFFFF";
      context.font = `700 ${total <= 8 ? 12 : 10}px Inter, system-ui, sans-serif`;
      context.textAlign = "right";
      context.textBaseline = "middle";
      context.shadowColor = "rgba(0,0,0,.25)";
      context.shadowBlur = 2;
      context.fillText(fitName(name, total <= 8 ? 18 : 14), radius - 16, 0);
      context.restore();
    });
    context.restore();

    context.beginPath();
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.strokeStyle = theme.primary;
    context.lineWidth = 4;
    context.stroke();

    context.beginPath();
    context.arc(center, center, 27, 0, Math.PI * 2);
    context.fillStyle = "#FFFFFF";
    context.fill();
    context.strokeStyle = theme.primary;
    context.lineWidth = 3;
    context.stroke();
    context.font = "700 18px Inter, system-ui, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("🐐", center, center + 1);
  };

  useLayoutEffect(() => {
    drawWheel(currentAngleRef.current);
  }, [participants, canvasSize]);

  useEffect(() => {
    if (!isSpinning || !participants.length) return undefined;

    tweenRef.current?.kill();
    const state = { angle: currentAngleRef.current };
    const currentNormalized = ((state.angle % 360) + 360) % 360;
    const desiredNormalized = ((targetAngle % 360) + 360) % 360;
    const completeTurns = Math.floor(targetAngle / 360);
    const alignmentDelta = (desiredNormalized - currentNormalized + 360) % 360;
    const finalAngle = state.angle + completeTurns * 360 + alignmentDelta;

    tweenRef.current = gsap.to(state, {
      angle: finalAngle,
      duration: raffleConfig.spinDurationMs / 1000,
      ease: "power4.out",
      onUpdate: () => {
        currentAngleRef.current = state.angle;
        drawWheel(state.angle);
      },
    });

    return () => tweenRef.current?.kill();
  }, [isSpinning, targetAngle, participants]);

  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute -top-1 left-1/2 z-10 -translate-x-1/2">
        <div
          className="h-0 w-0 drop-shadow-lg"
          style={{
            borderLeft: "13px solid transparent",
            borderRight: "13px solid transparent",
            borderTop: `26px solid ${theme.primary}`,
          }}
        />
      </div>
      <div
        aria-hidden="true"
        className={`absolute rounded-full transition duration-700 ${isSpinning ? "scale-110 opacity-70" : "opacity-25"}`}
        style={{
          width: canvasSize + 50,
          height: canvasSize + 50,
          background: `radial-gradient(circle, ${theme.primary}30 0%, transparent 70%)`,
        }}
      />
      <canvas
        ref={canvasRef}
        aria-label={`Ruleta con ${participants.length} participantes visibles`}
        className={`relative z-[1] transition-[filter] duration-500 ${isSpinning ? "drop-shadow-2xl" : "drop-shadow-md"}`}
      />
    </div>
  );
}
