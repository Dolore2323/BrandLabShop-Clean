import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '../../supabaseClient';

export default function CheckoutScreen() {
  const { t, isRTL } = useLanguage();
  const { getCartTotal } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Проверка заполнения обязательных полей
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (emptyFields.length > 0) {
      Alert.alert('שגיאה', 'אנא מלא את כל השדות הנדרשים');
      return;
    }

    setLoading(true);
    try {
      // Здесь можно добавить логику создания заказа в Supabase
      // const { error } = await supabase.from('orders').insert({
      //   customer_info: formData,
      //   status: 'pending',
      //   total: 0, // TODO: получить из корзины
      // });

      // eslint-disable-next-line react/no-unescaped-entities
      Alert.alert(
        'הזמנה הושלמה!',
        'תודה על הקנייה. ניצור איתך קשר בקרוב.',
        [
          {
            text: 'אישור',
            onPress: () => router.push('/(tabs)')
          }
        ]
      );
    } catch (error) {
      Alert.alert('שגיאה', 'לא ניתן היה להשלים את ההזמנה. נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>השלמת הזמנה</Text>
        <Text style={styles.subtitle}>מלא פרטים למשלוח</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>שם פרטי *</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(value) => handleInputChange('firstName', value)}
              placeholder="הכנס שם פרטי"
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>שם משפחה *</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(value) => handleInputChange('lastName', value)}
              placeholder="הכנס שם משפחה"
            />
          </View>
        </View>

        <Text style={styles.label}>אימייל *</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          placeholder="your@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>טלפון *</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          placeholder="+7 (999) 123-45-67"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>כתובת *</Text>
        <TextInput
          style={styles.input}
          value={formData.address}
          onChangeText={(value) => handleInputChange('address', value)}
          placeholder="רחוב, בית, דירה"
          multiline
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>עיר *</Text>
            <TextInput
              style={styles.input}
              value={formData.city}
              onChangeText={(value) => handleInputChange('city', value)}
              placeholder="תל אביב"
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>מיקוד</Text>
            <TextInput
              style={styles.input}
              value={formData.zipCode}
              onChangeText={(value) => handleInputChange('zipCode', value)}
              placeholder="123456"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>סה"כ לתשלום:</Text>
        <Text style={styles.totalPrice}>₪{getCartTotal().toFixed(2)}</Text>
        <Text style={styles.summaryNote}>* המחיר עשוי להשתנות באישור ההזמנה</Text>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'מעבד...' : 'השלם הזמנה'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  summary: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  summaryNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
}); 