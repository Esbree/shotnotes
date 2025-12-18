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
    <div
      style={{ padding: "2rem", fontFamily: "'Liberation Mono', monospace" }}
    >
      <h1 style={{ marginBottom: "0.5rem" }}>ShotNotes</h1>
      <p style={{ marginTop: 0, marginBottom: "1.5rem", fontSize: "1.1rem" }}>
        Speichere Fotos nicht nur, verstehe sie.
      </p>

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
        style={{ marginBottom: "2rem" }}
      >
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Link zur Referenz"
          required
          style={{
            padding: "0.5rem",
            fontFamily: "'Liberation Mono', monospace",
            fontSize: "1rem",
            width: "100%",
            marginBottom: "0.75rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "0.5rem",
            fontFamily: "'Liberation Mono', monospace",
            fontSize: "1rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            marginBottom: "0.75rem",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <option>Licht</option>
          <option>Pose</option>
          <option>Farbe</option>
          <option>Komposition</option>
        </select>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Warum ist dieses Foto gut?"
          style={{
            padding: "0.5rem",
            fontFamily: "'Liberation Mono', monospace",
            fontSize: "1rem",
            width: "100%",
            minHeight: "80px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
            resize: "vertical",
            marginBottom: "0.75rem",
          }}
        />

        <button
          type="submit"
          style={{
            backgroundColor: "#0078d7",
            color: "white",
            padding: "0.6rem 1.2rem",
            border: "none",
            borderRadius: "5px",
            fontSize: "1rem",
            cursor: "pointer",
            fontFamily: "'Liberation Mono', monospace",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#005a9e")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#0078d7")}
        >
          Speichern
        </button>
      </form>

      <hr style={{ marginBottom: "1rem" }} />

      <h2 style={{ marginBottom: "0.5rem" }}>Deine Referenzen</h2>

      {filteredReferences.length === 0 && (
        <p>Keine passenden Referenzen gefunden.</p>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "0.5rem",
            fontFamily: "'Liberation Mono', monospace",
            fontSize: "1rem",
            width: "60%",
            marginRight: "1rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            padding: "0.5rem",
            fontFamily: "'Liberation Mono', monospace",
            fontSize: "1rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "35%",
            boxSizing: "border-box",
          }}
        >
          <option>Alle</option>
          <option>Licht</option>
          <option>Pose</option>
          <option>Farbe</option>
          <option>Komposition</option>
        </select>
      </div>

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {filteredReferences.map((ref) => (
          <li
            key={ref.id}
            style={{
              backgroundColor: "white",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
              fontFamily: "'Liberation Mono', monospace",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "0.2rem 0.6rem",
                borderRadius: "12px",
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: "white",
                backgroundColor:
                  ref.category === "Licht"
                    ? "#f5c518"
                    : ref.category === "Pose"
                    ? "#6ec1e4"
                    : ref.category === "Farbe"
                    ? "#a2d5a0"
                    : ref.category === "Komposition"
                    ? "#f08080"
                    : "#888",
              }}
            >
              {ref.category}
            </span>
            <br />
            <a href={ref.link} target="_blank" rel="noreferrer">
              {ref.link}
            </a>
            <br />
            <em style={{ color: "#555", fontSize: "0.9rem" }}>{ref.note}</em>
            <br />

            <button
              onClick={() => deleteReference(ref.id)}
              style={{
                marginTop: "0.5rem",
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                padding: "0.4rem 0.8rem",
                borderRadius: "5px",
                cursor: "pointer",
                fontFamily: "'Liberation Mono', monospace",
                fontSize: "0.9rem",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#c0392b")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#e74c3c")}
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
