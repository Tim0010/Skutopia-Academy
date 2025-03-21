'use client';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

//@project
import { IconType } from '@/enum';

// @types

const spritePaths = {
  [IconType.STROKE]: '/assets/svg/tabler-sprite-outline.svg',
  [IconType.FILL]: '/assets/svg/tabler-sprite-fill.svg',
  [IconType.CUSTOM]: '/assets/svg/sprite-custom.svg'
};

export default function SvgIcon({ name, size = 24, type = IconType.STROKE, color, stroke, twoToneColor }) {
  const theme = useTheme();
  const [hasError, setHasError] = useState(false);

  const fillColor = type !== IconType.STROKE ? twoToneColor || theme.palette.primary.light : undefined;
  const strokeColor =
    type !== IconType.FILL ? color || (type === IconType.CUSTOM ? theme.palette.text.primary : theme.palette.primary.main) : undefined;

  const defaultStroke = size <= 24 ? 2.5 : size <= 32 ? 2 : 1.5;
  const strokeWidth = stroke !== undefined ? stroke : type === IconType.CUSTOM ? defaultStroke : type !== IconType.FILL ? 1.5 : undefined;

  // Handle error when icon fails to load
  useEffect(() => {
    setHasError(false);
  }, [name, type]);

  const handleError = () => {
    console.warn(`Failed to load icon: ${name} with type ${type}`);
    setHasError(true);
  };

  // Fallback icon when the requested icon fails to load
  const renderFallbackIcon = () => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="8" y1="8" x2="16" y2="16" />
        <line x1="8" y1="16" x2="16" y2="8" />
      </svg>
    );
  };

  return (
    <Box
      role="none"
      sx={{
        '& svg': {
          verticalAlign: 'middle',
          display: 'block',
          color: color || (type === IconType.CUSTOM ? 'text.primary' : 'primary.main'),
          '& [data-two-tone="true"]': { color: twoToneColor || theme.palette.primary.light }
        }
      }}
    >
      {hasError ? (
        renderFallbackIcon()
      ) : (
        <svg
          className={name}
          width={size}
          height={size}
          {...(fillColor && { fill: fillColor })}
          {...(strokeColor && { stroke: strokeColor })}
          {...(strokeWidth && { strokeWidth })}
        >
          <use 
            xlinkHref={`${spritePaths[type]}#${name}`} 
            onError={handleError}
          />
        </svg>
      )}
    </Box>
  );
}

SvgIcon.propTypes = {
  name: PropTypes.any,
  size: PropTypes.number,
  type: PropTypes.any,
  IconType: PropTypes.any,
  STROKE: PropTypes.any,
  color: PropTypes.any,
  stroke: PropTypes.any,
  twoToneColor: PropTypes.any
};
