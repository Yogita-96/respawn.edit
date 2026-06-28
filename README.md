# respawn.edit

> Your raw footage died. Now it respawns.

An AI-powered video editor for Instagram Reels and gaming content — built in React, powered by Claude. Drop your media, speak or type your intention, and Claude generates hooks, captions, hashtags, on-screen text, trim suggestions, and image overlay copy.

Built by [Yogita Builds](https://github.com/Yogita-96) · [@yogita.builds_](https://instagram.com/yogita.builds_)

---

## What it does

- **Instagram Mode** — hooks, captions, hashtags, trim suggestions, on-screen text
- **Gamer Mode** — gaming-tuned captions, devlog notes, POV hooks, clip timestamps
- **Caption Studio** — subtitle scripts, on-screen overlays with timing, title cards, end screen CTAs
- **Image suggestions** — overlay text, placement timing, standalone captions for each image
- **JARVIS voice interface** — speak your intention instead of typing, Claude reads output back to you
- **Mixed media** — drop videos and images together, assign roles (Intro Card, Overlay, Thumbnail, etc.)

---

## Tech stack

- React + Vite (frontend)
- Express proxy server (CORS bridge)
- Anthropic Claude API (claude-sonnet-4-6)
- Web Speech API (voice input/output — no extra keys needed)
- No game engine. Just state management taken seriously.

---

## Local setup

### Prerequisites
- Node.js 18+
- An Anthropic API key — get one at [console.anthropic.com](https://console.anthropic.com)

### Install

```bash
git clone https://github.com/Yogita-96/respawn.edit.git
cd respawn.edit
npm install
```

### Run

You need two terminals:

**Terminal 1 — proxy server:**
```bash
node server.js
```

**Terminal 2 — frontend:**
```bash
npm run dev
```

Open [http://localhost:5174](http://localhost:5174) in Chrome.

### Connect Claude

Click **Connect API** in the top right and paste your Anthropic API key (`sk-ant-...`). It stays local — never stored anywhere except your browser session.

---

## Usage

1. Select a mode from the sidebar (Instagram / Gamer / Caption Studio)
2. Drop your video and/or images into the media zone
3. Assign roles to images (Intro Card, Overlay, Thumbnail, etc.)
4. Type your intention — or hit the 🎙 mic button and just talk to it
5. Press **Cmd+Enter** or click **Generate with Claude**
6. Copy any output card or click 🔊 to hear it read back

---

## License

**Personal Use License**

Copyright © 2026 Yogita Builds. All rights reserved.

Permission is granted to purchase and use this software **for personal, local use only** under the following conditions:

- ✅ You may run this software locally on your own machine
- ✅ You may use it to create content for your own channels and projects
- ✅ You may modify it for your own personal use
- ❌ You may **not** deploy it publicly as a service or web app
- ❌ You may **not** sell, sublicense, or redistribute this code or any derivative
- ❌ You may **not** use this as the basis for a competing product or service
- ❌ You may **not** remove or alter copyright notices

**Commercial use of any kind requires written permission from the copyright holder.**

To request commercial licensing: yogitaa.rm@gmail.com

This license is non-transferable. Purchased licenses are for individual personal use only.

---

## Purchase

This project is available for personal use at **$22** via Gumroad.
Your purchase includes the full source code and setup instructions.

> Purchasing does not grant rights beyond personal use as defined above.

---

## Disclaimer

This software requires your own Anthropic API key. API usage costs are the responsibility of the user. The author is not liable for any API charges incurred through use of this software.

---

*Built in public. Devlogs on [@yogita.builds_](https://instagram.com/yogita.builds_)*
