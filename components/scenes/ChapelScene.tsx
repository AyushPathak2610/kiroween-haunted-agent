'use client'

import { useState, useEffect, useRef } from 'react'
import { speechService } from '@/lib/tts/speechService'
import { useMusic } from '@/lib/audio/musicService'
import { soundEffects } from '@/lib/audio/soundEffects'

interface ChapelSceneProps {
  onDebate?: (ghost: string, message: string) => void
}

export default function ChapelScene({ onDebate }: ChapelSceneProps) {
  const [stage, setStage] = useState<'intro' | 'reunion' | 'reflection' | 'ritual' | 'ending'>('intro')
  const [reflecting, setReflecting] = useState(false)
  const [reflectionMessages, setReflectionMessages] = useState<Array<{ghost: string, message: string}>>([])
  const [ritualProgress, setRitualProgress] = useState(0)
  const [playerChoice, setPlayerChoice] = useState<'ascend' | 'stay' | null>(null)
  const hasSpokenRef = useRef<Set<string>>(new Set())
  // Use speechService directly to avoid re-renders
  const { playSceneMusic } = useMusic()

  // Start Act 5 music
  useEffect(() => {
    playSceneMusic('act5')
  }, [playSceneMusic])

  // Speak narration/dialogue when stage changes (only once per stage)
  useEffect(() => {
    const stageKey = `stage:${stage}`
    if (hasSpokenRef.current.has(stageKey)) return
    hasSpokenRef.current.add(stageKey)
    
    speechService.stop()
    
    if (stage === 'intro') {
      speechService.speak("The Chapel. Stained glass windows depict the family in happier times. The Nexus Crystal glows golden on the altar.", 'narrator')
      setTimeout(() => setStage('reunion'), 15000)
    } else if (stage === 'reunion') {
      // Sequential dialogue - each waits for previous to finish with proper delays
      const speakSequentially = async () => {
        await speechService.speak("The five ghosts stand in a circle. The Nexus Crystal pulses with their combined energy.", 'narrator')
        
        setTimeout(async () => {
          await speechService.speak("My family... together again.", 'elara')
          
          setTimeout(async () => {
            await speechService.speak("I remember everything now.", 'harlan')
            
            setTimeout(async () => {
              await speechService.speak("Mommy! Daddy! You can see me!", 'mira')
              
              setTimeout(async () => {
                await speechService.speak("Brother... I'm sorry I ran.", 'theo')
                
                setTimeout(async () => {
                  await speechService.speak("Theo... I forgive you.", 'selene')
                }, 4000)
              }, 4000)
            }, 4000)
          }, 4000)
        }, 5000)
      }
      speakSequentially()
      
      // Auto-advance to reflection after 54 seconds
      setTimeout(() => {
        triggerFamilyReflection()
      }, 56000)
    } else if (stage === 'ending') {
      // Play finale music
      playSceneMusic('finale')
      speechService.speak("The crystal's light swells, brilliant and warm, wrapping around the five souls like an embrace. In that radiance, they are whole again. Not bound by wires or code, but by something far stronger: forgiveness, love, and the courage to let go. The mansion sighs, releasing its ghosts. And as dawn breaks through the stained glass, the Voss family finally rests. Together. At peace.", 'narrator')
    }
  }, [stage])

  // Cleanup: Stop audio when component unmounts
  useEffect(() => {
    return () => {
      speechService.stop()
    }
  }, [])

  const triggerFamilyReflection = async () => {
    // Stop any ongoing speech from reunion scene
    speechService.stop()
    
    setReflecting(true)
    setStage('reflection')
    setReflectionMessages([])
    
    try {
      const response = await fetch('/api/ghost-debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puzzleContext: 'Final decision - should the family ascend to peace or stay together in the mansion?',
          playerMessage: 'What should the family do?'
        })
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const { debate, consensus } = await response.json()
      
      console.log('Family reflection received:', debate)
      
      // Stream each ghost's reflection with speech - SEQUENTIAL, not parallel
      for (const msg of debate) {
        setReflectionMessages(prev => [...prev, msg])
        await speechService.speak(msg.message, msg.ghost.toLowerCase() as any)
        // Wait for speech to complete before next ghost speaks
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
      
      // Final consensus
      setReflectionMessages(prev => [...prev, { ghost: 'Consensus', message: consensus }])
      await speechService.speak(consensus, 'narrator')
      
      setTimeout(() => {
        setStage('ritual')
        setReflecting(false)
      }, 3000)
    } catch (error) {
      console.error('Family reflection failed:', error)
      setReflectionMessages([{ ghost: 'Error', message: 'The spirits are silent... (Check console for error)' }])
      setReflecting(false)
    }
  }

  const handleRitualClick = (icon: string) => {
    if (ritualProgress < 5) {
      soundEffects.playSuccess()
      setRitualProgress(prev => prev + 1)
      if (ritualProgress + 1 >= 5) {
        setTimeout(() => setStage('ending'), 1000)
      }
    }
  }

  return (
    <div className="scene chapel-scene">
      <div className="background">
        <img
          src={
            stage === 'ending' ? '/shots/finale_1.png' : 
            stage === 'ritual' ? '/shots/5b_1.png' : 
            stage === 'reflection' ? '/shots/5a_3.png' :
            stage === 'reunion' ? '/shots/5a_2.png' :
            '/shots/5a_1.png'
          }
          alt="Chapel"
          style={{ 
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>

      {stage === 'intro' && (
        <div className="dialogue-box">
          <p className="narration">The Chapel. Stained glass windows depict the family in happier times. The Nexus Crystal glows golden on the altar.</p>
        </div>
      )}

      {stage === 'reunion' && (
        <div className="dialogue-box reunion">
          <h2>The Family Reunites</h2>
          <div className="ghost-lineup">
            <div className="ghost-card elara">
              <h4>Elara</h4>
              <p>"My family... together again."</p>
            </div>
            <div className="ghost-card harlan">
              <h4>Harlan</h4>
              <p>"I remember everything now."</p>
            </div>
            <div className="ghost-card mira">
              <h4>Mira</h4>
              <p>"Mommy! Daddy! You can see me!"</p>
            </div>
            <div className="ghost-card theo">
              <h4>Theo</h4>
              <p>"Brother... I'm sorry I ran."</p>
            </div>
            <div className="ghost-card selene">
              <h4>Selene</h4>
              <p>"Theo... I forgive you."</p>
            </div>
          </div>
          <p className="narration">The five ghosts stand in a circle. The Nexus Crystal pulses with their combined energy.</p>
        </div>
      )}

      {stage === 'reflection' && (
        <div className="dialogue-box reflection-box">
          <h2>💫 Family Heart-to-Heart</h2>
          <p className="subtitle">The family shares their deepest feelings...</p>
          <div className="reflection-messages">
            {reflectionMessages.length === 0 ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>The spirits open their hearts...</p>
              </div>
            ) : (
              <div className={`reflection-message ${reflectionMessages[reflectionMessages.length - 1].ghost.toLowerCase()}`}>
                <strong>{reflectionMessages[reflectionMessages.length - 1].ghost}:</strong> {reflectionMessages[reflectionMessages.length - 1].message}
              </div>
            )}
          </div>
          {!reflecting && reflectionMessages.length > 0 && (
            <button onClick={() => setStage('ritual')}>Begin the Ritual →</button>
          )}
        </div>
      )}

      {stage === 'ritual' && (
        <div className="puzzle-container">
          <h2>The Vow Ritual</h2>
          <p>Click the symbols to complete the ritual ({ritualProgress}/5)</p>
          
          <div className="ritual-wheel">
            <div className="wheel-center">
              <div className="nexus-crystal" style={{ opacity: ritualProgress / 5 }}>
                💎
              </div>
            </div>
            
            <div className="ritual-symbols">
              <button onClick={() => handleRitualClick('ring')} className="symbol-btn">
                💍 Ring
              </button>
              <button onClick={() => handleRitualClick('heart')} className="symbol-btn">
                ❤️ Heart
              </button>
              <button onClick={() => handleRitualClick('hand')} className="symbol-btn">
                🤝 Hands
              </button>
              <button onClick={() => handleRitualClick('star')} className="symbol-btn">
                ⭐ Star
              </button>
              <button onClick={() => handleRitualClick('light')} className="symbol-btn">
                ✨ Light
              </button>
            </div>
          </div>
          
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(ritualProgress / 5) * 100}%` }}></div>
          </div>
        </div>
      )}

      {stage === 'ending' && (
        <div className="dialogue-box ending">
          <h2>✨ Eternal Harmony ✨</h2>
          <p className="narration">
            The crystal's light swells, brilliant and warm, wrapping around the five souls like an embrace.
          </p>
          <p className="narration">
            In that radiance, they are whole again. Not bound by wires or code, but by something far stronger: forgiveness, love, and the courage to let go.
          </p>
          <p className="narration">
            The mansion sighs, releasing its ghosts. And as dawn breaks through the stained glass, the Voss family finally rests.
          </p>
          <p className="narration" style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '15px' }}>
            Together. At peace.
          </p>
          <button onClick={() => window.location.reload()}>Play Again</button>
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
          max-width: 550px;
          padding: 15px 18px 20px 18px;
          background: rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(251, 191, 36, 0.6);
          border-radius: 12px;
          z-index: 10;
          color: #fff;
          font-family: 'Georgia', 'Times New Roman', serif;
          font-style: italic;
        }
        
        .dialogue-box.reunion {
          bottom: 20px;
          left: 25%;
          max-width: 750px;
          padding: 12px 15px 18px 15px;
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
          backdrop-filter: blur(12px);
          border: 3px solid rgba(251, 191, 36, 0.5);
          border-radius: 20px;
          color: #fff;
          box-shadow: 0 0 30px rgba(251, 191, 36, 0.3);
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
          border-left: 30px solid #fbbf24;
          border-top: 20px solid transparent;
          border-bottom: 20px solid transparent;
        }
        
        .dialogue-cloud h2, .dialogue-cloud h3 {
          margin: 0 0 15px 0;
          color: #fbbf24;
          font-size: 19px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        
        .dialogue-cloud p {
          margin: 10px 0;
          line-height: 1.7;
          font-size: 15px;
          letter-spacing: 0.3px;
        }
        
        .story-cloud {
          max-width: 550px;
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
          background: rgba(251, 191, 36, 0.2);
          border: 2px solid #fbbf24;
          color: #fbbf24;
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
        
        .reunion {
          max-width: 900px;
        }
        
        .ghost-lineup {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          margin: 20px 0;
        }
        
        .ghost-card {
          padding: 20px 15px;
          border: 2px solid;
          border-radius: 10px;
          text-align: center;
          font-size: 13px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          letter-spacing: 0.3px;
        }
        
        .ghost-card h4 {
          margin: 0 0 12px 0;
          font-size: 15px;
          font-weight: 600;
        }
        
        .ghost-card p {
          margin: 0;
          line-height: 1.6;
        }
        
        .ghost-card.elara { border-color: rgba(74, 144, 226, 0.6); background: rgba(74, 144, 226, 0.08); }
        .ghost-card.harlan { border-color: rgba(74, 222, 128, 0.6); background: rgba(74, 222, 128, 0.08); }
        .ghost-card.mira { border-color: rgba(232, 180, 240, 0.6); background: rgba(232, 180, 240, 0.08); }
        .ghost-card.theo { border-color: rgba(248, 113, 113, 0.6); background: rgba(248, 113, 113, 0.08); }
        .ghost-card.selene { border-color: rgba(167, 139, 250, 0.6); background: rgba(167, 139, 250, 0.08); }
        
        .reflection-box {
          max-width: 700px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .subtitle {
          margin: 10px 0 20px 0;
          color: #fbbf24;
          font-size: 14px;
          text-align: center;
          font-style: italic;
        }
        
        .reflection-messages {
          margin: 20px 0;
          padding: 20px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .reflection-message {
          margin: 15px 0;
          padding: 15px;
          border-left: 4px solid;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          font-size: 15px;
          line-height: 1.6;
        }
        
        .reflection-message strong {
          display: block;
          margin-bottom: 8px;
          font-size: 16px;
        }
        
        .reflection-message.elara { border-color: #4a90e2; }
        .reflection-message.harlan { border-color: #4ade80; }
        .reflection-message.mira { border-color: #e8b4f0; }
        .reflection-message.theo { border-color: #f87171; }
        .reflection-message.selene { border-color: #a78bfa; }
        .reflection-message.consensus { border-color: #fbbf24; background: rgba(251, 191, 36, 0.1); }
        
        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top-color: #fbbf24;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .puzzle-container {
          position: absolute;
          inset: 20px;
          padding: 45px;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(251, 191, 36, 0.6);
          border-radius: 12px;
          z-index: 10;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .ritual-wheel {
          margin: 40px 0;
          position: relative;
        }
        
        .wheel-center {
          width: 150px;
          height: 150px;
          border: 3px solid #fbbf24;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 40px;
          background: rgba(251, 191, 36, 0.1);
        }
        
        .nexus-crystal {
          font-size: 60px;
          animation: glow 2s ease-in-out infinite;
        }
        
        .ritual-symbols {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .symbol-btn {
          padding: 20px 30px;
          font-size: 24px;
          background: rgba(251, 191, 36, 0.2);
          border: 2px solid #fbbf24;
          color: #fbbf24;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .symbol-btn:hover {
          background: rgba(251, 191, 36, 0.4);
          transform: scale(1.1);
        }
        
        .progress-bar {
          width: 100%;
          max-width: 500px;
          height: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
          margin-top: 30px;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #fbbf24, #f59e0b);
          transition: width 0.5s ease;
        }
        
        .ending {
          max-width: 600px;
          left: 25%;
          padding: 12px 15px 18px 15px;
        }
        
        .credits {
          margin: 30px 0;
          padding: 20px;
          background: rgba(251, 191, 36, 0.1);
          border-radius: 8px;
        }
        
        .credits ul {
          list-style: none;
          padding: 0;
          margin: 15px 0 0 0;
        }
        
        .credits li {
          padding: 8px 0;
          font-size: 14px;
        }
        
        button {
          padding: 12px 24px;
          background: rgba(251, 191, 36, 0.15);
          backdrop-filter: blur(5px);
          border: 2px solid rgba(251, 191, 36, 0.6);
          border-radius: 8px;
          color: #fbbf24;
          cursor: pointer;
          font-size: 16px;
          font-family: 'Georgia', 'Times New Roman', serif;
          font-weight: 500;
          letter-spacing: 0.5px;
          transition: all 0.3s;
        }
        
        button:hover:not(:disabled) {
          background: rgba(251, 191, 36, 0.3);
          border-color: rgba(251, 191, 36, 0.8);
          transform: scale(1.05);
        }
        
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 10px #fbbf24); }
          50% { filter: drop-shadow(0 0 30px #fbbf24); }
        }
      `}</style>
    </div>
  )
}
