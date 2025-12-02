// Background music service using ElevenLabs sound effects API

class MusicService {
  private currentMusic: HTMLAudioElement | null = null
  private elevenLabsApiKey: string | null = null
  private musicCache: Map<string, string> = new Map()
  private enabled: boolean = true
  private volume: number = 0.3 // Lower volume for background

  constructor() {
    if (typeof window !== 'undefined') {
      this.elevenLabsApiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || null
      if (!this.elevenLabsApiKey) {
        console.log('Music: ElevenLabs API key not found, music disabled')
      }
    }
  }

  private async generateMusic(prompt: string, duration: number = 30): Promise<string> {
    if (!this.elevenLabsApiKey) {
      throw new Error('ElevenLabs API key not available')
    }

    // Check cache
    const cacheKey = `${prompt}:${duration}`
    const cached = this.musicCache.get(cacheKey)
    if (cached) {
      console.log('Music: Using cached audio')
      return cached
    }

    try {
      console.log(`Music: Generating "${prompt}"`)
      
      // Use ElevenLabs sound effects API
      const response = await fetch(
        'https://api.elevenlabs.io/v1/sound-generation',
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.elevenLabsApiKey
          },
          body: JSON.stringify({
            text: prompt,
            duration_seconds: duration,
            prompt_influence: 0.3 // Balance between prompt and musicality
          })
        }
      )

      if (!response.ok) {
        throw new Error(`ElevenLabs sound generation error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      // Cache it
      this.musicCache.set(cacheKey, audioUrl)
      console.log(`Music: Cached "${prompt}"`)
      
      return audioUrl
    } catch (error) {
      console.error('Music generation error:', error)
      throw error
    }
  }

  async playSceneMusic(scene: 'intro' | 'foyer' | 'study' | 'nursery' | 'chapel'): Promise<void> {
    if (!this.enabled) {
      return
    }

    // Stop current music
    this.stop()

    // Try to use pre-generated local file first
    const audioUrl = `/audio/music/${scene}.mp3`
    
    // Check if file exists before trying to play
    try {
      const response = await fetch(audioUrl, { method: 'HEAD' })
      if (response.ok) {
        console.log(`Music: Loading ${scene} music from local file`)
        
        const audio = new Audio(audioUrl)
        audio.volume = this.volume
        audio.loop = true // Loop the music
        
        this.currentMusic = audio
        
        await audio.play()
        console.log(`Music: Playing ${scene} music`)
        return
      }
    } catch (error) {
      // File doesn't exist, continue to generation
    }

    // File not found, try generation
    console.log(`Music: Local file not found for ${scene}`)
    if (this.elevenLabsApiKey) {
      await this.generateAndPlayMusic(scene)
    } else {
      console.log(`Music: No API key available, skipping music for ${scene}`)
    }
  }

  private async generateAndPlayMusic(scene: string): Promise<void> {
    const musicPrompts: Record<string, string> = {
      intro: 'Dark atmospheric horror ambience with distant thunder, eerie wind, ominous drones, gothic mansion atmosphere',
      foyer: 'Melancholic piano melody with strings, sad but beautiful, haunting memories, gentle ghostly atmosphere',
      study: 'Glitchy electronic ambience, fragmented memories, digital corruption sounds, sci-fi horror atmosphere',
      nursery: 'Innocent music box melody slowly distorting, childlike wonder turning eerie, soft lullaby with dark undertones',
      chapel: 'Epic orchestral crescendo, emotional resolution, hope and sadness combined, cinematic finale atmosphere'
    }

    try {
      const audioUrl = await this.generateMusic(musicPrompts[scene], 60)
      
      const audio = new Audio(audioUrl)
      audio.volume = this.volume
      audio.loop = true
      
      this.currentMusic = audio
      
      await audio.play()
      console.log(`Music: Playing generated ${scene} music`)
    } catch (error) {
      console.error(`Failed to generate ${scene} music:`, error)
    }
  }

  stop() {
    if (this.currentMusic) {
      this.currentMusic.pause()
      this.currentMusic = null
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.currentMusic) {
      this.currentMusic.volume = this.volume
    }
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
}

// Singleton instance
export const musicService = new MusicService()

// Helper hook for React components
export function useMusic() {
  const playSceneMusic = (scene: 'intro' | 'foyer' | 'study' | 'nursery' | 'chapel') => {
    return musicService.playSceneMusic(scene)
  }

  const stop = () => {
    musicService.stop()
  }

  const setVolume = (volume: number) => {
    musicService.setVolume(volume)
  }

  const toggle = () => {
    return musicService.toggle()
  }

  const isEnabled = () => {
    return musicService.isEnabled()
  }

  return { playSceneMusic, stop, setVolume, toggle, isEnabled }
}
