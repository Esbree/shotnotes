import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");

  const [references, setReferences] = useState([]);
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("Licht");
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Alle");

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setReferences([]);
      return;
    }

    async function loadReferences() {
      const { data, error } = await supabase
        .from("references")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setReferences(data);
      }
    }

    loadReferences();
  }, [user]);

  async function deleteReference(id) {
    const { error } = await supabase.from("references").delete().eq("id", id);

    if (error) {
      alert(error.message);
    }
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      alert(error.message);
    } else {
      alert("Check deine E-Mails für den Login-Link ✉️");
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
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

      {!user ? (
        <div style={{ marginBottom: "1.5rem" }}>
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={signIn}>Login / Signup</button>
        </div>
      ) : (
        <div style={{ marginBottom: "1.5rem" }}>
          <span>Angemeldet</span>
          <button onClick={signOut}>Logout</button>
        </div>
      )}

      {user && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setIsSaving(true);
            setSaveError(null);

            const { error } = await supabase.from("references").insert([
              {
                user_id: user.id,
                link,
                category,
                note,
              },
            ]);

            if (error) {
              setSaveError(error.message);
            } else {
              setLink("");
              setNote("");
              setCategory("Licht");
            }

            setIsSaving(false);
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

          <button
            type="submit"
            className="button-primary"
            disabled={isSaving || !link}
          >
            {isSaving ? "Speichern..." : "Speichern"}
          </button>

          {saveError && (
            <p style={{ color: "red", marginTop: "0.5rem" }}>{saveError}</p>
          )}
        </form>
      )}

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
