import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function CartScreen() {
  const { t, isRTL } = useLanguage();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const router = useRouter();

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      Alert.alert(
        'הסר פריט',
        'האם אתה בטוח שברצונך להסיר פריט זה מהעגלה?',
        [
          { text: 'ביטול', style: 'cancel' },
          { text: 'הסר', style: 'destructive', onPress: () => removeFromCart(itemId) },
        ]
      );
      return;
    }

    updateQuantity(itemId, newQuantity);
  };

  const handleClearCart = () => {
    Alert.alert(
      'נקה עגלה',
      'האם אתה בטוח שברצונך לנקות את העגלה?',
      [
        { text: 'ביטול', style: 'cancel' },
        { text: 'נקה', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;

  const renderCartItem = (item: any) => (
    <View key={item.id} style={styles.cartItem}>
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={styles.cartItemGradient}
      >
        <View style={styles.itemImage}>
          <Text style={styles.itemEmoji}>📷</Text>
        </View>
        
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
          {item.color && <Text style={styles.itemVariant}>צבע: {item.color}</Text>}
          {item.size && <Text style={styles.itemVariant}>מידה: {item.size}</Text>}
          <Text style={styles.itemPrice}>₪{item.price}</Text>
        </View>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
          >
            <IconSymbol name="minus" size={16} color="#666" />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
          >
            <IconSymbol name="plus" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.itemTotal}>
          <Text style={styles.itemTotalText}>₪{(item.price * item.quantity).toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromCart(item.id)}
          >
            <IconSymbol name="trash" size={16} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.emptyGradient}
        >
          <View style={styles.emptyIcon}>
            <IconSymbol name="cart" size={64} color="white" />
          </View>
          <Text style={styles.emptyTitle}>העגלה שלך ריקה</Text>
          <Text style={styles.emptySubtitle}>
            התחל בקניות כדי להוסיף פריטים לעגלה
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)/Catalog')}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.browseButtonGradient}
            >
              <Text style={styles.browseButtonText}>עיין במוצרים</Text>
              <IconSymbol name="arrow.right" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.cartIcon}>
              <IconSymbol name="cart.fill" size={24} color="white" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
              </View>
            </View>
            <Text style={styles.headerTitle}>עגלת קניות</Text>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
              <IconSymbol name="trash" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Cart Items */}
      <ScrollView style={styles.cartItemsContainer} showsVerticalScrollIndicator={false}>
        {cartItems.map(renderCartItem)}
      </ScrollView>

      {/* Order Summary */}
      <View style={styles.summaryContainer}>
        <LinearGradient
          colors={['#f8f9fa', '#e9ecef']}
          style={styles.summaryGradient}
        >
          <Text style={styles.summaryTitle}>סיכום הזמנה</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>סכום ביניים</Text>
            <Text style={styles.summaryValue}>₪{subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>משלוח</Text>
            <Text style={styles.summaryValue}>
              {shipping === 0 ? 'חינם' : `₪${shipping.toFixed(2)}`}
            </Text>
          </View>
          

          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>סה"כ</Text>
            <Text style={styles.totalValue}>₪{total.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => router.push('/(tabs)/Checkout')}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.checkoutButtonGradient}
            >
              <Text style={styles.checkoutButtonText}>המשך לתשלום</Text>
              <IconSymbol name="arrow.right" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueShoppingButton}
            onPress={() => router.push('/(tabs)/Catalog')}
          >
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <Text style={styles.continueShoppingText}>המשך בקניות</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    marginBottom: 16,
  },
  headerGradient: {
    padding: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartIcon: {
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  clearButton: {
    padding: 8,
  },
  cartItemsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cartItem: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cartItemGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemEmoji: {
    fontSize: 24,
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
  itemCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemVariant: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#667eea',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotal: {
    alignItems: 'center',
  },
  itemTotalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  removeButton: {
    padding: 4,
  },
  summaryContainer: {
    padding: 16,
  },
  summaryGradient: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  checkoutButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  checkoutButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginRight: 8,
  },
  continueShoppingButton: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 12,
  },
  continueShoppingText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
  },
  emptyGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  browseButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  browseButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginRight: 10,
  },
}); 