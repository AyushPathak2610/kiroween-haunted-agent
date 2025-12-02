# Azure Text-to-Speech Setup Guide

## Why Azure TTS?

✅ **500,000 FREE characters/month** (vs Google's 1M but Azure has better voices)
✅ **Neural voices with emotions** (SSML support for sad, cheerful, calm, etc.)
✅ **Full voice control** (pitch, rate, volume, pauses)
✅ **No credit card required** for first 12 months
✅ **Perfect for ghost characters** with emotional delivery

## Quick Setup (5 minutes)

### Step 1: Create Free Azure Account

1. Go to: https://azure.microsoft.com/free/
2. Click "Start free"
3. Sign in with Microsoft account (or create one)
4. **No credit card required** for free tier

### Step 2: Create Speech Resource

1. Go to Azure Portal: https://portal.azure.com/
2. Click "Create a resource"
3. Search for "Speech"
4. Click "Speech" by Microsoft
5. Click "Create"

**Configuration:**
- **Subscription**: Free Trial (or your subscription)
- **Resource Group**: Create new → "shadowed-haven-tts"
- **Region**: Choose closest (e.g., East US, West Europe)
- **Name**: "shadowed-haven-speech"
- **Pricing Tier**: **Free F0** (500k chars/month)

6. Click "Review + Create"
7. Click "Create"
8. Wait ~1 minute for deployment

### Step 3: Get Your API Key

1. After deployment, click "Go to resource"
2. In left menu, click "Keys and Endpoint"
3. Copy **Key 1** (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)
4. Copy **Location/Region** (e.g., `eastus`, `westus2`, `westeurope`)

### Step 4: Add to .env File

Open your `.env` file and add:

```bash
NEXT_PUBLIC_AZURE_TTS_API_KEY=your_key_here
NEXT_PUBLIC_AZURE_TTS_REGION=eastus
```

Replace:
- `your_key_here` with your Key 1
- `eastus` with your region

### Step 5: Restart Dev Server

```bash
npm run dev
```

Done! Your ghosts now have voices with emotions.

## Character Voice Profiles

### Elara (The Mournful Anchor)
- **Voice**: `en-GB-SoniaNeural` (British female, warm)
- **Style**: Sad, ethereal
- **Rate**: -15% (slow, deliberate)
- **Pitch**: +5% (slightly higher, ghostly)

### Harlan (The Glitching Scientist)
- **Voice**: `en-US-GuyNeural` (American male, mature)
- **Style**: Newscast (clear but confused)
- **Rate**: -10% (measured, thoughtful)
- **Pitch**: -10% (deeper, authoritative)

### Mira (The Forgotten Child)
- **Voice**: `en-US-JennyNeural` (American female, youthful)
- **Style**: Cheerful (subtle - she's scared)
- **Rate**: +5% (childlike energy)
- **Pitch**: +20% (higher for child)

### Theo (The Dramatic Coward)
- **Voice**: `en-GB-RyanNeural` (British male, clear)
- **Style**: Sad, dramatic
- **Rate**: -5% (theatrical pauses)
- **Pitch**: -5% (baritone)

### Selene (The Sharp Professional)
- **Voice**: `en-US-AriaNeural` (American female, professional)
- **Style**: Newscast-formal (cold, controlled)
- **Rate**: -20% (very deliberate)
- **Pitch**: -5% (lower, alto)

### Narrator
- **Voice**: `en-US-DavisNeural` (American male, narrative)
- **Style**: Calm, atmospheric
- **Rate**: -10% (slow, immersive)

## SSML Features Used

The system automatically adds:

- **Dramatic pauses**: `...` → 800ms break
- **Sentence pauses**: `.` → 400ms break
- **Question pauses**: `?` → 500ms break
- **Breath pauses**: `,` → 200ms break
- **Emotional styles**: Sad, cheerful, calm, newscast-formal
- **Voice modulation**: Pitch, rate, volume per character

## Cost Estimation

**Free Tier**: 500,000 characters/month

Average playthrough:
- Intro: ~500 chars
- 5 rooms: ~3,000 chars
- Debates: ~2,000 chars
- **Total**: ~5,500 chars/playthrough

**Free tier allows**: ~90 playthroughs/month

## Troubleshooting

### "No Azure API key found"
- Check `.env` file has `NEXT_PUBLIC_AZURE_TTS_API_KEY`
- Restart dev server after adding key

### "Invalid API key"
- Verify you copied Key 1 (not Key 2)
- Check for extra spaces in `.env`
- Regenerate key in Azure Portal if needed

### "Region not found"
- Check `NEXT_PUBLIC_AZURE_TTS_REGION` matches your resource region
- Common regions: `eastus`, `westus2`, `westeurope`, `southeastasia`

### "Quota exceeded"
- Free tier: 500k chars/month
- Check usage: Azure Portal → Speech resource → Metrics
- Upgrade to Standard S0 ($1 per 1M chars) if needed

### Voice sounds robotic
- Azure uses Neural voices (high quality)
- Check you're using Neural voice names (e.g., `en-US-JennyNeural`)
- SSML styles require Neural voices

## Testing Your Setup

Run this in browser console after starting the game:

```javascript
// Test Elara's voice
speechService.speak("Welcome, traveler. I am Elara.", 'elara')

// Test all ghosts
['elara', 'harlan', 'mira', 'theo', 'selene'].forEach((ghost, i) => {
  setTimeout(() => {
    speechService.speak(`Hello from ${ghost}`, ghost)
  }, i * 3000)
})
```

## Advanced: Custom Voice Tuning

Edit `lib/tts/azureTTS.ts` to adjust:

```typescript
const AZURE_VOICE_CONFIGS: Record<GhostVoice, AzureVoiceConfig> = {
  elara: {
    voiceName: 'en-GB-SoniaNeural',
    style: 'sad',
    styleDegree: '1.5', // 0.01 to 2.0 (higher = more emotional)
    rate: '-15%',       // -50% to +100%
    pitch: '+5%',       // -50% to +50%
    volume: '85'        // 0 to 100
  }
}
```

## Resources

- **Azure Speech Studio**: https://speech.microsoft.com/portal
  - Test voices live
  - Hear all Neural voices
  - Try SSML editor
  
- **Voice Gallery**: https://speech.microsoft.com/portal/voicegallery
  - Browse 400+ voices
  - Filter by language, gender, style
  
- **SSML Reference**: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup
  - Full SSML documentation
  - Advanced prosody control

## Next Steps

1. ✅ Set up Azure TTS (you're here!)
2. Test voices in-game
3. Adjust voice settings in `azureTTS.ts` if needed
4. Generate static audio files for key scenes (optional)
5. Deploy to production (API key works in production too)

---

**Need help?** Check the Azure Speech documentation or open an issue on GitHub.
