'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { speechService } from '@/lib/tts/speechService'
import { useMusic } from '@/lib/audio/musicService'
import { soundEffects } from '@/lib/audio/soundEffects'

interface StudySceneProps {
  onComplete: () => void
}

export default function StudyScene({ onComplete }: StudySceneProps) {
  const [stage, setStage] = useState<'intro' | 'harlan' | 'puzzle' | 'complete'>('intro')
  const [showingStory, setShowingStory] = useState(false)
  const [storyPart, setStoryPart] = useState(1)
  const [showingHint, setShowingHint] = useState(false)
  const [currentHint, setCurrentHint] = useState('')
  const [hintCount, setHintCount] = useState(0)
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 })
  const [collectedOrbs, setCollectedOrbs] = useState(0)
  const [collectedOrbPositions, setCollectedOrbPositions] = useState<string[]>([])
  const totalOrbs = 8
  const hasSpokenRef = useRef<Set<string>>(new Set())
  // Use speechService directly to avoid re-renders
  const { playSceneMusic } = useMusic()

  // Start scene music
  useEffect(() => {
    playSceneMusic('study')
  }, [])

  // Speak narration/dialogue when stage changes (only once per stage)
  useEffect(() => {
    const stageKey = `stage:${stage}`
    if (hasSpokenRef.current.has(stageKey)) return
    hasSpokenRef.current.add(stageKey)
    
    // Stop previous audio first and hide any hints
    speechService.stop()
    setShowingHint(false)
    setCurrentHint('')
    
    if (stage === 'intro') {
      speechService.speak("Books orbit a pulsing crystal. The room itself seems to twist...", 'narrator')
    } else if (stage === 'harlan') {
      speechService.speak("I... I remember fragments. The Eternal Harmony project. I wanted to connect us all... forever.", 'harlan')
    } else if (stage === 'complete') {
      speechService.speak("I... I remember now. The family. The love. The experiment... it was meant to preserve that.", 'harlan')
    }
  }, [stage])

  // Speak story parts when they change
  useEffect(() => {
    if (showingStory) {
      speechService.stop()
      
      if (storyPart === 1) {
        speechService.speak("Dr. Harlan Voss. That's who I was. Neuroscientist. Inventor. Fool. I was brilliant. Everyone said so. My research into neural interfaces was groundbreaking. But brilliance without wisdom is dangerous. I loved my family desperately. Elara, my patient wife. Mira, our daughter who looked at me like I hung the stars.", 'harlan')
      } else if (storyPart === 2) {
        speechService.speak("But I was always in my study, always working, always distant. I thought: what if we could share thoughts? Share feelings? Be truly, perfectly connected? Eternal Harmony. My magnum opus. I convinced my family to join me. Just one session, I said. We'll be closer than ever.", 'harlan')
      } else if (storyPart === 3) {
        speechService.speak("I didn't account for the feedback loop. Five minds, all connected, all amplifying each other's neural patterns. The system overloaded in seconds. Now I know. I killed my family. My beautiful wife. My innocent daughter. My brother and his fiancée. I am the architect of our tragedy. And I deserve this eternal prison.", 'harlan')
      }
    }
  }, [showingStory, storyPart])

  // Cleanup: Stop audio when component unmounts
  useEffect(() => {
    return () => {
      speechService.stop()
    }
  }, [])

  const handleAskHint = async () => {
    setShowingHint(true)
    setHintCount(prev => prev + 1)
    
    try {
      const response = await fetch('/api/character-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: 'harlan',
          puzzleContext: 'Neural maze puzzle - navigate through Harlan\'s fragmented memories, collect memory orbs while avoiding glitch voids',
          characterBackground: 'Dr. Harlan Voss, the scientist father who created the Eternal Harmony project. His memories are fragmented and glitchy. He represents intellect, ambition, and the cost of playing god.',
          hintNumber: hintCount + 1
        })
      })
      
      const { story, hint } = await response.json()
      
      setCurrentHint(story)
      speechService.speak(story, 'harlan', true) // Force speak even if repeated
      
      setTimeout(() => {
        setCurrentHint(`${story}\n\n${hint}`)
        speechService.speak(hint, 'harlan', true) // Force speak even if repeated
        
        setTimeout(() => {
          setShowingHint(false)
          setCurrentHint('')
        }, 15000)
      }, 6000)
      
    } catch (error) {
      console.error('Failed to get hint:', error)
      const fallbackStories = [
        "I... I can't remember everything. The data packets... they're scattered. My mind feels like a broken algorithm.",
        "The Eternal Harmony... it was supposed to save us. Instead, it fragmented everything I loved.",
        "Sometimes I see the equations clearly. Other times, it's just... noise. Static. Confusion."
      ]
      const fallbackStory = fallbackStories[hintCount % fallbackStories.length]
      const fallbackHint = "Navigate carefully through the neural pathways. Collect the memory orbs to restore my fragmented consciousness. Avoid the glitch voids - they represent the corruption in my mind."
      
      setCurrentHint(fallbackStory)
      speechService.speak(fallbackStory, 'harlan', true) // Force speak even if repeated
      
      setTimeout(() => {
        setCurrentHint(`${fallbackStory}\n\n${fallbackHint}`)
        speechService.speak(fallbackHint, 'harlan', true) // Force speak even if repeated
        
        setTimeout(() => {
          setShowingHint(false)
          setCurrentHint('')
        }, 15000)
      }, 6000)
    }
  }

  const handleMove = (direction: string) => {
    setPlayerPos(prev => {
      const newPos = { ...prev }
      switch(direction) {
        case 'up': newPos.y = Math.max(0, prev.y - 1); break
        case 'down': newPos.y = Math.min(4, prev.y + 1); break
        case 'left': newPos.x = Math.max(0, prev.x - 1); break
        case 'right': newPos.x = Math.min(4, prev.x + 1); break
      }
      
      // Check if hit glitch
      const glitchKey = `${newPos.x},${newPos.y}`
      const glitchPositions = ['2,1', '1,2', '3,3']
      
      if (glitchPositions.includes(glitchKey)) {
        // Reset puzzle - player goes back to start, collected orbs reset
        soundEffects.playReset()
        speechService.speak("Glitch! Neural corruption detected. Resetting...", 'harlan')
        setCollectedOrbPositions([])
        setCollectedOrbs(0)
        return { x: 0, y: 0 }
      }
      
      // Check if collected orb
      const orbKey = `${newPos.x},${newPos.y}`
      const orbPositions = ['1,0', '3,1', '0,2', '4,2', '2,3', '1,4', '3,4', '4,4']
      
      if (orbPositions.includes(orbKey) && !collectedOrbPositions.includes(orbKey)) {
        soundEffects.playCollect()
        setCollectedOrbPositions(prev => [...prev, orbKey])
        setCollectedOrbs(prev => {
          const newCount = prev + 1
          if (newCount >= totalOrbs) {
            // Hide hint when puzzle completes
            setShowingHint(false)
            setCurrentHint('')
            setTimeout(() => setStage('complete'), 500)
          }
          return newCount
        })
      }
      
      return newPos
    })
  }

  return (
    <div className="scene study-scene">
      <div className="background">
        <Image
          src={
            stage === 'complete' ? '/shots/2a_3.png' :
            stage === 'puzzle' ? '/shots/2b_1.png' : 
            stage === 'harlan' ? '/shots/2a_2.png' : 
            '/shots/2a_1.png'
          }
          alt="Study"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {stage === 'intro' && (
        <div className="dialogue-box">
          <p className="narration">Books orbit a pulsing crystal. The room itself seems to twist...</p>
          <button onClick={() => setStage('harlan')}>Approach the Crystal →</button>
        </div>
      )}

      {stage === 'harlan' && (
        <div className="dialogue-cloud-container">
          <div className="dialogue-cloud">
            <h3>Dr. Harlan Voss (Father/Scientist)</h3>
            
            {!showingStory ? (
              <>
                <p>"I... I remember fragments. The Eternal Harmony project. I wanted to connect us all... forever."</p>
                <p>"Would you like to hear what I remember?"</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button onClick={() => setShowingStory(true)}>Hear His Story</button>
                  <button onClick={() => setStage('puzzle')}>Enter Neural Maze</button>
                </div>
              </>
            ) : (
              <>
                <div className="story-text">
                  {storyPart === 1 && (
                    <>
                      <p>Dr. Harlan Voss. That's who I was. Neuroscientist. Inventor. Fool.</p>
                      <p>I was brilliant. Everyone said so. My research into neural interfaces was groundbreaking. But brilliance without wisdom is dangerous.</p>
                      <p>I loved my family desperately. Elara, my patient wife. Mira, our daughter who looked at me like I hung the stars...</p>
                    </>
                  )}
                  {storyPart === 2 && (
                    <>
                      <p>But I was always in my study, always working, always distant.</p>
                      <p>I thought: what if we could share thoughts? Share feelings? Be truly, perfectly connected? Eternal Harmony. My magnum opus.</p>
                      <p>I convinced my family to join me. "Just one session," I said. "We'll be closer than ever..."</p>
                    </>
                  )}
                  {storyPart === 3 && (
                    <>
                      <p>I didn't account for the feedback loop. Five minds, all connected, all amplifying each other's neural patterns. The system overloaded in seconds.</p>
                      <p>Now I know. I killed my family. My beautiful wife. My innocent daughter. My brother and his fiancée.</p>
                      <p>I am the architect of our tragedy. And I deserve this eternal prison.</p>
                    </>
                  )}
                </div>
                {storyPart < 3 ? (
                  <button onClick={() => setStoryPart(prev => prev + 1)} className="continue-btn">...</button>
                ) : (
                  <button onClick={() => setStage('puzzle')}>Enter Neural Maze</button>
                )}
                <button onClick={() => setStage('puzzle')} className="skip-btn">Skip Story</button>
              </>
            )}
          </div>
        </div>
      )}

      {stage === 'puzzle' && (
        <div className="puzzle-container">
          <h2>Neural Maze - Harlan's Memories</h2>
          <p>Collect all memory orbs ({collectedOrbs}/{totalOrbs})</p>
          
          <div className="maze-grid">
            {Array.from({ length: 5 }).map((_, y) => (
              <div key={y} className="maze-row">
                {Array.from({ length: 5 }).map((_, x) => {
                  const isPlayer = playerPos.x === x && playerPos.y === y
                  const orbKey = `${x},${y}`
                  const hasOrb = ['1,0', '3,1', '0,2', '4,2', '2,3', '1,4', '3,4', '4,4'].includes(orbKey)
                  const isCollected = collectedOrbPositions.includes(orbKey)
                  const isGlitch = ['2,1', '1,2', '3,3'].includes(orbKey)
                  
                  return (
                    <div 
                      key={x} 
                      className={`maze-cell ${isPlayer ? 'player' : ''} ${hasOrb && !isCollected ? 'orb' : ''} ${isGlitch ? 'glitch' : ''}`}
                    >
                      {isPlayer && '⚡'}
                      {hasOrb && !isCollected && !isPlayer && '💛'}
                      {isGlitch && '❌'}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          <div className="controls">
            <div className="dpad">
              <button onClick={() => handleMove('up')}>↑</button>
              <div className="dpad-middle">
                <button onClick={() => handleMove('left')}>←</button>
                <button onClick={() => handleMove('right')}>→</button>
              </div>
              <button onClick={() => handleMove('down')}>↓</button>
            </div>
            
            <button onClick={handleAskHint} disabled={showingHint} className="hint-button">
              {showingHint ? '💭 Harlan is speaking...' : '💭 Ask Harlan for Hint'}
            </button>
          </div>
        </div>
      )}

      {stage === 'complete' && (
        <div className="dialogue-box success">
          <h3 style={{ marginBottom: '20px' }}>✨ Memories Restored!</h3>
          <p className="ghost-harlan">"I... I remember now. The family. The love. The experiment... it was meant to preserve that."</p>
          <button onClick={onComplete}>Continue to Nursery →</button>
        </div>
      )}

      {/* Movie-style hint subtitle at bottom */}
      {showingHint && currentHint && (
        <div className="hint-subtitle">
          <div className="hint-character">Harlan whispers:</div>
          <div className="hint-text">{currentHint}</div>
        </div>
      )}

      <style jsx>{`
        .scene {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }
        
        .background {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        
        .dialogue-box {
          position: absolute;
          bottom: 50px;
          left: 50%;
          transform: translateX(-50%);
          max-width: 500px;
          padding: 15px 18px 20px 18px;
          background: rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(74, 222, 128, 0.6);
          border-radius: 12px;
          z-index: 10;
          color: #fff;
          font-family: 'Georgia', 'Times New Roman', serif;
          font-style: italic;
        }
        
        .dialogue-box button {
          margin-top: 20px;
        }
        
        .dialogue-cloud-container {
          position: absolute;
          left: 50px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
        }
        
        .dialogue-cloud {
          position: relative;
          max-width: 340px;
          padding: 15px 18px;
          background: rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(74, 222, 128, 0.6);
          border-radius: 20px;
          color: #fff;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          font-family: 'Georgia', 'Times New Roman', serif;
          font-style: italic;
        }
        
        .dialogue-cloud::after {
          content: '';
          position: absolute;
          right: -25px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-left: 25px solid rgba(74, 222, 128, 0.6);
          border-top: 18px solid transparent;
          border-bottom: 18px solid transparent;
        }
        
        .dialogue-cloud h3 {
          margin: 0 0 15px 0;
          color: #4ade80;
          font-size: 19px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        
        .dialogue-cloud p {
          margin: 0 0 12px 0;
          line-height: 1.7;
          font-size: 15px;
          color: #e8e8e8;
        }
        
        .story-text {
          margin: 8px 0;
          min-height: 180px;
        }
        
        .story-text p:last-child {
          margin-bottom: 0;
        }
        
        .continue-btn {
          width: 100%;
          margin-top: 35px;
          padding: 10px;
          font-size: 24px;
          background: rgba(74, 222, 128, 0.15);
          border: 2px solid rgba(74, 222, 128, 0.6);
          color: #4ade80;
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'Georgia', serif;
        }
        
        .continue-btn:hover {
          background: rgba(74, 222, 128, 0.25);
          transform: scale(1.02);
        }
        
        .skip-btn {
          width: 100%;
          margin-top: 12px;
          padding: 10px;
          font-size: 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #aaa;
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'Georgia', serif;
        }
        
        .skip-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ddd;
        }
        
        .puzzle-container {
          position: absolute;
          inset: 20px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.9);
          border: 2px solid #4ade80;
          border-radius: 8px;
          z-index: 10;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .maze-grid {
          margin: 20px 0;
          border: 2px solid #4ade80;
        }
        
        .maze-row {
          display: flex;
        }
        
        .maze-cell {
          width: 60px;
          height: 60px;
          border: 1px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          background: rgba(0, 0, 0, 0.5);
        }
        
        .maze-cell.player {
          background: rgba(74, 144, 226, 0.5);
          animation: pulse 1s infinite;
        }
        
        .maze-cell.orb {
          background: rgba(255, 215, 0, 0.2);
        }
        
        .maze-cell.glitch {
          background: rgba(255, 0, 0, 0.3);
        }
        
        .controls {
          display: flex;
          gap: 40px;
          align-items: center;
          margin-top: 20px;
        }
        
        .dpad {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .dpad-middle {
          display: flex;
          gap: 5px;
          justify-content: center;
        }
        
        button {
          padding: 12px 24px;
          background: rgba(74, 222, 128, 0.15);
          backdrop-filter: blur(5px);
          border: 2px solid rgba(74, 222, 128, 0.6);
          border-radius: 8px;
          color: #4ade80;
          cursor: pointer;
          font-size: 16px;
          font-family: 'Georgia', 'Times New Roman', serif;
          transition: all 0.3s;
        }
        
        button:hover:not(:disabled) {
          background: rgba(74, 222, 128, 0.5);
          transform: scale(1.05);
        }
        
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .hint-button {
          padding: 16px 32px;
        }
        
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 10px rgba(74, 144, 226, 0.5); }
          50% { box-shadow: 0 0 20px rgba(74, 144, 226, 1); }
        }

        /* Movie-style hint subtitle at bottom */
        .hint-subtitle {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          max-width: 80%;
          padding: 20px 30px;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          border: 2px solid #00bfff;
          border-radius: 8px;
          z-index: 100;
          text-align: center;
          box-shadow: 0 0 30px rgba(0, 191, 255, 0.5);
          animation: fadeInUp 0.5s ease-out;
        }

        .hint-character {
          font-size: 14px;
          color: #00bfff;
          font-weight: bold;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .hint-text {
          font-size: 18px;
          color: #ffffff;
          line-height: 1.6;
          font-family: 'Georgia', 'Times New Roman', serif;
          font-style: italic;
          white-space: pre-line;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
