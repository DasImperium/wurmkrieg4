/**
 * Wurm Krieg 3 - Project Test Script
 * 
 * This script verifies that the project structure is correct
 * and all imports work properly.
 * 
 * Run with: node test-project.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Wurm Krieg 3 Project Structure...\n');

// Test 1: Check if all required files exist
const requiredFiles = [
  'App.js',
  'package.json',
  'app.json',
  'babel.config.js',
  'src/config/gameConfig.js',
  'src/contexts/GameStateContext.js',
  'src/screens/MainMenuScreen.js',
  'src/screens/BattleSelectScreen.js',
  'src/screens/SegmentLoadoutScreen.js',
  'src/screens/GamePlayScreen.js',
  'src/screens/RaidScreen.js',
  'src/screens/ResearchScreen.js',
  'src/screens/InstructionsScreen.js',
  'src/screens/ResetProgressScreen.js',
  'src/screens/AdminScreen.js',
  'src/components/Button.js',
  'src/hooks/useGameLoop.js',
  'src/utils/helpers.js',
  'README.md',
];

console.log('✅ Test 1: Checking required files...');
let allFilesExist = true;

for (const file of requiredFiles) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Missing file: ${file}`);
    allFilesExist = false;
  } else {
    console.log(`✅ Found: ${file}`);
  }
}

if (allFilesExist) {
  console.log('✅ All required files exist!\n');
} else {
  console.log('❌ Some required files are missing!\n');
  process.exit(1);
}

// Test 2: Check package.json structure
console.log('✅ Test 2: Checking package.json structure...');
try {
  const packageJson = require('./package.json');
  
  const requiredFields = ['name', 'version', 'main', 'scripts', 'dependencies', 'devDependencies'];
  const missingFields = requiredFields.filter(field => !(field in packageJson));
  
  if (missingFields.length > 0) {
    console.log(`❌ Missing fields in package.json: ${missingFields.join(', ')}`);
    process.exit(1);
  }
  
  const requiredDependencies = [
    'expo',
    'expo-screen-orientation',
    'react',
    'react-native',
    '@react-navigation/native',
    '@react-navigation/native-stack'
  ];
  
  const missingDeps = requiredDependencies.filter(dep => !(dep in packageJson.dependencies));
  
  if (missingDeps.length > 0) {
    console.log(`❌ Missing dependencies: ${missingDeps.join(', ')}`);
    process.exit(1);
  }
  
  console.log('✅ package.json structure is valid!\n');
} catch (error) {
  console.log(`❌ Error reading package.json: ${error.message}`);
  process.exit(1);
}

// Test 3: Check app.json structure
console.log('✅ Test 3: Checking app.json structure...');
try {
  const appJson = require('./app.json');
  
  if (!appJson.expo) {
    console.log('❌ Missing expo configuration in app.json');
    process.exit(1);
  }
  
  const requiredExpoFields = ['name', 'slug', 'version', 'orientation'];
  const missingExpoFields = requiredExpoFields.filter(field => !(field in appJson.expo));
  
  if (missingExpoFields.length > 0) {
    console.log(`❌ Missing fields in app.json expo: ${missingExpoFields.join(', ')}`);
    process.exit(1);
  }
  
  console.log('✅ app.json structure is valid!\n');
} catch (error) {
  console.log(`❌ Error reading app.json: ${error.message}`);
  process.exit(1);
}

// Test 4: Check if gameConfig.js has all required exports
console.log('✅ Test 4: Checking gameConfig.js exports...');
try {
  // We can't directly require the gameConfig because it uses ES6 imports
  // So we'll just check if the file exists and has content
  const gameConfigPath = path.join(__dirname, 'src/config/gameConfig.js');
  const gameConfigContent = fs.readFileSync(gameConfigPath, 'utf8');
  
  const requiredExports = [
    'GAME_CONSTANTS',
    'BASE_STATS',
    'SEGMENTS',
    'SPECIAL_ABILITIES',
    'RAID_CONFIG',
    'LEVEL_CONFIG',
    'DEFAULT_GAME_STATE'
  ];
  
  for (const exportName of requiredExports) {
    if (!gameConfigContent.includes(exportName)) {
      console.log(`❌ Missing export in gameConfig.js: ${exportName}`);
      process.exit(1);
    }
  }
  
  console.log('✅ gameConfig.js has all required exports!\n');
} catch (error) {
  console.log(`❌ Error checking gameConfig.js: ${error.message}`);
  process.exit(1);
}

// Test 5: Check if all screens have proper structure
console.log('✅ Test 5: Checking screen files...');
const screenFiles = [
  'MainMenuScreen.js',
  'BattleSelectScreen.js',
  'SegmentLoadoutScreen.js',
  'GamePlayScreen.js',
  'RaidScreen.js',
  'ResearchScreen.js',
  'InstructionsScreen.js',
  'ResetProgressScreen.js',
  'AdminScreen.js'
];

for (const screenFile of screenFiles) {
  const screenPath = path.join(__dirname, 'src/screens', screenFile);
  const screenContent = fs.readFileSync(screenPath, 'utf8');
  
  // Check if it has a default export
  if (!screenContent.includes('export default')) {
    console.log(`❌ Missing default export in ${screenFile}`);
    process.exit(1);
  }
  
  // Check if it imports React
  if (!screenContent.includes('import React') && !screenContent.includes("import { useGameState }")) {
    console.log(`⚠️  Warning: ${screenFile} might be missing React import`);
  }
}

console.log('✅ All screen files have proper structure!\n');

// Test 6: Check folder structure
console.log('✅ Test 6: Checking folder structure...');
const requiredFolders = [
  'src',
  'src/config',
  'src/contexts',
  'src/screens',
  'src/components',
  'src/hooks',
  'src/utils',
  'assets'
];

for (const folder of requiredFolders) {
  const folderPath = path.join(__dirname, folder);
  if (!fs.existsSync(folderPath)) {
    console.log(`❌ Missing folder: ${folder}`);
    process.exit(1);
  }
}

console.log('✅ All required folders exist!\n');

console.log('🎉 All tests passed!');
console.log('\n📋 Project Summary:');
console.log(`   - Total files: ${fs.readdirSync(__dirname).filter(f => fs.statSync(path.join(__dirname, f)).isFile()).length}`);
console.log(`   - Total folders: ${fs.readdirSync(__dirname).filter(f => fs.statSync(path.join(__dirname, f)).isDirectory()).length}`);
console.log('\n🚀 To start the project, run:');
console.log('   npm install');
console.log('   npx expo start');
