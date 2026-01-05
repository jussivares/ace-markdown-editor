# TECH_SPEC_01: ACE Markdown Editor

> **Versio:** 1.2
> **Päivitetty:** 2026-01-05
> **Status:** Draft
> **Gemini Review:** 2026-01-05 (5 löydöstä, kaikki käsitelty)
> **Claude Review:** 2026-01-05 (3 kriittistä virhettä korjattu, state flow lisätty)
> **Perustuu:** SPEC_01_ACE_Markdown_Editor.md

---

## 1. Yhteenveto

### 1.1 Moduulin tarkoitus

ACE Markdown Editor on selainpohjainen muistiinpanosovellus, joka koostuu viidestä löyhästi kytketystä moduulista. Jokainen moduuli wrappaa ulkoisen kirjaston tai selaimen API:n, mahdollistaen osien vaihtamisen tulevaisuudessa.

### 1.2 Arkkitehtuurinen asema

```
┌─────────────────────────────────────────────────────────────────┐
│                           index.html                            │
│                    (Entry point, layout shell)                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         app.js (Orchestrator)                   │
│            Event bus, dependency injection, lifecycle           │
├──────────┬──────────┬──────────┬──────────┬────────────────────┤
│ editor.js│preview.js│storage.js│ export.js│      ui.js         │
│          │          │          │          │                    │
│ Wraps:   │ Wraps:   │ Wraps:   │ Wraps:   │ Wraps:             │
│ CodeMir- │ marked   │ local-   │ Blob API │ DOM manipulation   │
│ ror 6    │ DOMPurify│ Storage  │ print()  │ CSS variables      │
│          │ hljs     │          │          │                    │
└──────────┴──────────┴──────────┴──────────┴────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External Libraries (CDN)                   │
│  @codemirror/* │ marked.js │ highlight.js │ DOMPurify          │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Primitiivi

**Note** on järjestelmän perusyksikkö:

```javascript
/**
 * @typedef {Object} Note
 * @property {string} id - UUID v4
 * @property {string} title - Otsikko (max 100 merkkiä)
 * @property {string} content - Markdown-sisältö
 * @property {string} createdAt - ISO 8601 timestamp
 * @property {string} updatedAt - ISO 8601 timestamp
 */
```

**Note Edge Cases (Gemini Finding #5):**

| Tilanne | Käyttäytyminen |
|---------|----------------|
| Uusi note ilman otsikkoa | `title = 'Untitled Note'` |
| Otsikko > 100 merkkiä | Katkaistaan: `title.slice(0, 100)` |
| Ensimmäinen käynnistys, ei noteja | Näytetään tyhjätila + "Create your first note" |
| `lastOpenNoteId` ei löydy | Avataan uusin note (`notes[0]`) tai tyhjätila |

### 1.4 Riippuvuudet (CDN) - Versiolukitut (Gemini Finding #1)

| Kirjasto | Versio | CDN | Käyttötarkoitus |
|----------|--------|-----|-----------------|
| codemirror | 6.0.1 | esm.sh | Editor basicSetup |
| @codemirror/view | 6.35.0 | esm.sh | Editor-ydin |
| @codemirror/state | 6.5.0 | esm.sh | Editor state management |
| @codemirror/lang-markdown | 6.3.1 | esm.sh | Markdown syntax highlighting |
| @codemirror/theme-one-dark | 6.1.2 | esm.sh | Dark theme |
| marked | 15.0.6 | esm.sh | Markdown → HTML |
| marked-highlight | 2.2.1 | esm.sh | highlight.js integraatio marked:iin |
| highlight.js | 11.11.1 | esm.sh | Code syntax highlighting |
| DOMPurify | 3.2.4 | esm.sh | XSS sanitization |

**Import Map (index.html):**

```html
<script type="importmap">
{
  "imports": {
    "codemirror": "https://esm.sh/codemirror@6.0.1",
    "@codemirror/view": "https://esm.sh/@codemirror/view@6.35.0",
    "@codemirror/state": "https://esm.sh/@codemirror/state@6.5.0",
    "@codemirror/lang-markdown": "https://esm.sh/@codemirror/lang-markdown@6.3.1",
    "@codemirror/theme-one-dark": "https://esm.sh/@codemirror/theme-one-dark@6.1.2",
    "marked": "https://esm.sh/marked@15.0.6",
    "marked-highlight": "https://esm.sh/marked-highlight@2.2.1",
    "highlight.js": "https://esm.sh/highlight.js@11.11.1",
    "dompurify": "https://esm.sh/dompurify@3.2.4"
  }
}
</script>
```

**HUOM:** Kaikki kirjastot ladataan esm.sh:sta yhtenäisyyden vuoksi. `marked-highlight` tarvitaan highlight.js-integraatioon (marked v5.0+ ei tue enää sisäänrakennettua `highlight`-optiota).

**CDN Error Handling:**

```javascript
// app.js - graceful degradation
async function loadDependencies() {
  try {
    const modules = await Promise.all([
      import('@codemirror/view'),
      import('marked'),
      import('dompurify')
    ]);
    return modules;
  } catch (err) {
    showFatalError('Failed to load editor. Please check your internet connection and refresh.');
    throw err;
  }
}
```

**V2 Roadmap:** Service Worker offline-tukeen.

---

## 2. Teknologiavalinnat

### 2.1 Valitut teknologiat

| Komponentti | Valinta | Perustelu |
|-------------|---------|-----------|
| Editor | CodeMirror 6 | Paras touch-tuki, modulaarinen, aktiivinen kehitys |
| Markdown parser | marked.js | Nopea, laajennettava, hyvä dokumentaatio |
| Code highlighting | highlight.js | Laaja kielituki, helppo integraatio marked:iin |
| Sanitizer | DOMPurify | De facto standardi, aktiivisesti ylläpidetty |
| Module loading | ES Modules (esm.sh) | Natiivi selaintuki, ei bundleria |
| Styling | CSS Custom Properties | Teemojen vaihto ilman JS:ää |

### 2.2 Hylätyt vaihtoehdot

| Vaihtoehto | Miksi hylättiin |
|------------|-----------------|
| CodeMirror 5 | Vanhempi, huonompi touch-tuki |
| Monaco Editor | Liian raskas, monimutkainen setup |
| Ace Editor | Ei yhtä hyvä Markdown-tuki |
| markdown-it | Hieman monimutkaisempi konfiguraatio |
| jsPDF (PDF export) | Ei 1:1 vastaavuutta previewn kanssa |

---

## 3. Tiedostorakenne

```
ace-markdown-editor/
│
├── index.html              # Entry point, layout shell
│
├── css/
│   ├── variables.css       # CSS custom properties (colors, spacing)
│   ├── layout.css          # Split-pane, sidebar, toolbar
│   ├── editor.css          # CodeMirror overrides
│   ├── preview.css         # Rendered markdown styles
│   ├── components.css      # Buttons, toasts, dialogs
│   └── print.css           # @media print styles
│
├── js/
│   ├── app.js              # Orchestrator, event bus, init
│   ├── editor.js           # CodeMirror wrapper
│   ├── preview.js          # Markdown rendering wrapper
│   ├── storage.js          # localStorage wrapper
│   ├── export.js           # HTML & PDF export
│   ├── ui.js               # Layout, theme, toasts, dialogs
│   └── utils.js            # UUID, debounce, helpers
│
├── claude-project/         # Claude.ai project files
│   ├── INDEX.md
│   └── KEHITYSLOKI.md
│
├── docs/                   # Documentation
│   ├── SPEC_01_ACE_Markdown_Editor.md
│   ├── TECH_SPEC_01_ACE_Markdown_Editor.md
│   └── ...
│
└── README.md
```

---

## 4. Moduulien API-määrittelyt (Black Box)

### 4.1 editor.js

```javascript
/**
 * CodeMirror 6 wrapper - ei paljasta CM6 internalseja
 */
