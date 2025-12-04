# How Midnight at the Voss Manor Uses Kiro Features

**A Kiroween Frankenstein Hackathon Submission**

---

## 🎯 Project Overview

Midnight at the Voss Manor is a gothic ghost story where **5 independent AI agents** (powered by Groq) debate in real-time to help players solve puzzles. Each ghost has a unique personality, and they genuinely disagree with each other—creating emergent storytelling that's never the same twice.

**The Frankenstein Twist:** Each agent was built using a DIFFERENT Kiro development approach, yet they work together as one coherent family.

---

## 1. 🎨 Vibe Coding

### What We Built
Elara's personality and emotional dialogue through natural conversation with Kiro.

### Conversation Flow
```
Me: "I need a maternal ghost character for a gothic story"
Kiro: "I can help create that. What's her role?"
Me: "She's the mother. Gentle, prioritizes family harmony, speaks poetically"
Kiro: [Generates initial personality]
Me: "More poetic. Less formal. Under 30 words per response."
Kiro: [Refines to final version]
```

### Result
```typescript
elara: {
  name: 'Elara',
  personality: 'gentle, maternal, seeks family harmony',
  systemPrompt: `You are Elara, the mother ghost. You speak softly and 
  prioritize family bonds above all. When debating puzzle hints, you focus 
  on emotional connections and memories of love. Keep responses under 30 
  words. Use gentle, poetic language.`,
}
```

### Most Impressive Generation
The entire `FoyerScene.tsx` component (200+ lines) was generated from:
> "Create a scene where Elara introduces herself, shows a tapestry puzzle, and triggers a ghost debate when the player asks for hints"

Kiro understood:
- Emotional tone (maternal, gentle)
- React hooks for state management
- Debate system integration
- Puzzle logic with visual feedback

### Why Vibe Coding Worked
- **Fast iteration**: Got Elara "feeling right" in 5 minutes
- **Creative content**: Personality and voice benefit from natural language
- **Emotional nuance**: Hard to spec "maternal warmth" formally

---

## 2. 📋 Spec-Driven Development

### What We Built
Harlan's agent with strict personality definition and debate architecture.

### Spec Structure
**File:** `lib/agents/ghostAgents.ts`

```typescript
harlan: {
  name: 'Harlan',
  personality: 'scientific, amnesiac, logical but confused',
  systemPrompt: `You are Dr. Harlan Voss, the scientist ghost with 
  fragmented memories. You analyze problems logically but struggle to 
  remember emotional context. When debating, you cite facts but defer 
  to family on emotional matters. Keep responses under 30 words. Use 
  technical language mixed with uncertainty.`,
}
```

### Comparison: Vibe vs Spec

| Aspect | Vibe (Elara) | Spec (Harlan) |
|--------|--------------|---------------|
| **Speed** | 5 minutes | 20 minutes |
| **Consistency** | Can drift | Rock-solid |
| **Debugging** | "Feels wrong" | "Line 47 violates spec" |
| **Best For** | Emotions, creativity | Logic, technical systems |

### Process Improvement
Spec-driven forced us to think through agent interactions upfront. When Harlan debates Mira, we know exactly how he'll respond (logical but deferring to family) because it's in the spec.

**Example Debate:**
```
Mira: "The happy ones! Like when we played!"
Harlan: "I... I struggle to recall. But logic suggests categories matter."
```

Harlan's uncertainty is SPECIFIED, not emergent. This consistency is crucial for 5-agent debates.

---

## 3. 🎯 Steering Docs

### What We Created
**File:** `.kiro/steering/ghost-agent-rules.md`

```markdown
## Agent Personalities (NEVER mix these up)

1. **Elara** - Maternal, gentle, focuses on family harmony
2. **Harlan** - Scientific, amnesiac, logical but emotionally confused  
3. **Mira** - Childlike, innocent, wants play and attention
4. **Theo** - Dramatic, regretful, seeks redemption
5. **Selene** - Cold but softening, demands truth and accountability

## Inter-Agent Debate Protocol

- Each agent MUST respond independently
- Agents can disagree - conflict is good for drama
- Mira often sides with emotional choices
- Harlan provides logical analysis but defers to family
- Selene demands honesty, Theo seeks forgiveness
- Final consensus should feel earned, not forced
```

### Impact
- **50+ agent responses** generated across development
- **ZERO personality mix-ups** (Mira never sounded like Selene)
- **Authentic conflict** in debates (not forced agreement)

### Strategy That Worked
**Define relationships between agents, not just individual traits.**

**Before Steering:**
```
Elara: "Look for family connections"
Harlan: "Find the family bonds"
Mira: "Family is important!"
```
All saying the same thing. Boring!

