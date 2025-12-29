# Security Configuration Documentation
## HTTPS Enforcement and Secure Headers

### Overview
This document details the security headers and HTTPS enforcement implemented in the LocalPassengers application. These configurations follow OWASP (Open Web Application Security Project) best practices and provide defense-in-depth protection against common web vulnerabilities.

---

## 🔒 Security Headers Implemented

### 1. HSTS (HTTP Strict Transport Security)

**Purpose:** Forces browsers to always use HTTPS connections, preventing man-in-the-middle (MITM) attacks and protocol downgrade attacks.

**Configuration:**
```typescript
{
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload'
}
```

**Details:**
- `max-age=63072000`: Valid for 2 years (730 days)
- `includeSubDomains`: Applies to all subdomains
- `preload`: Eligible for browser HSTS preload list

**Protection Against:**
- Man-in-the-Middle (MITM) attacks
- SSL stripping attacks
- Protocol downgrade attacks
- Cookie hijacking over insecure connections

**Impact on Project:**
- All HTTP requests automatically redirect to HTTPS
- Users cannot bypass HTTPS even if they type `http://` in the address bar
- Enhanced security for authentication tokens and sensitive data transmission

---

### 2. CSP (Content Security Policy)

**Purpose:** Prevents Cross-Site Scripting (XSS), code injection, and clickjacking by defining trusted sources for content.

**Configuration:**
```typescript
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://api.railway.app https://*.railway.app https://*.vercel.app; frame-ancestors 'self'; base-uri 'self'; form-action 'self';"
}
```

**Directive Breakdown:**

| Directive | Value | Purpose |
|-----------|-------|---------|
| `default-src` | `'self'` | Default policy: only load from same origin |
| `script-src` | `'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com` | Allow scripts from self and Google APIs (Next.js requires unsafe-eval/inline) |
| `style-src` | `'self' 'unsafe-inline' https://fonts.googleapis.com` | Allow styles from self and Google Fonts |
| `img-src` | `'self' data: https: blob:` | Allow images from self, data URIs, HTTPS, and blobs |
| `font-src` | `'self' https://fonts.gstatic.com data:` | Allow fonts from self and Google Fonts CDN |
| `connect-src` | `'self' https://api.railway.app https://*.railway.app https://*.vercel.app` | Allow API connections to self and deployment platforms |
| `frame-ancestors` | `'self'` | Only allow same-origin iframes |
| `base-uri` | `'self'` | Restrict base tag URLs to same origin |
| `form-action` | `'self'` | Forms can only submit to same origin |

**Protection Against:**
- Cross-Site Scripting (XSS)
- Code injection attacks
- Clickjacking
- Data exfiltration
- Unauthorized third-party resource loading

**Third-Party Integrations Allowed:**
- ✅ Google APIs (for maps, analytics if needed)
- ✅ Google Fonts (for typography)
- ✅ Railway/Vercel (deployment platforms)
- ✅ AWS S3 (for file uploads - added via https:)

**Potential Issues:**
- Inline scripts may need to be extracted to separate files
- Some third-party analytics tools may require CSP adjustments
- Browser extensions might be blocked if they inject scripts

**Customization for Production:**
```typescript
// Add your production API domains:
"connect-src 'self' https://api.yourbackend.com https://analytics.google.com"

// Add CDN domains:
"img-src 'self' data: https://cdn.yourproject.com"
```

---

### 3. X-Frame-Options

**Purpose:** Prevents clickjacking attacks by controlling whether the site can be embedded in iframes.

**Configuration:**
```typescript
{
  key: 'X-Frame-Options',
  value: 'SAMEORIGIN'
}
```

**Options:**
- `DENY`: Cannot be framed at all
- `SAMEORIGIN`: Can only be framed by same origin (our choice)
- `ALLOW-FROM uri`: Can be framed by specific URI (deprecated)

