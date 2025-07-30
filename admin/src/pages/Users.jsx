import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, IconButton, Snackbar, Dialog, DialogTitle, DialogActions, Button, TextField, MenuItem, InputAdornment } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { supabase } from '../supabaseClient';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ExportCSVButton from '../components/ExportCSVButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';

const statusOptions = ['Active', 'Blocked'];
const roleOptions = ['Admin', 'Manager', 'User'];

const columnsBase = [
  { field: 'id', headerName: 'User ID', flex: 1 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1.5 },
  { field: 'role', headerName: 'Role', flex: 1 },
  { field: 'status', headerName: 'Status', flex: 1 },
];

export default function Users() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const columns = [
    ...columnsBase,
    {
      field: 'actions',
      headerName: t('actions'),
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => { setEditUser(params.row); setOpenForm(true); }}><EditIcon /></IconButton>
          <IconButton color="error" onClick={() => setDeleteId(params.row.id)}><DeleteIcon /></IconButton>
        </>
      ),
    },
  ];

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, status');
    if (error) {
      setError(error.message);
      setRows([]);
    } else {
      setRows(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    const { error } = await supabase.from('users').delete().eq('id', deleteId);
    if (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } else {
      setSnackbar({ open: true, message: t('delete'), severity: 'success' });
      setDeleteId(null);
      fetchUsers();
    }
  };

  const handleAddUser = async (values) => {
    const { error } = await supabase.from('users').insert([
      { name: values.name, email: values.email, role: values.role, status: values.status },
    ]);
    if (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } else {
      setSnackbar({ open: true, message: t('add'), severity: 'success' });
      setOpenForm(false);
      fetchUsers();
    }
  };
  const handleEditUser = async (values) => {
    const { error } = await supabase.from('users').update({
      name: values.name,
      email: values.email,
      role: values.role,
      status: values.status,
    }).eq('id', values.id);
    if (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } else {
      setSnackbar({ open: true, message: t('save'), severity: 'success' });
      setOpenForm(false);
      setEditUser(null);
      fetchUsers();
    }
  };

  // Filtering and searching
  const filteredRows = rows.filter(row =>
    (!statusFilter || row.status === statusFilter) &&
    (!search || row.name.toLowerCase().includes(search.toLowerCase()) || row.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>{t('users')}</Typography>
      <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={() => { setOpenForm(true); setEditUser(null); }}>{t('add')}</Button>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          placeholder={t('search') + '...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        />
        <TextField
          select
          label={t('status')}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">{t('all')}</MenuItem>
          {statusOptions.map(status => <MenuItem key={status} value={status}>{t(status.toLowerCase())}</MenuItem>)}
        </TextField>
        <ExportCSVButton data={filteredRows} filename="users.csv" />
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>{t('delete')}?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>{t('cancel')}</Button>
          <Button color="error" onClick={handleDeleteUser}>{t('delete')}</Button>
        </DialogActions>
      </Dialog>
      <UserForm
        open={openForm}
        initialValues={editUser}
        onSubmit={editUser ? handleEditUser : handleAddUser}
        onCancel={() => { setOpenForm(false); setEditUser(null); }}
      />
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

function UserForm({ open, initialValues = {}, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const [values, setValues] = useState({
    name: initialValues.name || '',
    email: initialValues.email || '',
    role: initialValues.role || roleOptions[2],
    status: initialValues.status || statusOptions[0],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues({
      name: initialValues.name || '',
      email: initialValues.email || '',
      role: initialValues.role || roleOptions[2],
      status: initialValues.status || statusOptions[0],
    });
  }, [initialValues]);

  const validate = () => {
    const errs = {};
    if (!values.name) errs.name = t('required');
    if (!values.email) errs.email = t('required');
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
      <DialogTitle>{initialValues.id ? t('edit') : t('add') + ' ' + t('users')}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label={t('name')}
            name="name"
            value={values.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label={t('email')}
            name="email"
            value={values.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label={t('role')}
            name="role"
            value={values.role}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          >
            {roleOptions.map(role => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label={t('status')}
            name="status"
            value={values.status}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          >
            {statusOptions.map(status => (
              <MenuItem key={status} value={status}>{t(status.toLowerCase())}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>{t('cancel')}</Button>
          <Button type="submit" variant="contained">{initialValues.id ? t('save') : t('add')}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 