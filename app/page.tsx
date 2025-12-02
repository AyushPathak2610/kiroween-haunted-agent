'use client'

import { useState } from 'react'
import IntroScene from '@/components/scenes/IntroScene'
import FoyerScene from '@/components/scenes/FoyerScene'
import StudyScene from '@/components/scenes/StudyScene'
import NurseryScene from '@/components/scenes/NurseryScene'
import HallwayScene from '@/components/scenes/HallwayScene'
import ChapelScene from '@/components/scenes/ChapelScene'
import TTSToggle from '@/components/TTSToggle'

export default function Home() {
  const [currentScene, setCurrentScene] = useState<'intro' | 'foyer' | 'study' | 'nursery' | 'hallway' | 'chapel'>('intro')

  return (
    <div className="game-container">
      <TTSToggle />
      
      {currentScene === 'intro' && <IntroScene onComplete={() => setCurrentScene('foyer')} />}
      {currentScene === 'foyer' && (
        <FoyerScene 
          onComplete={() => setCurrentScene('study')} 
        />
      )}
      {currentScene === 'study' && (
        <StudyScene 
          onComplete={() => setCurrentScene('nursery')} 
        />
      )}
      {currentScene === 'nursery' && (
        <NurseryScene 
          onComplete={() => setCurrentScene('hallway')} 
        />
      )}
      {currentScene === 'hallway' && (
        <HallwayScene 
          onComplete={() => setCurrentScene('chapel')} 
        />
      )}
      {currentScene === 'chapel' && (
        <ChapelScene />
      )}
    </div>
  )
}
