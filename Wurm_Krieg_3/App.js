/**
 * Wurm Krieg 3 - Main Application Entry Point
 * 
 * This is the root component of the application, setting up navigation
 * and the game state provider.
 * 
 * @author DasImperium
 * @version 1.0.0
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GameStateProvider } from './src/contexts/GameStateContext';
import MainMenuScreen from './src/screens/MainMenuScreen';
import BattleSelectScreen from './src/screens/BattleSelectScreen';
import RaidScreen from './src/screens/RaidScreen';
import ResearchScreen from './src/screens/ResearchScreen';
import InstructionsScreen from './src/screens/InstructionsScreen';
import ResetProgressScreen from './src/screens/ResetProgressScreen';
import AdminScreen from './src/screens/AdminScreen';
import GamePlayScreen from './src/screens/GamePlayScreen';
import SegmentLoadoutScreen from './src/screens/SegmentLoadoutScreen';

// Create the navigation stack
const Stack = createNativeStackNavigator();

/**
 * Main App Component
 * 
 * This component sets up the navigation stack and wraps the application
 * with the GameStateProvider for global state management.
 * 
 * @returns {JSX.Element} The main application component
 */
export default function App() {
  return (
    <GameStateProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="MainMenu"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#1a1a2e' },
            animation: 'fade',
          }}
        >
          {/* Main Menu */}
          <Stack.Screen
            name="MainMenu"
            component={MainMenuScreen}
            options={{
              title: 'Krieg der Würmer',
            }}
          />
          
          {/* Battle Selection */}
          <Stack.Screen
            name="BattleSelect"
            component={BattleSelectScreen}
            options={{
              title: 'Schlacht auswählen',
            }}
          />
          
          {/* Segment Loadout Selection */}
          <Stack.Screen
            name="SegmentLoadout"
            component={SegmentLoadoutScreen}
            options={{
              title: 'Segmente auswählen',
            }}
          />
          
          {/* Game Play */}
          <Stack.Screen
            name="GamePlay"
            component={GamePlayScreen}
            options={{
              title: 'Schlacht',
              headerShown: false,
              orientation: 'landscape',
            }}
          />
          
          {/* Raid Menu */}
          <Stack.Screen
            name="Raid"
            component={RaidScreen}
            options={{
              title: 'Überfall',
            }}
          />
          
          {/* Research */}
          <Stack.Screen
            name="Research"
            component={ResearchScreen}
            options={{
              title: 'Forschung',
            }}
          />
          
          {/* Instructions */}
          <Stack.Screen
            name="Instructions"
            component={InstructionsScreen}
            options={{
              title: 'Anleitung',
            }}
          />
          
          {/* Reset Progress */}
          <Stack.Screen
            name="ResetProgress"
            component={ResetProgressScreen}
            options={{
              title: 'Fortschritt zurücksetzen',
            }}
          />
          
          {/* Admin Panel */}
          <Stack.Screen
            name="Admin"
            component={AdminScreen}
            options={{
              title: 'Admin',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GameStateProvider>
  );
}
