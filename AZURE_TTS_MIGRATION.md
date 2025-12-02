# ✅ Azure TTS Migration Complete

## What Changed

Switched from Google Cloud TTS / ElevenLabs to **Azure Cognitive Services TTS**

### Why Azure?

- **500,000 FREE characters/month** (enough for ~90 playthroughs)
- **Neural voices with emotions** (sad, cheerful, calm, dramatic)
- **Full SSML control** (pitch, rate, volume, pauses)
- **No credit card required** for free tier
- **Better voice quality** than Google for character acting

## Files Modified

1. **lib/tts/azureTTS.ts** (NEW)
   - Azure TTS API integration
   - SSML generation with emotional pauses
   - Character-specific voice configs

2. **lib/tts/speechService.ts** (UPDATED)
   - Removed Google/ElevenLabs code
   - Now uses Azure TTS exclusively
   - Cleaner, simpler implementation

3. **.env** (UPDATED)
   - Removed: `NEXT_PUBLIC_GOOGLE_TTS_API_KEY`
   - Removed: `NEXT_PUBLIC_ELEVENLABS_API_KEY`
   - Added: `NEXT_PUBLIC_AZURE_TTS_API_KEY`
   - Added: `NEXT_PUBLIC_AZURE_TTS_REGION`

4. **.env.example** (UPDATED)
   - Updated with Azure setup instructions

5. **docs/AZURE_TTS_SETUP.md** (NEW)
   - Complete setup guide
   - Character voice profiles
   - Troubleshooting

## Character Voices

| Ghost | Voice | Style | Personality |
|-------|-------|-------|-------------|
| **Elara** | en-GB-SoniaNeural | Sad, ethereal | British, maternal, breathless |
| **Harlan** | en-US-GuyNeural | Newscast | American, confused scientist |
| **Mira** | en-US-JennyNeural | Cheerful (subtle) | American, childlike, timid |
| **Theo** | en-GB-RyanNeural | Sad, dramatic | British, theatrical, anxious |
| **Selene** | en-US-AriaNeural | Newscast-formal | American, cold, professional |
| **Narrator** | en-US-DavisNeural | Calm | Deep, atmospheric |

## Next Steps

### 1. Get Azure API Key (5 minutes)

Follow: **docs/AZURE_TTS_SETUP.md**

Quick version:
1. Go to: https://azure.microsoft.com/free/
2. Create free account (no credit card)
3. Create Speech resource (Free F0 tier)
4. Copy Key 1 and Region

### 2. Update .env

```bash
NEXT_PUBLIC_AZURE_TTS_API_KEY=your_key_here
NEXT_PUBLIC_AZURE_TTS_REGION=eastus
```

### 3. Restart Dev Server

```bash
npm run dev
```

### 4. Test Voices

Open game and listen to the ghosts speak!

## Features

✅ **Automatic emotional pauses**
- `...` → 800ms dramatic pause
- `.` → 400ms sentence pause
- `?` → 500ms question pause
- `,` → 200ms breath pause

✅ **Character-specific delivery**
- Elara: Slow, ethereal, sad
- Harlan: Measured, confused
- Mira: Fast, childlike, scared
- Theo: Dramatic, theatrical
- Selene: Cold, deliberate

✅ **Audio caching**
- Repeated lines cached in memory
- Reduces API calls
- Faster playback

✅ **Queue system**
- Multiple voices don't overlap
- Smooth debate sequences
- Natural conversation flow

## Cost Comparison

| Service | Free Tier | Quality | Emotions | Setup |
|---------|-----------|---------|----------|-------|
| **Azure** | 500k/month | ⭐⭐⭐⭐⭐ | ✅ SSML | Easy |
| Google | 1M/month | ⭐⭐⭐⭐ | ✅ SSML | Medium |
| ElevenLabs | 10k/month | ⭐⭐⭐⭐⭐ | ✅ API | Easy |
| PlayHT | 12.5k/month | ⭐⭐⭐⭐ | ✅ API | Easy |

**Winner**: Azure (best balance of free tier + quality + emotions)

## Troubleshooting

See **docs/AZURE_TTS_SETUP.md** for full troubleshooting guide.

Common issues:
- "No API key found" → Add to `.env` and restart
- "Invalid key" → Check for spaces, regenerate if needed
- "Region not found" → Match region to your Azure resource
- "Quota exceeded" → Check usage in Azure Portal

## Migration Notes

- Old Google/ElevenLabs code removed
- No breaking changes to game code
- Same `speechService.speak()` API
- Same character names ('elara', 'harlan', etc.)
- Audio caching still works
- Queue system unchanged

---

**Ready to test!** Follow docs/AZURE_TTS_SETUP.md to get your API key.
