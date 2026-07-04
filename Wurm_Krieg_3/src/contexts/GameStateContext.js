/**
 * Wurm Krieg 3 - Game State Context
 * 
 * This file implements a robust React Context for managing global game state.
 * It provides a centralized state management solution with actions for
 * updating player data, research levels, raid state, and more.
 * 
 * @author DasImperium
 * @version 1.0.0
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { DEFAULT_GAME_STATE, SEGMENTS, RAID_CONFIG, SPECIAL_ABILITIES } from '../config/gameConfig';

// ============================================
// ACTION TYPES
// ============================================

const ActionTypes = {
  // Player actions
  SET_PLAYER_NAME: 'SET_PLAYER_NAME',
  ADD_APLES: 'ADD_APLES',
  SPEND_APLES: 'SPEND_APLES',
  ADD_STAR_ANISE: 'ADD_STAR_ANISE',
  SPEND_STAR_ANISE: 'SPEND_STAR_ANISE',
  
  // Level progression
  UNLOCK_LEVEL: 'UNLOCK_LEVEL',
  SET_UNLOCKED_LEVELS: 'SET_UNLOCKED_LEVELS',
  
  // Research actions
  UPGRADE_SEGMENT: 'UPGRADE_SEGMENT',
  SET_RESEARCH_LEVEL: 'SET_RESEARCH_LEVEL',
  
  // Raid actions
  BREED_BUTTERFLY: 'BREED_BUTTERFLY',
  INCREASE_CAPACITY: 'INCREASE_CAPACITY',
  UPGRADE_RAID_LEVEL: 'UPGRADE_RAID_LEVEL',
  SET_BUTTERFLIES: 'SET_BUTTERFLIES',
  
  // Special abilities
  UNLOCK_SPECIAL_ABILITY: 'UNLOCK_SPECIAL_ABILITY',
  USE_SPECIAL_ABILITY: 'USE_SPECIAL_ABILITY',
  UPDATE_SPECIAL_ABILITY: 'UPDATE_SPECIAL_ABILITY',
  
  // Stats
  ADD_WIN: 'ADD_WIN',
  ADD_LOSS: 'ADD_LOSS',
  
  // Reset
  RESET_GAME: 'RESET_GAME',
  RESET_PROGRESS: 'RESET_PROGRESS',
  
  // Admin
  SET_STATE: 'SET_STATE',
};

// ============================================
// REDUCER
// ============================================

/**
 * Game state reducer
 * @param {Object} state - Current state
 * @param {Object} action - Action to perform
 * @returns {Object} New state
 */
