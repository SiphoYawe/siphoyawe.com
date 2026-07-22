"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * The hero rays as a real shader (Priority 2): a fragment-shader azure
 * god-ray fan on a low-res WebGL canvas behind the wordmark. Raw WebGL1, zero
 * dependencies (a fullscreen quad; no 3D scene, no library). Rays fan from
 * the top-left, drift and breathe slowly, a whisper of Or only on the lead
 * beam's edge, fine grain to kill banding, and a gentle pointer parallax.
 *
 * Fallbacks: prefers-reduced-motion or no WebGL → a static azure gradient.
 * The render loop pauses off-screen and on hidden tabs. Low-res buffer
 * (~55% of CSS pixels) keeps fill cost and LCP impact near zero.
 */

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uDark;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  float aspect = uRes.x / uRes.y;

  /* fan origin: just off the top-left corner, nudged by the pointer */
  vec2 o = vec2(-0.10, 1.08) + uMouse * vec2(0.045, 0.028);
  vec2 p = vec2((uv.x - o.x) * aspect, uv.y - o.y);
  float dist = length(p);
  float ang = atan(p.y, p.x); /* 0 = right, -1.57 = straight down */

  float t = uTime * 0.055;
  float a = ang + sin(t * 0.7) * 0.014; /* slow angular drift */

  float beams =
      pow(max(0.0, sin(a * 8.0 + 1.2 + t)), 3.0) * 0.52
    + pow(max(0.0, sin(a * 15.0 - 0.7 - t * 1.35)), 5.0) * 0.33
    + pow(max(0.0, sin(a * 27.0 + 2.2 + t * 0.85)), 7.0) * 0.22;

  /* breathing, and confine the fan between right and down */
  beams *= 0.84 + 0.16 * sin(uTime * 0.4);
  beams *= smoothstep(0.35, -0.15, ang) * smoothstep(-1.75, -1.35, ang);

  float rays = beams * exp(-dist * 0.82);

  vec3 azure = mix(vec3(0.169, 0.365, 0.949), vec3(0.365, 0.512, 1.0), uDark);
  vec3 gold = vec3(0.988, 0.867, 0.035);
  /* warmth: only the crest of the lead beam, and only a whisper */
  float lead = pow(max(0.0, sin(a * 8.0 + 1.2 + t)), 6.0);
  vec3 col = mix(azure, gold, clamp(lead * 0.28, 0.0, 0.28));

  /* grain */
  col += (hash(gl_FragCoord.xy + fract(uTime) * 7.0) - 0.5) * 0.032;

  float alpha = clamp(rays * mix(0.95, 0.8, uDark), 0.0, 1.0);
  /* premultiplied output */
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

function createGl(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const loc = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  return {
    gl,
    u: {
      res: gl.getUniformLocation(prog, "uRes"),
      time: gl.getUniformLocation(prog, "uTime"),
      mouse: gl.getUniformLocation(prog, "uMouse"),
      dark: gl.getUniformLocation(prog, "uDark"),
    },
  };
}

/** Static azure gradient: the reduced-motion / no-WebGL stand-in. */
function BaseRays({ hidden }: { hidden: boolean }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 transition-opacity duration-700"
      style={{ opacity: hidden ? 0 : 1 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(130%_95%_at_-6%_-4%,rgb(43_93_242/0.34)_0%,rgb(43_93_242/0.12)_38%,transparent_62%)] dark:bg-[radial-gradient(130%_95%_at_-6%_-4%,rgb(92_130_255/0.3)_0%,rgb(92_130_255/0.1)_38%,transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_2%_0%,rgb(252_221_9/0.07)_0%,transparent_70%)]" />
    </div>
  );
}

export function RayShader() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [glActive, setGlActive] = useState(false);
  const [glFailed, setGlFailed] = useState(false);

  useEffect(() => {
    if (reduce) return; // static gradient stays, canvas never initialises
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = createGl(canvas);
    if (!ctx) {
      setGlFailed(true);
      return;
    }
    const { gl, u } = ctx;

    const SCALE = 0.55; /* low-res buffer, upscaled by CSS */
    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * SCALE));
      const h = Math.max(1, Math.round(canvas.clientHeight * SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth - 0.5;
      mouse.ty = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      /* eased pointer follow, spring-ish */
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, (now - start) / 1000);
      gl.uniform2f(u.mouse, mouse.x, mouse.y);
      gl.uniform1f(u.dark, document.documentElement.classList.contains("dark") ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      setGlActive((was) => (was ? was : true));
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // The theme is read per-frame from the DOM class; no re-init needed.
  }, [reduce]);

  /* One DOM shape for server and client (no hydration mismatch): the static
     gradient is the base layer; the shader canvas paints over it once the GL
     context is alive. Reduced motion and no-WebGL leave the gradient alone. */
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <BaseRays hidden={glActive} />
      {!glFailed && <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />}
      {/* blend the fan into the room */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-canvas via-canvas/70 to-transparent" />
    </div>
  );
}
