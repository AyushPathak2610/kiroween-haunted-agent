// Simple sound effects using Web Audio API
class SoundEffects {
  private audioContext: AudioContext | null = null

  private getContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  // Play success sound (cheerful ascending notes)
  playSuccess() {
    const ctx = this.getContext()
    const now = ctx.currentTime
    
    // Create oscillator for melody
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    // Cheerful ascending melody
    osc.frequency.setValueAtTime(523.25, now) // C5
    osc.frequency.setValueAtTime(659.25, now + 0.1) // E5
    osc.frequency.setValueAtTime(783.99, now + 0.2) // G5
    
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
    
    osc.start(now)
    osc.stop(now + 0.4)
  }

  // Play error sound (descending dissonant notes)
  playError() {
    const ctx = this.getContext()
    const now = ctx.currentTime
    
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    // Descending dissonant notes
    osc.frequency.setValueAtTime(400, now) // Dissonant
    osc.frequency.setValueAtTime(300, now + 0.1)
    osc.frequency.setValueAtTime(200, now + 0.2)
    
    osc.type = 'sawtooth'
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
    
    osc.start(now)
    osc.stop(now + 0.3)
  }

  // Play collect sound (for orbs/items)
  playCollect() {
    const ctx = this.getContext()
    const now = ctx.currentTime
    
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    // Quick ascending chirp
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1)
    
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
    
    osc.start(now)
    osc.stop(now + 0.15)
  }

  // Play reset/glitch sound
  playReset() {
    const ctx = this.getContext()
    const now = ctx.currentTime
    
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    // Harsh descending sweep
    osc.frequency.setValueAtTime(600, now)
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.3)
    
    osc.type = 'square'
    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
    
    osc.start(now)
    osc.stop(now + 0.3)
  }
}

export const soundEffects = new SoundEffects()
