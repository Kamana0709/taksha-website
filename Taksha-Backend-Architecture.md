# Taksha Backend Architecture PRD

**Version:** 1.0.0
**Project:** Taksha Official Website
**Focus:** Secure, serverless backend for lead generation and contact forms.

---

## 1. Overview & Serverless Functions
Taksha's primary frontend is a static/SPA React application. However, robust server-side logic is required for secure lead capture. We will utilize **Serverless Functions** (e.g., Vercel Functions, Netlify Functions, or AWS Lambda) to handle these backend operations without the overhead of maintaining a traditional Node.js server.

The primary endpoint will be:
`POST /api/contact`

---

## 2. Contact Form API

### 2.1 Request Schema
The API will accept a JSON payload containing:
- `name` (string)
- `email` (string, valid format)
- `company` (string, optional)
- `budget` (string/enum, optional)
- `message` (string, min 10 chars)
- `token` (string - for spam protection verification)

### 2.2 Response Schema
- **Success (200 OK):** `{ "success": true, "message": "Inquiry received successfully." }`
- **Bad Request (400):** `{ "success": false, "error": "Validation failed", "details": [...] }`
- **Rate Limited (429):** `{ "success": false, "error": "Too many requests. Please try again later." }`

---

## 3. Resend Integration & Email Templates

### 3.1 Resend API
We will use **Resend** as our transactional email provider due to its developer experience, speed, and modern React Email integration.

### 3.2 Email Templates
Using `react-email`, we will build two templates:
1. **Internal Notification:** Sent to `hello@taksha.com`. Contains formatted lead details, budget, and a direct `mailto:` link to reply to the prospect.
2. **Auto-Responder:** Sent to the user (`email`). A beautifully branded, text-light HTML email thanking them for the inquiry and setting expectations (response within 24 hours), as defined in the Content Strategy.

---

## 4. Security & Protection

### 4.1 Spam Protection
- **Invisible Turnstile (Cloudflare) / reCAPTCHA v3:** The frontend will generate a token upon form submission. The serverless function must verify this token with the provider's API before processing the email.
- **Honeypot Field:** A hidden input field on the frontend. If the API receives data in this field, the request is immediately discarded (returning a fake 200 OK to confuse bots).

### 4.2 Rate Limiting
- Implement IP-based rate limiting on the `/api/contact` endpoint (e.g., Max 3 requests per IP per hour) to prevent automated flooding of the Resend API and inbox. This can be handled at the Edge layer (Vercel/Cloudflare Edge) or via a lightweight Redis instance (Upstash).

### 4.3 Validation
- **Zod Schema Validation:** All incoming data will be strictly parsed and validated using Zod.
- Sanitization: Strip HTML tags and escape characters from the `message` payload to prevent XSS in our internal viewing platforms.

---

## 5. Operations & Monitoring

### 5.1 Error Handling
- Use standard HTTP status codes.
- Do not expose internal server errors or stack traces to the client. Return generic "Internal Server Error" (500) messages to the client while logging the exact stack trace internally.

### 5.2 Logging
- Log all successful submissions (without PII if possible, just timestamp and referral source).
- Log all failed validations, rate-limit triggers, and Resend API failures to a central logging provider (e.g., Axiom, Datadog, or Vercel Logs).

### 5.3 Analytics
- Upon a successful 200 OK response, the frontend will trigger a conversion event in our privacy-first analytics tool (Plausible/GA4) to track form conversion rates accurately.

---

## 6. Environment Variables
The serverless environment must securely store the following keys:
- `RESEND_API_KEY`: Secret key for sending emails.
- `TURNSTILE_SECRET_KEY`: Secret key for verifying bot protection tokens.
- `INTERNAL_NOTIFICATION_EMAIL`: The routing address for new leads.
- `UPSTASH_REDIS_REST_URL` & `TOKEN`: (Optional) If using Redis for strict rate limiting.

*Never expose these variables to the Vite frontend bundle (do not prefix with `VITE_`).*

---

## 7. Deployment
- The serverless functions will be deployed alongside the frontend application using platforms like **Vercel** or **Netlify**.
- **CI/CD:** Every push to `main` will trigger a build of the React app and deploy the updated serverless functions seamlessly.
- Staging environments will use isolated environment variables to prevent test emails from polluting the production inbox.
