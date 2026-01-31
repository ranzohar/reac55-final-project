import { useState } from "react";

const Category = ({
  name,
  id,
  updateExistingCategory,
  removeExistingCategory,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [nameUpdate, setNameUpdate] = useState(name || "");

  if (!name) return null;

  const handleUpdate = () => {
    if (!nameUpdate) {
      setNameUpdate(name);
      return;
    }
    if (nameUpdate !== name) {
      updateExistingCategory(id, nameUpdate);
    }
    setEditMode(false);
  };

  const handleRemove = () => {
    removeExistingCategory(id);
  };

  return (
    <div className="card-category">
      {!editMode && <strong className="self-center">{nameUpdate}</strong>}
      {editMode && (
        <input
          type="text"
          id={`category-edit-${id}`}
          name={`category-${id}`}
          value={nameUpdate}
          onChange={(e) => setNameUpdate(e.target.value)}
          style={{ width: `${Math.max(nameUpdate.length + 2, 1)}ch` }}
          className="font-bold border px-1"
        />
      )}
      <button
        className="btn-grey-small"
        onClick={() => {
          if (editMode) {
            handleUpdate();
          } else {
            setEditMode(true);
          }
        }}
      >
        {editMode ? "Save" : "Edit"}
      </button>
      <button className="btn-grey-small" onClick={handleRemove}>
        Remove
      </button>
    </div>
  );
};

export default Category;
