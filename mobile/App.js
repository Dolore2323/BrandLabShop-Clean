import React, { useEffect } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { I18nManager, View, Text, Button } from 'react-native';
import * as Updates from 'expo-updates';

function HomeScreen() {
  const { t } = useTranslation();
  return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text>{t('welcome')}</Text></View>;
}
function CatalogScreen() {
  const { t } = useTranslation();
  return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text>{t('catalog')}</Text></View>;
}
function CartScreen() {
  const { t } = useTranslation();
  return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text>{t('cart')}</Text></View>;
}
function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const switchLang = async () => {
    const next = i18n.language === 'en' ? 'he' : 'en';
    await i18n.changeLanguage(next);
    I18nManager.forceRTL(next === 'he');
    Updates.reloadAsync();
  };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{t('profile')}</Text>
      <Button title={t('login')} onPress={() => {}} />
      <Button title={t('logout')} onPress={() => {}} />
      <Button title={i18n.language === 'en' ? 'עברית' : 'English'} onPress={switchLang} />
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('home') }} />
      <Tab.Screen name="Catalog" component={CatalogScreen} options={{ title: t('catalog') }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: t('cart') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: t('profile') }} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(i18n.language === 'he');
  }, [i18n.language]);
  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>
  );
} 