import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
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
    shadowColor: "#00000",
    shadowOffset: {
	  width: 0,
	  height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  active: {
    backgroundColor: '#0ed022',
    borderColor: 'rgb(0,255,0)',
  },
  disabled: {
    backgroundColor: '#19361e',
    borderColor: '#000000',
    opacity: 0.4
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
    color: '#000000',
  },
  textDisabled: {
    color: '#ffffff',
  },
});
