import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { supabase } from '../../supabaseClient';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface Order {
  id: number;
  total: number;
  status: string;
  created_at: string;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchOrders();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        setUser({
          id: user.id,
          email: user.email,
          created_at: user.created_at
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Выйти из аккаунта',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Редактирование профиля', 'Функция в разработке');
  };

  const handleChangePassword = () => {
    Alert.alert('Смена пароля', 'Функция в разработке');
  };

  const handleNotifications = () => {
    Alert.alert('Уведомления', 'Функция в разработке');
  };

  const handlePrivacy = () => {
    Alert.alert('Приватность', 'Функция в разработке');
  };

  const handleHelp = () => {
    Alert.alert('Помощь', 'Функция в разработке');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#FF9500';
      case 'processing': return '#007AFF';
      case 'shipped': return '#34C759';
      case 'delivered': return '#34C759';
      case 'cancelled': return '#FF3B30';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'Ожидает';
      case 'processing': return 'Обрабатывается';
      case 'shipped': return 'Отправлен';
      case 'delivered': return 'Доставлен';
      case 'cancelled': return 'Отменён';
      default: return status;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Загрузка профиля...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Пользователь не найден</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Заголовок профиля */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <IconSymbol size={40} name="person.fill" color="#007AFF" />
          </View>
        </View>
        <Text style={styles.userName}>{user.email}</Text>
        <Text style={styles.userInfo}>
          Пользователь с {formatDate(user.created_at)}
        </Text>
      </View>

      {/* Быстрые действия */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Быстрые действия</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={handleEditProfile}>
            <IconSymbol size={24} name="person.circle" color="#007AFF" />
            <Text style={styles.quickActionText}>Профиль</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={handleChangePassword}>
            <IconSymbol size={24} name="lock" color="#007AFF" />
            <Text style={styles.quickActionText}>Пароль</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={handleNotifications}>
            <IconSymbol size={24} name="bell" color="#007AFF" />
            <Text style={styles.quickActionText}>Уведомления</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Последние заказы */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Последние заказы</Text>
        {orders.length > 0 ? (
          orders.map((order) => (
            <View key={order.id} style={styles.orderItem}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderNumber}>Заказ #{order.id}</Text>
                <Text style={styles.orderDate}>{formatDate(order.created_at)}</Text>
              </View>
              <View style={styles.orderDetails}>
                <Text style={styles.orderTotal}>{order.total} ₪</Text>
                <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>
                  {getStatusText(order.status)}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyOrders}>
            <IconSymbol size={48} name="bag" color="#ccc" />
            <Text style={styles.emptyOrdersText}>У вас пока нет заказов</Text>
          </View>
        )}
      </View>

      {/* Настройки */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Настройки</Text>
        <TouchableOpacity style={styles.settingItem} onPress={handlePrivacy}>
          <IconSymbol size={20} name="hand.raised" color="#666" />
          <Text style={styles.settingText}>Приватность</Text>
          <IconSymbol size={16} name="chevron.right" color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handleHelp}>
          <IconSymbol size={20} name="questionmark.circle" color="#666" />
          <Text style={styles.settingText}>Помощь</Text>
          <IconSymbol size={16} name="chevron.right" color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Выход */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <IconSymbol size={20} name="rectangle.portrait.and.arrow.right" color="#FF3B30" />
        <Text style={styles.signOutText}>Выйти из аккаунта</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userInfo: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  orderDetails: {
    alignItems: 'flex-end',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  emptyOrders: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyOrdersText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 16,
    marginBottom: 32,
    padding: 20,
  },
  signOutText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 12,
  },
}); 