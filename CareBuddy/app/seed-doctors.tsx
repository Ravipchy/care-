import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { addDoc, collection } from 'firebase/firestore';
import { firebaseDb } from '../services/firebase';

const SAMPLE = [
	{
		name: 'Dr. Priya Sharma',
		specialization: 'Cardiologist',
		location: { lat: 28.6139, lng: 77.2090 },
		availability: ['09:00', '10:00', '14:00'],
		fees: 600,
	},
	{
		name: 'Dr. Aman Verma',
		specialization: 'Dentist',
		location: { lat: 19.0760, lng: 72.8777 },
		availability: ['11:00', '15:00', '17:00'],
		fees: 400,
	},
	{
		name: 'Dr. Neha Gupta',
		specialization: 'Dermatologist',
		location: { lat: 13.0827, lng: 80.2707 },
		availability: ['10:30', '12:00', '16:30'],
		fees: 500,
	},
];

export default function SeedDoctorsScreen() {
	const [done, setDone] = useState(false);

	const seed = async () => {
		for (const d of SAMPLE) {
			await addDoc(collection(firebaseDb, 'Doctors'), d);
		}
		setDone(true);
	};

	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
			<Text>Seed Doctors collection with sample data</Text>
			<Button mode="contained" onPress={seed} disabled={done}>{done ? 'Seeded' : 'Seed Now'}</Button>
		</View>
	);
}


