import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { View, Text, Image, Button, ActivityIndicator, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCart } from '@/contexts/CartContext';
import { Product as ProductType } from '@/services/ProductService';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) setError(error.message);
      else setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.colors && product.colors.length > 1 && !selectedColor) {
      Alert.alert(
        'בחר צבע',
        'אנא בחר צבע למוצר:',
        product.colors.map(color => ({
          text: color,
          onPress: () => setSelectedColor(color),
        }))
      );
      return;
    }
    if (product.sizes && product.sizes.length > 1 && !selectedSize) {
      Alert.alert(
        'בחר מידה',
        'אנא בחר מידה:',
        product.sizes.map(size => ({
          text: size,
          onPress: () => setSelectedSize(size),
        }))
      );
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      category: product.category,
      color: selectedColor || (product.colors && product.colors.length === 1 ? product.colors[0] : undefined),
      size: selectedSize || (product.sizes && product.sizes.length === 1 ? product.sizes[0] : undefined),
    });
    setSnackbarMsg('Товар добавлен в корзину');
    setSnackbarVisible(true);
    setSelectedColor(null);
    setSelectedSize(null);
  };

  useEffect(() => {
    // If color or size was just selected, try to add to cart again
    if (selectedColor || selectedSize) {
      if (product) {
        if (
          (!product.colors || product.colors.length <= 1 || selectedColor) &&
          (!product.sizes || product.sizes.length <= 1 || selectedSize)
        ) {
          handleAddToCart();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor, selectedSize]);

  const handleBuyNow = () => {
    if (!product) return;
    if (product.colors && product.colors.length > 1 && !selectedColor) {
      Alert.alert(
        'בחר צבע',
        'אנא בחר צבע למוצר:',
        product.colors.map(color => ({
          text: color,
          onPress: () => setSelectedColor(color),
        }))
      );
      return;
    }
    if (product.sizes && product.sizes.length > 1 && !selectedSize) {
      Alert.alert(
        'בחר מידה',
        'אנא בחר מידה:',
        product.sizes.map(size => ({
          text: size,
          onPress: () => setSelectedSize(size),
        }))
      );
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      category: product.category,
      color: selectedColor || (product.colors && product.colors.length === 1 ? product.colors[0] : undefined),
      size: selectedSize || (product.sizes && product.sizes.length === 1 ? product.sizes[0] : undefined),
    });
    setSnackbarMsg('Товар добавлен в корзину');
    setSnackbarVisible(true);
    setSelectedColor(null);
    setSelectedSize(null);
    setTimeout(() => {
      router.push('/Checkout');
    }, 500);
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;
  if (error) return <Text style={{ color: 'red', margin: 16 }}>{error}</Text>;
  if (!product) return <Text style={{ margin: 16 }}>Товар не найден</Text>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {product.image_url ? (
        <Image source={{ uri: product.image_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}> 
          <Text>Нет фото</Text>
        </View>
      )}
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price} ₪</Text>
      <Text style={styles.desc}>{product.description || 'Нет описания'}</Text>
      {product.colors && product.colors.length > 0 && (
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontWeight: '600', marginBottom: 4 }}>Цвет:</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {product.colors.map(color => (
              <TouchableOpacity
                key={color}
                style={{
                  padding: 8,
                  borderRadius: 6,
                  backgroundColor: selectedColor === color ? '#667eea' : '#f0f0f0',
                  marginRight: 8,
                  marginBottom: 8,
                }}
                onPress={() => setSelectedColor(color)}
              >
                <Text style={{ color: selectedColor === color ? 'white' : '#333' }}>{color}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      {product.sizes && product.sizes.length > 0 && (
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontWeight: '600', marginBottom: 4 }}>Размер:</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {product.sizes.map(size => (
              <TouchableOpacity
                key={size}
                style={{
                  padding: 8,
                  borderRadius: 6,
                  backgroundColor: selectedSize === size ? '#667eea' : '#f0f0f0',
                  marginRight: 8,
                  marginBottom: 8,
                }}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={{ color: selectedSize === size ? 'white' : '#333' }}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartButtonText}>Добавить в корзину</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <Text style={styles.buyNowButtonText}>Купить сейчас</Text>
        </TouchableOpacity>
      </View>
      {snackbarVisible && (
        <View style={{
          position: 'absolute',
          bottom: 32,
          left: 24,
          right: 24,
          backgroundColor: '#333',
          borderRadius: 8,
          padding: 16,
          alignItems: 'center',
          zIndex: 100,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 8,
        }}>
          <Text style={{ color: 'white', fontSize: 16 }}>{snackbarMsg}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 260,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: '#0a7ea4',
    fontWeight: '600',
    marginBottom: 8,
  },
  desc: {
    fontSize: 16,
    color: '#444',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#34C759',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buyNowButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 