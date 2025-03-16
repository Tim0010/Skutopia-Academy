// @project
import { generateFocusVisibleStyles } from '@/utils/CommonFocusStyle';
import { alpha } from '@mui/material/styles';

/***************************  OVERRIDES - BUTTON  ***************************/

export default function Button(theme) {
  return {
    MuiButton: {
      defaultProps: {
        disableFocusRipple: true,
        disableElevation: true
      },
      styleOverrides: {
        root: {
          fontSize: 15,
          fontWeight: 600,
          lineHeight: 1.5,
          letterSpacing: '0.02em',
          borderRadius: 8,
          textTransform: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:focus-visible': generateFocusVisibleStyles(theme.palette.primary.main)
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: theme.palette.primary.dark
          }
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
            backgroundColor: alpha(theme.palette.primary.main, 0.04)
          }
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: 14,
          '&.MuiButton-outlined': { padding: '5px 15px' }
        },
        sizeMedium: {
          padding: '8px 20px',
          '&.MuiButton-outlined': { padding: '7px 19px' },
          [theme.breakpoints.down('sm')]: {
            padding: '6px 16px',
            '&.MuiButton-outlined': { padding: '5px 15px' }
          }
        },
        sizeLarge: {
          padding: '10px 24px',
          fontSize: 16,
          '&.MuiButton-outlined': { padding: '9px 23px' },
          [theme.breakpoints.down('md')]: {
            padding: '8px 20px',
            '&.MuiButton-outlined': { padding: '7px 19px' }
          },
          [theme.breakpoints.down('sm')]: {
            padding: '6px 16px',
            '&.MuiButton-outlined': { padding: '5px 15px' }
          }
        }
      }
    }
  };
}
