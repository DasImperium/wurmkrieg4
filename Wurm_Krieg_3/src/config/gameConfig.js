/**
 * Wurm Krieg 3 - Game Configuration & Balancing Data
 * 
 * This file contains all game constants, segment data, economy variables, and base stats.
 * All values can be manually tuned for balancing without affecting game logic.
 * 
 * @author DasImperium
 * @version 1.0.0
 */

// ============================================
// GAME CONSTANTS
// ============================================

export const GAME_CONSTANTS = {
  // Map dimensions (abstract units)
  MAP_MIN_LENGTH: 120,
  MAP_MAX_LENGTH: 240,
  MAP_DEFAULT_LENGTH: 180,
  
  // Lane configuration
  NUM_LANES: 5,
  LANE_HEIGHT: 60,
  
  // Game timing
  GAME_TICK_INTERVAL: 16, // ms (approximately 60 FPS)
  LEAF_FALL_INTERVAL: 3000, // ms between random leaf fall events
  
  // Worm mechanics
  MIN_WORM_SPEED: 0.5, // Minimum speed even with many non-speed segments
  WORM_SEGMENT_WIDTH: 20, // Abstract width of one segment
  DEFAULT_MELEE_RANGE: 20, // Range for worms with no weapons
  MELEE_DAMAGE: 5, // Base melee bite damage
  MELEE_KNOCKBACK: 1, // Base melee knockback units
  
  // Apple drop mechanics
  APPLE_DROP_THRESHOLD: 0.6, // 60% HP threshold for apple drops
  APPLE_DROP_CHANCE: 0.04, // 4% chance per hit when below threshold
  APPLE_COLLECT_BONUS_MIN: 20,
  APPLE_COLLECT_BONUS_MAX: 30,
  
  // Victory rewards
  BASE_VICTORY_REWARD: 5,
  APPLE_COLLECTION_MULTIPLIER: 1, // n apples collected = n * multiplier
};

// ============================================
// BASE (TREE) STATS & ECONOMY
// ============================================

export const BASE_STATS = {
  // Level 0 base stats
  base: {
    hp: 1000,
    economy: {
      generationRate: 2, // leaves per second
      maxStorage: 750,
    },
    defense: {
      fireRate: 2000, // ms between shots (1 shot every 2 seconds)
      damage: 10,
      range: 20,
    },
  },
  
  // Level upgrades: each level doubles production speed and max storage
  // Each level upgrade increases max HP by 66% of previous level
  upgrades: {
    levelMultipliers: {
      // Level: { hpMultiplier, economyMultiplier, defenseMultiplier }
      1: { hp: 0.66, economy: 2, defense: 2 },
      2: { hp: 0.66, economy: 2, defense: 2 },
      3: { hp: 0.66, economy: 2, defense: 2 },
    },
  },
};

// Helper function to calculate base stats at a given level
export const getBaseStats = (level) => {
  const base = { ...BASE_STATS.base };
  
  for (let i = 1; i <= level; i++) {
    const upgrade = BASE_STATS.upgrades.levelMultipliers[i];
    if (upgrade) {
      // HP increases by 66% of previous level
      base.hp += base.hp * upgrade.hp;
      
      // Economy doubles each level
      base.economy.generationRate *= upgrade.economy;
      base.economy.maxStorage *= upgrade.economy;
      
      // Defense doubles each level
      base.defense.fireRate /= upgrade.defense;
      base.defense.damage *= upgrade.defense;
    }
  }
  
  return base;
};

// ============================================
// SEGMENT DEFINITIONS
// ============================================

