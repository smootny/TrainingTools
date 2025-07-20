import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Note, useNotesStore } from '../../hooks/useNotesStore';
import NoteCard from '../../components/NoteCard';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '../../components/BackButton'
import CustomInput from '@/components/CustomInput';
import BigButton from '@/components/BigButton';

export default function NotesListScreen() {
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
    <LinearGradient
      colors={['#35e74d', 'black']}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={styles.gradient}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={30}
          style={styles.wrapper}
        >
          <BackButton />

           <CustomInput
            style={styles.input}
            value={query}
            placeholder="Search..."
            onChangeText={setQuery}
            placeholderTextColor="#ccc"
            />

          <FlatList
            data={filteredNotes}
            keyExtractor={(item: Note, index: number) => index.toString()}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <NoteCard
                title={item.title}
                body={item.body}
                onDelete={() => deleteNote(item.id)}
                onPress={() =>
                  router.push({
                    pathname: '../screens/NoteDetailsScreen',
                    params: { id: item.id },
                  })
                }
              />
            )}
          />
          <BigButton
          style={styles.button}
          title="Add"
          onPress={() => router.push('/screens/NoteDetailsScreen')}
              />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    marginTop: 120,
    marginBottom: 20,
  },
  list: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  button: {
    marginBottom: 40,
    // paddingVertical: 60,
  }
});