**Protection Against:**
- Clickjacking attacks
- UI redress attacks
- Frame-based phishing

---

### 4. X-Content-Type-Options

**Purpose:** Prevents MIME type sniffing attacks.

**Configuration:**
```typescript
{
  key: 'X-Content-Type-Options',
  value: 'nosniff'
}
```

**Protection Against:**
- MIME confusion attacks
- Execution of malicious files disguised as safe types
- Drive-by downloads

**How It Works:**
- Browsers must respect the `Content-Type` header exactly
- Prevents browsers from "guessing" file types based on content

---

### 5. X-XSS-Protection

**Purpose:** Legacy XSS protection for older browsers (modern browsers rely on CSP).

**Configuration:**
```typescript
{
  key: 'X-XSS-Protection',
  value: '1; mode=block'
}
```

**Protection Against:**
- Reflected XSS attacks (in older browsers)

**Note:** Modern browsers have deprecated this in favor of CSP, but it's included for backward compatibility.

---

### 6. Referrer-Policy

**Purpose:** Controls how much referrer information is shared when navigating away from the site.

**Configuration:**
```typescript
{
  key: 'Referrer-Policy',
  value: 'strict-origin-when-cross-origin'
}
```

**Behavior:**
- Same-origin requests: Send full URL
- Cross-origin HTTPS→HTTPS: Send origin only
- Cross-origin HTTPS→HTTP: Send nothing (downgrade protection)

**Protection Against:**
- Information leakage via referrer header
- Privacy concerns
- Sensitive URL parameter exposure

---

### 7. Permissions-Policy

**Purpose:** Controls which browser features and APIs can be used.

**Configuration:**
```typescript
{
  key: 'Permissions-Policy',
  value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
}
```

**Restrictions:**
- `camera=()`: Camera access disabled
- `microphone=()`: Microphone access disabled
- `geolocation=(self)`: Geolocation only from same origin
- `interest-cohort=()`: FLoC disabled (privacy protection)

**Protection Against:**
- Unauthorized hardware access
- Privacy tracking (FLoC)
- Malicious feature abuse

---

### 8. API-Specific Headers

**Purpose:** Prevent caching of sensitive API responses.

**Configuration:**
```typescript
// Applied to /api/* routes
{
  key: 'Cache-Control',
  value: 'no-store, no-cache, must-revalidate, proxy-revalidate'
},
{
  key: 'Pragma',
  value: 'no-cache'
},
{
  key: 'Expires',
  value: '0'
}
```

**Protection Against:**
- Sensitive data caching in browsers or proxies
- Stale authentication token reuse
- Unauthorized data access from shared computers

---

## 🌐 CORS (Cross-Origin Resource Sharing)

### Implementation

**Location:** `src/lib/cors.ts`

**Allowed Origins:**
```typescript
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5174",
  "https://localhost:3000",
  "https://localhost:5174",
  // Production domains:
  // "https://localpassengers.vercel.app",
  // "https://www.localpassengers.com",
];
```

**Allowed Methods:**
```typescript
["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
```

**Allowed Headers:**
```typescript
["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"]
```

**Configuration:**
```typescript
Access-Control-Allow-Origin: <validated-origin>
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400 (24 hours)
```

### Security Features

1. **Whitelist-Based Origin Validation**
   - Origins are validated against a strict whitelist
   - No wildcards (*) in production
   - Prevents unauthorized API access from unknown domains

2. **Preflight Request Handling**
   - OPTIONS requests automatically handled
   - Proper CORS headers returned for preflight checks

3. **Credential Support**
   - `Access-Control-Allow-Credentials: true`
   - Allows cookies and authorization headers
   - Requires specific origin (not wildcard)

### Usage in API Routes

```typescript
import { withCors } from "@/lib/cors";

export async function GET(req: NextRequest) {
  return withCors(req, async () => {
    // Your API logic here
    return NextResponse.json({ data: "..." });
  });
}
```

