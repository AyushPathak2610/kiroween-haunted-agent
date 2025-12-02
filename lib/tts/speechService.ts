// Text-to-Speech service for character dialogue with Azure Cognitive Services
// Free tier: 500,000 characters/month (Neural voices)
// Full SSML support for emotions, pauses, pitch, rate control

import { generateAzureTTS } from './azureTTS'

export type GhostVoice = 'elara' | 'harlan' | 'mira' | 'theo' | 'selene' | 'narrator'

// Voice configs removed - now handled in azureTTS.ts with SSML

class SpeechService {
  private currentAudio: HTMLAudioElement | null = null
  private enabled: boolean = true
  private azureApiKey: string | null = null
  private azureRegion: string | null = null
  private speechQueue: Array<{ text: string; character: GhostVoice; resolve: () => void }> = []
  private isSpeaking: boolean = false
  private audioCache: Map<string, string> = new Map() // Cache audio URLs by text+character
  private spokenTexts: Set<string> = new Set() // Track what's been spoken to avoid repeats

  constructor() {
    if (typeof window !== 'undefined') {
      // Check for Azure Cognitive Services TTS API key
      this.azureApiKey = process.env.NEXT_PUBLIC_AZURE_TTS_API_KEY || null
      this.azureRegion = process.env.NEXT_PUBLIC_AZURE_TTS_REGION || 'eastus'
      
      if (!this.azureApiKey) {
        console.warn('TTS: No Azure API key found. Please add NEXT_PUBLIC_AZURE_TTS_API_KEY to .env')
        console.warn('TTS: Get free 500k chars/month at: https://azure.microsoft.com/free/cognitive-services/')
      } else {
        console.log(`TTS: Using Azure Cognitive Services TTS (500k chars/month free) - Region: ${this.azureRegion}`)
      }
    }
  }



// Emotional pauses now handled in azureTTS.ts with SSML

  private getStaticAudioFilename(text: string, character: GhostVoice): string | null {
    // Map text to pre-generated audio files
    const staticAudioMap: Record<string, string> = {
      // Intro
      'Lost in the storm...': 'narrator_intro_1',
      'Something watches from the shadows...': 'narrator_intro_2',
      'A mansion looms ahead...': 'narrator_intro_3',
      "The gate opens... there's no turning back.": 'narrator_intro_4',
      
      // Foyer
      'You enter the foyer. Dust hangs in moonbeams. A lantern ignites on its own...': 'narrator_foyer_intro',
      "Welcome, traveler. I am Elara... once mother to this family. We are trapped here, our bonds fractured by tragedy. Help us remember... help us weave our memories back together.": 'elara_foyer_intro',
      'The tapestry weaves itself... memories restored. Thank you.': 'elara_foyer_complete',
      
      // Study
      'Books orbit a pulsing crystal. The room itself seems to twist...': 'narrator_study_intro',
      "I... I remember fragments. The Eternal Harmony project. I wanted to connect us all... forever. But something went wrong. My memories... scattered like data packets. Help me... reconstruct them.": 'harlan_study_intro',
      'I... I remember now. The family. The love. The experiment... it was meant to preserve that.': 'harlan_study_complete',
      
      // Nursery
      'Toys float in zero gravity. Crayon drawings animate on the walls...': 'narrator_nursery_intro',
      "Hi! I'm Mira! Do you wanna play? Mommy and Daddy are here but... they can't see me anymore. I miss bedtime stories and hugs. Can you help me remember the happy times?": 'mira_nursery_intro',
      "Yay! The tree is pretty now! I remember everything! Thank you for playing with me!": 'mira_nursery_complete',
      
      // Chapel
      'The Chapel. Stained glass windows depict the family in happier times. The Nexus Crystal glows golden on the altar.': 'narrator_chapel_intro',
      'The five ghosts stand in a circle. The Nexus Crystal pulses with their combined energy.': 'narrator_chapel_reunion',
      'My family... together again.': 'elara_chapel_reunion',
      'I remember everything now.': 'harlan_chapel_reunion',
      'Mommy! Daddy! You can see me!': 'mira_chapel_reunion',
      "Brother... I'm sorry I ran.": 'theo_chapel_reunion',
      'Theo... I forgive you.': 'selene_chapel_reunion',
      'The light consumes everything. When it fades, the mansion stands peaceful in morning light. The five ghosts have found peace. Not through a single mind, but through five independent AI agents learning to work together.': 'narrator_chapel_ending'
    }
    
    return staticAudioMap[text] || null
  }

