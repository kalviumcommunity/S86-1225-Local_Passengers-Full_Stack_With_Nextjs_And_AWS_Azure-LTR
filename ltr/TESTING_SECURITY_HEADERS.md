# Security Headers Testing Guide

## Quick Verification Checklist

Use this guide to verify that security headers are properly configured before submitting your assignment.

---

## 1. Local Testing (5 minutes)

### Step 1: Start the Development Server
```bash
cd ltr
npm run dev
```

Server should start on: `http://localhost:5174`

### Step 2: Verify in Browser DevTools

1. Open your browser: `http://localhost:5174`
2. Press `F12` to open DevTools
3. Go to **Network** tab
4. Refresh the page (`Ctrl+R` or `Cmd+R`)
5. Click on the first request (usually the document/page)
6. Click on **Headers** tab
7. Scroll to **Response Headers**

### Step 3: Check Security Headers

✅ **Must be present:**

| Header | Expected Value (Partial) | Status |
|--------|-------------------------|--------|
| `strict-transport-security` | `max-age=63072000` | ⬜ |
| `content-security-policy` | `default-src 'self'` | ⬜ |
| `x-frame-options` | `SAMEORIGIN` | ⬜ |
| `x-content-type-options` | `nosniff` | ⬜ |
| `referrer-policy` | `strict-origin-when-cross-origin` | ⬜ |
| `permissions-policy` | `camera=()` | ⬜ |

**📸 Take Screenshot:** Capture the Response Headers showing all security headers.

---

## 2. Test CORS (5 minutes)

### Using Browser Console

1. Open DevTools → **Console** tab
2. Paste and run this code:

```javascript
// Test API request with origin header
fetch('http://localhost:5174/api/trains', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then(response => {
    console.log('Status:', response.status);
    console.log('CORS Headers:', {
      'Access-Control-Allow-Origin': response.headers.get('access-control-allow-origin'),
      'Access-Control-Allow-Methods': response.headers.get('access-control-allow-methods'),
      'Access-Control-Allow-Credentials': response.headers.get('access-control-allow-credentials'),
    });
    return response.json();
  })
  .then(data => console.log('Data:', data))
  .catch(error => console.error('Error:', error));
```

**Expected Output:**
```
Status: 200
CORS Headers: {
  Access-Control-Allow-Origin: "http://localhost:5174",
  Access-Control-Allow-Methods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  Access-Control-Allow-Credentials: "true"
}
```

**📸 Take Screenshot:** Capture the console output showing CORS headers.

---

## 3. Online Security Scan (5 minutes)

### Important Note for Local Development

⚠️ **Security scanners require a publicly accessible URL (deployed app).**

If you haven't deployed yet, you can:

**Option A:** Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (from ltr directory)
cd ltr
vercel

# Follow prompts, deploy to production
```

**Option B:** Use Local Screenshots Only
- Document that you'll run scans after deployment
- Show local DevTools screenshots as proof

### Once Deployed:

1. **Security Headers Scan**
   - Go to: https://securityheaders.com
   - Enter your deployed URL: `https://your-app.vercel.app`
   - Click "Scan"
   - **Expected Grade:** A or A+
   - **📸 Take Screenshot:** Full page showing grade and header details

2. **Mozilla Observatory**
   - Go to: https://observatory.mozilla.org
   - Enter your deployed URL
   - Click "Scan"
   - **Expected Score:** 70+ / 100
   - **📸 Take Screenshot:** Overall score and test results

3. **SSL Labs (Optional - Best Practice)**
   - Go to: https://www.ssllabs.com/ssltest/
   - Enter your deployed URL
   - Wait for scan (takes 2-3 minutes)
   - **Expected Grade:** A or A+
   - **📸 Take Screenshot:** Summary page

---

## 4. Manual CORS Testing with cURL (Optional - Advanced)

If you have cURL installed:

### Test Preflight Request
```bash
curl -X OPTIONS http://localhost:5174/api/trains \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

**Expected Headers in Response:**
```
< HTTP/1.1 204 No Content
< Access-Control-Allow-Origin: http://localhost:3000
< Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
< Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin
```

### Test Actual GET Request
```bash
curl http://localhost:5174/api/trains \
  -H "Origin: http://localhost:3000" \
  -v
```

**Expected Headers in Response:**
```
< HTTP/1.1 200 OK
< Access-Control-Allow-Origin: http://localhost:3000
< Content-Type: application/json
```

### Test Blocked Origin
```bash
curl http://localhost:5174/api/trains \
  -H "Origin: http://malicious-site.com" \
  -v
