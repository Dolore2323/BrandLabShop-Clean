import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import AuthModal from '@/components/AuthModal';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { t, isRTL } = useLanguage();
  const { getCartCount } = useCart();
  const router = useRouter();
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthModalVisible(false);
    Alert.alert('הצלחה', 'ברוכים הבאים!');
  };

  const features = [
    {
      icon: 'star.fill',
      title: 'Premium Quality',
      description: 'Best products from top brands',
      color: '#FFD700',
    },
    {
      icon: 'truck.box.fill',
      title: 'Fast Delivery',
      description: 'Free shipping on orders over $50',
      color: '#4CAF50',
    },
    {
      icon: 'shield.checkered',
      title: 'Secure Payment',
      description: '100% secure payment processing',
      color: '#2196F3',
    },
    {
      icon: 'arrow.clockwise',
      title: 'Easy Returns',
      description: '30-day return policy',
      color: '#FF9800',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.heroSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.heroContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>BL</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>ברוכים הבאים ל</Text>
          <Text style={styles.heroBrand}>BrandLab Shop</Text>
          <Text style={styles.heroSubtitle}>
            Discover amazing products at unbeatable prices
          </Text>
          
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => setIsAuthModalVisible(true)}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaButtonText}>Get Started</Text>
              <IconSymbol name="arrow.right" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Why Choose Us?</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                <IconSymbol name={feature.icon as any} size={24} color={feature.color} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/Catalog')}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E8E']}
              style={styles.quickActionGradient}
            >
              <IconSymbol name="magnifyingglass" size={32} color="white" />
              <Text style={styles.quickActionText}>עיין במוצרים</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/Cart')}
          >
            <LinearGradient
              colors={['#4ECDC4', '#44A08D']}
              style={styles.quickActionGradient}
            >
              <View style={styles.cartIconContainer}>
                <IconSymbol name="cart" size={32} color="white" />
                {getCartCount() > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{getCartCount()}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.quickActionText}>עגלת קניות</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <LinearGradient
              colors={['#A8E6CF', '#7FCDCD']}
              style={styles.quickActionGradient}
            >
              <IconSymbol name="person.circle" size={32} color="white" />
              <Text style={styles.quickActionText}>My Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <LinearGradient
              colors={['#FFD93D', '#FF6B6B']}
              style={styles.quickActionGradient}
            >
              <IconSymbol name="gearshape" size={32} color="white" />
              <Text style={styles.quickActionText}>Admin Panel</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      </ScrollView>

      {/* Auth Modal */}
      <AuthModal
        visible={isAuthModalVisible}
        onClose={() => setIsAuthModalVisible(false)}
        onSuccess={handleAuthSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  heroSection: {
    height: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  heroTitle: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  heroBrand: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  ctaButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginRight: 10,
  },
  featuresSection: {
    padding: 20,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  quickActionsSection: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  quickActionGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 100,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginTop: 8,
    textAlign: 'center',
  },

  cartIconContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
