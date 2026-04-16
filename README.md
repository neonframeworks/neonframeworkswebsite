# Neonframeworks — Cinematic Videography Agency

A premium, serverless Next.js platform integrating modern frontend design with secure authentication and content management capabilities.

## Tech Stack
- **Frontend**: Next.js (App Router), React, Framer Motion, Tailwind CSS
- **Media Hosting**: Cloudinary (Unsigned API uploads)
- **Database**: Firebase Firestore
- **Deployment**: Vercel or Netlify

---

## 1. Environment Configuration

You must create a `.env.local` file at the root of the project with the following variables:

```env
# Admin Panel Security
ADMIN_PASSWORD=your_super_secret_admin_password_here
ADMIN_TOKEN_SECRET=your_random_32char_secret_for_jwt_signing

# Cloudinary Setup (For Media Uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset

# Firebase Setup (Public Variables for Client SDK)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 2. Cloudinary Setup (Media Storage)
1. Sign up / login to [Cloudinary](https://cloudinary.com).
2. Go to **Settings > Upload** and scroll down to **Upload presets**.
3. Create a new upload preset.
4. Set **Signing Mode** to `Unsigned`.
5. Enter the `cloud_name` and the new `upload_preset` name in your `.env.local`.

---

## 3. Firebase Setup & Security

### 3.1 Rules Setup
1. In the Firebase console, go to **Firestore Database**.
2. Go to the **Rules** tab and paste the contents of the `firestore.rules` file in this repository.
3. Your database is strictly locked down against public modification (`allow write: if false;`). It relies on `firebase-admin` server side API routes to securely bypass this rule.

### 3.2 Firebase Admin SDK Settings
This project uses secure server-side mutations for database writes. You need a Service Account Key:
1. In Firebase Console, go to **Project Settings > Service Accounts**.
2. Click **Generate new private key** and download the JSON file.
3. Open the JSON file and copy the required variables into your `.env.local`:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL` 
   - `FIREBASE_PRIVATE_KEY` (ensure you preserve the `\\n` linebreaks from the JSON as a single string, or wrap the string in quotes).

---

## 4. Run & Deploy

### Development Run:
```bash
npm install
npm run dev
```

### Deployment (Netlify/Vercel):
1. Connect your repository to Vercel or Netlify.
2. In the deployment settings, copy all variables from `.env.local` to the Environment Variables section.
3. Deploy!

## 5. SEO & Google Search Console Setup
The project automatically generates a native `robots.txt` and a strictly configured `sitemap.xml` via Next.js Metadata routes (`app/robots.ts` and `app/sitemap.ts`).
1. **Change the Base URL**: By default, it's set to `https://neonframeworks.com`. If you switch URLs, update `baseUrl` in `app/sitemap.ts` and the sitemap URL in `app/robots.ts`.
2. Go to [Google Search Console](https://search.google.com/search-console).
3. Add your property (domain or URL prefix).
4. Verify ownership (usually via DNS records if domain, or HTML tag on URL prefix).
5. Open the **Sitemaps** tab on the left sidebar.
6. Enter `sitemap.xml` and click **Submit**. Google will automatically crawl and rank your highly optimized site.

---

## 6. Security & Protection
We have shielded the system from common hacks (like SQL injections) by:
1. **NoSQL Architecture**: Firestore is immune to SQL-based string injections by design.
2. **JWT Authentication**: Using robust `httpOnly` secure cookies sealed with a strong secret.
3. **Middleware Interception**: Invalid users are blocked before components even render via `middleware.ts`.
4. **Input Sanitization**: Client endpoints are scrubbed using regex `/[<>'\"&]/g` to prevent XSS payloads in titles or descriptions.
