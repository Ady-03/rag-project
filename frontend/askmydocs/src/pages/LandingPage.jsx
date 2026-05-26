import { useState, useEffect, useRef } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import "./LandingPage.css";

// ── ANIMATED LOGO COMPONENT ──
function NeuralLogo() {
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const cdotRef = useRef(null);
  const cringRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const stage = stageRef.current;
    const cdot = cdotRef.current;
    const cring = cringRef.current;

    const W = 180, H = 180, CX = 90, CY = 85;
    let mouse = { x: CX, y: CY };
    let smooth = { x: CX, y: CY };
    let inside = false;
    let pulseT = 0;
    let phase = "idle";
    let phaseTimer = 0;
    let lastTs = 0;
    let animId;

    const HOLD = 2600, COLLAPSE = 420, REVEAL = 500;

    const baseNodes = [
      { bx: 0,   by: -38 },
      { bx: -34, by: -12 },
      { bx: 34,  by: -12 },
      { bx: -22, by: 26  },
      { bx: 22,  by: 26  },
      { bx: 0,   by: 52  },
    ];

    const edges = [[0,1],[0,2],[1,2],[1,3],[2,4],[3,4],[3,5],[4,5],[1,4],[0,4]];

    const easeIn = t => t * t * t;
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function draw(ts) {
      animId = requestAnimationFrame(draw);
      const dt = Math.min(ts - lastTs, 60);
      lastTs = ts;
      pulseT += dt * 0.0018;
      phaseTimer += dt;

      if (phase === "idle" && phaseTimer > HOLD) { phase = "collapse"; phaseTimer = 0; }
      if (phase === "collapse" && phaseTimer > COLLAPSE) { phase = "reveal"; phaseTimer = 0; }
      if (phase === "reveal" && phaseTimer > REVEAL) { phase = "idle"; phaseTimer = 0; }

      const collapseScale = phase === "collapse" ? 1 - easeIn(phaseTimer / COLLAPSE)
                          : phase === "reveal"   ? easeOut(phaseTimer / REVEAL)
                          : 1;
      const collapseAlpha = phase === "collapse" ? 1 - easeIn(phaseTimer / COLLAPSE) * 0.9
                          : phase === "reveal"   ? easeOut(phaseTimer / REVEAL)
                          : 1;

      smooth.x += (mouse.x - smooth.x) * 0.08;
      smooth.y += (mouse.y - smooth.y) * 0.08;

      const ox = (smooth.x - CX) * 0.22;
      const oy = (smooth.y - CY) * 0.18;
      const tiltX = (smooth.y - CY) / CY * 14;
      const tiltY = (smooth.x - CX) / CX * -14;

      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(CX + ox * 0.3, CY + oy * 0.3 + 5);

      const skX = tiltY * 0.004;
      const skY = tiltX * 0.004;
      ctx.transform(collapseScale, skY * collapseScale, skX * collapseScale, collapseScale, 0, 0);
      ctx.globalAlpha = collapseAlpha;

      const docW = 56, docH = 68, docX = -docW / 2, docY = -docH / 2 - 4;
      const cornerCut = 12;
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(docX + cornerCut, docY);
      ctx.lineTo(docX + docW, docY);
      ctx.lineTo(docX + docW, docY + docH);
      ctx.lineTo(docX, docY + docH);
      ctx.lineTo(docX, docY + cornerCut);
      ctx.closePath();
      ctx.stroke();

      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(docX, docY + cornerCut);
      ctx.lineTo(docX + cornerCut, docY + cornerCut);
      ctx.lineTo(docX + cornerCut, docY);
      ctx.stroke();

      const nodes = baseNodes.map((n, i) => {
        const pulse = Math.sin(pulseT * 1.4 + i * 1.1) * (inside ? 3.5 : 1.8);
        return {
          x: n.bx + ox * 0.55 + pulse * 0.15,
          y: n.by + oy * 0.45 + pulse * 0.1,
        };
      });

      edges.forEach(([a, b]) => {
        const na = nodes[a], nb = nodes[b];
        const pulse2 = (Math.sin(pulseT * 2.2 + a * 0.7 + b * 0.5) + 1) / 2;
        ctx.strokeStyle = `rgba(124,58,237,${0.15 + pulse2 * 0.2})`;
        ctx.lineWidth = 0.8 + pulse2 * 0.6;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();
      });

      nodes.forEach((n, i) => {
        const pulse3 = (Math.sin(pulseT * 1.8 + i * 0.9) + 1) / 2;
        const r = i === 0 ? 6.5 : 4.5;
        const glowR = r + 6 + pulse3 * 4;

        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
        grad.addColorStop(0, `rgba(124,58,237,${0.35 + pulse3 * 0.2})`);
        grad.addColorStop(1, "rgba(124,58,237,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = i === 0 ? "#a78bfa" : "#7c3aed";
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();

        if (i === 0) {
          ctx.strokeStyle = "rgba(167,139,250,0.5)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      const prog = (pulseT * 0.6) % 1;
      const fromNode = nodes[0], toNode = nodes[5];
      const px = fromNode.x + (toNode.x - fromNode.x) * prog;
      const py = fromNode.y + (toNode.y - fromNode.y) * prog;
      ctx.fillStyle = `rgba(167,139,250,${0.7 - prog * 0.5})`;
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    const handleEnter = () => {
      inside = true;
      cdot.style.opacity = "1";
      cring.style.opacity = "1";
      stage.style.cursor = "none";
    };
    const handleLeave = () => {
      inside = false;
      cdot.style.opacity = "0";
      cring.style.opacity = "0";
      mouse = { x: CX, y: CY };
    };
    const handleMove = (e) => {
      const r = stage.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      mouse = { x: mx, y: my };
      cdot.style.left = mx + "px";
      cdot.style.top = my + "px";
      cring.style.left = mx + "px";
      cring.style.top = my + "px";
    };

    stage.addEventListener("mouseenter", handleEnter);
    stage.addEventListener("mouseleave", handleLeave);
    stage.addEventListener("mousemove", handleMove);

    animId = requestAnimationFrame(ts => { lastTs = ts; requestAnimationFrame(draw); });

    return () => {
      cancelAnimationFrame(animId);
      stage.removeEventListener("mouseenter", handleEnter);
      stage.removeEventListener("mouseleave", handleLeave);
      stage.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <div className="logo-stage" ref={stageRef}>
      <canvas ref={canvasRef} id="logo-canvas" width="180" height="180" />
      <div className="cursor-dot" ref={cdotRef} style={{ opacity: 0 }} />
      <div className="cursor-ring" ref={cringRef} style={{ opacity: 0 }} />
    </div>
  );
}

// ── MAIN LANDING PAGE ──
function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.r = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.4 + 0.1;
        this.color = Math.random() > 0.6 ? "#7c3aed" : Math.random() > 0.5 ? "#14b8a6" : "#6366f1";
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    const particles = Array.from({ length: 120 }, () => new Particle());

    const animate = () => {
      animId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(99,102,241,0.04)";
      ctx.lineWidth = 1;
      const gSize = 60;
      for (let x = 0; x < canvas.width; x += gSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, r: 250, c: "rgba(124,58,237,0.07)" },
        { x: canvas.width * 0.75, y: canvas.height * 0.6, r: 200, c: "rgba(20,184,166,0.05)" },
        { x: canvas.width * 0.5, y: canvas.height * 0.15, r: 180, c: "rgba(99,102,241,0.06)" },
      ].forEach(n => {
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        grad.addColorStop(0, n.c);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${0.12 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => { p.update(); p.draw(); });
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleGoogle = async () => {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (err) {
    setError(err.message);
  }
};

  const handleSubmit = async () => {
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="landing-root">
      <canvas ref={canvasRef} className="landing-canvas" />

      <div className="landing-page">
        {/* LEFT */}
        <div className="landing-left">

          {/* ── TOP-RIGHT BRAND BADGE ── */}
          <div className="left-brand">
            <div className="left-brand-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <span className="left-brand-name">Ask<span>My</span>Docs</span>
          </div>

          <div className="badge">✦ Powered by RAG + LLaMA 3</div>
          <h1 className="hero-title">Ask anything.<br /><em>Get precise answers.</em></h1>
          <p className="hero-sub">
            Upload your documents and get instant, accurate answers with source references.{" "}
            <strong>No hallucinations</strong> — just facts from your files.
          </p>
          <div className="features">
            <div className="feature-card">
              <div className="feature-icon icon-purple">🔍</div>
              <div>
                <div className="feature-title">Semantic Search</div>
                <div className="feature-desc">Finds meaning, not just keywords — understands your intent deeply</div>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon icon-teal">⚡</div>
              <div>
                <div className="feature-title">Source References</div>
                <div className="feature-desc">Every answer cites the exact passage it came from</div>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon icon-amber">🔒</div>
              <div>
                <div className="feature-title">Private & Secure</div>
                <div className="feature-desc">Your documents stay in your account, always encrypted</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="landing-right">
          <div className="auth-card">
            <div className="logo-wrap">
              <NeuralLogo />
              <div className="wordmark">
                <span className="wm-ask">Ask</span>
                <span className="wm-my">My</span>
                <span className="wm-docs">Docs</span>
              </div>
            </div>

            <h2 className="auth-heading">Get started</h2>
            <p className="auth-subtext">Sign in or create your account</p>

            <div className="tab-row">
              <button className={`tab ${isLogin ? "active" : ""}`} onClick={() => setIsLogin(true)}>Sign in</button>
              <button className={`tab ${!isLogin ? "active" : ""}`} onClick={() => setIsLogin(false)}>Register</button>
            </div>

            <button className="google-btn" onClick={handleGoogle}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or</span>
              <div className="divider-line" />
            </div>

            <div className="field">
              <label>Email address</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button className="submit-btn" onClick={handleSubmit}>
              <span>{isLogin ? "Sign in →" : "Create account →"}</span>
            </button>

            <p className="register-link">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Register here" : "Sign in"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;