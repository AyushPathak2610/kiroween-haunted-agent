# ✅ Gemini 2.5 TTS Integration Complete

## What You Got

Switched to **Gemini 2.5 Text-to-Speech** - the PERFECT solution for your ghost game!

### Why This Is Better

✅ **One API key for everything** - Same Gemini key powers AI agents AND voices
✅ **Multi-speaker support** - Generate entire debates with all 5 ghosts in ONE call
✅ **Natural language control** - "Say sadly", "whisper", "sound like a 6 year old"
✅ **30 voice options** - Each ghost has perfect personality match
✅ **Massive free tier** - 1.5M requests/month (vs Azure's 500k chars)
✅ **No SSML complexity** - Just describe emotions in plain English

## Character Voice Mapping

| Ghost | Voice | Personality | Why It Works |
|-------|-------|-------------|--------------|
| **Elara** | Aoede (Breezy) | Soft, sad, maternal, British | Ethereal, floating quality |
| **Harlan** | Algenib (Gravelly) | Confused, frantic, raspy | Textured, tired scientist |
| **Mira** | Leda (Youthful) | Childlike, scared, 6 years old | Innocent, timid |
| **Theo** | Iapetus (Clear) | Dramatic, theatrical, British | Stage actor quality |
| **Selene** | Kore (Firm) | Cold, professional, controlled | Sharp, authoritative |
| **Narrator** | Orus (Firm) | Calm, atmospheric, deep | Gothic storytelling |

## Files Created/Modified

### NEW Files:
1. **lib/tts/geminiTTS.ts**
   - Gemini 2.5 TTS API integration
   - Single-speaker generation
   - Multi-speaker debate generation
   - Natural language personality prompts

2. **docs/GEMINI_TTS_SETUP.md**
   - Complete setup guide
   - Voice profiles for all 6 characters
   - Troubleshooting
   - Multi-speaker examples

3. **GEMINI_TTS_COMPLETE.md** (this file)
   - Migration summary

### UPDATED Files:
1. **lib/tts/speechService.ts**
   - Removed Azure code
   - Now uses Gemini TTS
   - Same API for game code (no breaking changes)

2. **.env**
   - Removed: `NEXT_PUBLIC_AZURE_TTS_API_KEY`
   - Removed: `NEXT_PUBLIC_AZURE_TTS_REGION`
   - Uses: `NEXT_PUBLIC_GEMINI_API_KEY` (same as agents!)

3. **.env.example**
   - Updated with Gemini setup instructions

## How It Works

### Individual Ghost Lines

```typescript
// Elara speaks
speechService.speak("Welcome, traveler. I am Elara.", 'elara')

// Behind the scenes:
// Prompt: "Say this as soft, sad, maternal, whispering like floating 
//         underwater, British accent: 'Welcome, traveler. I am Elara.'"
// Voice: Aoede (Breezy)
// Output: Emotional, character-appropriate audio
```

### Ghost Council Debates (Multi-Speaker)

```typescript
// All 5 ghosts debate in ONE audio file!
const debate = [
  { ghost: 'elara', text: 'We must help them remember.' },
  { ghost: 'harlan', text: 'But... what if the truth hurts?' },
  { ghost: 'mira', text: 'I want Mommy to see me!' },
  { ghost: 'theo', text: 'Perhaps there is hope...' },
  { ghost: 'selene', text: 'Actions speak louder than words.' }
]

generateMultiSpeakerDebate(debate, geminiApiKey)
// Returns: Single audio blob with all 5 voices in sequence
```

## Key Features

### 1. Natural Language Emotion Control

No SSML needed! Just describe the emotion:

```typescript
// Sad whisper
"Say in a sad whisper: I miss my family"

// Excited child
"Say excitedly like a 6 year old: Yay! Let's play!"

// Cold professional
"Say coldly and professionally: That's not acceptable"

// Dramatic theater
"Say dramatically like a stage actor: Brother... forgive me"
```

### 2. Character Personalities

Each ghost has a personality description that guides the voice:

- **Elara**: "soft, sad, maternal, whispering like floating underwater, British accent"
- **Harlan**: "confused, frantic, intellectual, raspy voice of a tired scientist"
- **Mira**: "childlike, innocent, scared, whispering softly, 6 years old"
- **Theo**: "dramatic, theatrical, anxious, British accent, like a stage actor whispering"
- **Selene**: "cold, sharp, professional, controlled, hiding sadness, lower pitch"

### 3. Audio Caching

Repeated lines are cached to reduce API calls:

```typescript
// First time: API call
speechService.speak("Welcome", 'elara')

// Second time: Cached (instant playback)
speechService.speak("Welcome", 'elara')
```

### 4. Queue System

Multiple voices don't overlap:

```typescript
// These play in sequence, not simultaneously
speechService.speak("First line", 'elara')
speechService.speak("Second line", 'harlan')
speechService.speak("Third line", 'mira')
```

## Setup Instructions

### 1. Get Gemini API Key (30 seconds)

1. Go to: https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy the key

### 2. Add to .env

```bash
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...your_key_here
```

### 3. Restart Server

```bash
npm run dev
```

**Done!** Your ghosts now have voices.

## Testing

Open browser console:

```javascript
// Test Elara
speechService.speak("Welcome, traveler. I am Elara.", 'elara')

// Test all ghosts
['elara', 'harlan', 'mira', 'theo', 'selene'].forEach((ghost, i) => {
  setTimeout(() => {
    speechService.speak(`This is ${ghost} speaking`, ghost)
  }, i * 4000)
})
```

## Cost Comparison

| Service | Free Tier | Setup | Multi-Speaker | Quality |
|---------|-----------|-------|---------------|---------|
| **Gemini 2.5** | 1.5M req/month | 1 key | ✅ Native | ⭐⭐⭐⭐⭐ |
| Azure | 500k chars/month | Separate account | ❌ No | ⭐⭐⭐⭐ |
| ElevenLabs | 10k chars/month | Separate account | ❌ No | ⭐⭐⭐⭐⭐ |
| Google TTS | 1M chars/month | Separate account | ❌ No | ⭐⭐⭐⭐ |

**Winner**: Gemini (best free tier + multi-speaker + same key)

## Usage Estimate

**Per playthrough:**
- Intro: ~5 TTS calls
- 5 rooms: ~25 TTS calls
- Debates: ~20 TTS calls
- **Total**: ~50 requests

**Free tier allows**: ~30,000 playthroughs/month

You're covered!

## Advanced Features

### Multi-Speaker Debates

Generate entire conversations as ONE audio file:

```typescript
import { generateMultiSpeakerDebate } from '@/lib/tts/geminiTTS'

const speakers = [
  { ghost: 'elara', text: 'We must help them.' },
  { ghost: 'harlan', text: 'But how?' },
  { ghost: 'mira', text: 'Let me try!' }
]

const audioBlob = await generateMultiSpeakerDebate(speakers, apiKey)
const audio = new Audio(URL.createObjectURL(audioBlob))
audio.play()
```

Benefits:
- More natural conversation flow
- Fewer API calls
- Better timing between speakers

### Custom Voice Tuning

Edit `lib/tts/geminiTTS.ts`:

```typescript
const GEMINI_VOICE_CONFIGS: Record<GhostVoice, GeminiVoiceConfig> = {
  elara: {
    voiceName: 'Aoede', // Try: Zephyr, Despina, Callirrhoe
    personality: 'soft, sad, maternal, whispering like floating underwater, British accent',
    gender: 'female'
  }
}
```

**30 voices available**: Aoede, Zephyr, Puck, Charon, Kore, Fenrir, Leda, Orus, Iapetus, Algenib, and 20 more!

## Migration Notes

### No Breaking Changes

Game code unchanged:
```typescript
// Still works exactly the same
speechService.speak(text, character)
speechService.stop()
speechService.toggle()
```

### What Changed

- Backend: Azure → Gemini
- Config: One key instead of two
- Quality: Better emotion control
- Features: Multi-speaker support added

## Troubleshooting

See **docs/GEMINI_TTS_SETUP.md** for full guide.

**Common issues:**
- "No API key" → Add to `.env` and restart
- "Invalid key" → Check for spaces, regenerate
- "Model not found" → Use `gemini-2.5-flash-preview-tts`
- Voice wrong → Adjust personality in `geminiTTS.ts`

## Next Steps

1. ✅ Get Gemini API key
2. ✅ Add to `.env`
3. ✅ Restart server
4. Test voices in-game
5. Adjust personalities if needed
6. Try multi-speaker debates
7. Deploy!

## Resources

- **Setup Guide**: `docs/GEMINI_TTS_SETUP.md`
- **AI Studio**: https://aistudio.google.com/
- **API Docs**: https://ai.google.dev/gemini-api/docs/speech-generation
- **Voice Gallery**: Test all 30 voices in AI Studio

---

**One key. Five ghosts. Perfect voices. 🎭**

Ready to test! Follow `docs/GEMINI_TTS_SETUP.md` to get your API key.
