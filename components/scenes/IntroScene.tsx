'use client'

import { useState, useEffect, useRef } from 'react'
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
    // Start music when game begins
    playSceneMusic('intro')
    setStarted(true)
  }

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
          <img
            src="/shots/int_start.png"
            alt="Start Screen"
            style={{ 
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <div className="start-content">
            <h1 className="title">MIDNIGHT AT THE VOSS MANOR</h1>
            <p className="subtitle">Some bonds transcend death. Some mistakes echo forever.</p>
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
              <img
                src={`/shots/intro_${currentShot}.png`}
                alt={`Intro shot ${currentShot}`}
                style={{ 
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            )}
          </div>
          
          <div className="intro-overlay">
            {currentShot === 4 && <h1 className="title">MIDNIGHT AT THE VOSS MANOR</h1>}
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
          z-index: 100;
        }
        
        .start-content {
          position: relative;
          z-index: 10;
          text-align: center;
          animation: fadeIn 1s ease-in;
        }
        
        .subtitle {
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          font-size: 18px;
          font-style: italic;
          color: #00FFFF;
          text-transform: uppercase;
          letter-spacing: 8px;
          margin-bottom: 80px;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
        }
        
        .start-button {
          padding: 20px 50px;
          font-size: 20px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 3px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.8);
          border-radius: 8px;
          color: #FFFFFF;
          cursor: pointer;
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
          justify-content: flex-end;
          align-items: center;
          padding-bottom: 80px;
          background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%);
          z-index: 5;
        }
        
        .title {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: 72px;
          color: #E0E0E0;
          text-transform: uppercase;
          letter-spacing: 12px;
          margin-bottom: 30px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
          filter: drop-shadow(2px 0 0 rgba(255, 0, 0, 0.3)) drop-shadow(-2px 0 0 rgba(0, 255, 255, 0.3));
        }
        
        .narration {
          font-size: 28px;
          color: #e8b4f0;
          text-align: center;
          font-family: 'Montserrat', sans-serif;
          font-weight: 400;
          text-shadow: 0 0 10px rgba(232, 180, 240, 0.6);
          max-width: 900px;
          padding: 0 40px;
          letter-spacing: 1px;
          line-height: 1.6;
        }
        
        .title {
          margin-bottom: 30px;
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
