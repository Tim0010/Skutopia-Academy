'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';

// This component will be responsible for rendering the interactive visualizations
// based on the configuration provided
const InteractiveVisualization = ({ config, type = 'graph', height = 400 }) => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // This would be where we'd initialize our visualization library
    // For now we're just simulating the loading process
    let mounted = true;
    let visualizationInstance = null;
    
    const initializeVisualization = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate loading delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!mounted) return;
        
        // Based on the type, we'd initialize different visualization libraries
        switch(type) {
          case 'graph':
            // We'd use D3.js or similar here
            console.log('Initializing graph visualization with:', config);
            // visualizationInstance = initD3Graph(containerRef.current, config);
            break;
          case '3d':
            // We'd use Three.js or similar here
            console.log('Initializing 3D visualization with:', config);
            // visualizationInstance = initThreeJS(containerRef.current, config);
            break;
          case 'simulation':
            // We'd use a physics engine like Matter.js here
            console.log('Initializing physics simulation with:', config);
            // visualizationInstance = initPhysicsSimulation(containerRef.current, config);
            break;
          case 'chemistry':
            // We'd use a chemistry visualization library here
            console.log('Initializing chemistry visualization with:', config);
            // visualizationInstance = initChemistryVis(containerRef.current, config);
            break;
          case 'math':
            // We'd use a math visualization library here
            console.log('Initializing math formula visualization with:', config);
            // visualizationInstance = initMathVis(containerRef.current, config);
            break;
          default:
            console.log('Unknown visualization type');
            setError(`Unsupported visualization type: ${type}`);
        }
        
        // Here we'd add event listeners for interaction
        
      } catch (err) {
        if (mounted) {
          console.error('Error initializing visualization:', err);
          setError(err.message || 'Failed to initialize visualization');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    initializeVisualization();
    
    // Cleanup function
    return () => {
      mounted = false;
      // Here we'd clean up any visualization resources
      if (visualizationInstance) {
        // visualizationInstance.dispose();
        console.log('Cleaning up visualization');
      }
    };
  }, [config, type]);
  
  // Mock display for prototype visualization types
  const renderMockVisualization = () => {
    switch(type) {
      case 'graph':
        return (
          <Box
            sx={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 800 400">
              {/* Mock interactive graph */}
              <g transform="translate(400, 200)">
                <circle cx="0" cy="0" r="50" fill="#3f51b5" opacity="0.8" />
                <circle cx="-150" cy="-50" r="30" fill="#f44336" opacity="0.8" />
                <circle cx="150" cy="50" r="40" fill="#4caf50" opacity="0.8" />
                <circle cx="100" cy="-100" r="25" fill="#ff9800" opacity="0.8" />
                <circle cx="-100" cy="100" r="35" fill="#9c27b0" opacity="0.8" />
                
                <line x1="0" y1="0" x2="-150" y2="-50" stroke="#999" strokeWidth="2" />
                <line x1="0" y1="0" x2="150" y2="50" stroke="#999" strokeWidth="2" />
                <line x1="0" y1="0" x2="100" y2="-100" stroke="#999" strokeWidth="2" />
                <line x1="0" y1="0" x2="-100" y2="100" stroke="#999" strokeWidth="2" />
              </g>
            </svg>
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                bgcolor: 'rgba(255,255,255,0.7)',
                px: 1,
                borderRadius: 1
              }}
            >
              Interactive Graph
            </Typography>
          </Box>
        );
        
      case '3d':
        return (
          <Box
            sx={{
              background: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'white',
              position: 'relative'
            }}
          >
            <Box
              sx={{
                width: '200px',
                height: '200px',
                position: 'relative',
                transformStyle: 'preserve-3d',
                animation: 'spin 10s infinite linear',
                '& div': {
                  position: 'absolute',
                  width: '200px',
                  height: '200px',
                  opacity: 0.7,
                },
                '@keyframes spin': {
                  from: { transform: 'rotateX(0deg) rotateY(0deg)' },
                  to: { transform: 'rotateX(360deg) rotateY(360deg)' }
                }
              }}
            >
              <Box sx={{ transform: 'translateZ(100px)', background: '#e91e63' }} />
              <Box sx={{ transform: 'rotateY(180deg) translateZ(100px)', background: '#3f51b5' }} />
              <Box sx={{ transform: 'rotateY(90deg) translateZ(100px)', background: '#4caf50' }} />
              <Box sx={{ transform: 'rotateY(-90deg) translateZ(100px)', background: '#ff9800' }} />
              <Box sx={{ transform: 'rotateX(90deg) translateZ(100px)', background: '#ffeb3b' }} />
              <Box sx={{ transform: 'rotateX(-90deg) translateZ(100px)', background: '#9c27b0' }} />
            </Box>
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                bgcolor: 'rgba(255,255,255,0.7)',
                color: 'black',
                px: 1,
                borderRadius: 1
              }}
            >
              3D Model
            </Typography>
          </Box>
        );
        
      case 'simulation':
        return (
          <Box
            sx={{
              background: 'linear-gradient(135deg, #334d50 0%, #cbcaa5 100%)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {Array.from({ length: 15 }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: `${20 + Math.random() * 30}px`,
                  height: `${20 + Math.random() * 30}px`,
                  borderRadius: '50%',
                  bgcolor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float${i} ${3 + Math.random() * 7}s infinite linear`,
                  opacity: 0.8,
                  '@keyframes float'+i: {
                    '0%': { transform: 'translate(0, 0)' },
                    '25%': { transform: `translate(${-50 + Math.random() * 100}px, ${-50 + Math.random() * 100}px)` },
                    '50%': { transform: `translate(${-50 + Math.random() * 100}px, ${-50 + Math.random() * 100}px)` },
                    '75%': { transform: `translate(${-50 + Math.random() * 100}px, ${-50 + Math.random() * 100}px)` },
                    '100%': { transform: 'translate(0, 0)' }
                  }
                }}
              />
            ))}
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                bgcolor: 'rgba(255,255,255,0.7)',
                px: 1,
                borderRadius: 1,
                zIndex: 2
              }}
            >
              Physics Simulation
            </Typography>
          </Box>
        );
        
      case 'chemistry':
        return (
          <Box
            sx={{
              background: 'linear-gradient(135deg, #bbd2c5 0%, #536976 100%)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              position: 'relative'
            }}
          >
            <svg width="300" height="200" viewBox="0 0 300 200">
              {/* Simple molecular structure */}
              <g transform="translate(150, 100)">
                {/* Carbon */}
                <circle cx="0" cy="0" r="20" fill="#444" />
                <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="16">C</text>
                
                {/* Hydrogen */}
                <circle cx="-40" cy="-40" r="15" fill="#2196f3" />
                <text x="-40" y="-40" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="16">H</text>
                <line x1="0" y1="0" x2="-40" y2="-40" stroke="#999" strokeWidth="2" />
                
                {/* Hydrogen */}
                <circle cx="40" cy="-40" r="15" fill="#2196f3" />
                <text x="40" y="-40" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="16">H</text>
                <line x1="0" y1="0" x2="40" y2="-40" stroke="#999" strokeWidth="2" />
                
                {/* Oxygen */}
                <circle cx="0" cy="50" r="20" fill="#f44336" />
                <text x="0" y="50" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="16">O</text>
                <line x1="0" y1="0" x2="0" y2="50" stroke="#999" strokeWidth="2" />
                
                {/* Hydrogen */}
                <circle cx="-30" cy="80" r="15" fill="#2196f3" />
                <text x="-30" y="80" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="16">H</text>
                <line x1="0" y1="50" x2="-30" y2="80" stroke="#999" strokeWidth="2" />
              </g>
            </svg>
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                bgcolor: 'rgba(255,255,255,0.7)',
                px: 1,
                borderRadius: 1
              }}
            >
              Chemistry Visualization
            </Typography>
          </Box>
        );
        
      case 'math':
        return (
          <Box
            sx={{
              background: 'linear-gradient(135deg, #eef2f3 0%, #8e9eab 100%)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              position: 'relative'
            }}
          >
            <svg width="400" height="200" viewBox="0 0 400 200">
              {/* Sine wave */}
              <path
                d="M0,100 Q25,50 50,100 T100,100 T150,100 T200,100 T250,100 T300,100 T350,100 T400,100"
                fill="none"
                stroke="#3f51b5"
                strokeWidth="3"
              />
              
              {/* X and Y axes */}
              <line x1="0" y1="100" x2="400" y2="100" stroke="#666" strokeWidth="1" />
              <line x1="200" y1="0" x2="200" y2="200" stroke="#666" strokeWidth="1" />
              
              {/* Labels */}
              <text x="210" y="20" fill="#666">y</text>
              <text x="380" y="120" fill="#666">x</text>
              <text x="150" y="150" fill="#3f51b5" fontSize="16">f(x) = sin(x)</text>
            </svg>
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                bgcolor: 'rgba(255,255,255,0.7)',
                px: 1,
                borderRadius: 1
              }}
            >
              Math Formula Visualization
            </Typography>
          </Box>
        );
        
      default:
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}
          >
            <Typography color="error">
              Unknown visualization type: {type}
            </Typography>
          </Box>
        );
    }
  };
  
  return (
    <Paper 
      elevation={2}
      sx={{ 
        height, 
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: 2
      }}
    >
      <Box
        ref={containerRef}
        sx={{
          height: '100%',
          width: '100%'
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}
          >
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Loading visualization...
            </Typography>
          </Box>
        ) : error ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              p: 2
            }}
          >
            <Typography color="error" align="center">
              {error}
            </Typography>
          </Box>
        ) : (
          // In a real implementation, the visualization would be rendered here
          // by the referenced library. For now, we'll show a mock visualization.
          renderMockVisualization()
        )}
      </Box>
    </Paper>
  );
};

export default InteractiveVisualization; 