import React, { useState, useEffect } from "react";
import PouchDB from "pouchdb";

const db = new PouchDB("notes");

export default function NoteComponent({ track }) {
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState("");

  useEffect(() => {
    if (!track) return;

    // Load the existing note for this track
    db.get(track.uri)
      .then((doc) => setSavedNote(doc.note))
      .catch(() => setSavedNote("")); // If no note exists, clear it
  }, [track]);

  const handleSave = async () => {
    if (!track) return;

    try {
      const existingDoc = await db.get(track.uri);
      await db.put({ ...existingDoc, note });
    } catch {
      await db.put({ _id: track.uri, note });
    }

    setSavedNote(note);
  };

  return (
    <div className="note-container">
      <h5>Notes for: {track?.title || "Select a track"}</h5>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write your note here..."
        style={{ width: "100%", minHeight: "100px", margin: "10px 0" }}
      />
      <button onClick={handleSave} className="btn btn-primary">
        Save Note
      </button>
      {savedNote && (
        <div style={{ marginTop: "10px" }}>
          <strong>Saved Note:</strong>
          <p>{savedNote}</p>
        </div>
      )}
    </div>
  );
}
