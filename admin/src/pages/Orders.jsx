import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, IconButton, Snackbar, Dialog, DialogTitle, DialogActions, Button, TextField, MenuItem, InputAdornment, DialogContent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { supabase } from '../supabaseClient';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ExportCSVButton from '../components/ExportCSVButton';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';

const statusOptions = ['Pending', 'Paid', 'Refunded'];

const columnsBase = [
  { field: 'id', headerName: 'Order ID', flex: 1 },
  { field: 'customer', headerName: 'Customer', flex: 1 },
  { field: 'date', headerName: 'Date', flex: 1 },
  { field: 'total', headerName: 'Total', flex: 1, type: 'number', valueFormatter: ({ value }) => `$${value}` },
  { field: 'status', headerName: 'Status', flex: 1 },
  { field: 'payment', headerName: 'Payment (Stripe)', flex: 1, renderCell: () => 'Paid (mock)' },
  { field: 'delivery', headerName: 'Delivery Cost', flex: 1, renderCell: () => '$10.00 (mock)' },
];

export default function Orders() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [detailsOrder, setDetailsOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const columns = [
    ...columnsBase,
    {
      field: 'actions',
      headerName: t('actions'),
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => setDetailsOrder(params.row)}><InfoIcon /></IconButton>
          <IconButton color="error" onClick={() => setDeleteId(params.row.id)}><DeleteIcon /></IconButton>
        </>
      ),
    },
  ];

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('orders')
      .select('id, total, status, created_at, users(name)');
    if (error) {
      setError(error.message);
      setRows([]);
    } else {
      setRows(
        data.map((row) => ({
          id: row.id,
          customer: row.users ? row.users.name : '',
          date: row.created_at ? row.created_at.split('T')[0] : '',
          total: row.total,
          status: row.status,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async () => {
    const { error } = await supabase.from('orders').delete().eq('id', deleteId);
    if (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } else {
      setSnackbar({ open: true, message: t('orderDeleted'), severity: 'success' });
      setDeleteId(null);
      fetchOrders();
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdating(true);
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } else {
      setSnackbar({ open: true, message: t('save'), severity: 'success' });
      setDetailsOrder((prev) => prev ? { ...prev, status: newStatus } : prev);
      fetchOrders();
    }
    setStatusUpdating(false);
  };

  // Filtering and searching
  const filteredRows = rows.filter(row =>
    (!statusFilter || row.status === statusFilter) &&
    (!search || row.customer.toLowerCase().includes(search.toLowerCase()) || row.id.toString().includes(search))
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>{t('orders')}</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          placeholder={t('searchByCustomerOrOrderId')}
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
        <ExportCSVButton data={filteredRows} filename="orders.csv" />
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>{t('deleteOrder')}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>{t('cancel')}</Button>
          <Button color="error" onClick={handleDeleteOrder}>{t('delete')}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!detailsOrder} onClose={() => setDetailsOrder(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('orderDetails')}</DialogTitle>
        <DialogContent>
          {detailsOrder && (
            <Box>
              <Typography><b>{t('orderStatus')}:</b> </Typography>
              <TextField
                select
                value={detailsOrder.status}
                onChange={e => handleStatusChange(detailsOrder.id, e.target.value)}
                disabled={statusUpdating}
                sx={{ mb: 2, minWidth: 180 }}
              >
                {statusOptions.map(status => (
                  <MenuItem key={status} value={status}>{t(status.toLowerCase())}</MenuItem>
                ))}
              </TextField>
              <Typography><b>{t('orderDetails')}:</b></Typography>
              <pre style={{ background: '#f5f6fa', padding: 12, borderRadius: 8, fontSize: 14 }}>
                {JSON.stringify(detailsOrder, null, 2)}
              </pre>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOrder(null)}>{t('cancel')}</Button>
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