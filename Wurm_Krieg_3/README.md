# Wurm Krieg 3

Ein strategisches Echtzeit-Strategiespiel für React Native mit Expo.

## Beschreibung

"Krieg der Würmer 3" ist ein strategisches Spiel, in dem Spieler Würmer mit verschiedenen Segmenten bauen und gegen feindliche Würmer kämpfen. Das Ziel ist es, die feindliche Basis (Baum) zu zerstören, während man die eigene Basis verteidigt.

## Funktionen

- **Wurm-Konstruktion**: Baue Würmer mit verschiedenen Segmenten (1-8 Segmente pro Wurm)
- **Segment-Typen**: 16 verschiedene Segmente mit einzigartigen Fähigkeiten
- **Basis-Verwaltung**: Verbessere deine Basis für bessere Wirtschaft und Verteidigung
- **Forschungssystem**: Entsperre und verbessere Segmente mit Äpfeln und Sternanis
- **Überfall-System**: Züchte Schmetterlinge für spezielle Angriffe
- **Spezialfähigkeiten**: Nutze Eichhörnchen, Tauben und Schildkröten für besondere Effekte
- **100 Level**: Herausfordernde Level mit verschiedenen Gegner-Konfigurationen
- **Prozedurale Schlachten**: Zufällige Schlachten mit deinen ausgewählten Segmenten

## Installation

```bash
# Navigiere zum Projektverzeichnis
cd Wurm_Krieg_3

# Installiere die Abhängigkeiten
npm install

# Starte die Expo-Entwicklungsumgebung
npx expo start
```

## Spielsteuerung

### Hauptmenü
- **Spielername ändern**: Tippe auf deinen aktuellen Spielernamen
- **Währungen**: Zeigt deine Äpfel und Sternanis an
- **Statistiken**: Zeigt Siege, Niederlagen und freigeschaltete Level

### Schlacht auswählen
- **Prozedurale Schlacht**: Erstelle eine zufällige Schlacht mit deinen ausgewählten Segmenten
- **Level auswählen**: Wähle ein freigeschaltetes Level (1-100)

### Werkstatt (im Spiel)
- **Segmente auswählen**: Tippe auf Segmente, um sie zu deinem Wurm hinzuzufügen
- **Wurm starten**: Tippe auf "Wurm starten", um deinen Wurm auf das Schlachtfeld zu schicken
- **Blätter sammeln**: Tippe auf fallende Blätter für Bonus-Blätter
- **Äpfel sammeln**: Tippe auf fallende Äpfel, um sie zu deinem Inventar hinzuzufügen

### Forschung
- **Segmente verbessern**: Upgrade Segmente mit Äpfeln (Level 1-3) oder Sternanis (Level 4-5)
- **Spezialfähigkeiten freischalten**: Entsperre Eichhörnchen, Tauben und Schildkröten

### Überfall
- **Schmetterlinge züchten**: Erhöhe deine Schmetterlings-Armee
- **Kapazität erhöhen**: Erhöhe die maximale Anzahl an Schmetterlingen
- **Angriffsstufe verbessern**: Erhöhe die Spawn-Rate von Schmetterlingen

## Segment-Typen

### Bewegung
- **Füße**: Erhöht die Gesamtgeschwindigkeit des Wurms

### Nahkampf
- **MG**: Maschinengewehr - Geringe Reichweite, schnelles Feuer
- **Kanone**: Lange Reichweite, hoher Einzelschaden
- **Flammenwerfer**: Kurze Reichweite, Flächen-Feuer-Schaden über Zeit
- **Schallkanone**: Mittlere Reichweite, Flächen-Schaden, schiebt Gegner zurück
- **Blasebalg**: Kein Schaden, massiver Rückstoß
- **Giftstachel**: Mittlere Reichweite, fügt Gift-Schaden über Zeit zu

### Unterstützung
- **Honigkanone**: Geringe Reichweite, verlangsamt Gegner
- **Handgranatenkäfer**: Wirft Brandgranaten mit Flächen-Schaden
- **Raketenwerfer**: Lange Reichweite, langsames Nachladen, hoher Flächen-Schaden
- **Heilung**: Regeneriert Gesundheit, beeinflusst Gift- und Feuer-Schaden

