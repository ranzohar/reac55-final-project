import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { updateCategory, removeCategory } from "../firebase/doc-utils";

const Category = ({ categoryId }) => {
  const [editMode, setEditMode] = useState(false);
  const [nameUpdate, setNameUpdate] = useState("");
  const name = useSelector(
    (state) => state.data.categories?.[categoryId]?.name
  );
  useEffect(() => {
    setNameUpdate(name);
  }, [name]);

  if (!name) {
    return;
  }

  const updateCategoryName = async () => {
    if (!nameUpdate) {
      setNameUpdate(name);
      return;
    }
    await updateCategory(categoryId, nameUpdate);
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
      <button
        onClick={() => {
          setEditMode(!editMode);
          updateCategoryName();
        }}
      >
        Update
      </button>
      <button onClick={() => removeCategory(categoryId)}>Remove</button>
    </div>
  );
};

export default Category;
