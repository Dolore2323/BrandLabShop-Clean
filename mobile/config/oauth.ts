// OAuth Configuration
export const OAUTH_CONFIG = {
  GOOGLE: {
    CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com',
    CLIENT_SECRET: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
  },
  APPLE: {
    CLIENT_ID: process.env.EXPO_PUBLIC_APPLE_CLIENT_ID || 'com.brandlabshop.app',
    CLIENT_SECRET: process.env.EXPO_PUBLIC_APPLE_CLIENT_SECRET || 'your-apple-client-secret',
  },
  SUPABASE: {
    URL: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
    ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key',
  },
};

// Instructions for setup:
/*
1. Google OAuth Setup:
   - Go to https://console.developers.google.com/
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - exp://localhost:8088/--/auth
     - exp://10.100.102.8:8088/--/auth (your local IP)
   - Copy Client ID and Client Secret

2. Apple OAuth Setup:
   - Go to https://developer.apple.com/
   - Create App ID
   - Enable Sign In with Apple
   - Create Service ID
   - Configure redirect URLs
   - Generate Client Secret

3. Supabase Setup:
   - Go to https://supabase.com/
   - Create new project
   - Enable Phone Auth in Authentication settings
   - Copy URL and anon key
   - Configure SMS provider (Twilio, etc.)

4. Environment Variables:
   Create .env file in mobile directory:
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   EXPO_PUBLIC_GOOGLE_CLIENT_SECRET=your-google-client-secret
   EXPO_PUBLIC_APPLE_CLIENT_ID=com.brandlabshop.app
   EXPO_PUBLIC_APPLE_CLIENT_SECRET=your-apple-client-secret
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
*/ 