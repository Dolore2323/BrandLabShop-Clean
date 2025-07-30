import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Toolbar, Box, IconButton, Typography, Avatar, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 220;

export default function SideMenu({ navItems, t, isHebrew, location, mobileOpen, onDrawerToggle, user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f8f9fa' }}>
      <Toolbar sx={{ justifyContent: 'center', alignItems: 'center', minHeight: 80 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Avatar sx={{ bgcolor: '#667eea', width: 56, height: 56, mb: 1 }}>{user?.email?.[0]?.toUpperCase() || '?'}</Avatar>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>{user?.email}</Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={onDrawerToggle} sx={{ position: 'absolute', top: 12, right: isHebrew ? 'auto' : 12, left: isHebrew ? 12 : 'auto' }}>
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1, mt: 2 }}>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.label}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              bgcolor: location.pathname === item.path ? '#e3e7fd' : 'transparent',
              color: location.pathname === item.path ? '#222' : '#555',
              boxShadow: location.pathname === item.path ? '0 2px 8px #e3e7fd' : 'none',
              '&:hover': { bgcolor: '#f0f1f2' },
              transition: 'all 0.2s',
            }}
            onClick={isMobile ? onDrawerToggle : undefined}
          >
            <ListItemIcon sx={{ minWidth: 36, color: '#667eea' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={t(item.label)} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, textAlign: 'center', color: '#aaa', fontSize: 13 }}>
        BrandLab Admin © {new Date().getFullYear()}
      </Box>
    </Box>
  );

  return (
    <>
      {/* Permanent drawer for desktop, temporary for mobile */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={onDrawerToggle}
        anchor={isHebrew ? 'right' : 'left'}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          zIndex: (theme) => theme.zIndex.drawer,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#f8f9fa',
            borderRight: isHebrew ? 'none' : '1px solid #e0e0e0',
            borderLeft: isHebrew ? '1px solid #e0e0e0' : 'none',
            transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
} 