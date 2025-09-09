import { User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebaseDb } from './firebase';

export async function ensureUserProfile(user: User): Promise<void> {
	const ref = doc(firebaseDb, 'Users', user.uid);
	const snap = await getDoc(ref);
	if (!snap.exists()) {
		await setDoc(ref, {
			uid: user.uid,
			email: user.email ?? '',
			name: user.displayName ?? '',
			role: 'patient',
			createdAt: serverTimestamp(),
		});
	}
}


