# QuoteNote

A simple, elegant web application for saving and discovering quotes.

## Features

- ✅ Add quotes with optional author and tags
- ✅ View a random quote on the home page
- ✅ Refresh to see a different random quote
- ✅ Edit existing quotes
- ✅ Delete quotes with confirmation
- ✅ Filter quotes by tags
- ✅ View all quotes with sorting and filtering
- ✅ Clickable tags for quick filtering
- ✅ Show newly added/edited quote automatically
- ✅ Smart tag organization by usage frequency
- ✅ Deployed on Firebase Hosting
- ✅ Local storage for anonymous users
- ✅ Firebase cloud storage for authenticated users
- ✅ User authentication with email/password and Google
- ✅ Local-to-cloud data migration prompt on sign-in
- ✅ Secure authentication flow with redirects
- ✅ Privacy-focused with local data clearing on logout

## Technology Stack

- Next.js with App Router
- TypeScript
- Tailwind CSS
- Local browser storage
- Firebase Firestore
- Firebase Authentication
- Firebase Hosting
- Cloudflare DNS

## Live Demo

Check out the live demo: [QuoteNote App](https://quotes.nikmoores.com/)

## Getting Started

Follow these steps to run the application locally:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Features Explained

### Tag System
- **Smart Autocomplete**: As you type, existing tags appear with most frequently used tags shown first
- **One-Click Filtering**: Click any tag to see all quotes with that tag
- **Usage-Based Ordering**: Tags are suggested based on how often they're used

### User Experience
- **Context-Aware UI**: Edit and delete buttons only appear on hover (desktop) for a cleaner interface
- **Instant Feedback**: When you add or edit a quote, it's immediately displayed
- **Intuitive Navigation**: Clickable elements for easy movement between views

### Authentication & Data Handling
- **Seamless Migration**: Prompt to transfer local quotes to the cloud when signing in
- **Smart Redirects**: Authenticated users are redirected from login/sign-up pages
- **Privacy Protection**: Local storage is cleared on logout for better privacy
- **Dual Storage**: Anonymous mode uses local storage, authenticated users get cloud storage

### Storage Options
- **Local Storage**: For anonymous users, quotes are stored in your browser's local storage
- **Cloud Storage**: When signed in, your quotes are stored in Firebase Firestore
- **Automatic Switching**: Storage mode automatically changes based on authentication status

## Setting Up Firebase

For detailed, step-by-step instructions on how to set host your own version, see the [Firebase Setup Guide](FIREBASE_SETUP.md).

## Future Improvements

- Image backgrounds for quotes
- Social sharing functionality
- Dark/light mode toggle

## Development

This project uses Next.js. If you're not familiar with it, check out [the Next.js documentation](https://nextjs.org/docs).

## Deployment

This project is configured for deployment to Firebase Hosting:

1. Build the project with `npm run build`
2. Deploy to Firebase with `firebase deploy`

For first-time setup, follow the [Firebase Setup Guide](FIREBASE_SETUP.md) which includes hosting configuration.
