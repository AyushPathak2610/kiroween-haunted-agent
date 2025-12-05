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
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Preload all scene images on mount with progress tracking
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

    const promises = imagesToPreload.map(src => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => {
          loadedCount++
          setLoadingProgress(Math.round((loadedCount / totalImages) * 100))
          resolve()
        }
        img.onerror = () => {
          loadedCount++
          setLoadingProgress(Math.round((loadedCount / totalImages) * 100))
          resolve()
        }
        img.src = src
      })
    })

    Promise.all(promises).then(() => {
      // Small delay to ensure everything is ready
      setTimeout(() => setImagesPreloaded(true), 100)
    })
  }, [])

  return (
    <div className="game-container">
      {!imagesPreloaded && (
        <div className="loading-screen">
          <div className="loading-content">
            <h1 className="loading-title">MIDNIGHT AT THE VOSS MANOR</h1>
            <div className="loading-bar">
              <div className="loading-fill" style={{ width: `${loadingProgress}%` }} />
            </div>
            <p className="loading-text">Loading memories... {loadingProgress}%</p>
          </div>
          
          <style jsx>{`
            .loading-screen {
              position: fixed;
              inset: 0;
              background: #0a0a1a;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 9999;
            }
            
            .loading-content {
              text-align: center;
              max-width: 600px;
              padding: 40px;
            }
            
            .loading-title {
              font-family: 'Playfair Display', serif;
              font-weight: 900;
              font-size: 48px;
              color: #E0E0E0;
              text-transform: uppercase;
              letter-spacing: 8px;
              margin-bottom: 40px;
              text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
              filter: drop-shadow(2px 0 0 rgba(255, 0, 0, 0.3)) drop-shadow(-2px 0 0 rgba(0, 255, 255, 0.3));
            }
            
            .loading-bar {
              width: 100%;
              height: 8px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 4px;
              overflow: hidden;
              margin-bottom: 20px;
            }
            
            .loading-fill {
              height: 100%;
              background: linear-gradient(90deg, #4a90e2, #e8b4f0);
              transition: width 0.3s ease;
            }
            
            .loading-text {
              font-family: 'Montserrat', sans-serif;
              font-size: 16px;
              color: #888;
              letter-spacing: 2px;
            }
          `}</style>
        </div>
      )}
      
      <TTSToggle />
      
      {imagesPreloaded && currentScene === 'intro' && <IntroScene onComplete={() => setCurrentScene('foyer')} />}
      {imagesPreloaded && currentScene === 'foyer' && (
        <FoyerScene 
          onComplete={() => setCurrentScene('transition1')} 
        />
      )}
      {imagesPreloaded && currentScene === 'transition1' && (
        <TransitionScreen onComplete={() => setCurrentScene('study')} />
      )}
      {imagesPreloaded && currentScene === 'study' && (
        <StudyScene 
          onComplete={() => setCurrentScene('transition2')} 
        />
      )}
      {imagesPreloaded && currentScene === 'transition2' && (
        <TransitionScreen onComplete={() => setCurrentScene('nursery')} />
      )}
      {imagesPreloaded && currentScene === 'nursery' && (
        <NurseryScene 
          onComplete={() => setCurrentScene('hallway')} 
        />
      )}
      {imagesPreloaded && currentScene === 'hallway' && (
        <HallwayScene 
          onComplete={() => setCurrentScene('chapel')} 
        />
      )}
      {imagesPreloaded && currentScene === 'chapel' && (
        <ChapelScene />
      )}
    </div>
  )
}
