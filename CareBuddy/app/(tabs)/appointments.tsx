import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { getAppointmentsByUser } from '../../services/appointments';

export default function AppointmentsHistoryScreen() {
	const { user } = useAuth();
	const [items, setItems] = useState<any[]>([]);

	useEffect(() => {
		(async () => {
			if (!user) return;
			const data = await getAppointmentsByUser(user.uid);
			setItems(data);
		})();
	}, [user]);

	return (
		<View style={{ flex: 1, padding: 12 }}>
			<FlatList
				data={items}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<Card style={{ marginBottom: 8 }}>
						<Card.Title title={item.doctorName} subtitle={item.specialization} />
						<Card.Content>
							<Text>{item.dateTime}</Text>
							<Text>Status: {item.status}</Text>
						</Card.Content>
					</Card>
				)}
			/>
		</View>
	);
}


