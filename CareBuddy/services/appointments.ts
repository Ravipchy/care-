import { addDoc, collection, doc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { firebaseDb } from './firebase';

export type Appointment = {
	userId: string;
	doctorId: string;
	doctorName: string;
	specialization: string;
	dateTime: string; // ISO or slot label for now
	fees: number;
	status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
};

export async function addAppointment(a: Appointment): Promise<void> {
	await addDoc(collection(firebaseDb, 'Appointments'), a);
}

export async function getAppointmentsByUser(userId: string) {
	const q = query(
		collection(firebaseDb, 'Appointments'),
		where('userId', '==', userId),
		orderBy('dateTime', 'desc') as any
	);
	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}


