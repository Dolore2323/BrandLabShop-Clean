import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, IconButton, Snackbar, Dialog, DialogTitle, DialogActions, Button, TextField, InputAdornment } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { supabase } from '../supabaseClient';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SearchIcon from '@mui/icons-material/Search';
import ExportCSVButton from '../components/ExportCSVButton';
import { useTranslation } from 'react-i18next';

const columnsBase = [
  { field: 'id', headerName: 'ID', flex: 1 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1.5 },
];

export default function Clients() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState('');
  const [contactClient, setContactClient] = useState(null);

  const columns = [
    ...columnsBase,
    {
      field: 'actions',
      headerName: t('actions'),
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => setContactClient(params.row)}><MailOutlineIcon /></IconButton>
      ),
    },
  ];

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('clients').select('id, name, email');
    if (error) {
      setError(error.message);
      setRows([]);
    } else {
      setRows(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filtering and searching
  const filteredRows = rows.filter(row =>
    (!search || row.name.toLowerCase().includes(search.toLowerCase()) || row.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>{t('clients')}</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          placeholder={t('search') + '...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        />
        <ExportCSVButton data={filteredRows} filename="clients.csv" />
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
      <Dialog open={!!contactClient} onClose={() => setContactClient(null)}>
        <DialogTitle>{t('contact')} {contactClient?.name}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setContactClient(null)}>{t('cancel')}</Button>
          <Button disabled variant="contained">{t('send')}</Button>
        </DialogActions>
        <Box p={2} color="text.secondary">{t('chatOrEmailStub')}</Box>
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