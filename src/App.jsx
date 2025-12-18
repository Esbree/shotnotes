import { useState } from "react";

function App() {
  const [references, setReferences] = useState([]);
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("Licht");
  const [note, setNote] = useState("");

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

      {references.length === 0 && <p>Noch keine Referenzen.</p>}

      <ul>
        {references.map((ref) => (
          <li key={ref.id} style={{ marginBottom: "1rem" }}>
            <strong>{ref.category}</strong>
            <br />
            <a href={ref.link} target="_blank">
              {ref.link}
            </a>
            <br />
            <em>{ref.note}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
