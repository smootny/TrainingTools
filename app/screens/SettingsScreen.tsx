import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import BackButton from '@/components/BackButton';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useTheme();

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [notifications, setNotifications] = useState(false);
  const [sound, setSound] = useState(false);
  const [notificationTime, setNotificationTime] = useState<Date | null>(null);
  const [tempTime, setTempTime] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const name = await AsyncStorage.getItem('userName');
      const photo = await AsyncStorage.getItem('profileImage');
      const timeStr = await AsyncStorage.getItem('notificationTime');
      const storedNotifications = await AsyncStorage.getItem('notifications');
      const storedSound = await AsyncStorage.getItem('sound');

      if (name) setUserName(name);
      if (photo) setProfileImage(photo);
      if (timeStr) setNotificationTime(new Date(timeStr));
      if (storedNotifications !== null) setNotifications(storedNotifications === 'true');
      if (storedSound !== null) setSound(storedSound === 'true');
    };
    fetchData();
  }, []);

  const confirmToggle = (label: string, value: boolean, onConfirm: () => void, storageKey?: string) => {
    Alert.alert(
      `${label}`,
      `Are you sure you want to ${value ? 'disable' : 'enable'} ${label.toLowerCase()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            onConfirm();
            if (storageKey) AsyncStorage.setItem(storageKey, (!value).toString());
          },
        },
      ]
    );
  };

  const handleResetApp = () => {
    Alert.alert('Reset App', 'Are you sure you want to reset the app?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace('/screens/WelcomeScreen');
        },
      },
    ]);
  };

  const handleTimeChange = (_event: any, selectedTime?: Date) => {
    if (Platform.OS !== 'ios') setShowPicker(false);
    if (selectedTime) {
      setTempTime(selectedTime);
    }
  };

  const saveNotificationTime = () => {
    setNotificationTime(tempTime);
    AsyncStorage.setItem('notificationTime', tempTime.toISOString());
    setShowPicker(false);
  };

  const handleChoosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      await AsyncStorage.setItem('profileImage', uri);
    }
  };

  return (
    <LinearGradient colors={[theme.background, theme.secondary]} start={{ x: 0.5, y: 1 }} end={{ x: 0.5, y: 0 }} style={styles.gradient}>
      <BackButton />
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.profilePicDiv} onPress={handleChoosePhoto}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.photo} />
          ) : (
            <Image source={require('../../assets/images/image.png')} style={styles.photo} />
          )}
          <Text style={styles.uploadBtn}>Choose Photo</Text>
        </TouchableOpacity>

        <Text style={[styles.name, { color: theme.text }]}>{userName}</Text>

        <View style={styles.container}>
          {[
            { label: 'Cool / Cooler Mode', value: isDark, toggle: toggleTheme },
            { label: 'Notifications', value: notifications, toggle: () => setNotifications(!notifications), key: 'notifications' },
            { label: 'Sound', value: sound, toggle: () => setSound(!sound), key: 'sound' },
            { label: 'Polish / English', value: false, toggle: () => console.log('Language toggled') },
          ].map(({ label, value, toggle, key }, idx) => {
            const isNotification = label === 'Notifications';
            return (
              <View key={idx}>
                <View style={styles.buttonContainer}>
                  <Text style={[styles.titleOptions, { color: theme.text }]}>{label}</Text>
                  <Switch
                    trackColor={{ false: '#555', true: 'rgba(53, 231, 77)' }}
                    thumbColor={value ? 'white' : '#f4f3f4'}
                    ios_backgroundColor="rgba(88, 116, 88, 0.6)"
                    value={value}
                    onValueChange={() => confirmToggle(label, value, toggle, key)}
                  />
                </View>
                {isNotification && notifications && (
                  <View style={styles.notificationTimeBlock}>
                    <Text style={[styles.titleOptions, { color: theme.text }]}>
                      Notification Time: {notificationTime ? notificationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Not set'}
                    </Text>
                    <TouchableOpacity onPress={() => (showPicker ? saveNotificationTime() : setShowPicker(true))} style={styles.setConfirmButton}>
                      <Text style={styles.setText}>{showPicker ? 'Confirm' : 'Set'}</Text>
                    </TouchableOpacity>
                    {showPicker && (
                      <DateTimePicker
                        value={tempTime}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleTimeChange}
                      />
                    )}
                  </View>
                )}
              </View>
            );
          })}
          <TouchableOpacity onPress={handleResetApp} style={styles.resetButton}>
            <Text style={styles.resetText}>Reset App</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { 
    flex: 1 
  },
  inputContainer: { 
    flex: 1, 
    paddingTop: 100, 
    alignItems: 'center' 
  },
  container: { 
    gap: 10, 
    alignItems: 'flex-end', 
    marginBottom: 20 
  },
  profilePicDiv: { 
    height: 200, 
    width: 200, 
    borderRadius: 100, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: 'grey', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20, 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    shadowOpacity: 0.3, 
    shadowRadius: 10 
  },
  photo: { 
    height: '100%', 
    width: '100%', 
    borderRadius: 100 
  },
  uploadBtn: { 
    position: 'absolute', 
    bottom: 0, width: '100%', 
    textAlign: 'center', 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    color: 'white', 
    fontSize: 12, 
    paddingVertical: 10, 
    fontFamily: 'Roboto-Light' 
  },
  name: { 
    fontSize: 30, 
    fontFamily: 'Roboto-Regular', 
    marginBottom: 40 
  },
  buttonContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    width: 300, 
    marginBottom: 10 
  },
  titleOptions: { 
    fontSize: 20, 
    fontFamily: 'Roboto-Light' 
  },
  notificationTimeBlock: { 
    width: 300, 
    marginBottom: 20, 
    gap: 10, 
    alignItems: 'center' 
  },
  setText: { 
    fontSize: 16, 
    color: '#00FFAA', 
    fontFamily: 'Roboto-Regular', 
    textAlign: 'center' 
  },
  setConfirmButton: { 
    alignItems: 'center', 
    marginTop: 10 
  },
  resetButton: { 
    marginTop: 40, 
    alignSelf: 'center' 
  },
  resetText: { 
    fontSize: 18, 
    color: 'red', 
    fontWeight: '600', 
    fontFamily: 'Roboto-Regular', 
    textAlign: 'center' 
  },
});
