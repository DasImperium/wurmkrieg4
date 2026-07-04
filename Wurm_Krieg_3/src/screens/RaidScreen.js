/**
 * Wurm Krieg 3 - Raid Screen
 * 
 * This screen displays the raid menu with butterfly breeding and upgrades.
 * 
 * @author DasImperium
 * @version 1.0.0
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useGameState } from '../contexts/GameStateContext';
import { RAID_CONFIG } from '../config/gameConfig';

/**
 * Raid Screen Component
 * 
 * Displays:
 * - Current active/max butterflies (x/y)
 * - "Sofort Nachzucht" button (costs apples, star anise at higher levels)
 * - "Kapazität erhöhen" button (increases y, escalates costs)
 * - "Angriffsstufe verbessern" button (displays current Raid Level and cost)
 * 
 * @param {Object} props - Navigation props
 * @returns {JSX.Element} The raid screen
 */
const RaidScreen = ({ navigation }) => {
  const {
    state,
    breedButterfly,
    increaseCapacity,
    upgradeRaidLevel,
    canAfford,
  } = useGameState();
  
  /**
   * Calculate breed cost based on current raid level
   */
  const getBreedCost = () => {
    return RAID_CONFIG.butterfly.baseBreedCost +
           (state.raidLevel - 1) * RAID_CONFIG.butterfly.breedCostIncrement;
  };
  
  /**
   * Calculate capacity upgrade cost
   */
  const getCapacityCost = () => {
    const upgrades = Math.floor(
      (state.maxButterflies - RAID_CONFIG.butterfly.baseCapacity) /
      RAID_CONFIG.butterfly.capacityIncrement
    );
    return RAID_CONFIG.butterfly.capacityCostBase +
           upgrades * RAID_CONFIG.butterfly.capacityCostIncrement;
  };
  
  /**
   * Calculate raid level upgrade cost
   */
  const getRaidUpgradeCost = () => {
    return RAID_CONFIG.butterfly.raidLevel.upgradeCostBase +
           (state.raidLevel - 1) * RAID_CONFIG.butterfly.raidLevel.upgradeCostIncrement;
  };
  
  /**
   * Handle breed butterfly
   */
  const handleBreed = () => {
    const cost = getBreedCost();
    if (!canAfford(cost, 'apples')) {
      alert(`Du brauchst ${cost} Äpfel zum Züchten!`);
      return;
    }
    
    if (state.readyButterflies >= state.maxButterflies) {
      alert(`Du hast bereits die maximale Anzahl an Schmetterlingen (${state.maxButterflies})!`);
      return;
    }
    
    breedButterfly();
  };
  
  /**
   * Handle capacity increase
   */
  const handleIncreaseCapacity = () => {
    const cost = getCapacityCost();
    if (!canAfford(cost, 'apples')) {
      alert(`Du brauchst ${cost} Äpfel zum Erhöhen der Kapazität!`);
      return;
    }
    
    increaseCapacity();
  };
  
  /**
   * Handle raid level upgrade
   */
  const handleUpgradeRaidLevel = () => {
    const cost = getRaidUpgradeCost();
    if (!canAfford(cost, 'apples')) {
      alert(`Du brauchst ${cost} Äpfel zum Verbessern der Angriffsstufe!`);
      return;
    }
    
    upgradeRaidLevel();
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Überfall</Text>
      
      {/* Butterfly Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Aktive Schmetterlinge</Text>
        <Text style={styles.statusValue}>
          {state.readyButterflies}/{state.maxButterflies}
        </Text>
      </View>
      
      {/* Raid Level Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Angriffsstufe</Text>
        <Text style={styles.statusValue}>{state.raidLevel}</Text>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        {/* Breed Button */}
        <View style={styles.buttonGroup}>
          <Text style={styles.buttonTitle}>Sofort Nachzucht</Text>
          <Text style={styles.buttonDescription}>
            Züchte einen neuen Schmetterling
          </Text>
          <Text style={styles.buttonCost}>
            Kosten: {getBreedCost()} Äpfel
          </Text>
          <TouchableOpacity
            onPress={handleBreed}
            style={styles.actionButton}
            disabled={!canAfford(getBreedCost(), 'apples') || 
                     state.readyButterflies >= state.maxButterflies}
          >
            <Text style={styles.actionButtonText}>Schmetterling züchten</Text>
          </TouchableOpacity>
        </View>
        
        {/* Capacity Button */}
        <View style={styles.buttonGroup}>
          <Text style={styles.buttonTitle}>Kapazität erhöhen</Text>
          <Text style={styles.buttonDescription}>
            Erhöhe die maximale Anzahl an Schmetterlingen
          </Text>
          <Text style={styles.buttonCost}>
            Kosten: {getCapacityCost()} Äpfel
          </Text>
          <TouchableOpacity
            onPress={handleIncreaseCapacity}
            style={styles.actionButton}
            disabled={!canAfford(getCapacityCost(), 'apples')}
          >
            <Text style={styles.actionButtonText}>Kapazität erhöhen</Text>
          </TouchableOpacity>
        </View>
        
        {/* Raid Level Button */}
        <View style={styles.buttonGroup}>
          <Text style={styles.buttonTitle}>Angriffsstufe verbessern</Text>
          <Text style={styles.buttonDescription}>
            Aktuelle Stufe: {state.raidLevel}
          </Text>
          <Text style={styles.buttonDescription}>
            Erhöht die Schmetterlings-Spawn-Rate während des Überfalls
          </Text>
          <Text style={styles.buttonCost}>
            Kosten: {getRaidUpgradeCost()} Äpfel
          </Text>
          <TouchableOpacity
            onPress={handleUpgradeRaidLevel}
            style={styles.actionButton}
            disabled={!canAfford(getRaidUpgradeCost(), 'apples')}
          >
            <Text style={styles.actionButtonText}>Angriffsstufe verbessern</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Überfall-Informationen</Text>
        <Text style={styles.infoText}>
          Der Überfall ist ein Mini-Spiel, bei dem Schmetterlinge deinem Team helfen.
          Je höher deine Angriffsstufe, desto mehr Schmetterlinge erscheinen während
          des Überfalls.
        </Text>
        <Text style={styles.infoText}>
          Jeder Schmetterling kann Gegner angreifen und dir helfen, die Schlacht zu gewinnen.
        </Text>
      </View>
      
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Zurück</Text>
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
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  statusLabel: {
    fontSize: 16,
    color: '#aaa',
  },
  statusValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  buttonGroup: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  buttonDescription: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 3,
  },
  buttonCost: {
    fontSize: 14,
    color: '#e94560',
    marginBottom: 10,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RaidScreen;
