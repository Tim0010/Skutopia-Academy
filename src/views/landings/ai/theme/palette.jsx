// @mui
import { alpha } from '@mui/material/styles';

// @types

/***************************  THEME - PALETTE  ***************************/

export default function themePalette() {
  // Modern professional color palette
  const primary = {
    lighter: '#C8E6D9',
    light: '#4D8B77',
    main: '#00573c', // Dark green (replacing Modern blue #2196F3)
    dark: '#004730',
    darker: '#001A13'
  };

  const secondary = {
    lighter: '#E8F5E9',
    light: '#81C784',
    main: '#4CAF50', // Professional green
    dark: '#388E3C',
    darker: '#1B5E20'
  };

  const info = {
    lighter: '#C8E6D9',
    light: '#4D8B77',
    main: '#00573c', // Dark green (replacing Light blue #03A9F4)
    dark: '#004730',
    darker: '#001A13'
  };

  const success = {
    lighter: '#F1F8E9',
    light: '#AED581',
    main: '#8BC34A', // Lime green
    dark: '#689F38',
    darker: '#33691E'
  };

  const warning = {
    lighter: '#FFF8E1',
    light: '#FFD54F',
    main: '#FFC107', // Amber
    dark: '#FFA000',
    darker: '#FF6F00'
  };

  const error = {
    lighter: '#FFEBEE',
    light: '#EF5350',
    main: '#F44336', // Red
    dark: '#D32F2F',
    darker: '#B71C1C'
  };

  return {
    primary: { ...primary },
    secondary: { ...secondary },
    info: { ...info },
    success: { ...success },
    warning: { ...warning },
    error: { ...error },
    common: {
      black: '#000000',
      white: '#FFFFFF'
    },
    text: {
      primary: '#1A2027',
      secondary: '#637381',
      disabled: '#919EAB'
    },
    action: {
      disabled: '#919EAB'
    },
    divider: alpha('#919EAB', 0.2),
    grey: {
      0: '#FFFFFF',
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#C4CDD5',
      500: '#919EAB',
      600: '#637381',
      700: '#454F5B',
      800: '#212B36',
      900: '#161C24',
      A100: '#F5F5F5',
      A200: '#EEEEEE',
      A400: '#C4CDD5',
      A700: '#454F5B',
      A900: '#161C24'
    },
    background: {
      paper: '#FFFFFF',
      default: '#FFFFFF'
    }
  };
} 