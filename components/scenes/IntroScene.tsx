'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { speechService } from '@/lib/tts/speechService'
import { useMusic } from '@/lib/audio/musicService'

interface IntroSceneProps {
  onComplete: () => void
}

export default function IntroScene({ onComplete }: IntroSceneProps) {
  const [started, setStarted] = useState(false)
  const [currentShot, setCurrentShot] = useState(1)
  const totalShots = 4
  const hasSpokenRef = useRef<Set<string>>(new Set())
  // Use speechService directly to avoid re-renders
  const { playSceneMusic } = useMusic()

  const narrations = [
    "Lost in the storm...",
    "Something watches from the shadows...",
    "A mansion looms ahead...",
    "The gate opens... there's no turning back."
  ]

  const handleStart = () => {
    setStarted(true)
  }

  useEffect(() => {
    if (!started) return
    // Start intro music only after user clicks
    playSceneMusic('intro')
  }, [started])

  useEffect(() => {
    if (!started) return
    
    const shotKey = `shot:${currentShot}`
    if (hasSpokenRef.current.has(shotKey)) return
    hasSpokenRef.current.add(shotKey)
    
    // Stop previous audio and speak the narration for current shot
    speechService.stop()
    
    if (currentShot <= totalShots) {
      speechService.speak(narrations[currentShot - 1], 'narrator')
    }
  }, [currentShot, started])

  useEffect(() => {
    if (!started) return
    
    if (currentShot <= totalShots) {
      const timer = setTimeout(() => {
        setCurrentShot(prev => prev + 1)
      }, 15000) // 15 seconds per screen
      return () => clearTimeout(timer)
    } else {
      setTimeout(onComplete, 1000)
    }
  }, [currentShot, onComplete, started])

  // Cleanup: Stop audio when component unmounts or scene changes
  useEffect(() => {
    return () => {
      speechService.stop()
    }
  }, [])

  const handleSkip = () => {
    // Stop all narration when skipping
    speechService.stop()
    onComplete()
  }

  return (
    <div className="scene intro-scene">
      {!started ? (
        // Start screen - requires user interaction for audio
        <div className="start-screen">
          <div className="start-content">
            <h1 className="title">MIDNIGHT AT THE VOSS MANOR</h1>
            <p className="subtitle">A Ghost Story in Five Acts</p>
            <button className="start-button" onClick={handleStart}>
              Click to Begin
            </button>
            <p className="audio-notice">🔊 Audio enabled</p>
          </div>
        </div>
      ) : (
        <>
          <div className="shot-container">
            {currentShot <= totalShots && (
              <Image
                src={`/shots/intro_${currentShot}.png`}
                alt={`Intro shot ${currentShot}`}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            )}
          </div>
          
          <div className="intro-overlay">
            <h1 className="title">MIDNIGHT AT THE VOSS MANOR</h1>
            <p className="narration">{narrations[currentShot - 1]}</p>
          </div>

          <button className="skip-button" onClick={handleSkip}>
            Skip Intro →
          </button>
        </>
      )}

      <style jsx>{`
        .scene {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: #0a0a1a;
        }
        
        .start-screen {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 100%);
          z-index: 100;
        }
        
        .start-content {
          text-align: center;
          animation: fadeIn 1s ease-in;
        }
        
        .subtitle {
          font-size: 20px;
          color: #e8b4f0;
          margin-bottom: 40px;
          font-family: 'Georgia', 'Times New Roman', serif;
          font-style: italic;
        }
        
        .start-button {
          padding: 20px 50px;
          font-size: 24px;
          background: rgba(74, 144, 226, 0.2);
          backdrop-filter: blur(10px);
          border: 3px solid rgba(74, 144, 226, 0.8);
          border-radius: 12px;
          color: #4a90e2;
          cursor: pointer;
          font-family: 'Georgia', 'Times New Roman', serif;
          transition: all 0.3s;
          animation: pulse 2s ease-in-out infinite;
        }
        
        .start-button:hover {
          background: rgba(74, 144, 226, 0.4);
          transform: scale(1.1);
          box-shadow: 0 0 30px rgba(74, 144, 226, 0.6);
        }
        
        .audio-notice {
          margin-top: 20px;
          font-size: 14px;
          color: #888;
          font-family: 'Georgia', 'Times New Roman', serif;
        }
        
        .shot-container {
          position: absolute;
          inset: 0;
          animation: fadeIn 1s ease-in;
        }
        
        .intro-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%);
          z-index: 5;
        }
        
        .title {
          font-size: 64px;
          color: #4a90e2;
          text-shadow: 0 0 20px rgba(74, 144, 226, 0.8);
          margin-bottom: 40px;
          letter-spacing: 4px;
        }
        
        .narration {
          font-size: 28px;
          color: #e8b4f0;
          text-shadow: 0 0 10px rgba(232, 180, 240, 0.6);
          animation: glow 2s ease-in-out infinite;
          max-width: 800px;
          text-align: center;
          font-family: 'Georgia', 'Times New Roman', serif;
          font-style: italic;
        }
        
        .skip-button {
          position: absolute;
          top: 20px;
          left: 20px;
          padding: 12px 24px;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(5px);
          border: 2px solid rgba(74, 144, 226, 0.6);
          border-radius: 8px;
          color: #4a90e2;
          cursor: pointer;
          z-index: 10;
          font-size: 16px;
          font-family: 'Georgia', 'Times New Roman', serif;
          transition: all 0.3s;
        }
        
        .skip-button:hover {
          background: rgba(74, 144, 226, 0.3);
          transform: scale(1.05);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 10px rgba(232, 180, 240, 0.6); }
          50% { text-shadow: 0 0 20px rgba(232, 180, 240, 1); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}
