import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
export default function CustomLabel(props: TextProps) {
  const { theme } = useTheme();
  return (
    <Text
      {...props}
      style={[styles.label, { color: theme.text }, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Roboto-Light',
    fontSize: 14,
    marginBottom: 6,
    color: 'white',
    textAlign: 'center',
  },
});