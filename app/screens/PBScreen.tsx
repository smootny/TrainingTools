import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  Platform,
  ImageSourcePropType,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';
import BackButton from '@/components/BackButton';
import CustomInput from '@/components/CustomInput';
import CustomLabel from '@/components/CustomLabel';

const PB_KEYS = {
  bench: 'pb_bench',
  squat: 'pb_squat',
  deadlift: 'pb_deadlift',
  pullups: 'pb_pullups',
  headpress: 'pb_headpress'
};

export default function PersonalBestsScreen() {
  const [bench, setBench] = useState('');
  const [squat, setSquat] = useState('');
  const [deadlift, setDeadlift] = useState('');
  const [pullups, setPullups] = useState('');
  const [headpress, setHeadpress] = useState('');
  const [locked, setLocked] = useState({ bench: false, squat: false, deadlift: false, pullups: false, headpress: false });

  useEffect(() => {
    const loadPBs = async () => {
      const b = await AsyncStorage.getItem(PB_KEYS.bench);
      const s = await AsyncStorage.getItem(PB_KEYS.squat);
      const d = await AsyncStorage.getItem(PB_KEYS.deadlift);
      const p = await AsyncStorage.getItem(PB_KEYS.pullups);
      const h = await AsyncStorage.getItem(PB_KEYS.headpress);

      if (b) {
        setBench(b);
        setLocked(prev => ({ ...prev, bench: true }));
      }
      if (s) {
        setSquat(s);
        setLocked(prev => ({ ...prev, squat: true }));
      }
      if (d) {
        setDeadlift(d);
        setLocked(prev => ({ ...prev, deadlift: true }));
      }
      if (p) {
        setPullups(p);
        setLocked(prev => ({ ...prev, pullups: true}));
      }
      if (h) {
        setHeadpress(h);
        setLocked(prev => ({ ...prev, headpress: true}))
      }
    };
    loadPBs();
  }, []);

  const savePB = async (key: keyof typeof PB_KEYS, value: string) => {
    await AsyncStorage.setItem(PB_KEYS[key], value);
    setLocked(prev => ({ ...prev, [key]: true }));
  };

  const clearPB = async (key: keyof typeof PB_KEYS) => {
    await AsyncStorage.removeItem(PB_KEYS[key]);
    setLocked(prev => ({ ...prev, [key]: false }));
    if (key === 'bench') setBench('');
    if (key === 'squat') setSquat('');
    if (key === 'deadlift') setDeadlift('');
    if (key === 'pullups') setPullups('');
    if (key === 'headpress') setHeadpress('');
  };

  const renderPBInput = (
    label: string,
    value: string,
    setValue: (v: string) => void,
    key: keyof typeof PB_KEYS,
    iconSource: ImageSourcePropType
  ) => {
    const isSaveDisabled = locked[key] || value.trim() === '';

    return (
      <View style={styles.pbRow}>
        <Image source={iconSource} style={styles.pbIcon} />
        <Text style={styles.pbLabel}>{label}</Text>
        <CustomInput
          style={[styles.pbInput, locked[key] && styles.pbInputLocked]}
          keyboardType="numeric"
          placeholder={key === 'pullups' ? '(number)' : '(kg)'}
          placeholderTextColor="#000"
          value={value}
          editable={!locked[key]}
          onChangeText={setValue}
        />
        
        <TouchableOpacity
          onPress={() => {
            if (!isSaveDisabled) savePB(key, value);
          }}
          disabled={isSaveDisabled}
          style={{ opacity: isSaveDisabled ? 0.3 : 1 }}
        >
          <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
            <Path
              d="M5 13l4 4L19 7"
              stroke="#00c851"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => clearPB(key)}>
          <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 6L6 18M6 6l12 12"
              stroke="#e45e69"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#35e74d', 'black']}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={styles.gradient}
    >
        <BackButton />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <CustomLabel>Personal Bests</CustomLabel>
        {renderPBInput('Bench Press', bench, setBench, 'bench', require('../../assets/images/benchpress.png'))}
        {renderPBInput('Squat', squat, setSquat, 'squat', require('../../assets/images/squat.png'))}
        {renderPBInput('Overhead Press', headpress, setHeadpress, 'headpress', require('../../assets/images/headpress.png'))}
        {renderPBInput('Deadlift', deadlift, setDeadlift, 'deadlift', require('../../assets/images/deadlift.png'))}
        {renderPBInput('Pull-ups', pullups, setPullups, 'pullups', require('../../assets/images/pullups.png'))}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  pbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 30,
    height: 60,
    paddingLeft: 20,
    paddingRight: 20,
  },
  pbIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  pbLabel: {
    width: 100,
    fontSize: 16,
    color: 'white',
    fontFamily: 'Roboto-Regular',
  },
  pbInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    borderRadius: 10,
  },
  pbInputLocked: {
    backgroundColor: '#00c851',
    color: 'black',
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
  },
});
