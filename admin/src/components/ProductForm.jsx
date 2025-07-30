import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from '@mui/material';
import CloudinaryUpload from './CloudinaryUpload';

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
];

export default function ProductForm({ open, initialValues = {}, categories = [], onSubmit, onCancel }) {
  const [values, setValues] = useState({
    name_en: initialValues.name_en || '',
    name_he: initialValues.name_he || '',
    price: initialValues.price || '',
    stock: initialValues.stock || '',
    status: initialValues.status || 'Active',
    category_id: initialValues.category_id || '',
    image_url: initialValues.image_url || '',
    sizes: initialValues.sizes ? initialValues.sizes.join(', ') : '',
    colors: initialValues.colors ? initialValues.colors.join(', ') : '',
    description: initialValues.description || '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!values.name_en) errs.name_en = 'Required';
    if (!values.name_he) errs.name_he = 'Required';
    if (!values.price) errs.price = 'Required';
    if (!values.stock) errs.stock = 'Required';
    if (!values.category_id) errs.category_id = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (url) => {
    setValues((v) => ({ ...v, image_url: url }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...values,
        sizes: values.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: values.colors.split(',').map(c => c.trim()).filter(Boolean),
      });
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{initialValues.id ? 'Edit Product' : 'Add Product'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="Name (EN)"
              name="name_en"
              value={values.name_en}
              onChange={handleChange}
              error={!!errors.name_en}
              helperText={errors.name_en}
              fullWidth
            />
            <TextField
              label="Name (HE)"
              name="name_he"
              value={values.name_he}
              onChange={handleChange}
              error={!!errors.name_he}
              helperText={errors.name_he}
              fullWidth
            />
          </Box>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="Price"
              name="price"
              type="number"
              value={values.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
              fullWidth
              InputProps={{ endAdornment: <span style={{ marginLeft: 4 }}>₪</span> }}
            />
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={values.stock}
              onChange={handleChange}
              error={!!errors.stock}
              helperText={errors.stock}
              fullWidth
            />
          </Box>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              select
              label="Status"
              name="status"
              value={values.status}
              onChange={handleChange}
              fullWidth
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Category"
              name="category_id"
              value={values.category_id}
              onChange={handleChange}
              error={!!errors.category_id}
              helperText={errors.category_id}
              fullWidth
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name_en}</MenuItem>
              ))}
            </TextField>
          </Box>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="Sizes (comma separated)"
              name="sizes"
              value={values.sizes}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Colors (comma separated)"
              name="colors"
              value={values.colors}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          <TextField
            label="Description"
            name="description"
            value={values.description}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={2}
            maxRows={6}
            sx={{ mb: 2 }}
          />
          <CloudinaryUpload onUpload={handleImageUpload} initialUrl={values.image_url} />
          {initialValues.statistics && (
            <Box mt={2} p={2} bgcolor="#f5f6fa" borderRadius={2}>
              <strong>Statistics:</strong>
              <pre style={{ fontSize: 13, margin: 0 }}>{JSON.stringify(initialValues.statistics, null, 2)}</pre>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained">{initialValues.id ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 