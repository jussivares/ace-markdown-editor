# BRIEFING: UI Polish - Mockup → Implementation Fixes

> **Session:** #4  
> **Priority:** P1 (Visual Polish)  
> **Estimated Time:** 2-3h  
> **Type:** Bug fixes + UI enhancements

---

## 📋 Yhteenveto

Mockup vs. toteutus -vertailu paljasti useita eroja. Tämä briefing sisältää tarkat patchit korjauksiin.

**Referenssi-mockup:** Warm Notes Dark (claude.ai artifact, Session #3)

---

## 🔴 KRIITTISET KORJAUKSET (Must Fix)

### 1. Note-korteista puuttuu emoji-ikoni

**Ongelma:** Mockupissa jokaisella note-kortilla on emoji (📝), toteutuksessa ei.

**Tiedosto:** `js/app.js`

**PATCH:**
```javascript
// ETSI (rivi ~380):
container.innerHTML = state.notes.map(note => `
  <div class="note-item${note.id === state.currentNoteId ? ' active' : ''}" data-note-id="${note.id}">
    <div class="note-item-content">
      <div class="note-title">${escapeHtml(note.title)}</div>
      <div class="note-date">${formatDate(note.updatedAt)}</div>
    </div>
    <button class="note-delete-btn" data-note-id="${note.id}" aria-label="Delete note">✕</button>
  </div>
`).join('');

// KORVAA:
container.innerHTML = state.notes.map(note => `
  <div class="note-item${note.id === state.currentNoteId ? ' active' : ''}" data-note-id="${note.id}">
    <div class="note-emoji">📝</div>
    <div class="note-item-content">
      <div class="note-title">${escapeHtml(note.title)}</div>
      <div class="note-preview">${escapeHtml(extractPreview(note.content))}</div>
      <div class="note-date">${formatDate(note.updatedAt)}</div>
    </div>
    <button class="note-delete-btn" data-note-id="${note.id}" aria-label="Delete note">✕</button>
  </div>
`).join('');
```

**Lisää uusi funktio `app.js`:iin (extractTitle:n jälkeen):**
```javascript
/**
 * Extract preview text from content (first non-title line)
 * @param {string} content
 * @returns {string}
 */
function extractPreview(content) {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip empty lines and title lines
    if (trimmed.length === 0) continue;
    if (trimmed.startsWith('#')) continue;
    // Return first content line, truncated
    return trimmed.slice(0, 60) + (trimmed.length > 60 ? '...' : '');
  }
  return '';
}
```

---

### 2. Note-kortin CSS puuttuu (emoji + preview)

**Tiedosto:** `css/components.css`

**PATCH - Lisää .note-item sääntöjen perään:**
```css
/* Note emoji icon */
.note-emoji {
  font-size: 1.25rem;
  line-height: 1;
  flex-shrink: 0;
  width: 28px;
  text-align: center;
  padding-top: 2px;
}

/* Note preview text */
.note-preview {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: var(--space-1);
  margin-bottom: var(--space-1);
}

.note-item.active .note-preview {
  color: var(--color-text-secondary);
}
```

---

### 3. "Recent" section header puuttuu sidebarista

**Ongelma:** Mockupissa on "Recent" otsikko note-listan yläpuolella.

**Tiedosto:** `index.html`

**PATCH:**
```html
<!-- ETSI: -->
<div class="note-list" id="note-list">
  <!-- Notes rendered dynamically -->
</div>

<!-- KORVAA: -->
<div class="sidebar-section-header">Recent</div>
<div class="note-list" id="note-list">
  <!-- Notes rendered dynamically -->
</div>
```

**Tiedosto:** `css/components.css`

**PATCH - Lisää:**
```css
/* Sidebar section header */
.sidebar-section-header {
  padding: var(--space-3) var(--space-5);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

## 🟡 TÄRKEÄT PARANNUKSET (Should Fix)

### 4. Sidebar footer puuttuu ("Jussi's Notes")

**Ongelma:** Mockupissa on footer user-tiedoilla, toteutuksessa ei.

**Tiedosto:** `index.html`

**PATCH - Lisää note-list:n jälkeen:**
```html
<div class="note-list" id="note-list">
  <!-- Notes rendered dynamically -->
</div>

<!-- LISÄÄ: -->
<div class="sidebar-footer">
  <div class="sidebar-footer-avatar">J</div>
  <div class="sidebar-footer-text">Jussi's Notes</div>
</div>
```

**Tiedosto:** `css/components.css`

**PATCH - Lisää:**
```css
/* Sidebar footer */
.sidebar-footer {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}

.sidebar-footer-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background-color: var(--color-accent);
  color: var(--color-accent-text);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
}

.sidebar-footer-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}
```

---

### 5. Empty state teksti päivitys

**Tiedosto:** `js/app.js`

**PATCH:**
```javascript
// ETSI:
container.innerHTML = '<div class="note-list-empty">No notes yet.<br>Click "New Note" to start.</div>';

// KORVAA:
container.innerHTML = '<div class="note-list-empty">No notes yet<br><span style="font-size: var(--font-size-xs);">Click + New Note to create one</span></div>';
```

---

## 🟢 JATKOKEHITYS (V2 - Nice to Have)

### 6. Search bar (V2)

**Tiedosto:** `index.html`

**Sijainti:** Sidebar-header:n jälkeen

```html
<div class="sidebar-search">
  <input type="text" placeholder="Search notes..." class="search-input" id="search-input">
</div>
```

**CSS:**
```css
.sidebar-search {
  padding: 0 var(--space-4) var(--space-4);
}

.search-input {
  width: 100%;
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  font-family: var(--font-sans);
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-subtle);
}
```

**JS:** Implementoi Task-09 (Search) yhteydessä.

---

### 7. macOS-tyylinen code block (V2)

Preview:ssä code blockeilla macOS-tyylinen header 🔴🟡🟢 palloilla.

```css
/* preview.css - Code block enhancement */
.preview pre {
  position: relative;
  padding-top: calc(var(--space-8) + var(--space-4));
}

.preview pre::before {
  content: '';
  position: absolute;
  top: var(--space-3);
  left: var(--space-4);
  width: 12px;
  height: 12px;
  border-radius: var(--radius-full);
  background-color: #ff5f56;
  box-shadow: 
    20px 0 0 #ffbd2e,
    40px 0 0 #27ca40;
}
```

---

## 📁 Muutettavat tiedostot yhteenveto

| Tiedosto | Muutokset |
|----------|-----------|
| `js/app.js` | extractPreview(), renderNoteList() |
| `css/components.css` | .note-emoji, .note-preview, .sidebar-section-header, .sidebar-footer |
| `index.html` | Recent header, sidebar footer |

---

## ✅ Definition of Done

- [ ] Note-korteissa näkyy emoji (📝)
- [ ] Note-korteissa näkyy preview-teksti
- [ ] "Recent" otsikko näkyy sidebarissa
- [ ] Sidebar footer näkyy ("Jussi's Notes")
- [ ] Empty state teksti päivitetty
- [ ] Testaa desktop + mobile näkymät
- [ ] Commit: "UI polish: sidebar improvements per mockup"

---

## 🔄 HANDOFF

**Session #4 valmis.** Toteuta kriittiset korjaukset (kohdat 1-5). Sidebar tarvitsee: note-emojit 📝, preview-tekstit, "Recent"-otsikon ja footer "Jussi's Notes". Patchit ovat copy-paste -valmiita.

---

*Briefing generated by Claude.ai Session #4*
