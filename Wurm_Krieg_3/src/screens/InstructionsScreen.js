/**
 * Wurm Krieg 3 - Instructions Screen
 * 
 * This screen displays the game manual with detailed instructions.
 * 
 * @author DasImperium
 * @version 1.0.0
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

/**
 * Instructions Screen Component
 * 
 * Displays a scrollable text manual detailing:
 * - Game rules
 * - Segment types
 * - Economy
 * - Win conditions
 * 
 * @param {Object} props - Navigation props
 * @returns {JSX.Element} The instructions screen
 */
const InstructionsScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Anleitung</Text>
      
      {/* Game Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spielübersicht</Text>
        <Text style={styles.sectionText}>
          "Krieg der Würmer 3" ist ein strategisches Echtzeit-Strategiespiel, in dem du Würmer
          mit verschiedenen Segmenten baust und gegen feindliche Würmer kämpfst.
          Dein Ziel ist es, die feindliche Basis (Baum) zu zerstören, während du deine
          eigene Basis verteidigst.
        </Text>
      </View>
      
      {/* Game Rules */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spielregeln</Text>
        
        <Text style={styles.subsectionTitle}>Wurm-Konstruktion:</Text>
        <Text style={styles.sectionText}>
          • Jeder Wurm muss genau einen Kopf haben (automatisch enthalten).
          • Du kannst 1-6 zusätzliche Segmente hinzufügen (insgesamt 2-7 Segmente).
          • Jedes Segment hat einzigartige Fähigkeiten und Statistiken.
          • Die Reihenfolge der Segmente beeinflusst die Bewegung und den Kampf.
        </Text>
        
        <Text style={styles.subsectionTitle}>Bewegung:</Text>
        <Text style={styles.sectionText}>
          • Würmer bewegen sich kopfvoran zur feindlichen Basis.
          • Das Segment "Füße" erhöht die Geschwindigkeit.
          • Alle anderen Segmente (außer "Füße") reduzieren die Geschwindigkeit leicht.
          • Ein Wurm mit 6 Nicht-Geschwindigkeit-Segmenten behält eine Mindestgeschwindigkeit.
        </Text>
        
        <Text style={styles.subsectionTitle}>Kampf:</Text>
        <Text style={styles.sectionText}>
          • Würmer greifen automatisch an, wenn sie in Reichweite des Gegners sind.
          • Wenn ein Wurm keine Waffen hat, führt er einen Nahkampf-Biss aus.
          • Erfolgreiche Angriffe verursachen minimalen Rückstoß.
          • Die Gesundheit eines Wurms ist die Summe der Gesundheit aller Segmente.
          • Ein Wurm lebt oder stirbt als eine einzige kombinierte Einheit.
        </Text>
      </View>
      
      {/* Segment Types */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Segment-Typen</Text>
        
        <Text style={styles.subsectionTitle}>Bewegung:</Text>
        <Text style={styles.sectionText}>
          • Füße: Erhöht die Gesamtgeschwindigkeit des Wurms.
        </Text>
        
        <Text style={styles.subsectionTitle}>Nahkampf:</Text>
        <Text style={styles.sectionText}>
          • MG: Maschinengewehr - Geringe Reichweite, schnelles Feuer.
          • Kanone: Lange Reichweite, hoher Einzelschaden.
          • Flammenwerfer: Kurze Reichweite, Flächen-Feuer-Schaden über Zeit.
          • Schallkanone: Mittlere Reichweite, Flächen-Schaden, schiebt Gegner zurück.
          • Blasebalg: Kein Schaden, massiver Rückstoß.
          • Giftstachel: Mittlere Reichweite, fügt Gift-Schaden über Zeit zu.
        </Text>
        
        <Text style={styles.subsectionTitle}>Unterstützung:</Text>
        <Text style={styles.sectionText}>
          • Honigkanone: Geringe Reichweite, verlangsamt Gegner.
          • Handgranatenkäfer: Wirft Brandgranaten mit Flächen-Schaden.
          • Raketenwerfer: Lange Reichweite, langsames Nachladen, hoher Flächen-Schaden.
          • Heilung: Regeneriert Gesundheit, beeinflusst Gift- und Feuer-Schaden.
        </Text>
        
        <Text style={styles.subsectionTitle}>Spezial:</Text>
        <Text style={styles.sectionText}>
          • Larven: Spawn 4 Mikro-Larven beim Tod, die bei Kontakt explodieren.
          • Spinnennest: Spawn 3 Mini-Kanonen-Spinnen alle 8 Sekunden.
          • Kettenhemd: Reduziert eingehenden Schaden.
          • Panzer: Fügt massive Lebenspunkte hinzu.
          • Kastanien: Lässt Minen auf dem Schlachtfeld fallen.
        </Text>
      </View>
      
      {/* Economy */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wirtschaft</Text>
        
        <Text style={styles.subsectionTitle}>Ressourcen:</Text>
        <Text style={styles.sectionText}>
          • Äpfel: Hauptwährung, wird durch Siege und das Sammeln von Äpfeln während
            des Kampfes verdient.
          • Sternanis: Spezielle Währung, wird seltener verdient und für hochwertige
            Upgrades benötigt.
          • Blätter: In-Game-Ressource, die automatisch generiert wird und zum Spawnen
            von Segmenten während des Kampfes verwendet wird.
        </Text>
        
        <Text style={styles.subsectionTitle}>Basis-Wirtschaft:</Text>
        <Text style={styles.sectionText}>
          • Level 0: +2 Blätter/Sekunde, Maximalvorrat 750.
          • Jedes Basis-Upgrade verdoppelt die Produktionsgeschwindigkeit und den
            Maximalvorrat.
          • Basis-Level 0: 1 Schuss alle 2 Sekunden, Reichweite 20 Einheiten.
          • Upgrades verdoppeln die Feuerfrequenz und den Schaden.
        </Text>
        
        <Text style={styles.subsectionTitle}>Forschung:</Text>
        <Text style={styles.sectionText}>
          • Level 1-3 kosten Äpfel.
          • Level 4-5 kosten Sternanis.
          • Höhere Levels verbessern die Statistiken der Segmente.
        </Text>
      </View>
      
      {/* Win Conditions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Siegbedingungen</Text>
        
        <Text style={styles.sectionText}>
          • Sieg: Zerstöre die feindliche Basis (Baum).
          • Niederlage: Deine Basis wird auf 0 Gesundheit reduziert.
          • Belohnungen: Nach einem Sieg erhältst du 5 + n Äpfel, wobei n die Anzahl
            der während des Kampfes gesammelten Äpfel ist.
        </Text>
        
        <Text style={styles.subsectionTitle}>Spezielle Ereignisse:</Text>
        <Text style={styles.sectionText}>
          • Wenn deine Basis unter 60% Gesundheit fällt, hat jeder getroffene Schuss
            eine 4% Chance, einen Apfel vom Baum fallen zu lassen.
          • Berühre fallende Blätter für einen sofortigen Bonus von +20 bis +30 Blättern.
          • Berühre fallende Äpfel, um sie zu deinem Inventar hinzuzufügen.
        </Text>
      </View>
      
      {/* Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Steuerung</Text>
        
        <Text style={styles.sectionText}>
          • Berühre Segmente, um sie für deinen Wurm auszuwählen.
          • Berühre "Spiel beginnen", um die Schlacht zu starten.
          • Während des Kampfes kannst du neue Würmer bauen und auf das Schlachtfeld
            schicken.
          • Berühre fallende Blätter und Äpfel, um sie zu sammeln.
        </Text>
      </View>
      
      {/* Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipps</Text>
        
        <Text style={styles.sectionText}>
          • Kombiniere verschiedene Segment-Typen für optimale Ergebnisse.
          • Nutze Bewegungsegmente (Füße), um deine Würmer schneller zu machen.
          • Panzer- und Kettenhemd-Segmente machen deine Würmer widerstandsfähiger.
          • Heilungssegmente helfen deinen Würmern, länger zu überleben.
          • Experimentiere mit verschiedenen Kombinationen, um die beste Strategie
            zu finden.
        </Text>
      </View>
      
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Zurück</Text>
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
    marginBottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
    textAlign: 'center',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
    marginBottom: 8,
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
});

export default InstructionsScreen;
