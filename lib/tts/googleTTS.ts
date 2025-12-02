// Google Cloud Text-to-Speech Integration
// Free tier: 1 million characters/month
// Docs: https://cloud.google.com/text-to-speech/docs

import { GhostVoice } from './speechService'

interface GoogleTTSConfig {
  voiceName: string
  languageCode: string
  ssmlGender: 'MALE' | 'FEMALE' | 'NEUTRAL'
  pitch: number // -20.0 to 20.0
  speakingRate: number // 0.25 to 4.0
  volumeGainDb: number // -96.0 to 16.0
}

// Voice configurations optimized for each character
const GOOGLE_VOICE_CONFIGS: Record<GhostVoice, GoogleTTSConfig> = {
  elara: {
    // The Mournful Anchor - Soft, breathy, British woman
    voiceName: 'en-GB-Wavenet-A', // British female, soft
    languageCode: 'en-GB',
    ssmlGender: 'FEMALE',
    pitch: 2.0, // Slightly higher, ethereal
    speakingRate: 0.75, // Slow, deliberate
    volumeGainDb: -2.0 // Slightly quieter, whisper-like
  },
  harlan: {
    // The Glitching Scientist - Raspy, confused, older American male
    voiceName: 'en-US-Wavenet-D', // American male, deep
    languageCode: 'en-US',
    ssmlGender: 'MALE',
    pitch: -3.0, // Lower, older voice
    speakingRate: 0.85, // Slightly slower, confused
    volumeGainDb: 0.0
  },
  mira: {
    // The Forgotten Child - Soft, timid, young girl
    voiceName: 'en-US-Wavenet-E', // American female, young-sounding
    languageCode: 'en-US',
    ssmlGender: 'FEMALE',
    pitch: 8.0, // Much higher for child voice
    speakingRate: 0.95, // Natural child pace
    volumeGainDb: -3.0 // Quieter, timid
  },
  theo: {
    // The Dramatic Coward - Theatrical, British, baritone
    voiceName: 'en-GB-Wavenet-B', // British male, expressive
    languageCode: 'en-GB',
    ssmlGender: 'MALE',
    pitch: -1.0, // Slightly lower, baritone
    speakingRate: 0.9, // Deliberate, theatrical
    volumeGainDb: 1.0 // Slightly louder, dramatic
  },
  selene: {
    // The Sharp Professional - Cold, firm, American woman
    voiceName: 'en-US-Wavenet-C', // American female, clear
    languageCode: 'en-US',
    ssmlGender: 'FEMALE',
    pitch: -2.0, // Lower pitch, alto range
    speakingRate: 0.75, // Slow, deliberate, commanding
    volumeGainDb: 0.5 // Clear, authoritative
  },
  narrator: {
    // Deep, atmospheric narrator
    voiceName: 'en-US-Wavenet-D', // American male, deep
    languageCode: 'en-US',
    ssmlGender: 'MALE',
    pitch: -4.0, // Deep, ominous
    speakingRate: 0.9, // Measured pace
    volumeGainDb: 0.0
  }
}

// Add emotional SSML markup based on character
function addEmotionalSSML(text: string, character: GhostVoice): string {
  let ssml = '<speak>'
  
  // Character-specific emotional markup
  switch (character) {
    case 'elara':
      // Soft, sad, with pauses
      ssml += `<prosody rate="slow" pitch="+2st" volume="soft">`
      ssml += text.replace(/\.\.\./g, '<break time="800ms"/>')
      ssml += '</prosody>'
      break
      
    case 'harlan':
      // Confused, fragmented, with stutters
      ssml += `<prosody rate="medium" pitch="-3st">`
      // Add emphasis on key words
      ssml += text.replace(/\b(remember|fragments|wrong|scattered)\b/gi, '<emphasis level="strong">$1</emphasis>')
      ssml += '</prosody>'
      break
      
    case 'mira':
      // Childlike, excited, with natural pauses
      ssml += `<prosody rate="medium" pitch="+8st" volume="soft">`
      ssml += text.replace(/!/g, '!<break time="300ms"/>')
      ssml += '</prosody>'
      break
      
    case 'theo':
      // Dramatic, theatrical, with emphasis
      ssml += `<prosody rate="slow" pitch="-1st" volume="medium">`
      ssml += text.replace(/\b(sorry|forgive|coward|ran)\b/gi, '<emphasis level="strong">$1</emphasis>')
      ssml += '</prosody>'
      break
      
    case 'selene':
      // Cold, firm, deliberate
      ssml += `<prosody rate="slow" pitch="-2st" volume="medium">`
      ssml += text.replace(/\./g, '.<break time="400ms"/>')
      ssml += '</prosody>'
      break
      
    case 'narrator':
      // Deep, atmospheric
      ssml += `<prosody rate="medium" pitch="-4st">`
      ssml += text.replace(/\.\.\./g, '<break time="1s"/>')
      ssml += '</prosody>'
      break
  }
  
  ssml += '</speak>'
  return ssml
}

export async function generateGoogleTTS(
  text: string,
  character: GhostVoice,
  apiKey: string
): Promise<Blob> {
  const config = GOOGLE_VOICE_CONFIGS[character]
  const ssmlText = addEmotionalSSML(text, character)
  
  const requestBody = {
    input: {
      ssml: ssmlText
    },
    voice: {
      languageCode: config.languageCode,
      name: config.voiceName,
      ssmlGender: config.ssmlGender
    },
    audioConfig: {
      audioEncoding: 'MP3',
      pitch: config.pitch,
      speakingRate: config.speakingRate,
      volumeGainDb: config.volumeGainDb,
      effectsProfileId: ['headphone-class-device'] // Optimized for headphones
    }
  }
  
  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }
  )
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Google TTS API error: ${error.error?.message || response.statusText}`)
  }
  
  const data = await response.json()
  
  // Convert base64 audio to blob
  const audioContent = data.audioContent
  const binaryString = atob(audioContent)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  
  return new Blob([bytes], { type: 'audio/mpeg' })
}

// List of available WaveNet voices for reference
export const AVAILABLE_VOICES = {
  'en-US': {
    male: ['en-US-Wavenet-A', 'en-US-Wavenet-B', 'en-US-Wavenet-D', 'en-US-Wavenet-I', 'en-US-Wavenet-J'],
    female: ['en-US-Wavenet-C', 'en-US-Wavenet-E', 'en-US-Wavenet-F', 'en-US-Wavenet-G', 'en-US-Wavenet-H']
  },
  'en-GB': {
    male: ['en-GB-Wavenet-B', 'en-GB-Wavenet-D'],
    female: ['en-GB-Wavenet-A', 'en-GB-Wavenet-C', 'en-GB-Wavenet-F']
  }
}
