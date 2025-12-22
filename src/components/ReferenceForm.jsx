import { useEffect } from "react";

function ReferenceForm({
  values,
  isSaving,
  editingRef,
  error,
  isDirty,
  onChange,
  onSubmit,
  onCancel,
}) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape" && editingRef) {
        onCancel();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editingRef, onCancel]);

  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        onSubmit(e);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onSubmit]);

  return (
    <form onSubmit={onSubmit} className="form">
      <input
        placeholder="Link zur Referenz"
        value={values.link}
        onChange={(e) => onChange({ link: e.target.value })}
        required
        className="input"
      />

      <select
        value={values.category}
        onChange={(e) => onChange({ category: e.target.value })}
        className="select"
      >
        <option>Licht</option>
        <option>Pose</option>
        <option>Farbe</option>
        <option>Komposition</option>
      </select>

      <textarea
        placeholder="Warum ist dieses Foto gut?"
        value={values.note}
        onChange={(e) => onChange({ note: e.target.value })}
        className="textarea"
      />

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="submit" disabled={isSaving || !values.link || !isDirty}>
          {isSaving
            ? "Speichern..."
            : editingRef
            ? "Änderungen speichern"
            : "Speichern"}
        </button>

        {editingRef && (
          <button type="button" onClick={onCancel}>
            Abbrechen
          </button>
        )}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default ReferenceForm;
