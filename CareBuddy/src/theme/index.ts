import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  
  // Common component styles
  components: {
    // Card styles
    card: {
      backgroundColor: colors.background.primary,
      borderRadius: 12,
      padding: spacing.card.padding,
      margin: spacing.card.margin,
      shadowColor: colors.shadow.light,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    
    // Button styles
    button: {
      primary: {
        backgroundColor: colors.primary[500],
        borderRadius: 8,
        paddingVertical: spacing.button.paddingVertical,
        paddingHorizontal: spacing.button.paddingHorizontal,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary[500],
        borderRadius: 8,
        paddingVertical: spacing.button.paddingVertical,
        paddingHorizontal: spacing.button.paddingHorizontal,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      },
      text: {
        color: colors.text.inverse,
        fontSize: typography.textStyles.button.fontSize,
        fontWeight: typography.textStyles.button.fontWeight,
      },
    },
    
    // Input styles
    input: {
      backgroundColor: colors.background.primary,
      borderWidth: 1,
      borderColor: colors.border.light,
      borderRadius: 8,
      paddingVertical: spacing.input.paddingVertical,
      paddingHorizontal: spacing.input.paddingHorizontal,
      fontSize: typography.textStyles.body1.fontSize,
      color: colors.text.primary,
    },
    
    // Header styles
    header: {
      backgroundColor: colors.background.primary,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    
    // Container styles
    container: {
      flex: 1,
      backgroundColor: colors.background.secondary,
    },
    
    // Safe area styles
    safeArea: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
  },
};

export default theme;
