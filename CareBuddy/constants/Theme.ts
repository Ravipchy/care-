import { MD3LightTheme as DefaultTheme, configureFonts } from 'react-native-paper';

const fontConfig = configureFonts({});

export const CareBuddyTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#1F8BFF',
		secondary: '#2ECC71',
		background: '#F7FBFF',
		surface: '#FFFFFF',
		error: '#D32F2F',
	},
	fonts: fontConfig,
} as const;

export type AppTheme = typeof CareBuddyTheme;