/**
 * Segment Types Enum
 * @typedef {Object} SegmentType
 * @property {string} id - Unique identifier
 * @property {string} name - Display name (German)
 * @property {string} description - Description (German)
 * @property {number} baseHealth - Base health points
 * @property {number} baseDamage - Base damage per attack
 * @property {number} baseRange - Base attack range in units
 * @property {number} baseCooldown - Base cooldown in milliseconds
 * @property {number} armorReduction - Percentage of damage reduction (0-100)
 * @property {number} healing - Health regenerated per tick
 * @property {number} poisonDuration - Poison duration in seconds
 * @property {number} poisonDamage - Damage per second from poison
 * @property {number} knockback - Knockback distance in units
 * @property {number} spawnFrequency - Time between spawns in seconds
 * @property {number} speedModifier - Speed multiplier (1.0 = normal, >1 = faster, <1 = slower)
 * @property {number[]} upgradeCosts - Cost for each upgrade level (0-5, index 0 is level 1 cost)
 * @property {string} currencyType - 'apples' or 'starAnise' for upgrade costs
 * @property {boolean} isSpeedSegment - Whether this segment affects movement speed
 */

// Speed modifier for non-speed segments (every segment except "Füße" reduces speed)
const NON_SPEED_SEGMENT_MODIFIER = 0.95;

