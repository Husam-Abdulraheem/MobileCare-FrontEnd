# Authentication Setup Guide

This guide will help you set up Firebase Authentication for the Mobile Care Frontend application.

## Prerequisites

1. A Firebase project with Authentication enabled
2. Node.js and npm/yarn installed
3. Basic knowledge of Firebase Console

## Step 1: Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" authentication
   - Enable "Google" authentication (optional)
   - Configure authorized domains if needed

## Step 2: Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select "Web" if you haven't already
4. Register your app and copy the configuration object
5. The configuration should look like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456"
   };
   ```

## Step 3: Environment Variables Setup

1. Copy the `env.example` file to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Replace the placeholder values in `.env.local` with your actual Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

## Step 4: Install Dependencies

Make sure you have the required dependencies installed:
```bash
npm install
```

## Step 5: Test Authentication

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the application and try to:
   - Register a new account
   - Login with existing credentials
   - Test Google authentication (if enabled)
   - Test password reset functionality

## Features Implemented

### ✅ Authentication Features
- **Email/Password Registration**: Users can create accounts with email and password
- **Email/Password Login**: Secure login with email and password
- **Google Authentication**: OAuth login with Google accounts
- **Password Reset**: Users can reset their passwords via email
- **Automatic Token Management**: Firebase tokens are automatically managed
- **Session Persistence**: User sessions persist across browser refreshes
- **Secure Logout**: Proper cleanup of authentication state

### ✅ Security Features
- **Protected Routes**: Routes are protected based on authentication status
- **Token Validation**: Automatic token validation and refresh
- **Error Handling**: Comprehensive error handling for authentication failures
- **Loading States**: Proper loading states during authentication operations

### ✅ User Management
- **User Profiles**: User information is stored in Firestore
- **Profile Data**: Full name, email, and creation date are tracked
- **Multiple Collections**: User data is stored in both `users` and `userProfiles` collections

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Check that your API key is correct in `.env.local`
   - Ensure the API key is from the correct Firebase project

2. **"Firebase: Error (auth/operation-not-allowed)"**
   - Enable Email/Password authentication in Firebase Console
   - Go to Authentication > Sign-in method > Email/Password

3. **"Firebase: Error (auth/popup-blocked)"**
   - Allow popups for your domain in the browser
   - Check if ad blockers are interfering

4. **Environment variables not loading**
   - Ensure the file is named `.env.local` (not `.env`)
   - Restart the development server after changing environment variables

### Debug Mode

To enable debug logging, add this to your browser console:
```javascript
localStorage.setItem('debug', 'firebase:*');
```

## Security Best Practices

1. **Never commit `.env.local` to version control**
2. **Use environment variables for all sensitive configuration**
3. **Enable Firebase Security Rules for Firestore**
4. **Regularly rotate API keys if needed**
5. **Monitor authentication logs in Firebase Console**

## Additional Configuration

### Custom Authentication Providers

To add more authentication providers (Facebook, Twitter, etc.):

1. Enable the provider in Firebase Console
2. Add the provider configuration to the authentication code
3. Update the UI components to include the new provider

### Custom User Claims

To add custom user claims for role-based access:

1. Use Firebase Admin SDK on your backend
2. Set custom claims for users
3. Verify claims in your frontend code

## Support

If you encounter issues:

1. Check the Firebase Console for error logs
2. Review the browser console for JavaScript errors
3. Verify your environment variables are correct
4. Ensure all dependencies are properly installed

For more information, refer to the [Firebase Authentication documentation](https://firebase.google.com/docs/auth). 