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
    <div className="flex flex-row max-w-xl border border-gray-300 dark:border-gray-700 rounded-xl p-4 mb-1 bg-white dark:bg-gray-900 shadow-sm gap-2">
      {!editMode && <strong className="self-center">{nameUpdate}</strong>}
      {editMode && (
        <input
          type="text"
          value={nameUpdate}
          onChange={(e) => setNameUpdate(e.target.value)}
          style={{ width: `${Math.max(nameUpdate.length + 2, 1)}ch` }}
          className="font-bold border px-1"
        />
      )}
      <button
        onClick={() => {
          if (editMode) {
            handleUpdate(); // save first
          } else {
            setEditMode(true); // enter edit mode
          }
        }}
      >
        {editMode ? "Save" : "Edit"}
      </button>
      <button onClick={handleRemove}>Remove</button>
    </div>
  );
};

export default Category;
