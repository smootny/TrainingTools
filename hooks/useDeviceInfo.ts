import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';

export const useDeviceInfo = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;
  // Better iPad detection: check minimum dimension
  // iPad typically has min dimension >= 768px in portrait
  const minDimension = Math.min(width, height);
  const isTablet = Platform.OS === 'ios' && minDimension >= 768;
  const isIPad = isTablet;
  
  // Max width for content on iPad to prevent it from being too wide
  const maxContentWidth = isIPad ? 600 : width;
  
  // Responsive spacing multipliers
  const spacingMultiplier = isIPad ? 1.5 : 1;
  
  // Responsive font size multipliers
  const fontSizeMultiplier = isIPad ? 1.2 : 1;

  return {
    width,
    height,
    isTablet,
    isIPad,
    maxContentWidth,
    spacingMultiplier,
    fontSizeMultiplier,
  };
};

