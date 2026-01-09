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
    <div className="flex flex-row gap-4 w-fit p-4 border border-gray-300 rounded-lg shadow-md bg-white dark:bg-gray-800 min-w-80 mr-4">
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
      <button onClick={() => setEditMode(!editMode)}>
        {editMode ? "Save" : "Edit"}
      </button>
      {editMode && <button onClick={handleUpdate}>Save</button>}
      <button onClick={handleRemove}>Remove</button>
    </div>
  );
};

export default Category;