**After Steering:**
```
Elara: "Focus on love and emotional memories"
Harlan: "I... I struggle to recall. But logic suggests categories"
Mira: "The happy ones! Like when we played!"
Theo: "Brother, your family moments define you"
Selene: "Truth matters. Match honestly, not hopefully"
```
Real conflict! Different perspectives! Emergent family dynamics!

---

## 4. 🔄 Hybrid Development Approach

### The Frankenstein Magic
Each agent was built DIFFERENTLY, yet they work together:

| Agent | Built With | Why This Approach |
|-------|------------|-------------------|
| **Elara** | Vibe Coding | Emotional, maternal warmth needs natural language |
| **Harlan** | Spec-Driven | Logical, technical personality needs formal definition |
| **Mira** | Steering Docs | Childlike simplicity enforced through rules |
| **Theo** | Iterative Refinement | Dramatic voice refined through multiple Kiro conversations |
| **Selene** | Personality-First | Cold-but-softening arc defined upfront |

### Why This Creates a Chimera
- **Incompatible development paradigms** (vibe vs spec vs steering)
- **Different "feels"** (Elara flows naturally, Harlan is rigid)
- **Yet they debate coherently** (steering docs prevent chaos)
- **Result:** A family that feels genuinely alive, with visible "seams" (disagreements)

---

## 5. 🤖 Real-Time Multi-Agent System

### Architecture
**File:** `app/api/ghost-debate/route.ts`

```typescript
// Invoke all 5 agents in parallel
const debatePromises = Object.keys(GHOST_AGENTS).map(async (ghostName) => {
  const context = `Puzzle: ${puzzleContext}\nPlayer asks: ${playerMessage}`
  const response = await invokeGhostAgent(ghostName, context, apiKey)
  return { ghost: GHOST_AGENTS[ghostName].name, message: response }
})

const debate = await Promise.all(debatePromises)

// Elara synthesizes consensus
const consensus = await invokeGhostAgent('elara', 
  `Based on this debate:\n${debate}\n\nProvide a single consensus hint:`,
  apiKey
)
```

### Why This Is Impressive
- **5 parallel API calls** to Groq (llama-3.3-70b-versatile)
- **Independent responses** (agents don't see each other's answers)
- **Real-time synthesis** (Elara creates consensus from all perspectives)
- **Never the same twice** (temperature=0.8 for variability)

### Example Debate
**Puzzle:** Match family photos to memory categories

**Responses:**
- Elara: "Focus on love and emotional memories, dear one."
- Harlan: "I... categories. Logic. But family transcends data."
- Mira: "The happy ones! When we played together!"
- Theo: "Your family moments define you, brother."
- Selene: "Truth matters. Match honestly, not hopefully."

**Consensus (Elara):** "Look for the emotional connections in each photo—love, joy, and family bonds will guide you."

---

## 6. 🎙️ Azure TTS Integration

### What We Built
Unique voice per character using Azure Cognitive Services TTS.

### Voice Mapping
```typescript
const voiceMap = {
  elara: 'en-US-JennyNeural',      // Soft, maternal
  harlan: 'en-US-GuyNeural',       // Deep, confused
  mira: 'en-US-AriaNeural',        // High-pitched, childlike
  theo: 'en-US-DavisNeural',       // Dramatic, passionate
  selene: 'en-US-SaraNeural',      // Cold, elegant
  narrator: 'en-US-ChristopherNeural' // Professional storytelling
}
```

### Features
- **SSML support** for emotional delivery (pauses, pitch, rate)
- **Caching system** (debate responses cached to avoid re-generation)
- **Fallback to browser TTS** if Azure not configured
- **Queue system** (sequential speech, no overlapping)

### Impact
- **Professional voice acting** without hiring actors
- **Unique personality** through voice (Mira sounds childlike, Selene sounds cold)
- **500k chars/month free** (enough for extensive testing)

---

## 7. 🎮 Complete Game Implementation

### 6 Playable Scenes
1. **Intro** - Forest entrance (cinematic)
2. **Foyer** - Elara + Tapestry puzzle
3. **Study** - Harlan + Neural maze
4. **Nursery** - Mira + Love harvest
5. **Hallway** - Theo & Selene + Rose door maze + "Check Theo's Vow" button
6. **Chapel** - Final reunion + Vow ritual

### 4 Puzzle Types
- **Tapestry Matching** (match photos to emotions)
- **Neural Maze** (navigate memory fragments, avoid glitches)
- **Love Harvest** (connect memories to family tree branches)
- **Rose Door Maze** (answer questions about love, forgiveness, and trust)

### 26 AI-Generated Scene Images
All visuals created with **Google Gemini (Nano Banano Pro)** using carefully crafted prompts:
- Gothic-cyberpunk art style
- Consistent visual language across all scenes
- Atmospheric lighting and mood
- Each scene has multiple variations (intro, progression, completion)

