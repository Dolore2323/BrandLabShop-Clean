import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { authService } from '@/services/AuthService';
import CountryPicker from './CountryPicker';

const { width, height } = Dimensions.get('window');

interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ visible, onClose, onSuccess }: AuthModalProps) {
  const [authMethod, setAuthMethod] = useState<'phone' | 'google' | 'apple'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    name: 'ישראל',
    code: 'IL',
    dialCode: '+972',
    flag: '🇮🇱'
  });

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const user = await authService.signInWithGoogle();
      if (user) {
        Alert.alert('הצלחה', 'התחברת בהצלחה עם Google!');
        onSuccess();
      } else {
        Alert.alert('שגיאה', 'שגיאה בהתחברות עם Google');
      }
    } catch (error) {
      Alert.alert('שגיאה', 'שגיאה בהתחברות עם Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    try {
      const user = await authService.signInWithApple();
      if (user) {
        Alert.alert('הצלחה', 'התחברת בהצלחה עם Apple!');
        onSuccess();
      } else {
        Alert.alert('שגיאה', 'שגיאה בהתחברות עם Apple');
      }
    } catch (error) {
      Alert.alert('שגיאה', 'שגיאה בהתחברות עם Apple');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCode = async () => {
    const fullPhoneNumber = selectedCountry.dialCode + phoneNumber;
    if (!phoneNumber || phoneNumber.length < 9) {
      Alert.alert('שגיאה', 'אנא הכנס מספר טלפון תקין');
      return;
    }

    setIsLoading(true);
    try {
      const success = await authService.sendPhoneVerificationCode(fullPhoneNumber);
      if (success) {
        setCodeSent(true);
        Alert.alert('הצלחה', 'קוד אימות נשלח לטלפון שלך');
      } else {
        Alert.alert('שגיאה', 'שגיאה בשליחת קוד אימות');
      }
    } catch (error) {
      Alert.alert('שגיאה', 'שגיאה בשליחת קוד אימות');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert('שגיאה', 'אנא הכנס קוד אימות בן 6 ספרות');
      return;
    }

    setIsLoading(true);
    try {
      const fullPhoneNumber = selectedCountry.dialCode + phoneNumber;
      const user = await authService.signInWithPhone(fullPhoneNumber, verificationCode);
      if (user) {
        Alert.alert('הצלחה', 'התחברת בהצלחה!');
        onSuccess();
      } else {
        Alert.alert('שגיאה', 'קוד אימות שגוי');
      }
    } catch (error) {
      Alert.alert('שגיאה', 'שגיאה באימות הקוד');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPhoneAuth = () => (
    <View style={styles.authContent}>
      <View style={styles.phoneInputContainer}>
        <CountryPicker
          selectedCountry={selectedCountry}
          onSelectCountry={setSelectedCountry}
        />
        <View style={styles.inputContainer}>
          <IconSymbol name="phone" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="מספר טלפון"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={15}
          />
        </View>
      </View>

      {!codeSent ? (
        <TouchableOpacity 
          style={styles.authButton} 
          onPress={handleSendCode}
          disabled={isLoading}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.authButtonGradient}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.authButtonText}>שלח קוד אימות</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.inputContainer}>
            <IconSymbol name="key" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="קוד אימות (6 ספרות)"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          <TouchableOpacity 
            style={styles.authButton} 
            onPress={handleVerifyCode}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.authButtonGradient}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.authButtonText}>אמת קוד</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resendButton}
            onPress={handleSendCode}
            disabled={isLoading}
          >
            <Text style={styles.resendButtonText}>שלח קוד חדש</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const renderOAuthButtons = () => (
    <View style={styles.oauthContent}>
      <TouchableOpacity 
        style={styles.oauthButton}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      >
        <LinearGradient
          colors={['#4285F4', '#34A853']}
          style={styles.oauthButtonGradient}
        >
          <IconSymbol name="globe" size={24} color="white" />
          <Text style={styles.oauthButtonText}>התחבר עם Google</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.oauthButton}
        onPress={handleAppleSignIn}
        disabled={isLoading}
      >
        <LinearGradient
          colors={['#000000', '#333333']}
          style={styles.oauthButtonGradient}
        >
          <IconSymbol name="apple.logo" size={24} color="white" />
          <Text style={styles.oauthButtonText}>התחבר עם Apple</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  if (!visible) return null;

  return (
    <View style={styles.modalContainer}>
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.modalGradient}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <IconSymbol name="xmark" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                          <Text style={styles.modalTitle}>ברוכים הבאים</Text>
            </View>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.methodTabs}>
              <TouchableOpacity
                style={[
                  styles.methodTab,
                  authMethod === 'phone' && styles.methodTabActive
                ]}
                onPress={() => setAuthMethod('phone')}
              >
                <IconSymbol 
                  name="phone" 
                  size={20} 
                  color={authMethod === 'phone' ? '#667eea' : '#666'} 
                />
                <Text style={[
                  styles.methodTabText,
                  authMethod === 'phone' && styles.methodTabTextActive
                ]}>
                  טלפון
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodTab,
                  authMethod === 'google' && styles.methodTabActive
                ]}
                onPress={() => setAuthMethod('google')}
              >
                <IconSymbol 
                  name="globe" 
                  size={20} 
                  color={authMethod === 'google' ? '#667eea' : '#666'} 
                />
                <Text style={[
                  styles.methodTabText,
                  authMethod === 'google' && styles.methodTabTextActive
                ]}>
                  Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodTab,
                  authMethod === 'apple' && styles.methodTabActive
                ]}
                onPress={() => setAuthMethod('apple')}
              >
                <IconSymbol 
                  name="apple.logo" 
                  size={20} 
                  color={authMethod === 'apple' ? '#667eea' : '#666'} 
                />
                <Text style={[
                  styles.methodTabText,
                  authMethod === 'apple' && styles.methodTabTextActive
                ]}>
                  Apple
                </Text>
              </TouchableOpacity>
            </View>

            {authMethod === 'phone' ? renderPhoneAuth() : renderOAuthButtons()}
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalGradient: {
    height: height * 0.8,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 40,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  methodTabs: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 4,
  },
  methodTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  methodTabActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  methodTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 8,
  },
  methodTabTextActive: {
    color: '#667eea',
    fontWeight: '600',
  },
  authContent: {
    flex: 1,
  },
  oauthContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    flex: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  authButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  authButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  authButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  resendButtonText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '500',
  },
  oauthButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  oauthButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  oauthButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginLeft: 12,
  },
}); 