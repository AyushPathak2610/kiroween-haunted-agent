// PlayHT Text-to-Speech API integration
// Free tier: 12,500 characters/month
// No strict per-minute rate limits
// Full voice control with emotions

import { GhostVoice } from './speechService'

interface PlayHTVoiceConfig {
  voiceId: string
  voiceEngine: string
  personality: string
  speed: number // 0.5 to 2.0
  temperature: number // 0 to 2.0 (emotion variance)
}

// PlayHT voice IDs - choosing best matches for each ghost personality
const PLAYHT_VOICE_CONFIGS: Record<GhostVoice, PlayHTVoiceConfig> = {
  elara: {
    // The Mournful Anchor - British, Ethereal, Breathless, Sorrowful
    voiceId: 's3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json',
    voiceEngine: 'PlayHT2.0',
    personality: 'soft-spoken British woman in her 30s, whispering a lullaby, sad and elegant, 1940s radio drama style, breathy whisper-like delivery, speaking like floating underwater',
    speed: 0.85, // Slow, deliberate
    temperature: 0.8 // More emotional variance
  },
  harlan: {
    // The Glitching Scientist - American, Frantic, Confused
    voiceId: 's3://voice-cloning-zero-shot/775ae416-49bb-4fb6-bd45-740f205d20a1/male-cs/manifest.json',
    voiceEngine: 'PlayHT2.0',
    personality: 'older male scientist 50s-60s, frantic and confused, raspy textured voice, speaking quickly, intelligent but terrified, sounds like a professor who hasn\'t slept',
    speed: 0.9, // Measured but slightly fast
    temperature: 1.2 // High variance for confusion
  },
  mira: {
    // The Forgotten Child - Innocent, Timid, Whispery
    voiceId: 's3://voice-cloning-zero-shot/baf1c856-a0b8-4a38-a5e0-6d5f2b8e3e3a/female-cs/manifest.json',
    voiceEngine: 'PlayHT2.0',
    personality: 'young girl 6-8 years old whispering a secret, scared and timid, very soft almost a whisper, genuine fear not cartoony, fragile and innocent',
    speed: 1.0, // Normal childlike pace
    temperature: 0.9 // Emotional but not too varied
  },
  theo: {
    // The Dramatic Coward - British, Theatrical, Anxious
    voiceId: 's3://voice-cloning-zero-shot/e040bd1b-f190-4bdb-83f0-75ef85b18f84/male-cs/manifest.json',
    voiceEngine: 'PlayHT2.0',
    personality: 'British theater actor in his 30s whispering a confession, dramatic and theatrical, deep baritone but anxious and breathless, speaking fast with romantic flair, posh British accent',
    speed: 0.95, // Slightly slow for drama
    temperature: 1.3 // Very dramatic variance
  },
  selene: {
    // The Sharp Professional - American, Cold, Controlled
    voiceId: 's3://voice-cloning-zero-shot/d82d246c-148b-457f-9668-37b789520891/female-cs/manifest.json',
    voiceEngine: 'PlayHT2.0',
    personality: 'strict corporate lawyer in her 30s, serious and sharp, American Mid-Atlantic accent, lower alto pitch, clear articulation, firm and cold but hiding sadness',
    speed: 0.8, // Very deliberate, cold
    temperature: 0.3 // Low variance, controlled
  },
  narrator: {
    // Deep, atmospheric storytelling
    voiceId: 's3://voice-cloning-zero-shot/775ae416-49bb-4fb6-bd45-740f205d20a1/male-cs/manifest.json',
    voiceEngine: 'PlayHT2.0',
    personality: 'calm atmospheric storyteller, deep resonant voice, Gothic-Cyberpunk narrator, mysterious and immersive',
    speed: 0.85, // Slow, immersive
    temperature: 0.5 // Balanced
  }
}

export async function generatePlayHTTTS(
  text: string,
  character: GhostVoice,
  apiKey: string,
  userId: string
): Promise<Blob> {
  const config = PLAYHT_VOICE_CONFIGS[character]
  
  // Add personality instruction to text
  const enhancedText = `[${config.personality}] ${text}`
  
  const response = await fetch(
    'https://api.play.ht/api/v2/tts',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-User-ID': userId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: enhancedText,
        voice: config.voiceId,
        voice_engine: config.voiceEngine,
        speed: config.speed,
        temperature: config.temperature,
        output_format: 'mp3',
        quality: 'medium'
      })
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`PlayHT TTS API error: ${response.status} - ${error}`)
  }

  // PlayHT returns audio directly
  return await response.blob()
}
