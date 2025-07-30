import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Button, Snackbar, IconButton, Dialog, DialogTitle, DialogActions, TextField, MenuItem, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, InputLabel, FormControl } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { supabase } from '../supabaseClient';

const iconOptions = [
  'category', 'star', 'favorite', 'local_offer', 'shopping_bag', 'style', 'label', 'loyalty', 'whatshot', 'new_releases',
];

export default function CategoryManagement() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('categories').select('id, name_en, name_he, icon');
    if (error) {
      setError(error.message);
      setRows([]);
    } else {
      setRows(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (values) => {
    const { error } = await supabase.from('categories').insert([
      { name_en: values.name_en, name_he: values.name_he, icon: values.icon },
    ]);
    if (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } else {
      setSnackbar({ open: true, message: 'Category added!', severity: 'success' });
      setOpenForm(false);
      fetchCategories();
    }
  };

  const handleEdit = (row) => {
    setEditCategory(row);
    setOpenForm(true);
  };

  const handleEditCategory = async (values) => {
    const { error } = await supabase.from('categories').update({
      name_en: values.name_en,
      name_he: values.name_he,
      icon: values.icon,
    }).eq('id', values.id);
    if (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } else {
      setSnackbar({ open: true, message: 'Category updated!', severity: 'success' });
      setOpenForm(false);
      setEditCategory(null);
      fetchCategories();
    }
  };

  const handleDeleteCategory = async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } else {
      setSnackbar({ open: true, message: 'Category deleted!', severity: 'success' });
      fetchCategories();
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Categories</Typography>
      <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={() => { setOpenForm(true); setEditCategory(null); }}>
        Add Category
      </Button>
      <Paper elevation={2} sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name (EN)</TableCell>
                  <TableCell>Name (HE)</TableCell>
                  <TableCell>Icon</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name_en}</TableCell>
                    <TableCell>{row.name_he}</TableCell>
                    <TableCell>{row.icon}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleEdit(row)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDeleteCategory(row.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      <CategoryForm
        open={openForm}
        initialValues={editCategory}
        onSubmit={editCategory ? handleEditCategory : handleAddCategory}
        onCancel={() => { setOpenForm(false); setEditCategory(null); }}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Box>
  );
}

function CategoryForm({ open, initialValues = {}, onSubmit, onCancel }) {
  const [values, setValues] = useState({
    name_en: initialValues.name_en || '',
    name_he: initialValues.name_he || '',
    icon: initialValues.icon || iconOptions[0],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues({
      name_en: initialValues.name_en || '',
      name_he: initialValues.name_he || '',
      icon: initialValues.icon || iconOptions[0],
    });
  }, [initialValues]);

  const validate = () => {
    const errs = {};
    if (!values.name_en) errs.name_en = 'Required';
    if (!values.name_he) errs.name_he = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ ...values, id: initialValues.id });
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{initialValues.id ? 'Edit Category' : 'Add Category'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Name (EN)"
            name="name_en"
            value={values.name_en}
            onChange={handleChange}
            error={!!errors.name_en}
            helperText={errors.name_en}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Name (HE)"
            name="name_he"
            value={values.name_he}
            onChange={handleChange}
            error={!!errors.name_he}
            helperText={errors.name_he}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Icon</InputLabel>
            <Select
              label="Icon"
              name="icon"
              value={values.icon}
              onChange={handleChange}
            >
              {iconOptions.map((icon) => (
                <MenuItem key={icon} value={icon}>{icon}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained">{initialValues.id ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 