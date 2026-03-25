import useAuth from "@/firebase/hooks/useAuth";

const useAuthHook = () => {
  return useAuth();
};

export { useAuthHook as useAuth };
