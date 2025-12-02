# Gemini 2.5 Text-to-Speech Setup Guide

## Why Gemini TTS?

✅ **Same API key as your AI agents** - One key for everything!
✅ **Multi-speaker support** - Each ghost gets their own voice
✅ **30 voice options** - Perfect personality matching
✅ **Natural language control** - "Say sadly", "whisper", "sound excited"
✅ **FREE tier** - Generous limits with Gemini API
✅ **No SSML needed** - Just describe emotions in plain English

## Quick Setup (2 minutes)

### Step 1: Get Gemini API Key

1. Go to: https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

**That's it!** Same key powers both your AI agents AND their voices.

### Step 2: Add to .env File

Open your `.env` file and add:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...your_key_here
```

### Step 3: Restart Dev Server

```bash
npm run dev
```

Done! Your 5 ghosts now have unique voices with emotions.

## Character Voice Profiles

Each ghost has been matched to a Gemini voice that fits their personality:

### 1. Elara Voss (The Mournful Anchor)
- **Voice**: `Aoede` (Breezy, ethereal)
- **Personality**: "soft-spoken British woman in her 30s, whispering a lullaby, sad and elegant, 1940s radio drama style but very quiet, breathy whisper-like delivery, speaking like floating underwater"
- **Gender**: Female
- **Vibe**: 1940s elegance, ethereal, breathless, sorrowful
- **ElevenLabs Equivalent**: Bella (Soft, Narration) or Rachel (Calm)
- **Role**: The guide. Sad but warm. High elegance, low energy.

### 2. Dr. Harlan Voss (The Glitching Scientist)
- **Voice**: `Algenib` (Gravelly, textured)
- **Personality**: "older male scientist in his 50s-60s, frantic and confused, raspy textured voice, speaking quickly, intelligent but terrified, sounds like a professor who hasn't slept in a year"
- **Gender**: Male
- **Vibe**: Intellectual, frantic, confusion, fragmented
- **ElevenLabs Equivalent**: Clyde (Deep, texture) or Fin (Energetic/Crazy)
- **Role**: Tortured genius. Shifts from lucid academic to confused rambler.

### 3. Mira Voss (The Forgotten Child)
- **Voice**: `Leda` (Youthful)
- **Personality**: "young girl around 6-8 years old whispering a secret, scared and timid, very soft almost a whisper, genuine fear not cartoony, fragile and innocent"
- **Gender**: Female
- **Vibe**: Innocent, timid, whispery, fragile
- **ElevenLabs Equivalent**: Gigi (Child) or Jessie (Soft)
- **Role**: The hidden objective. Scared and trying not to be seen.

### 4. Theo Voss (The Dramatic Coward)
- **Voice**: `Iapetus` (Clear, dramatic)
- **Personality**: "British theater actor in his 30s whispering a confession, dramatic and theatrical, deep baritone voice but anxious and breathless, speaking fast with romantic flair, posh British accent"
- **Gender**: Male
- **Vibe**: Theatrical, romantic, anxious, breathless
- **ElevenLabs Equivalent**: Daniel (Authoritative British) or George (Warm British)
- **Role**: The tragic brother. Speaks like on stage, whispering a confession.

### 5. Selene Ashford (The Sharp Professional)
- **Voice**: `Kore` (Firm, professional)
- **Personality**: "strict corporate lawyer in her 30s, serious and sharp, American Mid-Atlantic accent, lower alto pitch, clear articulation, firm and cold but hiding sadness underneath"
- **Gender**: Female
- **Vibe**: Cold, sharp, intelligent, softening
- **ElevenLabs Equivalent**: Charlotte (Narrative/Seductive) or Dorothy (Firm)
- **Role**: The skeptic. Speaks with precision and authority that breaks down into sadness.

### 6. Narrator
- **Voice**: `Orus` (Firm, narrative)
- **Personality**: "calm atmospheric storyteller, deep resonant voice, Gothic-Cyberpunk narrator, mysterious and immersive"
- **Gender**: Male
- **Vibe**: Gothic-cyberpunk atmosphere
- **Role**: Atmospheric storytelling for scene transitions

## How It Works

### Single Speaker (Individual Ghost Lines)

When a ghost speaks alone, the system uses natural language prompts:

```typescript
// Elara speaking
speak("Welcome, traveler. I am Elara.", 'elara')

