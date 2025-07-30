import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InventoryIcon from '@mui/icons-material/Inventory2';
import { useTranslation } from 'react-i18next';

const data = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4780 },
  { name: 'May', sales: 5890 },
  { name: 'Jun', sales: 6390 },
];

const popularProducts = [
  { name: 'Product A', sales: 120 },
  { name: 'Product B', sales: 90 },
  { name: 'Product C', sales: 70 },
];
const stockOverview = [
  { name: 'Product A', stock: 15 },
  { name: 'Product B', stock: 8 },
  { name: 'Product C', stock: 2 },
];

export default function Dashboard() {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>{t('dashboard')}</Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">{t('sales')}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>₪32,000</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">{t('orders')}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>1,200</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">{t('users')}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>3,500</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}><TrendingUpIcon sx={{ mr: 1 }} />{t('popularProducts')}</Typography>
            {popularProducts.map((p) => (
              <Box key={p.name} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>{p.name}</Typography>
                <Typography color="primary" fontWeight={600}>{p.sales} {t('sales')}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}><InventoryIcon sx={{ mr: 1 }} />{t('stockOverview')}</Typography>
            {stockOverview.map((p) => (
              <Box key={p.name} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>{p.name}</Typography>
                <Typography color={p.stock < 5 ? 'error' : 'text.primary'} fontWeight={600}>{p.stock}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
      <Paper elevation={2} sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>{t('sales')} {t('overview')}</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#1976d2" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
} 