export class Editor {
  /**
   * @param {HTMLElement} container - Elementti johon editor mountataan
   * @param {Object} options
   * @param {function(string): void} options.onChange - Kutsutaan sisällön muuttuessa
   * @param {string} [options.theme='light'] - 'light' | 'dark'
   */
  constructor(container, options) {}
  
  /** @returns {string} Editorin sisältö */
  getValue() {}
  
  /** @param {string} content - Uusi sisältö */
  setValue(content) {}
  
  /** @param {'light'|'dark'} theme */
  setTheme(theme) {}
  
  /** Fokusoi editorin */
  focus() {}
  
  /** Palauttaa scroll-position (layout-vaihtoa varten) */
  getScrollPosition() {}
  
  /** @param {number} position */
  setScrollPosition(position) {}
  
  /** Tuhoaa editorin */
  destroy() {}
}
```

### 4.2 preview.js

```javascript
/**
 * Markdown preview wrapper - käyttää marked + DOMPurify + highlight.js
 */
export class Preview {
  /**
   * @param {HTMLElement} container - Elementti johon renderöidään
   */
  constructor(container) {}
  
  /**
   * Renderöi Markdownin HTML:ksi ja päivittää DOM:n
   * @param {string} markdown
   */
  render(markdown) {}
  
  /**
   * Palauttaa renderöidyn HTML:n (exportia varten)
   * @param {string} markdown
   * @returns {string} Sanitoitu HTML
   */
  toHTML(markdown) {}
  
  /** Tyhjentää previewn */
  clear() {}
}
```

### 4.3 storage.js

```javascript
/**
 * localStorage wrapper - Note-entiteettien hallinta
 */
export class Storage {
  /**
   * @param {Object} options
   * @param {string} [options.notesKey='ace_md_notes_v1']
   * @param {string} [options.settingsKey='ace_md_settings_v1']
   */
  constructor(options) {}
  
  // === Notes ===
  
  /** @returns {Note[]} Kaikki notet aikajärjestyksessä (uusin ensin) */
  getAllNotes() {}
  
  /** @param {string} id @returns {Note|null} */
  getNote(id) {}
  
  /** @param {Note} note @returns {Note} Tallennettu note (id lisätty jos uusi) */
  saveNote(note) {}
  
  /** @param {string} id @returns {boolean} */
  deleteNote(id) {}
  
  // === Settings ===
  
  /** @returns {Settings} */
  getSettings() {}
  
  /** @param {Partial<Settings>} settings */
  updateSettings(settings) {}
  
  // === Status ===
  
  /** @returns {boolean} Onko localStorage käytettävissä */
  isAvailable() {}
  
  /** @returns {{used: number, available: number}} Tilankäyttö bytes */
  getStorageInfo() {}
}

/**
 * @typedef {Object} Settings
 * @property {'light'|'dark'|'system'} theme
 * @property {number} splitRatio - 0.0-1.0
 * @property {string|null} lastOpenNoteId
 * @property {boolean} sidebarCollapsed
 */
```

### 4.4 export.js

```javascript
/**
 * Export wrapper - HTML ja PDF
 * Gemini Finding #3: Käyttää iframe-tekniikkaa PDF:lle
 */
export class Exporter {
  /**
   * @param {Preview} preview - Preview-instanssi HTML-generointiin
   */
  constructor(preview) {}
  
  /**
   * Vie noten HTML-tiedostona
   * @param {Note} note
   */
  exportHTML(note) {}
  
  /**
   * Vie noten PDF:nä käyttäen hidden iframe -tekniikkaa.
   * Tämä varmistaa että oikea note tulostetaan riippumatta
   * siitä mikä note on avoinna editorissa.
   * @param {Note} note
   */
  exportPDF(note) {}
  
  /**
   * Generoi täydellisen print-ready HTML:n
   * @param {Note} note
   * @returns {string} HTML dokumentti inline-tyyleillä
   * @private
   */
  _generatePrintHTML(note) {}
}
```

**PDF Export Implementation (iframe-tekniikka):**

```javascript
exportPDF(note) {
  // 1. Luo hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:absolute;left:-9999px;width:0;height:0;';
  document.body.appendChild(iframe);
  
  // 2. Generoi HTML tälle notelle (ei nykyiselle näkymälle)
  const html = this._generatePrintHTML(note);
  
  // 3. Kirjoita iframeen
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();
  
  // 4. Odota renderöintiä, sitten tulosta
  iframe.contentWindow.onload = () => {
    iframe.contentWindow.print();
  };
  
  // 5. Siivoa tulostuksen jälkeen
  iframe.contentWindow.onafterprint = () => {
    document.body.removeChild(iframe);
  };
}
```

### 4.5 ui.js

```javascript
/**
 * UI wrapper - layout, theme, feedback
 */
export class UI {
  /**
   * @param {Object} elements - DOM-elementit
   * @param {Object} options
   * @param {function(number): void} options.onSplitChange - Jakajan muutos
   * @param {function('light'|'dark'): void} options.onThemeChange
   * @param {function(): void} options.onSidebarToggle
   */
  constructor(elements, options) {}
  
  // === Layout ===
  
  /** @param {number} ratio - 0.0-1.0 */
  setSplitRatio(ratio) {}
  
