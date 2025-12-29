# 🎥 Video Demo Quick Reference Card

## Video Recording Checklist

- [ ] Camera ON (you must be visible)
- [ ] Clear audio
- [ ] Screen recording active
- [ ] Browser and VS Code ready
- [ ] Time limit: 1-2 minutes

---

## 🎬 Video Script (Copy-Paste Ready)

### [0:00-0:10] Introduction
> "Hi, I'm [YOUR NAME]. I'll demonstrate HTTPS enforcement and secure headers configured in the LocalPassengers project, following OWASP best practices for web application security."

**Action:** Look at camera, smile

---

### [0:10-0:30] Show Configuration

> "Here's the next.config.ts file where I've configured multiple security headers."

**Action:** Open `ltr/next.config.ts`, scroll slowly through headers

> "I've implemented HSTS to enforce HTTPS with a 2-year max-age, Content Security Policy to prevent XSS attacks by restricting script sources, X-Frame-Options to prevent clickjacking, and several other protective headers."

**Action:** Point to HSTS, CSP, X-Frame-Options sections

> "Additionally, I created a CORS utility in src/lib/cors.ts that uses whitelist-based origin validation."

**Action:** Open `ltr/src/lib/cors.ts`, show ALLOWED_ORIGINS array

---

### [0:30-0:50] Browser Verification

> "Let me verify these headers are working in the browser."

**Action:** Switch to browser with localhost:5174 open

> "Opening DevTools, Network tab, and refreshing the page."

**Action:** F12 → Network → Refresh → Click first request → Headers

> "As you can see in the Response Headers, Strict-Transport-Security is present with max-age 63072000 and preload, Content-Security-Policy defines our trusted sources starting with default-src self, X-Frame-Options is set to SAMEORIGIN, X-Content-Type-Options is nosniff, and all other security headers are properly configured."

**Action:** Scroll through Response Headers, pause on each major header

---

### [0:50-1:10] CORS Testing

> "Now let's test the CORS configuration."

**Action:** Open browser console (F12 → Console tab)

> "I'll make a fetch request to our trains API."

**Action:** Paste and run this code:
```javascript
fetch('http://localhost:5174/api/trains')
  .then(r => {
    console.log('Status:', r.status);
    console.log('CORS:', r.headers.get('access-control-allow-origin'));
  });
```

> "The response includes the Access-Control-Allow-Origin header showing our origin is validated and allowed."

**Action:** Point to console output

---

### [1:10-1:30] Security Scan Results

> "I've also run online security scans to verify the configuration."

**Action:** Show securityheaders.com scan results (or explain deployment plan)

**Option A (If deployed):**
> "Security Headers dot com gives us an A grade, confirming all critical headers are properly configured."

**Option B (If not deployed yet):**
> "Once deployed, I'll run scans on Security Headers dot com and Mozilla Observatory. The local verification shows all headers are correctly configured."

**Action:** Show screenshot or browser with scan results

---

### [1:30-1:50] Explain Impact

> "These security headers provide multiple layers of defense. HSTS ensures all communication happens over HTTPS, preventing man-in-the-middle attacks even if a user accidentally types HTTP. Content Security Policy prevents Cross-Site Scripting by only allowing scripts from trusted sources like our own domain and approved third-party services. The CORS whitelist prevents unauthorized API access from unknown domains."

**Action:** Look at camera, use hand gestures

> "What's powerful about this approach is that all this security happens transparently. There are no changes to the user interface, no additional login steps, just automatic protection on every single request."

---

### [1:50-2:00] Conclusion

> "This implementation follows OWASP secure headers project guidelines and significantly improves the security posture of the LocalPassengers application. The complete documentation is available in SECURITY_HEADERS.md. Thank you!"

**Action:** Look at camera, smile, wave

**End Recording** ✂️

---

## 📸 What to Show on Screen

| Time | Screen Content |
|------|---------------|
| 0:00 | Your face (introduce yourself) |
| 0:10 | VS Code - `next.config.ts` file |
| 0:25 | VS Code - `src/lib/cors.ts` file |
| 0:30 | Browser - localhost:5174 |
| 0:35 | Browser DevTools - Network → Headers |
| 0:50 | Browser DevTools - Console tab |
| 1:10 | Security scan results (securityheaders.com) |
| 1:30 | Your face (explain benefits) |
| 1:50 | Your face (conclusion) |

