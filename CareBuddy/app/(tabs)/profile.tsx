import React from 'react';
import { View } from 'react-native';
import { Avatar, Button, Text } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
	const { user, logout } = useAuth();
	return (
		<View style={{ flex: 1, padding: 16, gap: 12 }}>
			<Avatar.Text size={64} label={(user?.displayName ?? 'P').slice(0, 1)} />
			<Text variant="titleMedium">{user?.displayName ?? 'Patient'}</Text>
			<Text>{user?.email}</Text>
			<Button mode="outlined" onPress={logout}>Logout</Button>
		</View>
	);
}


