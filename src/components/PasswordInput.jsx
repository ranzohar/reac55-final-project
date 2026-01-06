import { useState } from "react";

function PasswordInput({ value, onChange }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="current-password"
        required
        className="input-base"
      />
      <button type="button" onClick={() => setVisible((v) => !v)}>
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}

export default PasswordInput;
