import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Button, Snackbar, IconButton, Dialog, DialogTitle, DialogActions, TextField, MenuItem, InputAdornment, DialogContent, Select, MenuItem as MuiMenuItem, InputLabel, FormControl } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { supabase } from '../supabaseClient';
import ProductForm from '../components/ProductForm';
import ExportCSVButton from '../components/ExportCSVButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import Papa from 'papaparse';

const columnsBase = [
  { field: 'name_en', headerName: 'Name', flex: 1 },
  { field: 'category', headerName: 'Category', flex: 1 },
  { field: 'price', headerName: 'Price', flex: 0.7, type: 'number', valueFormatter: ({ value }) => `₪${value}` },
  { field: 'stock', headerName: 'Stock', flex: 0.7, type: 'number' },
  { field: 'status', headerName: 'Status', flex: 0.7 },
  { field: 'sizes', headerName: 'Sizes', flex: 1, valueGetter: ({ row }) => (row.sizes ? row.sizes.join(', ') : '') },
  { field: 'colors', headerName: 'Colors', flex: 1, valueGetter: ({ row }) => (row.colors ? row.colors.join(', ') : '') },
];

const SUPPORTED_SOURCES = [
  { value: 'aliexpress', label: 'AliExpress' },
  { value: 'yoox', label: 'Yoox' },
  { value: 'farfetch', label: 'Farfetch' },
  { value: 'shein', label: 'Shein' },
  { value: 'amazon', label: 'Amazon' },
  { value: 'ebay', label: 'eBay' },
];

function ImportDialog({ open, onClose, onImport }) {
  const [source, setSource] = useState('aliexpress');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    if (source === 'aliexpress') {
      // Пример для AliExpress через RapidAPI
      try {
        const res = await fetch('https://ali-express1.p.rapidapi.com/search', {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': 'ВАШ_КЛЮЧ',
            'X-RapidAPI-Host': 'ali-express1.p.rapidapi.com',
          },
        });
        const data = await res.json();
        // Преобразовать и импортировать товары
        if (data && data.docs && data.docs.length) {
          for (const item of data.docs.slice(0, 5)) { // импортировать только 5 для MVP
            await onImport({
              name_en: item.product_title,
              name_he: item.product_title,
              price: item.app_sale_price || 0,
              stock: 10,
              status: 'Active',
              category_id: null,
              image_url: item.product_main_image_url,
            });
          }
        }
        alert('Импорт завершён!');
      } catch (e) {
        alert('Ошибка импорта: ' + e.message);
      }
    } else {
      alert('Импорт из этого магазина пока не реализован.');
    }
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Импортировать товары из магазина</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Магазин</InputLabel>
          <Select value={source} label="Магазин" onChange={e => setSource(e.target.value)}>
            {SUPPORTED_SOURCES.map(s => <MuiMenuItem key={s.value} value={s.value}>{s.label}</MuiMenuItem>)}
          </Select>
        </FormControl>
        <TextField
          label={source === 'aliexpress' ? 'Поисковый запрос' : 'Ссылка или запрос'}
          value={query}
          onChange={e => setQuery(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleImport} variant="contained" disabled={loading || !query}>{loading ? 'Импорт...' : 'Импортировать'}</Button>
      </DialogActions>
    </Dialog>
  );
}

