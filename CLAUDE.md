# CLAUDE.md - Project Instructions for Claude Code

> **Project:** ACE Markdown Editor
> **Version:** 1.0
> **Updated:** 2026-01-05

---

## CRITICAL RULES

```
┌─────────────────────────────────────────────────────────────────┐
│  1. iPad-FIRST DESIGN                                           │
│     - Ensisijainen alusta: iPad 12.9" (landscape + portrait)    │
│     - Touch-tuki PAKOLLINEN kaikissa interaktioissa             │
│     - Testaa iPadilla ENNEN desktopin optimointia               │
│                                                                 │
│  2. ES MODULES + CDN (esm.sh)                                   │
│     - KAIKKI kirjastot esm.sh:sta versiolukittuina              │
│     - Import Map index.html:ssä - ÄLÄ käytä suoria URL:ja       │
│     - EI bundleria (Vite, Webpack) - natiivi ES modules         │
│                                                                 │
│  3. VANILLA JS - EI FRAMEWORKIA                                 │
│     - Ei React, Vue, Svelte                                     │
│     - Wrapper pattern ulkoisille kirjastoille                   │
│     - Event bus moduulien kommunikaatioon                       │
│                                                                 │
│  4. localStorage RAJOITUKSET                                    │
│     - Max ~5MB - varaudu QuotaExceededError:iin                 │
│     - Synkroninen API - voi blokata UI:n isoilla dokumenteilla  │
│     - JSON.parse try-catch AINA                                 │
└─────────────────────────────────────────────────────────────────┘
```

**NEVER:**
- Käytä frameworkia (React, Vue, Svelte)
- Hardkoodaa CDN-URL:ja JS-tiedostoihin (käytä import mappia)
- Unohda touch event -tukea (touchstart, touchmove, touchend)
- Luota localStorage:n saatavuuteen (private browsing estää)
- Skipattu XSS-sanitointia (DOMPurify AINA ennen innerHTML:ää)

---

## Project Context

### What Is This?

iPad-first Markdown-muistiinpanoeditori reaaliaikaisella esikatselulla. Kaikki toimii client-side ilman backendiä.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                           index.html                            │
│                    (Entry point, import map)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         app.js (Orchestrator)                   │
│            Event bus, state management, lifecycle               │
├──────────┬──────────┬──────────┬──────────┬────────────────────┤
│ editor.js│preview.js│storage.js│ export.js│      ui.js         │
│ (CM6)    │ (marked) │(lStorage)│(Blob/PDF)│ (DOM/CSS vars)     │
└──────────┴──────────┴──────────┴──────────┴────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External Libraries (esm.sh CDN)            │
│  codemirror │ marked │ marked-highlight │ highlight.js │ DOMPurify
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component | Choice | Notes |
|-----------|--------|-------|
| Editor | CodeMirror 6 | esm.sh CDN |
| Markdown | marked.js + marked-highlight | v15.0.6 |
| Code highlighting | highlight.js | v11.11.1 |
| XSS protection | DOMPurify | v3.2.4 |
| Storage | localStorage | 5MB limit |
| Modules | ES Modules | Import map |
| Styling | CSS Custom Properties | Theming |

---

## Session Startup

Read these documents at the start of each session:

```
1. KEHITYSLOKI.md        → Missä mennään? Mikä on seuraava task?
2. INDEX.md              → Dokumenttien navigointi
3. TECH_SPEC_01          → Taskien yksityiskohdat, test scenariot
4. SPEC_01               → Vaatimukset ja acceptance criteriat
```

**Quick check:**
```bash
git status              # Uncommitted muutoksia?
```

---

## Project Structure

```
ace-markdown-editor/
├── index.html              # Entry point, import map
├── css/
│   ├── variables.css       # CSS custom properties
│   ├── layout.css          # Grid, split-pane
│   ├── editor.css          # CodeMirror container
│   ├── preview.css         # Rendered markdown
│   ├── components.css      # Buttons, toasts
│   └── print.css           # @media print
├── js/
│   ├── app.js              # Orchestrator, event bus
│   ├── editor.js           # CodeMirror 6 wrapper
│   ├── preview.js          # marked + DOMPurify wrapper
│   ├── storage.js          # localStorage wrapper
│   ├── export.js           # HTML & PDF export
│   ├── ui.js               # Layout, theme, toasts
│   └── utils.js            # UUID, debounce
├── claude-project/
│   ├── INDEX.md            # Document navigation
│   └── KEHITYSLOKI.md      # Session history
├── docs/
│   ├── SPEC_01_*.md        # Functional spec
│   ├── TECH_SPEC_01_*.md   # Technical spec (v1.2)
│   └── process/            # Process guides
└── CLAUDE.md               # This file
```

---

## Import Map (Authoritative Source)

All library imports MUST use import map aliases. Never use direct URLs in JS files.

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

**Usage in JS:**
```javascript
// ✅ CORRECT - use import map alias
import { marked } from 'marked';
import { basicSetup } from 'codemirror';

// ❌ WRONG - direct URL
import { marked } from 'https://esm.sh/marked@15.0.6';
```

---

## CodeMirror 6 Patterns

### Correct Import Pattern

```javascript
// ✅ CORRECT
import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { basicSetup } from 'codemirror';  // NOT @codemirror/basic-setup!
import { markdown } from '@codemirror/lang-markdown';
```

### Theming (Use Official API)

