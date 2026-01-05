# SPEC_01: ACE Markdown Editor

> **Versio:** 1.0  
> **Päivitetty:** 2026-01-05  
> **Status:** Draft  
> **Perustuu:** Käyttäjän toimittama määrittely (v2)

---

## 1. Yleiskatsaus

### 1.1 Tarkoitus

ACE Markdown Editor on selainpohjainen muistiinpanoeditori, joka on optimoitu iPad 12,9" -käyttöön. Se tarjoaa reaaliaikaisen Markdown-esikatselun, syntaksikorostuksen sekä muistiinpanojen hallinnan ilman palvelinriippuvuutta.

### 1.2 Scope

**Sisältyy:**
- Split-pane editori + live preview
- Markdown-syntaksin korostus editorissa (CodeMirror 6)
- Koodiblokkien syntaksikorostus previewssa (highlight.js)
- Muistiinpanojen tallennus localStorageen
- HTML- ja PDF-export
- Responsiivinen UI (iPad-first, desktop, mobile)
- Dark/Light -teeman vaihto

**Ei sisälly:**
- Backend / pilvisynkronointi
- Käyttäjähallinta / kirjautuminen
- Reaaliaikainen yhteismuokkaus
- Tiedostojen tuonti (import)

### 1.3 Primitiivi

**Perusyksikkö:** Note (muistiinpano)

```
┌──────────────────────────────────────┐
│ Note                                 │
├──────────────────────────────────────┤
│ id: string (UUID)                    │
│ title: string                        │
│ content: string (Markdown)           │
│ createdAt: ISO timestamp             │
│ updatedAt: ISO timestamp             │
└──────────────────────────────────────┘
```

---

## 2. Requirements & Acceptance Criteria

### REQ-01: Split-pane Layout 🟢

Käyttöliittymä jakautuu editoriin ja esikatseluun, mukautuen laitteen kokoon ja orientaatioon.

**Acceptance Criteria:**

| AC-ID | Kriteeri | Tyyppi |
|-------|----------|--------|
| AC-01 | Desktop ja iPad landscape: split-pane näkymä, säädettävä jakaja | Functional |
| AC-02 | iPad portrait ja mobile (<768px): Edit/Preview -välilehdet | Functional |
| AC-03 | Jakajan sijainti tallennetaan localStorageen ja palautuu | Functional |
| AC-04 | Edit/Preview -vaihto säilyttää editorin scroll-position | Functional |

**Prioriteetti:** 🟢 MVP  
**Riippuvuudet:** -

---

### REQ-02: Real-time Markdown Preview 🟢

Preview päivittyy välittömästi kirjoitettaessa ilman näkyvää viivettä.

**Acceptance Criteria:**

| AC-ID | Kriteeri | Tyyppi |
|-------|----------|--------|
| AC-05 | Preview päivittyy jokaisella näppäinpainalluksella | Functional |
| AC-06 | 10k-100k merkin dokumenteilla UI pysyy responsiivisena (ei jäädytystä) | Performance |
| AC-07 | Markdown renderöidään marked.js -kirjastolla | Technical |

**Prioriteetti:** 🟢 MVP  
**Riippuvuudet:** REQ-01

---

### REQ-03: Syntax Highlighting (Editor) 🟢

Markdown-syntaksi näkyy editorissa eri väreillä ja tyyleillä.

**Acceptance Criteria:**

