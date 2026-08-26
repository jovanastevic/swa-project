# Actual Intelligence (AI) - SWA Semesterprojekt

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

## TODOS
- [ ] Schmiedls Folien lesen und versteheeen
- [ ] Dokumentationsdokument finishen mit aktuellsten Diagrammen
- [ ] Seine Email checken & Stichworte hier im File notieren
- [ ] Unterschiede zwischen den Models ausm Unterricht
