import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isDoctor: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isDoctor: false,
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

const appAuth = auth;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    console.log("AuthProvider: Rendering");
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDoctor, setIsDoctor] = useState(false);

    useEffect(() => {
        console.log("AuthProvider: useEffect starting");
        // @ts-ignore
        const unsubscribe = onAuthStateChanged(appAuth, async (usr) => {
            console.log("AuthProvider: Auth State Changed. User:", usr ? usr.email : "null");
            setUser(usr);

            // Check if user is a doctor
            if (usr) {
                try {
                    const doctorDoc = await getDoc(doc(db, 'doctors', usr.uid));
                    const isDoctorUser = doctorDoc.exists();
                    setIsDoctor(isDoctorUser);
                    console.log("AuthProvider: User is doctor:", isDoctorUser);
                } catch (error) {
                    console.log("AuthProvider: Error checking doctor status:", error);
                    setIsDoctor(false);
                }
            } else {
                setIsDoctor(false);
            }

            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const logout = async () => {
        // @ts-ignore
        await firebaseSignOut(appAuth);
        setIsDoctor(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, isDoctor, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