  /** @param {'split'|'edit'|'preview'} mode */
  setLayoutMode(mode) {}
  
  /** @param {boolean} collapsed */
  setSidebarCollapsed(collapsed) {}
  
  // === Theme ===
  
  /** @param {'light'|'dark'|'system'} theme */
  setTheme(theme) {}
  
  /** @returns {'light'|'dark'} Aktiivinen teema (system resolvattuna) */
  getActiveTheme() {}
  
  // === Feedback ===
  
  /** @param {string} message @param {'success'|'error'|'info'} type */
  showToast(message, type) {}
  
  /** @param {string} message @param {function(): void} onConfirm */
  showConfirm(message, onConfirm) {}
  
  // === Responsive ===
  
  /** @returns {'desktop'|'tablet'|'mobile'} */
  getBreakpoint() {}
  
  /** @param {function(string): void} callback - Kutsutaan breakpointin vaihtuessa */
  onBreakpointChange(callback) {}
}
```

---

## 5. Event Bus -arkkitehtuuri

```javascript
// app.js - keskitetty event bus

const events = {
  // Editor events
  'editor:change': [],      // (content: string) - Sisältö muuttui
  'editor:ready': [],       // () - Editor valmis
  
  // Note events  
  'note:select': [],        // (id: string) - Note valittu listasta
  'note:create': [],        // () - Uusi note pyydetty
  'note:save': [],          // (note: Note) - Note tallennettu
  'note:delete': [],        // (id: string) - Note poistettu
  'note:rename': [],        // (id: string, title: string) - Note nimetty uudelleen
  
  // Export events
  'export:html': [],        // () - HTML export pyydetty
  'export:pdf': [],         // () - PDF export pyydetty
  
  // UI events
  'ui:theme': [],           // (theme: string) - Teema vaihdettu
  'ui:split': [],           // (ratio: number) - Jakaja siirretty
  'ui:sidebar': [],         // (collapsed: boolean) - Sidebar toggled
  
  // System events
  'storage:error': [],      // (error: Error) - Storage-virhe
  'storage:warning': [],    // (message: string) - Esim. "tilaa vähän"
};

export const bus = {
  on(event, callback) { events[event].push(callback); },
  off(event, callback) { events[event] = events[event].filter(cb => cb !== callback); },
  emit(event, ...args) { 
    // Gemini Review: try-catch estää yhden subscriberin kaatamasta koko bussia
    events[event]?.forEach(cb => {
      try {
        cb(...args);
      } catch (err) {
        console.error(`Event handler error [${event}]:`, err);
      }
    });
  }
};
```

**Data flow esimerkki:**

```
User types in editor
        │
        ▼
Editor.onChange(content)
        │
        ▼
bus.emit('editor:change', content)
        │
        ├──► Preview.render(content)
        │
        └──► Autosave (debounced)
                    │
                    ▼
            Storage.saveNote(note)
                    │
                    ▼
            bus.emit('note:save', note)
                    │
                    └──► UI.showToast('Saved')
                         NoteList.update()
```

---

## 5.1 Application State (Claude Review)

Sovelluksen tila on keskitetty `app.js`:ään:

```javascript
// app.js - Application State
const state = {
  currentNoteId: null,      // Avoinna oleva note (null = ei mitään)
  notes: [],                // Kaikki notet (synkronoitu storage:n kanssa)
  isDirty: false,           // Onko tallentamattomia muutoksia
  autosaveTimer: null,      // Debounce timer ID
};
```

### State Flow: Note Selection

```
User klikkaa notea listassa
        │
        ▼
bus.emit('note:select', id)
        │
        ├──► [1] Tarkista isDirty
        │         │
        │         ├─ true → Tallenna nykyinen note ensin
        │         │              │
        │         │              ▼
        │         │         Storage.saveNote(currentNote)
        │         │              │
        │         │              ▼
        │         │         isDirty = false
        │         │              │
        │         └─ false ──────┘
        │                        │
        │                        ▼
        ├──► [2] Lataa uusi note
        │         │
        │         ▼
        │    note = Storage.getNote(id)
        │         │
        │         ▼
        │    currentNoteId = id
        │         │
        │         ▼
        ├──► [3] Päivitä UI
        │         │
        │         ├──► Editor.setValue(note.content)
        │         │
        │         ├──► Preview.render(note.content)
        │         │
        │         └──► NoteList.setActive(id)
        │
        └──► [4] Tallenna lastOpenNoteId
                  │
                  ▼
             Storage.updateSettings({ lastOpenNoteId: id })
```

### State Flow: Autosave vs Manual Save

```
┌─────────────────────────────────────────────────────────────────┐
│                    SAVE LOGIC                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Editor.onChange(content)                                        │
│        │                                                         │
│        ▼                                                         │
│  isDirty = true                                                  │
│  UI.showUnsavedIndicator()                                       │
│        │                                                         │
│        ▼                                                         │
│  clearTimeout(autosaveTimer)  ← Peruuta edellinen               │
│        │                                                         │
│        ▼                                                         │
│  autosaveTimer = setTimeout(save, 2500)  ← Uusi timer           │
│        │                                                         │
│        │                                                         │
│        │    ┌─────────────────────────────────┐                 │
│        │    │  User klikkaa "Save" -nappia    │                 │
│        │    └─────────────────────────────────┘                 │
│        │                  │                                      │
│        │                  ▼                                      │
│        │         clearTimeout(autosaveTimer)                     │
│        │                  │                                      │
│        └──────────────────┼──────────────────┘                  │
│                           │                                      │
│                           ▼                                      │
│                    save() function                               │
│                           │                                      │
│                           ▼                                      │
│                  Storage.saveNote(note)                          │
│                           │                                      │
│                           ▼                                      │
│                  isDirty = false                                 │
│                  UI.hideUnsavedIndicator()                       │
│                  UI.showToast('Saved')                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Kriittiset säännöt:**

1. **Manual Save peruuttaa autosaven** - Kun käyttäjä painaa Save, `clearTimeout(autosaveTimer)` estää tupla-tallennuksen
2. **Note switch tallentaa ensin** - Ennen uuden noten latausta tallennetaan dirty note
3. **isDirty gatekeeping** - Kaikki tallennukset kulkevat saman logiikan läpi

---

## 6. Task Decomposition

### Task-01: Projektin perusrakenne

**Toteuttaa:** - (infrastruktuuri)  
**Arvio:** 1h  
**Prioriteetti:** 🟢 MVP

