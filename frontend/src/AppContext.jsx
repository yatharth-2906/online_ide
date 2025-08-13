import { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    useEffect(() => {
        const verifyLoginStatus = async () => {
            setLoading(true);

            try {
                const response = await fetch(`${import.meta.env.VITE_LOCAL_BACKEND_URL}/auth/validate_token`, {
                    method: 'POST',
                    credentials: 'include',
                });

                if (!response.ok) {
                    console.error("Verification failed");
                    localStorage.removeItem('user');
                    setUser(null);
                    return;
                }

                const data = await response.json();

                if (data.status === 'success') {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setUser(data.user);
                } else {
                    console.error("Verification failed");
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } catch (error) {
                console.error("Verification failed", error);
                localStorage.removeItem('user');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyLoginStatus();
    }, []);

    const logout = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_LOCAL_BACKEND_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            if(!response.ok) 
                alert("Error logging out.");

            const data = await response.json();
            if(data.status === 'success') {
                localStorage.removeItem('user');
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