function ReferenceItem({ refData, onEdit, onDelete }) {
  return (
    <li className="reference-item">
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

      <button onClick={() => onEdit(refData)}>Bearbeiten</button>
      <button onClick={() => onDelete(refData.id)} className="delete-button">
        Löschen
      </button>
    </li>
  );
}

export default ReferenceItem;