// Behind the scenes:
// Prompt: "Say this as soft, sad, maternal, whispering like floating 
//         underwater, British accent: 'Welcome, traveler. I am Elara.'"
// Voice: Aoede (Breezy)
```

### Multi-Speaker (Ghost Debates)

For debates, Gemini can generate entire conversations with multiple voices:

```typescript
// Ghost council debate
const speakers = [
  { ghost: 'elara', text: 'We must help them remember.' },
  { ghost: 'harlan', text: 'But... what if the truth hurts?' },
  { ghost: 'mira', text: 'I want Mommy and Daddy to see me!' }
]

generateMultiSpeakerDebate(speakers, apiKey)
```

This generates ONE audio file with all 3 voices in sequence!

## Natural Language Emotion Control

You can control emotions just by describing them:

```typescript
// Sad whisper
"Say in a sad whisper: I miss my family"

// Excited child
"Say excitedly like a 6 year old: Yay! Let's play!"

// Cold and firm
"Say coldly and professionally: That's not acceptable"

// Dramatic theater
"Say dramatically like a stage actor: Brother... forgive me"
```

## Available Voices (30 Total)

Gemini 2.5 TTS has 30 prebuilt voices. Here are some good options for ghosts:

**Female Voices:**
- `Aoede` - Breezy (Elara)
- `Leda` - Youthful (Mira)
- `Kore` - Firm (Selene)
- `Zephyr` - Bright
- `Despina` - Smooth
- `Callirrhoe` - Easy-going

**Male Voices:**
- `Algenib` - Gravelly (Harlan)
- `Iapetus` - Clear (Theo)
- `Orus` - Firm (Narrator)
- `Puck` - Upbeat
- `Charon` - Informative
- `Fenrir` - Excitable

**Test all voices**: https://aistudio.google.com/

## Ghost Debate Example

Here's how the ghost council debates work:

```typescript
// 5 ghosts debating player's choice
const debate = [
  { 
    ghost: 'elara', 
    text: 'The weaver shows compassion. This is the path of healing.' 
  },
  { 
    ghost: 'harlan', 
    text: 'Logically... yes. But emotions are not always logical.' 
  },
  { 
    ghost: 'mira', 
    text: 'I like them! They play nice!' 
  },
  { 
    ghost: 'theo', 
    text: 'Perhaps... perhaps there is hope for redemption after all.' 
  },
  { 
    ghost: 'selene', 
    text: 'Actions speak louder than words. We shall see.' 
  }
]

// Generates ONE audio file with all 5 voices!
generateMultiSpeakerDebate(debate, geminiApiKey)
```

## Cost & Limits

**Gemini API Free Tier:**
- 15 requests per minute
- 1,500 requests per day
- 1 million requests per month

**Average game playthrough:**
- ~50 TTS requests (individual lines)
- ~5 multi-speaker debates
- **Total**: ~55 requests per playthrough

**Free tier allows**: ~27,000 playthroughs/month (way more than you need!)

## Troubleshooting

### "No Gemini API key found"
- Check `.env` file has `NEXT_PUBLIC_GEMINI_API_KEY`
- Restart dev server after adding key
- Make sure key starts with `AIza`

### "Invalid API key"
- Verify you copied the full key from AI Studio
- Check for extra spaces in `.env`
- Regenerate key if needed: https://aistudio.google.com/apikey

### "Model not found"
- Gemini 2.5 TTS is in Preview
- Use model: `gemini-2.5-flash-preview-tts`
- Check API documentation for updates

### Voice sounds wrong
- Adjust personality description in `geminiTTS.ts`
- Try different voice from the 30 available
- Add more emotion keywords ("whisper", "slowly", "dramatically")

### Audio not playing
- Check browser console for errors
- Verify audio autoplay is enabled
- Test with: `speechService.speak("Test", 'elara')`

## Testing Your Setup

Open browser console after starting the game:

```javascript
// Test single ghost
speechService.speak("Hello, I am Elara", 'elara')

