function ReferenceItem({ refData, onEdit, onDelete, isEditing }) {
  return (
    <li className={`reference-item ${isEditing ? "is-editing" : ""}`}>
      <span className={`category-badge ${refData.category}`}>
        {refData.category}
      </span>
      <br />

      <a href={refData.link} target="_blank" rel="noreferrer">
        {refData.link}
      </a>
      <br />

      <em className="note-text">{refData.note}</em>
      <br />

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        <button
          onClick={() => onEdit(refData)}
          className="button button--secondary"
        >
          Ändern
        </button>

        <button
          onClick={() => onDelete(refData.id)}
          className="button button--danger"
        >
          Löschen
        </button>
      </div>
    </li>
  );
}

export default ReferenceItem;
