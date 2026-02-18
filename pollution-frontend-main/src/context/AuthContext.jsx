import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const fetchProfile = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await API.get("/auth/profile");
      setUser(res.data);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (credentials) => {
    const res = await API.post("/auth/login", credentials);
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    return res.data;
  };

  const register = async (payload) => API.post("/auth/register", payload);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      register,
      logout,
      refreshProfile: fetchProfile
    }),
    [token, user, loading, fetchProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
