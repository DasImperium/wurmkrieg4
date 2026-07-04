/**
 * Wurm Krieg 3 - Admin Screen
 * 
 * This screen provides admin functionality with password protection.
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
  Switch,
  Slider,
} from 'react-native';
import { useGameState } from '../contexts/GameStateContext';
import { SEGMENTS, getAllSegmentIds, SPECIAL_ABILITIES } from '../config/gameConfig';

/**
 * Admin Screen Component
 * 
 * Features:
 * - Password protection (password: "Imperium")
 * - Editable fields for all game state properties
 * - Instant modification of player data
 * - Segment research level adjustments
 * - Special ability configuration
 * - Raid state management
 * 
 * @param {Object} props - Navigation props
 * @returns {JSX.Element} The admin screen
 */
const AdminScreen = ({ navigation }) => {
  const { state, setState } = useGameState();
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState('player');
  
  // Local state for editable values
  const [editValues, setEditValues] = useState({
    playerName: state.playerName,
    apples: state.apples.toString(),
    starAnise: state.starAnise.toString(),
    wins: state.stats.wins.toString(),
    losses: state.stats.losses.toString(),
    maxUnlockedLevel: state.unlockedLevelsCount.toString(),
    raidLevel: state.raidLevel.toString(),
    readyButterflies: state.readyButterflies.toString(),
    maxButterflies: state.maxButterflies.toString(),
  });
  
  // Segment research levels
  const [segmentLevels, setSegmentLevels] = useState({...state.researchLevels});
  
  // Special ability settings
  const [specialAbilitySettings, setSpecialAbilitySettings] = useState({
    squirrel: { ...state.specialAbilities.squirrel },
    pigeon: { ...state.specialAbilities.pigeon },
    turtle: { ...state.specialAbilities.turtle },
  });
  
  /**
   * Check password and unlock admin panel
   */
  const handleUnlock = () => {
    if (password === 'Imperium') {
      setIsUnlocked(true);
    } else {
      alert('Falsches Passwort!');
    }
  };
  
  /**
   * Update edit value
   */
  const handleEditChange = (field, value) => {
    setEditValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  /**
   * Update segment level
   */
  const handleSegmentLevelChange = (segmentId, value) => {
    setSegmentLevels(prev => ({
      ...prev,
      [segmentId]: Math.max(0, Math.min(5, value)),
    }));
  };
  
  /**
   * Update special ability setting
   */
  const handleSpecialAbilityChange = (abilityId, field, value) => {
    setSpecialAbilitySettings(prev => ({
      ...prev,
      [abilityId]: {
        ...prev[abilityId],
        [field]: value,
      },
    }));
  };
  
  /**
   * Apply all changes
   */
  const applyChanges = () => {
    // Create new state object
    const newState = {
      ...state,
      playerName: editValues.playerName,
      apples: parseInt(editValues.apples) || 0,
      starAnise: parseInt(editValues.starAnise) || 0,
      stats: {
        wins: parseInt(editValues.wins) || 0,
        losses: parseInt(editValues.losses) || 0,
      },
      researchLevels: { ...segmentLevels },
      specialAbilities: { ...specialAbilitySettings },
      raidLevel: parseInt(editValues.raidLevel) || 1,
      readyButterflies: parseInt(editValues.readyButterflies) || 0,
      maxButterflies: parseInt(editValues.maxButterflies) || 5,
    };
    
    // Update unlocked levels
    const maxLevel = parseInt(editValues.maxUnlockedLevel) || 1;
    newState.unlockedLevels = Array(100).fill(false);
    for (let i = 0; i < Math.min(maxLevel, 100); i++) {
      newState.unlockedLevels[i] = true;
    }
    newState.unlockedLevelsCount = maxLevel;
    
    // Apply changes
    setState(newState);
    alert('Änderungen wurden übernommen!');
  };
  
  /**
   * Reset all changes to current state
   */
  const resetChanges = () => {
    setEditValues({
      playerName: state.playerName,
      apples: state.apples.toString(),
      starAnise: state.starAnise.toString(),
      wins: state.stats.wins.toString(),
      losses: state.stats.losses.toString(),
      maxUnlockedLevel: state.unlockedLevelsCount.toString(),
      raidLevel: state.raidLevel.toString(),
      readyButterflies: state.readyButterflies.toString(),
      maxButterflies: state.maxButterflies.toString(),
    });
    setSegmentLevels({...state.researchLevels});
    setSpecialAbilitySettings({
      squirrel: { ...state.specialAbilities.squirrel },
      pigeon: { ...state.specialAbilities.pigeon },
      turtle: { ...state.specialAbilities.turtle },
    });
  };
  
  /**
   * Lock admin panel
   */
  const handleLock = () => {
    setIsUnlocked(false);
    setPassword('');
  };
  
  if (!isUnlocked) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Admin Panel</Text>
        
        <View style={styles.lockContainer}>
          <Text style={styles.lockTitle}>Passwort erforderlich</Text>
          <Text style={styles.lockDescription}>
            Gib das Admin-Passwort ein, um Zugriff zu erhalten.
          </Text>
          
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Passwort eingeben"
            placeholderTextColor="#666"
            secureTextEntry={true}
            autoCapitalize="none"
          />
          
          <TouchableOpacity
            onPress={handleUnlock}
            style={styles.unlockButton}
          >
            <Text style={styles.unlockButtonText}>Entsperren</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Zurück</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Panel</Text>
        <TouchableOpacity
          onPress={handleLock}
          style={styles.lockButton}
        >
          <Text style={styles.lockButtonText}>Sperren</Text>
        </TouchableOpacity>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('player')}
          style={[styles.tab, activeTab === 'player' && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeTab === 'player' && styles.tabTextActive]}>
            Spieler
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('research')}
          style={[styles.tab, activeTab === 'research' && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeTab === 'research' && styles.tabTextActive]}>
            Forschung
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('special')}
          style={[styles.tab, activeTab === 'special' && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeTab === 'special' && styles.tabTextActive]}>
            Spezial
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('raid')}
          style={[styles.tab, activeTab === 'raid' && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeTab === 'raid' && styles.tabTextActive]}>
            Überfall
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Player Tab */}
      {activeTab === 'player' && (
        <View style={styles.tabContent}>
          <Text style={styles.tabTitle}>Spieler-Daten</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Spielername:</Text>
            <TextInput
              style={styles.textInput}
              value={editValues.playerName}
              onChangeText={(text) => handleEditChange('playerName', text)}
              placeholder="Spielername"
              placeholderTextColor="#666"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Äpfel:</Text>
            <TextInput
              style={styles.textInput}
              value={editValues.apples}
              onChangeText={(text) => handleEditChange('apples', text)}
              placeholder="Äpfel"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Sternanis:</Text>
            <TextInput
              style={styles.textInput}
              value={editValues.starAnise}
              onChangeText={(text) => handleEditChange('starAnise', text)}
              placeholder="Sternanis"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Max freigeschaltetes Level:</Text>
            <TextInput
              style={styles.textInput}
              value={editValues.maxUnlockedLevel}
              onChangeText={(text) => handleEditChange('maxUnlockedLevel', text)}
              placeholder="Max Level"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.statsGroup}>
            <Text style={styles.inputLabel}>Statistiken:</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Siege:</Text>
                <TextInput
                  style={styles.smallInput}
                  value={editValues.wins}
                  onChangeText={(text) => handleEditChange('wins', text)}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Niederlagen:</Text>
                <TextInput
                  style={styles.smallInput}
                  value={editValues.losses}
                  onChangeText={(text) => handleEditChange('losses', text)}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>
      )}
      
      {/* Research Tab */}
      {activeTab === 'research' && (
        <View style={styles.tabContent}>
          <Text style={styles.tabTitle}>Forschungs-Level</Text>
          <Text style={styles.tabDescription}>
            Stelle die Forschungs-Level für jedes Segment ein (0-5)
          </Text>
          
          <View style={styles.segmentsGrid}>
            {getAllSegmentIds().map(segmentId => {
              const segment = SEGMENTS[segmentId];
              return (
                <View key={segmentId} style={styles.segmentItem}>
                  <Text style={styles.segmentName}>{segment.name}</Text>
                  <View style={styles.sliderContainer}>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={5}
                      step={1}
                      value={segmentLevels[segmentId] || 0}
                      onValueChange={(value) => handleSegmentLevelChange(segmentId, value)}
                      minimumTrackTintColor="#4CAF50"
                      maximumTrackTintColor="#666"
                      thumbTintColor="#FFD700"
                    />
                    <Text style={styles.sliderValue}>{segmentLevels[segmentId] || 0}</Text>
                  </View>
                </View>
              );
            })}
          </View>
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              onPress={() => {
                const newLevels = {};
                getAllSegmentIds().forEach(id => newLevels[id] = 5);
                setSegmentLevels(newLevels);
              }}
              style={styles.maxButton}
            >
              <Text style={styles.maxButtonText}>Alle auf Max</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const newLevels = {};
                getAllSegmentIds().forEach(id => newLevels[id] = 0);
                setSegmentLevels(newLevels);
              }}
              style={styles.resetButton}
            >
              <Text style={styles.resetButtonText}>Alle zurücksetzen</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Special Tab */}
      {activeTab === 'special' && (
        <View style={styles.tabContent}>
          <Text style={styles.tabTitle}>Spezialfähigkeiten</Text>
          
          {Object.keys(SPECIAL_ABILITIES).map(abilityId => {
            const ability = SPECIAL_ABILITIES[abilityId];
            const settings = specialAbilitySettings[abilityId];
            
            return (
              <View key={abilityId} style={styles.specialAbilityItem}>
                <Text style={styles.specialAbilityName}>{ability.name}</Text>
                
                <View style={styles.specialAbilitySettings}>
                  <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Freigeschaltet:</Text>
                    <Switch
                      value={settings.unlocked || false}
                      onValueChange={(value) => 
                        handleSpecialAbilityChange(abilityId, 'unlocked', value)
                      }
                      trackColor={{ false: '#666', true: '#4CAF50' }}
                      thumbColor={settings.unlocked ? '#FFD700' : '#999'}
                    />
                  </View>
                  
                  <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Anzahl:</Text>
                    <TextInput
                      style={styles.smallInput}
                      value={settings.count ? settings.count.toString() : '0'}
                      onChangeText={(text) => 
                        handleSpecialAbilityChange(abilityId, 'count', parseInt(text) || 0)
                      }
                      keyboardType="numeric"
                    />
                  </View>
                  
                  {abilityId === 'turtle' && (
                    <View style={styles.settingRow}>
                      <Text style={styles.settingLabel}>Geschwindigkeit (0.01-10):</Text>
                      <Slider
                        style={styles.smallSlider}
                        minimumValue={0.01}
                        maximumValue={10}
                        step={0.01}
                        value={settings.speed || 1.0}
                        onValueChange={(value) => 
                          handleSpecialAbilityChange(abilityId, 'speed', value)
                        }
                        minimumTrackTintColor="#4CAF50"
                        maximumTrackTintColor="#666"
                        thumbTintColor="#FFD700"
                      />
                      <Text style={styles.sliderValue}>{(settings.speed || 1.0).toFixed(2)}</Text>
                    </View>
                  )}
                  
                  {abilityId === 'pigeon' && (
                    <View style={styles.settingRow}>
                      <Text style={styles.settingLabel}>Minen-Anzahl:</Text>
                      <TextInput
                        style={styles.smallInput}
                        value={settings.mineCount ? settings.mineCount.toString() : '3'}
                        onChangeText={(text) => 
                          handleSpecialAbilityChange(abilityId, 'mineCount', parseInt(text) || 3)
                        }
                        keyboardType="numeric"
                      />
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
      
      {/* Raid Tab */}
      {activeTab === 'raid' && (
        <View style={styles.tabContent}>
          <Text style={styles.tabTitle}>Überfall-Einstellungen</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Angriffsstufe:</Text>
            <TextInput
              style={styles.textInput}
              value={editValues.raidLevel}
              onChangeText={(text) => handleEditChange('raidLevel', text)}
              placeholder="Angriffsstufe"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Aktive Schmetterlinge:</Text>
            <TextInput
              style={styles.textInput}
              value={editValues.readyButterflies}
              onChangeText={(text) => handleEditChange('readyButterflies', text)}
              placeholder="Aktive Schmetterlinge"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Maximale Schmetterlinge:</Text>
            <TextInput
              style={styles.textInput}
              value={editValues.maxButterflies}
              onChangeText={(text) => handleEditChange('maxButterflies', text)}
              placeholder="Maximale Schmetterlinge"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </View>
        </View>
      )}
      
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={resetChanges}
          style={styles.resetChangesButton}
        >
          <Text style={styles.resetChangesButtonText}>Zurücksetzen</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={applyChanges}
          style={styles.applyChangesButton}
        >
          <Text style={styles.applyChangesButtonText}>Änderungen übernehmen</Text>
        </TouchableOpacity>
      </View>
      
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e94560',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  lockButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  lockButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  lockContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 40,
  },
  lockTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 10,
  },
  lockDescription: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  passwordInput: {
    width: '80%',
    fontSize: 18,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  unlockButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginBottom: 15,
  },
  unlockButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  tabContent: {
    width: '100%',
    marginBottom: 20,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  tabDescription: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 5,
  },
  textInput: {
    fontSize: 16,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
  },
  statsGroup: {
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    marginRight: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 5,
  },
  smallInput: {
    fontSize: 14,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    padding: 8,
    textAlign: 'center',
  },
  segmentsGrid: {
    marginBottom: 15,
  },
  segmentItem: {
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  segmentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 20,
  },
  sliderValue: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  maxButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  maxButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: 'rgba(255, 165, 0, 0.3)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  resetButtonText: {
    color: '#FFA500',
    fontSize: 12,
    fontWeight: '600',
  },
  specialAbilityItem: {
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  specialAbilityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  specialAbilitySettings: {
    marginLeft: 10,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 12,
    color: '#aaa',
    marginRight: 10,
    flex: 1,
  },
  smallSlider: {
    flex: 1,
    height: 20,
    marginRight: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  resetChangesButton: {
    backgroundColor: 'rgba(255, 165, 0, 0.3)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  resetChangesButtonText: {
    color: '#FFA500',
    fontSize: 16,
    fontWeight: '600',
  },
  applyChangesButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  applyChangesButtonText: {
    color: '#fff',
    fontSize: 16,
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
});

export default AdminScreen;
