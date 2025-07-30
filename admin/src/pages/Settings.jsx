import React from 'react';
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, TextField } from '@mui/material';

export default function Settings() {
  const [lang, setLang] = React.useState('en');
  const [notifications, setNotifications] = React.useState(true);
  const [tax, setTax] = React.useState(17);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Settings</Typography>
      <Paper elevation={2} sx={{ p: 3, bgcolor: '#fff', borderRadius: 2, maxWidth: 500 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Language</InputLabel>
          <Select value={lang} label="Language" onChange={e => setLang(e.target.value)}>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="he">עברית</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          control={<Switch checked={notifications} onChange={e => setNotifications(e.target.checked)} />}
          label="Enable notifications"
          sx={{ mb: 3 }}
        />
        <TextField
          label="Default Tax Rate (%)"
          type="number"
          value={tax}
          onChange={e => setTax(e.target.value)}
          fullWidth
        />
      </Paper>
    </Box>
  );
} 