### Adding Production Domains

**Before Deployment:**
1. Open `src/lib/cors.ts`
2. Add your production domains to `ALLOWED_ORIGINS`:
   ```typescript
   "https://your-app.vercel.app",
   "https://www.your-domain.com",
   "https://api.your-domain.com",
   ```
3. For wildcard subdomains (use cautiously):
   ```typescript
   "https://*.vercel.app", // Matches any vercel.app subdomain
   ```

**Never Do This in Production:**
```typescript
❌ Access-Control-Allow-Origin: *
```

---

## 🧪 Testing and Verification

### Local Testing

1. **Start the Development Server:**
   ```bash
   npm run dev
   ```

2. **Open Browser DevTools:**
   - Navigate to your app: `http://localhost:5174`
   - Open DevTools (F12)
   - Go to Network tab
   - Refresh the page

3. **Check Response Headers:**
   - Click on any request (preferably the document)
   - View Response Headers
   - Verify presence of:
     - ✅ `Strict-Transport-Security`
     - ✅ `Content-Security-Policy`
     - ✅ `X-Frame-Options`
     - ✅ `X-Content-Type-Options`
     - ✅ `Referrer-Policy`
     - ✅ `Permissions-Policy`

4. **Check API CORS Headers:**
   - Make a request to `/api/trains`
   - Verify Response Headers include:
     - ✅ `Access-Control-Allow-Origin`
     - ✅ `Access-Control-Allow-Methods`
     - ✅ `Access-Control-Allow-Headers`

### Online Security Scanners

**Recommended Tools:**

1. **Security Headers**
   - URL: https://securityheaders.com
   - Enter your deployed URL
   - Get grade: A, B, C, etc.
   - Screenshot the results

2. **Mozilla Observatory**
   - URL: https://observatory.mozilla.org
   - Comprehensive security scan
   - Tests headers, TLS, and best practices
   - Provides actionable recommendations

3. **SSL Labs**
   - URL: https://www.ssllabs.com/ssltest/
   - Tests SSL/TLS configuration
   - Verifies HTTPS implementation

### Testing CORS

**Test with cURL:**
```bash
# Test preflight request
curl -X OPTIONS http://localhost:5174/api/trains \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Test actual request
curl http://localhost:5174/api/trains \
  -H "Origin: http://localhost:3000" \
  -v
```

**Expected Response Headers:**
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
```

**Test Blocked Origin:**
```bash
curl http://localhost:5174/api/trains \
  -H "Origin: http://malicious-site.com" \
  -v
