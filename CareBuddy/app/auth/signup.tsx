import React from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseAuth, firebaseDb } from '../../services/firebase';
import { Link } from 'expo-router';

const schema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(6),
});
type FormData = z.infer<typeof schema>;

export default function SignupScreen() {
	const { control, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

	const onSubmit = async (data: FormData) => {
		const cred = await createUserWithEmailAndPassword(firebaseAuth, data.email, data.password);
		await updateProfile(cred.user, { displayName: data.name });
		await setDoc(doc(firebaseDb, 'Users', cred.user.uid), {
			uid: cred.user.uid,
			email: data.email,
			name: data.name,
			role: 'patient',
			createdAt: serverTimestamp(),
		});
	};

	return (
		<View style={{ flex: 1, padding: 16, gap: 12, justifyContent: 'center' }}>
			<Text variant="headlineMedium">Create your account</Text>
			<Controller control={control} name="name" render={({ field: { onChange, value } }) => (
				<TextInput label="Full name" value={value} onChangeText={onChange} />
			)} />
			<Controller control={control} name="email" render={({ field: { onChange, value } }) => (
				<TextInput autoCapitalize="none" keyboardType="email-address" label="Email" value={value} onChangeText={onChange} />
			)} />
			<Controller control={control} name="password" render={({ field: { onChange, value } }) => (
				<TextInput secureTextEntry label="Password" value={value} onChangeText={onChange} />
			)} />
			<Button mode="contained" onPress={handleSubmit(onSubmit)} loading={isSubmitting}>Sign Up</Button>
			<Link href="/auth/login">Already have an account? Login</Link>
		</View>
	);
}


