import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Image,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { theme } from '../theme';

type UploadPrescriptionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UploadPrescription'>;

export default function UploadPrescriptionScreen() {
  const navigation = useNavigation<UploadPrescriptionScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleTakePhoto = async () => {
    setLoading(true);
    try {
      // Simulate camera capture
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newFile = `prescription_${Date.now()}.jpg`;
      setUploadedFiles([...uploadedFiles, newFile]);
      Alert.alert('Success', 'Prescription photo captured successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFile = async () => {
    setLoading(true);
    try {
      // Simulate file selection
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newFile = `prescription_${Date.now()}.pdf`;
      setUploadedFiles([...uploadedFiles, newFile]);
      Alert.alert('Success', 'Prescription file selected successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to select file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    Alert.alert(
      'Remove File',
      'Are you sure you want to remove this prescription?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            const newFiles = uploadedFiles.filter((_, i) => i !== index);
            setUploadedFiles(newFiles);
          }
        }
      ]
    );
  };

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) {
      Alert.alert('No Files', 'Please upload at least one prescription file.');
      return;
    }

    setLoading(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 3000));
      Alert.alert(
        'Success', 
        'Prescriptions uploaded successfully! Our team will review them and process your order.',
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to upload prescriptions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Prescription</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Ionicons name="information-circle" size={24} color={theme.colors.primary[500]} />
          <View style={styles.instructionsText}>
            <Text style={styles.instructionsTitle}>How to upload your prescription</Text>
            <Text style={styles.instructionsBody}>
              • Take a clear photo of your prescription{'\n'}
              • Ensure all text is readable{'\n'}
              • Include all pages if multiple{'\n'}
              • Upload PDF files if available
            </Text>
          </View>
        </View>

        {/* Upload Options */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Upload Prescription</Text>
          
          <View style={styles.uploadButtons}>
            <TouchableOpacity 
              style={[styles.uploadButton, loading && styles.uploadButtonDisabled]}
              onPress={handleTakePhoto}
              disabled={loading}
            >
              <Ionicons name="camera" size={32} color={theme.colors.text.inverse} />
              <Text style={styles.uploadButtonText}>Take Photo</Text>
              <Text style={styles.uploadButtonSubtext}>Use camera to capture prescription</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.uploadButton, loading && styles.uploadButtonDisabled]}
              onPress={handleSelectFile}
              disabled={loading}
            >
              <Ionicons name="document" size={32} color={theme.colors.text.inverse} />
              <Text style={styles.uploadButtonText}>Select File</Text>
              <Text style={styles.uploadButtonSubtext}>Choose from gallery or files</Text>
            </TouchableOpacity>
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          )}
        </View>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <View style={styles.filesSection}>
            <Text style={styles.sectionTitle}>Uploaded Files ({uploadedFiles.length})</Text>
            {uploadedFiles.map((file, index) => (
              <View key={index} style={styles.fileCard}>
                <View style={styles.fileInfo}>
                  <Ionicons name="document" size={24} color={theme.colors.primary[500]} />
                  <Text style={styles.fileName}>{file}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveFile(index)}
                >
                  <Ionicons name="close" size={20} color={theme.colors.error[500]} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            (loading || uploadedFiles.length === 0) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={loading || uploadedFiles.length === 0}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Uploading...' : 'Submit Prescription'}
          </Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  instructionsCard: {
    ...theme.components.card,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing['3xl'],
  },
  instructionsText: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  instructionsTitle: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  instructionsBody: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  uploadSection: {
    marginBottom: theme.spacing['3xl'],
  },
  sectionTitle: {
    ...theme.typography.textStyles.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  uploadButton: {
    flex: 1,
    alignItems: 'center',
    ...theme.components.card,
  },
  uploadButtonDisabled: {
    backgroundColor: theme.colors.neutral[300],
  },
  uploadButtonText: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.inverse,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  uploadButtonSubtext: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.inverse,
    textAlign: 'center',
    opacity: 0.8,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  loadingText: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.primary[500],
  },
  filesSection: {
    marginBottom: theme.spacing['3xl'],
  },
  fileCard: {
    ...theme.components.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileName: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  removeButton: {
    padding: theme.spacing.sm,
  },
  submitButton: {
    alignItems: 'center',
    ...theme.components.card,
  },
  submitButtonDisabled: {
    backgroundColor: theme.colors.neutral[300],
  },
  submitButtonText: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
});
