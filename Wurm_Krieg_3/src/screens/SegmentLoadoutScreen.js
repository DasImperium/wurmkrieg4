/**
 * Wurm Krieg 3 - Segment Loadout Screen
 * 
 * This screen allows players to select up to 8 segments for a battle.
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
} from 'react-native';
import { useGameState } from '../contexts/GameStateContext';
import { SEGMENTS, getSegment } from '../config/gameConfig';

/**
 * Segment Loadout Screen Component
 * 
 * Allows players to select segments for a battle with the following constraints:
 * - Must have exactly 1 Head (automatically included)
 * - Can have 1-6 additional segments
 * - Total segments: 2-7 (1 head + 1-6 segments)
 * 
 * @param {Object} props - Navigation and route props
 * @returns {JSX.Element} The segment loadout screen
 */
const SegmentLoadoutScreen = ({ navigation, route }) => {
  const { state } = useGameState();
  const { mode, level, availableSegments, maxSegments = 8 } = route.params || {};
  
  const [selectedSegments, setSelectedSegments] = useState([]);
  
  /**
   * Toggle segment selection
   */
  const toggleSegment = (segmentId) => {
    // Head segment is always included and cannot be removed
    if (segmentId === 'head') return;
    
    setSelectedSegments(prev => {
      if (prev.includes(segmentId)) {
        return prev.filter(id => id !== segmentId);
      } else {
        // Check if we can add more segments
        if (prev.length >= maxSegments - 1) { // -1 for the head
          alert(`Du kannst maximal ${maxSegments} Segmente auswählen (inkl. Kopf)!`);
          return prev;
        }
        return [...prev, segmentId];
      }
    });
  };
  
  /**
   * Check if a segment is available (researched)
   */
  const isSegmentAvailable = (segmentId) => {
    if (segmentId === 'head') return true; // Head is always available
    return (state.researchLevels[segmentId] || 0) > 0;
  };
  
  /**
   * Start the battle with selected segments
   */
  const startBattle = () => {
    if (selectedSegments.length === 0) {
      alert('Bitte wähle mindestens ein Segment aus!');
      return;
    }
    
    // Add the head segment automatically
    const finalSegments = ['head', ...selectedSegments];
    
    navigation.navigate('GamePlay', {
      mode: mode || 'level',
      level: level || 0,
      segments: finalSegments,
    });
  };
  
  /**
   * Render a segment item
   */
  const renderSegmentItem = ({ item: segmentId }) => {
    const segment = getSegment(segmentId);
    if (!segment) return null;
    
    const isSelected = selectedSegments.includes(segmentId);
    const isAvailable = isSegmentAvailable(segmentId);
    const isHead = segmentId === 'head';
    
    return (
      <TouchableOpacity
        onPress={() => isAvailable && toggleSegment(segmentId)}
        style={[
          styles.segmentItem,
          isSelected && styles.segmentItemSelected,
          !isAvailable && styles.segmentItemLocked,
          isHead && styles.segmentItemHead,
        ]}
        disabled={!isAvailable || isHead}
      >
        <View style={styles.segmentInfo}>
          <Text style={[
            styles.segmentName,
            !isAvailable && styles.segmentNameLocked,
            isHead && styles.segmentNameHead,
          ]}>
            {segment.name}
          </Text>
          <Text style={styles.segmentDescription} numberOfLines={1}>
            {segment.description}
          </Text>
          {isHead && (
            <Text style={styles.headNote}>(Automatisch enthalten)</Text>
          )}
        </View>
        
        <View style={styles.segmentStats}>
          {isAvailable && (
            <Text style={styles.segmentCheck}>
              {isSelected ? '✓' : (isHead ? '✓' : '✗')}
            </Text>
          )}
          {!isAvailable && (
            <Text style={styles.lockedText}>🔒</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  // Filter segments to only show available ones (or all if in procedural mode)
  const filteredSegments = availableSegments || Object.keys(SEGMENTS);
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          {mode === 'level' ? `Level ${level} - Segmente auswählen` : 'Segmente auswählen'}
        </Text>
        
        <Text style={styles.subtitle}>
          Wähle 1-{maxSegments - 1} Segmente aus (Kopf ist immer enthalten)
        </Text>
        
        <Text style={styles.segmentCount}>
          Ausgewählt: {selectedSegments.length}/{maxSegments - 1}
        </Text>
        
        <FlatList
          data={filteredSegments}
          renderItem={renderSegmentItem}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.segmentsList}
          scrollEnabled={false}
        />
      </ScrollView>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Zurück</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={startBattle}
          style={styles.startButton}
          disabled={selectedSegments.length === 0}
        >
          <Text style={styles.startButtonText}>Spiel beginnen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100, // Space for buttons
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e94560',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 15,
  },
  segmentCount: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600',
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
  segmentItemSelected: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  segmentItemLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    opacity: 0.6,
  },
  segmentItemHead: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    borderWidth: 1,
    borderColor: '#e94560',
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
  segmentNameLocked: {
    color: '#666',
  },
  segmentNameHead: {
    color: '#e94560',
  },
  segmentDescription: {
    fontSize: 12,
    color: '#aaa',
  },
  headNote: {
    fontSize: 10,
    color: '#4CAF50',
    marginTop: 3,
    fontStyle: 'italic',
  },
  segmentStats: {
    alignItems: 'flex-end',
  },
  segmentCheck: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  lockedText: {
    fontSize: 18,
    color: '#FFA500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SegmentLoadoutScreen;
