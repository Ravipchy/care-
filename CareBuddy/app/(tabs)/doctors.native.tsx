import React, { useEffect, useMemo, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View } from 'react-native';
import { Button, Chip, Dialog, Portal, RadioButton, Text } from 'react-native-paper';
import { collection, getDocs, query } from 'firebase/firestore';
import { firebaseDb } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { addAppointment } from '../../services/appointments';

type Doctor = {
	id: string;
	name: string;
	specialization: string;
	location: { lat: number; lng: number };
	availability?: string[];
	fees?: number;
};

const SPECIALIZATIONS = ['All','Dentist','Cardiologist','Dermatologist','Neurologist','Pediatrician'];

export default function DoctorsMapScreen() {
	const { user } = useAuth();
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [filter, setFilter] = useState('All');
	const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
	const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		(async () => {
			const q = query(collection(firebaseDb, 'Doctors'));
			const snap = await getDocs(q);
			const list: Doctor[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
			setDoctors(list);
		})();
	}, []);

	const filtered = useMemo(() => doctors.filter(d => filter === 'All' ? true : d.specialization === filter), [doctors, filter]);

	const initialRegion = {
		latitude: filtered[0]?.location.lat ?? 37.78825,
		longitude: filtered[0]?.location.lng ?? -122.4324,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	};

	const openBooking = (doc: Doctor) => {
		setSelectedDoctor(doc);
		setSelectedSlot(doc.availability?.[0] ?? null);
		setVisible(true);
	};

	const confirmBooking = async () => {
		if (!user || !selectedDoctor || !selectedSlot) return;
		await addAppointment({
			userId: user.uid,
			doctorId: selectedDoctor.id,
			doctorName: selectedDoctor.name,
			specialization: selectedDoctor.specialization,
			dateTime: selectedSlot,
			fees: selectedDoctor.fees ?? 0,
			status: 'confirmed',
		});
		setVisible(false);
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 8 }}>
				{SPECIALIZATIONS.map(s => (
					<Chip key={s} selected={filter===s} onPress={() => setFilter(s)}>{s}</Chip>
				))}
			</View>
			<MapView style={{ flex: 1 }} initialRegion={initialRegion}>
				{filtered.map(doc => (
					<Marker key={doc.id} coordinate={{ latitude: doc.location.lat, longitude: doc.location.lng }} title={doc.name} description={doc.specialization} onPress={() => openBooking(doc)} />
				))}
			</MapView>
			<Portal>
				<Dialog visible={visible} onDismiss={() => setVisible(false)}>
					<Dialog.Title>Book Appointment</Dialog.Title>
					<Dialog.Content>
						<Text>{selectedDoctor?.name} • {selectedDoctor?.specialization}</Text>
						<RadioButton.Group onValueChange={setSelectedSlot as any} value={selectedSlot ?? ''}>
							{selectedDoctor?.availability?.map(slot => (
								<RadioButton.Item key={slot} label={slot} value={slot} />
							))}
						</RadioButton.Group>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => setVisible(false)}>Cancel</Button>
						<Button mode="contained" onPress={confirmBooking} disabled={!selectedSlot}>Confirm</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</View>
	);
}


