/**
 * Wurm Krieg 3 - Button Component
 * 
 * A reusable button component with various styles and sizes.
 * 
 * @author DasImperium
 * @version 1.0.0
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';

/**
 * Button Component
 * 
 * A customizable button component with different styles.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Button title
 * @param {Function} props.onPress - Press handler
 * @param {string} props.type - Button type ('primary', 'secondary', 'warning', 'danger', 'success')
 * @param {string} props.size - Button size ('small', 'medium', 'large')
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {Object} props.style - Additional style for button
 * @param {Object} props.textStyle - Additional style for text
 * @param {React.ReactNode} props.children - Button children
 * @returns {JSX.Element} Button component
 */
const Button = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  disabled = false,
  style = {},
  textStyle = {},
  children,
  ...props
}) => {
  // Get button style based on type
  const getButtonStyle = () => {
    switch (type) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'warning':
        return styles.warningButton;
      case 'danger':
        return styles.dangerButton;
      case 'success':
        return styles.successButton;
      default:
        return styles.primaryButton;
    }
  };
  
  // Get button size style
  const getButtonSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };
  
  // Get text style based on type
  const getTextStyle = () => {
    switch (type) {
      case 'primary':
        return styles.primaryButtonText;
      case 'secondary':
        return styles.secondaryButtonText;
      case 'warning':
        return styles.warningButtonText;
      case 'danger':
        return styles.dangerButtonText;
      case 'success':
        return styles.successButtonText;
      default:
        return styles.primaryButtonText;
    }
  };
  
  return (
    <TouchableOpacity
      onPress={disabled ? null : onPress}
      style={[
        styles.button,
        getButtonStyle(),
        getButtonSizeStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      disabled={disabled}
      {...props}
    >
      {children || <Text style={[getTextStyle(), textStyle]}>{title}</Text>}
    </TouchableOpacity>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  mediumButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  largeButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
  },
  primaryButton: {
    backgroundColor: '#e94560',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  warningButton: {
    backgroundColor: 'rgba(255, 165, 0, 0.3)',
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  warningButtonText: {
    color: '#FFA500',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    borderWidth: 1,
    borderColor: '#e94560',
  },
  dangerButtonText: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: '600',
  },
  successButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  successButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default Button;