**Kuvaus:**
Luodaan tiedostorakenne, index.html skeleton, CSS-tiedostot pohjilla, JS-moduulit exporteilla.

**Test Scenarios:**

| TS-ID | Tyyppi | Skenaario |
|-------|--------|-----------|
| TS-01.1 | HP | index.html avautuu selaimessa ilman virheitä |
| TS-01.2 | HP | Kaikki JS-moduulit importtautuvat onnistuneesti |
| TS-01.3 | HP | CSS-tiedostot latautuvat |

**Implementation Notes:**
- ES modules (`type="module"` index.html:ssä)
- CSS importit linkkinä, ei @import (suorituskyky)

---

### Task-02: CSS Variables & Theming Foundation

**Toteuttaa:** AC-38, AC-39, AC-40, AC-41 (REQ-09)  
**Arvio:** 2h  
**Prioriteetti:** 🟢 MVP

**Kuvaus:**
CSS custom properties -järjestelmä joka mahdollistaa dark/light -teeman vaihdon yhdellä luokalla.

**Test Scenarios:**

| TS-ID | Tyyppi | Skenaario |
|-------|--------|-----------|
| TS-02.1 | HP | Light theme: body ei class → vaaleat värit |
| TS-02.2 | HP | Dark theme: body.dark → tummat värit |
| TS-02.3 | HP | prefers-color-scheme: dark → automaattisesti dark |
| TS-02.4 | HP | Teemavalinta tallentuu localStorageen |
| TS-02.5 | EC | localStorage estetty → käytetään system default |

**Implementation Notes:**
```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
  /* ... */
}

.dark {
  --bg-primary: #1a1a1a;
  --text-primary: #e5e5e5;
}

@media (prefers-color-scheme: dark) {
  :root:not(.light) { /* dark values */ }
}
```

---

### Task-03: Layout Foundation (Split-pane, Sidebar, Toolbar)

**Toteuttaa:** AC-01, AC-02, AC-03, AC-04 (REQ-01)  
**Arvio:** 4h  
**Prioriteetti:** 🟢 MVP

**Kuvaus:**
Responsiivinen layout CSS Grid + Flexbox -yhdistelmällä. Draggable divider, collapsible sidebar.

**Test Scenarios:**

| TS-ID | Tyyppi | Skenaario |
|-------|--------|-----------|
| TS-03.1 | HP | Desktop (>1024px): split-pane näkyvissä, sidebar auki |
| TS-03.2 | HP | iPad landscape (768-1024px): split-pane, sidebar collapsible |
| TS-03.3 | HP | iPad portrait / mobile (<768px): tabs (Edit/Preview), sidebar drawer |
| TS-03.4 | HP | Divider drag → ratio muuttuu reaaliajassa |
| TS-03.5 | HP | Ratio tallennetaan localStorageen |
| TS-03.6 | HP | Sivun refresh → aiempi ratio palautuu |
| TS-03.7 | EC | Divider vedetty reunaan → min 20% / max 80% |
| TS-03.8 | HP | Tab vaihto (Edit↔Preview) säilyttää scroll position |

**Implementation Notes:**
- CSS Grid: `grid-template-columns: var(--sidebar-width) var(--editor-width) var(--preview-width)`
- Touch events dividerille: `touchstart`, `touchmove`, `touchend`
- ResizeObserver breakpoint-seurantaan

---

### Task-04: Editor Integration (CodeMirror 6)

**Toteuttaa:** AC-08, AC-09, AC-10, AC-11, AC-12 (REQ-03)  
**Arvio:** 4h  
**Prioriteetti:** 🟢 MVP

**Kuvaus:**
CodeMirror 6 wrapper joka lataa CM6:n ESM-moduuleina esm.sh:sta.

**Test Scenarios:**

