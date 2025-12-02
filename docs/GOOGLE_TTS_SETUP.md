# Google Cloud Text-to-Speech Setup Guide

Get **1 million characters/month FREE** with full control over voice, pitch, speed, and emotions!

## Why Google Cloud TTS?

✅ **1,000,000 characters/month FREE** (vs ElevenLabs 10,000)  
✅ **Full control**: Pitch, speed, volume, emphasis, pauses  
✅ **SSML support**: Emotional markup, prosody control  
✅ **WaveNet voices**: High-quality neural voices  
✅ **No credit card required** for free tier  

---

## Quick Setup (5 minutes)

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com/projectcreate
2. Enter project name: `haunted-mansion-tts` (or any name)
3. Click **Create**

### Step 2: Enable Text-to-Speech API

1. Go to https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
2. Make sure your project is selected (top dropdown)
3. Click **Enable**
4. Wait ~30 seconds for activation

### Step 3: Create API Key

1. Go to https://console.cloud.google.com/apis/credentials
2. Click **+ CREATE CREDENTIALS** → **API key**
3. Copy the API key (looks like: `AIzaSyD...`)
4. Click **Restrict Key** (recommended for security)
5. Under "API restrictions":
   - Select **Restrict key**
   - Check **Cloud Text-to-Speech API**
6. Click **Save**

### Step 4: Add to Your Project

1. Open your `.env` file
2. Add the line:
   ```
   NEXT_PUBLIC_GOOGLE_TTS_API_KEY=AIzaSyD...your_key_here
   ```
3. Save the file
4. Restart your dev server

---

## Testing

Run your game and check the console:
```
TTS: Using Google Cloud Text-to-Speech (1M chars/month free)
TTS: Generating with Google Cloud TTS for elara
```

If you see this, it's working! 🎉

---

## Voice Configuration

Each character has been configured with optimal settings:

### Elara (Mournful Mother)
- Voice: `en-GB-Wavenet-A` (British female, soft)
- Pitch: +2.0 (ethereal, floating)
- Speed: 0.75 (slow, deliberate)
- Volume: Soft (whisper-like)

### Harlan (Glitching Scientist)
- Voice: `en-US-Wavenet-D` (American male, deep)
- Pitch: -3.0 (older, raspy)
- Speed: 0.85 (confused, hesitant)
- SSML: Emphasis on key words like "remember", "fragments"

### Mira (Forgotten Child)
- Voice: `en-US-Wavenet-E` (American female, young)
- Pitch: +8.0 (child voice)
- Speed: 0.95 (natural child pace)
- Volume: Soft (timid, scared)

### Theo (Dramatic Coward)
- Voice: `en-GB-Wavenet-B` (British male, expressive)
- Pitch: -1.0 (baritone)
- Speed: 0.9 (theatrical, deliberate)
- SSML: Emphasis on emotional words like "sorry", "forgive"

### Selene (Sharp Professional)
- Voice: `en-US-Wavenet-C` (American female, clear)
- Pitch: -2.0 (alto, lower)
- Speed: 0.75 (slow, commanding)
- Volume: Clear and authoritative

---

## SSML Features (Automatic)

The system automatically adds emotional markup:

### Pauses
```
"I... I remember..." → Adds 800ms pause after ellipsis
```

### Emphasis
```
"I remember everything" → <emphasis>remember</emphasis>
```

### Prosody (Speed/Pitch)
```
Elara speaks slowly with higher pitch
Harlan speaks with lower pitch and confusion
```

---

## Troubleshooting

### "API key not valid"
- Make sure you enabled the Text-to-Speech API
- Check that API restrictions allow Text-to-Speech API
- Wait a few minutes after creating the key

### "Quota exceeded"
- Free tier: 1 million characters/month
- Check usage: https://console.cloud.google.com/apis/api/texttospeech.googleapis.com/quotas
- Resets monthly

### "No audio playing"
- Check browser console for errors
- Make sure autoplay is allowed in browser
- Try clicking on the page first (autoplay policy)

### Still not working?
- The system will automatically fallback to ElevenLabs if available
- Check console logs for detailed error messages

---

## Cost Monitoring

### Free Tier Limits
- **Standard voices**: 1 million characters/month
- **WaveNet voices**: 1 million characters/month
- **After free tier**: $4 per 1 million characters

### Check Your Usage
1. Go to https://console.cloud.google.com/billing
2. Select your project
3. View **Reports** → Filter by "Text-to-Speech API"

### Typical Usage for This Game
- Average dialogue: ~50 characters
- 1 million chars = ~20,000 dialogue lines
- **You won't hit the limit** for a hackathon demo!

---

## Advanced: Custom Voices

Want to customize the voices further?

### Available WaveNet Voices

**American English (en-US):**
- Male: A, B, D, I, J
- Female: C, E, F, G, H

**British English (en-GB):**
- Male: B, D
- Female: A, C, F

### Test Voices
Use the Voice Playground:
https://cloud.google.com/text-to-speech#section-2

### Change Voice in Code
Edit `lib/tts/googleTTS.ts`:
```typescript
elara: {
  voiceName: 'en-GB-Wavenet-C', // Try different voice
  pitch: 3.0, // Adjust pitch
  speakingRate: 0.6, // Adjust speed
  // ...
}
```

---

## Security Best Practices

### Restrict Your API Key
1. Go to https://console.cloud.google.com/apis/credentials
2. Click your API key
3. Under "API restrictions":
   - Select **Restrict key**
   - Only check **Cloud Text-to-Speech API**
4. Under "Application restrictions":
   - Select **HTTP referrers**
   - Add your domain: `yourdomain.com/*`

### For Production
- Use environment variables (already done!)
- Never commit `.env` to git (already in `.gitignore`)
- Rotate keys periodically

---

## Comparison: Google vs ElevenLabs

| Feature | Google Cloud TTS | ElevenLabs |
|---------|------------------|------------|
| **Free Tier** | 1M chars/month | 10K chars/month |
| **Voice Quality** | Excellent (WaveNet) | Excellent |
| **Control** | Full (SSML) | Good |
| **Setup** | 5 minutes | 2 minutes |
| **Voices** | 50+ | 100+ |
| **Emotions** | SSML markup | Built-in |
| **Best For** | High volume, control | Quick setup, emotions |

**Recommendation**: Use Google for primary TTS, keep ElevenLabs as fallback!

---

## Support

- **Google Cloud TTS Docs**: https://cloud.google.com/text-to-speech/docs
- **SSML Reference**: https://cloud.google.com/text-to-speech/docs/ssml
- **Pricing**: https://cloud.google.com/text-to-speech/pricing
- **Voice List**: https://cloud.google.com/text-to-speech/docs/voices

---

## Next Steps

1. ✅ Set up Google Cloud TTS (you're here!)
2. Test all character voices in the game
3. Adjust voice settings in `lib/tts/googleTTS.ts` if needed
4. Generate and cache important dialogue for faster loading
5. Deploy and enjoy unlimited TTS! 🎉
