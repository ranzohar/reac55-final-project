import { firebaseLogout, useAuth } from "../firebase/log-utils";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    <span
      className="text-blue-500 underline! text-sm cursor-pointer bg-transparent p-0"
      onClick={logOutFromFirebase}
    >
      Log Out
    </span>
  );
};

export default SignOut;