| TS-ID | Tyyppi | Skenaario |
|-------|--------|-----------|
| TS-04.1 | HP | Editor renderöityy containeriin |
| TS-04.2 | HP | Markdown headings (#, ##) näkyvät eri tyyleillä |
| TS-04.3 | HP | Bold (**text**) näkyy boldina editorissa |
| TS-04.4 | HP | Code fences (```) näkyvät eri taustalla |
| TS-04.5 | HP | Links [text](url) näkyvät eri värillä |
| TS-04.6 | HP | onChange callback kutsutaan kirjoitettaessa |
| TS-04.7 | HP | getValue() palauttaa nykyisen sisällön |
| TS-04.8 | HP | setValue(content) päivittää editorin |
| TS-04.9 | HP | setTheme('dark') vaihtaa värit |
| TS-04.10 | EC | Tyhjä sisältö → editor toimii normaalisti |
| TS-04.11 | EC | 100k merkin sisältö → editor pysyy responsiivisena |

**Implementation Notes:**

```javascript
// Importit (import map kautta)
import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { basicSetup } from 'codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
```

**HUOM:** `basicSetup` tulee `codemirror`-paketista, EI `@codemirror/basic-setup`:sta (joka ei ole olemassa).

**Theming (Gemini Finding #4 - virallinen EditorView.theme()):**

```javascript
// Käytetään CM6:n virallista theming-APIa, EI CSS override
const lightTheme = EditorView.theme({
  '&': {
    backgroundColor: 'var(--color-bg-primary)',
    color: 'var(--color-text-primary)'
  },
  '.cm-content': {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--font-size-base)'
  },
  '.cm-cursor': {
    borderLeftColor: 'var(--color-accent)'
  },
  '.cm-activeLine': {
    backgroundColor: 'var(--color-bg-secondary)'
  }
}, { dark: false });

const darkTheme = EditorView.theme({
  // Sama rakenne, mutta dark: true
}, { dark: true });

// Teeman vaihto reconfigure:lla
setTheme(theme) {
  const newTheme = theme === 'dark' ? darkTheme : lightTheme;
  this.view.dispatch({
    effects: this.themeCompartment.reconfigure(newTheme)
  });
}
```

**Huom:** `editor.css` sisältää vain container-tyylit, EI CM6-overrideja.

---

### Task-05: Preview Integration (marked + DOMPurify + highlight.js)

**Toteuttaa:** AC-05, AC-06, AC-07 (REQ-02), AC-13, AC-14, AC-15 (REQ-04), AC-34, AC-35, AC-36, AC-37 (REQ-08)  
**Arvio:** 3h  
**Prioriteetti:** 🟢 MVP

**Kuvaus:**
Preview wrapper joka renderöi Markdownin turvallisesti HTML:ksi.

**Test Scenarios:**

| TS-ID | Tyyppi | Skenaario |
|-------|--------|-----------|
| TS-05.1 | HP | Markdown renderöityy HTML:ksi |
| TS-05.2 | HP | Preview päivittyy jokaisella keystrokella |
| TS-05.3 | HP | Code block ```js → highlight.js väritys |
| TS-05.4 | HP | Code block ilman kieltä → auto-detect |
| TS-05.5 | HP | `<script>alert(1)</script>` → ei suoritu |
| TS-05.6 | HP | `<img onerror="alert(1)">` → onerror poistettu |
| TS-05.7 | HP | `<a onclick="alert(1)">` → onclick poistettu |
| TS-05.8 | EC | 100k merkin dokumentti → ei UI freeze (rAF throttle) |
| TS-05.9 | EC | Tyhjä sisältö → tyhjä preview |

**Implementation Notes:**

```javascript
// Importit (import map kautta)
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';

// Konfiguroi marked käyttämään highlight.js:ää
// HUOM: marked v5.0+ ei tue sisäänrakennettua highlight-optiota,
// siksi käytetään marked-highlight -laajennusta
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  }
}));

// Renderöinti
const html = marked.parse(markdown);
const clean = DOMPurify.sanitize(html);
```

---

### Task-06: Storage Module

**Toteuttaa:** AC-17, AC-24 (REQ-05), AC-43, AC-45 (REQ-10)  
**Arvio:** 2h  
**Prioriteetti:** 🟢 MVP

**Kuvaus:**
localStorage wrapper Note-entiteettien CRUD-operaatioille.

**Test Scenarios:**

| TS-ID | Tyyppi | Skenaario |
|-------|--------|-----------|
| TS-06.1 | HP | saveNote(note) → tallentuu localStorageen |
| TS-06.2 | HP | getAllNotes() → palauttaa kaikki notet |
| TS-06.3 | HP | getNote(id) → palauttaa oikean noten |
| TS-06.4 | HP | deleteNote(id) → poistaa noten |
| TS-06.5 | HP | Uusi note → generoidaan UUID |
| TS-06.6 | HP | saveNote → updatedAt päivittyy |
| TS-06.7 | HP | getSettings() / updateSettings() toimii |
| TS-06.8 | ER | localStorage disabled → isAvailable() = false |
| TS-06.9 | ER | Quota exceeded → heittää StorageError |
| TS-06.10 | ER | Korruptoitunut JSON → resetoi tyhjäksi + varoitus |

**Implementation Notes:**
- Try-catch kaikki localStorage-operaatiot
- JSON.parse virheenkäsittely

---

### Task-07: Note Management UI

**Toteuttaa:** AC-16, AC-18, AC-19, AC-20, AC-21, AC-22, AC-23 (REQ-05), AC-42, AC-44 (REQ-10)  
**Arvio:** 4h  
**Prioriteetti:** 🟢 MVP

**Kuvaus:**
Sidebar note-lista, CRUD-toiminnot, autosave-logiikka.

**Test Scenarios:**

| TS-ID | Tyyppi | Skenaario |
|-------|--------|-----------|
| TS-07.1 | HP | Note-lista näyttää kaikki notet |
| TS-07.2 | HP | Lista järjestyksessä: uusin ensin |
| TS-07.3 | HP | "New Note" luo uuden noten |
| TS-07.4 | HP | Notea klikatessa se latautuu editoriin |
| TS-07.5 | HP | Kirjoittaessa "unsaved" indikaattori näkyy |
| TS-07.6 | HP | 2-3s kirjoituksen jälkeen autosave |
| TS-07.7 | HP | Autosave jälkeen "Saved" toast |
| TS-07.8 | HP | Save-nappi pakottaa tallennuksen |
| TS-07.9 | HP | Rename toimii (⋮ menu → Rename) |
| TS-07.10 | HP | Delete näyttää confirm-dialogin |
| TS-07.11 | HP | Delete poistaa noten listasta ja storagesta |
| TS-07.12 | EC | 0 notea → "No notes yet" + "Create your first note" |
| TS-07.13 | EC | Viimeinen note poistettu → tyhjätila näkyy |

**Implementation Notes:**
- Debounce autosave: 2500ms
- "unsaved" flag komponentissa

---

### Task-08: Export HTML

**Toteuttaa:** AC-25, AC-26, AC-27, AC-28 (REQ-06)  
**Arvio:** 2h  
**Prioriteetti:** 🟢 MVP

**Kuvaus:**
HTML export itsenäisenä tiedostona inline-tyyleillä.

**Test Scenarios:**

| TS-ID | Tyyppi | Skenaario |
|-------|--------|-----------|
| TS-08.1 | HP | Export luo ladattavan .html tiedoston |
| TS-08.2 | HP | Tiedostonimi = note.title.html (sanitoitu) |
| TS-08.3 | HP | HTML sisältää inline CSS |
| TS-08.4 | HP | HTML toimii offline |
| TS-08.5 | HP | Koodiblokkien värit säilyvät |
| TS-08.6 | EC | Otsikossa erikoismerkkejä → sanitoidaan tiedostonimestä |

**Implementation Notes:**
```javascript
const blob = new Blob([htmlContent], { type: 'text/html' });
const url = URL.createObjectURL(blob);
// Trigger download
```

---

### Task-09: Export PDF (Print CSS)

**Toteuttaa:** AC-29, AC-30, AC-31, AC-32, AC-33 (REQ-07)  
**Arvio:** 3h  
**Prioriteetti:** 🟢 MVP

**Kuvaus:**
Print CSS joka tuottaa 1:1 tuloksen previewn kanssa.

**Test Scenarios:**

| TS-ID | Tyyppi | Skenaario |
|-------|--------|-----------|
| TS-09.1 | HP | "Export PDF" avaa print-dialogin |
| TS-09.2 | HP | Print-näkymässä vain preview (ei UI) |
| TS-09.3 | HP | Fontit ja värit samat kuin previewssa |
| TS-09.4 | HP | Koodiblokkien syntaksivärit näkyvät |
| TS-09.5 | HP | Code blokit eivät leikkaannu sivunvaihdossa |
| TS-09.6 | HP | iPadOS Safari: Share → Print → Save as PDF toimii |
| TS-09.7 | EC | Pitkä dokumentti → oikeat sivunvaihdot |

**Implementation Notes:**

**Print CSS (print.css):**
```css
@media print {
  .sidebar, .toolbar, .editor-pane { display: none !important; }
  .preview-pane { width: 100%; margin: 0; }
  pre { page-break-inside: avoid; }
  code { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
```

**Iframe-tekniikka (Gemini Finding #3):**

Käytetään hidden iframe -tekniikkaa varmistamaan oikean noten tulostus:
1. Luo piilotettu iframe
2. Generoi täydellinen HTML annetulle notelle (ei nykyiselle näkymälle)
3. Kirjoita HTML iframeen
4. Kutsu `iframe.contentWindow.print()`
5. Siivoa iframe tulostuksen jälkeen

Katso `export.js` API-dokumentaatio (Section 4.4) täydellisestä implementaatiosta.

---

### Task-10: App Orchestration & Init

**Toteuttaa:** AC-24 (REQ-05)  
**Arvio:** 2h  
**Prioriteetti:** 🟢 MVP

**Kuvaus:**
app.js joka yhdistää kaikki moduulit, event bus, lifecycle.

**Test Scenarios:**

| TS-ID | Tyyppi | Skenaario |
|-------|--------|-----------|
| TS-10.1 | HP | Sovellus käynnistyy ilman virheitä |
| TS-10.2 | HP | Viimeksi avattu note latautuu automaattisesti |
| TS-10.3 | HP | Jos ei noteja → tyhjä tila + ohje |
| TS-10.4 | HP | Kaikki eventit kytketty oikein |
| TS-10.5 | EC | localStorage error → sovellus toimii (ei persistenssiä) |

---

### Task-11: Unit Tests (Vitest TDD) - Gemini Finding #2

**Toteuttaa:** Testikattavuus kriittisille moduuleille  
**Arvio:** 3h  
**Prioriteetti:** 🟢 MVP

**Kuvaus:**
Vitest-pohjainen TDD-testaus kriittisille moduuleille. Noudattaa projektimme PROCESS_Testing.md -ohjeita (RGRC-sykli, Arrange-Act-Assert).

**Test Setup:**
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js']
  }
});

