import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/adapters";

const SignOut = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!user && !loading) {
  //     navigate("/");
  //   }
  // }, [user, loading]); TODO - add websocket to handle from REST API option.

  // Generic signOut function using the current auth adapter
  const signOut = async () => {
    await logout();
    navigate("/");
  };
  return (
    <a className="sign-out" onClick={signOut}>
      Log Out
    </a>
  );
};

export default SignOut;
