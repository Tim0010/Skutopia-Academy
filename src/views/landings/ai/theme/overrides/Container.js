/***************************  OVERRIDES - CONTAINER  ***************************/

export default function Container() {
  return {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: { xs: 16, sm: 24, md: 40 },
          paddingRight: { xs: 16, sm: 24, md: 40 },
          '&.MuiContainer-maxWidthXl': {
            maxWidth: 1440,
            '@media (min-width: 1200px)': {
              paddingLeft: 80,
              paddingRight: 80
            }
          },
          '&.MuiContainer-maxWidthLg': {
            maxWidth: 1200,
            '@media (min-width: 1200px)': {
              paddingLeft: 64,
              paddingRight: 64
            }
          }
        }
      }
    }
  };
}
