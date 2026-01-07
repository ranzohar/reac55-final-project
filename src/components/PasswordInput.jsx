import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function PasswordInput({ value, onChange }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative w-64">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="current-password"
        required
        className="input-base pr-10"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-9 flex items-center justify-center p-0 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
        style={{
          background: "none",
          border: "none",
          outline: "none",
        }}
      >
        {visible ? (
          <EyeSlashIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}

export default PasswordInput;