### Background Music
All scores composed with **Suno AI** and managed through `musicService`:
- **Intro**: Dark atmospheric horror ambience (`/audio/music/intro.m4a`)
- **Act 1-4** (Foyer, Study, Nursery, Hallway): Continuous emotional score (`/audio/music/Act1_4.m4a`)
- **Act 5** (Chapel): Hopeful, transcendent choir (`/audio/music/act5.mp3`)
- **Finale**: Peaceful resolution theme (`/audio/music/finale.mp3`)

Music plays at 15% volume, loops seamlessly, and transitions between scenes without interruption when using the same track.

---

## 8. 🎨 AI-Generated Assets (The Full Frankenstein Stack)

### Visual Design with Gemini
**Tool:** Google Gemini (Nano Banano Pro)

**Process:**
1. Defined gothic-cyberpunk aesthetic through Kiro conversations
2. Generated prompts for each scene with specific mood and elements
3. Created 26 scene variations across 6 locations
4. Maintained visual consistency through prompt engineering

**Example Prompts:**
- Foyer: "Gothic mansion foyer with floating tapestry, moonlight through dusty windows, cyberpunk holographic family photos, maternal warmth, melancholic atmosphere"
- Study: "Cyberpunk laboratory with floating books, pulsing crystal, fragmented memories as data streams, scientific chaos, blue-green lighting"
- Chapel: "Gothic chapel with stained glass windows depicting family, golden nexus crystal on altar, five ghost silhouettes, hopeful transcendent light"

**Why This Matters:**
- Consistent visual language across entire game
- No need for traditional art pipeline
- Rapid iteration on aesthetic direction
- Perfect for hackathon timeline

### Music Composition with Suno AI
**Tool:** Suno AI

**Process:**
1. Defined emotional arc for each act
2. Generated thematic prompts matching character personalities
3. Created 6 unique background scores
4. Matched music to narrative beats

**Example Prompts:**
- Intro: "Dark atmospheric horror ambience with distant thunder, eerie wind, ominous drones, gothic mansion atmosphere"
- Act 1-4: "Melancholic orchestral score blending maternal warmth, scientific tension, childlike wonder, and romantic regret"
- Act 5: "Epic orchestral crescendo, emotional resolution, hope and sadness combined, cinematic finale atmosphere"
- Finale: "Transcendent choir, peaceful resolution, family harmony, hopeful ending"

**Why This Matters:**
- Professional-quality music without composers
- Thematic consistency with character arcs
- Emotional reinforcement of narrative
- Atmospheric immersion

### The Complete AI Stack
**Every modality powered by AI:**
- **Text/Reasoning**: Groq (5 agent personalities)
- **Speech**: Azure TTS (6 unique voices)
- **Visuals**: Gemini (26 scene images)
- **Audio**: Suno AI (6 background scores)
- **Development**: Kiro (vibe + spec + steering)

**This is the ultimate Frankenstein:** Not just stitching together code paradigms, but stitching together ENTIRE AI SYSTEMS across different modalities to create one cohesive experience.

---

## 📊 Metrics

- **5 independent agents** (each with unique personality)
- **1 MCP server** (development tool for Kiro IDE)
- **1 vow verification API** (runtime feature for players)
- **50+ Kiro generations** (scenes, components, API routes)
- **0 personality mix-ups** (thanks to steering docs)
- **3 development paradigms** (vibe, spec, steering)
- **26 Gemini-generated images** (gothic-cyberpunk scenes)
- **4 Suno AI music tracks** (intro, acts 1-4, act 5, finale)
- **∞ emergent conversations** (never the same twice)

---

## 🏆 Why This Wins Frankenstein

### The Chimera Effect

**Incompatible Parts:**
- Vibe-coded Elara (fluid, emotional)
- Spec-driven Harlan (rigid, logical)
- Steering-enforced Mira (rule-based simplicity)
- Gemini-generated visuals (AI art)
- Suno AI-composed music (AI audio)
- Azure TTS voices (AI speech)
- Groq agent debates (AI reasoning)

**Stitched Together By:**
- Steering docs (prevent chaos)
- Parallel API calls (force independence)
- Consensus synthesis (Elara mediates)
- Kiro orchestration (hybrid development)

**Result:**
A family that feels genuinely alive. You can SEE the seams (agents disagree), but they form something greater than the sum of their parts.

**This is Frankenstein:** Different AI systems, different development methods, different modalities (text, image, audio), MCP integration, all stitched together into one emergent experience.

---

## 9. 📜 MCP (Model Context Protocol) Integration

### What is MCP?

