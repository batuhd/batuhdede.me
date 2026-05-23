"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";

interface EasterEggItem {
  id: string;
  image_url: string;
  caption: string | null;
  is_active: boolean;
  order_index: number;
}

interface EasterEggConfig {
  secret_code: string;
  display_title: string;
  display_subtitle: string;
  footer_text: string;
}

interface HeartParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  opacity: number;
  color: string;
  wobble: number;
  wobbleSpeed: number;
  rotation: number;
  rotationSpeed: number;
}

function HeartsCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: HeartParticle[] = [];
    const colors = [
      "#ff9eb5",
      "#ffc2d1",
      "#fff0f3",
      "#ffb3c6",
      "#ff758f",
      "#ffffff",
      "#f4c2c2",
      "#e6e6fa",
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createParticle = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 20,
        size: Math.random() * 24 + 12,
        speedY: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.y -= p.speedY;
        p.wobble += p.wobbleSpeed;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.003;

        const x = p.x + Math.sin(p.wobble) * 20;

        ctx.save();
        ctx.translate(x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.font = `${p.size}px serif`;
        ctx.fillStyle = p.color;
        ctx.fillText("❤", 0, 0);
        ctx.restore();

        if (p.opacity <= 0 || p.y < -50) {
          particles.splice(i, 1);
        }
      }

      if (particles.length < 80) {
        createParticle();
        createParticle();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-[110] transition-opacity duration-1000 ${active ? "opacity-100" : "opacity-0"}`}
    />
  );
}

export function EasterEgg() {
  const [sequence, setSequence] = useState("");
  const [show, setShow] = useState(false);
  const [eggs, setEggs] = useState<EasterEggItem[]>([]);
  const [config, setConfig] = useState<EasterEggConfig | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch secret config on mount — no hardcoded strings
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = (await supabase
          ?.from("easter_egg_config")
          .select("*")
          .limit(1)
          .single()) ?? { data: null, error: null };

        if (error) {
          console.error("Easter egg config fetch error:", error);
        } else if (data) {
          setConfig(data as EasterEggConfig);
        }
      } catch (e) {
        console.error("Easter egg config exception:", e);
      }
    };

    fetchConfig();
  }, []);

  // Fetch photos only when triggered
  useEffect(() => {
    if (!show) return;

    const fetchEggs = async () => {
      setLoading(true);
      try {
        const { data, error } = (await supabase
          ?.from("easter_eggs")
          .select("*")
          .eq("is_active", true)
          .order("order_index", { ascending: true })) ?? {
          data: null,
          error: null,
        };

        if (error) {
          console.error("Easter eggs fetch error:", error);
        } else if (data) {
          setEggs(data as EasterEggItem[]);
        }
      } catch (e) {
        console.error("Easter eggs fetch exception:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchEggs();
  }, [show]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!config?.secret_code) return; // Config yoksa çalışma

      if (show) {
        if (e.key === "Escape") {
          setShow(false);
          setSequence("");
        }
        return;
      }

      const key = e.key.toLowerCase();
      if (key.length !== 1 || !/[a-z0-9]/.test(key)) return;

      const next = sequence + key;
      if (config.secret_code.startsWith(next)) {
        setSequence(next);
        if (next === config.secret_code) {
          setShow(true);
          setSequence("");
        }
      } else {
        if (key === config.secret_code[0]) {
          setSequence(key);
        } else {
          setSequence("");
        }
      }
    },
    [sequence, show, config],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!show) return null;

  return (
    <>
      <HeartsCanvas active={show} />
      <div
        className="fixed inset-0 z-[105] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={() => setShow(false)}
      >
        <div
          className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-pink-200/30 bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-pink-950/40 dark:via-background dark:to-rose-950/40 shadow-2xl animate-in fade-in zoom-in-95 duration-500"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-pink-100/50 bg-white/50 dark:bg-black/20 backdrop-blur-md px-6 py-4 rounded-t-3xl">
            <div className="text-center w-full">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent tracking-wide">
                {config?.display_title || "Sürpriz"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1 font-medium">
                {config?.display_subtitle || "❤️"}
              </p>
            </div>
            <button
              onClick={() => setShow(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-rose-100 hover:text-rose-600 transition-colors"
              aria-label="Kapat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Gallery */}
          <div className="p-6 sm:p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-300 border-t-rose-600" />
                <p className="text-sm">Fotoğraflar yükleniyor...</p>
              </div>
            ) : eggs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                💙💙💙
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {eggs.map((egg, idx: number) => (
                  <div
                    key={egg.id}
                    className="group relative bg-white dark:bg-zinc-900 p-3 pb-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    style={{
                      transform: `rotate(${idx % 2 === 0 ? -1.5 : 1.5}deg)`,
                    }}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={egg.image_url}
                        alt={egg.caption || config?.display_subtitle || ""}
                        loading="lazy"
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    {egg.caption && (
                      <p className="mt-3 text-center text-sm font-medium text-rose-600 dark:text-rose-300 px-2 line-clamp-3">
                        {egg.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-pink-100/50 px-6 py-4 text-center">
            <p className="text-xs text-muted-foreground">
              {config?.footer_text || ""}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
