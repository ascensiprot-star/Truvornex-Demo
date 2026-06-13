import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [authError, setAuthError] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        checkUserAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUser(session.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkUserAuth = async () => {
        try {
            setIsLoadingAuth(true);
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) throw error;
            
            if (session?.user) {
                setUser(session.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('User auth check failed:', error);
            setAuthError({
                type: 'auth_error',
                message: error.message
            });
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoadingAuth(false);
            setAuthChecked(true);
        }
    };

    const logout = async (shouldRedirect = true) => {
        await supabase.auth.signOut();
        setUser(null);
        setIsAuthenticated(false);
        if (shouldRedirect) {
            window.location.href = '/login';
        }
    };

    const navigateToLogin = () => {
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoadingAuth,
            authError,
            authChecked,
            logout,
            navigateToLogin,
            checkUserAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