```javascript
// ✅ CORRECT - EditorView.theme()
const lightTheme = EditorView.theme({
  '&': { backgroundColor: 'var(--color-bg-primary)' },
  '.cm-content': { fontFamily: 'var(--font-mono)' }
}, { dark: false });

// ❌ WRONG - CSS overrides (fragile)
.cm-editor { background: white; }
```

---

## Marked + Highlight.js Pattern

marked v5.0+ requires `marked-highlight` extension:

```javascript
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  }
}));
```

**NEVER use deprecated pattern:**
```javascript
// ❌ WRONG - removed in marked v5.0
marked.setOptions({ highlight: (code, lang) => ... });
```

---

## XSS Protection

**MANDATORY for all user content:**

```javascript
import DOMPurify from 'dompurify';

// ✅ ALWAYS sanitize before innerHTML
const html = marked.parse(userMarkdown);
const clean = DOMPurify.sanitize(html);
previewElement.innerHTML = clean;

// ❌ NEVER direct assignment
previewElement.innerHTML = marked.parse(userMarkdown);
```

---

## localStorage Patterns

### Safe Read

```javascript
function loadNotes() {
  try {
    const json = localStorage.getItem('ace_md_notes_v1');
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Storage corrupted, resetting');
    localStorage.removeItem('ace_md_notes_v1');
    return [];
  }
}
```

### Safe Write

```javascript
function saveNote(note) {
  try {
    const notes = loadNotes();
    // ... update notes array
    localStorage.setItem('ace_md_notes_v1', JSON.stringify(notes));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      showToast('Storage full. Delete old notes.', 'error');
    }
    throw e;
  }
}
```

---

## Touch Event Support

All draggable/interactive elements need touch support:

```javascript
// Divider drag
divider.addEventListener('mousedown', startDrag);
divider.addEventListener('touchstart', startDrag, { passive: false });

function startDrag(e) {
  e.preventDefault();
  const move = e.type === 'touchstart' ? 'touchmove' : 'mousemove';
  const end = e.type === 'touchstart' ? 'touchend' : 'mouseup';

  document.addEventListener(move, onDrag);
  document.addEventListener(end, stopDrag);
}
```

---

## Testing Strategy

### Manual Testing Checklist (per Task)

```
□ Desktop Chrome/Firefox
□ iPad Safari (landscape)
□ iPad Safari (portrait)
□ Mobile Safari/Chrome
□ Touch interactions work
□ Theme toggle works
□ Data persists after refresh
```

### Vitest Unit Tests (Task-11)

Testataan kriittiset moduulit:
- `storage.js` - CRUD, quota handling
- `preview.js` - XSS sanitization
- `utils.js` - UUID, debounce

---

## Global Skills Available

Use these skills when applicable:

| Skill | When to Use |
|-------|-------------|
| `tdd-enhanced` | Implementing features (RGRC cycle) |
| `systematic-debugging-enhanced` | Bug investigation (4 phases) |
| `verification-enhanced` | Before commits ("Evidence before claims") |

---

## Commit Conventions

```bash
# Format
<type>(scope): description

# Types
feat     # New feature
fix      # Bug fix
test     # Tests
refactor # Code restructuring
docs     # Documentation
style    # CSS/formatting
chore    # Build, deps

# Examples
feat(editor): implement CodeMirror 6 wrapper (Task-04)
fix(storage): handle QuotaExceededError gracefully
test(preview): add XSS sanitization tests (TS-05.5-07)
```

---

## Anti-Patterns to Avoid

| Anti-Pattern | Correct Approach |
|--------------|------------------|
| Direct CDN URLs in JS | Use import map aliases |
| `marked.setOptions({highlight})` | Use `marked-highlight` extension |
| `@codemirror/basic-setup` | Use `codemirror` package |
| CSS overrides for CM6 | Use `EditorView.theme()` |
| `innerHTML = userContent` | Always DOMPurify.sanitize() |
| Sync localStorage with big data | Consider chunking or warn user |
| Mouse-only interactions | Add touch events |
| Desktop-first design | iPad-first, then adapt |

---

## Language Convention

| Context | Language |
|---------|----------|
| Conversation | Finnish |
| Documentation | Finnish (mostly) |
| Code | English |
| Comments | English |
| Commit messages | English |
| Variable/function names | English |

---

## Quick Reminders

```
✅ iPad-first - testaa touch-toiminnot
✅ Import map - ei suoria CDN-URL:ja JS:ssä
✅ DOMPurify - AINA ennen innerHTML:ää
✅ localStorage try-catch - aina
✅ marked-highlight - ei setOptions({highlight})
✅ codemirror - ei @codemirror/basic-setup
✅ EditorView.theme() - ei CSS overrideja CM6:lle
✅ Touch events - kaikki interaktiiviset elementit
```

---

## Documentation

| Document | Path | Content |
|----------|------|---------|
| SPEC | docs/SPEC_01_ACE_Markdown_Editor.md | 10 REQ, 45 AC |
| TECH_SPEC | docs/TECH_SPEC_01_ACE_Markdown_Editor.md | 11 tasks, v1.2 |
| INDEX | claude-project/INDEX.md | Navigation |
| KEHITYSLOKI | claude-project/KEHITYSLOKI.md | Session history |

---

*This file is read automatically by Claude Code at session start.*
*Project: ACE Markdown Editor - iPad-first Markdown notes app*
