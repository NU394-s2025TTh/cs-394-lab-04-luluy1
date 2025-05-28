// REFERENCE SOLUTION - Do not distribute to students
// src/services/noteService.ts
// [DONE] TODO: Import functions like setDoc, deleteDoc, onSnapshot from Firebase Firestore to interact with the database
import {
  deleteDoc,
  DocumentData,
  onSnapshot,
  QuerySnapshot,
  setDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { collection, doc } from 'firebase/firestore';

// TODO: Import the Firestore instance from your Firebase configuration file
import { db } from '../firebase-config';
import { Note, Notes } from '../types/Note';

const NOTES_COLLECTION = 'notes';

/**
 * Creates or updates a note in Firestore
 * @param note Note object to save
 * @returns Promise that resolves when the note is saved
 */
export async function saveNote(note: Note): Promise<void> {
  // TODO: save the note to Firestore in the NOTES_COLLECTION collection
  // Use setDoc to create or update the note document; throw an error if it fails

  const noteRef = doc(collection(db, NOTES_COLLECTION), note.id);
  const lastUpdated = note.lastUpdated ?? Date.now();

  try {
    await setDoc(noteRef, {
      ...note,
      lastUpdated: lastUpdated,
    });
  } catch (error) {
    throw new Error(
      `Failed to save note: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Deletes a note from Firestore
 * @param noteId ID of the note to delete
 * @returns Promise that resolves when the note is deleted
 */
export async function deleteNote(noteId: string): Promise<void> {
  // TODO: delete the note from Firestore in the NOTES_COLLECTION collection
  // Use deleteDoc to remove the note document; throw an error if it fails
  const noteRef = doc(collection(db, NOTES_COLLECTION), noteId);
  try {
    await deleteDoc(noteRef);
  } catch (error) {
    throw new Error(
      `Failed to delete note: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Transforms a Firestore snapshot into a Notes object
 * @param snapshot Firestore query snapshot
 * @returns Notes object with note ID as keys
 */
export function transformSnapshot(snapshot: QuerySnapshot<DocumentData>): Notes {
  const notes: Notes = {};
  snapshot.docs.forEach((doc) => {
    const noteData = doc.data() as Note;
    console.log('Note data:', noteData);
    notes[doc.id] = noteData;
  });
  console.log('Transformed notes:', notes);
  return notes;
}

/**
 * Subscribes to changes in the notes collection
 * @param onNotesChange Callback function to be called when notes change
 * @param onError Optional error handler for testing
 * @returns Unsubscribe function to stop listening for changes
 */

export function subscribeToNotes(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onNotesChange: (notes: Notes) => void,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onError?: (error: Error) => void,
): Unsubscribe {
  // TODO: subscribe to the notes collection in Firestore
  // Use onSnapshot to listen for changes; call onNotesChange with the transformed notes
  // Handle errors by calling onError if provided
  // Return s proper (not empty) unsubscribe function to stop listening for changes
  const notesRef = collection(db, NOTES_COLLECTION);
  console.log('Subscribing to notes collection:', notesRef.path);
  const unsubscribe = onSnapshot(
    notesRef,
    (snapshot) => {
      const notes = transformSnapshot(snapshot);
      console.log('Notes snapshot received:', notes);
      onNotesChange(notes);
    },
    (error) => {
      if (onError) {
        onError(error);
      }
    },
  );
  return () => {
    unsubscribe();
  };
}