```

**Expected:** No `Access-Control-Allow-Origin` header (origin not in whitelist)

---

## 5. Test CSP Compliance (5 minutes)

### Check for CSP Violations

1. Open your app in browser
2. Open DevTools → **Console** tab
3. Look for CSP violation errors (should be none)

**Example CSP Violation (if misconfigured):**
```
Refused to load the script 'https://evil.com/script.js' because it violates the following Content Security Policy directive: "script-src 'self'".
```

**Expected:** No CSP violations in console

**If you see violations:**
- Check if they're from necessary third-party services
- Update CSP in `next.config.ts` to allow trusted domains
- Document in your submission why certain sources are allowed

---

## 6. Screenshot Collection Summary

For your assignment submission, collect these screenshots:

| # | Screenshot | Location | Status |
|---|-----------|----------|--------|
| 1 | Browser DevTools - Response Headers | Local dev | ⬜ |
| 2 | Browser Console - CORS test output | Local dev | ⬜ |
| 3 | Security Headers scan result | securityheaders.com | ⬜ |
| 4 | Mozilla Observatory scan result | observatory.mozilla.org | ⬜ |
| 5 | SSL Labs scan (optional) | ssllabs.com | ⬜ |
| 6 | Console showing no CSP violations | Local dev | ⬜ |

---

## 7. Video Demo Script (1-2 minutes)

### Recording Setup
- Use screen recording tool (OBS, Loom, Zoom, etc.)
- Ensure you're visible on camera
- Clear audio

### Script Flow

**[0:00-0:10] Introduction**
```
"Hi, I'm [Your Name]. I'll demonstrate HTTPS enforcement and secure headers 
configured in the LocalPassengers project following OWASP best practices."
```

**[0:10-0:30] Show Configuration**
```
"Here's the next.config.ts file where I've configured security headers."
[Scroll through next.config.ts]
"I've implemented HSTS to enforce HTTPS, CSP to prevent XSS attacks, 
and proper CORS configuration for API security."
```

**[0:30-0:50] Show Browser Verification**
```
"Let me verify these headers in the browser."
[Open DevTools → Network → Headers]
"As you can see, the Strict-Transport-Security header is present with a 
2-year max-age, Content-Security-Policy defines trusted sources, 
and X-Frame-Options prevents clickjacking."
```

**[0:50-1:10] Show CORS**
```
"For CORS, I've configured a whitelist in src/lib/cors.ts."
[Open cors.ts]
"Only trusted origins can access our APIs. I'm testing this now."
[Run fetch test in console]
"The response includes proper Access-Control headers."
```

**[1:10-1:30] Show Security Scan**
```
"Here's the security scan from securityheaders.com showing an A grade."
[Show scan results]
"All critical headers are properly configured."
```

**[1:30-1:50] Explain Impact**
```
"These headers provide multiple layers of security:
- HSTS forces all connections to use HTTPS, preventing man-in-the-middle attacks
- CSP prevents XSS by only allowing scripts from trusted sources
- CORS prevents unauthorized API access from unknown domains
All this happens transparently without affecting the user interface."
```

**[1:50-2:00] Conclusion**
```
"This configuration follows OWASP best practices and significantly 
improves the security posture of the LocalPassengers application. 
Thank you!"
```

---

## Common Issues and Solutions

### Issue 1: Headers Not Showing in DevTools

**Problem:** Security headers missing in Response Headers

**Solutions:**
- Make sure you've restarted the dev server after editing `next.config.ts`
- Clear browser cache (Ctrl+Shift+Delete)
- Try hard refresh (Ctrl+Shift+R)
- Check if you're looking at the right request (document, not assets)

### Issue 2: CORS Errors in Console

**Problem:** `CORS policy: No 'Access-Control-Allow-Origin' header is present`

**Solutions:**
- Verify origin is in `ALLOWED_ORIGINS` array in `src/lib/cors.ts`
- Check that API route uses `withCors` wrapper
- Ensure preflight OPTIONS request is handled

### Issue 3: CSP Violations

**Problem:** Console shows CSP violation errors

**Solutions:**
- Identify the blocked resource domain
- If it's a necessary third-party service, add to CSP:
  ```typescript
  "script-src 'self' https://trusted-domain.com"
  ```
- Document why you're allowing it

### Issue 4: Can't Deploy for Security Scan

**Problem:** Don't have deployment set up yet

**Solutions:**
- Use local screenshots with documentation
- Deploy to Vercel (free tier, takes 5 minutes)
- Document that security scans will be done after deployment
- Show local header verification as proof

---

## Quick Command Reference

```bash
# Start dev server
npm run dev

# Deploy to Vercel
vercel

# Test API with curl (Windows PowerShell)
curl.exe http://localhost:5174/api/trains -Headers @{"Origin"="http://localhost:3000"}

# Test API with curl (macOS/Linux)
curl http://localhost:5174/api/trains \
  -H "Origin: http://localhost:3000" \
  -v
```

---

## Submission Checklist

Before submitting your assignment:

- [ ] All security headers configured in `next.config.ts`
- [ ] CORS utility created in `src/lib/cors.ts`
- [ ] At least one API route uses `withCors`
- [ ] Security documentation in `SECURITY_HEADERS.md`
- [ ] README updated with security section
- [ ] 6+ screenshots collected
- [ ] 1-2 minute video recorded
- [ ] GitHub PR created
- [ ] PR includes all new files
- [ ] Video uploaded and shared publicly (Google Drive, YouTube, Loom)

---

## Expected Results Summary

| Test | Expected Result |
|------|----------------|
| **HSTS Header** | `max-age=63072000; includeSubDomains; preload` |
| **CSP Header** | Present, starts with `default-src 'self'` |
| **X-Frame-Options** | `SAMEORIGIN` |
| **X-Content-Type-Options** | `nosniff` |
| **CORS Origin** | Matches request origin if whitelisted |
| **CORS Methods** | `GET, POST, PUT, PATCH, DELETE, OPTIONS` |
| **Security Headers Grade** | A or A+ on securityheaders.com |
| **Observatory Score** | 70+ / 100 |
| **Console CSP Violations** | 0 errors |

---

**Testing Completed:** _______________  
**All Tests Passed:** [ ] Yes [ ] No  
**Ready for Submission:** [ ] Yes [ ] No

Good luck! 🚀🔒
