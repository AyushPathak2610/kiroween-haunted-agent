'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { speechService } from '@/lib/tts/speechService'
import { useMusic } from '@/lib/audio/musicService'
import { soundEffects } from '@/lib/audio/soundEffects'

interface NurserySceneProps {
  onComplete: () => void
}

export default function NurseryScene({ onComplete }: NurserySceneProps) {
  const [stage, setStage] = useState<'intro' | 'mira' | 'puzzle' | 'complete'>('intro')
  const [showingStory, setShowingStory] = useState(false)
  const [storyPart, setStoryPart] = useState(1)
  const [showingHint, setShowingHint] = useState(false)
  const [currentHint, setCurrentHint] = useState('')
  const [hintCount, setHintCount] = useState(0)
  const [connectedBranches, setConnectedBranches] = useState<string[]>([])
  const hasSpokenRef = useRef<Set<string>>(new Set())
  // Use speechService directly to avoid re-renders
  const { playSceneMusic } = useMusic()

  // Start scene music
  useEffect(() => {
    playSceneMusic('nursery')
  }, [])

  // Speak narration/dialogue when stage changes (only once per stage)
  useEffect(() => {
    const stageKey = `stage:${stage}`
    if (hasSpokenRef.current.has(stageKey)) return
    hasSpokenRef.current.add(stageKey)
    
    // Stop previous audio first
    speechService.stop()
    
    if (stage === 'intro') {
      speechService.speak("Toys float in zero gravity. Crayon drawings animate on the walls...", 'narrator')
    } else if (stage === 'mira') {
      speechService.speak("Hi! I'm Mira! Do you wanna play?", 'mira')
    } else if (stage === 'complete') {
      speechService.speak("Yay! The tree is pretty now! I remember everything! Thank you for playing with me!", 'mira')
    }
  }, [stage])

  // Cleanup: Stop audio and hide hints when component unmounts or stage changes
  // Speak story parts when they change
  useEffect(() => {
    if (showingStory) {
      speechService.stop()
      
      if (storyPart === 1) {
        speechService.speak("Hi! I'm Mira! I'm seven years old! Well... I was seven. I don't really understand what happened. I remember the good times though! Mommy used to read me stories every night. My favorite was about a princess who could talk to animals. Daddy was always busy in his study. But sometimes, on Sundays, he would take me to the garden. We'd look for butterflies.", 'mira')
      } else if (storyPart === 2) {
        speechService.speak("Uncle Theo was funny! He'd visit and do magic tricks. He could make coins disappear and pull flowers from behind my ear. Aunt Selene was pretty but scary. But once, she braided my hair and told me I looked like a princess. The night everything changed, Daddy said we were going to play a special game. We all wore shiny crowns with wires.", 'mira')
      } else if (storyPart === 3) {
        speechService.speak("Then I woke up here. In my nursery. But I was see-through, like a jellyfish! I don't really understand death. All I know is we can't leave the mansion. We can't hug anymore - our hands go through each other. And I miss being alive. But you're here now! You're helping us remember the happy times. Thank you for playing with me!", 'mira')
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
          character: 'mira',
          puzzleContext: 'Love Harvest puzzle - connect memory bubbles to tree branches to make the family tree bloom',
          characterBackground: 'Mira Voss, the innocent 6-year-old daughter. She loved bedtime stories, hugs, and playing. She represents childhood innocence and the joy that was lost.',
          hintNumber: hintCount + 1
        })
      })
      
      const { story, hint } = await response.json()
      
      setCurrentHint(story)
      speechService.speak(story, 'mira', true) // Force speak even if repeated
      
      setTimeout(() => {
        setCurrentHint(`${story}\n\n${hint}`)
        speechService.speak(hint, 'mira', true) // Force speak even if repeated
        
        setTimeout(() => {
          setShowingHint(false)
          setCurrentHint('')
        }, 15000)
      }, 6000)
      
    } catch (error) {
      console.error('Failed to get hint:', error)
      // Fallback hint
      const fallbackStories = [
        "I remember playing in the garden! The flowers were so pretty!",
        "Mommy used to read me stories every night. I miss that.",
        "Daddy would take me to see butterflies on Sundays!"
      ]
      const fallbackStory = fallbackStories[hintCount % fallbackStories.length]
      const fallbackHint = "Look at the tree branches! Each memory belongs to a special time - bedtime, playtime, or hugs!"
      
      setCurrentHint(fallbackStory)
      speechService.speak(fallbackStory, 'mira', true) // Force speak even if repeated
      
      setTimeout(() => {
        setCurrentHint(`${fallbackStory}\n\n${fallbackHint}`)
        speechService.speak(fallbackHint, 'mira', true) // Force speak even if repeated
        
        setTimeout(() => {
          setShowingHint(false)
          setCurrentHint('')
        }, 15000)
      }, 6000)
    }
  }

  // 6 memories - each has one correct branch
  const allMemories = [
    { id: 'lullaby', correctBranch: 'bedtime', label: 'Lullaby', emoji: '🎵' },
    { id: 'story', correctBranch: 'bedtime', label: 'Story Time', emoji: '📖' },
    { id: 'picnic', correctBranch: 'play', label: 'Picnic', emoji: '🧺' },
    { id: 'toys', correctBranch: 'play', label: 'Toys', emoji: '🧸' },
    { id: 'hug', correctBranch: 'love', label: 'Hugs', emoji: '🤗' },
    { id: 'kiss', correctBranch: 'love', label: 'Goodnight Kiss', emoji: '💋' },
  ]

  // 3 branch options (same for all memories)
  const branchOptions = [
    { id: 'bedtime', label: 'Bedtime', emoji: '🌙' },
    { id: 'play', label: 'Play', emoji: '🎈' },
    { id: 'love', label: 'Love', emoji: '💕' },
  ]

  // Shuffle both on mount
  const [memories] = useState(() => [...allMemories].sort(() => Math.random() - 0.5))
  const [shuffledBranches] = useState(() => [...branchOptions].sort(() => Math.random() - 0.5))

  const handleConnect = (memoryId: string, selectedBranch: string) => {
    const memory = allMemories.find(m => m.id === memoryId)
    if (memory && memory.correctBranch === selectedBranch && !connectedBranches.includes(memoryId)) {
      soundEffects.playSuccess()
      setConnectedBranches(prev => {
        const newConnected = [...prev, memoryId]
        if (newConnected.length >= memories.length) {
          // Hide hint when puzzle completes
          setShowingHint(false)
          setCurrentHint('')
          setTimeout(() => setStage('complete'), 1000)
        }
        return newConnected
      })
    } else {
      soundEffects.playError()
    }
  }

  return (
    <div className="scene nursery-scene">
      <div className="background">
        <Image
          src={
            stage === 'complete' ? '/shots/3b_1.png' :
            stage === 'puzzle' ? '/shots/3a_3.png' : 
            stage === 'mira' ? '/shots/3a_2.png' : 
            '/shots/3a_1.png'
          }
          alt="Nursery"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {stage === 'intro' && (
        <div className="dialogue-box">
          <p className="narration">Toys float in zero gravity. Crayon drawings animate on the walls...</p>
          <button onClick={() => setStage('mira')}>Look in the Crib →</button>
        </div>
      )}

      {stage === 'mira' && (
        <div className="dialogue-cloud-container">
          <div className="dialogue-cloud">
            <h3>Mira (Daughter)</h3>
            
            {!showingStory ? (
              <>
                <p>"Hi! I'm Mira! Do you wanna play? Mommy and Daddy are here but... they can't see me anymore."</p>
                <p>"Wanna hear my story?"</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button onClick={() => setShowingStory(true)}>Hear Her Story</button>
                  <button onClick={() => setStage('puzzle')}>Help Mira Remember</button>
                </div>
              </>
            ) : (
              <>
                <div className="story-text">
                  {storyPart === 1 && (
                    <>
                      <p>Hi! I'm Mira! I'm seven years old! Well... I was seven. I don't really understand what happened.</p>
                      <p>I remember the good times though! Mommy used to read me stories every night. My favorite was about a princess who could talk to animals.</p>
                      <p>Daddy was always busy in his study. But sometimes, on Sundays, he would take me to the garden. We'd look for butterflies...</p>
                    </>
                  )}
                  {storyPart === 2 && (
                    <>
                      <p>Uncle Theo was funny! He'd visit and do magic tricks. He could make coins disappear and pull flowers from behind my ear.</p>
                      <p>Aunt Selene was pretty but scary. But once, she braided my hair and told me I looked like a princess.</p>
                      <p>The night everything changed, Daddy said we were going to play a special game. We all wore shiny crowns with wires...</p>
                    </>
                  )}
                  {storyPart === 3 && (
                    <>
                      <p>Then I woke up here. In my nursery. But I was see-through, like a jellyfish!</p>
                      <p>I don't really understand death. All I know is we can't leave the mansion. We can't hug anymore - our hands go through each other. And I miss being alive.</p>
                      <p>But you're here now! You're helping us remember the happy times. Thank you for playing with me!</p>
                    </>
                  )}
                </div>
                {storyPart < 3 ? (
                  <button onClick={() => setStoryPart(prev => prev + 1)} className="continue-btn">...</button>
                ) : (
                  <button onClick={() => setStage('puzzle')}>Help Mira Remember</button>
                )}
                <button onClick={() => setStage('puzzle')} className="skip-btn">Skip Story</button>
              </>
            )}
          </div>
        </div>
      )}

      {stage === 'puzzle' && (
        <div className="puzzle-container">
          <h2>🌸 Love Harvest - Family Tree 🌸</h2>
          <p className="puzzle-subtitle">Help Mira match her memories to the right branches!</p>
          
          <div className="memory-grid">
            {memories.map(memory => (
              <div 
                key={memory.id} 
                className={`memory-card ${connectedBranches.includes(memory.id) ? 'matched' : ''}`}
              >
                <div className="memory-icon">{memory.emoji}</div>
                <div className="memory-label">{memory.label}</div>
                {!connectedBranches.includes(memory.id) ? (
                  <div className="branch-buttons">
                    {shuffledBranches.map(branch => (
                      <button 
                        key={branch.id}
                        onClick={() => handleConnect(memory.id, branch.id)}
                        className="branch-btn"
                        title={branch.label}
                      >
                        {branch.emoji}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="matched-indicator">
                    <span className="bloom">🌸</span>
                    <span className="text">Bloomed!</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="puzzle-controls">
            <button onClick={handleAskHint} disabled={showingHint} className="hint-button">
              {showingHint ? '💭 Mira is speaking...' : '💭 Ask Mira for Hint'}
            </button>
            <div className="progress">
              <span className="progress-text">Flowers: {connectedBranches.length}/{memories.length}</span>
              <div className="progress-flowers">
                {Array.from({ length: memories.length }).map((_, i) => (
                  <span key={i} className={i < connectedBranches.length ? 'bloomed' : 'waiting'}>
                    {i < connectedBranches.length ? '🌸' : '🌱'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {stage === 'complete' && (
        <div className="dialogue-box success">
          <h3 style={{ marginBottom: '20px' }}>✨ Tree in Full Bloom!</h3>
          <p className="ghost-mira">"Yay! The tree is pretty now! I remember everything! Thank you for playing with me!"</p>
          <button onClick={onComplete}>Continue to Chapel →</button>
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
          border: 2px solid rgba(232, 180, 240, 0.6);
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
          border: 2px solid rgba(232, 180, 240, 0.6);
          border-radius: 20px;
          color: #fff;
          box-shadow: 0 0 30px rgba(232, 180, 240, 0.3);
          font-family: 'Georgia', 'Times New Roman', serif;
          font-style: italic;
        }
        
        .dialogue-cloud::after {
          content: '';
          position: absolute;
          right: -30px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-left: 30px solid #e8b4f0;
          border-top: 20px solid transparent;
          border-bottom: 20px solid transparent;
        }
        
        .dialogue-cloud h3 {
          margin: 0 0 15px 0;
          color: #e8b4f0;
          font-size: 19px;
          font-weight: 600;
        }
        
        .dialogue-cloud p {
          margin: 10px 0;
          line-height: 1.7;
          font-size: 15px;
        }
        
        .story-cloud {
          max-width: 380px;
        }
        
        .story-text {
          margin: 8px 0;
          min-height: 180px;
        }
        
        .continue-btn {
          width: 100%;
          margin-top: 35px;
          padding: 10px;
          font-size: 24px;
          background: rgba(232, 180, 240, 0.15);
          border: 2px solid rgba(232, 180, 240, 0.6);
          color: #e8b4f0;
          font-family: 'Georgia', serif;
        }
        
        .skip-btn {
          width: 100%;
          margin-top: 10px;
          padding: 8px;
          font-size: 14px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid #666;
          color: #999;
        }
        
        .puzzle-container {
          position: absolute;
          inset: 20px;
          padding: 30px;
          background: rgba(0, 0, 0, 0.9);
          border: 3px solid #e8b4f0;
          border-radius: 12px;
          z-index: 10;
          color: #fff;
          overflow-y: auto;
        }

        .puzzle-subtitle {
          text-align: center;
          color: #e8b4f0;
          font-size: 16px;
          margin-bottom: 30px;
          font-style: italic;
        }
        
        .memory-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin: 20px 0;
        }

        .memory-card {
          padding: 20px;
          background: linear-gradient(135deg, rgba(232, 180, 240, 0.15), rgba(232, 180, 240, 0.05));
          border: 2px solid rgba(232, 180, 240, 0.4);
          border-radius: 16px;
          text-align: center;
          transition: all 0.3s ease;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .memory-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(232, 180, 240, 0.4);
        }

        .memory-card.matched {
          border-color: #4ade80;
          background: linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(74, 222, 128, 0.1));
          animation: bloom 0.6s ease;
        }

        @keyframes bloom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .memory-icon {
          font-size: 56px;
          margin-bottom: 12px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .memory-label {
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 15px;
          color: #fff;
        }

        .branch-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .branch-btn {
          padding: 12px 18px;
          font-size: 28px;
          background: rgba(232, 180, 240, 0.2);
          border: 2px solid rgba(232, 180, 240, 0.5);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .branch-btn:hover {
          background: rgba(232, 180, 240, 0.4);
          transform: scale(1.15);
        }

        .matched-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 10px;
        }

        .matched-indicator .bloom {
          font-size: 40px;
          animation: spin 1s ease;
        }

        @keyframes spin {
          from { transform: rotate(0deg) scale(0); }
          to { transform: rotate(360deg) scale(1); }
        }

        .matched-indicator .text {
          color: #4ade80;
          font-weight: bold;
          font-size: 16px;
        }

        .puzzle-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid rgba(232, 180, 240, 0.3);
        }

        .progress {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .progress-text {
          color: #e8b4f0;
          font-size: 16px;
          font-weight: 500;
        }

        .progress-flowers {
          display: flex;
          gap: 8px;
          font-size: 24px;
        }

        .progress-flowers .bloomed {
          animation: popIn 0.3s ease;
        }

        @keyframes popIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }

        .progress-flowers .waiting {
          opacity: 0.3;
        }
        
        button {
          padding: 12px 24px;
          background: rgba(232, 180, 240, 0.15);
          backdrop-filter: blur(5px);
          border: 2px solid rgba(232, 180, 240, 0.6);
          border-radius: 8px;
          color: #e8b4f0;
          cursor: pointer;
          font-size: 16px;
          font-family: 'Georgia', 'Times New Roman', serif;
          transition: all 0.3s;
        }
        
        button:hover:not(:disabled) {
          background: rgba(232, 180, 240, 0.5);
          transform: scale(1.05);
        }
        
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .hint-button {
          margin-top: 20px;
          padding: 16px 32px;
        }
      `}</style>
    </div>
  )
}
