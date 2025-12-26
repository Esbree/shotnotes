import { useEffect, useRef, useState } from "react";

function ReferenceForm({
  values,
  isSaving,
  editingRef,
  error,
  isDirty,
  justSaved,
  onChange,
  onSubmit,
  onCancel,
}) {
  const linkInputRef = useRef(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (editingRef && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [editingRef]);

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

  useEffect(() => {
    if (justSaved) {
      // Show + reset exit
      setShowFeedback(true);
      setIsExiting(false);
    } else if (showFeedback) {
      // Trigger exit animation
      setIsExiting(true);

      const timeout = setTimeout(() => {
        setShowFeedback(false);
        setIsExiting(false);
      }, 160); // match fadeDown duration

      return () => clearTimeout(timeout);
    }
  }, [justSaved, showFeedback]);

  return (
    <form onSubmit={onSubmit} className="form">
      <input
        ref={linkInputRef}
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
        <button
          type="submit"
          className={`button button--primary ${justSaved ? "is-success" : ""}`}
          disabled={isSaving || !values.link || !isDirty}
        >
          <span className="label">Speichern</span>
          <span className="check">✓</span>
        </button>

        {editingRef && (
          <button
            type="button"
            onClick={onCancel}
            className="button button--secondary"
          >
            Abbrechen
          </button>
        )}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default ReferenceForm;
