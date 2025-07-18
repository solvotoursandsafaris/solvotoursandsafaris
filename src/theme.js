import { createTheme } from '@mui/material/styles';

const getTheme = (mode = 'light') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#2E7D32', // Forest green
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#FFA000', // Amber
      light: '#FFB300',
      dark: '#FF8F00',
    },
    background: {
      default: mode === 'dark' ? '#181818' : '#FFFFFF',
      paper: mode === 'dark' ? '#232323' : '#F8F8F8',
    },
  },
  typography: {
    fontFamily: 'Bahnschrift, Arial, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 0.4s, color 0.4s',
        },
        '*': {
          transition: 'background-color 0.4s, color 0.4s',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: '8px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default getTheme; 