### Spezial
- **Larven**: Spawn 4 Mikro-Larven beim Tod, die bei Kontakt explodieren
- **Spinnennest**: Spawn 3 Mini-Kanonen-Spinnen alle 8 Sekunden
- **Kettenhemd**: Reduziert eingehenden Schaden
- **Panzer**: Fügt massive Lebenspunkte hinzu
- **Kastanien**: Lässt Minen auf dem Schlachtfeld fallen

## Wirtschaftssystem

### Ressourcen
- **Äpfel**: Hauptwährung, wird durch Siege und das Sammeln von Äpfeln während des Kampfes verdient
- **Sternanis**: Spezielle Währung, wird seltener verdient und für hochwertige Upgrades benötigt
- **Blätter**: In-Game-Ressource, die automatisch generiert wird und zum Spawnen von Segmenten während des Kampfes verwendet wird

### Basis-Wirtschaft
- **Level 0**: +2 Blätter/Sekunde, Maximalvorrat 750
- **Jedes Basis-Upgrade**: Verdoppelt die Produktionsgeschwindigkeit und den Maximalvorrat

### Forschungskosten
- **Level 1-3**: Kosten Äpfel
- **Level 4-5**: Kosten Sternanis

## Siegbedingungen

- **Sieg**: Zerstöre die feindliche Basis (Baum)
- **Niederlage**: Deine Basis wird auf 0 Gesundheit reduziert
- **Belohnungen**: Nach einem Sieg erhältst du 5 + n Äpfel, wobei n die Anzahl der während des Kampfes gesammelten Äpfel ist

## Spezielle Ereignisse

- Wenn deine Basis unter 60% Gesundheit fällt, hat jeder getroffene Schuss eine 4% Chance, einen Apfel vom Baum fallen zu lassen
- Berühre fallende Blätter für einen sofortigen Bonus von +20 bis +30 Blättern
- Berühre fallende Äpfel, um sie zu deinem Inventar hinzuzufügen

## Admin-Panel

Das Admin-Panel kann mit dem Passwort "Imperium" entsperrt werden. Es ermöglicht:
- Spielernamen ändern
- Äpfel und Sternanis anpassen
- Freigeschaltete Level ändern
- Forschungs-Level anpassen
- Spezialfähigkeiten konfigurieren
- Überfall-Einstellungen ändern
- Statistiken bearbeiten

## Technische Anforderungen

- React Native mit Expo
- iOS oder Android Gerät
- Mindestens 2 GB RAM
- Internetverbindung für die erste Installation

## Entwicklung

### Projektstruktur
```
Wurm_Krieg_3/
├── App.js                    # Haupteinstiegspunkt
├── src/
│   ├── config/
│   │   ├── gameConfig.js     # Spielkonfiguration und Balancing
│   │   └── index.js          # Config-Exporte
│   ├── contexts/
│   │   ├── GameStateContext.js # Globaler Spiel-State
│   │   └── index.js          # Context-Exporte
│   ├── screens/
│   │   ├── MainMenuScreen.js
│   │   ├── BattleSelectScreen.js
│   │   ├── SegmentLoadoutScreen.js
│   │   ├── GamePlayScreen.js
│   │   ├── RaidScreen.js
│   │   ├── ResearchScreen.js
│   │   ├── InstructionsScreen.js
│   │   ├── ResetProgressScreen.js
│   │   ├── AdminScreen.js
│   │   └── index.js
│   ├── components/
│   │   ├── Button.js
│   │   └── index.js
│   ├── hooks/
│   │   ├── useGameLoop.js
│   │   └── index.js
│   ├── utils/
│   │   ├── helpers.js
│   │   └── index.js
│   └── index.js
├── assets/                   # Bilder und andere Assets
├── package.json
├── app.json
└── babel.config.js
```

### Abhängigkeiten

- `expo`: ~50.0.0
- `expo-status-bar`: ~1.10.0
- `react`: 18.2.0
- `react-native`: 0.73.0
- `@react-navigation/native`: ^6.1.9
- `@react-navigation/native-stack`: ^6.9.17

## Lizenz

Dieses Projekt ist Eigentum von DasImperium und darf nicht ohne Genehmigung weiterverbreitet werden.

## Support

Bei Fragen oder Problemen wende dich bitte an das Entwicklungsteam.