function FileImportDialog({ open, onClose, onImport }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = () => {
    if (!file) return;
    setLoading(true);
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        for (const row of results.data) {
          if (row.name_en && row.price) {
            await onImport({
              name_en: row.name_en,
              name_he: row.name_he || row.name_en,
              price: Number(row.price),
              stock: Number(row.stock) || 10,
              status: row.status || 'Active',
              category_id: null,
              image_url: row.image_url || '',
            });
          }
        }
        setLoading(false);
        onClose();
        alert('Импорт завершён!');
      },
      error: () => {
        setLoading(false);
        alert('Ошибка чтения файла');
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Импортировать товары из файла</DialogTitle>
      <DialogContent>
        <a href="/template_products.csv" download style={{ display: 'block', marginBottom: 12 }}>Скачать шаблон CSV</a>
        <input type="file" accept=".csv,.xlsx" onChange={handleFileChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleImport} variant="contained" disabled={loading || !file}>{loading ? 'Импорт...' : 'Импортировать'}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Inventory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  const [fileImportOpen, setFileImportOpen] = useState(false);

  const columns = [
    ...columnsBase,
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.7,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}><EditIcon /></IconButton>
          <IconButton color="error" onClick={() => setDeleteId(params.row.id)}><DeleteIcon /></IconButton>
        </>
      ),
    },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('products')
      .select('id, name_en, name_he, price, stock, status, category_id, image_url, sizes, colors, description, statistics, categories(name_en)');
    if (error) {
      setError(error.message);
      setRows([]);
    } else {
      setRows(
        data.map((row) => ({
          id: row.id,
          name_en: row.name_en,
          name_he: row.name_he,
          price: row.price,
          stock: row.stock,
          status: row.status,
          category: row.categories ? row.categories.name_en : '',
          category_id: row.category_id,
          image_url: row.image_url,
          sizes: row.sizes || [],
          colors: row.colors || [],
          description: row.description || '',
          statistics: row.statistics || null,
        }))
      );
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name_en');
    setCategories(data || []);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleAddProduct = async (values) => {
    const { error } = await supabase.from('products').insert([
      {
        name_en: values.name_en,
        name_he: values.name_he,
        price: Number(values.price),
        stock: Number(values.stock),
        status: values.status,
        category_id: Number(values.category_id),
        image_url: values.image_url,
        sizes: values.sizes,
        colors: values.colors,
        description: values.description,
      },
    ]);
    if (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } else {
      setSnackbar({ open: true, message: 'Product added!', severity: 'success' });
      setOpenForm(false);
      fetchProducts();
    }
  };

  const handleEdit = (row) => {
    setEditProduct(row);
    setOpenForm(true);
  };

  const handleEditProduct = async (values) => {
    const { error } = await supabase.from('products').update({
      name_en: values.name_en,
      name_he: values.name_he,
      price: Number(values.price),
      stock: Number(values.stock),
      status: values.status,
      category_id: Number(values.category_id),
      image_url: values.image_url,
      sizes: values.sizes,
      colors: values.colors,
      description: values.description,
    }).eq('id', values.id);
    if (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } else {
      setSnackbar({ open: true, message: 'Product updated!', severity: 'success' });
      setOpenForm(false);
      setEditProduct(null);
      fetchProducts();
    }
  };

  const handleDeleteProduct = async () => {
    const { error } = await supabase.from('products').delete().eq('id', deleteId);
    if (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } else {
      setSnackbar({ open: true, message: 'Product deleted!', severity: 'success' });
      setDeleteId(null);
      fetchProducts();
    }
  };

  // Filtering and searching
  const filteredRows = rows.filter(row =>
    (!categoryFilter || row.category_id === categoryFilter) &&
    (!search || row.name_en.toLowerCase().includes(search.toLowerCase()) || row.name_he.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Inventory</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" onClick={() => { setOpenForm(true); setEditProduct(null); }}>
          Add Product
        </Button>
        <Button variant="outlined" onClick={() => setImportOpen(true)}>
          Импортировать из магазина
        </Button>
        <Button variant="outlined" onClick={() => setFileImportOpen(true)}>
          Импортировать из файла (CSV/XLSX)
        </Button>
        <TextField
          placeholder="Search by name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        />
        <TextField
          select
          label="Category"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All</MenuItem>
          {categories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name_en}</MenuItem>)}
        </TextField>
        <ExportCSVButton data={filteredRows} filename="products.csv" />
      </Box>
      <ProductForm
        open={openForm}
        initialValues={editProduct}
        categories={categories}
        onSubmit={editProduct ? handleEditProduct : handleAddProduct}
        onCancel={() => { setOpenForm(false); setEditProduct(null); }}
      />
      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} onImport={async (product) => {
        await supabase.from('products').insert([product]);
        fetchProducts();
      }} />
      <FileImportDialog open={fileImportOpen} onClose={() => setFileImportOpen(false)} onImport={async (product) => {
        await supabase.from('products').insert([product]);
        fetchProducts();
      }} />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete this product?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteProduct}>Delete</Button>
        </DialogActions>
      </Dialog>
      <Paper elevation={2} sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              sx={{ border: 'none', fontSize: 16 }}
            />
          </div>
        )}
      </Paper>
    </Box>
  );
} 