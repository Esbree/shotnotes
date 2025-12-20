import React, { useState, useEffect } from "react";

function App() {
  const [references, setReferences] = useState([]);
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("Licht");
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Alle");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedRefs = localStorage.getItem("shotnotes-references");
    if (storedRefs) {
      setReferences(JSON.parse(storedRefs));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("shotnotes-references", JSON.stringify(references));
  }, [references, isLoaded]);

  function deleteReference(id) {
    setReferences(references.filter((ref) => ref.id !== id));
  }

  const filteredReferences = references.filter((ref) => {
    const matchesSearch =
      ref.link.toLowerCase().includes(search.toLowerCase()) ||
      ref.note.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      filterCategory === "Alle" || ref.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container">
      <h1 className="header">ShotNotes</h1>
      <p className="description">Speichere Fotos nicht nur, verstehe sie.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          const newRef = {
            id: Date.now(),
            link,
            category,
            note,
          };

          setReferences([newRef, ...references]);

          setLink("");
          setNote("");
          setCategory("Licht");
        }}
        className="form"
      >
        <input
          placeholder="Link zur Referenz"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
          className="input"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select"
        >
          <option>Licht</option>
          <option>Pose</option>
          <option>Farbe</option>
          <option>Komposition</option>
        </select>

        <textarea
          placeholder="Warum ist dieses Foto gut?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="textarea"
        />

        <button type="submit" className="button-primary">
          Speichern
        </button>
      </form>

      <hr className="separator" />

      <h2 className="subheader">Deine Referenzen</h2>

      <div className="filter-bar">
        <input
          placeholder="Suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="category-select"
        >
          <option>Alle</option>
          <option>Licht</option>
          <option>Pose</option>
          <option>Farbe</option>
          <option>Komposition</option>
        </select>
      </div>

      <ul className="reference-list">
        {filteredReferences.length === 0 && (
          <p>Keine passenden Referenzen gefunden.</p>
        )}
        {filteredReferences.map((ref) => (
          <li key={ref.id} className="reference-item">
            <span className={`category-badge ${ref.category}`}>
              {ref.category}
            </span>
            <br />
            <a href={ref.link} target="_blank" rel="noreferrer">
              {ref.link}
            </a>
            <br />
            <em className="note-text">{ref.note}</em>
            <br />
            <button
              onClick={() => deleteReference(ref.id)}
              className="delete-button"
            >
              Löschen
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
