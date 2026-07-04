/**
 * Wurm Krieg 3 - Main Menu Screen
 * 
 * This screen displays the main menu with player info, currency, and navigation buttons.
 * 
 * @author DasImperium
 * @version 1.0.0
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { useGameState } from '../contexts/GameStateContext';
import { GAME_CONSTANTS } from '../config/gameConfig';

/**
 * Main Menu Screen Component
 * 
 * Displays the main menu with:
 * - Title: "Krieg der Würmer"
 * - Editable Player Name Input
 * - Currency Displays: Apples & Star Anise
 * - Navigation buttons to various screens
 * 
 * @param {Object} props - Navigation props
 * @returns {JSX.Element} The main menu screen
 */
const MainMenuScreen = ({ navigation }) => {
  const { state, setPlayerName } = useGameState();
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(state.playerName);
  
  /**
   * Handle name change
   */
  const handleNameChange = () => {
    if (tempName.trim()) {
      setPlayerName(tempName.trim());
    }
    setEditingName(false);
  };
  
  /**
   * Cancel name editing
   */
  const cancelNameEdit = () => {
    setTempName(state.playerName);
    setEditingName(false);
  };
  
  /**
   * Navigate to battle selection
   */
  const goToBattle = () => {
    navigation.navigate('BattleSelect');
  };
  
  /**
   * Navigate to raid screen
   */
  const goToRaid = () => {
    navigation.navigate('Raid');
  };
  
  /**
   * Navigate to research screen
   */
  const goToResearch = () => {
    navigation.navigate('Research');
  };
  
  /**
   * Navigate to instructions screen
   */
  const goToInstructions = () => {
    navigation.navigate('Instructions');
  };
  
  /**
   * Navigate to reset progress screen
   */
  const goToResetProgress = () => {
    navigation.navigate('ResetProgress');
  };
  
  /**
   * Navigate to admin screen
   */
  const goToAdmin = () => {
    navigation.navigate('Admin');
  };
  
  return (
    <ImageBackground
      source={require('../../assets/background.jpg')}
      style={styles.background}
      blurRadius={2}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Krieg der Würmer</Text>
          <Text style={styles.subtitle}>3</Text>
        </View>
        
        {/* Player Info Section */}
        <View style={styles.playerInfoContainer}>
          <View style={styles.playerNameContainer}>
            {editingName ? (
              <View style={styles.nameEditContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={tempName}
                  onChangeText={setTempName}
                  autoFocus={true}
                  maxLength={20}
                  onSubmitEditing={handleNameChange}
                />
                <View style={styles.nameButtons}>
                  <TouchableOpacity onPress={handleNameChange} style={styles.saveButton}>
                    <Text style={styles.buttonText}>✓</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={cancelNameEdit} style={styles.cancelButton}>
                    <Text style={styles.buttonText}>✗</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <Text style={styles.playerNameLabel}>Spieler:</Text>
                <TouchableOpacity onPress={() => {
                  setTempName(state.playerName);
                  setEditingName(true);
                }}
                >
                  <Text style={styles.playerName}>{state.playerName}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          
          {/* Currency Display */}
          <View style={styles.currencyContainer}>
            <View style={styles.currencyItem}>
              <Text style={styles.currencyIcon}>🍎</Text>
              <Text style={styles.currencyValue}>{state.apples}</Text>
              <Text style={styles.currencyLabel}>Äpfel</Text>
            </View>
            <View style={styles.currencyItem}>
              <Text style={styles.currencyIcon}>⭐</Text>
              <Text style={styles.currencyValue}>{state.starAnise}</Text>
              <Text style={styles.currencyLabel}>Sternanis</Text>
            </View>
          </View>
          
          {/* Stats Display */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Siege:</Text>
              <Text style={styles.statValue}>{state.stats.wins}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Niederlagen:</Text>
              <Text style={styles.statValue}>{state.stats.losses}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Freigeschaltete Level:</Text>
              <Text style={styles.statValue}>{state.unlockedLevelsCount}/100</Text>
            </View>
          </View>
        </View>
        
        {/* Navigation Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={goToBattle} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Schlacht beginnen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={goToRaid} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Überfall</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={goToResearch} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Forschung</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={goToInstructions} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Anleitung</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={goToResetProgress} style={styles.warningButton}>
            <Text style={styles.warningButtonText}>Fortschritt zurücksetzen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={goToAdmin} style={styles.adminButton}>
            <Text style={styles.adminButtonText}>Admin</Text>
          </TouchableOpacity>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>DasImperium © 2024</Text>
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#e94560',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#f5f5f5',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  playerInfoContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  playerNameContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  playerNameLabel: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 5,
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textDecorationLine: 'underline',
  },
  nameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  nameInput: {
    flex: 1,
    fontSize: 20,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    textAlign: 'center',
  },
  nameButtons: {
    flexDirection: 'row',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  currencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
  },
  currencyItem: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    minWidth: 100,
  },
  currencyIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  currencyValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  currencyLabel: {
    fontSize: 12,
    color: '#aaa',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    padding: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginVertical: 6,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  warningButton: {
    backgroundColor: 'rgba(255, 165, 0, 0.3)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginVertical: 6,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  warningButtonText: {
    color: '#FFA500',
    fontSize: 18,
    fontWeight: '600',
  },
  adminButton: {
    backgroundColor: 'rgba(128, 0, 128, 0.3)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginVertical: 6,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#800080',
  },
  adminButtonText: {
    color: '#800080',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  versionText: {
    color: '#444',
    fontSize: 12,
  },
});

export default MainMenuScreen;
