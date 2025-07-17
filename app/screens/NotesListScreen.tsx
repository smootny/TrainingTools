import React, { useState } from 'react';
import {
  Image,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native';
import { Note, useNotesStore } from '../../hooks/useNotesStore';
import NoteCard from '../../components/NoteCard';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/screens/MenuScreen')}
          >
            <Image
              source={require('../../assets/images/right-arrow.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="white"
            value={query}
            onChangeText={setQuery}
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

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/screens/NoteDetailsScreen')}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
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
  searchInput: {
    marginTop: 120,
    marginBottom: 20,
    height: 40,
    width: 320,
    textAlign: 'center',
    backgroundColor: 'black',
    color: 'white',
    fontSize: 20,
    opacity: 0.7,
    fontFamily: 'Roboto-Light',
    borderRadius: 8,
  },
  list: {
    paddingBottom: 140,
    alignItems: 'center',
  },
  addButton: {
      marginBottom: 40,
      paddingHorizontal: 30,
      paddingVertical: 42,
      borderRadius: 100,
      borderWidth: 3,
      borderColor: 'rgb(0,255,0)',
      backgroundColor: '#0ed022',
      shadowColor: '#05d328',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 40,
      opacity: 0.8,
      alignItems: 'center',
  },
  addButtonText: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'Roboto-Regular'
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 999,
  },
  backIcon: {
    width: 60,
    height: 60,
    transform: [{ rotate: '180deg' }],
  },
});
