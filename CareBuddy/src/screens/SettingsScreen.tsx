import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { theme } from '../theme';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { id: 1, title: 'Profile', icon: 'person', screen: 'Profile', type: 'arrow' },
        { id: 2, title: 'Medical History', icon: 'medical', screen: 'MedicalHistory', type: 'arrow' },
        { id: 3, title: 'Emergency Contacts', icon: 'call', type: 'arrow' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { id: 4, title: 'Notifications', icon: 'notifications', type: 'toggle', value: notificationsEnabled, onToggle: setNotificationsEnabled },
        { id: 5, title: 'Location Services', icon: 'location', type: 'toggle', value: locationEnabled, onToggle: setLocationEnabled },
        { id: 6, title: 'Biometric Login', icon: 'finger-print', type: 'toggle', value: biometricEnabled, onToggle: setBiometricEnabled },
        { id: 7, title: 'Language', icon: 'language', type: 'arrow', subtitle: 'English' },
        { id: 8, title: 'Theme', icon: 'color-palette', type: 'arrow', subtitle: 'Light' },
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        { id: 9, title: 'Privacy Policy', icon: 'shield-checkmark', type: 'arrow' },
        { id: 10, title: 'Data & Storage', icon: 'cloud', type: 'arrow' },
        { id: 11, title: 'Change Password', icon: 'key', type: 'arrow' },
      ]
    },
    {
      title: 'Support',
      items: [
        { id: 12, title: 'Help & Support', icon: 'help-circle', type: 'arrow' },
        { id: 13, title: 'Contact Us', icon: 'mail', type: 'arrow' },
        { id: 14, title: 'About Us', icon: 'information-circle', screen: 'AboutUs', type: 'arrow' },
        { id: 15, title: 'Rate App', icon: 'star', type: 'arrow' },
      ]
    }
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => Alert.alert('Success', 'Logged out successfully!') }
      ]
    );
  };

  const handleSettingPress = (item: any) => {
    if (item.screen) {
      navigation.navigate(item.screen as any);
    } else if (item.type === 'arrow') {
      Alert.alert('Coming Soon', `${item.title} feature will be available soon!`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.settingsGroup}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingItem,
                    itemIndex === section.items.length - 1 && styles.lastItem
                  ]}
                  onPress={() => handleSettingPress(item)}
                >
                  <View style={styles.settingLeft}>
                    <View style={styles.iconContainer}>
                      <Ionicons name={item.icon as any} size={20} color={theme.colors.primary[500]} />
                    </View>
                    <View style={styles.settingTextContainer}>
                      <Text style={styles.settingTitle}>{item.title}</Text>
                      {'subtitle' in item && item.subtitle && (
                        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.settingRight}>
                    {item.type === 'toggle' ? (
                      <Switch
                        value={'value' in item ? item.value : false}
                        onValueChange={'onToggle' in item ? item.onToggle : () => {}}
                        trackColor={{ false: theme.colors.neutral[300], true: theme.colors.primary[200] }}
                        thumbColor={('value' in item ? item.value : false) ? theme.colors.primary[500] : theme.colors.neutral[400]}
                      />
                    ) : (
                      <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color={theme.colors.text.inverse} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  headerTitle: {
    ...theme.typography.textStyles.h2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  headerSubtitle: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.secondary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  settingsSection: {
    marginBottom: theme.spacing['3xl'],
  },
  sectionTitle: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    marginLeft: theme.spacing.sm,
  },
  settingsGroup: {
    overflow: 'hidden',
    ...theme.components.card,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  settingSubtitle: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
  },
  settingRight: {
    alignItems: 'center',
  },
  logoutSection: {
    marginBottom: theme.spacing.xl,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.components.card,
    backgroundColor: theme.colors.error[500],
  },
  logoutButtonText: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.inverse,
    marginLeft: theme.spacing.md,
  },
});
