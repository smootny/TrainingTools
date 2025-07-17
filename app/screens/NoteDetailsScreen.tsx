import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useNotesStore } from '../../hooks/useNotesStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function NoteDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { notes, addNote, updateNote } = useNotesStore();

  const isEditing = id !== undefined;
  const parsedId = id ?? null;
  const existingNote = notes.find((note) => note.id === parsedId);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const inputsFilled = title.trim().length > 0 && body.trim().length > 0;

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setBody(existingNote.body);
    }
  }, [existingNote]);

  const handleSave = () => {
    if (!inputsFilled) return;

    if (isEditing && parsedId !== null) {
      updateNote(parsedId, { title, body });
    } else {
      addNote({ title, body });
    }
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <LinearGradient
      colors={['#35e74d', 'black']}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={styles.gradient}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={30}
        >
          <View style={styles.form}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter title"
              placeholderTextColor="#ccc"
            />

            <Text style={styles.label}>Content</Text>
            <TextInput
              style={styles.textarea}
              value={body}
              onChangeText={setBody}
              placeholder="Enter content"
              placeholderTextColor="#ccc"
              multiline
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                disabled={!inputsFilled}
                style={[
                  styles.saveButton,
                  !inputsFilled && styles.saveButtonDisabled,
                ]}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    backgroundColor: '#587458',
    color: 'white',
    fontSize: 18,
    height: 50,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontFamily: 'Roboto-Light',
  },
  textarea: {
    backgroundColor: '#587458',
    color: 'white',
    fontSize: 18,
    height: 120,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingTop: 10,
    textAlignVertical: 'top',
    fontFamily: 'Roboto-Light',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#e45e69',
    borderRadius: 50,
    width: 90,
    height: 90,
    borderColor: '#e6a1a7',
    borderWidth: 3,
    shadowColor: '#05d328',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
  },
  saveButton: {
    padding: 10,
    backgroundColor: '#0ed022',
    borderRadius: 50,
    width: 90,
    height: 90,
    borderColor: 'rgb(0,255,0)',
    borderWidth: 3,
    shadowColor: '#05d328',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#9ccc9c',
    borderColor: '#b6e2b6',
    opacity: 0.5,
  },
  saveText: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
  },
});