export const SEGMENTS = {
  // 1. Füße (Increases overall speed)
  füsse: {
    id: 'füsse',
    name: 'Füße',
    description: 'Erhöht die Gesamtgeschwindigkeit des Wurms',
    baseHealth: 50,
    baseDamage: 0,
    baseRange: 0,
    baseCooldown: 0,
    armorReduction: 0,
    healing: 0,
    poisonDuration: 0,
    poisonDamage: 0,
    knockback: 0,
    spawnFrequency: 0,
    speedModifier: 1.15, // 15% speed increase per segment
    upgradeCosts: [50, 75, 100, 150, 200], // Apples for levels 1-5
    currencyType: 'apples',
    isSpeedSegment: true,
    maxLevel: 5,
  },
  
  // 2. MG (Low range, fast fire)
  mg: {
    id: 'mg',
    name: 'MG',
    description: 'Maschinengewehr - Geringe Reichweite, schnelles Feuer',
    baseHealth: 80,
    baseDamage: 8,
    baseRange: 15,
    baseCooldown: 100, // 100ms cooldown = 10 shots per second
    armorReduction: 0,
    healing: 0,
    poisonDuration: 0,
    poisonDamage: 0,
    knockback: 0.5,
    spawnFrequency: 0,
    speedModifier: NON_SPEED_SEGMENT_MODIFIER,
    upgradeCosts: [60, 90, 120, 180, 250],
    currencyType: 'apples',
    isSpeedSegment: false,
    maxLevel: 5,
  },
  
  // 3. Kanone (Longer range, high single-target)
  kanone: {
    id: 'kanone',
    name: 'Kanone',
    description: 'Lange Reichweite, hoher Einzelschaden',
    baseHealth: 100,
    baseDamage: 25,
    baseRange: 40,
    baseCooldown: 1500, // 1.5 seconds
    armorReduction: 0,
    healing: 0,
    poisonDuration: 0,
    poisonDamage: 0,
    knockback: 1,
    spawnFrequency: 0,
    speedModifier: NON_SPEED_SEGMENT_MODIFIER,
    upgradeCosts: [80, 120, 160, 240, 350],
    currencyType: 'apples',
    isSpeedSegment: false,
    maxLevel: 5,
  },
  
  // 4. Honigkanone (Low range, slows enemy speed)
  honigkanone: {
    id: 'honigkanone',
    name: 'Honigkanone',
    description: 'Geringe Reichweite, verlangsamt Gegner',
    baseHealth: 70,
    baseDamage: 6,
    baseRange: 12,
    baseCooldown: 800,
    armorReduction: 0,
    healing: 0,
    poisonDuration: 0,
    poisonDamage: 0,
    knockback: 0,
    spawnFrequency: 0,
    speedModifier: NON_SPEED_SEGMENT_MODIFIER,
    slowAmount: 0.3, // 30% slow
    slowDuration: 3000, // 3 seconds
    upgradeCosts: [70, 105, 140, 210, 300],
    currencyType: 'apples',
    isSpeedSegment: false,
    maxLevel: 5,
  },
  
  // 5. Handgranatenkäfer (Throws fire grenade, AoE damage)
  handgranatenkäfer: {
    id: 'handgranatenkäfer',
    name: 'Handgranatenkäfer',
    description: 'Wirft Brandgranaten mit Flächen-Schaden',
    baseHealth: 60,
    baseDamage: 15,
    baseRange: 25,
    baseCooldown: 2000,
    armorReduction: 0,
    healing: 0,
    poisonDuration: 0,
    poisonDamage: 0,
    knockback: 2,
    spawnFrequency: 0,
    speedModifier: NON_SPEED_SEGMENT_MODIFIER,
    aoeRadius: 10, // Area of effect radius
    upgradeCosts: [90, 135, 180, 270, 400],
    currencyType: 'apples',
    isSpeedSegment: false,
    maxLevel: 5,
  },
  
  // 6. Raketenwerfer (Long range, slow reload, high AoE damage, expensive)
  raketenwerfer: {
    id: 'raketenwerfer',
    name: 'Raketenwerfer',
    description: 'Lange Reichweite, langsames Nachladen, hoher Flächen-Schaden',
    baseHealth: 120,
    baseDamage: 40,
    baseRange: 50,
    baseCooldown: 4000,
    armorReduction: 0,
    healing: 0,
    poisonDuration: 0,
    poisonDamage: 0,
    knockback: 3,
    spawnFrequency: 0,
    speedModifier: NON_SPEED_SEGMENT_MODIFIER,
    aoeRadius: 15,
    upgradeCosts: [150, 225, 300, 450, 600],
    currencyType: 'starAnise', // Uses star anise for upgrades
    isSpeedSegment: false,
    maxLevel: 5,
  },
  
  // 7. Larven (Spawns 4 micro-larvae upon segment/worm death)
  larven: {
    id: 'larven',
    name: 'Larven',
    description: 'Spawn 4 Mikro-Larven beim Tod, die vorwärts kriechen und bei Kontakt explodieren',
    baseHealth: 40,
    baseDamage: 0,
    baseRange: 0,
    baseCooldown: 0,
    armorReduction: 0,
    healing: 0,
    poisonDuration: 0,
    poisonDamage: 0,
    knockback: 0,
    spawnFrequency: 0,
    speedModifier: NON_SPEED_SEGMENT_MODIFIER,
    larvaeCount: 4,
    larvaeDamage: 10,
    larvaeSpeed: 2,
    upgradeCosts: [100, 150, 200, 300, 450],
    currencyType: 'apples',
    isSpeedSegment: false,
    maxLevel: 5,
  },
  
  // 8. Spinnennest (Spawns 3 free mini-cannon-spiders every 8 seconds)
  spinnennest: {
    id: 'spinnennest',
    name: 'Spinnennest',
    description: 'Spawn 3 Mini-Kanonen-Spinnen alle 8 Sekunden',
    baseHealth: 90,
    baseDamage: 0,
    baseRange: 0,
    baseCooldown: 8000, // 8 seconds between spawns
    armorReduction: 0,
    healing: 0,
    poisonDuration: 0,
    poisonDamage: 0,
    knockback: 0,
    spawnFrequency: 8,
    speedModifier: NON_SPEED_SEGMENT_MODIFIER,
    spiderCount: 3,
    spiderDamage: 5,
    spiderRange: 15,
    spiderCooldown: 1000,
    upgradeCosts: [120, 180, 240, 360, 500],
    currencyType: 'apples',
    isSpeedSegment: false,
    maxLevel: 5,
  },
  
  // 9. Kettenhemd (Reduces incoming damage)
  kettenhemd: {
    id: 'kettenhemd',
    name: 'Kettenhemd',
    description: 'Reduziert eingehenden Schaden um 2.5% bei Level 1, +0.5% pro Upgrade',
    baseHealth: 75,
    baseDamage: 0,
    baseRange: 0,
    baseCooldown: 0,
    armorReduction: 2.5, // Base armor reduction at level 1
    healing: 0,
    poisonDuration: 0,
    poisonDamage: 0,
    knockback: 0,
    spawnFrequency: 0,
    speedModifier: NON_SPEED_SEGMENT_MODIFIER,
    armorPerLevel: 0.5, // Additional armor per level
    upgradeCosts: [80, 120, 160, 240, 350],
    currencyType: 'apples',
    isSpeedSegment: false,
    maxLevel: 5,
  },
  
  // 10. Panzer (Adds massive health bonus)
  panzer: {
    id: 'panzer',
    name: 'Panzer',
    description: 'Fügt massive Lebenspunkte hinzu: +300 LP bei Level 1, skalierend',
    baseHealth: 300, // Base health bonus at level 1
    baseDamage: 0,
    baseRange: 0,
    baseCooldown: 0,
    armorReduction: 0,
    healing: 0,
    poisonDuration: 0,
    poisonDamage: 0,
    knockback: 0,
    spawnFrequency: 0,
    speedModifier: NON_SPEED_SEGMENT_MODIFIER,
    healthPerLevel: 300, // Additional health per level
    upgradeCosts: [100, 150, 200, 300, 450],
    currencyType: 'apples',
    isSpeedSegment: false,
    maxLevel: 5,
  },
  
  // 11. Heilung (Regenerates HP, affects poison/fire damage)
  heilung: {
    id: 'heilung',
    name: 'Heilung',
    description: 'Regeneriert 20 LP alle 6 Sekunden, -10% Gift-Schaden aber +10% Feuer-Schaden pro Segment',
    baseHealth: 60,
    baseDamage: 0,
    baseRange: 0,
    baseCooldown: 6000, // 6 seconds between heals
    armorReduction: 0,
    healing: 20, // HP regenerated every 6 seconds
    poisonDuration: 0,
    poisonDamage: 0,
    knockback: 0,
    spawnFrequency: 0,
    speedModifier: NON_SPEED_SEGMENT_MODIFIER,
    poisonResistance: -0.1, // -10% poison damage per segment
    fireVulnerability: 0.1, // +10% fire damage per segment
    upgradeCosts: [90, 135, 180, 270, 400],
    currencyType: 'apples',
    isSpeedSegment: false,
    maxLevel: 5,
  },
  
  // 12. Flammenwerfer (Short range, AoE fire damage over time)
  flammenwerfer: {
    id: 'flammenwerfer',
    name: 'Flammenwerfer',
    description: 'Kurze Reichweite, Flächen-Feuer-Schaden über Zeit',
    baseHealth: 85,
    baseDamage: 12,
    baseRange: 10,
    baseCooldown: 500,
    armorReduction: 0,
    healing: 0,
    poisonDuration: 0,
    poisonDamage: 0,
    knockback: 0.5,
    spawnFrequency: 0,
    speedModifier: NON_SPEED_SEGMENT_MODIFIER,
    fireDuration: 3, // seconds of fire damage
    fireDamagePerSecond: 5,
    aoeRadius: 8,
    upgradeCosts: [110, 165, 220, 330, 480],
    currencyType: 'apples',
    isSpeedSegment: false,
    maxLevel: 5,
  },
  
  // 13. Schallkanone (Medium range, AoE damage, knocks enemies back)
  schallkanone: {
    id: 'schallkanone',
    name: 'Schallkanone',
    description: 'Mittlere Reichweite, Flächen-Schaden, schiebt Gegner 2 Einheiten/Level zurück (max 6)',
    baseHealth: 95,
    baseDamage: 18,
    baseRange: 25,
    baseCooldown: 1200,
    armorReduction: 0,
    healing: 0,
    poisonDuration: 0,
    poisonDamage: 0,
    knockback: 2, // Base knockback at level 1
    spawnFrequency: 0,
    speedModifier: NON_SPEED_SEGMENT_MODIFIER,
    maxKnockback: 6, // Maximum knockback at level 5
    aoeRadius: 10,
    upgradeCosts: [100, 150, 200, 300, 450],
    currencyType: 'apples',
    isSpeedSegment: false,
    maxLevel: 5,
  },
  
  // 14. Blasebalg (Zero damage, massive knockback)
  blasebalg: {
    id: 'blasebalg',
    name: 'Blasebalg',
    description: 'Kein Schaden, massiver Rückstoß von 8 Einheiten bei Level 1. Jedes Segment fügt +1 Einheit hinzu. Jedes Upgrade-Level fügt +2 Einheiten hinzu',
    baseHealth: 70,
    baseDamage: 0,
    baseRange: 15,
    baseCooldown: 2000,
    armorReduction: 0,
    healing: 0,
    poisonDuration: 0,
    poisonDamage: 0,
    knockback: 8, // Base knockback at level 1
    spawnFrequency: 0,
    speedModifier: NON_SPEED_SEGMENT_MODIFIER,
    knockbackPerSegment: 1, // Additional knockback per segment
    knockbackPerLevel: 2, // Additional knockback per upgrade level
    upgradeCosts: [85, 125, 170, 250, 370],
    currencyType: 'apples',
    isSpeedSegment: false,
    maxLevel: 5,
  },
  
  // 15. Kastanien (Drops chestnut mines)
  kastanien: {
    id: 'kastanien',
    name: 'Kastanien',
    description: 'Lässt Kastanien-Minen auf dem Schlachtfeld fallen mit variabler Zeit',
    baseHealth: 65,
    baseDamage: 0,
    baseRange: 0,
    baseCooldown: 5000, // 5 seconds between mine drops
    armorReduction: 0,
    healing: 0,
    poisonDuration: 0,
    poisonDamage: 0,
    knockback: 0,
    spawnFrequency: 5,
    speedModifier: NON_SPEED_SEGMENT_MODIFIER,
    mineDamage: 25,
    mineTimerMin: 2000, // 2 seconds minimum
    mineTimerMax: 5000, // 5 seconds maximum
    minesPerLevel: 1, // Additional mine per upgrade level
    upgradeCosts: [95, 140, 190, 280, 420],
    currencyType: 'apples',
    isSpeedSegment: false,
    maxLevel: 5,
  },
  
  // 16. Giftstachel (Medium range, applies poison damage over time)
  giftstachel: {
    id: 'giftstachel',
    name: 'Giftstachel',
    description: 'Mittlere Reichweite, fügt Gift-Schaden über 5 Sekunden zu',
    baseHealth: 80,
    baseDamage: 0, // Initial damage (poison does the rest)
    baseRange: 20,
    baseCooldown: 1500,
    armorReduction: 0,
    healing: 0,
    poisonDuration: 5, // 5 seconds
    poisonDamage: 8, // Damage per second
    knockback: 0,
    spawnFrequency: 0,
    speedModifier: NON_SPEED_SEGMENT_MODIFIER,
    upgradeCosts: [75, 110, 150, 220, 320],
    currencyType: 'apples',
    isSpeedSegment: false,
    maxLevel: 5,
  },
};

