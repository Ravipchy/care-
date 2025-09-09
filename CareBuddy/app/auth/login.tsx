import React from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import { firebaseAuth } from '../../services/firebase';
import { ensureUserProfile } from '../../services/users';
import { Link } from 'expo-router';

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
	const { control, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

	const onSubmit = async (data: FormData) => {
		await signInWithEmailAndPassword(firebaseAuth, data.email, data.password);
	};

	const signInWithGoogle = async () => {
		const extra: any = Constants.expoConfig?.extra ?? (Constants as any).manifest?.extra ?? {};
		const clientId = extra.googleWebClientId;
		const redirectUri = AuthSession.makeRedirectUri();
		const discovery = {
			authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
			tokenEndpoint: 'https://oauth2.googleapis.com/token',
		};
		const request = new AuthSession.AuthRequest({
			clientId,
			scopes: ['profile', 'email'],
			redirectUri,
			responseType: AuthSession.ResponseType.IdToken,
			extraParams: { nonce: Math.random().toString(36).slice(2) },
		});
		const result = await request.promptAsync(discovery);
		const idToken = (result as any)?.params?.id_token;
		if (result.type === 'success' && idToken) {
			const credential = GoogleAuthProvider.credential(idToken);
			const { user } = await signInWithCredential(firebaseAuth, credential);
			await ensureUserProfile(user);
		}
	};

	return (
		<View style={{ flex: 1, padding: 16, gap: 12, justifyContent: 'center' }}>
			<Text variant="headlineMedium">Welcome to CareBuddy</Text>
			<Controller
				control={control}
				name="email"
				render={({ field: { onChange, value } }) => (
					<TextInput autoCapitalize="none" keyboardType="email-address" label="Email" value={value} onChangeText={onChange} />
				)}
			/>
			<Controller
				control={control}
				name="password"
				render={({ field: { onChange, value } }) => (
					<TextInput secureTextEntry label="Password" value={value} onChangeText={onChange} />
				)}
			/>
			<Button mode="contained" onPress={handleSubmit(onSubmit)} loading={isSubmitting}>Login</Button>
			<Button mode="outlined" onPress={signInWithGoogle}>Sign in with Google</Button>
			<Link href="/auth/signup">Don't have an account? Sign Up</Link>
		</View>
	);
}


