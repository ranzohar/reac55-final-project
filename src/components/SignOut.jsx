import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/adapters";

const SignOut = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate("/");
  };
  return (
    <a className="sign-out" onClick={signOut} style={{ cursor: "pointer" }}>
      Log Out
    </a>
  );
};

export default SignOut;
