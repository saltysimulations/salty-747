import { User } from "navigraph/auth";
import React, { useState, useEffect, useContext, createContext } from "react";
import { auth } from "../lib/navigraph";

interface NavigraphAuthContext {
    initialized: boolean;
    user: User | null;
    signIn: typeof auth.signInWithDeviceFlow;
}

const authContext = createContext<NavigraphAuthContext>({
    initialized: false,
    user: null,
    signIn: () => Promise.reject("Not initialized"),
});

// Provider hook that creates auth object and handles state
function useProvideAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [initialized, setinitialized] = useState(false);

    // Subscribe to user on mount
    // Because this sets state in the callback it will cause any
    // component that utilizes this hook to re-render with the latest auth object.
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
            if (!initialized) setinitialized(true);
            setUser(u);
        });
        // Cleanup subscription on unmount
        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        user,
        initialized,
        signIn: auth.signInWithDeviceFlow,
    };
}

// Provider component that wraps your app and makes auth object
// available to any child component that calls useAuth().
export function NavigraphAuthProvider({ children }: { children: React.ReactNode }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object
// and re-render when it changes.
export const useNavigraphAuth = () => {
    return useContext(authContext);
};