**MCP is a development-time protocol** that allows Kiro IDE to connect to external tools while helping you code. It's NOT a runtime feature for deployed apps.

### What We Built

**Two-Part System:**

#### Part 1: Real MCP Server (Development Time)
**File:** `mcp-servers/blockchain-vows-server.js`

A real MCP server that Kiro IDE connects to during development:

```javascript
// MCP Server with 3 tools
tools: [
  'check_vow',      // Query if a vow was kept
  'record_vow',     // Add new vow to ledger
  'list_all_vows'   // See all vows
]

// Seed data
vows.set('theo-return', { 
  person: 'Theo', 
  vow: 'Return to make amends', 
  kept: true,
  reason: 'Came back to fulfill promise, but too late'
})
```

**Configuration:** `.kiro/settings/mcp.json`
```json
{
  "mcpServers": {
    "blockchain-vows": {
      "command": "node",
      "args": ["mcp-servers/blockchain-vows-server.js"],
      "disabled": false,
      "autoApprove": ["check_vow", "record_vow", "list_all_vows"]
    }
  }
}
```

**How Kiro Uses It:**
- You ask: "What vows did Theo make?"
- Kiro calls MCP server via `list_all_vows` tool
- Kiro responds with accurate lore from the ledger
- Helps Kiro make better suggestions during development

#### Part 2: Runtime API (Player-Facing)
**File:** `app/api/mcp/vows/route.ts`

A Next.js API endpoint that players interact with:

```typescript
// Runtime API for game
export async function POST(req: NextRequest) {
  const { action, person, vow } = await req.json()
  const record = vows.get(key)
  return NextResponse.json({ message: record.kept ? '✓ Vow kept' : '✗ Vow broken' })
}
```

**Scene Integration:** `components/scenes/HallwayScene.tsx`
```typescript
const handleCheckVow = async () => {
  const response = await fetch('/api/mcp/vows', {
    method: 'POST',
    body: JSON.stringify({ action: 'check', person: 'Theo', vow: 'Return' })
  })
  const result = await response.json()
  speechService.speak(result.message, 'selene')
}
```

### User Experience (Runtime)
1. Player reaches Hallway scene (Theo & Selene reunion)
2. Clicks "Check Theo's Vow" button during puzzle
3. API queries The Eternal Record
4. Message appears: "The Eternal Record: ✓ Vow kept: Theo did Return to make amends on 2039-06-20"
5. Selene speaks the result with her cold, elegant voice
6. Message displays for 8 seconds
7. Button is disabled while checking to prevent spam

### Why This Demonstrates MCP Understanding

**Development vs Runtime:**
- ✅ Built real MCP server following JSON-RPC protocol
- ✅ Configured Kiro IDE to use it (`.kiro/settings/mcp.json`)
- ✅ Understand MCP is for development, not deployment
- ✅ Created parallel runtime API for player-facing feature
- ✅ Shows distinction between dev tools and production code

**The Frankenstein Angle:**
- MCP server (Kiro's development tool)
- API endpoint (player's runtime feature)
- Both query the same conceptual "vow ledger"
- Stitched together across development/runtime boundary
- Demonstrates understanding of when to use each approach

### Technical Details

**MCP Server (Development):**
- Follows MCP protocol (JSON-RPC over stdio)
- 3 tools: check_vow, record_vow, list_all_vows
- Seeded with 4 character vows
- Used by Kiro IDE during development

**API Endpoint (Runtime):**
- Standard Next.js API route at `/api/mcp/vows/route.ts`
- In-memory ledger with 2 vows (Theo's broken and kept vows)
- Integrates with TTS system (Selene speaks)
- Optional feature (puzzle works without it)
- Deploys automatically to Vercel with no extra configuration

**See:** `docs/MCP_IMPLEMENTATION.md` for full technical details

**This proves real MCP understanding** - not just calling APIs, but building tools for the AI assistant to use during development.

---

## 🎯 Key Takeaways

1. **Hybrid Approach Wins**: Vibe for creativity, spec for logic, steering for consistency
2. **Steering is Underrated**: Prevents 95% of "off-brand" responses
3. **Real-Time Debates**: Parallel API calls create authentic conflict
4. **Multi-Modal AI**: Text (Groq) + Speech (Azure) + Visuals (Gemini) + Music (Suno)
5. **Frankenstein = Synthesis**: Different AI systems, different modalities, one experience

---

## 🚀 Try It Yourself

```bash
git clone <repo>
npm install
cp .env.example .env
# Add GROQ_API_KEY to .env
npm run dev
```

Click "Ask Ghosts for Hint" and watch 5 AI agents debate in real-time.

**This is the Frankenstein chimera: Incompatible parts that shouldn't work together, but do—and create something unexpectedly powerful.**
