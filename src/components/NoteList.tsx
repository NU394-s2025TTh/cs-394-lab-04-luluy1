// src/components/NoteList.tsx
import React from 'react';
import { useEffect } from 'react';

import { subscribeToNotes } from '../services/noteService';
import { Note, Notes } from '../types/Note';
import NoteItem from './NoteItem';

interface NoteListProps {
  onEditNote?: (note: Note) => void;
}
const NoteList: React.FC<NoteListProps> = ({ onEditNote }) => {
  // TODO: load notes using subscribeToNotes from noteService, use useEffect to manage the subscription; try/catch to handle errors (see lab 3)
  // TODO: handle unsubscribing from the notes when the component unmounts
  useEffect(() => {
    try {
      // This effect runs when the component mounts and sets up the subscription
      const unsubscribe = subscribeToNotes(
        (notes) => {
          console.log('Notes loaded:', notes);
          setNotes(notes);
          setLoading(false);
        },
        (error) => {
          setError(`Error loading notes: ${error.message}`);
          setLoading(false);
        },
      );

      // Cleanup function to unsubscribe when the component unmounts
      return () => {
        unsubscribe();
      };
    } catch (error) {
      setError(`Error loading notes: ${error}`);
      setLoading(false);
    }
  }, []);
  // TODO: manage state for notes, loading status, and error message
  const [notes, setNotes] = React.useState<Notes>({});
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  // TODO: display a loading message while notes are being loaded; error message if there is an error

  // Notes is a constant in this template but needs to be a state variable in your implementation and load from firestore
  // const notes: Notes = {
  //   '1': {
  //     id: '1',
  //     title: 'Note 1',
  //     content: 'This is the content of note 1.',
  //     lastUpdated: Date.now() - 100000,
  //   },
  // };

  return (
    <div className="note-list">
      {loading ? (
        <p>Loading notes...</p>
      ) : error ? (
        <p className="error">Error loading notes: {error}</p>
      ) : (
        <>
          <h2>Notes</h2>
          {Object.values(notes).length === 0 ? (
            <p>No notes yet. Create your first note!</p>
          ) : (
            <div className="notes-container">
              {Object.values(notes)
                // Sort by lastUpdated (most recent first)
                .sort((a, b) => b.lastUpdated - a.lastUpdated)
                .map((note) => (
                  <NoteItem key={note.id} note={note} onEdit={onEditNote} />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NoteList;
