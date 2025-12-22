function ReferenceForm({
  values,
  isSaving,
  editingRef,
  error,
  onChange,
  onSubmit,
  onCancel,
}) {
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
        <button type="submit" disabled={isSaving || !values.link}>
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