| AC-ID | Kriteeri | Tyyppi |
|-------|----------|--------|
| AC-08 | Otsikot (#, ##, ###) erottuvat visuaalisesti | Functional |
| AC-09 | Bold, italic, strikethrough näkyvät eri tyyleillä | Functional |
| AC-10 | Koodiblokit (```) erottuvat taustalla | Functional |
| AC-11 | Linkit ja kuvat erottuvat | Functional |
| AC-12 | Editori toteutetaan CodeMirror 6:lla | Technical |

**Prioriteetti:** 🟢 MVP  
**Riippuvuudet:** -

---

### REQ-04: Syntax Highlighting (Preview) 🟢

Koodiblokit näkyvät previewssa syntaksikorostettuna.

**Acceptance Criteria:**

| AC-ID | Kriteeri | Tyyppi |
|-------|----------|--------|
| AC-13 | Fenced code blockit (```js, ```python jne.) näkyvät värikoodattuina | Functional |
| AC-14 | Ilman kielimäärettä oleva koodi saa auto-detect highlighting | Functional |
| AC-15 | highlight.js ladataan CDN:stä | Technical |

**Prioriteetti:** 🟢 MVP  
**Riippuvuudet:** REQ-02

---

### REQ-05: Note Management 🟢

Käyttäjä voi luoda, tallentaa, nimetä uudelleen ja poistaa muistiinpanoja.

**Acceptance Criteria:**

| AC-ID | Kriteeri | Tyyppi |
|-------|----------|--------|
| AC-16 | "New Note" luo uuden tyhjän muistiinpanon | Functional |
| AC-17 | Muistiinpanot tallentuvat localStorageen (autosave 2-3s debounce) | Functional |
| AC-18 | "Unsaved" -indikaattori näkyy kun on tallentamattomia muutoksia | Functional |
| AC-19 | Save-nappi pakottaa välittömän tallennuksen | Functional |
| AC-20 | Muistiinpanon otsikon voi muokata (rename) | Functional |
| AC-21 | Delete poistaa muistiinpanon (confirm-dialogi ensin) | Functional |
| AC-22 | Sivupalkissa näkyy lista muistiinpanoista (otsikko + updatedAt) | Functional |
| AC-23 | Listasta klikkaamalla muistiinpano latautuu editoriin | Functional |
| AC-24 | Sovellus avautuu viimeksi muokattuun muistiinpanoon | Functional |

**Prioriteetti:** 🟢 MVP  
**Riippuvuudet:** -

---

### REQ-06: Export HTML 🟢

Käyttäjä voi viedä muistiinpanon itsenäisenä HTML-tiedostona.

**Acceptance Criteria:**

| AC-ID | Kriteeri | Tyyppi |
|-------|----------|--------|
| AC-25 | Export tuottaa ladattavan .html-tiedoston | Functional |
| AC-26 | HTML sisältää inline-tyylit (toimii offline) | Functional |
| AC-27 | Koodiblokkien syntaksivärit säilyvät | Functional |
| AC-28 | Tiedostonimi perustuu muistiinpanon otsikkoon | Functional |

**Prioriteetti:** 🟢 MVP  
**Riippuvuudet:** REQ-02

---

### REQ-07: Export PDF 🟢

Käyttäjä voi viedä muistiinpanon PDF-tiedostona.

**Acceptance Criteria:**

| AC-ID | Kriteeri | Tyyppi |
|-------|----------|--------|
| AC-29 | Export avaa print-dialogin (window.print()) | Functional |
| AC-30 | Print CSS tuottaa 1:1 tuloksen previewn kanssa | Functional |
| AC-31 | Koodiblokkien värit säilyvät (-webkit-print-color-adjust: exact) | Functional |
| AC-32 | Koodiblokit eivät leikkaannu sivunvaihdossa (page-break-inside: avoid) | Functional |
| AC-33 | Toimii iPadOS Safari/Chrome "Share → Print → Save as PDF" -flowlla | Functional |

**Prioriteetti:** 🟢 MVP  
**Riippuvuudet:** REQ-02

---

### REQ-08: Preview Security (XSS Protection) 🟢

Preview on suojattu haitalliselta sisällöltä.

**Acceptance Criteria:**

| AC-ID | Kriteeri | Tyyppi |
|-------|----------|--------|
| AC-34 | HTML sanitoidaan DOMPurify-kirjastolla ennen renderöintiä | Security |
| AC-35 | <script> -tagit eivät suoritu | Security |
| AC-36 | Event handlerit (onclick, onerror jne.) eivät toimi | Security |
| AC-37 | Vaaralliset attribuutit poistetaan | Security |

**Prioriteetti:** 🟢 MVP  
**Riippuvuudet:** REQ-02

---

### REQ-09: Dark/Light Theme 🟢

Käyttäjä voi vaihtaa teemaa.

**Acceptance Criteria:**

| AC-ID | Kriteeri | Tyyppi |
|-------|----------|--------|
| AC-38 | Toggle-nappi vaihtaa dark/light -teeman | Functional |
| AC-39 | Teemavalinta tallennetaan localStorageen | Functional |
| AC-40 | Teema vaikuttaa editoriin, previewiin ja UI-elementteihin | Functional |
| AC-41 | Oletuksena käytetään järjestelmän teemaa (prefers-color-scheme) | Functional |

**Prioriteetti:** 🟢 MVP  
**Riippuvuudet:** -

---

### REQ-10: Visual Feedback & Error Handling 🟢

Käyttäjä saa selkeää palautetta toiminnoistaan ja virhetilanteista.

**Acceptance Criteria:**

| AC-ID | Kriteeri | Tyyppi |
|-------|----------|--------|
| AC-42 | Toast/snackbar näyttää: "Saved", "Deleted", "Exported" | Functional |
| AC-43 | localStorage-virheistä (quota täynnä, estetty) näytetään virheilmoitus | Error |
| AC-44 | Tyhjätilassa (no notes) näytetään ohje + "New Note" -nappi | Functional |
| AC-45 | Data-korruptio havaitaan ja käsitellään (safe fallback) | Error |

**Prioriteetti:** 🟢 MVP  
**Riippuvuudet:** REQ-05

---

## 3. UI-määrittely

### 3.1 Layout-rakenne

```
┌─────────────────────────────────────────────────────────────────┐
│  TOOLBAR                                                        │
│  [☰] ACE Markdown    [New] [Save] [HTML] [PDF]    [🌙/☀️]      │
├──────────┬──────────────────────────────────────────────────────┤
│ SIDEBAR  │  MAIN AREA                                           │
│          │  ┌─────────────────┬─────────────────┐              │
│ Notes:   │  │    EDITOR       │    PREVIEW      │              │
│ ─────    │  │                 │                 │              │
│ • Note 1 │  │  [CodeMirror]   │  [Rendered MD]  │              │
│ • Note 2 │  │                 │                 │              │
│ • Note 3 │  │                 │                 │              │
│          │  │                 │                 │              │
│          │  └─────────────────┴─────────────────┘              │
└──────────┴──────────────────────────────────────────────────────┘
```

### 3.2 Responsiivisuus

| Breakpoint | Layout | Sidebar | Split-pane |
|------------|--------|---------|------------|
| Desktop (>1024px) | Split-pane | Visible | Draggable divider |
| iPad Landscape (768-1024px) | Split-pane | Collapsible (hamburger) | Draggable divider |
| iPad Portrait / Mobile (<768px) | Tabs | Drawer (hamburger) | Edit/Preview tabs |

### 3.3 Sidebar (Notes List)

```
┌──────────────────────┐
│ 📝 Notes             │
├──────────────────────┤
│ ┌──────────────────┐ │
│ │ Meeting Notes    │ │
│ │ 5 min ago     ⋮  │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ Project Ideas    │ │
│ │ 2 hours ago   ⋮  │ │
│ └──────────────────┘ │
│                      │
│ [+ New Note]         │
└──────────────────────┘
```

Kontekstimenu (⋮):
- Rename
- Delete

---

## 4. Data Model

### 4.1 localStorage Keys

| Key | Sisältö | Tyyppi |
|-----|---------|--------|
| `ace_md_notes_v1` | Kaikki muistiinpanot | JSON array |
| `ace_md_settings_v1` | Käyttäjäasetukset | JSON object |

### 4.2 Notes Schema

```typescript
interface Note {
  id: string;          // UUID v4
  title: string;       // Max 100 chars
  content: string;     // Markdown content
  createdAt: string;   // ISO 8601
  updatedAt: string;   // ISO 8601
}

// localStorage: ace_md_notes_v1
type NotesStorage = Note[];
```

### 4.3 Settings Schema

```typescript
interface Settings {
  theme: 'light' | 'dark' | 'system';
  splitRatio: number;        // 0.0 - 1.0 (editor width)
  lastOpenNoteId: string | null;
  sidebarCollapsed: boolean;
}

// localStorage: ace_md_settings_v1
```

---

## 5. Edge Cases & Error Handling

### 5.1 Edge Cases

| Case | Tilanne | Odotettu käytös |
|------|---------|-----------------|
| Tyhjä nota | Uusi note luotu | Oletustitle "Untitled Note" |
| Erittäin pitkä nota | >100k merkkiä | Toimii, throttled preview |
| Erikoismerkit otsikossa | Emojit, Unicode | Sallittu, sanitoidaan exportissa |
| Sama otsikko | Kaksi notea samalla nimellä | Sallittu (id on uniikki) |
| Viimeinen nota poistetaan | 0 notea jäljellä | Näytä tyhjätila + ohje |

### 5.2 Virhetilanteet

| Virhe | Trigger | Käsittely | Käyttäjäviesti |
|-------|---------|-----------|----------------|
| localStorage disabled | Private browsing | Warn + continue (no persistence) | "Storage disabled. Notes won't be saved." |
| localStorage quota | >5MB data | Prevent save | "Storage full. Delete old notes to continue." |
| JSON parse error | Corrupted data | Reset to empty | "Data corrupted. Starting fresh." |
| Export failed | Browser block | Show error | "Export failed. Check browser settings." |

---

## 6. Turvallisuus

### 6.1 XSS Prevention

| Uhka | Suojaus |
|------|---------|
| Script injection | DOMPurify sanitoi kaiken HTML:n |
| Event handlers | DOMPurify poistaa onclick, onerror jne. |
| Data URLs | Sallitaan vain kuville (img src) |
| iframe injection | DOMPurify poistaa iframet |

### 6.2 Sanitointi-config

```javascript
const purifyConfig = {
  ALLOWED_TAGS: ['h1','h2','h3','h4','h5','h6','p','br','hr',
                 'ul','ol','li','blockquote','pre','code',
                 'a','img','strong','em','del','table','thead',
                 'tbody','tr','th','td'],
  ALLOWED_ATTR: ['href','src','alt','title','class'],
  ALLOW_DATA_ATTR: false
};
```

---

## 7. Suorituskyky

### 7.1 Tavoitteet

| Operaatio | Tavoite | Max |
|-----------|---------|-----|
| Initial load | < 2s | 4s |
| Preview update | < 50ms | 100ms |
| Note switch | < 100ms | 200ms |
| Save to localStorage | < 50ms | 100ms |

### 7.2 Optimoinnit

| Tekniikka | Tarkoitus |
|-----------|-----------|
| requestAnimationFrame | Preview throttling |
| Debounce (2-3s) | Autosave |
| CSS containment | Render isolation |
| Lazy highlight | highlight.js vain näkyville blokeille |

---

## 8. Teknologia Stack

| Komponentti | Teknologia | Lähde |
|-------------|------------|-------|
| Editor | CodeMirror 6 | esm.sh CDN |
| Markdown parser | marked.js | CDN |
| Code highlighting | highlight.js | CDN |
| HTML sanitizer | DOMPurify | CDN |
| Styling | CSS (custom) | Inline |
| Icons | Lucide (optional) | CDN |

---

## 9. Traceability Matrix

| REQ | AC | Status |
|-----|-----|--------|
| REQ-01 | AC-01, AC-02, AC-03, AC-04 | 🔲 |
| REQ-02 | AC-05, AC-06, AC-07 | 🔲 |
| REQ-03 | AC-08, AC-09, AC-10, AC-11, AC-12 | 🔲 |
| REQ-04 | AC-13, AC-14, AC-15 | 🔲 |
| REQ-05 | AC-16 - AC-24 | 🔲 |
| REQ-06 | AC-25, AC-26, AC-27, AC-28 | 🔲 |
| REQ-07 | AC-29, AC-30, AC-31, AC-32, AC-33 | 🔲 |
| REQ-08 | AC-34, AC-35, AC-36, AC-37 | 🔲 |
| REQ-09 | AC-38, AC-39, AC-40, AC-41 | 🔲 |
| REQ-10 | AC-42, AC-43, AC-44, AC-45 | 🔲 |

**Status:** ✅ Valmis | 🔶 Työn alla | 🔲 Ei aloitettu

---

## 10. Definition of Done

MVP on valmis kun:
- ✅ Kaikki REQ-01 - REQ-10 acceptance criteriat täyttyvät
- ✅ iPad 12,9" käyttö on sujuva (landscape + portrait)
- ✅ Desktop ja mobile toimivat responsiivisesti
- ✅ Koodi on kommentoitu ja jäsennelty
- ✅ Manuaalinen testaus läpäisty kaikilla alustoilla

---

## 11. Avoimet kysymykset

| # | Kysymys | Status | Päätös |
|---|---------|--------|--------|
| 1 | Single HTML vs modulaarinen? | ✅ Ratkaistu | Modulaarinen OK, iPad-tuki prioriteetti |
| 2 | CodeMirror 5 vs 6? | ✅ Ratkaistu | CM6 (parempi touch-tuki) |
| 3 | PDF export -toteutus? | ✅ Ratkaistu | window.print() + print CSS (1:1 preview) |
| 4 | Autosave vs manual? | ✅ Ratkaistu | Autosave + manuaalinen save-nappi |

---

## Muutoshistoria

| Versio | Päivämäärä | Muutokset |
|--------|------------|-----------|
| 1.0 | 2026-01-05 | Ensimmäinen versio |

---

*Dokumentti on osa ACE Markdown Editor -projektin dokumentaatiota.*
