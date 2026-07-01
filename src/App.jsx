import { useState, useEffect, useRef } from "react";
import stork from "./assets/stork-ai.png";
import music from "./assets/ege.mp3";

const TARGET = new Date("2026-11-18T09:00:00");

function getTimeLeft() {
  const diff = TARGET - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor(diff / 3600000) % 24,
    m: Math.floor(diff / 60000) % 60,
    s: Math.floor(diff / 1000) % 60,
    done: false,
  };
}

function CountUnit({ value, label }) {
  const display = String(value).padStart(2, "0");
  const [flip, setFlip] = useState(false);
  const prev = useRef(display);
  useEffect(() => {
    if (display !== prev.current) {
      setFlip(true);
      prev.current = display;
      const t = setTimeout(() => setFlip(false), 350);
      return () => clearTimeout(t);
    }
  }, [display]);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          width: 98,
          height: 88,
          background: "linear-gradient(160deg,#fff 0%,#fff0f5 100%)",
          border: "2px solid #f0b8cc",
          borderRadius: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 6px 24px #e090b025, inset 0 1px 0 #fff",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg,#ffffff90 0%,transparent 50%)",
            borderRadius: 18,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 10,
            right: 10,
            height: 1.5,
            background: "#f0c0d040",
          }}
        />
        <span
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 46,
            fontWeight: 900,
            lineHeight: 1,
            background: "linear-gradient(180deg,#c2557a 0%,#e8819e 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: flip ? "flipNum .3s ease both" : "none",
          }}
        >
          {display}
        </span>
      </div>
      <span
        style={{
          marginTop: 7,
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: ".22em",
          textTransform: "uppercase",
          color: "#d4889e",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function BalloonCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    function resize() {
      canvas.width = wrap.offsetWidth;
      canvas.height = wrap.offsetHeight;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const BCOLS = [
      "#f4a0c0",
      "#f9c8d8",
      "#fce0ea",
      "#e87aa8",
      "#ffb8d0",
      "#f8d0e0",
      "#f472a0",
      "#ffd0e8",
      "#e8a0b8",
    ];
    const balloons = Array.from({ length: 22 }, (_, i) => {
      const ry = 12 + Math.random() * 16;
      return {
        x: Math.random() * 100,
        y: 110 + Math.random() * 100,
        ry,
        rx: ry * (0.88 + Math.random() * 0.08),
        color: BCOLS[i % BCOLS.length],
        speed: 0.08 + Math.random() * 0.2,
        drift: (Math.random() - 0.5) * 0.22,
        opacity: 0.3 + Math.random() * 0.45,
        sway: Math.random() * Math.PI * 2,
      };
    });
    const stars = Array.from({ length: 25 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2.5 + Math.random() * 5,
      color: Math.random() > 0.6 ? "#f9a0c0" : "#f8d0e0",
      opacity: Math.random() * 0.45 + 0.1,
      phase: Math.random() * Math.PI * 2,
      speed: 0.12 + Math.random() * 0.25,
    }));
    const bubbles = Array.from({ length: 18 }, () => ({
      x: Math.random() * 100,
      y: 100 + Math.random() * 100,
      r: 2 + Math.random() * 6,
      opacity: 0.08 + Math.random() * 0.15,
      speed: 0.1 + Math.random() * 0.18,
      phase: Math.random() * Math.PI * 2,
    }));
    function drawBalloon(cx, cy, rx, ry, color, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, cy + ry);
      ctx.bezierCurveTo(
        cx - rx * 1.1,
        cy + ry * 0.5,
        cx - rx * 1.1,
        cy - ry * 0.9,
        cx,
        cy - ry,
      );
      ctx.bezierCurveTo(
        cx + rx * 1.1,
        cy - ry * 0.9,
        cx + rx * 1.1,
        cy + ry * 0.5,
        cx,
        cy + ry,
      );
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = alpha * 0.38;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.ellipse(
        cx - rx * 0.28,
        cy - ry * 0.32,
        rx * 0.3,
        ry * 0.22,
        -0.4,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.globalAlpha = alpha * 0.85;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx - 2.5, cy + ry);
      ctx.quadraticCurveTo(cx, cy + ry + 7, cx + 2.5, cy + ry);
      ctx.fill();
      ctx.globalAlpha = alpha * 0.28;
      ctx.strokeStyle = "#d090a8";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy + ry + 5);
      ctx.quadraticCurveTo(cx + 9, cy + ry + 18, cx + 2, cy + ry + 32);
      ctx.stroke();
      ctx.restore();
    }
    function drawStar(cx, cy, r, color, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = color;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = i * Math.PI * 0.4 - Math.PI / 2,
          ai = a + Math.PI * 0.2;
        i === 0
          ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
          : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
        ctx.lineTo(cx + r * 0.42 * Math.cos(ai), cy + r * 0.42 * Math.sin(ai));
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    let frame = 0,
      rafId;
    function animate() {
      rafId = requestAnimationFrame(animate);
      const W = canvas.width,
        H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      frame++;
      balloons.forEach((b) => {
        b.y -= b.speed;
        b.x += Math.sin(frame * 0.011 + b.sway) * b.drift;
        if (b.y < -b.ry * 3) {
          b.y = 110;
          b.x = Math.random() * 100;
        }
        if (b.x < 0) b.x = 100;
        if (b.x > 100) b.x = 0;
        drawBalloon(
          (b.x / 100) * W,
          (b.y / 100) * H,
          b.rx,
          b.ry,
          b.color,
          b.opacity,
        );
      });
      stars.forEach((s) => {
        s.y -= s.speed;
        if (s.y < -10) {
          s.y = 100;
          s.x = Math.random() * 100;
        }
        const a =
          s.opacity * (0.5 + 0.5 * Math.abs(Math.sin(frame * 0.02 + s.phase)));
        drawStar((s.x / 100) * W, (s.y / 100) * H, s.size, s.color, a);
      });
      bubbles.forEach((b) => {
        b.y -= b.speed;
        if (b.y < -b.r * 2) {
          b.y = 100;
          b.x = Math.random() * 100;
        }
        ctx.save();
        ctx.globalAlpha = b.opacity;
        ctx.strokeStyle = "#f0b0c8";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc((b.x / 100) * W, (b.y / 100) * H, b.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });
    }
    animate();
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

export default function App() {
  const [time, setTime] = useState(getTimeLeft());
  const [isOpening, setIsOpening] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 500);
    audioRef.current = new Audio(music);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.6;
    return () => {
      clearInterval(id);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const handleEnter = () => {
    setIsOpening(true);
    // if (audioRef.current) {
    //   audioRef.current
    //     .play()
    //     .then(() => setIsPlaying(true))
    //     .catch((err) => console.log("Müzik engellendi:", err));
    // }
    setTimeout(() => setHasEntered(true), 1600);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Müzik başlatılamadı:", err));
    }
  };

  const z = { position: "relative", zIndex: 3 };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Cormorant+Garamond:ital,wght@1,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fce8f2; min-height: 100vh; overflow-x: hidden; }
        @keyframes flipNum {
          from { opacity: 0; transform: translateY(-14px) scaleY(.65); }
          60%  { transform: translateY(3px) scaleY(1.04); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes glowN {
          from { filter: drop-shadow(0 2px 8px #e87aa840); }
          to   { filter: drop-shadow(0 2px 24px #c2557a80); }
        }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes orbPulse { 0%,100%{opacity:.18} 50%{opacity:.38} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes sealPulse {
          0%,100% { transform: translate(-50%,-50%) scale(1); box-shadow: 0 4px 15px rgba(194,85,122,0.3); }
          50%     { transform: translate(-50%,-50%) scale(1.06); box-shadow: 0 6px 22px rgba(194,85,122,0.5); }
        }
      `}</style>

      {/* ZARF GİRİŞ EKRANI */}
      {!hasEntered && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "linear-gradient(170deg, #fdeef5 0%, #f9d8ea 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isOpening ? 0 : 1,
            transition: "opacity 0.8s cubic-bezier(0.4,0,0.2,1) 0.8s",
            pointerEvents: isOpening ? "none" : "auto",
            perspective: "1000px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "min(440px, 92vw)",
              height: "280px",
              background: "#f5cce0",
              borderRadius: "6px",
              boxShadow: "0 20px 50px rgba(194,85,122,0.15)",
              transform: isOpening ? "translateY(120px) scale(0.9)" : "none",
              transition: "transform 1.2s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {/* İÇ KART */}
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "15px",
                right: "15px",
                height: "240px",
                background: "linear-gradient(135deg,#fffafc 0%,#fff0f6 100%)",
                borderRadius: "4px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
                padding: "24px",
                transform: isOpening ? "translateY(-140px)" : "translateY(0)",
                opacity: isOpening ? 1 : 0,
                transition:
                  "transform 1.2s cubic-bezier(0.25,1,0.5,1) 0.2s, opacity 0.4s ease 0.2s",
                border: "1px solid #f0b8cc60",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "8px",
                  border: "1px solid #f0a0bc",
                  borderRadius: "2px",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: "12px",
                  border: "0.5px dashed #f8c0d4",
                  borderRadius: "2px",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  fontSize: 10,
                  color: "#e087a8",
                  marginBottom: 6,
                  letterSpacing: "2px",
                }}
              >
                ✿ ✦ ✿
              </div>
              <h1
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 28,
                  color: "#c2557a",
                  fontWeight: 900,
                  marginBottom: 2,
                  textAlign: "center",
                }}
              >
                Doğa geliyor! 🌸
              </h1>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  margin: "6px 0",
                }}
              >
                <div
                  style={{ width: 30, height: 0.5, background: "#f0a8c0" }}
                />
                <span style={{ fontSize: 11, color: "#f0a8c0" }}>♥</span>
                <div
                  style={{ width: 30, height: 0.5, background: "#f0a8c0" }}
                />
              </div>
            </div>

            {/* ÜST KAPAK */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 0,
                borderTop: "142px solid #fad8ec",
                borderLeft: "calc(min(440px, 92vw) / 2) solid transparent",
                borderRight: "calc(min(440px, 92vw) / 2) solid transparent",
                transformOrigin: "top center",
                transform: isOpening
                  ? "rotateX(180deg) translateY(1px)"
                  : "rotateX(0deg)",
                transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
                zIndex: isOpening ? 1 : 4,
                filter: "drop-shadow(0 3px 4px rgba(194,85,122,0.1))",
              }}
            />

            {/* SOL KAPAK */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: 0,
                borderLeft: "calc(min(440px, 92vw) * 0.52) solid #f0c4d8",
                borderTop: "140px solid transparent",
                borderBottom: "140px solid transparent",
                zIndex: 3,
                filter: "drop-shadow(3px 0 4px rgba(194,85,122,0.05))",
                borderRadius: "6px 0 0 6px",
              }}
            />

            {/* SAĞ KAPAK */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                width: 0,
                borderRight: "calc(min(440px, 92vw) * 0.52) solid #f0c4d8",
                borderTop: "140px solid transparent",
                borderBottom: "140px solid transparent",
                zIndex: 3,
                filter: "drop-shadow(-3px 0 4px rgba(194,85,122,0.05))",
                borderRadius: "0 6px 6px 0",
              }}
            />

            {/* ALT KAPAK */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 0,
                borderBottom: "145px solid #e8b0cc",
                borderLeft: "calc(min(440px, 92vw) / 2) solid transparent",
                borderRight: "calc(min(440px, 92vw) / 2) solid transparent",
                zIndex: 3,
                filter: "drop-shadow(0 -3px 5px rgba(194,85,122,0.08))",
                borderRadius: "0 0 6px 6px",
              }}
            />

            {/* MÜHÜR BUTONU */}
            <button
              onClick={handleEnter}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                zIndex: 5,
                width: "70px",
                height: "70px",
                background:
                  "radial-gradient(circle, #e87aa8 0%, #c2557a 70%, #a03060 100%)",
                border: "2px solid #f090b8",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff0f6",
                fontSize: "26px",
                opacity: isOpening ? 0 : 1,
                visibility: isOpening ? "hidden" : "visible",
                transition: "opacity 0.2s, visibility 0.2s",
                animation: isOpening
                  ? "none"
                  : "sealPulse 2.5s ease-in-out infinite",
                userSelect: "none",
              }}
            >
              🌸
            </button>
          </div>
        </div>
      )}

      {/* ANA SAYFA */}
      <div
        style={{
          opacity: isOpening ? 1 : 0,
          transition: "opacity 1.2s cubic-bezier(0.34,1.56,0.64,1) 0.5s",
        }}
      >
        {/* MÜZİK BUTONU */}
        <button
          onClick={toggleMusic}
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 10,
            background: "linear-gradient(160deg,#fff 0%,#fff0f5 100%)",
            border: "1.5px solid #f0b8cc",
            borderRadius: "50%",
            width: 44,
            height: 44,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 15px #e090b030",
            fontSize: 16,
            transition: "transform 0.2s",
            display: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          title={isPlaying ? "Müziği Sustur" : "Müziği Başlat"}
        >
          {isPlaying ? "🎵" : "🔇"}
        </button>

        <div
          style={{
            minHeight: "100vh",
            background:
              "linear-gradient(160deg,#fdeef5 0%,#fad8ea 35%,#fce6f1 65%,#f8d0e8 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "44px 24px 40px",
            position: "relative",
            overflow: "hidden",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          {[
            { w: 380, h: 380, top: "-100px", left: "-100px", delay: "0s" },
            { w: 300, h: 300, bottom: "-80px", right: "-80px", delay: "2.5s" },
          ].map((o, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                borderRadius: "50%",
                pointerEvents: "none",
                zIndex: 0,
                width: o.w,
                height: o.h,
                background: "radial-gradient(#f9b8d0,transparent 70%)",
                top: o.top,
                left: o.left,
                bottom: o.bottom,
                right: o.right,
                animation: `orbPulse 5s ease-in-out ${o.delay} infinite`,
              }}
            />
          ))}

          <BalloonCanvas />

          <div
            style={{
              ...z,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: ".28em",
              textTransform: "uppercase",
              color: "#d4789a",
              textAlign: "center",
              marginBottom: 14,
            }}
          >
            ✦ &nbsp; bebek geri sayımı &nbsp; ✦
          </div>

          <img style={{ ...z, width: "20%" }} src={stork} alt="leylek" />

          <h1
            style={{
              ...z,
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(44px,10vw,62px)",
              lineHeight: 1.2,
              textAlign: "center",
              marginBottom: 4,
              marginTop: 0,
              letterSpacing: 2,
              background:
                "linear-gradient(135deg,#e87aa8 0%,#c2557a 50%,#e896b0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "glowN 3s ease-in-out infinite alternate",
            }}
          >
            Doğa
          </h1>

          <div
            style={{
              ...z,
              fontSize: 13,
              fontWeight: 700,
              color: "#d4789a",
              marginBottom: 6,
              textAlign: "center",
              letterSpacing: ".06em",
            }}
          >
            Dünyaya merhaba demeye geliyor 🌸
          </div>

          <div
            style={{
              ...z,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: "#d890a8",
              marginBottom: 22,
              textAlign: "center",
            }}
          >
            12 · 09 · 2026 · Tahmini Doğum Tarihi
          </div>

          <div
            style={{
              ...z,
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 22,
            }}
          >
            <div
              style={{
                width: 50,
                height: 1.5,
                background:
                  "linear-gradient(90deg,transparent,#f0a8c080,transparent)",
              }}
            />
            <span
              style={{
                fontSize: 18,
                color: "#e87aa8",
                animation: "spin 6s linear infinite",
                display: "inline-block",
              }}
            >
              ✿
            </span>
            <div
              style={{
                width: 50,
                height: 1.5,
                background:
                  "linear-gradient(90deg,transparent,#f0a8c080,transparent)",
              }}
            />
          </div>

          <div
            style={{
              ...z,
              display: "flex",
              gap: 10,
              alignItems: "flex-end",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {time.done ? (
              <div
                style={{
                  fontFamily: "'Nunito',sans-serif",
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#c2557a",
                  textAlign: "center",
                }}
              >
                🎉 Hoş geldin Doğa! 🎉
              </div>
            ) : (
              <>
                <CountUnit value={time.d} label="Gün" />
                <div
                  style={{
                    fontSize: 34,
                    color: "#f0b0c8",
                    paddingBottom: 62,
                    animation: "pulse 1s ease-in-out infinite",
                    fontWeight: 900,
                  }}
                >
                  :
                </div>
                <CountUnit value={time.h} label="Saat" />
                <div
                  style={{
                    fontSize: 34,
                    color: "#f0b0c8",
                    paddingBottom: 62,
                    animation: "pulse 1s ease-in-out infinite",
                    fontWeight: 900,
                  }}
                >
                  :
                </div>
                <CountUnit value={time.m} label="Dakika" />
                <div
                  style={{
                    fontSize: 34,
                    color: "#f0b0c8",
                    paddingBottom: 62,
                    animation: "pulse 1s ease-in-out infinite",
                    fontWeight: 900,
                  }}
                >
                  :
                </div>
                <CountUnit value={time.s} label="Saniye" />
              </>
            )}
          </div>

          <p
            style={{
              ...z,
              marginTop: 24,
              textAlign: "center",
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: 16,
              color: "#c2607a",
              letterSpacing: ".04em",
              lineHeight: 1.7,
            }}
          >
            "Küçük parmaklar, büyük mucizeler."
          </p>
        </div>
      </div>
    </>
  );
}
