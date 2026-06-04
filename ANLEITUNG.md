# Anleitung: OnLifeRP Webseite kostenlos auf GitHub Pages veröffentlichen

Wir haben für dich eine hochmoderne, responsive und schnelle Single-Page-Webseite mit all deinen Texten, Regeln und Gesetzen erstellt. Die Webseite besteht aus drei Hauptdateien im Ordner `ol_internetseite`:
1. `index.html` (Die Struktur und deine Texte)
2. `style.css` (Das moderne Dark-Glow & Glassmorphism Design)
3. `app.js` (Die Navigation und die Live-Suchfunktionen für Regeln und Gesetze)

Hier ist die Schritt-für-Schritt-Anleitung, wie du diese Dateien komplett kostenlos auf **GitHub Pages** veröffentlichst:

---

## Schritt 1: GitHub-Account erstellen (falls nicht vorhanden)
1. Gehe auf [github.com](https://github.com/) und registriere dich kostenlos.
2. Bestätige deine E-Mail-Adresse.

---

## Schritt 2: Ein neues Repository (Projekt) erstellen
1. Klicke oben rechts auf das **`+`** Symbol und wähle **New repository** (Neues Repository).
2. Trage folgende Einstellungen ein:
   * **Repository name:** `onliferp` (oder ein anderer Name deiner Wahl).
   * **Description:** optional (z. B. `Die offizielle Webseite für OnLifeRP`).
   * **Public:** Stelle sicher, dass das Repository auf **Public** (Öffentlich) eingestellt ist (Pflicht für kostenloses Hosting!).
   * Lasse alle anderen Optionen (README, .gitignore, License) so, wie sie sind (nicht anhaken).
3. Klicke unten auf den grünen Button **Create repository** (Repository erstellen).

---

## Schritt 3: Dateien hochladen (Die einfachste Methode im Browser)
1. Nach dem Erstellen siehst du eine leere Seite mit Code-Befehlen.
2. Suche in der Mitte nach dem Link: **`uploading an existing file`** (eine existierende Datei hochladen) und klicke darauf.
3. Öffne deinen Datei-Explorer auf dem PC und navigiere zu deinem Ordner:  
   `C:\Users\Administrator\Desktop\antigrabity\ol_internetseite`
4. Markiere die folgenden drei Dateien:
   * **`index.html`**
   * **`style.css`**
   * **`app.js`**
5. Ziehe diese drei Dateien per Drag & Drop in das große Upload-Feld im Browser.
6. Warte kurz, bis alle Dateien geladen sind.
7. Klicke ganz unten auf den grünen Button **Commit changes** (Änderungen speichern).

---

## Schritt 4: GitHub Pages (Hosting) aktivieren
1. Klicke in deinem Repository oben in der Menüleiste auf **Settings** (Einstellungen / Zahnrad-Symbol).
2. Klicke im linken Seitenmenü unter dem Bereich **Code and automation** auf den Punkt **`Pages`**.
3. Wähle unter dem Punkt **Build and deployment** bei **Branch** statt *None* den Branch **`main`** (oder `master`) aus.
4. Lasse den Ordner daneben auf **`/ (root)`** stehen.
5. Klicke rechts daneben auf den Button **`Save`** (Speichern).

---

## Fertig! Deine Webseite ist online!
Nach ca. 1 bis 2 Minuten generiert GitHub deine Webseite im Hintergrund.
* Du kannst die Seite über den Reiter **Settings -> Pages** oben einsehen. Dort erscheint ein grüner Kasten mit dem Link, der ungefähr so aussieht:  
  `https://DEIN-GITHUB-BENUTZERNAME.github.io/onliferp/`

---

### Was macht diese neue Webseite so besonders?
* **Live-Suchfunktion für Serverregeln:** User können im Regelwerk-Tab live nach Stichworten wie "VDM" oder "Support" filtern. Die passende Kategorie öffnet sich automatisch und das gesuchte Wort wird farbig markiert.
* **Live-Suchfunktion für Gesetze:** Im Gesetzbuch können Bürger direkt nach Gesetzen wie "Mord" oder "Diebstahl" suchen – das System filtert blitzschnell und springt automatisch in den richtigen Reiter.
* **Modernes Design:** Keine Webnode-Werbung mehr, dafür ein erstklassiges Dark-Theme mit sanften, fließenden Farbübergängen (Neon-Lila/Cyan) und responsivem Layout für Handys und PCs.