// tests/setup.js - Mock localStorage
const localStorageMock = {
  store: {},
  getItem: (key) => localStorageMock.store[key] || null,
  setItem: (key, value) => { localStorageMock.store[key] = value; },
  removeItem: (key) => { delete localStorageMock.store[key]; },
  clear: () => { localStorageMock.store = {}; }
};
global.localStorage = localStorageMock;
```

**Test Scenarios:**

| TS-ID | Moduuli | Tyyppi | Skenaario |
|-------|---------|--------|-----------|
| TS-11.1 | storage | HP | saveNote → tallentaa ja palauttaa UUID:n |
| TS-11.2 | storage | HP | getAllNotes → palauttaa listan updatedAt desc |
| TS-11.3 | storage | HP | deleteNote → poistaa oikean noten |
| TS-11.4 | storage | HP | saveNote päivittää updatedAt |
| TS-11.5 | storage | EC | saveNote ilman otsikkoa → 'Untitled Note' |
| TS-11.6 | storage | EC | saveNote otsikko > 100 merkkiä → katkaistaan |
| TS-11.7 | storage | ER | Quota exceeded → StorageQuotaError |
| TS-11.8 | storage | ER | Korruptoitunut JSON → resetoi + varoitus |
| TS-11.9 | preview | HP | XSS: `<script>` poistetaan |
| TS-11.10 | preview | HP | XSS: onerror poistetaan |
| TS-11.11 | preview | HP | XSS: onclick poistetaan |
| TS-11.12 | preview | HP | Markdown → HTML (perus) |
| TS-11.13 | utils | HP | generateUUID → validi UUID v4 |
| TS-11.14 | utils | HP | debounce viivästää kutsua |
| TS-11.15 | utils | HP | debounce peruuttaa edellisen |

**Esimerkki TDD-testistä (Arrange-Act-Assert):**

```javascript
// tests/storage.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { Storage } from '../js/storage.js';

