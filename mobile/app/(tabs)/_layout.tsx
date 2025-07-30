import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import SideMenu from '@/components/SideMenu';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TabLayout() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { isRTL } = useLanguage();

  return (
    <>
      <SideMenu isVisible={isMenuVisible} onClose={() => setIsMenuVisible(false)} />
      
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#667eea',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setIsMenuVisible(true)}
            >
              <IconSymbol name="line.3.horizontal" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'BrandLab Shop',
          }}
        />
        <Stack.Screen
          name="Catalog"
          options={{
            title: 'Catalog',
          }}
        />
        <Stack.Screen
          name="Cart"
          options={{
            title: 'Cart',
          }}
        />
        <Stack.Screen
          name="Checkout"
          options={{
            title: 'Checkout',
          }}
        />
        <Stack.Screen
          name="Product"
          options={{
            title: 'Product',
          }}
        />
        <Stack.Screen
          name="Profile"
          options={{
            title: 'Profile',
          }}
        />
        <Stack.Screen
          name="Admin"
          options={{
            title: 'Admin Panel',
          }}
        />
        <Stack.Screen
          name="explore"
          options={{
            title: 'Explore',
          }}
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
    marginLeft: 8,
  },
});
