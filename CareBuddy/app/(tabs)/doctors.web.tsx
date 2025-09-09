import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function DoctorsWebFallback() {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
			<Text>Doctors map is only available on iOS/Android in this build.</Text>
			<Text>Use a device or simulator to view and book nearby doctors.</Text>
		</View>
	);
}


