import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Button, Divider, IconButton, CircularProgress } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './pages/LoginPage';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import SideMenu from './components/SideMenu';
import CategoryManagement from './pages/CategoryManagement';
import Clients from './pages/Clients';

function Dashboard() { const { t } = useTranslation(); return <Typography variant="h4">{t('dashboard')}</Typography>; }
function Inventory() { const { t } = useTranslation(); return <Typography variant="h4">{t('inventory')}</Typography>; }
function Orders() { const { t } = useTranslation(); return <Typography variant="h4">{t('orders')}</Typography>; }
function Users() { const { t } = useTranslation(); return <Typography variant="h4">{t('users')}</Typography>; }
function Settings() { const { t } = useTranslation(); return <Typography variant="h4">{t('settings')}</Typography>; }

const drawerWidth = 220;
const navItems = [
  { label: 'dashboard', icon: <DashboardIcon />, path: '/' },
  { label: 'inventory', icon: <InventoryIcon />, path: '/inventory' },
  { label: 'categories', icon: <InventoryIcon />, path: '/categories' },
  { label: 'orders', icon: <ShoppingCartIcon />, path: '/orders' },
  { label: 'users', icon: <PeopleIcon />, path: '/users' },
  { label: 'clients', icon: <PeopleIcon />, path: '/clients' },
  { label: 'settings', icon: <SettingsIcon />, path: '/settings' },
];

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const isHebrew = i18n.language === 'he';
  useEffect(() => { document.body.dir = isHebrew ? 'rtl' : 'ltr'; }, [isHebrew]);
  return (
    <Box>
      <Button color="inherit" onClick={() => i18n.changeLanguage('en')}>{t('switchToEnglish')}</Button>
      <Button color="inherit" onClick={() => i18n.changeLanguage('he')}>{t('switchToHebrew')}</Button>
    </Box>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminLayout() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f6fa', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#fff', color: '#222', boxShadow: '0 2px 8px #f0f1f2' }}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
            BrandLab Admin
          </Typography>
          <LanguageSwitcher />
          {user && (
            <>
              <Avatar sx={{ mx: 2, bgcolor: '#667eea' }}>{user.email?.[0]?.toUpperCase() || '?'}</Avatar>
              <Typography sx={{ mx: 1 }}>{user.email}</Typography>
              <IconButton color="inherit" onClick={logout}><LogoutIcon /></IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>
      <SideMenu
        navItems={navItems}
        t={t}
        isHebrew={isHebrew}
        location={location}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
        user={user}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          bgcolor: '#fff',
          minHeight: '100vh',
          boxShadow: '0 0 16px 0 #f0f1f2',
          borderRadius: 4,
          m: 3,
          mt: 10,
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/categories" element={<CategoryManagement />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/users" element={<Users />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={() => window.location.href = '/'} />} />
        <Route path="/*" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}