// ============================================
// SEGMENT HELPER FUNCTIONS
// ============================================

/**
 * Get segment data by ID
 * @param {string} segmentId - The segment identifier
 * @returns {SegmentType|null} The segment data or null if not found
 */
export const getSegment = (segmentId) => {
  return SEGMENTS[segmentId] || null;
};

/**
 * Get all segment IDs
 * @returns {string[]} Array of all segment IDs
 */
export const getAllSegmentIds = () => {
  return Object.keys(SEGMENTS);
};

/**
 * Calculate worm speed based on segments
 * Every segment except "Füße" reduces speed, but minimum speed is maintained
 * @param {string[]} segmentIds - Array of segment IDs in the worm
 * @returns {number} The calculated speed
 */
export const calculateWormSpeed = (segmentIds) => {
  let speedModifier = 1.0;
  let hasSpeedSegments = false;
  
  // Count speed segments and apply their modifiers
  segmentIds.forEach(segmentId => {
    const segment = getSegment(segmentId);
    if (segment) {
      if (segment.isSpeedSegment) {
        speedModifier *= segment.speedModifier;
        hasSpeedSegments = true;
      } else {
        // Non-speed segments reduce speed
        speedModifier *= segment.speedModifier;
      }
    }
  });
  
  // Apply minimum speed if worm has too many non-speed segments
  // Count non-speed segments
  const nonSpeedCount = segmentIds.filter(id => {
    const segment = getSegment(id);
    return segment && !segment.isSpeedSegment;
  }).length;
  
  // If worm has 6 or more non-speed segments, ensure minimum speed
  if (nonSpeedCount >= 6) {
    speedModifier = Math.max(speedModifier, GAME_CONSTANTS.MIN_WORM_SPEED / 10);
  }
  
  // Base worm speed
  const baseSpeed = 2.0;
  const finalSpeed = baseSpeed * speedModifier;
  
  // Ensure minimum speed
  return Math.max(finalSpeed, GAME_CONSTANTS.MIN_WORM_SPEED);
};

