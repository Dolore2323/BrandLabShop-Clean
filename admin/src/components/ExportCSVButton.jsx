import React, { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { unparse } from 'papaparse';
import StoreIcon from '@mui/icons-material/Store';

const MARKETPLACES = [
  { value: 'csv', label: 'Обычный CSV', icon: null },
  { value: 'aliexpress', label: 'AliExpress', icon: <StoreIcon fontSize="small" /> },
  { value: 'farfetch', label: 'Farfetch', icon: <StoreIcon fontSize="small" /> },
  { value: 'yoox', label: 'YOOX', icon: <StoreIcon fontSize="small" /> },
];

function prepareDataForMarketplace(data, marketplace) {
  switch (marketplace) {
    case 'aliexpress':
      return data.map(row => ({
        id: row.id,
        name: row.name_en,
        description: row.name_he,
        price: row.price,
        stock: row.stock,
        image_url: row.image_url,
        category: row.category,
      }));
    case 'farfetch':
      return data.map(row => ({
        id: row.id,
        name: row.name_en,
        price: row.price,
        stock: row.stock,
        category: row.category,
      }));
    case 'yoox':
      return data.map(row => ({
        id: row.id,
        name: row.name_en,
        price: row.price,
        stock: row.stock,
        image_url: row.image_url,
      }));
    default:
      return data;
  }
}

export default function ExportCSVButton({ data, filename = 'export.csv', children }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleExport = (marketplace = 'csv') => {
    const exportData = prepareDataForMarketplace(data, marketplace);
    const exportFilename =
      marketplace === 'csv'
        ? filename
        : `${marketplace}_products.csv`;
    const csv = unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', exportFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={e => setAnchorEl(e.currentTarget)}
        sx={{ ml: 2 }}
      >
        {children || 'Export CSV'}
      </Button>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        {MARKETPLACES.map(mp => (
          <MenuItem key={mp.value} onClick={() => handleExport(mp.value)}>
            {mp.icon && <ListItemIcon>{mp.icon}</ListItemIcon>}
            <ListItemText>{mp.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
} 