```

**Expected:** No `Access-Control-Allow-Origin` header (request blocked by browser)

---

## 📸 Screenshot Guide

### For Assignment Submission

1. **Browser DevTools - Response Headers**
   - Capture full headers panel showing security headers
   - Highlight key headers: HSTS, CSP, X-Frame-Options

2. **Security Headers Scan Results**
   - Run scan on https://securityheaders.com
   - Capture grade and detailed report
   - Show A or A+ rating

3. **Mozilla Observatory Results**
   - Run scan on https://observatory.mozilla.org
   - Capture overall score
   - Show passing tests

4. **CORS Headers**
   - Capture API request showing CORS headers
   - Show Origin validation working

---

## 🎯 Security Posture Summary

### Threats Mitigated

| Attack Type | Mitigation | Confidence |
|-------------|------------|------------|
| Man-in-the-Middle (MITM) | HSTS | ✅ High |
| Cross-Site Scripting (XSS) | CSP + X-XSS-Protection | ✅ High |
| Clickjacking | X-Frame-Options + CSP frame-ancestors | ✅ High |
| MIME Sniffing | X-Content-Type-Options | ✅ High |
| Data Exfiltration | CSP connect-src | ✅ Medium |
| Unauthorized API Access | CORS whitelist | ✅ High |
| Information Leakage | Referrer-Policy | ✅ Medium |
| Unwanted Browser Features | Permissions-Policy | ✅ Medium |
| Sensitive Data Caching | Cache-Control headers | ✅ High |

### OWASP Top 10 Coverage

- ✅ **A01:2021 - Broken Access Control:** CORS prevents unauthorized API access
- ✅ **A03:2021 - Injection:** CSP prevents script injection
- ✅ **A05:2021 - Security Misconfiguration:** Secure headers properly configured
- ✅ **A07:2021 - Identification and Authentication Failures:** HSTS protects auth tokens
- ⚠️ **A02:2021 - Cryptographic Failures:** Requires SSL/TLS on deployment (Vercel/Railway provide this)

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Update `ALLOWED_ORIGINS` in `src/lib/cors.ts` with production domains
- [ ] Update CSP `connect-src` with production API URLs
- [ ] Ensure SSL/TLS certificate is valid (Vercel/Railway handle this automatically)
- [ ] Test all security headers on deployed URL
- [ ] Run security scans (securityheaders.com, observatory.mozilla.org)
- [ ] Verify CORS works from production frontend
- [ ] Test HSTS with HTTP requests (should redirect to HTTPS)
- [ ] Document any CSP violations in browser console and fix

---

## 🔄 Third-Party Integration Impact

### Current Integrations

1. **Google Fonts**
   - ✅ Allowed via CSP `font-src` and `style-src`
   - No configuration needed

2. **AWS S3 (File Uploads)**
   - ✅ Allowed via CSP `img-src 'self' data: https:`
   - Uses HTTPS by default

3. **Railway/Vercel (Deployment)**
   - ✅ Allowed via CSP `connect-src`
   - API calls will work

### Future Integrations

**If you add:**

- **Google Analytics:** Add to CSP `script-src` and `connect-src`:
  ```typescript
  "script-src 'self' https://www.google-analytics.com",
  "connect-src 'self' https://www.google-analytics.com",
  ```

- **External APIs:** Add domains to CSP `connect-src`:
  ```typescript
  "connect-src 'self' https://api.indianrailways.gov.in",
  ```

- **CDN Images:** Add to CSP `img-src`:
  ```typescript
  "img-src 'self' data: https://cdn.example.com",
  ```

- **Payment Gateways (Stripe, Razorpay):** Add to CSP and CORS:
  ```typescript
  "script-src 'self' https://checkout.stripe.com",
  "frame-src 'self' https://checkout.stripe.com",
  ```

---

## 📚 References

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN Web Docs - HTTP Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [HSTS Preload List](https://hstspreload.org/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)

---

## 🎥 Video Demo Script

**For your assignment video (1-2 minutes):**

1. **Introduction (10 seconds)**
   - "Hi, I'm demonstrating HTTPS enforcement and secure headers in the LocalPassengers project."

2. **Show Configuration (30 seconds)**
   - Open `next.config.ts`
   - Scroll through security headers
   - Explain: "These headers enforce HTTPS with HSTS, prevent XSS with CSP, and control API access with CORS."

3. **Show Browser Verification (30 seconds)**
   - Open DevTools → Network tab
   - Show response headers
   - Point out: HSTS, CSP, X-Frame-Options, CORS headers

4. **Show Security Scan (20 seconds)**
   - Show securityheaders.com results
   - Point out A or A+ grade
   - Highlight passing tests

5. **Explain Impact (20 seconds)**
   - "HSTS ensures all communication is encrypted via HTTPS, protecting against MITM attacks."
   - "CSP prevents XSS by only allowing trusted script sources."
   - "CORS whitelist prevents unauthorized API access from unknown domains."

6. **Conclusion (10 seconds)**
   - "These security headers provide defense-in-depth protection without changing the user interface."

---

**Last Updated:** December 29, 2025  
**Project:** LocalPassengers - Real-Time Train Delay & Reroute System  
**Security Standard:** OWASP Best Practices