/**
 * Calculate total worm health based on segments
 * @param {string[]} segmentIds - Array of segment IDs in the worm
 * @param {Object} researchLevels - Current research levels for each segment
 * @returns {number} Total worm health
 */
export const calculateWormHealth = (segmentIds, researchLevels = {}) => {
  let totalHealth = 0;
  
  segmentIds.forEach(segmentId => {
    const segment = getSegment(segmentId);
    if (segment) {
      const level = researchLevels[segmentId] || 0;
      
      // Base health
      let health = segment.baseHealth;
      
      // Apply level bonuses for Panzer segments
      if (segmentId === 'panzer') {
        health += segment.healthPerLevel * level;
      }
      
      // Apply level bonuses for other segments (20% per level)
      if (segmentId !== 'panzer' && segmentId !== 'füsse') {
        health += health * 0.2 * level;
      }
      
      totalHealth += health;
    }
  });
  
  return totalHealth;
};

/**
 * Get upgrade cost for a segment at a specific level
 * @param {string} segmentId - The segment identifier
 * @param {number} targetLevel - The target level (1-5)
 * @returns {number} The cost in the appropriate currency
 */
export const getUpgradeCost = (segmentId, targetLevel) => {
  const segment = getSegment(segmentId);
  if (!segment || targetLevel < 1 || targetLevel > segment.maxLevel) {
    return 0;
  }
  
  // Levels 1-3 cost Apples, 4-5 cost Star Anise
  if (targetLevel <= 3) {
    return segment.upgradeCosts[targetLevel - 1];
  } else {
    // For levels 4-5, use star anise costs (same values but different currency)
    return segment.upgradeCosts[targetLevel - 1];
  }
};

