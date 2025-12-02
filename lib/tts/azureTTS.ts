// Azure Text-to-Speech API integration
// Free tier: 500,000 characters/month
// Supports SSML for emotions, pauses, pitch, rate control

import { GhostVoice } from './speechService'

interface AzureVoiceConfig {
  voiceName: string
  style?: string
  styleDegree?: string // 0.01 to 2.0
  rate?: string // 0.5 to 2.0 (or percentage like "+20%")
  pitch?: string // -50% to +50%
  volume?: string // 0 to 100
}

const AZURE_VOICE_CONFIGS: Record<GhostVoice, AzureVoiceConfig> = {
  elara: {
    // The Mournful Anchor - Ethereal, Breathless, Sorrowful
    // Voice: Cora Multilingual - melancholy, empathetic, understanding
    voiceName: 'en-US-CoraMultilingualNeural', // Empathetic, melancholy
    style: 'sad',
    styleDegree: '2.0', // Maximum sadness
    rate: '-20%', // Very slow, mournful
    pitch: '+3%', // Slightly higher, ethereal
    volume: '80' // Softer, more distant
  },
  harlan: {
    // The Glitching Scientist - American, Frantic, Confused
    voiceName: 'en-US-GuyNeural', // American male, mature
    style: 'newscast', // Clear but can sound confused
    styleDegree: '1.2',
    rate: '-10%', // Measured, thoughtful
    pitch: '-10%', // Deeper, authoritative
    volume: '80'
  },
  mira: {
    // The Forgotten Child - Innocent, Timid, Whispery
    // Voice: Evelyn Multilingual - youthful, casual
    voiceName: 'en-US-EvelynMultilingualNeural', // Youthful voice
    style: 'cheerful',
    styleDegree: '0.5', // Very subtle (she's scared)
    rate: '+5%', // Slightly faster, childlike energy
    pitch: '+25%', // Higher pitch for child
    volume: '90'
  },
  theo: {
    // The Dramatic Coward - British, Theatrical, Anxious
    voiceName: 'en-GB-RyanNeural', // British male, clear
    style: 'sad',
    styleDegree: '1.3',
    rate: '-5%', // Dramatic pauses
    pitch: '-5%', // Baritone
    volume: '85'
  },
  selene: {
    // The Sharp Professional - American, Cold, Controlled
    // Voice: Nancy Multilingual - confident, professional, authoritative
    voiceName: 'en-US-NancyMultilingualNeural', // Confident, authoritative
    style: 'newscast-formal',
    styleDegree: '1.8', // Very controlled
    rate: '-20%', // Very deliberate, cold
    pitch: '-8%', // Lower, alto range
    volume: '80'
  },
  narrator: {
    // Deep, atmospheric storytelling
    // Voice: Serena Multilingual - mature, formal, commanding
    voiceName: 'en-US-SerenaMultilingualNeural', // Mature, formal, commanding
    style: 'calm',
    styleDegree: '1.0',
    rate: '-10%', // Slow, immersive
    pitch: '-5%',
    volume: '85'
  }
}

function buildSSML(text: string, character: GhostVoice): string {
  const config = AZURE_VOICE_CONFIGS[character]
  
  // Add emotional pauses based on character
  let processedText = text
  
  // Add SSML breaks for dramatic effect
  processedText = processedText.replace(/\.\.\./g, '<break time="800ms"/>')
  processedText = processedText.replace(/\. /g, '.<break time="400ms"/> ')
  processedText = processedText.replace(/\? /g, '?<break time="500ms"/> ')
  processedText = processedText.replace(/! /g, '!<break time="400ms"/> ')
  processedText = processedText.replace(/, /g, ',<break time="200ms"/> ')
  
  // Build SSML
  let ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">`
  ssml += `<voice name="${config.voiceName}">`
  
  // Add style if supported
  if (config.style) {
    ssml += `<mstts:express-as style="${config.style}" styledegree="${config.styleDegree}">`
  }
  
  // Add prosody (rate, pitch, volume)
  ssml += `<prosody rate="${config.rate}" pitch="${config.pitch}" volume="${config.volume}">`
  ssml += processedText
  ssml += `</prosody>`
  
  if (config.style) {
    ssml += `</mstts:express-as>`
  }
  
  ssml += `</voice>`
  ssml += `</speak>`
  
  return ssml
}

export async function generateAzureTTS(
  text: string,
  character: GhostVoice,
  apiKey: string,
  region: string
): Promise<Blob> {
  const ssml = buildSSML(text, character)
  
  const response = await fetch(
    `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3'
      },
      body: ssml
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Azure TTS API error: ${response.status} - ${error}`)
  }

  return await response.blob()
}
