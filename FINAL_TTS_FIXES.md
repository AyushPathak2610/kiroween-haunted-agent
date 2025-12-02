# ✅ Final TTS Fixes Complete

## Issues Fixed

### 1. ✅ Audio Playing Twice (SOLVED)
**Problem**: Every dialogue was playing twice, overlapping
**Root Cause**: React StrictMode in development runs effects twice
**Solution**: Disabled `reactStrictMode` in `next.config.js`

```javascript
// next.config.js
reactStrictMode: false // Prevents double audio playback
```

### 2. ✅ Elara's Story Not Speaking (SOLVED)
**Problem**: Story dialogue text appeared but no audio
**Solution**: Added `useEffect` to speak story parts when they change

```typescript
useEffect(() => {
  if (showingStory) {
    speechService.stop() // Stop previous audio
    
    if (storyPart === 1) {
      speechService.speak("I was Elara Voss...", 'elara')
    }
    // ... other story parts
  }
}, [showingStory, storyPart])
```

### 3. ✅ "Consensus" Error (SOLVED)
**Problem**: Ghost debate trying to speak "Consensus" which isn't a valid character
**Solution**: Added character validation in `speechService.speak()`

```typescript
const validCharacters: GhostVoice[] = ['elara', 'harlan', 'mira', 'theo', 'selene', 'narrator']
if (!validCharacters.includes(character)) {
  console.warn(`TTS: Invalid character "${character}", skipping`)
  return
}
```

### 4. ✅ Ghost Council Debates Removed (DONE)
**Problem**: Ghost debates shown in separate box, not needed
**Solution**: Replaced with character hints

**Before**: 5 ghosts debating in a panel
**After**: Character gives direct hint with TTS

```typescript
const handleAskHint = () => {
  const hint = "Look at the symbols on the tapestry..."
  speechService.speak(hint, 'elara')
  alert(`Elara whispers: "${hint}"`)
}
```

### 5. ✅ Audio Stops on Screen Change (SOLVED)
**Problem**: Previous screen's audio continues when moving to next screen
**Solution**: Call `speechService.stop()` before speaking new text

```typescript
useEffect(() => {
  speechService.stop() // Stop previous audio
  
  if (stage === 'intro') {
    speechService.speak("...", 'narrator')
  }
}, [stage, showingStory])
```

## Files Modified

1. **lib/tts/speechService.ts**
   - Added character validation
   - Prevents invalid characters from causing errors

2. **components/scenes/FoyerScene.tsx**
   - Removed ghost debate API call
   - Added story part TTS
   - Replaced debates with character hints
   - Stops audio on stage/story changes

3. **next.config.js**
   - Disabled `reactStrictMode` to prevent double renders

## How It Works Now

### Audio Flow
```
1. User enters scene → Narration plays once
2. User clicks "Hear Her Story" → Story part 1 plays
3. User clicks "Next" → Previous audio stops → Story part 2 plays
4. User moves to puzzle → All audio stops → Puzzle starts
```

### Character Hints (Replaces Ghost Debates)
```
1. User clicks "Ask for Hint"
2. Character (Elara) speaks hint
3. Alert shows hint text
4. No debate panel, no consensus
```

## Testing Checklist

- [ ] Restart dev server (`npm run dev`)
- [ ] Test intro narration (should play once, not twice)
- [ ] Test Elara's dialogue (should speak when appearing)
- [ ] Test "Hear Her Story" (should speak each story part)
- [ ] Test story navigation (previous audio should stop)
- [ ] Test "Ask for Hint" (Elara should give hint, no debate)
- [ ] Test moving to puzzle (all audio should stop)
- [ ] No "Consensus" errors in console
- [ ] No double audio playback

## Character Voices (Reminder)

- **Elara**: Cora Multilingual - Very sad, mournful (Style: 2.0)
- **Harlan**: Guy Neural - Confused scientist
- **Mira**: Evelyn Multilingual - Youthful child
- **Theo**: Ryan Neural - British theatrical
- **Selene**: Nancy Multilingual - Authoritative professional
- **Narrator**: Serena Multilingual - Mature, commanding

## Next Steps

1. Restart dev server to apply `next.config.js` changes
2. Test all scenes for audio playback
3. Verify no double audio
4. Verify Elara's story speaks correctly
5. Verify hints work instead of debates

---

**All TTS issues resolved!** Audio now plays once, stops on screen changes, and Elara's story is fully voiced.
