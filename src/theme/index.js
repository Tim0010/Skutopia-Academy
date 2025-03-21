import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0E7C6B', // Skutopia green
            light: '#3D9D8F',
            dark: '#095F52',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#1976d2', // Blue
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#ffffff',
        },
        success: {
            main: '#2E7D32', // Darker green
            light: '#4CAF50',
            dark: '#1B5E20',
            contrastText: '#ffffff',
        },
        info: {
            main: '#0288d1', // Lighter blue
            light: '#03a9f4',
            dark: '#01579b',
            contrastText: '#ffffff',
        },
        warning: {
            main: '#ff9800',
            light: '#ffb74d',
            dark: '#f57c00',
            contrastText: '#ffffff',
        },
        error: {
            main: '#d32f2f',
            light: '#ef5350',
            dark: '#c62828',
            contrastText: '#ffffff',
        },
        background: {
            default: '#ffffff',
            paper: '#ffffff',
            neutral: '#F5F9F9', // Slight green tint
        },
        text: {
            primary: '#1a1a1a',
            secondary: '#556B67', // Green-tinted gray
            disabled: '#9e9e9e',
        },
        divider: 'rgba(14, 124, 107, 0.12)',
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '3rem',
            fontWeight: 700,
            lineHeight: 1.2,
            '@media (max-width:600px)': {
                fontSize: '2.5rem',
            },
        },
        h2: {
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: 1.3,
            '@media (max-width:600px)': {
                fontSize: '2rem',
            },
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 700,
            lineHeight: 1.3,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        subtitle1: {
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1.5,
        },
        subtitle2: {
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: 1.6,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.7,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.7,
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
        caption: {
            fontSize: '0.75rem',
            lineHeight: 1.4,
        },
        overline: {
            fontWeight: 600,
            letterSpacing: 1.2,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    padding: '10px 24px',
                    fontWeight: 500,
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                },
                contained: {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': {
                        boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(45deg, #095F52, #0E7C6B)',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #095F52, #3D9D8F)',
                    },
                },
                containedSecondary: {
                    background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                    },
                },
                containedSuccess: {
                    background: 'linear-gradient(45deg, #1B5E20, #2E7D32)',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #1B5E20, #4CAF50)',
                    },
                },
                containedWarning: {
                    background: 'linear-gradient(45deg, #f57c00, #ff9800)',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #f57c00, #ffb74d)',
                    },
                },
                outlined: {
                    borderWidth: '1.5px',
                    '&:hover': {
                        borderWidth: '1.5px',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
                    transition: 'all 0.4s ease',
                    overflow: 'hidden',
                    '&:hover': {
                        boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
                        transform: 'translateY(-5px)',
                    },
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: 24,
                    '&:last-child': {
                        paddingBottom: 24,
                    },
                },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    paddingLeft: 24,
                    paddingRight: 24,
                    '@media (min-width:600px)': {
                        paddingLeft: 32,
                        paddingRight: 32,
                    },
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: 'rgba(14, 124, 107, 0.12)',
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        transform: 'scale(1.1)',
                    },
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                h1: {
                    '@media (max-width:600px)': {
                        fontSize: '2.5rem',
                    },
                },
                h2: {
                    '@media (max-width:600px)': {
                        fontSize: '2rem',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                rounded: {
                    borderRadius: 16,
                },
                elevation1: {
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                },
                elevation2: {
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                },
                elevation3: {
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    '&:hover': {
                        backgroundColor: 'rgba(14, 124, 107, 0.04)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: '#1a1a1a',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(14, 124, 107, 0.12)',
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#0E7C6B',
                    '&:hover': {
                        color: '#095F52',
                    },
                },
            },
        },
    },
    shape: {
        borderRadius: 8,
    },
    shadows: [
        'none',
        '0 2px 4px rgba(0,0,0,0.05)',
        '0 4px 8px rgba(0,0,0,0.05)',
        '0 6px 12px rgba(0,0,0,0.08)',
        '0 8px 16px rgba(0,0,0,0.08)',
        '0 10px 20px rgba(0,0,0,0.1)',
        '0 12px 24px rgba(0,0,0,0.12)',
        '0 14px 28px rgba(0,0,0,0.14)',
        '0 16px 32px rgba(0,0,0,0.16)',
        '0 18px 36px rgba(0,0,0,0.18)',
        '0 20px 40px rgba(0,0,0,0.2)',
        '0 22px 44px rgba(0,0,0,0.22)',
        '0 24px 48px rgba(0,0,0,0.24)',
        '0 26px 52px rgba(0,0,0,0.26)',
        '0 28px 56px rgba(0,0,0,0.28)',
        '0 30px 60px rgba(0,0,0,0.3)',
        '0 32px 64px rgba(0,0,0,0.32)',
        '0 34px 68px rgba(0,0,0,0.34)',
        '0 36px 72px rgba(0,0,0,0.36)',
        '0 38px 76px rgba(0,0,0,0.38)',
        '0 40px 80px rgba(0,0,0,0.4)',
        '0 42px 84px rgba(0,0,0,0.42)',
        '0 44px 88px rgba(0,0,0,0.44)',
        '0 46px 92px rgba(0,0,0,0.46)',
        '0 48px 96px rgba(0,0,0,0.48)',
    ],
});

export default theme; 