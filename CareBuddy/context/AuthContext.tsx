import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { firebaseAuth } from '../services/firebase';

type AuthContextValue = {
	user: User | null;
	loading: boolean;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsub = onAuthStateChanged(firebaseAuth, (u) => {
			setUser(u);
			setLoading(false);
		});
		return () => unsub();
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			loading,
			logout: () => signOut(firebaseAuth),
		}),
		[user, loading]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
};


