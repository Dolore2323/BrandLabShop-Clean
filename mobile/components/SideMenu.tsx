import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface SideMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function SideMenu({ isVisible, onClose }: SideMenuProps) {
  const { t, language, setLanguage, isRTL } = useLanguage();
  const router = useRouter();
  const slideAnim = React.useRef(new Animated.Value(-width)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const handleNavigation = (route: string) => {
    onClose();
    router.push(route as any);
  };

  const handleLanguageChange = (lang: 'he' | 'en' | 'ru') => {
    setLanguage(lang);
  };

  const menuItems = [
    { key: 'home', route: '/(tabs)', icon: 'house', title: t('home') },
    { key: 'catalog', route: '/(tabs)/Catalog', icon: 'square.grid.2x2', title: t('catalog') },
    { key: 'cart', route: '/(tabs)/Cart', icon: 'cart', title: t('cart') },
    { key: 'profile', route: '/(tabs)/Profile', icon: 'person.circle', title: t('profile') },
    { key: 'admin', route: '/(tabs)/Admin', icon: 'gearshape', title: t('admin') },
  ];

  const languages = [
    { code: 'he', name: 'עברית', flag: '🇮🇱' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];

  return (
    <>
      {/* Overlay */}
      {isVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />
      )}

      {/* Menu */}
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX: slideAnim }],
            [isRTL ? 'right' : 'left']: 0,
          },
        ]}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>BL</Text>
              </View>
              <Text style={styles.brandName}>BrandLab</Text>
              <Text style={styles.brandSubtitle}>Shop</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <IconSymbol name="xmark" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <View style={styles.userSection}>
            <View style={styles.avatar}>
              <IconSymbol name="person.fill" size={32} color="white" />
            </View>
            <Text style={styles.welcomeText}>ברוכים הבאים</Text>
            <Text style={styles.userName}>משתמש יקר</Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Navigation Items */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ניווט</Text>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={styles.menuItem}
                  onPress={() => handleNavigation(item.route)}
                >
                  <View style={styles.menuItemIcon}>
                    <IconSymbol name={item.icon as any} size={20} color="white" />
                  </View>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                  <IconSymbol name="chevron.right" size={16} color="rgba(255,255,255,0.6)" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Language Selector */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>שפה</Text>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageItem,
                    language === lang.code && styles.languageItemActive,
                  ]}
                  onPress={() => handleLanguageChange(lang.code as any)}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={[
                    styles.languageText,
                    language === lang.code && styles.languageTextActive,
                  ]}>
                    {lang.name}
                  </Text>
                  {language === lang.code && (
                    <IconSymbol name="checkmark" size={16} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>פעולות מהירות</Text>
              <TouchableOpacity style={styles.quickAction}>
                <IconSymbol name="star" size={20} color="white" />
                <Text style={styles.quickActionText}>מועדפים</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction}>
                <IconSymbol name="clock" size={20} color="white" />
                <Text style={styles.quickActionText}>היסטוריה</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction}>
                <IconSymbol name="questionmark.circle" size={20} color="white" />
                <Text style={styles.quickActionText}>עזרה</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>BrandLab Shop v1.0</Text>
            <Text style={styles.footerSubtext}>Made with ❤️</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: width * 0.85,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  brandName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 4,
  },
  brandSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '300',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  languageItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  languageFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  languageText: {
    flex: 1,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  languageTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  quickActionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
  },
}); 