/**
 * Get currency type for a segment upgrade
 * @param {number} targetLevel - The target level (1-5)
 * @returns {string} 'apples' or 'starAnise'
 */
export const getUpgradeCurrency = (targetLevel) => {
  return targetLevel <= 3 ? 'apples' : 'starAnise';
};

// ============================================
// SPECIAL ABILITIES CONFIGURATION
// ============================================

export const SPECIAL_ABILITIES = {
  squirrel: {
    id: 'squirrel',
    name: 'Das Eichhörnchen',
    description: 'Fügt sofort 300 Blätter hinzu',
    unlockCost: 150,
    currency: 'apples',
    cooldown: 30000, // 30 seconds
    effect: {
      leaves: 300,
    },
  },
  
  pigeon: {
    id: 'pigeon',
    name: 'Die Taube',
    description: 'Fliegt über das Feld und lässt Minen fallen',
    unlockCost: 250,
    currency: 'apples',
    cooldown: 45000, // 45 seconds
    effect: {
      mineCount: 3,
      mineDamage: 20,
      mineTimer: 3000, // 3 seconds
    },
  },
  
  turtle: {
    id: 'turtle',
    name: 'Die Schildkröte',
    description: 'Kriecht über den Bildschirm und verlangsamt alle Gegner um 35%',
    unlockCost: 70,
    currency: 'apples',
    cooldown: 60000, // 60 seconds
    effect: {
      slowAmount: 0.35, // 35% slow
      duration: 10000, // 10 seconds
      speed: 1.0, // Default turtle speed (can be upgraded)
    },
  },
};

