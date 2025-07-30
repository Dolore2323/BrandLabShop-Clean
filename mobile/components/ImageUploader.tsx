import { useState } from 'react';
import { View, Button, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload';
const UPLOAD_PRESET = 'YOUR_UNSIGNED_PRESET';

export default function ImageUploader({ onUpload }: { onUpload: (url: string) => void }) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', { uri, name: 'photo.jpg', type: 'image/jpeg' } as any);
    formData.append('upload_preset', UPLOAD_PRESET);
    try {
      const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
      const data = await res.json();
      setImage(data.secure_url);
      onUpload(data.secure_url);
    } catch (e) {
      Alert.alert('Ошибка загрузки', 'Не удалось загрузить изображение');
    }
    setLoading(false);
  };

  return (
    <View style={{ alignItems: 'center', marginVertical: 12 }}>
      <Button title="Выбрать фото" onPress={pickImage} />
      {loading && <ActivityIndicator style={{ marginTop: 8 }} />}
      {image && <Image source={{ uri: image }} style={{ width: 120, height: 120, borderRadius: 8, marginTop: 8 }} />}
    </View>
  );
} 