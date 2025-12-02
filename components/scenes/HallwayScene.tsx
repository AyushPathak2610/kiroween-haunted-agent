'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { speechService } from '@/lib/tts/speechService'
import { useMusic } from '@/lib/audio/musicService'
import { soundEffects } from '@/lib/audio/soundEffects'

interface HallwaySceneProps {
  onComplete: () => void
}

export default function HallwayScene({ onComplete }: HallwaySceneProps) {
  const [stage, setStage] = useState<'4a1' | '4a2' | '5_1_1' | 'puzzle' | 'complete'>('4a1')
  const [dialoguePart, setDialoguePart] = useState(1)
  const [currentWall, setCurrentWall] = useState(0)
  const [showingHint, setShowingHint] = useState(false)
  const [currentHint, setCurrentHint] = useState('')
  const hasSpokenRef = useRef<Set<string>>(new Set())
  const { playSceneMusic } = useMusic()

  const thornyWalls = [
    {
      question: "What heals a broken vow?",
      options: ["Excuses", "Apology", "Silence", "Time"],
      correct: 1
    },
    {
      question: "What does love require?",
      options: ["Perfection", "Courage", "Wealth", "Beauty"],
      correct: 1
    },
    {
      question: "How do you fix running away?",
      options: ["Hide longer", "Return and face it", "Forget it", "Blame others"],
      correct: 1
    },
    {
      question: "What breaks the cycle of pain?",
      options: ["Revenge", "Forgiveness", "Avoidance", "Anger"],
      correct: 1
    },
    {
      question: "What binds two souls?",
      options: ["Fear", "Obligation", "Trust", "Possession"],
      correct: 2
    },
    {
      question: "What opens the locked door?",
      options: ["Force", "Patience", "Understanding", "Magic"],
      correct: 2
    }
  ]

  useEffect(() => {
    playSceneMusic('chapel')
  }, [])

  useEffect(() => {
    const stageKey = `stage:${stage}`
    if (hasSpokenRef.current.has(stageKey)) return
    hasSpokenRef.current.add(stageKey)
    
    speechService.stop()
    
    if (stage === '4a1') {
      speechService.speak("An infinite hallway loop. The wallpaper is peeling. The floor is covered in wilted rose petals.", 'narrator')
      setTimeout(() => setStage('4a2'), 15000)
    } else if (stage === '4a2') {
      speechService.speak("Theo paces back and forth. A ring box orbits his head like a moon. A door is blocked by massive thorny vines.", 'narrator')
      setTimeout(() => setStage('5_1_1'), 15000)
    } else if (stage === 'complete') {
      speechService.speak("The door opens. Selene emerges, veiled in wedding dress, eyes softening. They clasp hands, veils thin. Path to chapel clears.", 'narrator')
      setTimeout(() => onComplete(), 20000)
    }
  }, [stage, onComplete])

  const speakTheoSeleneDialogue = () => {
    if (dialoguePart === 1) {
      speechService.speak("Weaver... Theo, Harlan's brother. I fled Selene's love, fearing my shadows.", 'theo')
    } else if (dialoguePart === 2) {
      speechService.speak("Came back to wed – she locked me out, hearts broken as nexus failed. I wander here eternally.", 'theo')
    } else if (dialoguePart === 3) {
      speechService.speak("Free her... then seal our vow.", 'theo')
    } else if (dialoguePart === 4) {
      speechService.speak("Theo... you returned. But pain lingers.", 'selene')
    } else if (dialoguePart === 5) {
      speechService.speak("Now... our rings await.", 'selene')
    }
  }

  useEffect(() => {
    if (stage === '5_1_1' && dialoguePart >= 1 && dialoguePart <= 5) {
      // Stop previous speech before starting new one
      speechService.stop()
      speakTheoSeleneDialogue()
    }
  }, [stage, dialoguePart])

  const handleAnswer = (selectedIndex: number) => {
    const wall = thornyWalls[currentWall]
    
    if (selectedIndex === wall.correct) {
      soundEffects.playSuccess()
      if (currentWall < thornyWalls.length - 1) {
        setCurrentWall(prev => prev + 1)
      } else {
        setStage('complete')
      }
    } else {
      soundEffects.playError()
    }
  }

  const handleAskHint = () => {
    setShowingHint(true)
    const hints = [
      "Forgiveness navigates thorns... What fixes running away? Say sorry.",
      "Love requires bravery, not perfection.",
      "The path forward is through honesty and courage.",
      "Trust is the foundation that binds souls together.",
      "Understanding opens doors that force cannot."
    ]
    const hint = hints[currentWall] || hints[0]
    setCurrentHint(hint)
    speechService.speak(hint, 'theo')
    
    setTimeout(() => {
      setShowingHint(false)
      setCurrentHint('')
    }, 10000)
  }

  return (
    <div className="scene hallway-scene">
      <div className="background">
        <Image
          src={
            stage === 'complete' ? '/shots/4b_2.png' :
            stage === 'puzzle' ? '/shots/4a_3.png' :
            stage === '5_1_1' ? '/shots/5_1_1.png' :
            stage === '4a2' ? '/shots/4a_2.png' :
            '/shots/4a_1.png'
          }
          alt="Hallway"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {stage === '4a1' && (
        <div className="dialogue-box">
          <p className="narration">An infinite hallway loop. The wallpaper is peeling. The floor is covered in wilted rose petals.</p>
        </div>
      )}

      {stage === '4a2' && (
        <div className="dialogue-box">
          <p className="narration">Theo paces back and forth. A ring box orbits his head like a moon. A door is blocked by massive thorny vines.</p>
        </div>
      )}

      {stage === '5_1_1' && (
        <div className="dialogue-cloud-container">
          <div className="dialogue-cloud">
            <h3>{dialoguePart <= 3 ? 'Theo' : 'Selene'}</h3>
            
            <div className="story-text">
              {dialoguePart === 1 && (
                <p>"Weaver... Theo, Harlan's brother. I fled Selene's love, fearing my shadows."</p>
              )}
              {dialoguePart === 2 && (
                <p>"Came back to wed – she locked me out, hearts broken as nexus failed. I wander here eternally."</p>
              )}
              {dialoguePart === 3 && (
                <p>"Free her... then seal our vow."</p>
              )}
              {dialoguePart === 4 && (
                <p>"Theo... you returned. But pain lingers."</p>
              )}
              {dialoguePart === 5 && (
                <p>"Now... our rings await."</p>
              )}
            </div>
            
            {dialoguePart < 5 ? (
              <button onClick={() => setDialoguePart(prev => prev + 1)} className="continue-btn">...</button>
            ) : (
              <button onClick={() => setStage('puzzle')}>Begin Puzzle</button>
            )}
            <button onClick={() => setStage('puzzle')} className="skip-btn">Skip Dialogue</button>
          </div>
        </div>
      )}

      {stage === 'complete' && (
        <div className="dialogue-box success">
          <h3 style={{ marginBottom: '20px' }}>✨ Door Unlocked!</h3>
          <p className="ghost-theo">"The door opens. Selene emerges, veiled in wedding dress, eyes softening. They clasp hands, veils thin. Path to chapel clears."</p>
          <button onClick={onComplete}>Continue to Chapel →</button>
        </div>
      )}

      {stage === 'puzzle' && (
        <div className="puzzle-container">
          <h2>Rose Door-Unlock Maze</h2>
          <p className="puzzle-subtitle">Navigate the thorny walls to reach Selene</p>
          
          <div className="maze-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(currentWall / thornyWalls.length) * 100}%` }}
              />
            </div>
            <p>Wall {currentWall + 1} of {thornyWalls.length}</p>
          </div>

          <div className="thorny-wall">
            <h3>{thornyWalls[currentWall].question}</h3>
            <div className="options-grid">
              {thornyWalls[currentWall].options.map((option, index) => (
                <button
                  key={index}
                  className="option-button"
                  onClick={() => handleAnswer(index)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="puzzle-controls">
            <button onClick={handleAskHint} disabled={showingHint} className="hint-button">
              {showingHint ? '💭 Theo whispers...' : '💭 Ask Theo for Hint'}
            </button>
          </div>
        </div>
      )}

      {showingHint && currentHint && (
        <div className="hint-subtitle">
          <div className="hint-character">Theo whispers:</div>
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
          border: 2px solid rgba(139, 69, 19, 0.6);
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
          border: 2px solid rgba(139, 69, 19, 0.6);
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
          border-left: 25px solid rgba(139, 69, 19, 0.6);
          border-top: 18px solid transparent;
          border-bottom: 18px solid transparent;
        }
        
        .dialogue-cloud h3 {
          margin: 0 0 15px 0;
          color: #d4a574;
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
          min-height: 100px;
        }
        
        .story-text p:last-child {
          margin-bottom: 0;
        }
        
        .continue-btn {
          width: 100%;
          margin-top: 35px;
          padding: 10px;
          font-size: 24px;
          background: rgba(139, 69, 19, 0.15);
          border: 2px solid rgba(139, 69, 19, 0.6);
          color: #d4a574;
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'Georgia', serif;
        }
        
        .continue-btn:hover {
          background: rgba(139, 69, 19, 0.25);
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
        
        .success {
          border-color: #4ade80;
        }

        .puzzle-container {
          position: absolute;
          inset: 40px;
          padding: 30px;
          background: rgba(0, 0, 0, 0.9);
          border: 3px solid rgba(139, 69, 19, 0.8);
          border-radius: 12px;
          z-index: 10;
          overflow-y: auto;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .puzzle-container h2 {
          margin: 0 0 10px 0;
          color: #d4a574;
          font-size: 32px;
          text-align: center;
          font-family: 'Georgia', serif;
        }

        .puzzle-subtitle {
          margin: 0 0 30px 0;
          color: #aaa;
          font-size: 16px;
          text-align: center;
          font-style: italic;
        }

        .maze-progress {
          width: 100%;
          max-width: 600px;
          margin-bottom: 40px;
        }

        .progress-bar {
          width: 100%;
          height: 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(139, 69, 19, 0.6);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b4513, #d4a574);
          transition: width 0.5s ease;
        }

        .maze-progress p {
          text-align: center;
          color: #d4a574;
          font-size: 14px;
          margin: 0;
        }

        .thorny-wall {
          width: 100%;
          max-width: 700px;
          padding: 40px;
          background: rgba(139, 69, 19, 0.1);
          border: 2px solid rgba(139, 69, 19, 0.6);
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .thorny-wall h3 {
          margin: 0 0 30px 0;
          color: #fff;
          font-size: 24px;
          text-align: center;
          font-family: 'Georgia', serif;
          line-height: 1.4;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .option-button {
          padding: 20px;
          background: rgba(139, 69, 19, 0.2);
          backdrop-filter: blur(5px);
          border: 2px solid rgba(139, 69, 19, 0.6);
          border-radius: 8px;
          color: #d4a574;
          cursor: pointer;
          font-size: 18px;
          font-family: 'Georgia', serif;
          transition: all 0.3s;
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .option-button:hover {
          background: rgba(139, 69, 19, 0.4);
          border-color: rgba(212, 165, 116, 0.8);
          transform: scale(1.05);
        }
        
        button {
          padding: 12px 24px;
          background: rgba(139, 69, 19, 0.15);
          backdrop-filter: blur(5px);
          border: 2px solid rgba(139, 69, 19, 0.6);
          border-radius: 8px;
          color: #d4a574;
          cursor: pointer;
          font-size: 16px;
          font-family: 'Georgia', 'Times New Roman', serif;
          transition: all 0.3s;
        }
        
        button:hover:not(:disabled) {
          background: rgba(139, 69, 19, 0.5);
          transform: scale(1.05);
        }
        
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .puzzle-controls {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .hint-button {
          padding: 15px 30px;
          background: rgba(139, 69, 19, 0.3);
          backdrop-filter: blur(5px);
          border: 2px solid rgba(139, 69, 19, 0.6);
          border-radius: 8px;
          color: #d4a574;
          cursor: pointer;
          font-size: 16px;
          font-family: 'Georgia', serif;
          transition: all 0.3s;
        }

        .hint-button:hover:not(:disabled) {
          background: rgba(139, 69, 19, 0.5);
          transform: scale(1.05);
        }

        .hint-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .hint-subtitle {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          max-width: 80%;
          padding: 20px 30px;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px);
          border: 2px solid #d4a574;
          border-radius: 8px;
          z-index: 100;
          text-align: center;
          box-shadow: 0 0 30px rgba(212, 165, 116, 0.5);
          animation: fadeInUp 0.5s ease-out;
        }

        .hint-character {
          font-size: 14px;
          color: #d4a574;
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
