import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import { OAUTH_CONFIG } from '@/config/oauth';

// OAuth Configuration
const GOOGLE_CLIENT_ID = OAUTH_CONFIG.GOOGLE.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = OAUTH_CONFIG.GOOGLE.CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: 'brandlabshop',
});

const APPLE_CLIENT_ID = OAUTH_CONFIG.APPLE.CLIENT_ID;
const APPLE_CLIENT_SECRET = OAUTH_CONFIG.APPLE.CLIENT_SECRET;
const APPLE_REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: 'brandlabshop',
});

const SUPABASE_URL = OAUTH_CONFIG.SUPABASE.URL;
const SUPABASE_ANON_KEY = OAUTH_CONFIG.SUPABASE.ANON_KEY;

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  avatar?: string;
  provider: 'google' | 'apple' | 'phone';
}

class AuthService {
  private currentUser: User | null = null;

  async initialize() {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        this.currentUser = JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error initializing auth service:', error);
    }
  }

  async signInWithGoogle(): Promise<User | null> {
    try {
      // Для демо используем mock, пока не настроены реальные credentials
      if (GOOGLE_CLIENT_ID.includes('your-google-client-id')) {
        console.log('Using mock Google sign in - configure real OAuth credentials');
        const user: User = {
          id: Crypto.randomUUID(),
          email: 'user@gmail.com',
          name: 'Google User',
          avatar: 'https://via.placeholder.com/150',
          provider: 'google',
        };
        await this.saveUser(user);
        return user;
      }

      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        redirectUri: GOOGLE_REDIRECT_URI,
        responseType: AuthSession.ResponseType.Code,
      });

      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/oauth/authorize',
      });

      if (result.type === 'success' && result.params.code) {
        // Обмен кода на токены
        const tokenResponse = await this.exchangeCodeForTokens(result.params.code, 'google');
        
        if (tokenResponse) {
          // Получение информации о пользователе
          const userInfo = await this.getGoogleUserInfo(tokenResponse.access_token);
          
          const user: User = {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            avatar: userInfo.picture,
            provider: 'google',
          };

          await this.saveUser(user);
          return user;
        }
      }

      return null;
    } catch (error) {
      console.error('Google sign in error:', error);
      return null;
    }
  }

  async signInWithApple(): Promise<User | null> {
    try {
      // Для демо используем mock, пока не настроены реальные credentials
      if (APPLE_CLIENT_ID.includes('com.brandlabshop.app')) {
        console.log('Using mock Apple sign in - configure real OAuth credentials');
        const user: User = {
          id: Crypto.randomUUID(),
          email: 'user@icloud.com',
          name: 'Apple User',
          avatar: 'https://via.placeholder.com/150',
          provider: 'apple',
        };
        await this.saveUser(user);
        return user;
      }

      const request = new AuthSession.AuthRequest({
        clientId: APPLE_CLIENT_ID,
        scopes: ['name', 'email'],
        redirectUri: APPLE_REDIRECT_URI,
        responseType: AuthSession.ResponseType.Code,
      });

      const result = await request.promptAsync({
        authorizationEndpoint: 'https://appleid.apple.com/auth/authorize',
      });

      if (result.type === 'success' && result.params.code) {
        // Обмен кода на токены
        const tokenResponse = await this.exchangeCodeForTokens(result.params.code, 'apple');
        
        if (tokenResponse) {
          // Получение информации о пользователе
          const userInfo = await this.getAppleUserInfo(tokenResponse.access_token);
          
          const user: User = {
            id: userInfo.sub,
            email: userInfo.email,
            name: userInfo.name,
            provider: 'apple',
          };

          await this.saveUser(user);
          return user;
        }
      }

      return null;
    } catch (error) {
      console.error('Apple sign in error:', error);
      return null;
    }
  }

  async signInWithPhone(phoneNumber: string, code: string): Promise<User | null> {
    try {
      // Для демо используем mock, пока не настроен Supabase
      if (SUPABASE_URL.includes('your-project')) {
        console.log('Using mock phone verification - configure Supabase');
        // Принимаем любой 6-значный код для демо
        if (code.length === 6) {
          const user: User = {
            id: Crypto.randomUUID(),
            phone: phoneNumber,
            name: 'Phone User',
            provider: 'phone',
          };
          await this.saveUser(user);
          return user;
        }
        return null;
      }

      // Верификация SMS кода через Supabase
      const response = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({
          phone: phoneNumber,
          token: code,
          type: 'sms'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        const user: User = {
          id: data.user.id,
          phone: phoneNumber,
          name: data.user.user_metadata?.name || 'Phone User',
          provider: 'phone',
        };

        await this.saveUser(user);
        return user;
      }

      return null;
    } catch (error) {
      console.error('Phone sign in error:', error);
      return null;
    }
  }

  async sendPhoneVerificationCode(phoneNumber: string): Promise<boolean> {
    try {
      // Для демо используем mock, пока не настроен Supabase
      if (SUPABASE_URL.includes('your-project')) {
        console.log(`Mock: Sending verification code to ${phoneNumber}`);
        return true;
      }

      // Отправка SMS через Supabase
      const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({
          phone: phoneNumber,
          password: Crypto.randomUUID(), // Временный пароль
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending verification code:', error);
      return false;
    }
  }

  private async exchangeCodeForTokens(code: string, provider: 'google' | 'apple'): Promise<any> {
    try {
      const tokenEndpoint = provider === 'google' 
        ? 'https://oauth2.googleapis.com/token'
        : 'https://appleid.apple.com/auth/token';

      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: provider === 'google' ? GOOGLE_REDIRECT_URI : APPLE_REDIRECT_URI,
          client_id: provider === 'google' ? GOOGLE_CLIENT_ID : APPLE_CLIENT_ID,
          // Для Apple нужен client_secret
          ...(provider === 'apple' && { client_secret: APPLE_CLIENT_SECRET }),
        }),
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Token exchange error:', error);
      return null;
    }
  }

  private async getGoogleUserInfo(accessToken: string): Promise<any> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Google user info error:', error);
      return null;
    }
  }

  private async getAppleUserInfo(accessToken: string): Promise<any> {
    try {
      // Apple не предоставляет endpoint для получения информации о пользователе
      // Информация приходит в токене ID
      return {
        sub: 'apple-user-id',
        email: 'user@icloud.com',
        name: 'Apple User',
      };
    } catch (error) {
      console.error('Apple user info error:', error);
      return null;
    }
  }

  async signOut(): Promise<void> {
    try {
      await AsyncStorage.removeItem('user');
      this.currentUser = null;
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.currentUser) {
      await this.initialize();
    }
    return this.currentUser;
  }

  private async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      this.currentUser = user;
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }
}

export const authService = new AuthService(); 