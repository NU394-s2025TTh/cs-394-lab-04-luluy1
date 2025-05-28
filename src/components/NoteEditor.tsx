// REFERENCE SOLUTION - Do not distribute to students
// src/components/NoteEditor.tsx
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// TODO: Import the saveNote function from your noteService call this to save the note to firebase
import { saveNote } from '../services/noteService';
import { Note } from '../types/Note';

interface NoteEditorProps {
  initialNote?: Note;
  onSave?: (note: Note) => void;
}
const NoteEditor: React.FC<NoteEditorProps> = ({ initialNote, onSave }) => {
  // State for the current note being edited

  const [note, setNote] = useState<Note>(() => {
    return (
      initialNote || {
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      }
    );
  });

  // TODO: create state for saving status
  const [isSaving, setIsSaving] = useState<boolean>(false);
  // TODO: createState for error handling
  const [error, setError] = useState<string | null>(null);

  // TODO: Update local state when initialNote changes in a useEffect (if editing an existing note)
  // This effect runs when the component mounts or when initialNote changes
  // It sets the note state to the initialNote if provided, or resets to a new empty note, with a unique ID
  useEffect(() => {
    if (initialNote) {
      setNote(initialNote);
    } else {
      setNote({
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      });
    }
    console.log('NoteEditor initialized with note:', initialNote);
  }, [initialNote]);
  //TODO: on form submit create a "handleSubmit" function that saves the note to Firebase and calls the onSave callback if provided
  // This function should also handle any errors that occur during saving and update the error state accordingly
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Update lastUpdated timestamp
      const updatedNote = { ...note, lastUpdated: Date.now() };
      await saveNote(updatedNote);
      setIsSaving(false);
      if (onSave) {
        onSave(updatedNote);
      }
      setNote({
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      });
    } catch (err) {
      setIsSaving(false);
      setError('Failed to save note');
      console.error('Error saving note:', err);
    }
  };
  // TODO: for each form field; add a change handler that updates the note state with the new value from the form
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
      lastUpdated: Date.now(),
    }));
  };
  // TODO: disable fields and the save button while saving is happening
  // TODO: for the save button, show "Saving..." while saving is happening and "Save Note" when not saving
  // TODO: show an error message if there is an error saving the note
  return (
    <form className="note-editor" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={note.title}
          required
          placeholder="Enter note title"
          onChange={handleChange}
          disabled={isSaving}
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={note.content}
          rows={5}
          required
          placeholder="Enter note content"
          onChange={handleChange}
          disabled={isSaving}
        />
      </div>
      <div className="form-actions">
        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : initialNote ? 'Update Note' : 'Save Note'}
        </button>
      </div>
      <div className="error-message">{error && <p className="error">{error}</p>}</div>
    </form>
  );
};

export default NoteEditor;
