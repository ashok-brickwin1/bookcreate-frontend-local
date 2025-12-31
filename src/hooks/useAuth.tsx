import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthUser {
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => void;
  setAuthUser: (email: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: () => {},
  setAuthUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial load (page refresh)
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("user_email");

    if (token && email) {
      setUser({ email: JSON.parse(email) });
    }

    setLoading(false);
  }, []);

  // 🔥 This is the key
  const setAuthUser = (email: string) => {
  console.log("AuthContext setAuthUser called with", email);
  setUser({ email });
};

  const signOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signOut, setAuthUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
