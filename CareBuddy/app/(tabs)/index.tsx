import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { logout } = useAuth();
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text variant="headlineSmall">CareBuddy</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        <Link href="/(tabs)/doctors" asChild>
          <Button mode="contained" icon="account-heart">Doctors</Button>
        </Link>
        <Link href="/ambulance" asChild>
          <Button mode="contained" icon="ambulance">Ambulance</Button>
        </Link>
        <Link href="/(tabs)/pharmacy" asChild>
          <Button mode="contained" icon="pill">Pharmacy</Button>
        </Link>
        <Link href="/(tabs)/lab-tests" asChild>
          <Button mode="contained" icon="flask">Lab Tests</Button>
        </Link>
        <Link href="/home-care" asChild>
          <Button mode="contained" icon="home-heart">Home Care</Button>
        </Link>
        <Link href="/reports" asChild>
          <Button mode="contained" icon="file-document">Reports</Button>
        </Link>
        <Link href="/telemedicine" asChild>
          <Button mode="contained" icon="video">Telemedicine</Button>
        </Link>
        <Link href="/chatbot" asChild>
          <Button mode="contained" icon="robot">Chatbot</Button>
        </Link>
      </View>
      <Button mode="text" onPress={logout}>Logout</Button>
    </View>
  );
}

const styles = StyleSheet.create({});
