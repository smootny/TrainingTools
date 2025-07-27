import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useNotesStore } from '../../hooks/useNotesStore';
import { LinearGradient } from 'expo-linear-gradient';
import CustomInput from '@/components/CustomInput';
import CustomLabel from '@/components/CustomLabel';
import SmallButton from '@/components/SmallButton';

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
          keyboardVerticalOffset={10}
        >
          <View style={styles.form}>
            <CustomLabel style={styles.label}>Title</CustomLabel>
            
            <CustomInput
            style={styles.input}
            value={title}
            placeholder="Enter title"
            onChangeText={setTitle}
            placeholderTextColor="#ccc"
            />

            <CustomLabel style={styles.label}>Content</CustomLabel>
            <CustomInput
            style={styles.textarea}
            value={body}
            placeholder="Enter content"
            onChangeText={setBody}
            placeholderTextColor="#ccc"
            multiline
            />

            <View style={styles.buttonContainer}>
              <SmallButton
              title='Cancel'
              onPress={handleCancel}
              variant="red"
              /> 
              <SmallButton
              title="Add"
              onPress={handleSave}
              disabled={!inputsFilled}
              variant='green'
              />
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
    padding: 20,
    height: 400,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  label: {
    textAlign: 'left',
  },
  input: {
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 2
  },
  textarea: {
    height: 120,
    borderRadius: 10,
    paddingHorizontal: 2
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
});
