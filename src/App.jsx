import { useState, useEffect } from "react";

function App() {
  const [references, setReferences] = useState([]);
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("Licht");
  const [note, setNote] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Alle");

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
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>ShotNotes</h1>
      <p>Speichere Fotos nicht nur, verstehe sie.</p>

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
      >
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Link zur Referenz"
          required
        />
        <br />
        <br />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Licht</option>
          <option>Pose</option>
          <option>Farbe</option>
          <option>Komposition</option>
        </select>
        <br />
        <br />

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Warum ist dieses Foto gut?"
        />
        <br />
        <br />

        <button>Speichern</button>
      </form>

      <hr />

      <h2>Deine Referenzen</h2>

      {filteredReferences.length === 0 && (
        <p>Keine passenden Referenzen gefunden.</p>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: "1rem" }}
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option>Alle</option>
          <option>Licht</option>
          <option>Pose</option>
          <option>Farbe</option>
          <option>Komposition</option>
        </select>
      </div>

      <ul>
        {filteredReferences.map((ref) => (
          <li key={ref.id} style={{ marginBottom: "1rem" }}>
            <strong>{ref.category}</strong>
            <br />
            <a href={ref.link} target="_blank" rel="noreferrer">
              {ref.link}
            </a>
            <br />
            <em>{ref.note}</em>
            <br />

            <button
              onClick={() => deleteReference(ref.id)}
              style={{ marginTop: "0.5rem" }}
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