const gameReducer = (state, action) => {
  switch (action.type) {
    // Player actions
    case ActionTypes.SET_PLAYER_NAME:
      return { ...state, playerName: action.payload };
    
    case ActionTypes.ADD_APLES:
      return { ...state, apples: state.apples + action.payload };
    
    case ActionTypes.SPEND_APLES:
      return { ...state, apples: Math.max(0, state.apples - action.payload) };
    
    case ActionTypes.ADD_STAR_ANISE:
      return { ...state, starAnise: state.starAnise + action.payload };
    
    case ActionTypes.SPEND_STAR_ANISE:
      return { ...state, starAnise: Math.max(0, state.starAnise - action.payload) };
    
    // Level progression
    case ActionTypes.UNLOCK_LEVEL:
      const newUnlocked = [...state.unlockedLevels];
      newUnlocked[action.payload - 1] = true; // Levels are 1-indexed
      return { 
        ...state, 
        unlockedLevels: newUnlocked,
        unlockedLevelsCount: Math.max(state.unlockedLevelsCount, action.payload)
      };
    
    case ActionTypes.SET_UNLOCKED_LEVELS:
      return { 
        ...state, 
        unlockedLevels: action.payload.unlockedLevels,
        unlockedLevelsCount: action.payload.count
      };
    
    // Research actions
    case ActionTypes.UPGRADE_SEGMENT: {
      const { segmentId, level } = action.payload;
      if (!SEGMENTS[segmentId] || level < 0 || level > SEGMENTS[segmentId].maxLevel) {
        return state;
      }
      
      return {
        ...state,
        researchLevels: {
          ...state.researchLevels,
          [segmentId]: level,
        },
      };
    }
    
    case ActionTypes.SET_RESEARCH_LEVEL: {
      const { segmentId, level } = action.payload;
      return {
        ...state,
        researchLevels: {
          ...state.researchLevels,
          [segmentId]: Math.max(0, Math.min(SEGMENTS[segmentId]?.maxLevel || 5, level)),
        },
      };
    }
    
    // Raid actions
    case ActionTypes.BREED_BUTTERFLY: {
      const cost = calculateBreedCost(state.raidLevel);
      if (state.apples < cost || state.readyButterflies >= state.maxButterflies) {
        return state;
      }
      
      return {
        ...state,
        apples: state.apples - cost,
        readyButterflies: state.readyButterflies + 1,
      };
    }
    
    case ActionTypes.INCREASE_CAPACITY: {
      const cost = calculateCapacityCost(state.maxButterflies);
      if (state.apples < cost) {
        return state;
      }
      
      return {
        ...state,
        apples: state.apples - cost,
        maxButterflies: state.maxButterflies + RAID_CONFIG.butterfly.capacityIncrement,
      };
    }
    
    case ActionTypes.UPGRADE_RAID_LEVEL: {
      const cost = calculateRaidUpgradeCost(state.raidLevel);
      if (state.apples < cost) {
        return state;
      }
      
      return {
        ...state,
        apples: state.apples - cost,
        raidLevel: state.raidLevel + 1,
      };
    }
    
    case ActionTypes.SET_BUTTERFLIES:
      return {
        ...state,
        readyButterflies: Math.max(0, Math.min(state.maxButterflies, action.payload.ready)),
        maxButterflies: Math.max(RAID_CONFIG.butterfly.baseCapacity, action.payload.max),
      };
    
    // Special abilities
    case ActionTypes.UNLOCK_SPECIAL_ABILITY: {
      const { abilityId } = action.payload;
      const ability = SPECIAL_ABILITIES[abilityId];
      if (!ability) return state;
      
      const cost = ability.unlockCost;
      const currency = ability.currency;
      
      if (currency === 'apples' && state.apples < cost) return state;
      if (currency === 'starAnise' && state.starAnise < cost) return state;
      
      const newState = { ...state };
      if (currency === 'apples') {
        newState.apples -= cost;
      } else {
        newState.starAnise -= cost;
      }
      
      newState.specialAbilities = {
        ...state.specialAbilities,
        [abilityId]: {
          ...state.specialAbilities[abilityId],
          unlocked: true,
          count: (state.specialAbilities[abilityId]?.count || 0) + 1,
        },
      };
      
      return newState;
    }
    
    case ActionTypes.USE_SPECIAL_ABILITY: {
      const { abilityId } = action.payload;
      const ability = SPECIAL_ABILITIES[abilityId];
      if (!ability || !state.specialAbilities[abilityId]?.unlocked) return state;
      
      return {
        ...state,
        specialAbilities: {
          ...state.specialAbilities,
          [abilityId]: {
            ...state.specialAbilities[abilityId],
            cooldown: ability.cooldown,
          },
        },
      };
    }
    
    case ActionTypes.UPDATE_SPECIAL_ABILITY: {
      const { abilityId, updates } = action.payload;
      return {
        ...state,
        specialAbilities: {
          ...state.specialAbilities,
          [abilityId]: {
            ...state.specialAbilities[abilityId],
            ...updates,
          },
        },
      };
    }
    
    // Stats
    case ActionTypes.ADD_WIN:
      return { ...state, stats: { ...state.stats, wins: state.stats.wins + 1 } };
    
    case ActionTypes.ADD_LOSS:
      return { ...state, stats: { ...state.stats, losses: state.stats.losses + 1 } };
    
    // Reset actions
    case ActionTypes.RESET_GAME:
      return { ...DEFAULT_GAME_STATE, playerName: state.playerName };
    
    case ActionTypes.RESET_PROGRESS:
      return { ...DEFAULT_GAME_STATE };
    
    // Admin action
    case ActionTypes.SET_STATE:
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate breed cost based on raid level
 * @param {number} raidLevel - Current raid level
 * @returns {number} Cost in apples
 */
const calculateBreedCost = (raidLevel) => {
  return RAID_CONFIG.butterfly.baseBreedCost + 
         (raidLevel - 1) * RAID_CONFIG.butterfly.breedCostIncrement;
};

/**
 * Calculate capacity upgrade cost
 * @param {number} currentCapacity - Current max butterflies
 * @returns {number} Cost in apples
 */
const calculateCapacityCost = (currentCapacity) => {
  const upgrades = Math.floor((currentCapacity - RAID_CONFIG.butterfly.baseCapacity) / 
                              RAID_CONFIG.butterfly.capacityIncrement);
  return RAID_CONFIG.butterfly.capacityCostBase + 
         upgrades * RAID_CONFIG.butterfly.capacityCostIncrement;
};

/**
 * Calculate raid level upgrade cost
 * @param {number} currentLevel - Current raid level
 * @returns {number} Cost in apples
 */
const calculateRaidUpgradeCost = (currentLevel) => {
  return RAID_CONFIG.butterfly.raidLevel.upgradeCostBase +
         (currentLevel - 1) * RAID_CONFIG.butterfly.raidLevel.upgradeCostIncrement;
};

// ============================================
// CONTEXT PROVIDER
// ============================================

/**
 * GameState Provider Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Provider component
 */
export const GameStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, DEFAULT_GAME_STATE);
  
  // Load state from AsyncStorage on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        // In a real app, you would load from AsyncStorage here
        // For now, we'll use the default state
        // const savedState = await AsyncStorage.getItem('wurmKrieg3State');
        // if (savedState) {
        //   dispatch({ type: ActionTypes.SET_STATE, payload: JSON.parse(savedState) });
        // }
      } catch (error) {
        console.error('Failed to load game state:', error);
      }
    };
    
    loadState();
  }, []);
  
  // Save state to AsyncStorage on change
  useEffect(() => {
    const saveState = async () => {
      try {
        // In a real app, you would save to AsyncStorage here
        // await AsyncStorage.setItem('wurmKrieg3State', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save game state:', error);
      }
    };
    
    // Throttle saves to avoid performance issues
    const timer = setTimeout(saveState, 1000);
    return () => clearTimeout(timer);
  }, [state]);
  
  // ============================================
  // ACTION CREATORS
  // ============================================
  
  const actions = {
    // Player actions
    setPlayerName: (name) => dispatch({ type: ActionTypes.SET_PLAYER_NAME, payload: name }),
    addApples: (amount) => dispatch({ type: ActionTypes.ADD_APLES, payload: amount }),
    spendApples: (amount) => dispatch({ type: ActionTypes.SPEND_APLES, payload: amount }),
    addStarAnise: (amount) => dispatch({ type: ActionTypes.ADD_STAR_ANISE, payload: amount }),
    spendStarAnise: (amount) => dispatch({ type: ActionTypes.SPEND_STAR_ANISE, payload: amount }),
    
    // Level progression
    unlockLevel: (level) => dispatch({ type: ActionTypes.UNLOCK_LEVEL, payload: level }),
    setUnlockedLevels: (unlockedLevels, count) => 
      dispatch({ type: ActionTypes.SET_UNLOCKED_LEVELS, payload: { unlockedLevels, count } }),
    
    // Research actions
    upgradeSegment: (segmentId, level) => 
      dispatch({ type: ActionTypes.UPGRADE_SEGMENT, payload: { segmentId, level } }),
    setResearchLevel: (segmentId, level) => 
      dispatch({ type: ActionTypes.SET_RESEARCH_LEVEL, payload: { segmentId, level } }),
    
    // Raid actions
    breedButterfly: () => dispatch({ type: ActionTypes.BREED_BUTTERFLY }),
    increaseCapacity: () => dispatch({ type: ActionTypes.INCREASE_CAPACITY }),
    upgradeRaidLevel: () => dispatch({ type: ActionTypes.UPGRADE_RAID_LEVEL }),
    setButterflies: (ready, max) => 
      dispatch({ type: ActionTypes.SET_BUTTERFLIES, payload: { ready, max } }),
    
    // Special abilities
    unlockSpecialAbility: (abilityId) => 
      dispatch({ type: ActionTypes.UNLOCK_SPECIAL_ABILITY, payload: { abilityId } }),
    useSpecialAbility: (abilityId) => 
      dispatch({ type: ActionTypes.USE_SPECIAL_ABILITY, payload: { abilityId } }),
    updateSpecialAbility: (abilityId, updates) => 
      dispatch({ type: ActionTypes.UPDATE_SPECIAL_ABILITY, payload: { abilityId, updates } }),
    
    // Stats
    addWin: () => dispatch({ type: ActionTypes.ADD_WIN }),
    addLoss: () => dispatch({ type: ActionTypes.ADD_LOSS }),
    
    // Reset
    resetGame: () => dispatch({ type: ActionTypes.RESET_GAME }),
    resetProgress: () => dispatch({ type: ActionTypes.RESET_PROGRESS }),
    
    // Admin
    setState: (updates) => dispatch({ type: ActionTypes.SET_STATE, payload: updates }),
    
    // Helper functions
    canAfford: (cost, currency = 'apples') => {
      if (currency === 'apples') {
        return state.apples >= cost;
      } else {
        return state.starAnise >= cost;
      }
    },
    
    getSegmentLevel: (segmentId) => state.researchLevels[segmentId] || 0,
    isLevelUnlocked: (level) => level <= state.unlockedLevelsCount,
    isSpecialAbilityUnlocked: (abilityId) => state.specialAbilities[abilityId]?.unlocked || false,
  };
  
  const value = { state, ...actions };
  
  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

// ============================================
// CONTEXT CREATION
// ============================================

/**
 * GameState Context
 * @type {React.Context<Object>}
 */
const GameStateContext = createContext(null);

/**
 * Custom hook to use game state
 * @returns {Object} Game state and actions
 */
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

export default GameStateContext;
