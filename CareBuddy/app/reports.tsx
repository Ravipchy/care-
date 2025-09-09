import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function ReportsScreen() {
	return (
		<View style={{ flex: 1, padding: 16, gap: 12 }}>
			<Text variant="headlineSmall">Medical Reports</Text>
			<Button mode="contained">Upload Report</Button>
			<Button mode="outlined">View Reports</Button>
		</View>
	);
}