// ============================================
// RAID CONFIGURATION
// ============================================

export const RAID_CONFIG = {
  // Butterfly breeding
  butterfly: {
    baseBreedCost: 10, // Apples for first breed
    breedCostIncrement: 5, // Additional cost per level
    baseCapacity: 5, // Starting max butterflies
    capacityIncrement: 3, // Additional capacity per upgrade
    capacityCostBase: 25, // Base cost to increase capacity
    capacityCostIncrement: 15, // Additional cost per upgrade
    
    // Raid level upgrades
    raidLevel: {
      baseSpawnRate: 1, // Butterflies per second at level 1
      spawnRateIncrement: 0.5, // Additional spawn rate per level
      upgradeCostBase: 50, // Base cost to upgrade raid level
      upgradeCostIncrement: 25, // Additional cost per level
    },
  },
};

// ============================================
// LEVEL CONFIGURATION
// ============================================

export const LEVEL_CONFIG = {
  totalLevels: 100,
  levelsPerRow: 10,
  
  // Default segment loadouts for procedural battles
  proceduralBattle: {
    minSegments: 1,
    maxSegments: 8,
    availableSegments: ['füsse', 'mg', 'kanone', 'honigkanone', 'handgranatenkäfer', 'larven', 'kettenhemd', 'panzer'],
  },
  
  // Level rewards
  rewards: {
    baseApples: 5,
    appleMultiplier: 1,
    starAniseChance: 0.1, // 10% chance to get star anise
    starAniseAmount: 1,
  },
};

// ============================================
// DEFAULT GAME STATE
// ============================================

export const DEFAULT_GAME_STATE = {
  playerName: 'Spieler',
  apples: 100,
  starAnise: 0,
  unlockedLevels: Array(100).fill(false),
  unlockedLevelsCount: 1, // Level 1 is unlocked by default
  raidLevel: 1,
  readyButterflies: 0,
  maxButterflies: RAID_CONFIG.butterfly.baseCapacity,
  researchLevels: Object.keys(SEGMENTS).reduce((acc, segmentId) => {
    acc[segmentId] = 0;
    return acc;
  }, {}),
  specialAbilities: {
    squirrel: { unlocked: false, count: 0, cooldown: 0 },
    pigeon: { unlocked: false, count: 0, cooldown: 0, mineCount: 3 },
    turtle: { unlocked: false, count: 0, cooldown: 0, speed: 1.0 },
  },
  stats: {
    wins: 0,
    losses: 0,
  },
};

export default {
  GAME_CONSTANTS,
  BASE_STATS,
  SEGMENTS,
  SPECIAL_ABILITIES,
  RAID_CONFIG,
  LEVEL_CONFIG,
  DEFAULT_GAME_STATE,
  getBaseStats,
  getSegment,
  getAllSegmentIds,
  calculateWormSpeed,
  calculateWormHealth,
  getUpgradeCost,
  getUpgradeCurrency,
};
