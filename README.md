# Actual Intelligence (AI) - SWA Semesterprojekt

## Vorbereitung für Gespräch:
Ihr müsst jetzt einfach für den Client und den Server argumentieren, welche teile welcher Schicht angehören und welche Design Pattern ihr verwendet habt (zB eventuell MVVM statt MVC in React???).

Was ihr erklären können solltet ist:
- Wie wird der Frontend-Zustand verwaltet? zB verwendet ihr Redux, wenn nicht, was sonst?
- Wo befinden sich die Geschäftsregeln? Wo werden sicherheitskritische Regeln angewendet (zB welcher User darf was machen / welche Daten lesen,…)
- Wenn das Backend einem TS entspricht, ist es ein vollständiges REST-Modell??
- Sind HTTP, Geschäftslogik und Persistenz getrennt? (3-Schichten)

### Details
#### Wie wird der Frontend-Zustand verwaltet? zB verwendet ihr Redux, wenn nicht, was sonst?
Über useState und localStorage. Wir verwenden kein Redux, da das Projekt aufgebläht genug ist. Wäre allerdings eine gute Variante gewesen, um User Data zu speichern. Wir haben uns entschieden, den Zustand in den Komponenten zu halten und bei Bedarf in localStorage zu speichern.

#### Wo befinden sich die Geschäftsregeln? Wo werden sicherheitskritische Regeln angewendet (zB welcher User darf was machen / welche Daten lesen,…)
Geschäftsregeln befinden sich im Backend in den Services.
Sicherheitskritische Regeln werden im Backend angewendet in der Middleware `/src/middleware/auth.ts`.

#### Wenn das Backend einem TS entspricht, ist es ein vollständiges REST-Modell??
Nein, weil

#### Sind HTTP, Geschäftslogik und Persistenz getrennt? (3-Schichten)
Nein, es sind nur 2 Schichten, da wir keine separate Persistenzschicht haben. Bei uns sind die Geschäftsregeln in den Services und die Persistenz ist direkt in den Services implementiert.

Backend Design Pattern: Controller-Service Pattern, kein MVVM, API ist zustandslos

Frontend: Prinzipien von MVVM, aber nicht strkt umgesetzt, Custom Hooks fungieren als ViewModel. 
React hat One Way Data Binding, also ist es nicht wirklich MVVM, aber wir haben die Prinzipien von MVVM beachtet.



## TODOS
- [ ] Schmiedls Folien lesen und versteheeen
- [X] Dokumentationsdokument finishen mit aktuellsten Diagrammen
- [ ] Seine Email checken & Stichworte hier im File notieren
- [ ] Unterschiede zwischen den Models ausm Unterricht

## Mögliche Theoriefragen aus Folien:
- Was ist der Unterschied zwischen Domain Model & Transaction Script? `Folien 5`
- Wie funktioniert Domain Model/Transaction Script? `Folien 5`
- Vergleich zwischen den beiden Patterns, Vor- und Nachteile `Folien 5`
- Client Session State (HTTP ist stateless, wie handlet man States?), Cookies, Hidden Fields (old school way), Server Session State, DB Session State, Funktionsweise, Vorteile & Ncahteile `Folien 2`
- 3 Schichten Modell, Probleme, Lösungen, Vor- und Nachteile, wir verwenden *3 Schichten AJAX Web Apps, aber keine 3 Schichten, bei uns sind Data Layer & Business Layer gemixt in `Services`* `Folien 3`
- MVC, Page Controller (ig wie Astro bei uns), Front Controller (ig bei uns `index.ts`), Template View (haben wir im frontend), Transform View (haben wir nd) `Folien 3`
- UML, State Diagram, Funktionsweise `Folie 4`
- UML Class Diagram `Folie 6` skippbar
- Data Layer, Aufgaben, 3 Schichten `Folie 7`