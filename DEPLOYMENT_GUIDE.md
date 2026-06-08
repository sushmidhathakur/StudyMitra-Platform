# StudyMitra Deployment Guide - Vercel Setup

## Overview
This guide covers deploying StudyMitra to Vercel with proper environment variable configuration for production.

---

## Part 1: Environment Variables Setup on Vercel

Since `.env` is ignored via `.gitignore` for security reasons, all environment variables must be manually added to Vercel's project settings before deployment.

### Step 1: Create a New Project on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import the GitHub repository: `https://github.com/sushmidhathakur/StudyMitra-Platform.git`
4. Select the repository and click **"Import"**

### Step 2: Configure Environment Variables
Before clicking **"Deploy"**, navigate to the **"Environment Variables"** section and add the following variables:

#### Required Environment Variables:

**Google Gemini API Configuration:**
```
VITE_GEMINI_API_KEY = <YOUR_GEMINI_API_KEY>
```
- Get this key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- Keep this key confidential

**Firebase Configuration:**
```
VITE_FIREBASE_API_KEY = <YOUR_FIREBASE_API_KEY>
VITE_FIREBASE_AUTH_DOMAIN = <YOUR_PROJECT_ID>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = <YOUR_PROJECT_ID>
VITE_FIREBASE_STORAGE_BUCKET = <YOUR_PROJECT_ID>.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID = <YOUR_MESSAGING_SENDER_ID>
VITE_FIREBASE_APP_ID = <YOUR_APP_ID>
```
- Retrieve these from your Firebase Project Settings → General tab
- Select your web app to get the configuration object

### Step 3: Add Variables to Vercel

1. **Single Variable Method:**
   - Click **"Add Environment Variable"**
   - Enter the name (e.g., `VITE_GEMINI_API_KEY`)
   - Enter the value
   - Click **"Save"**
   - Repeat for all required variables

2. **Bulk Upload Method:**
   - Create a `.env.production` file with all variables
   - Copy its contents into Vercel's environment variable editor

### Sample Environment Configuration:
```env
VITE_GEMINI_API_KEY="AIzaSyDpWRQh..."
VITE_FIREBASE_API_KEY="AIzaSyDL0HB..."
VITE_FIREBASE_AUTH_DOMAIN="studymitra-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="studymitra-app"
VITE_FIREBASE_STORAGE_BUCKET="studymitra-app.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
VITE_FIREBASE_APP_ID="1:123456789012:web:abc123def456"
```

### Step 4: Deploy

1. Verify all environment variables are added
2. Click **"Deploy"**
3. Wait for the build and deployment to complete
4. Visit the deployed URL once the deployment is successful

---

## Part 2: Gemini API Model Update

### What Was Fixed
✅ Updated Gemini model from `gemini-2.0-flash` to `gemini-1.5-flash`
✅ API key is now fetched dynamically inside the message handler
✅ Prevents "API key not valid" errors on user switches

### Implementation Details
**File:** `src/pages/AICoach.jsx`

The `handleSend()` function now:
1. Fetches the API key from environment variables on each message
2. Initializes a new API request with fresh context
3. Uses `gemini-1.5-flash` model (supported and stable)

```javascript
const handleSend = async (e) => {
  // ... existing code ...
  
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
      // API key is fetched fresh on each request
      const modelName = 'gemini-1.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      
      // ... rest of implementation ...
    }
  } catch (err) {
    // ... error handling ...
  }
};
```

---

## Common Issues & Troubleshooting

### Issue 1: "API key not valid" Error
**Cause:** API key not properly set in Vercel environment variables or Firebase auth state changed without reinitializing the API client.

**Solution:**
- Verify the API key is added in Vercel Dashboard → Settings → Environment Variables
- The fix already handles dynamic API key fetching on each request
- Redeploy the project after adding environment variables

### Issue 2: Gemini API Rate Limit (429 Error)
**Cause:** Too many API requests in a short time.

**Solution:**
- The app includes fallback responses when quota is exceeded
- Consider implementing request throttling for high-traffic scenarios
- Check Gemini API usage at [Google Cloud Console](https://console.cloud.google.com/)

### Issue 3: Firebase Configuration Error
**Cause:** Incorrect Firebase credentials in environment variables.

**Solution:**
- Double-check the Firebase config values from your project settings
- Ensure no extra spaces or quotes in variable values
- Firebase config uses `VITE_` prefix for client-side visibility

### Issue 4: Build Fails with "Cannot find module"
**Cause:** Missing dependencies or incorrect environment variable names.

**Solution:**
- Run `npm install` locally to verify dependencies
- Check that all `VITE_` prefixed environment variables are set
- Verify the build logs in Vercel for specific error messages

---

## Verification Checklist

After deploying to Vercel, verify:

- [ ] Application loads without errors
- [ ] User can log in with Firebase Auth
- [ ] AI Coach responds to messages (check browser console for requests)
- [ ] Profile picture upload works (uses Firebase Storage)
- [ ] Analytics page displays data from Firestore
- [ ] Achievements unlock on day completion
- [ ] Journal entries save and display correctly

---

## Local Development Setup

For local testing before Vercel deployment:

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Add your credentials to `.env`:**
   ```env
   VITE_GEMINI_API_KEY="your_key_here"
   VITE_FIREBASE_API_KEY="your_key_here"
   # ... other Firebase config ...
   ```

3. **Install dependencies and run:**
   ```bash
   npm install
   npm run dev
   ```

4. **Test the AI Coach:**
   - Navigate to the AI Coach page
   - Send a test message
   - Verify the response loads (check console for API calls)

---

## Security Notes

⚠️ **Important:**
- Never commit `.env` to version control (already in `.gitignore`)
- Regenerate API keys if they're accidentally exposed
- Use Vercel's environment variable secrets for sensitive data
- Restrict Firebase Firestore rules to authenticated users only
- Enable Firebase Authentication security rules

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## Next Steps

After successful deployment:
1. Test all features on the live URL
2. Monitor error logs in Vercel Dashboard
3. Set up custom domain if desired
4. Configure automatic deployments (should be enabled by default)