describe('Storage', () => {
  let storage;
  
  beforeEach(() => {
    localStorage.clear();
    storage = new Storage();
  });
  
  describe('saveNote', () => {
    // TS-11.1: HP - saveNote tallentaa ja palauttaa UUID:n
    it('saves note and returns with UUID', () => {
      // Arrange
      const note = { title: 'Test', content: '# Hello' };
      
      // Act
      const result = storage.saveNote(note);
      
      // Assert
      expect(result.id).toMatch(/^[0-9a-f-]{36}$/);
      expect(result.title).toBe('Test');
    });
    
    // TS-11.5: EC - Ilman otsikkoa → 'Untitled Note'
    it('defaults to Untitled Note when no title', () => {
      // Arrange
      const note = { content: 'Some content' };
      
      // Act
      const result = storage.saveNote(note);
      
      // Assert
      expect(result.title).toBe('Untitled Note');
    });
  });
});
```

**Implementation Notes:**
- Asennus: `npm install -D vitest jsdom`
- Ajo: `npm test` (package.json: `"test": "vitest"`)
- Coverage: `npm run test:coverage`

---


## 7. Traceability Matrix

| REQ | AC | Task | TS | Status |
|-----|-----|------|-----|--------|
| REQ-01 | AC-01 | Task-03 | TS-03.1, TS-03.2 | 🔲 |
| REQ-01 | AC-02 | Task-03 | TS-03.3 | 🔲 |
| REQ-01 | AC-03 | Task-03 | TS-03.4, TS-03.5, TS-03.6, TS-03.7 | 🔲 |
| REQ-01 | AC-04 | Task-03 | TS-03.8 | 🔲 |
| REQ-02 | AC-05 | Task-05 | TS-05.1, TS-05.2 | 🔲 |
| REQ-02 | AC-06 | Task-05 | TS-05.8 | 🔲 |
| REQ-02 | AC-07 | Task-05 | TS-05.1 | 🔲 |
| REQ-03 | AC-08 | Task-04 | TS-04.2 | 🔲 |
| REQ-03 | AC-09 | Task-04 | TS-04.3 | 🔲 |
| REQ-03 | AC-10 | Task-04 | TS-04.4 | 🔲 |
| REQ-03 | AC-11 | Task-04 | TS-04.5 | 🔲 |
| REQ-03 | AC-12 | Task-04 | TS-04.1 | 🔲 |
| REQ-04 | AC-13 | Task-05 | TS-05.3 | 🔲 |
| REQ-04 | AC-14 | Task-05 | TS-05.4 | 🔲 |
| REQ-04 | AC-15 | Task-05 | TS-05.3 | 🔲 |
| REQ-05 | AC-16 | Task-07 | TS-07.3 | 🔲 |
| REQ-05 | AC-17 | Task-06, Task-07 | TS-06.1, TS-07.6 | 🔲 |
| REQ-05 | AC-18 | Task-07 | TS-07.5 | 🔲 |
| REQ-05 | AC-19 | Task-07 | TS-07.8 | 🔲 |
| REQ-05 | AC-20 | Task-07 | TS-07.9 | 🔲 |
| REQ-05 | AC-21 | Task-07 | TS-07.10, TS-07.11 | 🔲 |
| REQ-05 | AC-22 | Task-07 | TS-07.1, TS-07.2 | 🔲 |
| REQ-05 | AC-23 | Task-07 | TS-07.4 | 🔲 |
| REQ-05 | AC-24 | Task-06, Task-10 | TS-06.7, TS-10.2 | 🔲 |
| REQ-06 | AC-25 | Task-08 | TS-08.1 | 🔲 |
| REQ-06 | AC-26 | Task-08 | TS-08.3, TS-08.4 | 🔲 |
| REQ-06 | AC-27 | Task-08 | TS-08.5 | 🔲 |
| REQ-06 | AC-28 | Task-08 | TS-08.2 | 🔲 |
| REQ-07 | AC-29 | Task-09 | TS-09.1 | 🔲 |
| REQ-07 | AC-30 | Task-09 | TS-09.2, TS-09.3 | 🔲 |
| REQ-07 | AC-31 | Task-09 | TS-09.4 | 🔲 |
| REQ-07 | AC-32 | Task-09 | TS-09.5 | 🔲 |
| REQ-07 | AC-33 | Task-09 | TS-09.6 | 🔲 |
| REQ-08 | AC-34 | Task-05 | TS-05.5 | 🔲 |
| REQ-08 | AC-35 | Task-05 | TS-05.5 | 🔲 |
| REQ-08 | AC-36 | Task-05 | TS-05.6, TS-05.7 | 🔲 |
| REQ-08 | AC-37 | Task-05 | TS-05.6, TS-05.7 | 🔲 |
| REQ-09 | AC-38 | Task-02 | TS-02.1, TS-02.2 | 🔲 |
| REQ-09 | AC-39 | Task-02 | TS-02.4 | 🔲 |
| REQ-09 | AC-40 | Task-02 | TS-02.1, TS-02.2 | 🔲 |
| REQ-09 | AC-41 | Task-02 | TS-02.3 | 🔲 |
| REQ-10 | AC-42 | Task-07 | TS-07.7 | 🔲 |
| REQ-10 | AC-43 | Task-06 | TS-06.8, TS-06.9 | 🔲 |
| REQ-10 | AC-44 | Task-07 | TS-07.12, TS-07.13 | 🔲 |
| REQ-10 | AC-45 | Task-06 | TS-06.10 | 🔲 |

**Status:** ✅ Valmis | 🔶 Työn alla | 🔲 Ei aloitettu

---

## 8. Task Summary

| Task | Kuvaus | AC:t | Arvio | Prioriteetti | Riippuvuudet | Status |
|------|--------|------|-------|--------------|--------------|--------|
| Task-01 | Projektin perusrakenne | - | 1h | 🟢 MVP | - | 🔲 |
| Task-02 | CSS Variables & Theming | AC-38,39,40,41 | 2h | 🟢 MVP | Task-01 | 🔲 |
| Task-03 | Layout Foundation | AC-01,02,03,04 | 4h | 🟢 MVP | Task-01, Task-02 | 🔲 |
| Task-04 | Editor (CodeMirror 6) | AC-08,09,10,11,12 | 4h | 🟢 MVP | Task-01, Task-03 | 🔲 |
| Task-05 | Preview (marked+purify) | AC-05,06,07,13,14,15,34,35,36,37 | 3h | 🟢 MVP | Task-01, Task-03 | 🔲 |
| Task-06 | Storage Module | AC-17,24,43,45 | 2h | 🟢 MVP | Task-01 | 🔲 |
| Task-07 | Note Management UI | AC-16,18,19,20,21,22,23,42,44 | 4h | 🟢 MVP | Task-03, Task-04, Task-05, Task-06 | 🔲 |
| Task-08 | Export HTML | AC-25,26,27,28 | 2h | 🟢 MVP | Task-05 | 🔲 |
| Task-09 | Export PDF (Print CSS) | AC-29,30,31,32,33 | 3h | 🟢 MVP | Task-05 | 🔲 |
| Task-10 | App Orchestration | AC-24 | 2h | 🟢 MVP | Task-04, Task-05, Task-06, Task-07 | 🔲 |
| Task-11 | Unit Tests (Vitest) | - | 3h | 🟢 MVP | Task-05, Task-06 | 🔲 |

**Yhteensä MVP:** 30h (päivitetty Gemini Review jälkeen, +3h testit)

### Toteutusjärjestys (kriittinen polku)

```
Task-01 (Perusrakenne)
    │
    ├──► Task-02 (Theming) ──► Task-03 (Layout)
    │                              │
    │                              ├──► Task-04 (Editor)
    │                              │
    │                              └──► Task-05 (Preview) ──► Task-08 (HTML Export)
    │                                       │                      │
    │                                       └──► Task-09 (PDF) ◄───┘
    │
    └──► Task-06 (Storage)
              │
              └──► Task-07 (Note Management)
                        │
                        └──► Task-10 (App Orchestration)
```

**Suositeltu toteutusjärjestys:**
1. Task-01 → Task-02 → Task-06 (parallel track 1)
2. Task-03 → Task-04 + Task-05 (parallel track 2)
3. Task-07 (yhdistää trackit)
4. Task-08 + Task-09 (parallel)
5. Task-10 (viimeistely)

---

## 9. CSS Architecture

### 9.1 Tiedostojako

| Tiedosto | Vastuu | Koko (arvio) |
|----------|--------|--------------|
| variables.css | Värit, spacing, typography | ~100 lines |
| layout.css | Grid, split-pane, sidebar | ~200 lines |
| editor.css | CodeMirror overrides | ~100 lines |
| preview.css | Markdown rendered content | ~150 lines |
| components.css | Buttons, toasts, dialogs | ~150 lines |
| print.css | @media print | ~50 lines |

### 9.2 CSS Variables (variables.css)

```css
:root {
  /* Colors - Light theme (default) */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f5f5f5;
  --color-bg-tertiary: #e5e5e5;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #666666;
  --color-text-muted: #999999;
  --color-border: #e0e0e0;
  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
  --color-success: #16a34a;
  --color-error: #dc2626;
  --color-warning: #d97706;
  
  /* Typography */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Layout */
  --sidebar-width: 280px;
  --toolbar-height: 56px;
  --divider-width: 8px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
}

