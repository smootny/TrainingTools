import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

export default function CustomInput(props: TextInputProps) {
  return (
    <TextInput
      {...props}
      style={[styles.input, props.style]}
      placeholderTextColor={'#ffffffaa'}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'rgba(88, 116, 88, 0.5)',
    height: 50,
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    fontFamily: 'Roboto-Light',
    borderColor: '#19361e',
    borderWidth: 0.5,
    width: 300,
    alignSelf: 'center'
  },
});
