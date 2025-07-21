import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

export default function CustomLabel(props: TextProps) {
  return (
    <Text
      {...props}
      style={[styles.label, props.style]}
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