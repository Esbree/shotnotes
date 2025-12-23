import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useReferences } from "./hooks/useReferences";
import ReferenceForm from "./components/ReferenceForm";
import ReferenceList from "./components/ReferenceList";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");

  const [formValues, setFormValues] = useState({
    link: "",
    category: "Licht",
    note: "",
  });

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Alle");
  const [justSaved, setJustSaved] = useState(false);

  const {
    references,
    editingRef,
    setEditingRef,
    isSaving,
    error,
    saveReference,
    deleteReference,
  } = useReferences(user);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function signIn() {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (!error) alert("Check deine E-Mails ✉️");
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

  const isDirty =
    !editingRef ||
    formValues.link !== editingRef.link ||
    formValues.category !== editingRef.category ||
    formValues.note !== editingRef.note;

  return (
    <div className="container">
      <h1>ShotNotes</h1>

      {!user ? (
        <>
          <input
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={signIn} className="button">
            Login
          </button>
        </>
      ) : (
        <>
          <button onClick={signOut} className="button">
            Logout
          </button>

          <ReferenceForm
            values={formValues}
            isSaving={isSaving}
            editingRef={editingRef}
            error={error}
            isDirty={isDirty}
            justSaved={justSaved}
            onChange={(changes) => setFormValues((v) => ({ ...v, ...changes }))}
            onCancel={() => {
              setEditingRef(null);
              setFormValues({ link: "", category: "Licht", note: "" });
            }}
            onSubmit={async (e) => {
              e.preventDefault();

              await saveReference(formValues);

              setJustSaved(true);
              setTimeout(() => setJustSaved(false), 2000);

              setFormValues({
                link: "",
                category: "Licht",
                note: "",
              });
            }}
          />

          <hr />

          <input
            placeholder="Suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

          <ReferenceList
            references={filteredReferences}
            editingRef={editingRef}
            onEdit={(ref) => {
              setEditingRef(ref);
              setFormValues({
                link: ref.link,
                category: ref.category,
                note: ref.note,
              });
            }}
            onDelete={deleteReference}
          />
        </>
      )}
    </div>
  );
}

export default App;
