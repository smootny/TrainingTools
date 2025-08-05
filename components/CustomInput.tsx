import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function CustomInput(props: TextInputProps) {
  const { theme } = useTheme();

  return (
    <TextInput
      {...props}
      style={[styles.input, theme.input, props.style]}
      placeholderTextColor={theme.input.color}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    fontSize: 20,
    textAlign: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    fontFamily: 'Roboto-Light',
    width: 300,
    alignSelf: 'center',
  },
});
