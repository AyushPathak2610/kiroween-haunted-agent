# ✅ Character Hints System Complete

## What Was Implemented

Replaced ghost council debates with character-driven hints that feel more personal and immersive.

## How It Works

### 1. **User Clicks "Ask Elara for Hint"**
- Button changes to "💭 Elara is speaking..."
- System calls `/api/character-hint` with character context

### 2. **AI Generates Personal Story + Hint**
- **Story** (1-2 lines): Ghost shares something personal about themselves
- **Hint**: Practical puzzle guidance

Example:
```
STORY: I remember the warmth of those summer days, when our family 
was whole and happy. Those memories are precious to me.

HINT: Look at the symbols on the tapestry. The sun represents happy 
memories, the ring represents promises, and the crystal represents 
our connection.
```

### 3. **Display Flow**
1. **0-6 seconds**: Story appears as subtitle, Elara speaks it
2. **6-21 seconds**: Hint appends below story, Elara speaks it
3. **21+ seconds**: Subtitle fades away

### 4. **Movie-Style Subtitle**
- Fixed at bottom of screen
- Pink border (Elara's color)
- Character name shown: "Elara whispers:"
- Doesn't block gameplay
- Fades in with animation

## Files Created/Modified

### NEW Files

**`app/api/character-hint/route.ts`**
- API endpoint for generating character hints
- Uses Groq AI (llama-3.1-70b-versatile)
- Generates personalized story + hint
- Has fallback for errors

### MODIFIED Files

**`components/scenes/FoyerScene.tsx`**
- Removed ghost council debate system
- Added character hint system
- Changed button: "Ask Ghost Council" → "Ask Elara for Hint"
- Added movie-style subtitle display
- Stops audio when scene changes
- Speaks both story and hint with TTS

## API Request Format

```typescript
POST /api/character-hint
{
  "character": "elara",
  "puzzleContext": "Tapestry puzzle - match photos to memory types",
  "characterBackground": "Elara Voss, the mother, represents family bonds"
}
```

## API Response Format

```typescript
{
  "story": "I remember when this mansion was filled with life...",
  "hint": "Look at the symbols on the tapestry. The sun represents...",
  "character": "elara"
}
```

## Character Backgrounds (For Other Scenes)

### Elara (Foyer)
- Mother, family bonds, maternal love
- Spent days caring for Mira
- Represents warmth and connection

### Harlan (Study)
- Father, scientist, creator of Eternal Harmony
- Driven by dream of family connection
- Represents intellect and ambition

### Mira (Nursery)
- Daughter, innocent child
- Loved bedtime stories and hugs
- Represents innocence and joy

### Theo (Not yet implemented)
- Brother, dramatic, regretful
- Ran from the fire
- Represents guilt and redemption

### Selene (Not yet implemented)
- Sister-in-law, professional, cold
- Demands truth and accountability
- Represents justice and honesty

## Styling

```css
.hint-subtitle {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 80%;
  padding: 20px 30px;
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid #ff69b4; /* Elara's pink */
  border-radius: 8px;
  z-index: 100;
  box-shadow: 0 0 30px rgba(255, 105, 180, 0.5);
}
```

## Character Colors (For Other Scenes)

- **Elara**: `#ff69b4` (Pink)
- **Harlan**: `#00bfff` (Cyan)
- **Mira**: `#ffd700` (Gold)
- **Theo**: `#9370db` (Purple)
- **Selene**: `#ff4444` (Red)

## Benefits Over Ghost Debates

✅ **More Personal**: Ghost shares their own story
✅ **Better Flow**: Story → Hint feels natural
✅ **No Blocking UI**: Subtitle doesn't cover gameplay
✅ **Character Voice**: Each ghost speaks in their own voice
✅ **AI Generated**: Fresh content each time
✅ **Simpler**: No complex debate panel

## Testing Checklist

- [ ] Click "Ask Elara for Hint"
- [ ] Story appears first (6 seconds)
- [ ] Elara speaks the story
- [ ] Hint appends after story
- [ ] Elara speaks the hint
- [ ] Subtitle fades after ~21 seconds
- [ ] Button disabled while speaking
- [ ] Audio stops when changing scenes
- [ ] No ghost debate panel visible
- [ ] Subtitle appears at bottom of screen

## Next Steps

To add hints to other scenes:

1. Copy the `handleAskHint` function
2. Change character name ('elara' → 'harlan', 'mira', etc.)
3. Update characterBackground
4. Update puzzleContext
5. Change border color in CSS to match character

---

**Character hints are now live!** Each ghost shares their story before helping with puzzles.
