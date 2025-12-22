import ReferenceItem from "./ReferenceItem";

function ReferenceList({ references, editingRef, onEdit, onDelete }) {
  if (references.length === 0) {
    return <p>Keine passenden Referenzen gefunden.</p>;
  }

  return (
    <ul className="reference-list">
      {references.map((ref) => (
        <ReferenceItem
          key={ref.id}
          refData={ref}
          isEditing={editingRef?.id === ref.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default ReferenceList;
