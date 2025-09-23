import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

// Sample reports data
const reports = [
  {
    id: 1,
    title: 'Blood Test Report',
    date: 'Dec 1, 2024',
    type: 'Lab Report',
    doctor: 'Dr. Sarah Johnson',
    status: 'Available',
    fileSize: '2.3 MB',
    image: '🩸',
  },
  {
    id: 2,
    title: 'X-Ray Chest',
    date: 'Nov 28, 2024',
    type: 'Imaging',
    doctor: 'Dr. Michael Chen',
    status: 'Available',
    fileSize: '5.7 MB',
    image: '🫁',
  },
  {
    id: 3,
    title: 'ECG Report',
    date: 'Nov 25, 2024',
    type: 'Cardiology',
    doctor: 'Dr. Emily Rodriguez',
    status: 'Processing',
    fileSize: '1.2 MB',
    image: '❤️',
  },
  {
    id: 4,
    title: 'MRI Brain',
    date: 'Nov 20, 2024',
    type: 'Imaging',
    doctor: 'Dr. David Wilson',
    status: 'Available',
    fileSize: '15.8 MB',
    image: '🧠',
  },
  {
    id: 5,
    title: 'Urine Analysis',
    date: 'Nov 18, 2024',
    type: 'Lab Report',
    doctor: 'Dr. Lisa Park',
    status: 'Available',
    fileSize: '0.8 MB',
    image: '🧪',
  },
];