---

## 🎯 Key Points to Emphasize

1. **HSTS** = HTTPS enforcement (say "2-year max-age, preload")
2. **CSP** = XSS prevention (say "restricts script sources")
3. **CORS** = API access control (say "whitelist-based validation")
4. **Transparent** = No UI changes (say this!)
5. **OWASP** = Industry best practices (mention this)
6. **Defense in Depth** = Multiple security layers (good phrase)

---

## ⚠️ Common Mistakes to Avoid

❌ Don't spend too much time on one section (2 min total!)
❌ Don't read from screen (speak naturally)
❌ Don't forget to show your face
❌ Don't have messy background (clean your space)
❌ Don't forget to mention OWASP
❌ Don't skip showing actual headers in browser

---

## ✅ Quick Pre-Recording Checklist

**Technical:**
- [ ] Dev server running (`npm run dev`)
- [ ] Browser open to localhost:5174
- [ ] VS Code open with files ready
- [ ] DevTools Network tab ready
- [ ] Console code snippet ready to paste
- [ ] Security scan results ready (screenshot or tab)

**Presentation:**
- [ ] Good lighting on your face
- [ ] Clear background
- [ ] Microphone tested
- [ ] Camera positioned well
- [ ] Notes visible but off-screen

**Content:**
- [ ] Practiced the script once
- [ ] Know what to show when
- [ ] Confident about timing
- [ ] Ready to explain (not just read)

---

## 🎤 Speaking Tips

1. **Pace:** Speak slightly slower than normal (you're explaining)
2. **Clarity:** Enunciate technical terms clearly
3. **Enthusiasm:** Sound interested in what you built!
4. **Confidence:** You implemented this, you're the expert
5. **Natural:** Don't sound like you're reading a script

---

## 📱 Recording Tools (Pick One)

- **Loom** (easiest) - https://loom.com
- **OBS Studio** (free) - https://obsproject.com
- **Zoom** (record meeting with yourself)
- **Windows Game Bar** (Win + G)
- **Mac QuickTime** (File → New Screen Recording)

---

## 📤 After Recording

1. **Watch it once** - Make sure:
   - [ ] You're visible
   - [ ] Audio is clear
   - [ ] All key points covered
   - [ ] Time is 1-2 minutes

2. **Upload to:**
   - Google Drive (set to "Anyone with link")
   - YouTube (Unlisted)
   - Loom (share link)

3. **Test the link:**
   - [ ] Open in incognito/private window
   - [ ] Confirm it's accessible
   - [ ] Copy the link

4. **Submit:**
   - GitHub PR URL
   - Video URL
   - Submit on Kalvium

---

## 🌟 Make It Stand Out

**Good:**
- Clear explanation
- Shows working code
- Mentions OWASP

**Better:**
- Clear + confident
- Shows code + browser verification
- Explains security benefits

**Best:**
- Clear + confident + enthusiastic
- Shows code + browser + security scan
- Explains benefits + real-world impact
- Professional presentation

---

## ⏱️ Time Management

| Section | Target Time | Maximum Time |
|---------|-------------|--------------|
| Intro | 10 sec | 15 sec |
| Configuration | 20 sec | 30 sec |
| Browser Verification | 20 sec | 30 sec |
| CORS Test | 20 sec | 25 sec |
| Security Scan | 20 sec | 25 sec |
| Explain Impact | 20 sec | 30 sec |
| Conclusion | 10 sec | 15 sec |
| **TOTAL** | **2:00** | **2:50** |

⚠️ If you're over 2 minutes at conclusion, that's okay! Just don't go past 3 minutes.

---

## 🎬 Ready? Let's Record!

**Take a deep breath. You've got this! 💪**

Press record when you're ready. Remember: You can always re-record if needed. Don't aim for perfection on the first try.

---

**Pro Tip:** Record 2-3 takes and pick the best one. It's normal!

Good luck! 🚀🎥