// Test all 5 ghosts
['elara', 'harlan', 'mira', 'theo', 'selene'].forEach((ghost, i) => {
  setTimeout(() => {
    speechService.speak(`This is ${ghost} speaking`, ghost)
  }, i * 4000)
})
```

## Advanced: Custom Voice Tuning

Edit `lib/tts/geminiTTS.ts` to customize:

```typescript
const GEMINI_VOICE_CONFIGS: Record<GhostVoice, GeminiVoiceConfig> = {
  elara: {
    voiceName: 'Aoede', // Change to any of 30 voices
    personality: 'soft, sad, maternal, whispering like floating underwater, British accent',
    gender: 'female'
  }
}
```

**Personality tips (based on ElevenLabs voice design):**
- **Emotion**: "sad", "happy", "scared", "angry", "confused", "theatrical"
- **Pace**: "slowly", "quickly", "breathlessly", "fast-paced", "deliberate"
- **Style**: "whispering", "shouting", "singing", "breathy", "raspy", "textured"
- **Accent**: "British", "American", "Mid-Atlantic", "Posh British", "Transatlantic"
- **Age**: "childlike", "elderly", "youthful", "30s", "50s-60s", "6-8 years old"
- **Character**: "like a theater actor", "like a professor", "like a lawyer", "like floating underwater"
- **Energy**: "high elegance low energy", "frantic", "timid", "firm", "cold"

**Ghost-specific effects (post-processing in audio editor):**
- **Elara**: Add wet reverb (Hall/Cathedral), cut high frequencies slightly, add subtle chorus for "underwater" effect
- **Harlan**: Add bitcrusher for digital/glitchy sound, manually stutter audio for fragmented speech
- **Mira**: Pitch shift up 1-2 semitones if needed, add ping-pong delay for "tiny ghost" effect
- **Theo**: Add wet reverb for theatrical stage presence
- **Selene**: Keep dry and clear, minimal reverb for cold professional sound
- **All**: Apply "Ghost Reverb" (wet hall/cathedral setting) to push voices back in mix

## Multi-Speaker Debates (Advanced)

The system can generate entire debates as ONE audio file:

```typescript
import { generateMultiSpeakerDebate } from '@/lib/tts/geminiTTS'

const speakers = [
  { ghost: 'elara', text: 'We must help them.' },
  { ghost: 'harlan', text: 'But how?' },
  { ghost: 'mira', text: 'Let me try!' }
]

const audioBlob = await generateMultiSpeakerDebate(
  speakers, 
  geminiApiKey
)

// Play the debate
const audio = new Audio(URL.createObjectURL(audioBlob))
audio.play()
```

This is more efficient than individual calls and sounds more natural!

## Comparison: Gemini vs Others

| Feature | Gemini 2.5 | Azure | ElevenLabs |
|---------|-----------|-------|------------|
| **Free Tier** | 1.5M req/month | 500k chars/month | 10k chars/month |
| **Multi-speaker** | ✅ Native | ❌ No | ❌ No |
| **Emotion Control** | ✅ Natural language | ✅ SSML | ✅ API params |
| **Voice Options** | 30 voices | 400+ voices | 1000+ voices |
| **Setup** | 1 API key | Separate account | Separate account |
| **Quality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Best For** | Multi-speaker games | Enterprise | Voice cloning |

**Winner for this project**: Gemini (same key, multi-speaker, natural control)

## Resources

- **AI Studio**: https://aistudio.google.com/
  - Get API key
  - Test voices live
  - Try prompts
  
- **Voice Gallery**: https://aistudio.google.com/
  - Hear all 30 voices
  - Test different personalities
  
- **API Docs**: https://ai.google.dev/gemini-api/docs/speech-generation
  - Full TTS documentation
  - Code examples

## Next Steps

1. ✅ Get Gemini API key (you're here!)
2. Add to `.env` file
3. Test voices in-game
4. Adjust personalities in `geminiTTS.ts` if needed
5. Try multi-speaker debates for ghost council
6. Deploy (same key works in production!)

---

**One key. Five voices. Infinite emotions.**
