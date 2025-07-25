import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useScrollTrigger,
  Slide,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { Menu as MenuIcon, AccountCircle } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/solvo-logo.png';

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isTransparent, setIsTransparent] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
      // Optionally decode token to get username
      const user = localStorage.getItem('username');
      if (user) setUsername(user);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    handleProfileMenuClose();
    navigate('/login');
  };

  const navItems = [
    { title: 'Home', path: '/' },
    { title: 'Destinations', path: '/destinations' },
    { title: 'Safaris', path: '/safaris' },
    { title: 'Accommodations', path: '/accommodations' },
    { title: 'About', path: '/about' },
    { title: 'Contact', path: '/contact' },
  ];

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        elevation={isTransparent ? 0 : 4}
        sx={{
          backgroundColor: isTransparent ? 'transparent' : 'primary.main',
          color: isTransparent ? 'white' : 'white',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo and Company Name */}
            <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', mr: 4 }}>
              <img src={logo} alt="Firebird Safaris Logo" style={{ height: 36, marginRight: 10, maxWidth: '90vw' }} />
              <Typography
                variant="h6"
                sx={{
                  color: isTransparent ? 'white' : 'white',
                  fontWeight: 700,
                  letterSpacing: 1,
                  fontSize: { xs: '1.1rem', sm: '1.5rem' },
                  textShadow: isTransparent ? '0 1px 8px rgba(0,0,0,0.25)' : 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: { xs: '60vw', sm: 'none' },
                }}
              >
                SOLVO TOURS AND SAFARIS
              </Typography>
            </Box>

            {/* Mobile Menu Icon */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ 
                display: { md: 'none' },
                color: isTransparent ? 'white' : 'primary.main'
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Desktop Menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 'auto' }}>
              {navItems.map((item) => (
                <Button
                  key={item.title}
                  component={Link}
                  to={item.path}
                  sx={{
                    mx: 1,
                    color: isTransparent ? 'white' : 'text.primary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  {item.title}
                </Button>
              ))}
              {!isLoggedIn && (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/login"
                    sx={{ ml: 2, display: 'flex', alignItems: 'center' }}
                    startIcon={<AccountCircle />}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ ml: 2 }}
                    component={Link}
                    to="/signup"
                  >
                    Sign Up
                  </Button>
                </>
              )}
              {isLoggedIn && (
                <>
                  <IconButton color="inherit" onClick={handleProfileMenuOpen} sx={{ ml: 2 }}>
                    <Avatar>{username ? username.charAt(0).toUpperCase() : <AccountCircle />}</Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                  >
                    <MenuItem component={Link} to="/dashboard" onClick={handleProfileMenuClose}>Dashboard</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{
            sx: { width: '100%', maxWidth: 320, pt: 2 }
          }}
        >
          <Box sx={{ width: '100%' }}>
            <List>
              {navItems.map((item) => (
                <ListItem 
                  key={item.title}
                  component={Link}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  sx={{ color: 'text.primary', textDecoration: 'none', py: 2, px: 3, fontSize: { xs: '1.1rem', sm: '1.2rem' } }}
                  button
                >
                  <ListItemText primary={item.title} />
                </ListItem>
              ))}
              <ListItem component={Link} to="/login" sx={{ py: 2, px: 3, fontSize: { xs: '1.1rem', sm: '1.2rem' } }} button>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem component={Link} to="/signup" sx={{ py: 2, px: 3, fontSize: { xs: '1.1rem', sm: '1.2rem' } }} button>
                <ListItemText primary="Sign Up" />
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </AppBar>
    </HideOnScroll>
  );
}

export default Navbar; 