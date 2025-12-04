# 👻 Midnight at the Voss Manor

**A Gothic Ghost Story Powered by 5 Independent AI Agents**

> *"Five souls trapped in limbo. Five AI minds that must agree to set them free."*

---

## 🎮 What Is This?

Midnight at the Voss Manor is a narrative puzzle game where you help a ghost family find peace. The twist: **each ghost is a separate AI agent** powered by Groq that debates with the others in real-time to help you solve puzzles.

Built for the **Kiro Frankenstein Hackathon** to showcase:
- ✅ 5 Independent Groq Agents (one per ghost character)
- ✅ Real-time Inter-Agent Debates (never the same twice)
- ✅ Vibe Coding + Spec-Driven Development hybrid
- ✅ Steering Docs for consistent AI personalities
- ✅ Azure TTS Voice Acting (unique voice per character)
- ✅ Complete playable game with 5 scenes and 3 puzzles

---

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Your FREE API Keys

**Required - Groq (AI Agents):**
1. Go to [console.groq.com/keys](https://console.groq.com/keys)
2. Sign up (30 seconds, no credit card)
3. Copy your API key

**Optional - Azure TTS (Voice Acting):**
1. Go to [azure.microsoft.com/free/cognitive-services](https://azure.microsoft.com/free/cognitive-services)
2. Sign up for free tier (500k chars/month)
3. Get your API key and region

### 3. Set Up Environment
```bash
cp .env.example .env
```

Edit `.env` and add your keys:
```env
GROQ_API_KEY=gsk_your_actual_key_here
NEXT_PUBLIC_AZURE_TTS_API_KEY=your_azure_key_here  # Optional
NEXT_PUBLIC_AZURE_TTS_REGION=eastus                # Optional
```

### 4. Run the Game
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and play!

---

## 🎭 The Five Ghost Agents

Each ghost is a **separate AI agent** powered by Groq with unique personality:

| Ghost | Personality | Voice | Built With |
|-------|-------------|-------|------------|
| **Elara** | Maternal, gentle, seeks harmony | Soft, warm | Vibe Coding |
| **Harlan** | Scientific, amnesiac, logical | Deep, confused | Spec-Driven |
| **Mira** | Childlike, innocent, playful | High-pitched, excited | Steering Docs |
| **Theo** | Dramatic, regretful, romantic | Passionate, theatrical | Iterative Refinement |
| **Selene** | Cold but softening, seeks truth | Elegant, commanding | Personality-First |

---

## 🔮 How Agent Debates Work

When you click **"Ask Ghosts for Hint"** during a puzzle:

1. All 5 agents are invoked **in parallel** via Groq API (llama-3.3-70b-versatile)
2. Each responds based on their unique personality (under 30 words)
3. Agents can **disagree** — Mira wants play, Harlan wants logic, Selene demands truth
4. Elara synthesizes a **consensus hint** from all perspectives
5. Responses are spoken with unique Azure TTS voices (if configured)

**The magic:** 5 agents with different personalities debating in real-time, never the same conversation twice.

## 📜 Vow Verification System

**The Eternal Record** - In the Hallway scene, click "Check Theo's Vow" to query the vow ledger:
- API endpoint at `/api/mcp/vows` verifies promises
- Checks if Theo kept his vow to return to Selene
- Adds story depth without affecting puzzle mechanics
- Selene speaks the result with her unique voice
- Demonstrates blockchain-inspired promise tracking

---

## 🎨 Game Scenes

### 1. Intro - The Forest
Cinematic entrance. Lost in a storm, you find the mansion.  
**Visuals:** 4 Gemini-generated gothic forest scenes  
**Music:** Suno AI atmospheric intro theme

### 2. Foyer - Elara's Domain
**Puzzle:** Harlan's Threads (match family photos to memory categories)  
**Ghost:** Elara (Mother) introduces the family's tragedy  
**Visuals:** 4 Gemini-generated foyer scenes with tapestry  
**Music:** Suno AI Act 1 score (maternal, melancholic)

### 3. Study - Harlan's Lab
**Puzzle:** Neural Maze (navigate fragmented memories)  
**Ghost:** Dr. Harlan Voss explains the Eternal Harmony experiment  
**Visuals:** 3 Gemini-generated cyberpunk lab scenes  
**Music:** Suno AI Act 2 score (scientific, glitchy)

### 3. Nursery - Mira's Room
**Puzzle:** Love Harvest (connect memories to family tree)  
**Ghost:** Mira (Daughter) wants to remember happy times  
**Visuals:** 3 Gemini-generated nursery scenes with floating toys  
**Music:** Act 1-4 score continues (playful, haunting)

### 4. Hallway - Theo & Selene
**Puzzle:** Rose Door-Unlock Maze (answer questions about love and forgiveness)  
**Ghosts:** Theo and Selene reunite through thorny walls  
**Special Feature:** "Check Theo's Vow" button queries The Eternal Record  
**Visuals:** 5 Gemini-generated hallway scenes with thorny vines and locked door  
**Music:** Act 1-4 score continues (romantic, regretful)

### 5. Chapel - The Reunion
**Final Scene:** All 5 ghosts reunite and find peace together  
**Puzzle:** Vow Ritual (complete the binding ceremony)  
**Debate:** Family reflects on their journey through AI discussion  
**Visuals:** 4 Gemini-generated chapel scenes with stained glass  
**Music:** Act 5 score transitions to Finale (hopeful, transcendent)

---

## 🛠️ Kiro Features Showcase

### 1. Vibe Coding + Spec-Driven Development
- **Elara**: Built through natural conversation with Kiro ("Make her more maternal and poetic")
- **Harlan**: Built from formal spec with strict personality definition
- **Result**: Hybrid approach combining creative flexibility with technical rigor

### 2. Steering Docs
Located in `.kiro/steering/`:
- **`ghost-agent-rules.md`** - Personality definitions + debate protocol (prevents character mixing)
- **`scene-structure.md`** - Standard scene component template

**Impact**: 50+ agent responses generated, zero personality mix-ups

### 3. Real-Time Multi-Agent System
- 5 independent Groq API calls in parallel (`Promise.all()`)
- Each agent has unique system prompt (under 30 words per response)
- Elara synthesizes consensus from all perspectives
- Debates visible in real-time, never the same twice

### 4. Azure TTS Integration
- Unique voice per character (6 total including narrator)
- SSML support for emotional delivery
- Caching system for performance
- Fallback to browser TTS if not configured

---

## 📁 Project Structure

```
midnight-at-the-voss-manor/
├── app/
│   ├── api/
│   │   ├── ghost-debate/route.ts    # Debate orchestrator
│   │   └── mcp/
│   │       └── vows/route.ts        # MCP blockchain vows API
│   ├── page.tsx                      # Main game controller
│   └── globals.css                   # Gothic-cyberpunk styles
├── components/
│   ├── scenes/
│   │   ├── IntroScene.tsx           # Forest entrance
│   │   ├── FoyerScene.tsx           # Elara + Tapestry puzzle
│   │   ├── StudyScene.tsx           # Harlan + Neural maze
│   │   ├── NurseryScene.tsx         # Mira + Love harvest
│   │   ├── HallwayScene.tsx         # Theo & Selene + Rose door maze
│   │   └── ChapelScene.tsx          # Final reflection + ritual
│   ├── GhostDebatePanel.tsx         # Real-time debate display
│   └── TTSToggle.tsx                # Voice narration toggle
├── lib/
│   ├── agents/
│   │   └── ghostAgents.ts           # 5 agent definitions + Groq API
│   ├── mcp/                          # MCP integration helpers
│   └── tts/                          # Text-to-speech service
├── mcp-servers/
│   └── blockchain-vows-server.js    # Custom MCP for Selene
├── public/
│   ├── shots/                        # 26 pre-generated scene images
│   └── audio/
│       ├── music/                    # Background music tracks
│       │   ├── intro.m4a            # Intro scene music
│       │   ├── Act1_4.m4a           # Acts 1-4 music
│       │   ├── act5.mp3             # Chapel scene music
│       │   └── finale.mp3           # Ending music
│       └── sfx/                      # Sound effects
├── .kiro/
│   ├── hooks/                        # Agent hook configs
│   ├── settings/mcp.json            # MCP server configs
│   ├── specs/ghost-agents/          # Spec-driven docs
│   └── steering/                     # AI personality rules
└── docs/
    ├── API_KEYS_GUIDE.md            # Detailed setup instructions
    ├── MCP_SETUP.md                 # MCP configuration guide
    └── TTS_GUIDE.md                 # Voice setup guide
```

---

## 🎯 Optional: Enable Voice Acting

The game works great with browser TTS, but Azure TTS adds professional voice acting:

### Azure Cognitive Services TTS (Recommended)
1. Get free tier (500k chars/month): [azure.microsoft.com/free/cognitive-services](https://azure.microsoft.com/free/cognitive-services)
2. Create a Speech resource
3. Get your API key and region
4. Add to `.env`:
```env
NEXT_PUBLIC_AZURE_TTS_API_KEY=your_key_here
NEXT_PUBLIC_AZURE_TTS_REGION=eastus
```

**Each character gets a unique neural voice:**
- Elara: Soft, maternal warmth
- Harlan: Deep, confused scientist
- Mira: High-pitched, childlike innocence
- Theo: Dramatic, regretful
- Selene: Cold, elegant, commanding
- Narrator: Professional storytelling voice

**Without Azure TTS**: Browser's built-in TTS is used (still works, just less expressive)

---

## 🎬 Demo Video Script

**Perfect for hackathon submission:**

1. **0:00-0:15** - Intro cinematic (show gothic-cyberpunk art style)
2. **0:15-0:45** - Foyer puzzle + trigger first debate (show all 5 agents responding)
3. **0:45-1:00** - Mira's crayon drawing auto-generated via MCP hook
4. **1:00-1:15** - Harlan's memory storage hook triggered on puzzle complete
5. **1:15-1:45** - Chapel final debate (unscripted 5-agent conversation)
6. **1:45-2:00** - Ending + credits showing Kiro features used

---

## 🏆 Frankenstein Category Highlights

### Why This Is Frankenstein-Worthy

**Five Different Agents → One Emergent Family**

- Each agent built with DIFFERENT Kiro approaches (vibe coding, spec-driven, steering docs)
- Agents debate and disagree in real-time, creating authentic conflict
- Maternal Elara vs Logical Harlan vs Playful Mira = genuine family dynamics
- Steering docs prevent chaos while allowing personality conflicts
- Never the same conversation twice (emergent storytelling)

**The Stitched-Together Magic:**
- Vibe-coded emotional characters (Elara, Mira)
- Spec-driven logical characters (Harlan)
- Steering-enforced consistency across all
- Real-time parallel API calls creating unpredictable debates
- Result: A family that feels genuinely alive

---

## 📚 Documentation

- **[KIRO_FEATURES.md](./KIRO_FEATURES.md)** - Detailed hackathon writeup on how we used Kiro
- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute setup guide
- **[.kiro/steering/](./kiro/steering/)** - Personality rules and scene templates
- **[.kiro/specs/](./kiro/specs/)** - Spec-driven development docs

---

## 🐛 Troubleshooting

### "Missing GROQ_API_KEY" error
Make sure you copied `.env.example` to `.env` and added your actual key.

### Agents not responding
Check your Groq API key is valid at [console.groq.com](https://console.groq.com)

### MCP extensions not working
They're optional! The game works great without them. See [MCP_SETUP.md](./docs/MCP_SETUP.md) for detailed setup.

### Voice not working
Azure TTS is optional. The game works with browser TTS if Azure keys aren't configured.

---

## 🤝 Contributing

This is a hackathon project, but feel free to:
- Add new ghost personalities
- Create additional puzzles
- Improve the debate system
- Add more MCP extensions

---

## 📜 License

MIT License - Built for Kiro Frankenstein Hackathon 2024

---

## 🙏 Credits

- **AI Agents**: Powered by Groq (llama-3.3-70b-versatile)
- **Voice Acting**: Azure Cognitive Services TTS (Neural voices)
- **Scene Images**: Generated with Google Gemini (Nano Banano Pro) - 26 gothic-cyberpunk scenes
- **Background Music**: Composed with Suno AI - atmospheric scores for each act
- **Built With**: Next.js, React, Kiro (vibe coding + spec-driven + steering docs)
- **Development**: 100% built with Kiro AI-powered IDE

---

**Ready to help the ghosts find peace?**

```bash
npm run dev
```

*"Five souls. Five minds. One family. One chance."*
