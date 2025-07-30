import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  FlatList,
  Alert,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { productService, Product, Category } from '@/services/ProductService';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Расширяем тип Product для поддержки originalPrice
interface ExtendedProduct extends Product {
  originalPrice?: number;
}

type SnackbarProps = {
  visible: boolean;
  message: string;
  onHide: () => void;
};

function Snackbar({ visible, message, onHide }: SnackbarProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onHide, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible]);
  if (!visible) return null;
  return (
    <Animated.View style={[styles.snackbar, { transform: [{ translateY: visible ? 0 : 100 }] }]}>
      <Text style={styles.snackbarText}>{message}</Text>
    </Animated.View>
  );
}

export default function CatalogScreen() {
  const { t, isRTL } = useLanguage();
  const { addToCart, getCartCount } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'popularity'>('popularity');
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ExtendedProduct | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      productService.getProducts(selectedCategory),
      productService.getCategories(),
    ])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData && productsData.length > 0 ? productsData : productService.getMockProducts());
        setCategories(categoriesData && categoriesData.length > 0 ? categoriesData : productService.getMockCategories());
      })
      .catch((err) => {
        setError('Ошибка загрузки данных');
      })
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  // Улучшенная фильтрация и сортировка
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
          return (b.rating * b.price) - (a.rating * a.price);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleAddToCart = (product: ExtendedProduct) => {
    if (product.colors && product.colors.length > 1) {
      Alert.alert(
        'בחר צבע',
        'אנא בחר צבע למוצר:',
        product.colors.map(color => ({
          text: color,
          onPress: () => {
            if (product.sizes && product.sizes.length > 1) {
              Alert.alert(
                'בחר מידה',
                'אנא בחר מידה:',
                product.sizes.map(size => ({
                  text: size,
                  onPress: () => {
                    addToCart({
                      ...product,
                      color: color,
                      size: size,
                    });
                    setSnackbarMsg('✅ Товар добавлен в корзину');
                    setSnackbarVisible(true);
                  },
                }))
              );
            } else {
              addToCart({
                ...product,
                color: color,
              });
              setSnackbarMsg('✅ Товар добавлен в корзину');
              setSnackbarVisible(true);
            }
          },
        }))
      );
    } else if (product.sizes && product.sizes.length > 1) {
      Alert.alert(
        'בחר מידה',
        'אנא בחר מידה:',
        product.sizes.map(size => ({
          text: size,
          onPress: () => {
            addToCart({
              ...product,
              size: size,
            });
            setSnackbarMsg('✅ Товар добавлен в корзину');
            setSnackbarVisible(true);
          },
        }))
      );
    } else {
      addToCart(product);
      setSnackbarMsg('✅ Товар добавлен в корзину');
      setSnackbarVisible(true);
    }
  };

  const openProductModal = (product: ExtendedProduct) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const renderProduct = ({ item, index }: { item: ExtendedProduct; index: number }) => (
    <TouchableOpacity 
      style={styles.productCard} 
      onPress={() => openProductModal(item)}
      activeOpacity={0.9}
    >
      <View style={styles.productImageContainer}>
        {item.image_url ? (
          <Image 
            source={{ uri: item.image_url }} 
            style={styles.productImage} 
            resizeMode="cover" 
          />
        ) : (
          <View style={styles.placeholderImage}>
            <IconSymbol name="photo" size={40} color="#ccc" />
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageOverlay}
        />
        <View style={styles.productBadge}>
          <Text style={styles.badgeText}>🔥</Text>
        </View>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productDescription} numberOfLines={1}>
          {item.description}
        </Text>
        <View style={styles.productMeta}>
          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewsText}>({Math.floor(Math.random() * 100) + 10})</Text>
          </View>
          <Text style={styles.productCategory}>{item.category}</Text>
        </View>
        <View style={styles.productFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>₪{item.price}</Text>
            {item.originalPrice && item.originalPrice > item.price && (
              <Text style={styles.originalPrice}>₪{item.originalPrice}</Text>
            )}
          </View>
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={() => handleAddToCart(item)}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.addToCartGradient}
            >
              <IconSymbol name="plus" size={16} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.categoryButtonActive,
      ]}
      onPress={() => setSelectedCategory(item.id)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={
          selectedCategory === item.id
            ? ['#667eea', '#764ba2']
            : ['#ffffff', '#f8f9fa']
        }
        style={styles.categoryGradient}
      >
        <IconSymbol
          name={item.icon as any}
          size={24}
          color={selectedCategory === item.id ? 'white' : '#667eea'}
        />
        <Text
          style={[
            styles.categoryText,
            selectedCategory === item.id && styles.categoryTextActive,
          ]}
        >
          {item.name}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Премиум Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>🛍️ Каталог</Text>
          <Text style={styles.headerSubtitle}>Найди свой стиль</Text>
        </View>
        <TouchableOpacity style={styles.cartIconContainer} onPress={() => router.push('/(tabs)/Cart')}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.cartGradient}>
            <IconSymbol name="cart" size={24} color="white" />
            {getCartCount() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getCartCount()}</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Улучшенный Search Bar */}
      <View style={styles.searchContainer}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.searchGradient}
        >
          <View style={styles.searchInputContainer}>
            <IconSymbol name="magnifyingglass" size={20} color="#667eea" />
            <TextInput
              style={styles.searchInput}
              placeholder="🔍 Поиск товаров..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <IconSymbol name="xmark.circle.fill" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>

      {/* Сортировка */}
      <View style={styles.sortContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: 'popularity', label: '🔥 Популярные' },
            { key: 'price', label: '💰 По цене' },
            { key: 'rating', label: '⭐ По рейтингу' },
            { key: 'name', label: '📝 По названию' },
          ].map((sort) => (
            <TouchableOpacity
              key={sort.key}
              style={[
                styles.sortButton,
                sortBy === sort.key && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy(sort.key as any)}
            >
              <Text style={[
                styles.sortText,
                sortBy === sort.key && styles.sortTextActive,
              ]}>
                {sort.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Категории */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Товары */}
      <View style={styles.productsContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>🔄 Загрузка товаров...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={item => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
            columnWrapperStyle={styles.productRow}
          />
        )}
      </View>

      <Snackbar visible={snackbarVisible} message={snackbarMsg} onHide={() => setSnackbarVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  cartIconContainer: {
    position: 'relative',
  },
  cartGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: 'white',
  },
  searchGradient: {
    borderRadius: 16,
    padding: 4,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  sortContainer: {
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  sortButtonActive: {
    backgroundColor: '#667eea',
  },
  sortText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  sortTextActive: {
    color: 'white',
  },
  categoriesContainer: {
    marginBottom: 16,
    backgroundColor: 'white',
    paddingVertical: 16,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryButtonActive: {
    elevation: 6,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  categoryGradient: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    minWidth: 100,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  categoryTextActive: {
    color: 'white',
  },
  productsContainer: {
    flex: 1,
  },
  productsList: {
    padding: 16,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - 48) / 2,
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  productImageContainer: {
    height: 160,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  productBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
  productDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    lineHeight: 16,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    fontWeight: '600',
  },
  reviewsText: {
    fontSize: 11,
    color: '#999',
    marginLeft: 4,
  },
  productCategory: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  addToCartButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addToCartGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
  },
  snackbar: {
    position: 'absolute',
    bottom: 32,
    left: 24,
    right: 24,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
  },
  snackbarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 