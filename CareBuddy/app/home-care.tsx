import React from 'react';
import { View } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';

export default function HomeCareScreen() {
	return (
		<View style={{ flex: 1, padding: 16, gap: 12 }}>
			<Text variant="headlineSmall">Book Home Care</Text>
			<TextInput label="Service (Nurse/Caregiver)" />
			<TextInput label="Preferred Date" />
			<Button mode="contained">Submit Request</Button>
		</View>
	);
}


