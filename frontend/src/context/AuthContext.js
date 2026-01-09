import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    // Verify token on mount
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    // Try server verification, fall back to localStorage-based user if server not available
    try {
      const response = await fetch("http://localhost:3002/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        // server rejected token -> clear
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Server not reachable — try to restore user from localStorage
      try {
        const localUser = JSON.parse(localStorage.getItem("user"));
        if (localUser) {
          setUser(localUser);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (e) {
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    // Try server login; if it fails (network), fall back to local users
    try {
      const response = await fetch("http://localhost:3002/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      // Network or server error — try local fallback
      console.warn("Server login failed, attempting local fallback:", error.message);
      const usersJson = localStorage.getItem("local_users");
      const users = usersJson ? JSON.parse(usersJson) : [];
      const found = users.find((u) => u.email === email && u.password === password);
      if (found) {
        const fakeToken = `local-${Date.now()}`;
        setToken(fakeToken);
        setUser({ id: found.id || null, email: found.email, username: found.username });
        setIsAuthenticated(true);
        localStorage.setItem("token", fakeToken);
        localStorage.setItem("user", JSON.stringify({ id: found.id || null, email: found.email, username: found.username }));
        return { token: fakeToken, user: { id: found.id || null, email: found.email, username: found.username } };
      }

      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (email, username, password, confirmPassword) => {
    // Try server signup; if server unavailable, store locally for dev/testing
    try {
      const response = await fetch("http://localhost:3002/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password, confirmPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      // Server not available — fallback to local store for development
      console.warn("Server signup failed, using local fallback:", error.message);
      const usersJson = localStorage.getItem("local_users");
      const users = usersJson ? JSON.parse(usersJson) : [];
      // check if email/username exists
      if (users.find((u) => u.email === email)) {
        throw new Error("Email already registered (local)");
      }
      if (users.find((u) => u.username === username)) {
        throw new Error("Username already taken (local)");
      }

      const newUser = { id: `local-${Date.now()}`, email, username, password };
      users.push(newUser);
      localStorage.setItem("local_users", JSON.stringify(users));

      const fakeToken = `local-${Date.now()}`;
      setToken(fakeToken);
      setUser({ id: newUser.id, email: newUser.email, username: newUser.username });
      setIsAuthenticated(true);
      localStorage.setItem("token", fakeToken);
      localStorage.setItem("user", JSON.stringify({ id: newUser.id, email: newUser.email, username: newUser.username }));
      return { token: fakeToken, user: { id: newUser.id, email: newUser.email, username: newUser.username } };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        signup,
        logout,
        verifyToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
