/**
 * Wurm Krieg 3 - Battle Selection Screen
 * 
 * This screen allows players to choose between procedural battles and specific levels.
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
  FlatList,
} from 'react-native';
import { useGameState } from '../contexts/GameStateContext';
import { LEVEL_CONFIG, getAllSegmentIds, SEGMENTS } from '../config/gameConfig';

/**
 * Battle Selection Screen Component
 * 
 * Displays:
 * - Top Section: "Prozedurale Schlacht" Button
 * - Grid Section: 100 Level buttons arranged in rows of 10
 * 
 * @param {Object} props - Navigation props
 * @returns {JSX.Element} The battle selection screen
 */
const BattleSelectScreen = ({ navigation }) => {
  const { state } = useGameState();
  const [showProceduralConfig, setShowProceduralConfig] = useState(false);
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  
  /**
   * Start a procedural battle with selected segments
   */
  const startProceduralBattle = () => {
    if (selectedSegments.length === 0) {
      alert('Bitte wähle mindestens ein Segment aus!');
      return;
    }
    
    if (selectedSegments.length > 8) {
      alert('Du kannst maximal 8 Segmente auswählen!');
      return;
    }
    
    navigation.navigate('GamePlay', {
      mode: 'procedural',
      segments: selectedSegments,
      level: 0, // Procedural battles don't have a specific level
    });
    setShowProceduralConfig(false);
  };
  
  /**
   * Start a specific level battle
   */
  const startLevelBattle = (level) => {
    if (!state.unlockedLevels[level - 1]) {
      alert(`Level ${level} ist noch nicht freigeschaltet!`);
      return;
    }
    
    // For now, use a default set of segments for level battles
    // In a full implementation, each level would have its own segment restrictions
    const availableSegments = getAllSegmentIds().filter(segmentId => {
      // Only allow segments that have been researched
      return (state.researchLevels[segmentId] || 0) > 0;
    });
    
    navigation.navigate('SegmentLoadout', {
      mode: 'level',
      level: level,
      availableSegments: availableSegments.length > 0 ? availableSegments : getAllSegmentIds(),
      maxSegments: 8,
    });
  };
  
  /**
   * Toggle segment selection
   */
  const toggleSegment = (segmentId) => {
    setSelectedSegments(prev => {
      if (prev.includes(segmentId)) {
        return prev.filter(id => id !== segmentId);
      } else {
        if (prev.length >= 8) {
          alert('Du kannst maximal 8 Segmente auswählen!');
          return prev;
        }
        return [...prev, segmentId];
      }
    });
  };
  
  /**
   * Render a level button
   */
  const renderLevelButton = ({ item: level }) => {
    const isUnlocked = state.unlockedLevels[level - 1];
    const isSelected = selectedLevel === level;
    
    return (
      <TouchableOpacity
        onPress={() => startLevelBattle(level)}
        style={[
          styles.levelButton,
          isUnlocked ? styles.levelButtonUnlocked : styles.levelButtonLocked,
          isSelected && styles.levelButtonSelected,
        ]}
        disabled={!isUnlocked}
      >
        <Text style={[
          styles.levelButtonText,
          isUnlocked ? styles.levelButtonTextUnlocked : styles.levelButtonTextLocked,
        ]}>
          {level}
        </Text>
      </TouchableOpacity>
    );
  };
  
  /**
   * Render a segment checkbox for procedural battle config
   */
  const renderSegmentCheckbox = (segmentId) => {
    const segment = SEGMENTS[segmentId];
    const isSelected = selectedSegments.includes(segmentId);
    const isUnlocked = (state.researchLevels[segmentId] || 0) > 0;
    
    return (
      <TouchableOpacity
        key={segmentId}
        onPress={() => isUnlocked && toggleSegment(segmentId)}
        style={[
          styles.segmentItem,
          isSelected && styles.segmentItemSelected,
          !isUnlocked && styles.segmentItemLocked,
        ]}
        disabled={!isUnlocked}
      >
        <Text style={[
          styles.segmentName,
          !isUnlocked && styles.segmentNameLocked,
        ]}>
          {segment.name}
        </Text>
        {!isUnlocked && (
          <Text style={styles.lockedText}>🔒 Level {(state.researchLevels[segmentId] || 0) + 1}</Text>
        )}
        {isUnlocked && (
          <Text style={styles.segmentCheck}>
            {isSelected ? '✓' : '✗'}
          </Text>
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Schlacht auswählen</Text>
      
      {/* Procedural Battle Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prozedurale Schlacht</Text>
        <Text style={styles.sectionDescription}>
          Erstelle eine zufällige Schlacht mit deinen ausgewählten Segmenten
        </Text>
        
        <TouchableOpacity
          onPress={() => {
            // Reset selection when opening config
            setSelectedSegments([]);
            setShowProceduralConfig(true);
          }}
          style={styles.proceduralButton}
        >
          <Text style={styles.proceduralButtonText}>Segmente auswählen</Text>
        </TouchableOpacity>
      </View>
      
      {/* Levels Grid Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Level auswählen</Text>
        <Text style={styles.sectionDescription}>
          Wähle ein freigeschaltetes Level (1-{state.unlockedLevelsCount})
        </Text>
        
        <View style={styles.levelsGrid}>
          <FlatList
            data={Array.from({ length: LEVEL_CONFIG.totalLevels }, (_, i) => i + 1)}
            renderItem={renderLevelButton}
            keyExtractor={(item) => item.toString()}
            numColumns={10}
            columnWrapperStyle={styles.levelRow}
            scrollEnabled={false}
          />
        </View>
      </View>
      
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Zurück</Text>
      </TouchableOpacity>
      
      {/* Procedural Battle Config Modal */}
      <Modal
        visible={showProceduralConfig}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProceduralConfig(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Segmente für prozedurale Schlacht</Text>
            <Text style={styles.modalSubtitle}>
              Wähle 1-8 Segmente aus (nur freigeschaltete Segmente)
            </Text>
            
            <ScrollView style={styles.segmentsList}>
              {getAllSegmentIds().map(renderSegmentCheckbox)}
            </ScrollView>
            
            <View style={styles.modalButtons}>
              <Text style={styles.segmentCount}>
                Ausgewählt: {selectedSegments.length}/8
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => setShowProceduralConfig(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Zurück</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={startProceduralBattle}
                  style={styles.startButton}
                  disabled={selectedSegments.length === 0}
                >
                  <Text style={styles.startButtonText}>Spiel beginnen</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 15,
  },
  proceduralButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginVertical: 10,
  },
  proceduralButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelsGrid: {
    width: '100%',
    marginTop: 10,
  },
  levelRow: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  levelButton: {
    width: 35,
    height: 35,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelButtonUnlocked: {
    backgroundColor: '#4CAF50',
  },
  levelButtonLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  levelButtonSelected: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  levelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  levelButtonTextUnlocked: {
    color: '#fff',
  },
  levelButtonTextLocked: {
    color: '#666',
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: '#2a2a4a',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e94560',
    marginBottom: 5,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 15,
  },
  segmentsList: {
    maxHeight: 300,
    marginBottom: 15,
  },
  segmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  segmentItemSelected: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  segmentItemLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    opacity: 0.6,
  },
  segmentName: {
    fontSize: 16,
    color: '#fff',
  },
  segmentNameLocked: {
    color: '#666',
  },
  segmentCheck: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  lockedText: {
    fontSize: 12,
    color: '#FFA500',
    marginLeft: 10,
  },
  modalButtons: {
    alignItems: 'center',
  },
  segmentCount: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BattleSelectScreen;