/* Dark theme overrides */
.dark {
  --color-bg-primary: #1a1a1a;
  --color-bg-secondary: #262626;
  --color-bg-tertiary: #333333;
  --color-text-primary: #e5e5e5;
  --color-text-secondary: #a3a3a3;
  --color-text-muted: #737373;
  --color-border: #404040;
  --color-accent: #3b82f6;
  --color-accent-hover: #60a5fa;
}

/* System preference detection */
@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    --color-bg-primary: #1a1a1a;
    /* ... sama kuin .dark */
  }
}
```

### 9.3 Responsive Breakpoints

```css
/* Mobile first approach */

/* Base: Mobile (<768px) */
.main-layout {
  grid-template-columns: 1fr;
  grid-template-rows: var(--toolbar-height) 1fr;
}

/* Tablet (≥768px) */
@media (min-width: 768px) {
  .main-layout {
    grid-template-columns: var(--sidebar-width) 1fr;
  }
}

/* Desktop (≥1024px) */
@media (min-width: 1024px) {
  .main-layout {
    grid-template-columns: var(--sidebar-width) 1fr 1fr;
  }
}
```

---

## 10. Error Handling Strategy

### 10.1 Error Types

```javascript
// errors.js
export class ACEError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'ACEError';
    this.code = code;
  }
}

export class StorageError extends ACEError {
  constructor(message) {
    super(message, 'STORAGE_ERROR');
    this.name = 'StorageError';
  }
}

export class StorageQuotaError extends StorageError {
  constructor() {
    super('Storage quota exceeded. Delete old notes to continue.');
    this.code = 'STORAGE_QUOTA';
  }
}

export class StorageDisabledError extends StorageError {
  constructor() {
    super('Local storage is disabled. Notes will not persist.');
    this.code = 'STORAGE_DISABLED';
  }
}

export class ExportError extends ACEError {
  constructor(message) {
    super(message, 'EXPORT_ERROR');
    this.name = 'ExportError';
  }
}
```

### 10.2 Error Handling Matrix

| Virhe | Mistä | Käsittely | Käyttäjäviesti |
|-------|-------|-----------|----------------|
| localStorage disabled | Storage.isAvailable() | Warn + continue | Toast: "Storage disabled..." |
| Quota exceeded | Storage.saveNote() | Prevent save | Toast: "Storage full..." |
| JSON parse error | Storage.getAllNotes() | Reset + warn | Toast: "Data corrupted..." |
| Export failed | Exporter.exportHTML() | Show error | Toast: "Export failed..." |
| CDN load failed | Dynamic import | Graceful degrade | Alert: "Failed to load..." |

---

## 11. Testing Strategy

### 11.1 Testaustyyppi

Tässä projektissa käytetään **manuaalista testausta** koska:
- Pieni projekti (yhden henkilön)
- UI-intensiivinen (visuaalinen tarkistus tärkeä)
- iPad-testaus vaatii oikeaa laitetta
- Ei CI/CD-putkea

### 11.2 Testaus Checklist (per Task)

Jokaisen taskin valmistuttua:

```markdown
## Task-XX Testing Checklist

### Desktop (Chrome/Firefox)
- [ ] TS-XX.1: [Kuvaus] - ✅/❌
- [ ] TS-XX.2: [Kuvaus] - ✅/❌

### iPad Safari (12.9")
- [ ] Landscape: [Toimii] - ✅/❌
- [ ] Portrait: [Toimii] - ✅/❌
- [ ] Touch: [Divider drag, scroll] - ✅/❌

### Mobile (Safari/Chrome)
- [ ] Layout: [Tabs toimii] - ✅/❌
```

### 11.3 Testausdata

```javascript
// test-data.js (manuaalinen testaus)
export const testNotes = [
  {
    title: 'Short note',
    content: '# Hello\n\nWorld'
  },
  {
    title: 'Code blocks',
    content: '```javascript\nconst x = 1;\nconsole.log(x);\n```'
  },
  {
    title: 'Long note (performance)',
    content: '# Test\n\n' + 'Lorem ipsum... '.repeat(10000)
  },
  {
    title: 'XSS test',
    content: '<script>alert(1)</script>\n<img onerror="alert(1)" src="x">'
  },
  {
    title: 'Special chars: <>&"\'',
    content: 'Test: äöå ÄÖÅ € 日本語 🎉'
  }
];
```

---

## 12. Definition of Done

### Task-taso

- [ ] Kaikki Test Scenariot testattu manuaalisesti
- [ ] Toimii Desktop Chrome/Firefox
- [ ] Toimii iPad Safari (landscape + portrait)
- [ ] Koodi kommentoitu
- [ ] Ei console.error -virheitä

### Moduulitaso (koko MVP)

- [ ] Kaikki 11 taskia valmiita
- [ ] Unit testit läpäisty (Task-11)
- [ ] iPad 12.9" -testaus läpäisty
- [ ] Desktop-testaus läpäisty
- [ ] Mobile-testaus läpäisty
- [ ] Export toimii (HTML + PDF)
- [ ] Dark/Light theme toimii
- [ ] Data persistoituu refreshin yli
- [ ] Ei tietoturvaongelmia (XSS)

---

## Muutoshistoria

| Versio | Päivämäärä | Muutokset |
|--------|------------|-----------|
| 1.2 | 2026-01-05 | **Claude Review -korjaukset:** CM6 import path korjattu (basicSetup tulee codemirror-paketista), marked-highlight lisätty (marked v5.0+ ei tue highlight-optiota), Import Map yhtenäistetty esm.sh:lle, Application State ja State Flow dokumentoitu (5.1), Autosave vs Manual Save -logiikka kuvattu |
| 1.1 | 2026-01-05 | **Gemini Review -korjaukset:** CDN versiolukitus + import map (#1), Task-11 Unit Tests (#2), PDF iframe-tekniikka (#3), CM6 EditorView.theme() (#4), Note edge cases (#5), Event bus try-catch (bonus) |
| 1.0 | 2026-01-05 | Ensimmäinen versio |

---

## Liittyvät dokumentit

| Dokumentti | Yhteys |
|------------|--------|
| SPEC_01_ACE_Markdown_Editor.md | Toiminnallinen määrittely |
| REVIEW_Gemini_TECH_SPEC_01.md | Gemini AI:n arkkitehtuurikatselmointi |
| INDEX.md | Projektin navigointi |
| KEHITYSLOKI.md | Edistymisen seuranta |

---

*Dokumentti on osa ACE Markdown Editor -projektin dokumentaatiota.*