  private async speakWithAPI(text: string, character: GhostVoice): Promise<void> {
    // Check if this is static audio with a pre-generated file
    const staticFilename = this.getStaticAudioFilename(text, character)
    
    if (staticFilename) {
      // Use pre-generated local file
      const audioUrl = `/audio/voices/${staticFilename}.mp3`
      console.log(`TTS: Using pre-generated audio: ${staticFilename}`)
      
      return new Promise((resolve, reject) => {
        const audio = new Audio(audioUrl)
        this.currentAudio = audio

        audio.onended = () => {
          this.currentAudio = null
          resolve()
        }

        audio.onerror = (error) => {
          console.error(`Failed to load ${audioUrl}, falling back to API`)
          this.currentAudio = null
          // Fallback to API if file doesn't exist
          this.generateWithAPI(text, character).then(resolve).catch(reject)
        }

        audio.play().catch((error) => {
          console.error('Audio play failed:', error)
          // If play fails (e.g., autoplay blocked), try API fallback
          this.generateWithAPI(text, character).then(resolve).catch(reject)
        })
      })
    }
    
    // Dynamic text (debates, etc.) - use API with caching
    return this.generateWithAPI(text, character)
  }

  private async generateWithAPI(text: string, character: GhostVoice): Promise<void> {
    // Create cache key
    const cacheKey = `${character}:${text}`
    
    // Check cache first
    let audioUrl = this.audioCache.get(cacheKey)
    
    if (!audioUrl) {
      // Not in cache, generate from API
      try {
        if (!this.azureApiKey) {
          throw new Error('Azure TTS API key not available')
        }
        
        console.log(`TTS: Generating with Azure TTS for ${character}`)
        const audioBlob = await generateAzureTTS(
          text, 
          character, 
          this.azureApiKey,
          this.azureRegion!
        )
        
        audioUrl = URL.createObjectURL(audioBlob)
        
        // Cache the audio URL
        this.audioCache.set(cacheKey, audioUrl)
        console.log(`TTS: Cached audio for ${character} (cache size: ${this.audioCache.size})`)
      } catch (error) {
        console.error('TTS API error:', error)
        throw error
      }
    } else {
      console.log(`TTS: Using cached audio for ${character}`)
    }
    
    // Play the audio (cached or fresh)
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl)
      this.currentAudio = audio

      audio.onended = () => {
        this.currentAudio = null
        resolve()
      }

      audio.onerror = (error) => {
        this.currentAudio = null
        reject(error)
      }

      audio.play().catch(reject)
    })
  }



  private async processQueue(): Promise<void> {
    if (this.isSpeaking || this.speechQueue.length === 0) {
      return
    }

    this.isSpeaking = true
    const { text, character, resolve } = this.speechQueue.shift()!

    try {
      await this.speakWithAPI(text, character)
    } catch (error) {
      console.error('TTS error:', error)
      // Silent fail - just log the error
    } finally {
      resolve()
      this.isSpeaking = false
      // Process next item in queue
      this.processQueue()
    }
  }

  async speak(text: string, character: GhostVoice = 'narrator', force: boolean = false): Promise<void> {
    if (!this.enabled) {
      return
    }

    // Validate character
    const validCharacters: GhostVoice[] = ['elara', 'harlan', 'mira', 'theo', 'selene', 'narrator']
    if (!validCharacters.includes(character)) {
      console.warn(`TTS: Invalid character "${character}", skipping`)
      return
    }

    // Check if this text has already been spoken (unless forced)
    const textKey = `${character}:${text}`
    if (!force && this.spokenTexts.has(textKey)) {
      console.log(`TTS: Skipping already spoken text for ${character}`)
      return
    }

    // Mark as spoken
    this.spokenTexts.add(textKey)

    // Add to queue and process
    return new Promise((resolve) => {
      this.speechQueue.push({ text, character, resolve })
      this.processQueue()
    })
  }

  stop() {
    // Resolve all pending promises in queue
    this.speechQueue.forEach(item => item.resolve())
    
    // Clear the queue
    this.speechQueue = []
    this.isSpeaking = false

    // Stop audio playback
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
      this.currentAudio.src = '' // Clear the source to fully stop loading
      this.currentAudio = null
    }
  }

  clearSpokenHistory() {
    // Clear the history of spoken texts (useful when restarting game)
    this.spokenTexts.clear()
  }

  toggle() {
    this.enabled = !this.enabled
    if (!this.enabled) {
      this.stop()
    }
    return this.enabled
  }

  isEnabled() {
    return this.enabled
  }

  isSupported() {
    return this.azureApiKey !== null
  }


}

// Singleton instance
export const speechService = new SpeechService()

// Helper hook for React components
export function useSpeech() {
  const speak = (text: string, character: GhostVoice = 'narrator') => {
    return speechService.speak(text, character)
  }

  const stop = () => {
    speechService.stop()
  }

  const toggle = () => {
    return speechService.toggle()
  }

  const isEnabled = () => {
    return speechService.isEnabled()
  }

  return { speak, stop, toggle, isEnabled }
}
