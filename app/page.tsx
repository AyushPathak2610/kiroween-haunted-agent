'use client'

import { useState, useEffect } from 'react'
import IntroScene from '@/components/scenes/IntroScene'
import FoyerScene from '@/components/scenes/FoyerScene'
import StudyScene from '@/components/scenes/StudyScene'
import NurseryScene from '@/components/scenes/NurseryScene'
import HallwayScene from '@/components/scenes/HallwayScene'
import ChapelScene from '@/components/scenes/ChapelScene'
import TransitionScreen from '@/components/TransitionScreen'
import TTSToggle from '@/components/TTSToggle'

export default function Home() {
  const [currentScene, setCurrentScene] = useState<'intro' | 'foyer' | 'transition1' | 'study' | 'transition2' | 'nursery' | 'hallway' | 'chapel'>('intro')
  const [imagesPreloaded, setImagesPreloaded] = useState(false)

  // Preload all scene images on mount
  useEffect(() => {
    const imagesToPreload = [
      '/shots/int_start.png',
      '/shots/intro_1.png',
      '/shots/intro_2.png',
      '/shots/intro_3.png',
      '/shots/intro_4.png',
      '/shots/1a_1.png',
      '/shots/1a_2.png',
      '/shots/1a_3.png',
      '/shots/1b_1.png',
      '/shots/2a_1.png',
      '/shots/2a_2.png',
      '/shots/2a_3.png',
      '/shots/2b_1.png',
      '/shots/3a_1.png',
      '/shots/3a_2.png',
      '/shots/3a_3.png',
      '/shots/3b_1.png',
      '/shots/4a_1.png',
      '/shots/4a_2.png',
      '/shots/4a_3.png',
      '/shots/4b_2.png',
      '/shots/5_1_1.png',
      '/shots/5a_1.png',
      '/shots/5a_2.png',
      '/shots/5a_3.png',
      '/shots/5b_1.png',
      '/shots/finale_1.png',
      '/shots/hallway.png'
    ]

    let loadedCount = 0
    const totalImages = imagesToPreload.length

    imagesToPreload.forEach(src => {
      const img = new Image()
      img.onload = () => {
        loadedCount++
        if (loadedCount === totalImages) {
          setImagesPreloaded(true)
        }
      }
      img.onerror = () => {
        loadedCount++
        if (loadedCount === totalImages) {
          setImagesPreloaded(true)
        }
      }
      img.src = src
    })
  }, [])

  return (
    <div className="game-container">
      <TTSToggle />
      
      {currentScene === 'intro' && <IntroScene onComplete={() => setCurrentScene('foyer')} />}
      {currentScene === 'foyer' && (
        <FoyerScene 
          onComplete={() => setCurrentScene('transition1')} 
        />
      )}
      {currentScene === 'transition1' && (
        <TransitionScreen onComplete={() => setCurrentScene('study')} />
      )}
      {currentScene === 'study' && (
        <StudyScene 
          onComplete={() => setCurrentScene('transition2')} 
        />
      )}
      {currentScene === 'transition2' && (
        <TransitionScreen onComplete={() => setCurrentScene('nursery')} />
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
