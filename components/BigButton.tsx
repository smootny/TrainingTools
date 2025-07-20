import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function BigButton({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled ? styles.disabled : styles.active,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={[
        styles.buttonText,
        disabled ? styles.textDisabled : styles.textActive,
        textStyle,
      ]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#19361e',
    borderColor: '#000000',
  },
  disabled: {
    backgroundColor: '#0ed022',
    borderColor: 'rgb(0,255,0)',
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  textActive: {
    color: '#ffffff',
  },
  textDisabled: {
    color: '#000000',
  },
});
