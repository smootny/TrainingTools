import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
type Variant = 'green' | 'red' | 'yellow';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: Variant;
}

export default function SmallButton({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
  variant = 'green',
}: Props) {

  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variantStyles[variant].base,
        disabled ? variantStyles[variant].disabled : variantStyles[variant].active,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          disabled ? styles.textDisabled : styles.textActive,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 90,
    height: 90,
    borderRadius: 100,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#00000",
    shadowOffset: {
	  width: 0,
	  height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  textActive: {
    color: '#000000',
  },
  textDisabled: {
    color: '#ffffff',
  },
});

const variantStyles = {
  green: StyleSheet.create({
    base: {},
    active: {
      backgroundColor: '#0ed022',
      borderColor: 'rgb(0,255,0)',
    },
    disabled: {
      backgroundColor: '#19361e',
      borderColor: '#000000',
      opacity: 0.4
    },
  }),
  red: StyleSheet.create({
    base: {},
    active: {
      backgroundColor: '#e45e69',
      borderColor: '#e6a1a7',
    },
    disabled: {
      backgroundColor: '#a23a40',
      borderColor: '#7a252a',
    },
  }),
  yellow: StyleSheet.create({
    base: {},
    active: {
      backgroundColor: 'skyblue',
      borderColor: 'lightblue',
    },
    disabled: {
      backgroundColor: '#b5a700',
      borderColor: '#9c8800',
    },
  }),
};
