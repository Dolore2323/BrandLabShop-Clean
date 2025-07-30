import React, { useRef, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload';
const UPLOAD_PRESET = 'YOUR_UNSIGNED_PRESET';

export default function CloudinaryUpload({ onUpload, initialUrl }) {
  const fileInput = useRef();
  const [image, setImage] = useState(initialUrl || '');
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
    const data = await res.json();
    setImage(data.secure_url);
    setLoading(false);
    if (onUpload) onUpload(data.secure_url);
  };

  return (
    <Box>
      <Button variant="outlined" component="label" disabled={loading} sx={{ mb: 1 }}>
        {loading ? 'Uploading...' : 'Upload Image'}
        <input type="file" hidden accept="image/*" ref={fileInput} onChange={handleFileChange} />
      </Button>
      {image && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption">Preview:</Typography>
          <img src={image} alt="preview" style={{ maxWidth: 180, maxHeight: 120, borderRadius: 8, marginTop: 4 }} />
        </Box>
      )}
    </Box>
  );
} 