import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { firebaseLogout, useAuth } from "@/firebase";

const SignOut = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/");
    }
  }, [user, loading]);

  const logOutFromFirebase = async () => {
    await firebaseLogout();
    sessionStorage.clear();
  };
  return (
    <a className="sign-out" onClick={logOutFromFirebase}>
      Log Out
    </a>
  );
};

export default SignOut;
