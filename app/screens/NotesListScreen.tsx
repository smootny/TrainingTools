import React, { useState } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { useNotesStore } from '../../hooks/useNotesStore';
import NoteCard from '../../components/NoteCard';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '../../components/BackButton'
import CustomInput from '@/components/CustomInput';
import BigButton from '@/components/BigButton';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useSound } from '@/hooks/useSound';

export default function NotesListScreen() {
  const { removeNoteSound } = useSound();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const { notes, deleteNote } = useNotesStore();
  const [query, setQuery] = useState('');

  const filteredNotes = notes.filter((note) => {
    const lower = query.toLowerCase();
    return (
      note.title.toLowerCase().includes(lower) ||
      note.body.toLowerCase().includes(lower)
    );
  });

  return (
    <LinearGradient colors={[theme.background, theme.secondary]}
    start={{ x: 0.5, y: 1 }}
    end={{ x: 0.5, y: 0 }}
    style={styles.gradient}>
      <BackButton />
      <CustomInput
        style={styles.input}
        value={query}
        placeholder={t('search')}
        onChangeText={setQuery}
        placeholderTextColor="#ccc"
      />
      <View style={styles.listWrapper}>
        <KeyboardAwareFlatList
          data={filteredNotes}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <NoteCard
              title={item.title}
              body={item.body}
              onDelete={() => {
                removeNoteSound(); 
                deleteNote(item.id);
              }}
              onPress={() => router.push({ pathname: '../screens/NoteDetailsScreen', 
              params: { id: item.id } })}
            />
          )}
        />
      </View>
      <View style={styles.footer}>
        <BigButton title={t('add_button')} onPress={() => {
        router.push('/screens/NoteDetailsScreen')}} />
      </View>
    </LinearGradient>
  );
  }

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  input: {
    marginTop: 120,
    marginBottom: 10,
  },
  list: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  listWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  footer: {
    marginBottom: 40,
    marginTop: 20,
    alignItems: 'center',
  },
});





