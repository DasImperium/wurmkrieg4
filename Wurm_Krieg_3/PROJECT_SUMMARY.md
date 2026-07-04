# Wurm Krieg 3 - Project Summary

## 📁 Project Structure

```
Wurm_Krieg_3/
├── App.js                          # Main application entry point
├── app.json                        # Expo configuration
├── babel.config.js                 # Babel configuration
├── package.json                    # Project dependencies
├── README.md                       # User documentation
├── PROJECT_SUMMARY.md              # This file
├── test-project.js                 # Project verification script
├── .eslintrc.js                    # ESLint configuration
├── .gitignore                      # Git ignore rules
├── assets/                         # Static assets
│   └── .gitkeep
└── src/                            # Source code
    ├── index.js                    # Main exports
    ├── config/                     # Game configuration
    │   ├── gameConfig.js           # All game constants, segments, balancing
    │   └── index.js                # Config exports
    ├── contexts/                   # React Context providers
    │   ├── GameStateContext.js     # Global game state management
    │   └── index.js                # Context exports
    ├── screens/                     # Application screens
    │   ├── MainMenuScreen.js       # Main menu with player info
    │   ├── BattleSelectScreen.js    # Battle selection (levels & procedural)
    │   ├── SegmentLoadoutScreen.js  # Segment selection for battles
    │   ├── GamePlayScreen.js        # Core battle engine & HUD
    │   ├── RaidScreen.js            # Butterfly breeding & upgrades
    │   ├── ResearchScreen.js         # Segment research & upgrades
    │   ├── InstructionsScreen.js     # Game manual
    │   ├── ResetProgressScreen.js   # Progress reset with confirmation
    │   ├── AdminScreen.js            # Admin panel with password
    │   └── index.js                # Screen exports
    ├── components/                  # Reusable UI components
    │   ├── Button.js                # Customizable button component
    │   └── index.js                # Component exports
    ├── hooks/                       # Custom React hooks
    │   ├── useGameLoop.js           # Game loop management
    │   └── index.js                # Hook exports
    └── utils/                       # Utility functions
        ├── helpers.js               # Common helper functions
        └── index.js                # Utility exports
```

## 🎮 Game Features Implemented

### 1. Game Configuration (`gameConfig.js`)
- **GAME_CONSTANTS**: Map dimensions, timing, worm mechanics, apple drop mechanics
- **BASE_STATS**: Level 0-3 base stats with HP, economy, defense calculations
- **SEGMENTS**: All 16 segments with complete data:
  1. Füße (Speed increase)
  2. MG (Machine gun - low range, fast fire)
  3. Kanone (Cannon - long range, high damage)
  4. Honigkanone (Honey cannon - slows enemies)
  5. Handgranatenkäfer (Grenade bug - AoE damage)
  6. Raketenwerfer (Rocket launcher - long range, high AoE)
  7. Larven (Larvae - spawns micro-larvae on death)
  8. Spinnennest (Spider nest - spawns mini-cannon-spiders)
  9. Kettenhemd (Chainmail - reduces incoming damage)
  10. Panzer (Armor - adds massive health)
  11. Heilung (Healing - regenerates HP, affects poison/fire damage)
  12. Flammenwerfer (Flamethrower - AoE fire damage)
  13. Schallkanone (Sound cannon - AoE damage with knockback)
  14. Blasebalg (Bellows - massive knockback)
  15. Kastanien (Chestnuts - drops mines)
  16. Giftstachel (Poison sting - poison damage over time)
- **SPECIAL_ABILITIES**: Eichhörnchen, Taube, Schildkröte
- **RAID_CONFIG**: Butterfly breeding and raid level configurations
- **LEVEL_CONFIG**: 100 levels with procedural battle settings
- **DEFAULT_GAME_STATE**: Initial game state values

### 2. Global State Management (`GameStateContext.js`)
- **Player Data**: playerName, apples, starAnise
- **Level Progression**: unlockedLevels (100 levels), unlockedLevelsCount
- **Raid State**: raidLevel, readyButterflies, maxButterflies
- **Research Levels**: All 16 segments with levels 0-5
- **Special Abilities**: Squirrel, Pigeon, Turtle with counts and attributes
- **Stats**: Wins, Losses
- **Actions**: setPlayerName, addApples, spendApples, unlockLevel, upgradeSegment, breedButterfly, etc.

### 3. Screen Implementations

#### MainMenuScreen
- Title: "Krieg der Würmer"
- Editable player name input
- Currency displays: Apples & Star Anise
- Stats display: Wins, Losses, Unlocked Levels
- Navigation buttons to all screens

#### BattleSelectScreen
- Procedural battle button with segment selection
- 100 level buttons in 10x10 grid
- Navigation to segment loadout screen

#### SegmentLoadoutScreen
- Segment selection for worm building
- Must have exactly 1 Head (automatically included)
- Can have 1-6 additional segments (total 2-7)
- Shows available segments based on research

#### GamePlayScreen
- **Landscape Mode**: Forces landscape orientation during gameplay
- **Battlefield**: Wide horizontal scrollable playing field
- **Bases**: Player Base (Left Tree) and NPC Base (Right Tree)
- **Lanes**: 5 horizontal lanes for visual separation
- **Worms**: Custom-built worms with segments, health bars, movement
- **HUD**: Leaves counter, worm building workshop
- **Gameplay Loop**: Continuous leaf generation, random leaf fall events
- **Combat**: Worms attack when in range, collision detection
- **Win/Loss**: Destroy enemy base to win, lose if player base reaches 0 HP
- **Rewards**: 5 + n apples where n = apples collected during match

