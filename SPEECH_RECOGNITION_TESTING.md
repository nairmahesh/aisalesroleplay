# Speech Recognition Testing Guide

## Fixed Issues for Malayalam (Rahul Menon)

### What Was Fixed:
1. **Function Ordering**: Moved `getLanguageCode()` function before `useEffect` so it's available when initializing speech recognition
2. **Language Detection**: Speech recognition now properly initializes with Malayalam language code (`ml-IN`)
3. **Enhanced Logging**: Added console logs to help debug speech recognition
4. **Malayalam Word Recognition**: Added Malayalam words to response triggers (നമസ്കാരം, ഹലോ, വില)
5. **Better Error Handling**: Added specific error messages for microphone permission issues

### How to Test:

1. **Open the app in Chrome** (Speech Recognition works best in Chrome)

2. **Navigate to AI Roleplay** and select "Rahul Menon" (Malayalam bot)

3. **Start the call** - Check the browser console (F12) for these logs:
   ```
   Initializing speech recognition for: Malayalam Code: ml-IN
   Speech recognition started
   ```

4. **Allow microphone access** when prompted

5. **Look for the red "Listening..." indicator** - This means speech recognition is active

6. **Speak in Malayalam** - Try saying:
   - "നമസ്കാരം" (Hello)
   - "വില എത്രയാണ്?" (What is the price?)
   - Or speak naturally in Malayalam

7. **Check the console** for:
   ```
   Final transcript: [your Malayalam speech]
   User said: [your Malayalam speech]
   ```

8. **The bot should respond** based on what you said

### Troubleshooting:

**If speech recognition doesn't start:**
- Check browser console for errors
- Ensure you're using Chrome (best support)
- Verify microphone permissions are granted
- Try clicking the microphone button to toggle it

**If Malayalam isn't recognized:**
- Check console log shows: `lang: ml-IN`
- Speak clearly and at normal pace
- Try shorter phrases first
- Web Speech API Malayalam support varies by browser/OS

**If you see "not-allowed" error:**
- Browser blocked microphone access
- Click the lock icon in address bar
- Grant microphone permission
- Reload the page

### Technical Details:

**Language Code**: Malayalam uses `ml-IN` (Malayalam - India)

**Voice Characteristics**:
- Professional personality = neutral tone, slightly slower pace (0.95 rate)
- Voice selection tries to match Malayalam voices in browser

**Continuous Recognition**:
- Recognition runs continuously during the call
- Auto-restarts if it stops
- Mute button pauses recognition

### Browser Support:

| Browser | Speech Recognition | Malayalam Support |
|---------|-------------------|-------------------|
| Chrome  | ✅ Full           | ✅ Yes            |
| Edge    | ✅ Full           | ✅ Yes            |
| Safari  | ⚠️ Limited        | ⚠️ Limited        |
| Firefox | ❌ No             | ❌ No             |

**Recommendation**: Use Chrome for best Malayalam speech recognition