export default function ReportsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const categories = ['All', 'Lab Report', 'Imaging', 'Cardiology', 'Other'];

  const filteredReports = reports.filter(report => {
    if (selectedCategory === 'All') return true;
    return report.type === selectedCategory;
  });

  const handleUpload = () => {
    setShowUploadModal(true);
  };

  const handleUploadFile = (type: string) => {
    setShowUploadModal(false);
    Alert.alert('Success', `${type} uploaded successfully!`);
  };

  const handleDownload = (report: any) => {
    if (report.status !== 'Available') {
      Alert.alert('Not Available', 'This report is not available for download yet.');
      return;
    }
    
    Alert.alert('Download', `Download ${report.title}?`, [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Download', 
        onPress: () => {
          // Simulate download process
          Alert.alert('Downloading...', 'Please wait while we prepare your report for download.', [
            {
              text: 'OK',
              onPress: () => {
                // Simulate successful download
                setTimeout(() => {
                  Alert.alert('Success', `${report.title} has been downloaded successfully!\n\nFile saved to Downloads folder.`);
                }, 1000);
              }
            }
          ]);
        }
      }
    ]);
  };

  const handleShare = (report: any) => {
    Alert.alert('Share', `Share ${report.title}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Share', onPress: () => Alert.alert('Success', 'Report shared successfully!') }
    ]);
  };

  const handleDelete = (report: any) => {
    Alert.alert(
      'Delete Report',
      `Delete ${report.title}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Success', 'Report deleted successfully!') }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return theme.colors.success;
      case 'Processing': return theme.colors.warning;
      case 'Error': return theme.colors.error;
      default: return theme.colors.neutral[500];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Medical Reports</Text>
          <Text style={styles.headerSubtitle}>View and manage your health reports</Text>
        </View>

        {/* Upload Button */}
        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
          <Ionicons name="cloud-upload" size={24} color={theme.colors.text.inverse} />
          <Text style={styles.uploadButtonText}>Upload New Report</Text>
        </TouchableOpacity>

        {/* Category Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  selectedCategory === category && styles.filterChipActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedCategory === category && styles.filterChipTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Reports List */}
        <View style={styles.reportsSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory} Reports ({filteredReports.length})
          </Text>
          {filteredReports.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.reportImage}>
                  <Text style={styles.reportEmoji}>{report.image}</Text>
                </View>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <Text style={styles.reportType}>{report.type}</Text>
                  <View style={styles.reportMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="calendar" size={14} color={theme.colors.text.secondary} />
                      <Text style={styles.metaText}>{report.date}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="person" size={14} color={theme.colors.text.secondary} />
                      <Text style={styles.metaText}>{report.doctor}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="document" size={14} color={theme.colors.text.secondary} />
                      <Text style={styles.metaText}>{report.fileSize}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.statusContainer}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(report.status)[500] }
                  ]}>
                    <Text style={styles.statusText}>{report.status}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.reportActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDownload(report)}
                  disabled={report.status !== 'Available'}
                >
                  <Ionicons 
                    name="download" 
                    size={16} 
                    color={report.status === 'Available' ? theme.colors.primary[500] : theme.colors.neutral[400]} 
                  />
                  <Text style={[
                    styles.actionButtonText,
                    { color: report.status === 'Available' ? theme.colors.primary[500] : theme.colors.neutral[400] }
                  ]}>
                    Download
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleShare(report)}
                  disabled={report.status !== 'Available'}
                >
                  <Ionicons 
                    name="share" 
                    size={16} 
                    color={report.status === 'Available' ? theme.colors.secondary[500] : theme.colors.neutral[400]} 
                  />
                  <Text style={[
                    styles.actionButtonText,
                    { color: report.status === 'Available' ? theme.colors.secondary[500] : theme.colors.neutral[400] }
                  ]}>
                    Share
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDelete(report)}
                >
                  <Ionicons name="trash" size={16} color={theme.colors.error[500]} />
                  <Text style={[styles.actionButtonText, { color: theme.colors.error[500] }]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={60} color={theme.colors.neutral[300]} />
            <Text style={styles.emptyTitle}>No {selectedCategory.toLowerCase()} reports</Text>
            <Text style={styles.emptyDescription}>
              {selectedCategory === 'All' ? 'You don\'t have any reports yet.' : `You don't have any ${selectedCategory.toLowerCase()} reports.`}
            </Text>
            <TouchableOpacity style={styles.uploadEmptyButton} onPress={handleUpload}>
              <Text style={styles.uploadEmptyButtonText}>Upload Your First Report</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Upload Modal */}
      <Modal
        visible={showUploadModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload Medical Report</Text>
            <Text style={styles.modalDescription}>
              Choose how you want to upload your medical report
            </Text>
            <View style={styles.uploadOptions}>
              <TouchableOpacity 
                style={styles.uploadOption}
                onPress={() => handleUploadFile('Camera Photo')}
              >
                <Ionicons name="camera" size={30} color={theme.colors.primary[500]} />
                <Text style={styles.uploadOptionText}>Take Photo</Text>
                <Text style={styles.uploadOptionSubtext}>Use camera to capture report</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.uploadOption}
                onPress={() => handleUploadFile('Gallery Photo')}
              >
                <Ionicons name="images" size={30} color={theme.colors.secondary[500]} />
                <Text style={styles.uploadOptionText}>Choose from Gallery</Text>
                <Text style={styles.uploadOptionSubtext}>Select from photo library</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.uploadOption}
                onPress={() => handleUploadFile('PDF File')}
              >
                <Ionicons name="document" size={30} color={theme.colors.warning[500]} />
                <Text style={styles.uploadOptionText}>Upload PDF</Text>
                <Text style={styles.uploadOptionSubtext}>Select PDF file</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowUploadModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
    ...theme.components.card,
    backgroundColor: theme.colors.primary[500],
  },
  uploadButtonText: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.inverse,
    marginLeft: theme.spacing.md,
  },
  filterSection: {
    marginBottom: theme.spacing.xl,
  },
  filterTitle: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  filterChip: {
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: 20,
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  filterChipText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.secondary,
  },
  filterChipTextActive: {
    color: theme.colors.text.inverse,
  },
  reportsSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  reportCard: {
    ...theme.components.card,
    marginBottom: theme.spacing.lg,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  reportImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },
  reportEmoji: {
    fontSize: 24,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  reportType: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.primary[500],
    marginBottom: theme.spacing.sm,
  },
  reportMeta: {
    gap: theme.spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  reportActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: theme.colors.background.tertiary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: 8,
  },
  actionButtonText: {
    ...theme.typography.textStyles.label,
    marginLeft: theme.spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing['6xl'],
  },
  emptyTitle: {
    ...theme.typography.textStyles.h4,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  emptyDescription: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  uploadEmptyButton: {
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: 8,
  },
  uploadEmptyButtonText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: 12,
    padding: theme.spacing['3xl'],
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  modalDescription: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing['3xl'],
  },
  uploadOptions: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  uploadOption: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  uploadOptionText: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  uploadOptionSubtext: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
  },
  cancelButton: {
    paddingVertical: theme.spacing.md,
  },
  cancelButtonText: {
    color: theme.colors.text.secondary,
    ...theme.typography.textStyles.body1,
    fontWeight: '600',
  },
});