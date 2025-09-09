import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function TelemedicineScreen() {
	return (
		<View style={{ flex: 1, padding: 16, gap: 12 }}>
			<Text variant="headlineSmall">Telemedicine</Text>
			<Button mode="contained">Start Consultation</Button>
		</View>
	);
}


