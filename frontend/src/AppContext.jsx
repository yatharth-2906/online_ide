import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // ✅ Safely parse user from localStorage
  let initialUser = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) initialUser = JSON.parse(storedUser);
  } catch (err) {
    console.error("Failed to parse user from localStorage", err);
  }

  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    const verifyLoginStatus = async () => {
      setLoading(true);

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_LOCAL_BACKEND_URL}/auth/validate_token`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!response.ok) {
          console.error("Verification failed");
          localStorage.removeItem("user");
          setUser(null);
          return;
        }

        const data = await response.json();

        if (data.status === "success") {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        } else {
          console.error("Verification failed");
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (error) {
        console.error("Verification failed", error);
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyLoginStatus();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOCAL_BACKEND_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        alert("Error logging out.");
        return;
      }

      const data = await response.json();
      if (data.status === "success") {
        localStorage.removeItem("user");
        setUser(null);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AppContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AppContext.Provider>
  );
};
