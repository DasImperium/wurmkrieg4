/**
 * Wurm Krieg 3 - Reset Progress Screen
 * 
 * This screen provides a 2-step confirmation for resetting game progress.
 * 
 * @author DasImperium
 * @version 1.0.0
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { useGameState } from '../contexts/GameStateContext';

/**
 * Reset Progress Screen Component
 * 
 * Provides a 2-step confirmation process before wiping the global state:
 * 1. First confirmation: "Möchtest du wirklich alle Fortschritte zurücksetzen?"
 * 2. Second confirmation: "Bist du sicher? Diese Aktion kann nicht rückgängig gemacht werden!"
 * 
 * @param {Object} props - Navigation props
 * @returns {JSX.Element} The reset progress screen
 */
const ResetProgressScreen = ({ navigation }) => {
  const { resetProgress } = useGameState();
  const [step, setStep] = useState(1);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  
  /**
   * Handle first confirmation
   */
  const handleFirstConfirmation = () => {
    setStep(2);
  };
  
  /**
   * Handle second confirmation - show final modal
   */
  const handleSecondConfirmation = () => {
    setShowFinalConfirmation(true);
  };
  
  /**
   * Handle final confirmation - actually reset progress
   */
  const handleFinalConfirmation = () => {
    resetProgress();
    setShowFinalConfirmation(false);
    navigation.goBack();
  };
  
  /**
   * Cancel reset
   */
  const cancelReset = () => {
    setStep(1);
    setShowFinalConfirmation(false);
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fortschritt zurücksetzen</Text>
      
      {/* Warning Message */}
      <View style={styles.warningContainer}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <Text style={styles.warningTitle}>Warnung!</Text>
        <Text style={styles.warningText}>
          Das Zurücksetzen des Fortschritts wird alle deine Daten löschen:
        </Text>
        
        <View style={styles.dataList}>
          <Text style={styles.dataItem}>• Spielername</Text>
          <Text style={styles.dataItem}>• Alle Äpfel und Sternanis</Text>
          <Text style={styles.dataItem}>• Alle freigeschalteten Level</Text>
          <Text style={styles.dataItem}>• Alle Forschungsergebnisse</Text>
          <Text style={styles.dataItem}>• Alle Spezialfähigkeiten</Text>
          <Text style={styles.dataItem}>• Alle Statistiken (Siege, Niederlagen)</Text>
          <Text style={styles.dataItem}>• Überfall-Fortschritt</Text>
        </View>
        
        <Text style={styles.warningText}>
          Diese Aktion kann nicht rückgängig gemacht werden!
        </Text>
      </View>
      
      {/* Confirmation Steps */}
      <View style={styles.stepsContainer}>
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Schritt 1 von 2</Text>
            <Text style={styles.stepQuestion}>
              Möchtest du wirklich alle Fortschritte zurücksetzen?
            </Text>
            
            <View style={styles.stepButtons}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Abbrechen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleFirstConfirmation}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmButtonText}>Weiter</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Schritt 2 von 2</Text>
            <Text style={styles.stepQuestion}>
              Bist du sicher? Diese Aktion kann nicht rückgängig gemacht werden!
            </Text>
            
            <View style={styles.stepButtons}>
              <TouchableOpacity
                onPress={cancelReset}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Abbrechen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSecondConfirmation}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmButtonText}>Fortschritt zurücksetzen</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      
      {/* Final Confirmation Modal */}
      <Modal
        visible={showFinalConfirmation}
        animationType="fade"
        transparent={true}
        onRequestClose={cancelReset}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>LETZTE BESTÄTIGUNG</Text>
            <Text style={styles.modalText}>
              Gib "LÖSCHEN" ein, um den Fortschritt endgültig zurückzusetzen.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={cancelReset}
                style={styles.modalCancelButton}
              >
                <Text style={styles.modalCancelButtonText}>Abbrechen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleFinalConfirmation}
                style={styles.modalConfirmButton}
              >
                <Text style={styles.modalConfirmButtonText}>LÖSCHEN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Zurück zum Menü</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e94560',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  warningContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#FFA500',
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 10,
  },
  dataList: {
    width: '100%',
    marginVertical: 10,
  },
  dataItem: {
    fontSize: 14,
    color: '#e94560',
    marginBottom: 5,
  },
  stepsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  stepContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  stepQuestion: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  stepButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContent: {
    backgroundColor: '#2a2a4a',
    borderRadius: 15,
    padding: 30,
    width: '80%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e94560',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e94560',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  modalCancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalConfirmButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  modalConfirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResetProgressScreen;
