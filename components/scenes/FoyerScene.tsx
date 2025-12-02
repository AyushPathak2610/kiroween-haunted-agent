'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { speechService } from '@/lib/tts/speechService'
import { useMusic } from '@/lib/audio/musicService'
import { soundEffects } from '@/lib/audio/soundEffects'

interface FoyerSceneProps {
  onComplete: () => void
}

export default function FoyerScene({ onComplete }: FoyerSceneProps) {
  const [stage, setStage] = useState<'intro' | 'elara' | 'puzzle' | 'complete'>('intro')
  const [showingStory, setShowingStory] = useState(false)
  const [storyPart, setStoryPart] = useState(1)
  const [showingHint, setShowingHint] = useState(false)
  const [currentHint, setCurrentHint] = useState('')
  const [hintCount, setHintCount] = useState(0)
  const [puzzleProgress, setPuzzleProgress] = useState(0)
  const [selectedPhotos, setSelectedPhotos] = useState<Record<string, string>>({})
  const hasSpokenRef = useRef<Set<string>>(new Set())
  // Use speechService directly to avoid re-renders
  const { playSceneMusic } = useMusic()

  // Start scene music
  useEffect(() => {
    playSceneMusic('foyer')
  }, [])

  // Speak narration/dialogue when stage changes (only once per stage)
  useEffect(() => {
    const stageKey = `stage:${stage}`
    if (hasSpokenRef.current.has(stageKey)) return
    hasSpokenRef.current.add(stageKey)
    
    // Stop previous audio first
    speechService.stop()
    
    if (stage === 'intro') {
      speechService.speak("You enter the foyer. Dust hangs in moonbeams. A lantern ignites on its own...", 'narrator')
    } else if (stage === 'elara' && !showingStory) {
      speechService.speak("Welcome, traveler. I am Elara... once mother to this family. We are trapped here, our bonds fractured by tragedy. Would you like to hear my story?", 'elara')
    } else if (stage === 'complete') {
      // Only speak once when entering complete stage
      speechService.speak("The tapestry weaves itself... memories restored. Thank you.", 'elara', false)
    }
  }, [stage, showingStory])

  // Speak story parts when they change
  useEffect(() => {
    if (showingStory) {
      speechService.stop()
      
      if (storyPart === 1) {
        speechService.speak("I was Elara Voss, wife to Harlan and mother to our precious Mira. In 2039, our family lived in this mansion - a place of warmth, laughter, and love. I spent my days tending to Mira, reading her stories, singing lullabies. Harlan worked tirelessly in his study, driven by a beautiful dream. He called it Eternal Harmony - a neural link that would connect our family's consciousness forever.", 'elara')
      } else if (storyPart === 2) {
        speechService.speak("No more loneliness, no more misunderstandings. Just pure, unfiltered love and connection. The night of the experiment, we all gathered in the study. We wore the neural crowns, held hands, and activated the link. For one perfect moment, I felt everything. Then the overload hit. Pain. Confusion. Darkness.", 'elara')
      } else if (storyPart === 3) {
        speechService.speak("When I opened my eyes, I was translucent. Glowing. We were ghosts, trapped between worlds. The neural link didn't connect us - it killed us. And now we're bound to this mansion, our bonds fractured, our memories scattered. I remain here, trying to hold our family together. Even in death, a mother's love endures.", 'elara')
      }
    }
  }, [showingStory, storyPart])

  // Cleanup: Stop audio and hide hints when component unmounts or stage changes
  useEffect(() => {
    return () => {
      speechService.stop()
      setShowingHint(false)
      setCurrentHint('')
    }
  }, [stage])



  const handleAskHint = async () => {
    setShowingHint(true)
    setHintCount(prev => prev + 1)
    
    try {
      // Call API to generate character story snippet + hint
      // Each call generates a NEW story but same hint
      const response = await fetch('/api/character-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: 'elara',
          puzzleContext: 'Tapestry puzzle - player must match family photos to memory categories (Sun=happy times, Ring=promises, Crystal=connections)',
          characterBackground: 'Elara Voss, the mother, who spent her days caring for Mira and supporting Harlan. She represents family bonds and maternal love.',
          hintNumber: hintCount + 1
        })
      })
      
      const { story, hint } = await response.json()
      
      console.log(`Hint #${hintCount + 1} - Story: "${story.substring(0, 50)}..."`)
      
      // First show and speak the story snippet (1-2 lines) - DIFFERENT each time
      setCurrentHint(story)
      speechService.speak(story, 'elara', true) // Force speak even if repeated
      
      // After story finishes (estimate 6 seconds), append the hint
      setTimeout(() => {
        setCurrentHint(`${story}\n\n${hint}`)
        speechService.speak(hint, 'elara', true) // Force speak even if repeated
        
        // Hide hint after speaking (estimate 15 seconds total)
        setTimeout(() => {
          setShowingHint(false)
          setCurrentHint('')
        }, 15000)
      }, 6000)
      
    } catch (error) {
      console.error('Failed to get hint:', error)
      // Fallback to static hint with variety
      const fallbackStories = [
        "I remember when this mansion was filled with warmth and love. Those days feel like a distant dream now.",
        "Sometimes I hear Mira's laughter echoing through these halls. It breaks my heart every time.",
        "Harlan worked so hard to keep us together. If only I had known what his experiment would cost us."
      ]
      const fallbackStory = fallbackStories[hintCount % fallbackStories.length]
      const fallbackHint = "Look at the symbols on the tapestry. The sun represents happy memories, the ring represents promises and bonds, and the crystal represents our connection."
      
      setCurrentHint(fallbackStory)
      speechService.speak(fallbackStory, 'elara', true) // Force speak even if repeated
      
      setTimeout(() => {
        setCurrentHint(`${fallbackStory}\n\n${fallbackHint}`)
        speechService.speak(fallbackHint, 'elara', true) // Force speak even if repeated
        
        setTimeout(() => {
          setShowingHint(false)
          setCurrentHint('')
        }, 15000)
      }, 6000)
    }
  }

  // 6 memories (questions) - each has one correct answer
  const memories = [
    { id: 'picnic', correctAnswer: 'sun', label: 'Family Picnic', emoji: '🧺' },
    { id: 'wedding', correctAnswer: 'ring', label: 'Wedding Day', emoji: '💒' },
    { id: 'lab', correctAnswer: 'crystal', label: 'Lab Work', emoji: '🔬' },
    { id: 'birthday', correctAnswer: 'sun', label: 'Birthday Party', emoji: '🎂' },
    { id: 'promise', correctAnswer: 'ring', label: 'Promise Made', emoji: '🤝' },
    { id: 'neural', correctAnswer: 'crystal', label: 'Neural Link', emoji: '🧠' },
  ]

  // 6 answer options (same for all questions)
  const answerOptions = [
    { id: 'sun', label: 'Sun', emoji: '☀️' },
    { id: 'ring', label: 'Ring', emoji: '💍' },
    { id: 'crystal', label: 'Crystal', emoji: '💎' },
    { id: 'moon', label: 'Moon', emoji: '🌙' },
    { id: 'star', label: 'Star', emoji: '⭐' },
    { id: 'heart', label: 'Heart', emoji: '❤️' },
  ]

  // Shuffle both on mount
  const [shuffledMemories] = useState(() => [...memories].sort(() => Math.random() - 0.5))
  const [shuffledOptions] = useState(() => [...answerOptions].sort(() => Math.random() - 0.5))

  const handlePhotoSelect = (memoryId: string, selectedAnswer: string) => {
    const memory = memories.find(m => m.id === memoryId)
    if (memory && memory.correctAnswer === selectedAnswer) {
      soundEffects.playSuccess()
      setSelectedPhotos(prev => ({ ...prev, [memoryId]: selectedAnswer }))
      setPuzzleProgress(prev => prev + 1)
      
      if (Object.keys(selectedPhotos).length + 1 >= memories.length) {
        setTimeout(() => setStage('complete'), 1000)
      }
    } else {
      soundEffects.playError()
    }
  }

  return (
    <div className="scene foyer-scene">
      <div className="background">
        <Image
          src={
            stage === 'complete' ? '/shots/1a_3.png' :
            stage === 'puzzle' ? '/shots/1b_1.png' : 
            stage === 'elara' ? '/shots/1a_2.png' : 
            '/shots/1a_1.png'
          }
          alt="Foyer"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {stage === 'intro' && (
        <div className="dialogue-box">
          <p className="narration">You enter the foyer. Dust hangs in moonbeams. A lantern ignites on its own...</p>
          <button onClick={() => setStage('elara')}>Continue →</button>
        </div>
      )}

      {stage === 'elara' && (
        <div className="dialogue-cloud-container">
          <div className="dialogue-cloud">
            <h3>Elara (Mother)</h3>
            
            {!showingStory ? (
              <>
                <p>"Welcome, traveler. I am Elara... once mother to this family. We are trapped here, our bonds fractured by tragedy."</p>
                <p>"Would you like to hear my story?"</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button onClick={() => setShowingStory(true)}>Hear Her Story</button>
                  <button onClick={() => setStage('puzzle')}>Begin Puzzle</button>
                </div>
              </>
            ) : (
              <>
                <div className="story-text">
                  {storyPart === 1 && (
                    <>
                      <p>I was Elara Voss, wife to Harlan and mother to our precious Mira.</p>
                      <p>In 2039, our family lived in this mansion - a place of warmth, laughter, and love. I spent my days tending to Mira, reading her stories, singing lullabies. Harlan worked tirelessly in his study, driven by a beautiful dream.</p>
                      <p>He called it "Eternal Harmony" - a neural link that would connect our family's consciousness forever...</p>
                    </>
                  )}
                  {storyPart === 2 && (
                    <>
                      <p>No more loneliness, no more misunderstandings. Just pure, unfiltered love and connection.</p>
                      <p>The night of the experiment, we all gathered in the study. We wore the neural crowns, held hands, and activated the link. For one perfect moment, I felt everything.</p>
                      <p>Then the overload hit. Pain. Confusion. Darkness...</p>
                    </>
                  )}
                  {storyPart === 3 && (
                    <>
                      <p>When I opened my eyes, I was translucent. Glowing. We were ghosts, trapped between worlds.</p>
                      <p>The neural link didn't connect us - it killed us. And now we're bound to this mansion, our bonds fractured, our memories scattered.</p>
                      <p>I remain here, trying to hold our family together. Even in death, a mother's love endures.</p>
                    </>
                  )}
                </div>
                {storyPart < 3 ? (
                  <button onClick={() => setStoryPart(prev => prev + 1)} className="continue-btn">...</button>
                ) : (
                  <button onClick={() => setStage('puzzle')}>Begin Puzzle</button>
                )}
                <button onClick={() => setStage('puzzle')} className="skip-btn">Skip Story</button>
              </>
            )}
          </div>
        </div>
      )}

      {stage === 'puzzle' && (
        <div className="puzzle-container">
          <h2>✨ Harlan's Threads - Memory Tapestry ✨</h2>
          
          <div className="puzzle-grid">
            {shuffledMemories.map(memory => (
              <div 
                key={memory.id} 
                className={`photo-card ${selectedPhotos[memory.id] ? 'matched' : ''}`}
              >
                <div className="photo-icon">{memory.emoji}</div>
                <div className="photo-label">{memory.label}</div>
                {!selectedPhotos[memory.id] ? (
                  <div className="category-buttons">
                    {shuffledOptions.map(option => (
                      <button 
                        key={option.id}
                        onClick={() => handlePhotoSelect(memory.id, option.id)}
                        className="category-btn"
                        title={option.label}
                      >
                        {option.emoji}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="matched-indicator">✓ Matched!</div>
                )}
              </div>
            ))}
          </div>

          <div className="puzzle-controls">
            <button onClick={handleAskHint} disabled={showingHint} className="hint-btn">
              {showingHint ? '💭 Elara is speaking...' : '💭 Ask Elara for Hint'}
            </button>
            <div className="progress">Progress: {puzzleProgress}/{memories.length}</div>
          </div>
        </div>
      )}

      {stage === 'complete' && (
        <div className="dialogue-box success">
          <h3 style={{ marginBottom: '20px' }}>✨ Puzzle Complete!</h3>
          <p className="ghost-elara">"The tapestry weaves itself... memories restored. Thank you."</p>
          <button onClick={onComplete}>Enter the Study →</button>
        </div>
      )}

      {/* Movie-style hint subtitle at bottom */}
      {showingHint && currentHint && (
        <div className="hint-subtitle">
          <div className="hint-character">Elara whispers:</div>
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
          border: 2px solid rgba(74, 144, 226, 0.6);
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
          border: 2px solid rgba(74, 144, 226, 0.6);
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
          border-left: 25px solid rgba(74, 144, 226, 0.6);
          border-top: 18px solid transparent;
          border-bottom: 18px solid transparent;
        }
        
        .dialogue-cloud h3 {
          margin: 0 0 15px 0;
          color: #4a90e2;
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
          background: rgba(74, 144, 226, 0.15);
          border: 2px solid rgba(74, 144, 226, 0.6);
          color: #4a90e2;
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'Georgia', serif;
        }
        
        .continue-btn:hover {
          background: rgba(74, 144, 226, 0.25);
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
        
        .ghost-portrait {
          float: left;
          margin-right: 20px;
          border: 2px solid #4a90e2;
          border-radius: 50%;
          overflow: hidden;
        }
        
        .puzzle-container {
          position: absolute;
          inset: 20px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.85);
          border: 2px solid #4a90e2;
          border-radius: 8px;
          z-index: 10;
          overflow-y: auto;
          color: #fff;
        }
        
        .puzzle-subtitle {
          text-align: center;
          color: #aaa;
          font-size: 14px;
          margin-bottom: 20px;
          font-style: italic;
        }

        .tapestry-legend {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin: 20px 0 30px 0;
          padding: 15px;
          background: rgba(74, 144, 226, 0.1);
          border-radius: 8px;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .legend-icon {
          font-size: 24px;
        }

        .legend-text {
          font-size: 14px;
          color: #ddd;
        }
        
        .puzzle-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin: 20px 0;
        }
        
        .photo-card {
          padding: 20px;
          background: linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(74, 144, 226, 0.05));
          border: 2px solid rgba(74, 144, 226, 0.3);
          border-radius: 12px;
          text-align: center;
          transition: all 0.3s ease;
          min-height: 180px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .photo-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(74, 144, 226, 0.3);
        }
        
        .photo-card.matched {
          border-color: #4ade80;
          background: linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(74, 222, 128, 0.1));
          animation: matchPulse 0.5s ease;
        }

        @keyframes matchPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .photo-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .photo-label {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 15px;
          color: #fff;
        }
        
        .category-buttons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          justify-content: center;
        }
        
        .category-btn {
          padding: 8px 10px;
          font-size: 20px;
          background: rgba(74, 144, 226, 0.2);
          border: 2px solid rgba(74, 144, 226, 0.4);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-btn:hover {
          background: rgba(74, 144, 226, 0.4);
          transform: scale(1.05);
        }

        .matched-indicator {
          color: #4ade80;
          font-weight: bold;
          font-size: 16px;
          padding: 10px;
        }
        
        .puzzle-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
        }
        
        button {
          padding: 12px 24px;
          background: rgba(74, 144, 226, 0.15);
          backdrop-filter: blur(5px);
          border: 2px solid rgba(74, 144, 226, 0.6);
          border-radius: 8px;
          color: #4a90e2;
          cursor: pointer;
          font-size: 16px;
          font-family: 'Georgia', 'Times New Roman', serif;
          transition: all 0.3s;
        }
        
        button:hover:not(:disabled) {
          background: rgba(74, 144, 226, 0.5);
          transform: scale(1.05);
        }
        
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .success {
          border-color: #4ade80;
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
          border: 2px solid #ff69b4;
          border-radius: 8px;
          z-index: 100;
          text-align: center;
          box-shadow: 0 0 30px rgba(255, 105, 180, 0.5);
          animation: fadeInUp 0.5s ease-out;
        }

        .hint-character {
          font-size: 14px;
          color: #ff69b4;
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
