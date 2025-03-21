# Firebase Setup Guide for QuoteNote

This guide will walk you through setting up a Firebase project for the QuoteNote application to enable cloud storage, authentication, and hosting.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click on "Add project" or "Create project"
3. Enter a project name (e.g., "quote-note")
4. Choose whether to enable Google Analytics (recommended but optional)
5. Accept the terms and click "Create project"
6. Wait for the project to be created and click "Continue"

## Step 2: Register Your Web App

1. On the project overview page, click the web icon (</>) to add a web app
2. Register your app with a nickname (e.g., "quote-note-web")
3. Select the option to also set up Firebase Hosting
4. Click "Register app"
5. **Important**: Copy the Firebase configuration object - you'll need this later
   ```js
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
     measurementId: "YOUR_MEASUREMENT_ID" // This is optional
   };
   ```
6. Click "Continue to console"

## Step 3: Set Up Firestore Database

1. In the left sidebar, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" for a secure database
4. Select a location closest to your users (default is usually fine)
5. Click "Enable"
6. Once the database is created, go to the "Rules" tab
7. Update the security rules to allow authenticated users to read/write their own data:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /quotes/{document} {
         allow read: if request.auth != null;
         allow write: if request.auth != null;
       }
     }
   }
   ```
8. Click "Publish"

## Step 4: Set Up Authentication

1. In the left sidebar, click "Authentication"
2. Click "Get started"
3. Enable the Email/Password provider:
   - Click on "Email/Password"
   - Toggle "Enable" to on
   - Click "Save"
4. Enable the Google provider:
   - Click on "Google"
   - Toggle "Enable" to on
   - Enter your name as the "Project support email"
   - Click "Save"

## Step 5: Configure Your Application

1. Create a `.env.local` file in the root of your project
2. Add your Firebase configuration using the values you copied earlier:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```
3. Restart your development server

## Step 6: Set Up Firebase Hosting

1. Install the Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase from your terminal:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project directory:
   ```bash
   firebase init
   ```
   - Select "Firestore" and "Hosting" when prompted
   - Choose your existing Firebase project
   - For the public directory, enter `build` (Next.js output directory)
   - Configure as a single-page app: No (since we're using static exports)
   - Set up GitHub Actions workflow (optional)

4. Update your firebase.json file to include:
   ```json
   {
     "firestore": {
       "rules": "firestore.rules",
       "indexes": "firestore.indexes.json"
     },
     "hosting": {
       "public": "build",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "cleanUrls": true
     }
   }
   ```

5. Update your Next.js config (next.config.js) to use static exports:
   ```js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     distDir: 'build',
     // Remove any basePath configuration for Firebase Hosting
   };
   
   module.exports = nextConfig;
   ```

6. Build and deploy your app:
   ```bash
   npm run build
   firebase deploy
   ```

## Step 7: Test Your Setup

1. Run your application locally
2. Create a new account or sign in with Google
3. Add some quotes and verify that they persist when you reload the page
4. Sign out and back in to verify that your data is saved to your account
5. Visit your Firebase Hosting URL (e.g., https://your-project-id.web.app) to test the deployed site

## Troubleshooting

- **Authentication errors**: Make sure you've properly enabled the authentication providers (Email/Password and Google).
- **Firestore errors**: Check that your Firestore security rules allow reads and writes for authenticated users.
- **CORS issues with Google authentication**: Check that your Firebase Hosting domain is added to the authorized domains in Firebase Authentication settings.
- **Environment variables not loading**: Check that your `.env.local` file is in the correct location and formatted properly.
- **Hosting issues**: Ensure your build output is correctly pointing to the 'build' directory and that you've updated the firebase.json file accordingly.

## Deployment Considerations

When deploying your application:

1. Add your Firebase configuration as environment variables in your GitHub repository secrets if using GitHub Actions
2. Add your Firebase Hosting domain to the authorized domains in Firebase Authentication settings (Authentication > Settings > Authorized domains)
3. If you're using GitHub Actions, the workflows created during Firebase initialization will handle the deployment process

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Firestore Data Modeling Guide](https://firebase.google.com/docs/firestore/data-model)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Securing Firebase](https://firebase.google.com/docs/security) 