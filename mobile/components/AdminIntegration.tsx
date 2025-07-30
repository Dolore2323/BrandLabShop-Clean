import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock data for demo purposes
const mockProducts = [
  { id: 1, name: 'Product 1', price: 29.99, stock: 50, category: 'Electronics' },
  { id: 2, name: 'Product 2', price: 19.99, stock: 30, category: 'Clothing' },
  { id: 3, name: 'Product 3', price: 39.99, stock: 25, category: 'Home' },
];

const mockOrders = [
  { id: 1, customer: 'John Doe', total: 89.97, status: 'Pending', date: '2024-01-15' },
  { id: 2, customer: 'Jane Smith', total: 59.98, status: 'Shipped', date: '2024-01-14' },
  { id: 3, customer: 'Bob Johnson', total: 129.95, status: 'Delivered', date: '2024-01-13' },
];

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive' },
];

export default function AdminIntegration() {
  const { t } = useLanguage();
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState(mockOrders);
  const [users, setUsers] = useState(mockUsers);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert(t('admin.refreshSuccess'), t('admin.dataUpdated'));
    }, 1000);
  }, [t]);

  const handleAddProduct = () => {
    Alert.alert(t('admin.addProduct'), t('admin.featureComingSoon'));
  };

  const handleEditProduct = (productId: number) => {
    Alert.alert(t('admin.editProduct'), `${t('admin.editingProduct')} ${productId}`);
  };

  const handleDeleteProduct = (productId: number) => {
    Alert.alert(
      t('admin.deleteProduct'),
      t('admin.deleteConfirmation'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.delete'), 
          style: 'destructive',
          onPress: () => {
            setProducts(products.filter(p => p.id !== productId));
            Alert.alert(t('admin.success'), t('admin.productDeleted'));
          }
        }
      ]
    );
  };

  const renderProducts = () => (
    <View style={styles.tabContent}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{t('admin.products')}</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Text style={styles.addButtonText}>+ {t('admin.add')}</Text>
        </TouchableOpacity>
      </View>
      
      {products.map((product) => (
        <View key={product.id} style={styles.itemCard}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{product.name}</Text>
            <Text style={styles.itemDetails}>
              ${product.price} | {t('admin.stock')}: {product.stock} | {product.category}
            </Text>
          </View>
          <View style={styles.itemActions}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => handleEditProduct(product.id)}
            >
              <Text style={styles.actionButtonText}>{t('common.edit')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]} 
              onPress={() => handleDeleteProduct(product.id)}
            >
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                {t('common.delete')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderOrders = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>{t('admin.orders')}</Text>
      
      {orders.map((order) => (
        <View key={order.id} style={styles.itemCard}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{t('admin.order')} #{order.id}</Text>
            <Text style={styles.itemDetails}>
              {order.customer} | ${order.total} | {order.status} | {order.date}
            </Text>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>{t('admin.view')}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderUsers = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>{t('admin.users')}</Text>
      
      {users.map((user) => (
        <View key={user.id} style={styles.itemCard}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{user.name}</Text>
            <Text style={styles.itemDetails}>
              {user.email} | {user.status}
            </Text>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>{t('admin.view')}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('admin.panel')}</Text>
        <Text style={styles.subtitle}>{t('admin.management')}</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'products' && styles.activeTab]}
          onPress={() => setActiveTab('products')}
        >
          <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
            {t('admin.products')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
            {t('admin.orders')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            {t('admin.users')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'users' && renderUsers()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
  },
  itemActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#fff5f5',
    borderColor: '#ffebeb',
  },
  deleteButtonText: {
    color: '#dc2626',
  },
}); 