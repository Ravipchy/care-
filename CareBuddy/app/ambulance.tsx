import React from 'react';
import { View } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';

export default function AmbulanceBookingScreen() {
	return (
		<View style={{ flex: 1, padding: 16, gap: 12 }}>
			<Text variant="headlineSmall">Book Ambulance</Text>
			<TextInput label="Pickup Location" />
			<TextInput label="Destination" />
			<Button mode="contained">Request Ambulance</Button>
		</View>
	);
}


