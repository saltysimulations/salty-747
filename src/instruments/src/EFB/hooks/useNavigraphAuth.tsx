import React, { useState, useEffect, useContext, createContext } from "react";

import { DeviceAuthorizationParams, NavigraphAPI, User } from "../lib/navigraph";

const navigraph = new NavigraphAPI();

interface NavigraphAuthContext {
    authParams: DeviceAuthorizationParams | null;
    user: User | null;
    signIn: typeof navigraph.signIn;
    signOut: typeof navigraph.signOut;
    getChartIndex: typeof navigraph.getChartIndex;
    getChartImage: typeof navigraph.getChartImage;
    initialized: boolean;
}

const authContext = createContext<NavigraphAuthContext>({
    authParams: null,
    user: null,
    signIn: () => Promise.reject("Not initialized"),
    signOut: () => Promise.reject("Not initialized"),
    getChartIndex: () => Promise.reject("Not initialized"),
    getChartImage: () => Promise.reject("Not initialized"),
    initialized: false,
});

// Provider hook that creates auth object and handles state
function useProvideAuth() {
    const [user, setUser] = useState<null | User>(null);
    const [authParams, setAuthParams] = useState<DeviceAuthorizationParams | null>(null);
    const [initialized, setInitialized] = useState<boolean>(false);

    // Subscribe to user on mount
    // Because this sets state in the callback it will cause any
    // component that utilizes this hook to re-render with the latest auth object.
    useEffect(() => {
        const unsubscribe = navigraph.onAuthStateChanged(async () => {
            setInitialized(navigraph.isInitialized());
            setAuthParams(navigraph.getDeviceAuthorizationParams());
            setUser(await navigraph.getUser());
        });
        // Cleanup subscription on unmount
        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        user,
        authParams,
        signIn: () => navigraph.signIn(),
        signOut: () => navigraph.signOut(),
        getChartIndex: (icao: string) => navigraph.getChartIndex(icao),
        getChartImage: (url: string) => navigraph.getChartImage(url),
        initialized,
    };
}

// Provider component that wraps your app and makes auth object
// available to any child component that calls useAuth().
export function NavigraphAuthProvider({children}: {
    children: React.ReactNode;
}) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object
// and re-render when it changes.
export const useNavigraphAuth = () => {
    return useContext(authContext);
};
