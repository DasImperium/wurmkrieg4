/**
 * Wurm Krieg 3 - Research Screen
 * 
 * This screen allows players to research and upgrade segments.
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
  FlatList,
  Modal,
} from 'react-native';
import { useGameState } from '../contexts/GameStateContext';
import { SEGMENTS, getAllSegmentIds, getUpgradeCost, getUpgradeCurrency, SPECIAL_ABILITIES } from '../config/gameConfig';

/**
 * Research Screen Component
 * 
 * Displays:
 * - List of all 16 segments with current levels (0-5)
 * - Upgrade buttons for each segment
 * - Special Actions shop section
 * 
 * @param {Object} props - Navigation props
 * @returns {JSX.Element} The research screen
 */
const ResearchScreen = ({ navigation }) => {
  const {
    state,
    upgradeSegment,
    unlockSpecialAbility,
    canAfford,
    getSegmentLevel,
  } = useGameState();
  
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [showSpecialActions, setShowSpecialActions] = useState(false);
  
  /**
   * Handle segment upgrade
   */
  const handleUpgradeSegment = (segmentId) => {
    const currentLevel = getSegmentLevel(segmentId);
    const segment = SEGMENTS[segmentId];
    
    if (!segment) return;
    if (currentLevel >= segment.maxLevel) {
      alert(`Dieses Segment ist bereits auf maximalem Level (${segment.maxLevel})!`);
      return;
    }
    
    const nextLevel = currentLevel + 1;
    const cost = getUpgradeCost(segmentId, nextLevel);
    const currency = getUpgradeCurrency(nextLevel);
    
    if (!canAfford(cost, currency)) {
      const currencyName = currency === 'apples' ? 'Äpfel' : 'Sternanis';
      alert(`Du brauchst ${cost} ${currencyName} für dieses Upgrade!`);
      return;
    }
    
    // In a real implementation, we would check if the player can afford it
    // and then call upgradeSegment
    upgradeSegment(segmentId, nextLevel);
    
    // For now, we'll just show a confirmation
    alert(`Segment ${segment.name} auf Level ${nextLevel} upgegradet!`);
  };
  
  /**
   * Handle special ability unlock
   */
  const handleUnlockSpecialAbility = (abilityId) => {
    const ability = SPECIAL_ABILITIES[abilityId];
    if (!ability) return;
    
    if (state.specialAbilities[abilityId]?.unlocked) {
      alert(`"${ability.name}" ist bereits freigeschaltet!`);
      return;
    }
    
    const cost = ability.unlockCost;
    const currency = ability.currency;
    const currencyName = currency === 'apples' ? 'Äpfel' : 'Sternanis';
    
    if (!canAfford(cost, currency)) {
      alert(`Du brauchst ${cost} ${currencyName} um "${ability.name}" freizuschalten!`);
      return;
    }
    
    unlockSpecialAbility(abilityId);
    alert(`"${ability.name}" wurde freigeschaltet!`);
  };
  
  /**
   * Render a segment item
   */
  const renderSegmentItem = ({ item: segmentId }) => {
    const segment = SEGMENTS[segmentId];
    if (!segment) return null;
    
    const currentLevel = getSegmentLevel(segmentId);
    const isMaxLevel = currentLevel >= segment.maxLevel;
    const nextLevel = currentLevel + 1;
    const cost = isMaxLevel ? 0 : getUpgradeCost(segmentId, nextLevel);
    const currency = isMaxLevel ? '' : getUpgradeCurrency(nextLevel);
    const currencyName = currency === 'apples' ? 'Äpfel' : 'Sternanis';
    
    return (
      <TouchableOpacity
        onPress={() => setSelectedSegment(segment)}
        style={styles.segmentItem}
      >
        <View style={styles.segmentInfo}>
          <Text style={styles.segmentName}>{segment.name}</Text>
          <Text style={styles.segmentDescription} numberOfLines={1}>
            {segment.description}
          </Text>
          <View style={styles.levelContainer}>
            <Text style={styles.levelLabel}>Level: {currentLevel}/{segment.maxLevel}</Text>
            {Array.from({ length: segment.maxLevel }, (_, i) => (
              <Text key={i} style={[
                styles.levelStar,
                i < currentLevel && styles.levelStarActive,
              ]}>
                ★
              </Text>
            ))}
          </View>
        </View>
        
        {!isMaxLevel && (
          <TouchableOpacity
            onPress={() => handleUpgradeSegment(segmentId)}
            style={styles.upgradeButton}
            disabled={!canAfford(cost, currency)}
          >
            <Text style={styles.upgradeButtonText}>
              {cost} {currencyName}
            </Text>
          </TouchableOpacity>
        )}
        
        {isMaxLevel && (
          <Text style={styles.maxLevelText}>MAX</Text>
        )}
      </TouchableOpacity>
    );
  };
  
  /**
   * Render a special ability item
   */
  const renderSpecialAbilityItem = (abilityId) => {
    const ability = SPECIAL_ABILITIES[abilityId];
    if (!ability) return null;
    
    const isUnlocked = state.specialAbilities[abilityId]?.unlocked || false;
    const cost = ability.unlockCost;
    const currencyName = ability.currency === 'apples' ? 'Äpfel' : 'Sternanis';
    
    return (
      <View key={abilityId} style={styles.specialAbilityItem}>
        <View style={styles.specialAbilityInfo}>
          <Text style={styles.specialAbilityName}>{ability.name}</Text>
          <Text style={styles.specialAbilityDescription}>
            {ability.description}
          </Text>
          <Text style={styles.specialAbilityEffect}>
            Effekt: {JSON.stringify(ability.effect, null, 2).replace(/[{}""]/g, '')}
          </Text>
        </View>
        
        {isUnlocked ? (
          <Text style={styles.unlockedText}>✓ Freigeschaltet</Text>
        ) : (
          <TouchableOpacity
            onPress={() => handleUnlockSpecialAbility(abilityId)}
            style={styles.unlockButton}
            disabled={!canAfford(cost, ability.currency)}
          >
            <Text style={styles.unlockButtonText}>
              {cost} {currencyName}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Forschung</Text>
      
      {/* Segments Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Segmente</Text>
        <Text style={styles.sectionDescription}>
          Forsche und verbessere deine Segmente. Level 1-3 kosten Äpfel, Level 4-5 kosten Sternanis.
        </Text>
        
        <FlatList
          data={getAllSegmentIds()}
          renderItem={renderSegmentItem}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.segmentsList}
          scrollEnabled={false}
        />
      </View>
      
      {/* Special Actions Section */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => setShowSpecialActions(!showSpecialActions)}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>Spezialfähigkeiten</Text>
          <Text style={styles.toggleIcon}>{showSpecialActions ? '▼' : '▶'}</Text>
        </TouchableOpacity>
        
        {showSpecialActions && (
          <View style={styles.specialActionsContainer}>
            <Text style={styles.sectionDescription}>
              Spezielle Fähigkeiten, die dir im Kampf helfen
            </Text>
            
            {Object.keys(SPECIAL_ABILITIES).map(renderSpecialAbilityItem)}
          </View>
        )}
      </View>
      
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Zurück</Text>
      </TouchableOpacity>
      
      {/* Segment Detail Modal */}
      <Modal
        visible={selectedSegment !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedSegment(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedSegment && (
              <>
                <Text style={styles.modalTitle}>{selectedSegment.name}</Text>
                <Text style={styles.modalDescription}>{selectedSegment.description}</Text>
                
                <View style={styles.modalStats}>
                  <Text style={styles.modalStat}>
                    Gesundheit: {selectedSegment.baseHealth}
                  </Text>
                  <Text style={styles.modalStat}>
                    Schaden: {selectedSegment.baseDamage}
                  </Text>
                  <Text style={styles.modalStat}>
                    Reichweite: {selectedSegment.baseRange}
                  </Text>
                  <Text style={styles.modalStat}>
                    Abklingzeit: {selectedSegment.baseCooldown}ms
                  </Text>
                </View>
                
                <TouchableOpacity
                  onPress={() => setSelectedSegment(null)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Schließen</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  section: {
    width: '100%',
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  toggleIcon: {
    fontSize: 18,
    color: '#aaa',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 15,
  },
  segmentsList: {
    paddingBottom: 20,
  },
  segmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  segmentInfo: {
    flex: 1,
  },
  segmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  segmentDescription: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 8,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelLabel: {
    fontSize: 12,
    color: '#aaa',
    marginRight: 8,
  },
  levelStar: {
    fontSize: 16,
    color: '#666',
    marginLeft: 2,
  },
  levelStarActive: {
    color: '#FFD700',
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  maxLevelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  specialActionsContainer: {
    marginTop: 10,
  },
  specialAbilityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
  },
  specialAbilityInfo: {
    flex: 1,
  },
  specialAbilityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 3,
  },
  specialAbilityDescription: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 5,
  },
  specialAbilityEffect: {
    fontSize: 10,
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  unlockButton: {
    backgroundColor: '#e94560',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  unlockButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  unlockedText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
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
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: '#2a2a4a',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e94560',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalStats: {
    marginBottom: 15,
  },
  modalStat: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResearchScreen;
