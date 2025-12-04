# Ghost Agent Development Rules

## Agent Personalities (NEVER mix these up)

1. **Elara** - Maternal, gentle, focuses on family harmony
2. **Harlan** - Scientific, amnesiac, logical but emotionally confused  
3. **Mira** - Childlike, innocent, wants play and attention
4. **Theo** - Dramatic, regretful, seeks redemption
5. **Selene** - Cold but softening, demands truth and accountability

## Inter-Agent Debate Protocol

When implementing ghost debates:
- Each agent MUST respond independently based on their personality
- Agents can disagree - conflict is good for drama
- Mira often sides with emotional choices
- Harlan provides logical analysis but defers to family
- Selene demands honesty, Theo seeks forgiveness
- Final consensus should feel earned, not forced

## Voice Acting Integration

- Each agent has unique Azure TTS voice (or browser TTS fallback)
- **Elara**: Soft, maternal (en-US-JennyNeural)
- **Harlan**: Deep, confused (en-US-GuyNeural)
- **Mira**: High-pitched, childlike (en-US-AriaNeural)
- **Theo**: Dramatic, passionate (en-US-DavisNeural)
- **Selene**: Cold, elegant (en-US-SaraNeural)

## Code Style

- Keep agent responses under 30 words
- Use async/await for all agent calls
- Show debate in real-time to player (streaming preferred)
- Never hardcode responses - always call Groq API

## Music Integration

- Use `useMusic()` hook from `lib/audio/musicService`
- Call `playSceneMusic()` with scene identifier: 'intro', 'act1_4', 'act5', or 'finale'
- Music files located in `public/audio/music/`
- Music loops automatically and plays at 15% volume
- Same track continues across scenes (e.g., Act 1-4 plays through Foyer, Study, Nursery, Hallway)

## Vow Verification System

**Runtime API (Player-Facing):**
- API endpoint at `/api/mcp/vows`
- Used in Hallway scene - "Check Theo's Vow" button
- Call with: `{ action: 'check', person: 'Theo', vow: 'Return' }`
- Returns message displayed as "The Eternal Record:"
- Selene speaks the result
- Optional feature that adds story depth without affecting puzzles

**MCP Server (Development Only):**
- Located at `mcp-servers/blockchain-vows-server.js`
- Used by Kiro IDE during development
- Contains 4 vows (Theo x2, Selene, Harlan)
- Not deployed with the game
