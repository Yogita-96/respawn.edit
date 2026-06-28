import { useState, useRef, useCallback, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --black: #0a0a0f; --slate: #13131a; --slate2: #1e1e2e; --border: #2a2a3a;
    --violet: #7c3aed; --violet-soft: #9d5ffa; --coral: #ff4757;
    --white: #f0ede8; --muted: #8888a0; --green: #22d3a0; --amber: #f59e0b;
  }
  body { background: var(--black); color: var(--white); font-family: 'Inter', sans-serif; }

  /* APP GRID */
  .app { display: grid; grid-template-columns: 220px 1fr 340px; grid-template-rows: 56px 1fr; height: 100vh; overflow: hidden; }

  /* TOPBAR */
  .topbar { grid-column: 1/-1; background: var(--slate); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 20px; gap: 12px; }
  .logo { font-family: 'Space Grotesk',sans-serif; font-weight: 700; font-size: 18px; letter-spacing: -0.5px; display: flex; align-items: center; gap: 8px; }
  .logo-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--violet); box-shadow: 0 0 8px var(--violet); animation: pulse-dot 2s ease-in-out infinite; }
  @keyframes pulse-dot { 0%,100% { box-shadow: 0 0 8px var(--violet); } 50% { box-shadow: 0 0 16px var(--violet-soft); } }
  .logo-tag { font-size: 10px; font-weight: 500; letter-spacing: 1.5px; color: var(--muted); text-transform: uppercase; margin-left: 4px; }
  .topbar-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
  .hamburger { display: none; background: none; border: 1px solid var(--border); color: var(--white); border-radius: 6px; padding: 4px 10px; font-size: 16px; cursor: pointer; }
  .api-badge { font-size: 11px; padding: 4px 10px; border-radius: 20px; border: 1px solid var(--border); color: var(--muted); cursor: pointer; transition: all 0.2s; font-family: 'Space Grotesk',sans-serif; }
  .api-badge:hover { border-color: var(--violet); color: var(--violet-soft); }
  .api-badge.connected { border-color: var(--green); color: var(--green); }

  /* SIDEBAR */
  .sidebar { background: var(--slate); border-right: 1px solid var(--border); padding: 20px 0; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
  .sidebar-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); padding: 0 20px; margin: 12px 0 6px; font-family: 'Space Grotesk',sans-serif; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 20px; cursor: pointer; font-size: 13px; color: var(--muted); transition: all 0.15s; border-left: 2px solid transparent; font-family: 'Space Grotesk',sans-serif; font-weight: 500; }
  .nav-item:hover { color: var(--white); background: var(--slate2); }
  .nav-item.active { color: var(--white); border-left-color: var(--violet); background: var(--slate2); }
  .nav-icon { font-size: 16px; width: 20px; text-align: center; }
  .sidebar-footer { margin-top: auto; padding: 0 20px 8px; }

  /* WORKSPACE */
  .workspace { background: var(--black); overflow-y: auto; padding: 28px; display: flex; flex-direction: column; gap: 20px; }
  .section-title { font-family: 'Space Grotesk',sans-serif; font-size: 22px; font-weight: 600; letter-spacing: -0.5px; }
  .section-sub { font-size: 13px; color: var(--muted); margin-top: 4px; line-height: 1.5; }

  /* UPLOAD */
  .upload-zone { border: 1.5px dashed var(--border); border-radius: 12px; padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; background: var(--slate); }
  .upload-zone:hover, .upload-zone.dragover { border-color: var(--violet); background: rgba(124,58,237,0.06); }
  .upload-icon { font-size: 32px; margin-bottom: 10px; }
  .upload-text { font-family: 'Space Grotesk',sans-serif; font-size: 14px; font-weight: 500; margin-bottom: 4px; }
  .upload-sub { font-size: 12px; color: var(--muted); }
  .upload-types { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
  .type-pill { font-size: 10px; padding: 3px 8px; border-radius: 4px; border: 1px solid var(--border); color: var(--muted); font-family: 'Space Grotesk',sans-serif; }
  .type-pill.video { border-color: rgba(124,58,237,0.4); color: var(--violet-soft); }
  .type-pill.image { border-color: rgba(245,158,11,0.4); color: var(--amber); }

  /* MEDIA TRAY */
  .tray-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .tray-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); font-family: 'Space Grotesk',sans-serif; }
  .add-more-btn { font-size: 11px; color: var(--violet-soft); background: none; border: 1px solid rgba(124,58,237,0.3); border-radius: 6px; padding: 4px 10px; cursor: pointer; font-family: 'Space Grotesk',sans-serif; position: relative; }
  .media-list { display: flex; flex-direction: column; gap: 8px; }
  .media-item { background: var(--slate); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
  .media-item.is-video { border-left: 3px solid var(--violet); }
  .media-item.is-image { border-left: 3px solid var(--amber); }
  .media-item-header { display: flex; align-items: center; gap: 10px; padding: 10px 12px; cursor: pointer; }
  .media-thumb { width: 48px; height: 36px; border-radius: 5px; object-fit: cover; flex-shrink: 0; }
  .media-thumb-video { width: 48px; height: 36px; border-radius: 5px; background: var(--slate2); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .media-info { flex: 1; min-width: 0; }
  .media-name { font-size: 12px; font-weight: 500; font-family: 'Space Grotesk',sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .media-meta { display: flex; align-items: center; gap: 6px; margin-top: 2px; }
  .media-badge { font-size: 9px; padding: 1px 6px; border-radius: 3px; font-family: 'Space Grotesk',sans-serif; font-weight: 600; text-transform: uppercase; }
  .media-badge.video { background: rgba(124,58,237,0.2); color: var(--violet-soft); }
  .media-badge.image { background: rgba(245,158,11,0.2); color: var(--amber); }
  .media-size { font-size: 10px; color: var(--muted); }
  .media-role-select { font-size: 11px; background: var(--slate2); border: 1px solid var(--border); border-radius: 5px; color: var(--muted); padding: 3px 6px; font-family: 'Space Grotesk',sans-serif; cursor: pointer; outline: none; }
  .media-remove { font-size: 11px; color: var(--coral); background: none; border: none; cursor: pointer; padding: 4px; flex-shrink: 0; }
  .media-preview-expand { border-top: 1px solid var(--border); padding: 12px; background: var(--black); }
  .media-preview-expand video { width: 100%; max-height: 200px; border-radius: 6px; object-fit: contain; background: #000; display: block; }
  .media-preview-expand img { width: 100%; max-height: 200px; border-radius: 6px; object-fit: contain; display: block; }
  .img-intent-input { margin-top: 10px; width: 100%; background: var(--slate); border: 1px solid var(--border); border-radius: 7px; padding: 9px 12px; color: var(--white); font-size: 12px; font-family: 'Inter',sans-serif; outline: none; }
  .img-intent-input::placeholder { color: var(--muted); }

  /* DURATION TABS */
  .tab-row { display: flex; gap: 6px; flex-wrap: wrap; }
  .tab { padding: 7px 14px; border-radius: 8px; font-size: 12px; font-family: 'Space Grotesk',sans-serif; font-weight: 500; cursor: pointer; border: 1px solid var(--border); color: var(--muted); background: none; transition: all 0.15s; }
  .tab:hover { border-color: var(--violet-soft); color: var(--violet-soft); }
  .tab.active { background: var(--violet); border-color: var(--violet); color: white; }

  /* INTENT BOX */
  .intent-box { background: var(--slate); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .intent-label { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); font-family: 'Space Grotesk',sans-serif; }
  .intent-input-row { display: flex; gap: 8px; align-items: flex-end; }
  .intent-textarea { background: var(--black); border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; color: var(--white); font-size: 14px; font-family: 'Inter',sans-serif; resize: none; outline: none; line-height: 1.6; min-height: 90px; flex: 1; width: 100%; }
  .intent-textarea:focus { border-color: var(--violet); }
  .intent-textarea::placeholder { color: var(--muted); }
  .intent-hint { font-size: 10px; color: var(--muted); text-align: center; font-family: 'Space Grotesk',sans-serif; padding: 2px 0; }
  .quick-prompts { display: flex; flex-wrap: wrap; gap: 6px; }
  .quick-pill { font-size: 11px; padding: 5px 10px; border-radius: 20px; border: 1px solid var(--border); color: var(--muted); cursor: pointer; transition: all 0.15s; font-family: 'Space Grotesk',sans-serif; background: none; }
  .quick-pill:hover { border-color: var(--violet-soft); color: var(--violet-soft); }

  /* VOICE BUTTON */
  .voice-btn { width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid var(--border); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; transition: all 0.2s; flex-shrink: 0; background: var(--slate2); align-self: flex-end; margin-bottom: 2px; }
  .voice-btn:hover { border-color: var(--violet); background: rgba(124,58,237,0.1); }
  .voice-btn.listening { background: rgba(255,71,87,0.15); border-color: var(--coral); animation: vpulse-r 1s ease-in-out infinite; }
  .voice-btn.speaking { background: rgba(124,58,237,0.15); border-color: var(--violet); animation: vpulse-v 1s ease-in-out infinite; }
  @keyframes vpulse-r { 0%,100% { box-shadow: 0 0 0 0 rgba(255,71,87,0.4); } 50% { box-shadow: 0 0 0 8px rgba(255,71,87,0); } }
  @keyframes vpulse-v { 0%,100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.4); } 50% { box-shadow: 0 0 0 8px rgba(124,58,237,0); } }

  /* JARVIS BAR */
  .jarvis-bar { display: flex; align-items: center; gap: 10px; background: var(--slate); border: 1px solid var(--border); border-radius: 10px; padding: 10px 14px; font-size: 12px; font-family: 'Space Grotesk',sans-serif; }
  .jarvis-bar.listening { border-color: var(--coral); background: rgba(255,71,87,0.06); }
  .jarvis-bar.speaking { border-color: var(--violet); background: rgba(124,58,237,0.06); }
  .jarvis-indicator { width: 8px; height: 8px; border-radius: 50%; background: var(--muted); flex-shrink: 0; }
  .jarvis-bar.listening .jarvis-indicator { background: var(--coral); animation: blink 0.6s ease-in-out infinite; }
  .jarvis-bar.speaking .jarvis-indicator { background: var(--violet); animation: blink 0.8s ease-in-out infinite; }
  @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
  .jarvis-text { color: var(--muted); font-size: 12px; }
  .jarvis-bar.listening .jarvis-text { color: var(--coral); }
  .jarvis-bar.speaking .jarvis-text { color: var(--violet-soft); }
  .jarvis-transcript { color: var(--white); font-size: 12px; font-style: italic; opacity: 0.7; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 240px; }
  .waveform { display: flex; align-items: center; gap: 2px; height: 16px; }
  .wave-bar { width: 3px; border-radius: 2px; background: var(--coral); }
  .jarvis-bar.speaking .wave-bar { background: var(--violet-soft); }
  .wave-bar:nth-child(1) { animation: wave 0.8s ease-in-out infinite 0.0s; }
  .wave-bar:nth-child(2) { animation: wave 0.8s ease-in-out infinite 0.1s; }
  .wave-bar:nth-child(3) { animation: wave 0.8s ease-in-out infinite 0.2s; }
  .wave-bar:nth-child(4) { animation: wave 0.8s ease-in-out infinite 0.3s; }
  .wave-bar:nth-child(5) { animation: wave 0.8s ease-in-out infinite 0.4s; }
  @keyframes wave { 0%,100% { height:4px; } 50% { height:14px; } }

  /* RUN BUTTON */
  .run-btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 13px 24px; background: var(--violet); color: white; border: none; border-radius: 10px; font-family: 'Space Grotesk',sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; width: 100%; }
  .run-btn:hover { background: var(--violet-soft); transform: translateY(-1px); }
  .run-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .reel-loader { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--muted); font-family: 'Space Grotesk',sans-serif; }
  .reel { width: 22px; height: 22px; border: 2px solid var(--border); border-top-color: var(--violet); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* CLAUDE PANEL */
  .claude-panel { background: var(--slate); border-left: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
  .panel-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .panel-title { font-family: 'Space Grotesk',sans-serif; font-size: 13px; font-weight: 600; }
  .claude-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--violet); box-shadow: 0 0 6px var(--violet); }
  .panel-body { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .panel-speak-btn { margin-left: auto; font-size: 10px; color: var(--muted); background: none; border: 1px solid var(--border); border-radius: 6px; padding: 3px 8px; cursor: pointer; font-family: 'Space Grotesk',sans-serif; }

  /* OUTPUT CARDS */
  .output-card { background: var(--black); border: 1px solid var(--border); border-radius: 10px; overflow: visible; flex-shrink: 0; }
  .output-card-header { padding: 10px 14px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .output-card-label { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); font-family: 'Space Grotesk',sans-serif; }
  .card-actions { display: flex; gap: 6px; }
  .copy-btn { font-size: 10px; color: var(--muted); cursor: pointer; background: none; border: none; font-family: 'Space Grotesk',sans-serif; }
  .copy-btn:hover { color: var(--violet-soft); }
  .speak-card-btn { font-size: 10px; color: var(--muted); cursor: pointer; background: none; border: none; }
  .output-card-body { padding: 14px; font-size: 13px; line-height: 1.7; white-space: pre-wrap; color: var(--white); word-break: break-word; display: block; width: 100%; }
  .img-output-card { background: var(--black); border: 1px solid rgba(245,158,11,0.25); border-radius: 10px; overflow: visible; flex-shrink: 0; }
  .img-output-header { padding: 10px 14px; border-bottom: 1px solid rgba(245,158,11,0.15); display: flex; align-items: center; gap: 8px; }
  .img-output-label { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--amber); font-family: 'Space Grotesk',sans-serif; }
  .img-output-name { font-size: 10px; color: var(--muted); margin-left: auto; font-family: 'Space Grotesk',sans-serif; }
  .img-sub-label { font-size: 10px; color: var(--muted); margin-bottom: 3px; font-family: 'Space Grotesk',sans-serif; }

  /* PANEL EMPTY */
  .panel-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: var(--muted); text-align: center; padding: 24px; }
  .panel-empty-icon { font-size: 32px; opacity: 0.4; }
  .panel-empty-text { font-size: 13px; font-family: 'Space Grotesk',sans-serif; line-height: 1.5; }
  .no-voice-note { font-size: 11px; color: var(--muted); font-family: 'Space Grotesk',sans-serif; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(4px); }
  .modal { background: var(--slate); border: 1px solid var(--border); border-radius: 16px; padding: 28px; width: 420px; max-width: 90vw; display: flex; flex-direction: column; gap: 16px; }
  .modal-title { font-family: 'Space Grotesk',sans-serif; font-size: 18px; font-weight: 600; }
  .modal-sub { font-size: 13px; color: var(--muted); line-height: 1.6; }
  .modal-input { background: var(--black); border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; color: var(--white); font-size: 13px; font-family: 'Inter',sans-serif; outline: none; width: 100%; }
  .modal-input:focus { border-color: var(--violet); }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
  .btn-ghost { padding: 9px 16px; background: none; border: 1px solid var(--border); border-radius: 8px; color: var(--muted); font-family: 'Space Grotesk',sans-serif; font-size: 13px; cursor: pointer; }
  .btn-ghost:hover { border-color: var(--white); color: var(--white); }
  .btn-primary { padding: 9px 16px; background: var(--violet); border: none; border-radius: 8px; color: white; font-family: 'Space Grotesk',sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; }
  .btn-primary:hover { background: var(--violet-soft); }

  .divider { height: 1px; background: var(--border); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  /* MOBILE */
  @media (max-width: 768px) {
    .app { grid-template-columns: 1fr; grid-template-rows: 56px 1fr auto; height: auto; min-height: 100vh; }
    .hamburger { display: block; }
    .logo-tag { display: none; }
    .topbar { padding: 0 12px; }
    .api-badge { font-size: 10px; padding: 3px 8px; }
    .sidebar {
      display: none; position: fixed; top: 56px; left: 0; right: 0;
      z-index: 50; flex-direction: column; padding: 12px; gap: 6px;
      border-right: none; border-bottom: 1px solid var(--border);
    }
    .sidebar.sidebar-open { display: flex; }
    .sidebar-label { display: none; }
    .sidebar-footer { display: none; }
    .nav-item { padding: 12px 16px; border-left: none !important; border-radius: 8px; border: 1px solid var(--border); font-size: 13px; background: var(--slate2); }
    .nav-item.active { border-color: var(--violet) !important; background: rgba(124,58,237,0.15); }
    .workspace { padding: 16px; grid-row: 2; }
    .claude-panel { grid-row: 3; border-left: none; border-top: 1px solid var(--border); max-height: 70vh; }
  }
`;

const MODES = [
  { id: "instagram", label: "Instagram Mode", icon: "◈", sub: "Optimise any video for Reels — hooks, captions, trim suggestions.", quickPrompts: ["Write a scroll-stopping hook","Trim to 30s Reel","Generate 5 hashtags","Write caption with CTA","Suggest best 15s clip"], placeholder: "Describe what you want, or hit the mic and just say it..." },
  { id: "gamer", label: "Gamer Mode", icon: "◉", sub: "Built for game clips, devlogs, and gamedev content. Claude speaks your language.", quickPrompts: ["Write a gaming hook","Turn into a highlight reel","Write devlog caption","Add POV opening line","Suggest clip timestamps"], placeholder: "Describe what you want, or hit the mic and just say it..." },
  { id: "captions", label: "Caption Studio", icon: "◧", sub: "Generate captions, subtitles, and on-screen text for any video.", quickPrompts: ["Write full caption with hook","Generate subtitle text","Write on-screen text","Add opening title card","Write end screen CTA"], placeholder: "Describe what you want, or hit the mic and just say it..." },
];

const IMAGE_ROLES = ["Intro Card","Outro Card","Overlay","Thumbnail","Background","Other"];
const DURATION_TABS = ["15s","30s","60s","90s","Custom"];
const JARVIS = {
  ready: "Systems online. Upload your media and tell me what you need.",
  listening: "Listening.",
  processing: "Running it through Claude now.",
  done: "Done. Your content package is ready.",
  noKey: "Connect your Claude API key first.",
};

function formatBytes(b) {
  if (b < 1024*1024) return `${(b/1024).toFixed(0)} KB`;
  return `${(b/(1024*1024)).toFixed(1)} MB`;
}

function safeStr(val) {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (Array.isArray(val)) return val.map(safeStr).join("\n");
  if (typeof val === "object") {
    const text = val.text || val.content || val.note || val.description || val.overlay || "";
    const time = val.startTime ? val.startTime + " — " : val.timing ? val.timing + " — " : "";
    return text ? time + text : Object.values(val).map(String).join(" — ");
  }
  return String(val);
}

function buildPrompt(mode, intent, duration, items) {
  const video = items.find(i => i.type === "video");
  const images = items.filter(i => i.type === "image");
  const fileCtx = video ? `\nVideo: "${video.file.name}"` : "";
  const durCtx = duration ? `\nTarget duration: ${duration}` : "";
  const imgCtx = images.length ? `\nImages: ${images.map(i => `"${i.file.name}" role=${i.role}${i.intent ? ` note="${i.intent}"` : ""}`).join(", ")}` : "";
  const base = `You are an expert social media video editor.${fileCtx}${durCtx}${imgCtx}\nUser intention: ${intent}\n\n`;
  const imgOut = images.length ? `\n- imageOutputs: array, one per image: { fileName, overlayText, placement, altCaption }` : "";
  const strNote = "\nIMPORTANT: All array values must be plain strings only, never objects.";

  if (mode === "instagram") return base + `Return ONLY JSON:\n- hook (string, under 10 words)\n- caption (string, 150-200 words with CTA)\n- hashtags (array of 10 strings, no #)\n- trimSuggestion (string)\n- onScreenText (array of 2-3 strings)${imgOut}${strNote}\nPure JSON only.`;
  if (mode === "gamer") return base + `Return ONLY JSON:\n- hook (string, dramatic, under 10 words)\n- caption (string, gaming-style, 150 words)\n- hashtags (array of 10 strings, no #)\n- trimSuggestion (string)\n- devlogNote (string or null)\n- onScreenText (array of 2-3 strings)${imgOut}${strNote}\nPure JSON only.`;
  if (mode === "captions") return base + `Return ONLY JSON:\n- subtitleScript (string)\n- onScreenOverlays (array of strings with timing e.g. "0:03 — text here")\n- titleCard (string)\n- endScreen (string)${imgOut}${strNote}\nPure JSON only.`;
}

function jarvisSpeak(text, onStart, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.95; utter.pitch = 0.85; utter.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const pref = voices.find(v => v.name.includes("Daniel") || v.name.includes("Google UK") || v.name.includes("Alex"));
  if (pref) utter.voice = pref;
  utter.onstart = onStart;
  utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
}

function OutputCards({ data, onSpeak }) {
  const [copied, setCopied] = useState(null);
  const copy = (key, val) => {
    navigator.clipboard.writeText(Array.isArray(val) ? val.join("  ") : String(val || ""));
    setCopied(key); setTimeout(() => setCopied(null), 1500);
  };

  const cards = [
    data.hook && { key:"hook", label:"Hook", text: String(data.hook || "") },
    data.caption && { key:"caption", label:"Caption", text: String(data.caption || "") },
    data.hashtags && { key:"hashtags", label:"Hashtags", text: Array.isArray(data.hashtags) ? data.hashtags.map(h=>`#${safeStr(h)}`).join("  ") : safeStr(data.hashtags) },
    data.trimSuggestion && { key:"trim", label:"Trim Suggestion", text: String(data.trimSuggestion || "") },
    data.onScreenText && { key:"onscreen", label:"On-Screen Text", text: Array.isArray(data.onScreenText) ? data.onScreenText.map(safeStr).join("\n") : String(data.onScreenText || "") },
    data.devlogNote && { key:"devlog", label:"Devlog Note", text: safeStr(data.devlogNote) },
    data.subtitleScript && { key:"subs", label:"Subtitle Script", text: safeStr(data.subtitleScript) },
    data.onScreenOverlays && { key:"overlays", label:"On-Screen Overlays", text: Array.isArray(data.onScreenOverlays) ? data.onScreenOverlays.map(safeStr).join("\n") : safeStr(data.onScreenOverlays) },
    data.titleCard && { key:"title", label:"Title Card", text: safeStr(data.titleCard) },
    data.endScreen && { key:"end", label:"End Screen CTA", text: safeStr(data.endScreen) },
  ].filter(Boolean);

  return (
    <>
      {cards.map(({key, label, text}) => (
        <div key={key} className="output-card">
          <div className="output-card-header">
            <span className="output-card-label">{label}</span>
            <div className="card-actions">
              <button className="speak-card-btn" onClick={() => onSpeak(text)}>🔊</button>
              <button className="copy-btn" onClick={() => copy(key, text)}>{copied===key ? "✓" : "Copy"}</button>
            </div>
          </div>
          <div className="output-card-body">{text}</div>
        </div>
      ))}
      {data.imageOutputs?.length > 0 && (
        <>
          <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"var(--amber)",fontFamily:"Space Grotesk",marginTop:4}}>Image Suggestions</div>
          {data.imageOutputs.map((img,i) => (
            <div key={i} className="img-output-card">
              <div className="img-output-header">
                <span className="img-output-label">◆ Image</span>
                <span className="img-output-name">{img.fileName}</span>
              </div>
              <div className="output-card-body" style={{display:"flex",flexDirection:"column",gap:10}}>
                {img.overlayText && <div><div className="img-sub-label">OVERLAY TEXT</div><div style={{fontWeight:500,color:"var(--white)"}}>{safeStr(img.overlayText)}</div></div>}
                {img.placement && <div><div className="img-sub-label">PLACEMENT</div><div style={{color:"var(--white)"}}>{safeStr(img.placement)}</div></div>}
                {img.altCaption && <div><div className="img-sub-label">IF POSTED STANDALONE</div><div style={{color:"var(--muted)",fontSize:12}}>{safeStr(img.altCaption)}</div></div>}
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}

export default function RespawnEdit() {
  const [activeMode, setActiveMode] = useState("instagram");
  const [items, setItems] = useState([]);
  const [intent, setIntent] = useState("");
  const [duration, setDuration] = useState("30s");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [voiceState, setVoiceState] = useState("idle");
  const [voiceText, setVoiceText] = useState("");
  const [transcript, setTranscript] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(true);

  const fileRef = useRef();
  const addRef = useRef();
  const recognitionRef = useRef();
  const mode = MODES.find(m => m.id === activeMode);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) setVoiceSupported(false);
    if (window.speechSynthesis) window.speechSynthesis.getVoices();
  }, []);

  const speak = useCallback((text, onDone) => {
    setVoiceState("speaking"); setVoiceText(text);
    jarvisSpeak(text, () => {}, () => { setVoiceState("idle"); setVoiceText(""); if (onDone) onDone(); });
  }, []);

  const handleFileInput = useCallback((e) => {
    if (e.target.files?.length) {
      const next = Array.from(e.target.files).map(f => ({
        id: Math.random().toString(36).slice(2), file: f,
        type: f.type.startsWith("video/") ? "video" : "image",
        url: URL.createObjectURL(f),
        role: f.type.startsWith("video/") ? "Main Video" : "Overlay",
        intent: "", expanded: false,
      }));
      setItems(p => [...p, ...next]);
      setOutput(null);
      e.target.value = "";
    }
  }, []);

  const addFiles = useCallback((files) => {
    const next = Array.from(files).map(f => ({
      id: Math.random().toString(36).slice(2), file: f,
      type: f.type.startsWith("video/") ? "video" : "image",
      url: URL.createObjectURL(f),
      role: f.type.startsWith("video/") ? "Main Video" : "Overlay",
      intent: "", expanded: false,
    }));
    setItems(p => [...p, ...next]);
    setOutput(null);
  }, []);

  const update = (id, patch) => setItems(p => p.map(i => i.id===id ? {...i,...patch} : i));
  const remove = (id) => { setItems(p => p.filter(i => i.id!==id)); setOutput(null); };
  const toggle = (id) => setItems(p => p.map(i => i.id===id ? {...i,expanded:!i.expanded} : i));

  const startListening = useCallback(() => {
    if (!voiceSupported || !apiKey) { if (!apiKey) speak(JARVIS.noKey); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = false; rec.interimResults = true; rec.lang = "en-US";
    rec.onstart = () => { setVoiceState("listening"); setTranscript(""); };
    rec.onresult = (e) => {
      const cur = Array.from(e.results).map(r => r[0].transcript).join("");
      setTranscript(cur);
      if (e.results[e.results.length-1].isFinal) setIntent(cur);
    };
    rec.onend = () => { setVoiceState("idle"); setTranscript(""); };
    rec.onerror = () => { setVoiceState("idle"); setTranscript(""); };
    recognitionRef.current = rec;
    rec.start();
  }, [voiceSupported, apiKey, speak]);

  const handleVoiceBtn = () => {
    if (voiceState === "listening") { recognitionRef.current?.stop(); return; }
    if (voiceState === "speaking") { window.speechSynthesis?.cancel(); setVoiceState("idle"); return; }
    startListening();
  };

  const handleRun = async () => {
    if (!intent.trim()) return;
    if (!apiKey) { setShowModal(true); return; }
    setLoading(true); setOutput(null); setError(null);
    speak(JARVIS.processing);
    try {
      const res = await fetch("http://localhost:3001/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          model: "claude-sonnet-4-6", max_tokens: 1000,
          system: "You are a social media video editor AI. Always respond with pure JSON only, no markdown, no backticks. All array values must be plain strings, never objects.",
          messages: [{ role: "user", content: buildPrompt(activeMode, intent, duration, items) }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text||"").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      setOutput(parsed);
      speak(JARVIS.done);
    } catch {
      setError("Something went wrong. Check your API key or try again.");
      speak("Something went wrong.");
    } finally { setLoading(false); }
  };

  const voiceBtnIcon = voiceState==="listening" ? "⏹" : voiceState==="speaking" ? "⏸" : "🎙";

  return (
    <>
      <style>{STYLES}</style>

      {/* Hidden file inputs */}
      <input ref={fileRef} type="file" accept="video/*,image/*" multiple style={{display:"none"}} onChange={handleFileInput}/>
      <input ref={addRef} type="file" accept="video/*,image/*" multiple style={{display:"none"}} onChange={handleFileInput}/>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">Connect Claude API</div>
            <div className="modal-sub">Paste your Anthropic API key. Stays local — only sent to Anthropic directly.</div>
            <input className="modal-input" type="password" placeholder="sk-ant-..." value={apiKeyInput}
              onChange={e=>setApiKeyInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&apiKeyInput.trim()&&(setApiKey(apiKeyInput.trim()),setShowModal(false))}/>
            <div style={{fontSize:11,color:"var(--muted)"}}>Get your key at console.anthropic.com → API Keys</div>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={()=>{if(apiKeyInput.trim()){setApiKey(apiKeyInput.trim());setShowModal(false);}}}>Connect</button>
            </div>
          </div>
        </div>
      )}

      <div className="app">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="logo"><div className="logo-dot"/>respawn.edit<span className="logo-tag">Beta</span></div>
          <div className="topbar-right">
            <button className="hamburger" onClick={()=>setSidebarOpen(p=>!p)}>☰</button>
            <div className={`api-badge ${apiKey?"connected":""}`} onClick={()=>setShowModal(true)}>
              {apiKey ? "● Connected" : "Connect API"}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className={`sidebar ${sidebarOpen?"sidebar-open":""}`}>
          <div className="sidebar-label">CREATE</div>
          {MODES.map(m => (
            <div key={m.id} className={`nav-item ${activeMode===m.id?"active":""}`}
              onClick={()=>{setActiveMode(m.id);setOutput(null);setError(null);setIntent("");setSidebarOpen(false);}}>
              <span className="nav-icon">{m.icon}</span>{m.label}
            </div>
          ))}
          <div className="sidebar-footer">
            <div className="divider" style={{marginBottom:16}}/>
            <div style={{fontSize:10,color:"var(--muted)",lineHeight:1.6,fontFamily:"Space Grotesk"}}>
              © 2026 Yogita Builds<br/>Personal use only.<br/>respawn.edit
            </div>
          </div>
        </div>

        {/* WORKSPACE */}
        <div className="workspace">
          <div>
            <div className="section-title">{mode.label}</div>
            <div className="section-sub">{mode.sub}</div>
          </div>

          {items.length === 0 ? (
            <div className={`upload-zone ${dragOver?"dragover":""}`}
              onDragOver={e=>{e.preventDefault();e.stopPropagation();setDragOver(true);}}
              onDragLeave={()=>setDragOver(false)}
              onDrop={e=>{e.preventDefault();e.stopPropagation();setDragOver(false);addFiles(e.dataTransfer.files);}}
              onClick={()=>fileRef.current.click()}>
              <div className="upload-icon">⬡</div>
              <div className="upload-text">Drop your media here</div>
              <div className="upload-sub">Mix videos and images freely</div>
              <div className="upload-types">
                <span className="type-pill video">MP4 · MOV · WebM</span>
                <span className="type-pill image">JPG · PNG · WebP · GIF</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="tray-header"
                onDragOver={e=>{e.preventDefault();e.stopPropagation();setDragOver(true);}}
                onDragLeave={()=>setDragOver(false)}
                onDrop={e=>{e.preventDefault();e.stopPropagation();setDragOver(false);addFiles(e.dataTransfer.files);}}>
                <span className="tray-label">{dragOver ? "Drop to add..." : `Media (${items.length} file${items.length!==1?"s":""})`}</span>
                <button className="add-more-btn" onClick={()=>addRef.current.click()}>+ Add more</button>
              </div>
              <div className="media-list">
                {items.map(item => (
                  <div key={item.id} className={`media-item is-${item.type}`}>
                    <div className="media-item-header" onClick={()=>toggle(item.id)}>
                      {item.type==="image"
                        ? <img src={item.url} className="media-thumb" alt={item.file.name}/>
                        : <div className="media-thumb-video">▶</div>}
                      <div className="media-info">
                        <div className="media-name">{item.file.name}</div>
                        <div className="media-meta">
                          <span className={`media-badge ${item.type}`}>{item.type}</span>
                          <span className="media-size">{formatBytes(item.file.size)}</span>
                        </div>
                      </div>
                      {item.type==="image" && (
                        <select className="media-role-select" value={item.role}
                          onChange={e=>{e.stopPropagation();update(item.id,{role:e.target.value});}}
                          onClick={e=>e.stopPropagation()}>
                          {IMAGE_ROLES.map(r=><option key={r}>{r}</option>)}
                        </select>
                      )}
                      <button className="media-remove" onClick={e=>{e.stopPropagation();remove(item.id);}}>✕</button>
                    </div>
                    {item.expanded && (
                      <div className="media-preview-expand">
                        {item.type==="video" ? <video src={item.url} controls/> : <img src={item.url} alt={item.file.name}/>}
                        {item.type==="image" && (
                          <input className="img-intent-input"
                            placeholder="What should Claude do with this image?"
                            value={item.intent} onChange={e=>update(item.id,{intent:e.target.value})}/>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeMode!=="captions" && items.length>0 && (
            <div>
              <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",fontFamily:"Space Grotesk",marginBottom:8}}>Target Duration</div>
              <div className="tab-row">
                {DURATION_TABS.map(d=><button key={d} className={`tab ${duration===d?"active":""}`} onClick={()=>setDuration(d)}>{d}</button>)}
              </div>
            </div>
          )}

          <div className="intent-box">
            <div className="intent-label">What do you want Claude to do?</div>
            <div className="intent-input-row">
              <textarea className="intent-textarea" placeholder={mode.placeholder}
                value={intent} onChange={e=>setIntent(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&(e.metaKey||e.ctrlKey))handleRun();}}/>
              <button className={`voice-btn ${voiceState}`} onClick={handleVoiceBtn} title="Speak your intention">
                {voiceBtnIcon}
              </button>
            </div>
            <div className="intent-hint">Cmd+Enter to generate · 🎙 mic to speak</div>
            <div className={`jarvis-bar ${voiceState}`}>
              <div className="jarvis-indicator"/>
              {(voiceState==="listening"||voiceState==="speaking") && (
                <div className="waveform">{[1,2,3,4,5].map(i=><div key={i} className="wave-bar"/>)}</div>
              )}
              <span className="jarvis-text">{voiceState==="idle"?"JARVIS":voiceState==="listening"?"Listening...":"Speaking..."}</span>
              {transcript && <span className="jarvis-transcript">"{transcript}"</span>}
              {!transcript && voiceText && voiceState!=="idle" && <span className="jarvis-transcript">{voiceText}</span>}
            </div>
            <div>
              <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",fontFamily:"Space Grotesk",marginBottom:8}}>Quick prompts</div>
              <div className="quick-prompts">
                {mode.quickPrompts.map(p=><button key={p} className="quick-pill" onClick={()=>setIntent(p)}>{p}</button>)}
              </div>
            </div>
          </div>

          <button className={`run-btn ${loading?"loading":""}`} onClick={handleRun} disabled={loading||!intent.trim()}>
            {loading ? <span className="reel-loader"><span className="reel"/>Claude is editing...</span> : <>◈ Generate with Claude</>}
          </button>

          {error && <div style={{fontSize:13,color:"var(--coral)",padding:"12px 16px",background:"rgba(255,71,87,0.08)",borderRadius:8,border:"1px solid rgba(255,71,87,0.2)"}}>{error}</div>}
        </div>

        {/* CLAUDE PANEL */}
        <div className="claude-panel">
          <div className="panel-header">
            <div className="claude-dot"/>
            <div className="panel-title">Claude Output</div>
            {output && <button className="panel-speak-btn" onClick={()=>speak("Your content package is ready.")}>🔊 Read all</button>}
          </div>
          <div className="panel-body">
            {output ? <OutputCards data={output} onSpeak={speak}/> : (
              <div className="panel-empty">
                <div className="panel-empty-icon">◈</div>
                <div className="panel-empty-text">
                  {loading ? "Claude is editing..." : "Upload media, describe your intention, and Claude generates your full content package."}
                </div>
                {!loading && <div className="no-voice-note">🎙 Hit the mic button and just talk to it</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}