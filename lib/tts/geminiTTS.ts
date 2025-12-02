// Gemini 2.5 Text-to-Speech API integration
// Multi-speaker support with natural language emotion control
// Free tier with generous limits

import { GhostVoice } from './speechService'

interface GeminiVoiceConfig {
  voiceName: string
  personality: string // Natural language description for prompting
  gender: 'female' | 'male'
}

// Gemini 2.5 has 30 prebuilt voices - choosing best matches for each ghost
// Personalities match detailed ElevenLabs voice profiles for consistency
const GEMINI_VOICE_CONFIGS: Record<GhostVoice, GeminiVoiceConfig> = {
  elara: {
    // The Mournful Anchor - 1940s Elegance, Ethereal, Breathless, Sorrowful
    // ElevenLabs equivalent: Bella (Soft, Narration) or Rachel (Calm)
    voiceName: 'Aoede', // Breezy, ethereal quality
    personality: 'soft-spoken British woman in her 30s, whispering a lullaby, sad and elegant, 1940s radio drama style but very quiet, breathy whisper-like delivery, speaking like floating underwater, high elegance with low energy',
    gender: 'female'
  },
  harlan: {
    // The Glitching Scientist - Intellectual, Frantic, Confusion, Fragmented
    // ElevenLabs equivalent: Clyde (Deep, texture) or Fin (Energetic/Crazy)
    voiceName: 'Algenib', // Gravelly, textured
    personality: 'older male scientist in his 50s-60s, frantic and confused, raspy textured voice, speaking quickly, intelligent but terrified, sounds like a professor who hasn\'t slept in a year, American accent, slightly strained delivery',
    gender: 'male'
  },
  mira: {
    // The Forgotten Child - Innocent, Timid, Whispery, Fragile
    // ElevenLabs equivalent: Gigi (Child) or Jessie (Soft)
    voiceName: 'Leda', // Youthful
    personality: 'young girl around 6-8 years old whispering a secret, scared and timid, very soft almost a whisper, genuine fear not cartoony, fragile and innocent, American accent, trying not to be seen',
    gender: 'female'
  },
  theo: {
    // The Dramatic Coward - Theatrical, Romantic, Anxious, Breathless
    // ElevenLabs equivalent: Daniel (Authoritative British) or George (Warm British)
    voiceName: 'Iapetus', // Clear, good for dramatic delivery
    personality: 'British theater actor in his 30s whispering a confession, dramatic and theatrical, deep baritone voice but anxious and breathless, speaking fast with romantic flair, posh British accent, like performing on stage',
    gender: 'male'
  },
  selene: {
    // The Sharp Professional - Cold, Sharp, Intelligent, Softening
    // ElevenLabs equivalent: Charlotte (Narrative/Seductive) or Dorothy (Firm)
    voiceName: 'Kore', // Firm, professional
    personality: 'strict corporate lawyer in her 30s, serious and sharp, American Mid-Atlantic accent, lower alto pitch, clear articulation, firm and cold but hiding sadness underneath, precise and authoritative',
    gender: 'female'
  },
  narrator: {
    // Deep, atmospheric storytelling - Gothic-Cyberpunk narrator
    voiceName: 'Orus', // Firm, narrative
    personality: 'calm atmospheric storyteller, deep resonant voice, Gothic-Cyberpunk narrator, mysterious and immersive',
    gender: 'male'
  }
}

export async function generateGeminiTTS(
  text: string,
  character: GhostVoice,
  apiKey: string
): Promise<Blob> {
  const config = GEMINI_VOICE_CONFIGS[character]
  
  // Build natural language prompt with personality
  const prompt = `Say this as ${config.personality}: "${text}"`
  
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: config.voiceName
              }
            }
          }
        }
      })
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini TTS API error: ${response.status} - ${error}`)
  }

  const result = await response.json()
  
  // Extract base64 audio data from response
  const audioData = result.candidates[0].content.parts[0].inlineData.data
  
  // Convert base64 to blob
  const binaryString = atob(audioData)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  
  return new Blob([bytes], { type: 'audio/wav' })
}

// Multi-speaker debate generation (for ghost council debates)
export async function generateMultiSpeakerDebate(
  speakers: Array<{ ghost: GhostVoice; text: string }>,
  apiKey: string
): Promise<Blob> {
  // Build multi-speaker transcript
  let transcript = 'TTS the following conversation:\n\n'
  
  speakers.forEach(({ ghost, text }) => {
    const config = GEMINI_VOICE_CONFIGS[ghost]
    const speakerName = ghost.charAt(0).toUpperCase() + ghost.slice(1)
    transcript += `${speakerName}: ${text}\n`
  })
  
  // Build speaker configs
  const speakerVoiceConfigs = speakers.map(({ ghost }) => {
    const config = GEMINI_VOICE_CONFIGS[ghost]
    const speakerName = ghost.charAt(0).toUpperCase() + ghost.slice(1)
    
    return {
      speaker: speakerName,
      voiceConfig: {
        prebuiltVoiceConfig: {
          voiceName: config.voiceName
        }
      }
    }
  })
  
  // Add personality instructions
  const personalityInstructions = speakers.map(({ ghost }) => {
    const config = GEMINI_VOICE_CONFIGS[ghost]
    const speakerName = ghost.charAt(0).toUpperCase() + ghost.slice(1)
    return `Make ${speakerName} sound ${config.personality}`
  }).join('. ')
  
  const prompt = `${personalityInstructions}.\n\n${transcript}`
  
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            multiSpeakerVoiceConfig: {
              speakerVoiceConfigs
            }
          }
        }
      })
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini TTS API error: ${response.status} - ${error}`)
  }

  const result = await response.json()
  const audioData = result.candidates[0].content.parts[0].inlineData.data
  
  const binaryString = atob(audioData)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  
  return new Blob([bytes], { type: 'audio/wav' })
}
