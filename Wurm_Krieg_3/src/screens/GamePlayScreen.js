/**
 * Wurm Krieg 3 - Game Play Screen
 * 
 * This screen implements the core battle engine and HUD for gameplay.
 * It forces landscape orientation during gameplay.
 * 
 * @author DasImperium
 * @version 1.0.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  PanResponder,
  Animated,
  Easing,
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useGameState } from '../contexts/GameStateContext';
import {
  GAME_CONSTANTS,
  BASE_STATS,
  SEGMENTS,
  getBaseStats,
  getSegment,
  calculateWormSpeed,
  calculateWormHealth,
} from '../config/gameConfig';

/**
 * Game Play Screen Component
 * 
 * Implements:
 * - Landscape mode for gameplay
 * - Wide horizontal scrollable playing field
 * - Two bases (Player Base Left Tree, NPC Base Right Tree)
 * - 5 horizontal lanes for visual separation
 * - Top Half: Battlefield with health bars, defense cannons, worms
 * - Bottom Half: Player Controls & Workshop View
 * - Worm building system
 * - Leaf generation and collection
 * - Apple drop mechanics
 * - Win/Loss conditions
 * 
 * @param {Object} props - Navigation and route props
 * @returns {JSX.Element} The game play screen
 */
const GamePlayScreen = ({ navigation, route }) => {
  const { state, addApples, addWin, addLoss } = useGameState();
  const { mode, level, segments: initialSegments } = route.params || {};
  
  // Game state
  const [gameState, setGameState] = useState({
    playerBaseHP: getBaseStats(0).hp,
    enemyBaseHP: getBaseStats(0).hp,
    playerBaseMaxHP: getBaseStats(0).hp,
    enemyBaseMaxHP: getBaseStats(0).hp,
    leaves: 0,
    maxLeaves: getBaseStats(0).economy.maxStorage,
    leavesPerSecond: getBaseStats(0).economy.generationRate,
    worms: [],
    enemyWorms: [],
    projectiles: [],
    fallingLeaves: [],
    fallingApples: [],
    collectedApples: 0,
    gameActive: true,
    gameWon: false,
    gameLost: false,
  });
  
  // Workshop state
  const [workshopSegments, setWorkshopSegments] = useState([...initialSegments]);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [wormPreview, setWormPreview] = useState([]);
  
  // Refs for animation
  const scrollViewRef = useRef(null);
  const gameLoopRef = useRef(null);
  const lastUpdateTime = useRef(Date.now());
  
  // Dimensions
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });
  
  // Calculate map dimensions
  const mapWidth = GAME_CONSTANTS.MAP_DEFAULT_LENGTH * 2;
  const mapHeight = dimensions.height * 0.6;
  const laneHeight = mapHeight / GAME_CONSTANTS.NUM_LANES;
  
  // Set landscape orientation on mount
  useEffect(() => {
    const setLandscape = async () => {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch (error) {
        console.error('Failed to lock landscape orientation:', error);
      }
    };
    
    setLandscape();
    
    // Cleanup on unmount
    return () => {
      ScreenOrientation.unlockAsync();
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);
  
  // Handle dimension changes
  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    };
    
    Dimensions.addEventListener('change', onChange);
    return () => Dimensions.removeEventListener('change', onChange);
  }, []);
  
  // Initialize game
  useEffect(() => {
    initializeGame();
    startGameLoop();
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);
  
  /**
   * Initialize game state
   */
  const initializeGame = () => {
    // Create initial player worm
    const initialWorm = createWorm(initialSegments, 'player', 50, 2);
    
    // Create initial enemy worm
    const enemySegments = ['head', 'mg', 'füsse']; // Simple enemy for now
    const initialEnemyWorm = createWorm(enemySegments, 'enemy', mapWidth - 50, 2);
    
    setGameState(prev => ({
      ...prev,
      worms: [initialWorm],
      enemyWorms: [initialEnemyWorm],
    }));
    
    // Set up worm preview
    setWormPreview(initialSegments);
  };
  
  /**
   * Start the game loop
   */
  const startGameLoop = () => {
    const gameLoop = (timestamp) => {
      const deltaTime = timestamp - lastUpdateTime.current;
      lastUpdateTime.current = timestamp;
      
      updateGame(deltaTime);
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };
  
  /**
   * Update game state
   */
  const updateGame = (deltaTime) => {
    if (!gameState.gameActive) return;
    
    // Convert deltaTime from ms to seconds
    const deltaSeconds = deltaTime / 1000;
    
    setGameState(prev => {
      const newState = { ...prev };
      
      // Update leaf generation
      newState.leaves = Math.min(
        newState.leaves + (newState.leavesPerSecond * deltaSeconds),
        newState.maxLeaves
      );
      
      // Random leaf fall events
      if (Math.random() < 0.01) { // 1% chance per frame
        const fallingLeaf = {
          id: Date.now() + Math.random(),
          x: Math.random() * (mapWidth - 40) + 20,
          y: -20,
          width: 15,
          height: 15,
          value: Math.floor(Math.random() * 11) + 20, // 20-30 leaves
        };
        newState.fallingLeaves.push(fallingLeaf);
      }
      
      // Update falling leaves
      newState.fallingLeaves = newState.fallingLeaves
        .filter(leaf => leaf.y < mapHeight + 20)
        .map(leaf => ({
          ...leaf,
          y: leaf.y + 150 * deltaSeconds, // Fall speed
        }));
      
      // Update falling apples
      newState.fallingApples = newState.fallingApples
        .filter(apple => apple.y < mapHeight + 20)
        .map(apple => ({
          ...apple,
          y: apple.y + 150 * deltaSeconds,
        }));
      
      // Update worms
      newState.worms = newState.worms.map(worm => updateWorm(worm, 'player', newState));
      newState.enemyWorms = newState.enemyWorms.map(worm => updateWorm(worm, 'enemy', newState));
      
      // Update projectiles
      newState.projectiles = newState.projectiles
        .filter(projectile => projectile.x >= 0 && projectile.x <= mapWidth)
        .map(projectile => ({
          ...projectile,
          x: projectile.x + (projectile.speed * deltaSeconds * (projectile.direction === 'right' ? 1 : -1)),
        }));
      
      // Check for collisions
      checkCollisions(newState);
      
      // Check win/loss conditions
      if (newState.playerBaseHP <= 0) {
        newState.gameActive = false;
        newState.gameLost = true;
        endGame(false);
      }
      
      if (newState.enemyBaseHP <= 0) {
        newState.gameActive = false;
        newState.gameWon = true;
        endGame(true);
      }
      
      return newState;
    });
  };
  
  /**
   * Update worm position and state
   */
  const updateWorm = (worm, team, gameState) => {
    const newWorm = { ...worm };
    
    // Check if worm is dead
    if (newWorm.health <= 0) {
      return null; // Remove dead worm
    }
    
    // Find target
    const targetWorms = team === 'player' ? gameState.enemyWorms : gameState.worms;
    const targetBaseX = team === 'player' ? mapWidth - 20 : 20;
    
    // Check if any target is in range
    let targetInRange = false;
    
    for (const targetWorm of targetWorms) {
      if (!targetWorm) continue;
      
      const distance = Math.abs(newWorm.x - targetWorm.x);
      const maxRange = getWormMaxRange(newWorm.segments);
      
      if (distance <= maxRange) {
        targetInRange = true;
        break;
      }
    }
    
    // If no target in range, move towards enemy base
    if (!targetInRange) {
      const direction = team === 'player' ? 1 : -1;
      newWorm.x += newWorm.speed * GAME_CONSTANTS.GAME_TICK_INTERVAL / 1000 * direction;
      
      // Clamp position to map bounds
      newWorm.x = Math.max(20, Math.min(mapWidth - 20, newWorm.x));
    } else {
      // Attack if in range
      if (newWorm.lastAttack + newWorm.attackCooldown < Date.now()) {
        // Find closest target
        let closestTarget = null;
        let closestDistance = Infinity;
        
        for (const targetWorm of targetWorms) {
          if (!targetWorm) continue;
          
          const distance = Math.abs(newWorm.x - targetWorm.x);
          const maxRange = getWormMaxRange(newWorm.segments);
          
          if (distance <= maxRange && distance < closestDistance) {
            closestDistance = distance;
            closestTarget = targetWorm;
          }
        }
        
        if (closestTarget) {
          // Perform attack
          const damage = getWormDamage(newWorm.segments);
          closestTarget.health -= damage;
          
          // Apply knockback
          const knockback = getWormKnockback(newWorm.segments);
          closestTarget.x += knockback * (team === 'player' ? 1 : -1);
          
          newWorm.lastAttack = Date.now();
        }
      }
    }
    
    return newWorm;
  };
  
  /**
   * Check for collisions between worms and projectiles
   */
  const checkCollisions = (gameState) => {
    // Check projectile collisions with worms
    for (const projectile of gameState.projectiles) {
      for (let i = 0; i < gameState.worms.length; i++) {
        const worm = gameState.worms[i];
        if (!worm) continue;
        
        const distance = Math.abs(projectile.x - worm.x);
        if (distance < 15) { // Collision distance
          worm.health -= projectile.damage;
          // Remove projectile
          gameState.projectiles = gameState.projectiles.filter(p => p.id !== projectile.id);
          break;
        }
      }
      
      for (let i = 0; i < gameState.enemyWorms.length; i++) {
        const worm = gameState.enemyWorms[i];
        if (!worm) continue;
        
        const distance = Math.abs(projectile.x - worm.x);
        if (distance < 15) {
          worm.health -= projectile.damage;
          gameState.projectiles = gameState.projectiles.filter(p => p.id !== projectile.id);
          break;
        }
      }
    }
    
    // Check worm collisions (X-axis only)
    for (const playerWorm of gameState.worms) {
      if (!playerWorm) continue;
      
      for (const enemyWorm of gameState.enemyWorms) {
        if (!enemyWorm) continue;
        
        // Check if worms are at the same X coordinate (regardless of lane)
        if (Math.abs(playerWorm.x - enemyWorm.x) < 20) {
          // Both worms take damage
          playerWorm.health -= 5; // Melee damage
          enemyWorm.health -= 5;
          
          // Apply knockback
          playerWorm.x -= 5;
          enemyWorm.x += 5;
        }
      }
    }
    
    // Check if worms reached enemy base
    for (const worm of gameState.worms) {
      if (!worm) continue;
      
      if (worm.x >= mapWidth - 30) {
        // Attack enemy base
        gameState.enemyBaseHP -= 10 * (GAME_CONSTANTS.GAME_TICK_INTERVAL / 1000);
        
        // Check for apple drop
        if (gameState.enemyBaseHP < gameState.enemyBaseMaxHP * GAME_CONSTANTS.APPLE_DROP_THRESHOLD) {
          if (Math.random() < GAME_CONSTANTS.APPLE_DROP_CHANCE) {
            gameState.fallingApples.push({
              id: Date.now() + Math.random(),
              x: mapWidth - 30,
              y: 50,
              width: 20,
              height: 20,
            });
          }
        }
      }
    }
    
    for (const worm of gameState.enemyWorms) {
      if (!worm) continue;
      
      if (worm.x <= 30) {
        // Attack player base
        gameState.playerBaseHP -= 10 * (GAME_CONSTANTS.GAME_TICK_INTERVAL / 1000);
        
        // Check for apple drop
        if (gameState.playerBaseHP < gameState.playerBaseMaxHP * GAME_CONSTANTS.APPLE_DROP_THRESHOLD) {
          if (Math.random() < GAME_CONSTANTS.APPLE_DROP_CHANCE) {
            gameState.fallingApples.push({
              id: Date.now() + Math.random(),
              x: 30,
              y: 50,
              width: 20,
              height: 20,
            });
          }
        }
      }
    }
  };
  
  /**
   * End the game
   */
  const endGame = (won) => {
    if (won) {
      // Calculate reward
      const reward = GAME_CONSTANTS.BASE_VICTORY_REWARD + gameState.collectedApples;
      addApples(reward);
      addWin();
      
      // Unlock next level if this was a level battle
      if (mode === 'level' && level > 0 && level <= 100) {
        // In a real implementation, we would unlock the next level
        // For now, just show a message
        setTimeout(() => {
          alert(`Sieg! Du hast ${reward} Äpfel erhalten!`);
        }, 100);
      }
    } else {
      addLoss();
      setTimeout(() => {
        alert('Niederlage! Versuche es erneut.');
      }, 100);
    }
    
    // Return to main menu after a delay
    setTimeout(() => {
      navigation.navigate('MainMenu');
    }, 3000);
  };
  
  /**
   * Create a new worm
   */
  const createWorm = (segmentIds, team, x, lane) => {
    const segments = segmentIds.map(id => getSegment(id)).filter(Boolean);
    
    return {
      id: Date.now() + Math.random(),
      team,
      segments: segmentIds,
      x,
      y: lane * laneHeight + laneHeight / 2,
      speed: calculateWormSpeed(segmentIds),
      health: calculateWormHealth(segmentIds, state.researchLevels),
      maxHealth: calculateWormHealth(segmentIds, state.researchLevels),
      attackCooldown: 1000, // Base cooldown
      lastAttack: 0,
      lane,
    };
  };
  
  /**
   * Get worm max range
   */
  const getWormMaxRange = (segmentIds) => {
    let maxRange = GAME_CONSTANTS.DEFAULT_MELEE_RANGE;
    
    for (const segmentId of segmentIds) {
      const segment = getSegment(segmentId);
      if (segment && segment.baseRange > maxRange) {
        maxRange = segment.baseRange;
      }
    }
    
    return maxRange;
  };
  
  /**
   * Get worm damage
   */
  const getWormDamage = (segmentIds) => {
    let totalDamage = GAME_CONSTANTS.MELEE_DAMAGE;
    
    for (const segmentId of segmentIds) {
      const segment = getSegment(segmentId);
      if (segment && segment.baseDamage > 0) {
        totalDamage += segment.baseDamage;
      }
    }
    
    return totalDamage;
  };
  
  /**
   * Get worm knockback
   */
  const getWormKnockback = (segmentIds) => {
    let knockback = GAME_CONSTANTS.MELEE_KNOCKBACK;
    
    for (const segmentId of segmentIds) {
      const segment = getSegment(segmentId);
      if (segment && segment.knockback > knockback) {
        knockback = segment.knockback;
      }
    }
    
    return knockback;
  };
  
  /**
   * Handle leaf collection
   */
  const handleLeafCollect = (leafId) => {
    setGameState(prev => {
      const leaf = prev.fallingLeaves.find(l => l.id === leafId);
      if (!leaf) return prev;
      
      const newState = { ...prev };
      newState.leaves = Math.min(
        newState.leaves + leaf.value,
        newState.maxLeaves
      );
      newState.fallingLeaves = newState.fallingLeaves.filter(l => l.id !== leafId);
      
      return newState;
    });
  };
  
  /**
   * Handle apple collection
   */
  const handleAppleCollect = (appleId) => {
    setGameState(prev => {
      const newState = { ...prev };
      newState.fallingApples = newState.fallingApples.filter(a => a.id !== appleId);
      newState.collectedApples += 1;
      
      return newState;
    });
  };
  
  /**
   * Add a segment to the worm preview
   */
  const addSegmentToPreview = (segmentId) => {
    if (wormPreview.length >= 8) {
      alert('Maximal 8 Segmente!');
      return;
    }
    
    if (wormPreview.includes(segmentId)) {
      alert('Dieses Segment ist bereits ausgewählt!');
      return;
    }
    
    // Check if segment is available (researched)
    if ((state.researchLevels[segmentId] || 0) === 0 && segmentId !== 'head') {
      alert('Dieses Segment wurde noch nicht erforscht!');
      return;
    }
    
    setWormPreview(prev => [...prev, segmentId]);
  };
  
  /**
   * Remove a segment from the worm preview
   */
  const removeSegmentFromPreview = (segmentId) => {
    if (segmentId === 'head') return; // Cannot remove head
    
    setWormPreview(prev => prev.filter(id => id !== segmentId));
  };
  
  /**
   * Launch the worm
   */
  const launchWorm = () => {
    if (wormPreview.length === 0) {
      alert('Bitte füge mindestens ein Segment hinzu!');
      return;
    }
    
    // Check if we have enough leaves
    const wormCost = wormPreview.length * 10; // 10 leaves per segment
    if (gameState.leaves < wormCost) {
      alert(`Du brauchst ${wormCost} Blätter für diesen Wurm!`);
      return;
    }
    
    // Create and launch the worm
    const newWorm = createWorm(wormPreview, 'player', 50, 2);
    
    setGameState(prev => ({
      ...prev,
      worms: [...prev.worms, newWorm],
      leaves: prev.leaves - wormCost,
    }));
    
    // Reset preview for next worm
    setWormPreview(['head']);
  };
  
  /**
   * Render a worm
   */
  const renderWorm = (worm, index) => {
    if (!worm) return null;
    
    const width = 20 + worm.segments.length * 10;
    const healthPercentage = (worm.health / worm.maxHealth) * 100;
    
    return (
      <View
        key={worm.id}
        style={[
          styles.worm,
          {
            left: worm.x - width / 2,
            top: worm.y - 10,
            width,
            height: 20,
          },
          worm.team === 'player' ? styles.playerWorm : styles.enemyWorm,
        ]}
      >
        {/* Health bar */}
        <View style={styles.healthBarContainer}>
          <View
            style={[
              styles.healthBar,
              {
                width: `${healthPercentage}%`,
                backgroundColor: healthPercentage > 50 ? '#4CAF50' : healthPercentage > 25 ? '#FFC107' : '#e94560',
              },
            ]}
          />
        </View>
        
        {/* Worm body */}
        <View style={styles.wormBody}>
          {worm.segments.map((segmentId, i) => {
            const segment = getSegment(segmentId);
            return (
              <View
                key={i}
                style={[
                  styles.segment,
                  {
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: segment ? '#' + Math.floor(Math.random() * 16777215).toString(16) : '#666',
                  },
                ]}
              />
            );
          })}
        </View>
        
        {/* Head (with beret for player) */}
        <View
          style={[
            styles.wormHead,
            worm.team === 'player' && styles.playerHead,
          ]}
        >
          {worm.team === 'player' && (
            <View style={styles.beret} />
          )}
        </View>
      </View>
    );
  };
  
  /**
   * Render a falling leaf
   */
  const renderFallingLeaf = (leaf) => {
    return (
      <TouchableOpacity
        key={leaf.id}
        onPress={() => handleLeafCollect(leaf.id)}
        style={[
          styles.fallingLeaf,
          {
            left: leaf.x - leaf.width / 2,
            top: leaf.y,
            width: leaf.width,
            height: leaf.height,
          },
        ]}
      >
        <Text style={styles.leafIcon}>🍃</Text>
        <Text style={styles.leafValue}>+{leaf.value}</Text>
      </TouchableOpacity>
    );
  };
  
  /**
   * Render a falling apple
   */
  const renderFallingApple = (apple) => {
    return (
      <TouchableOpacity
        key={apple.id}
        onPress={() => handleAppleCollect(apple.id)}
        style={[
          styles.fallingApple,
          {
            left: apple.x - apple.width / 2,
            top: apple.y,
            width: apple.width,
            height: apple.height,
          },
        ]}
      >
        <Text style={styles.appleIcon}>🍎</Text>
      </TouchableOpacity>
    );
  };
  
  /**
   * Render a segment button for workshop
   */
  const renderSegmentButton = (segmentId) => {
    const segment = getSegment(segmentId);
    if (!segment) return null;
    
    const isInPreview = wormPreview.includes(segmentId);
    const isAvailable = (state.researchLevels[segmentId] || 0) > 0 || segmentId === 'head';
    
    return (
      <TouchableOpacity
        key={segmentId}
        onPress={() => isAvailable && addSegmentToPreview(segmentId)}
        style={[
          styles.segmentButton,
          isInPreview && styles.segmentButtonSelected,
          !isAvailable && styles.segmentButtonLocked,
        ]}
        disabled={!isAvailable}
      >
        <Text style={styles.segmentButtonText}>{segment.name}</Text>
        {isInPreview && <Text style={styles.segmentButtonCheck}>✓</Text>}
        {!isAvailable && <Text style={styles.segmentButtonLock}>🔒</Text>}
      </TouchableOpacity>
    );
  };
  
  /**
   * Render worm preview
   */
  const renderWormPreview = () => {
    return (
      <View style={styles.wormPreview}>
        <Text style={styles.wormPreviewTitle}>Wurm-Vorschau:</Text>
        <View style={styles.wormPreviewContainer}>
          {wormPreview.map((segmentId, i) => {
            const segment = getSegment(segmentId);
            return (
              <TouchableOpacity
                key={i}
                onPress={() => removeSegmentFromPreview(segmentId)}
                disabled={segmentId === 'head'}
                style={[
                  styles.previewSegment,
                  segmentId === 'head' && styles.previewHead,
                ]}
              >
                <Text style={styles.previewSegmentText}>{segment ? segment.name : segmentId}</Text>
                {segmentId !== 'head' && (
                  <Text style={styles.previewSegmentRemove}>✗</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.wormPreviewCost}>
          Kosten: {wormPreview.length * 10} Blätter
        </Text>
      </View>
    );
  };
  
  if (!gameState.gameActive && (gameState.gameWon || gameState.gameLost)) {
    return (
      <View style={styles.gameOverContainer}>
        <Text style={styles.gameOverTitle}>
          {gameState.gameWon ? 'SIEG!' : 'NIEDERLAGE!'}
        </Text>
        <Text style={styles.gameOverText}>
          {gameState.gameWon 
            ? `Du hast ${GAME_CONSTANTS.BASE_VICTORY_REWARD + gameState.collectedApples} Äpfel erhalten!`
            : 'Deine Basis wurde zerstört.'}
        </Text>
        <Text style={styles.gameOverSubtext}>
          Zurück zum Hauptmenü...
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Battlefield (Top Half) */}
      <View style={[styles.battlefield, { height: mapHeight }]}>
        {/* Player Base */}
        <View style={[styles.base, styles.playerBase, { left: 20, top: mapHeight / 2 - 40 }]}>
          <View style={styles.baseTree}>
            <Text style={styles.treeIcon}>🌳</Text>
          </View>
          <View style={styles.baseHealthBarContainer}>
            <View
              style={[
                styles.baseHealthBar,
                {
                  width: `${(gameState.playerBaseHP / gameState.playerBaseMaxHP) * 100}%`,
                  backgroundColor: (gameState.playerBaseHP / gameState.playerBaseMaxHP) > 0.5 
                    ? '#4CAF50' 
                    : (gameState.playerBaseHP / gameState.playerBaseMaxHP) > 0.25 
                      ? '#FFC107' 
                      : '#e94560',
                },
              ]}
            />
          </View>
          <Text style={styles.baseHealthText}>
            {Math.floor(gameState.playerBaseHP)}/{gameState.playerBaseMaxHP}
          </Text>
        </View>
        
        {/* Enemy Base */}
        <View style={[styles.base, styles.enemyBase, { right: 20, top: mapHeight / 2 - 40 }]}>
          <View style={styles.baseTree}>
            <Text style={styles.treeIcon}>🌳</Text>
          </View>
          <View style={styles.baseHealthBarContainer}>
            <View
              style={[
                styles.baseHealthBar,
                {
                  width: `${(gameState.enemyBaseHP / gameState.enemyBaseMaxHP) * 100}%`,
                  backgroundColor: (gameState.enemyBaseHP / gameState.enemyBaseMaxHP) > 0.5 
                    ? '#4CAF50' 
                    : (gameState.enemyBaseHP / gameState.enemyBaseMaxHP) > 0.25 
                      ? '#FFC107' 
                      : '#e94560',
                },
              ]}
            />
          </View>
          <Text style={styles.baseHealthText}>
            {Math.floor(gameState.enemyBaseHP)}/{gameState.enemyBaseMaxHP}
          </Text>
        </View>
        
        {/* Worms */}
        <View style={styles.wormsContainer}>
          {gameState.worms.map(renderWorm)}
          {gameState.enemyWorms.map(renderWorm)}
        </View>
        
        {/* Falling Leaves */}
        <View style={styles.fallingItemsContainer}>
          {gameState.fallingLeaves.map(renderFallingLeaf)}
          {gameState.fallingApples.map(renderFallingApple)}
        </View>
        
        {/* Lane Separators */}
        {Array.from({ length: GAME_CONSTANTS.NUM_LANES - 1 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.laneSeparator,
              {
                top: (i + 1) * laneHeight,
                width: mapWidth,
              },
            ]}
          />
        ))}
      </View>
      
      {/* Workshop (Bottom Half) */}
      <View style={styles.workshop}>
        <View style={styles.workshopHeader}>
          <Text style={styles.workshopTitle}>Werkstatt</Text>
          <View style={styles.leavesDisplay}>
            <Text style={styles.leavesIcon}>🍃</Text>
            <Text style={styles.leavesValue}>{Math.floor(gameState.leaves)}/{gameState.maxLeaves}</Text>
          </View>
        </View>
        
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.segmentsContainer}
        >
          {Object.keys(SEGMENTS).map(renderSegmentButton)}
        </ScrollView>
        
        {renderWormPreview()}
        
        <TouchableOpacity
          onPress={launchWorm}
          style={styles.launchButton}
          disabled={wormPreview.length === 0 || gameState.leaves < wormPreview.length * 10}
        >
          <Text style={styles.launchButtonText}>Wurm starten ({wormPreview.length * 10} Blätter)</Text>
        </TouchableOpacity>
      </View>
      
      {/* Pause/Back Button */}
      <TouchableOpacity
        onPress={() => {
          if (gameState.gameActive) {
            // Pause game
            setGameState(prev => ({ ...prev, gameActive: false }));
            // Show confirmation
            alert('Möchtest du das Spiel wirklich verlassen?', [
              { text: 'Abbrechen', onPress: () => setGameState(prev => ({ ...prev, gameActive: true })) },
              { text: 'Verlassen', onPress: () => navigation.goBack() },
            ]);
          }
        }}
        style={styles.pauseButton}
      >
        <Text style={styles.pauseButtonText}>⏸️</Text>
      </TouchableOpacity>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  battlefield: {
    position: 'relative',
    backgroundColor: '#1a1a2e',
    overflow: 'hidden',
  },
  base: {
    position: 'absolute',
    alignItems: 'center',
  },
  playerBase: {
    left: 20,
  },
  enemyBase: {
    right: 20,
  },
  baseTree: {
    width: 40,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  treeIcon: {
    fontSize: 60,
  },
  baseHealthBarContainer: {
    width: 100,
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
    marginTop: 10,
    overflow: 'hidden',
  },
  baseHealthBar: {
    height: '100%',
    borderRadius: 5,
  },
  baseHealthText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
    textAlign: 'center',
  },
  wormsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  worm: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerWorm: {
    // Player worm styling
  },
  enemyWorm: {
    // Enemy worm styling
  },
  healthBarContainer: {
    position: 'absolute',
    top: -5,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  healthBar: {
    height: '100%',
    borderRadius: 2,
  },
  wormBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segment: {
    marginHorizontal: 1,
  },
  wormHead: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e94560',
    position: 'absolute',
    left: -6,
  },
  playerHead: {
    backgroundColor: '#4CAF50',
  },
  beret: {
    width: 8,
    height: 6,
    backgroundColor: '#1a237e',
    borderRadius: 4,
    position: 'absolute',
    top: -3,
    left: 2,
  },
  fallingItemsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fallingLeaf: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leafIcon: {
    fontSize: 16,
  },
  leafValue: {
    fontSize: 10,
    color: '#FFD700',
    marginTop: 2,
  },
  fallingApple: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appleIcon: {
    fontSize: 20,
  },
  laneSeparator: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  workshop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 15,
  },
  workshopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  workshopTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  leavesDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leavesIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  leavesValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  segmentsContainer: {
    paddingBottom: 10,
  },
  segmentButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  segmentButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  segmentButtonLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.5,
  },
  segmentButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  segmentButtonCheck: {
    color: '#FFD700',
    fontSize: 14,
    marginLeft: 5,
  },
  segmentButtonLock: {
    fontSize: 12,
  },
  wormPreview: {
    marginBottom: 15,
  },
  wormPreviewTitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  wormPreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  previewSegment: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 6,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewHead: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
  },
  previewSegmentText: {
    color: '#fff',
    fontSize: 12,
  },
  previewSegmentRemove: {
    color: '#e94560',
    fontSize: 14,
    marginLeft: 5,
  },
  wormPreviewCost: {
    fontSize: 12,
    color: '#FFD700',
    textAlign: 'right',
  },
  launchButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  launchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pauseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  gameOverTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#e94560',
    marginBottom: 20,
  },
  gameOverText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  gameOverSubtext: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
});

export default GamePlayScreen;
