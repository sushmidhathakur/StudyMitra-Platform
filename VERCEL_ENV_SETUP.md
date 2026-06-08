# Complete Guide: Adding Environment Variables to Vercel

## Step-by-Step Instructions with Screenshots

---

## STEP 1: Access Vercel Dashboard

1. Go to **https://vercel.com/dashboard**
2. Sign in with your GitHub account
3. Find and click on your **StudyMitra-Platform** project

---

## STEP 2: Navigate to Environment Variables Section

Once you're in your project:

1. Click on **Settings** tab (at the top of the page)
2. In the left sidebar, click on **Environment Variables**

You should see a page like this:
```
┌─────────────────────────────────────────────┐
│ Settings > Environment Variables            │
├─────────────────────────────────────────────┤
│ Add Environment Variables                   │
│                                             │
│ [Name] [Value] [Add]                        │
└─────────────────────────────────────────────┘
```

---

## STEP 3: Get Your Firebase Configuration

**Where to find it:**

1. Go to **https://console.firebase.google.com/**
2. Select your **StudyMitra** project
3. Click the **Settings icon** ⚙️ (top left, next to your project name)
4. Click **Project Settings**
5. Scroll down to find your **Web App** configuration
6. You'll see a code block that looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC_XXXX...",
  authDomain: "studymitra-123.firebaseapp.com",
  projectId: "studymitra-123",
  storageBucket: "studymitra-123.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

**Copy these values** - you'll need them in the next step.

---

## STEP 4: Get Your Gemini API Key

**Where to find it:**

1. Go to **https://aistudio.google.com/app/apikey**
2. Click **"Create API Key"** or copy your existing key
3. Keep this key ready - you'll add it in Vercel

⚠️ **Important:** Never share this key publicly!

---

## STEP 5: Add Environment Variables to Vercel

### Method A: One by One (Recommended for First Time)

Go back to Vercel → Settings → Environment Variables

#### Add Gemini API Key:

1. In the **Name** field, type: `VITE_GEMINI_API_KEY`
2. In the **Value** field, paste your Gemini API key (without quotes)
3. Click **Add**

You should see:
```
Name: VITE_GEMINI_API_KEY
Value: AIzaSyDpWRQh4ZVWPdx8etX2e7...
```

#### Add Firebase Configuration:

Repeat for each Firebase variable:

**1. API Key**
- Name: `VITE_FIREBASE_API_KEY`
- Value: `AIzaSyC_XXXX...` (from your firebaseConfig above)
- Click **Add**

**2. Auth Domain**
- Name: `VITE_FIREBASE_AUTH_DOMAIN`
- Value: `studymitra-123.firebaseapp.com`
- Click **Add**

**3. Project ID**
- Name: `VITE_FIREBASE_PROJECT_ID`
- Value: `studymitra-123`
- Click **Add**

**4. Storage Bucket**
- Name: `VITE_FIREBASE_STORAGE_BUCKET`
- Value: `studymitra-123.appspot.com`
- Click **Add**

**5. Messaging Sender ID**
- Name: `VITE_FIREBASE_MESSAGING_SENDER_ID`
- Value: `123456789012`
- Click **Add**

**6. App ID**
- Name: `VITE_FIREBASE_APP_ID`
- Value: `1:123456789012:web:abc123def456`
- Click **Add**

---

### Method B: Bulk Upload (Faster)

If you have many variables:

1. Create a text file with all variables:
```
VITE_GEMINI_API_KEY=AIzaSyDpWRQh4ZVWPdx8etX2e7hbBOKvVH03tKU
VITE_FIREBASE_API_KEY=AIzaSyC_XXXX...
VITE_FIREBASE_AUTH_DOMAIN=studymitra-123.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=studymitra-123
VITE_FIREBASE_STORAGE_BUCKET=studymitra-123.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

2. Copy all these lines
3. In Vercel → Environment Variables, there's usually an **"Import from .env"** or **paste** option
4. Paste all variables at once

---

## STEP 6: Verify All Variables Are Added

After adding all variables, your Vercel Environment Variables section should show:

```
✓ VITE_GEMINI_API_KEY
✓ VITE_FIREBASE_API_KEY
✓ VITE_FIREBASE_AUTH_DOMAIN
✓ VITE_FIREBASE_PROJECT_ID
✓ VITE_FIREBASE_STORAGE_BUCKET
✓ VITE_FIREBASE_MESSAGING_SENDER_ID
✓ VITE_FIREBASE_APP_ID
```

All 7 variables should be listed with a checkmark.

---

## STEP 7: Deploy!

1. Go back to the **Deployments** tab (or top of your project)
2. Click **"Deploy"** button (if not auto-deployed)
3. Wait for build and deployment to complete
4. Once done, visit your live URL

---

## Quick Reference: Environment Variable Mapping

| Vercel Variable Name | Where It Comes From | Example Value |
|---|---|---|
| `VITE_GEMINI_API_KEY` | Google AI Studio | `AIzaSyDpWRQh4ZVWPdx8etX2e7...` |
| `VITE_FIREBASE_API_KEY` | Firebase Config | `AIzaSyC_XXXX...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Config | `studymitra-123.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Config | `studymitra-123` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Config | `studymitra-123.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Config | `123456789012` |
| `VITE_FIREBASE_APP_ID` | Firebase Config | `1:123456789012:web:abc123def456` |

---

## Troubleshooting

### Variables Not Showing After Deployment?
- Make sure to click **"Add"** after entering each variable
- Variables might need a redeploy: Go to Deployments → Redeploy

### "API key not valid" Error?
- Check that `VITE_GEMINI_API_KEY` is copied correctly (no extra spaces)
- Verify the key is active at https://aistudio.google.com/app/apikey

### Firebase Auth Not Working?
- Verify all 6 Firebase variables are added
- Check that `projectId` matches between Vercel and Firebase Console
- Check Firebase Security Rules allow your app domain

### Build Fails?
- Check Vercel's build logs (click on the failed deployment)
- Look for messages about missing environment variables
- Ensure no typos in variable names (case-sensitive!)

---

## Security Best Practices

✅ **DO:**
- Regenerate API keys if accidentally exposed
- Use Vercel's environment variables for secrets
- Rotate Firebase keys periodically

❌ **DON'T:**
- Commit `.env` file to GitHub (already in `.gitignore`)
- Share API keys in messages or slack
- Use same keys for dev and production

---

## Next Steps After Deployment

1. Visit your live Vercel URL
2. **Test Login:** Create an account and log in
3. **Test AI Coach:** Send a message to AI Coach - should respond
4. **Check Browser Console:** Look for any error messages (F12)
5. **Monitor Vercel Logs:** Settings → Function Logs to see any issues

