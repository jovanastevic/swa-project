# Actual Intelligence (AI) - SWA Semesterprojekt

## TODO:
- [X] ~~Kurzbeschreibung des Projekts~~ - Verena
- [X] ~~Presentation Layer - UML [X]~~ - Sadi
- [ ] Presentation Layer - Mockups - Verena
- [X] ~~Business Layer - UML (inkl Navigabilität, Kardinalität und Zugriffsmodifier)~~ - Sadi
- [X] ~~Data Layer - ER Diagramm~~ - Jovana - check vor Abgabe


### Frontend Aufgaben:
- [ ] Websocket Oberfläche - Jovana
- [X] ~~Authentication Login und Logout~~ - Jovana
- [X] ~~/index sichtbar auch wenn nicht eingeloggt, aber im Header soll "Login" stehen~~ - Jovana
- [X] Prompts löschen und neue einbauen weil "test test" is oag schirch - maybe Verena
- ~~Code Kommentare einbauen~~ - Sadi & Jovana

### Backend Aufgaben:
- [X] ~~Auth vlt umändern idk, /logout muss glaub auch da sein~~ - Sadi
- [X] ~~Swagger UI für API Dokumentation für extra Punkte~~ - Sadi
- [X] ~~Catagories nur eine Get Route~~ - Sadi
- [X] ~~Automatisierte Tests mit Jest~~ - Sadi

### Fehlermeldungen:
- [ ] Wenn keine Prompts, soll kein Error sein, sondern einfach "Keine Prompts vorhanden" oder so anzeigen
- [ ] 404 Error testen - unnötig
- [X] beim Eingeben von Login/Register Data sollte auch eine Fehlermeldung kommen, wenn die Daten falsch sind, z.B. "Falscher Benutzername oder Passwort"
- [ ] Beim Erstellen eines Prompts sollte auch eine Fehlermeldung kommen, wenn die Daten falsch sind, z.B. "Ungültige Eingabe"
- [ ] checken ob alle HTTP Codes richtig bzw sinnvoll sind - Alle bitte

## Vorbereitung für Gespräch:
Ihr müsst jetzt einfach für den Client und den Server argumentieren, welche teile welcher Schicht angehören und welche Design Pattern ihr verwendet habt (zB eventuell MVVM statt MVC in React???).

Was ihr erklären können solltet ist:
- Wie wird der Frontend-Zustand verwaltet? zB verwendet ihr Redux, wenn nicht, was sonst?
- Wo befinden sich die Geschäftsregeln? Wo werden sicherheitskritische Regeln angewendet (zB welcher User darf was machen / welche Daten lesen,…)
- Wenn das Backend einem TS entspricht, ist es ein vollständiges REST-Modell??
- Sind HTTP, Geschäftslogik und Persistenz getrennt? (3-Schichten)

### Details
Über useState, useHooks und localStorage. Wir verwenden kein Redux

Backend Design Pattern: Controller-Service Pattern, kein MVVM, API ist zustandslos

Frontend: Prinzipien von MVVM, aber nicht strkt umgesetzt, Custom Hooks fungieren als ViewModel. 
React hat One Way Data Binding, also ist es nicht wirklich MVVM, aber wir haben die Prinzipien von MVVM beachtet.

