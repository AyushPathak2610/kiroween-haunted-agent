# ✅ TTS Issues Fixed

## Issues Resolved

### 1. ✅ Overlapping Voices Fixed
**Problem**: Two voices playing at the same time
**Solution**: 
- Added `stop()` call before speaking new text in all scenes
- 100ms delay ensures previous audio is fully stopped before new audio starts
- Each scene now stops audio on stage change

### 2. ✅ Audio Continues When Moving to Next Screen
**Problem**: Previous screen's audio keeps playing when moving to next scene
**Solution**:
- Added cleanup `useEffect` in all scene components
- Calls `stop()` when component unmounts
- Ensures audio stops when transitioning between scenes

### 3. ✅ Text Read Only Once
**Problem**: Same text being read multiple times
**Solution**:
- Added `spokenTexts` Set to track what's been spoken
- Each text+character combination is tracked
- Won't speak same text twice unless forced
- Added `clearSpokenHistory()` method for game restart

### 4. ✅ Intro Screens Too Fast
**Problem**: Intro screens changing every 3 seconds
**Solution**:
- Changed from 3000ms to 10000ms (10 seconds per screen)
- Gives time to read narration and enjoy visuals

## Updated Files

### `lib/tts/speechService.ts`
- Added `spokenTexts: Set<string>` to track spoken text
- Modified `speak()` to check if text already spoken
- Added `clearSpokenHistory()` method
- Improved `stop()` to reset audio currentTime

### All Scene Components
- `IntroScene.tsx` - 10 second timing, cleanup on unmount
- `FoyerScene.tsx` - Stop audio on stage change, cleanup on unmount
- `StudyScene.tsx` - Stop audio on stage change, cleanup on unmount
- `NurseryScene.tsx` - Stop audio on stage change, cleanup on unmount
- `ChapelScene.tsx` - Stop audio on stage change, cleanup on unmount

## How It Works Now

### Scene Transitions
```typescript
// When stage changes:
1. Stop any playing audio
2. Wait 100ms for cleanup
3. Speak new text (only if not spoken before)

// When component unmounts:
1. Stop all audio
2. Clear queue
```

### Audio Flow
```
User enters scene → Narration plays once
User moves to next stage → Previous audio stops → New audio plays once
User moves to next scene → All audio stops → New scene audio plays once
```

## Testing

1. **Test overlapping voices**: 
   - Move quickly between scenes
   - Should hear only current scene's audio

2. **Test repeat prevention**:
   - Stay on same stage
   - Audio should play only once

3. **Test cleanup**:
   - Move to next scene while audio playing
   - Previous audio should stop immediately

4. **Test intro timing**:
   - Each intro screen should show for 10 seconds
   - Skip button still works instantly

## Character Voices (Reminder)

- **Elara**: Cora Multilingual - Very sad, mournful (Style: 2.0)
- **Harlan**: Guy Neural - Confused scientist
- **Mira**: Evelyn Multilingual - Youthful child
- **Theo**: Ryan Neural - British theatrical
- **Selene**: Nancy Multilingual - Authoritative professional
- **Narrator**: Serena Multilingual - Mature, commanding

## Ghost Council Debates

- Movie-style captions in center of screen
- Doesn't block scroll
- Dialogue clouds remain in panel
- Each ghost has unique caption color
- Auto-hides after 4+ seconds

---

**All TTS issues resolved!** The game now has clean audio transitions with no overlaps or repeats.