#### RaidScreen
- Current butterflies: x/y display
- "Sofort Nachzucht" button (costs apples)
- "Kapazität erhöhen" button (increases max butterflies)
- "Angriffsstufe verbessern" button (increases raid level)

#### ResearchScreen
- All 16 segments with current levels (0-5)
- Upgrade buttons for each segment
- Level 1-3 cost Apples, Level 4-5 cost Star Anise
- Special Actions shop section

#### InstructionsScreen
- Scrollable text manual
- Game rules, segment types, economy, win conditions

#### ResetProgressScreen
- 2-step confirmation before wiping global state
- Final confirmation with "LÖSCHEN" input

#### AdminScreen
- Password protection: "Imperium"
- Editable table/form for all game state properties
- Player data, research levels, special abilities, raid states
- Turtle speed slider (0.01 - 10 units/sec)

### 4. Core Battle Engine
- **Worm Mechanics**: Speed calculation, health calculation, movement
- **Combat System**: Range calculation, damage calculation, knockback
- **Collision Detection**: X-axis based collision between worms
- **Base Attacks**: Worms attack bases when in range
- **Apple Drop**: 4% chance per hit when base HP < 60%
- **Leaf Fall**: Random leaf fall events with +20-30 leaves bonus
- **Win/Loss Conditions**: Base destruction triggers victory/defeat

## 📊 Technical Details

### Dependencies
```json
{
  "expo": "~50.0.0",
  "expo-screen-orientation": "~5.0.0",
  "expo-status-bar": "~1.10.0",
  "react": "18.2.0",
  "react-native": "0.73.0",
  "react-native-gesture-handler": "~2.14.0",
  "react-native-reanimated": "~3.6.0",
  "react-native-safe-area-context": "4.8.2",
  "react-native-screens": "~3.29.0",
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/native-stack": "^6.9.17"
}
```

### Key Features
- **Type Safety**: JSDoc comments for all functions and components
- **Deep Documentation**: Comprehensive inline comments for all calculations and logic
- **Modular Architecture**: Separated concerns (config, state, screens, components)
- **Responsive Design**: Works on Android mobile devices and tablets
- **Landscape Mode**: Forces landscape orientation during gameplay
- **Performance**: Optimized game loop with requestAnimationFrame
- **Error Handling**: Graceful fallbacks and validation

### Game Constants
- Map Length: 120-240 abstract units (default: 180)
- Number of Lanes: 5
- Game Tick Interval: 16ms (~60 FPS)
- Leaf Fall Interval: 3000ms
- Minimum Worm Speed: 0.5 units
- Default Melee Range: 20 units
- Apple Drop Threshold: 60% HP
- Apple Drop Chance: 4%
- Base Victory Reward: 5 apples + collected apples

## 🚀 Getting Started

### Installation
```bash
cd Wurm_Krieg_3
npm install
```

### Running the App
```bash
# Start Expo development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios

# Run on Web
npx expo start --web
```

### Project Verification
```bash
# Run the test script to verify project structure
node test-project.js
```

## 🎯 Game Mechanics

### Worm Building
1. Start with 1 Head segment (automatically included)
2. Add 1-6 additional segments (total 2-7 segments)
3. Each segment has unique properties and costs
4. Worms move head-first towards enemy base
5. Speed is affected by segment composition

### Economy
- **Base Generation**: +2 leaves/sec (Level 0), doubles per level
- **Max Storage**: 750 leaves (Level 0), doubles per level
- **Leaf Collection**: Tap falling leaves for +20-30 bonus
- **Apple Collection**: Tap falling apples to add to inventory

### Combat
- Worms attack automatically when in range
- Default melee attack if no weapons
- Damage, range, cooldown based on segments
- Knockback applied on successful attacks
- Collision detection on X-axis (regardless of lane)

### Research
- Level 1-3: Cost Apples
- Level 4-5: Cost Star Anise
- Higher levels improve segment stats
- Research unlocks segments for use in battles

### Special Abilities
- **Eichhörnchen**: +300 leaves instantly (Cost: 150 apples)
- **Taube**: Drops mines on field (Cost: 250 apples)
- **Schildkröte**: Slows all enemies by 35% (Cost: 70 apples)

## 📝 Notes

### German Language
- All UI text is in German as requested
- Game terminology uses German names for segments and abilities
- Instructions and manual are in German

### Landscape Mode
- Game automatically switches to landscape orientation during gameplay
- Uses expo-screen-orientation plugin
- Main menu and other screens remain in portrait

### Performance
- Game loop uses requestAnimationFrame for smooth animations
- Collision detection optimized for performance
- Worm and projectile updates batched for efficiency

### Extensibility
- Easy to add new segments by adding to SEGMENTS object
- Balancing can be adjusted in gameConfig.js
- New screens can be added to the navigation stack
- State management is centralized and easy to extend

## 🎉 Completion Status

✅ **Complete** - All requested features implemented:
- Game configuration with all 16 segments
- Global state management with Context API
- All 9 screens implemented with full functionality
- Core battle engine with HUD
- Landscape mode for gameplay
- All game mechanics (worm building, combat, economy)
- Win/loss conditions with rewards
- Admin panel with password protection
- Comprehensive documentation
- Production-ready code structure

🎮 **Ready to Play** - The game can be built and played immediately with:
```bash
npm install
npx expo start
```
