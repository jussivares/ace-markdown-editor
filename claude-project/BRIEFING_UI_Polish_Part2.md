# BRIEFING: UI Polish Part 2 - Emoji Variety & Floating Preview

> **Session:** #4 (continued)  
> **Priority:** P2 (Visual Polish)  
> **Estimated Time:** 1-2h  
> **Type:** UI enhancements

---

## 📋 Yhteenveto

Kaksi visuaalista parannusta:
1. **Emoji-kuvakkeet** - Satunnaisvalikoima eri emojeja note-korteissa
2. **Kelluva preview-paneeli** - Pyöristetty laatikko joka "kelluu" layoutin päällä

---

## 🎨 1. Satunnaiset Note-emojit

**Ongelma:** Kaikissa noteissa sama 📝 emoji - tylsää.

**Ratkaisu:** Generoidaan konsistentti emoji note ID:n perusteella (sama note = sama emoji aina).

### Tiedosto: `js/app.js`

**PATCH 1 - Lisää emoji-lista ja valintafunktio (tiedoston alkuun, importtien jälkeen):**

```javascript
// Note emoji palette - cozy/creative vibes
const NOTE_EMOJIS = [
  '📝', '✏️', '📒', '📓', '📔', '📕', '📖', '📚',
  '💡', '✨', '🎯', '🎨', '🖊️', '📌', '🗒️', '💭',
  '🌟', '🔖', '📎', '🗂️', '✍️', '💫', '🌸', '🍂'
];

/**
 * Get consistent emoji for note (based on id hash)
 * Same note always gets same emoji
 * @param {string} noteId
 * @returns {string}
 */
function getNoteEmoji(noteId) {
  let hash = 0;
  for (let i = 0; i < noteId.length; i++) {
    hash = ((hash << 5) - hash) + noteId.charCodeAt(i);
    hash = hash & hash;
  }
  return NOTE_EMOJIS[Math.abs(hash) % NOTE_EMOJIS.length];
}
```

**PATCH 2 - Päivitä renderNoteList:**

```javascript
// ETSI:
<div class="note-emoji">📝</div>

// KORVAA:
<div class="note-emoji">${getNoteEmoji(note.id)}</div>
```

---

## 🪟 2. Kelluva Preview-paneeli

**Ongelma:** Preview-paneelin pyöristetty vasen yläkulma leikkautuu toolbarin/dividerin takia.

**Ratkaisu:** Preview-paneeli "kelluu" - marginaali ympärillä, pyöristetyt kulmat kaikkialla, varjo syvyyden luomiseksi.

### Tiedosto: `css/layout.css`

**PATCH - Korvaa .preview-pane säännöt:**

```css
.preview-pane {
  overflow-y: auto;
  padding: var(--space-8);
  background-color: var(--color-bg-elevated);
  display: none;
  /* Floating island effect */
  border-radius: var(--radius-3xl);
}

/* Tablet+ floating preview */
@media (min-width: 768px) {
  .preview-pane {
    /* Floating margins */
    margin: var(--space-3);
    margin-left: 0;
    /* Depth shadow */
    box-shadow: 
      0 4px 6px rgba(0, 0, 0, 0.07),
      0 10px 24px rgba(0, 0, 0, 0.15);
  }
}

/* Desktop - more pronounced float */
@media (min-width: 1024px) {
  .preview-pane {
    margin: var(--space-4);
    margin-left: 0;
    box-shadow: 
      0 4px 6px rgba(0, 0, 0, 0.07),
      0 12px 28px rgba(0, 0, 0, 0.18);
  }
  
  /* Compensate grid for floating margin */
  .main-layout {
    padding-right: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
}
```

**HUOM:** Jos grid-layout rikkoutuu, kokeile lisätä main-layoutiin:

```css
@media (min-width: 1024px) {
  .main-layout {
    /* Adjust grid to account for floating preview margin */
    gap: 0;
  }
  
  .preview-pane {
    /* Self-contained floating */
    position: relative;
    margin: var(--space-4);
    margin-left: var(--space-2);
  }
}
```

---

## 📁 Muutettavat tiedostot

| Tiedosto | Muutokset |
|----------|-----------|
| `js/app.js` | NOTE_EMOJIS[], getNoteEmoji(), renderNoteList() |
| `css/layout.css` | .preview-pane floating effect |

---

## ✅ Definition of Done

- [ ] Note-korteissa vaihtelevat emojit (📝 ✨ 💡 📒 jne.)
- [ ] Sama note = sama emoji (konsistentti hash-perusteinen)
- [ ] Preview-paneeli "kelluu" - pyöristetyt kulmat näkyvät kaikilla sivuilla
- [ ] Marginaali erottaa previewin muusta layoutista
- [ ] Shadow antaa syvyyttä ("floating card" -efekti)
- [ ] Testaa tablet + desktop
- [ ] Commit: "UI: varied note emojis + floating preview pane"

---

## 🎨 Visuaalinen tavoite

```
┌──────────────────────────────────────────────────────────┐
│  ☰  ACE Markdown Editor                    HTML PDF 🌙   │
├──────────────┬───────────────────────────────────────────┤
│              │                                           │
│  + New Note  │  Editor area           ╭─────────────────╮│
│              │  (code)                │                 ││
│  RECENT      │                        │  Floating       ││
│              │                        │  Preview        ││
│  📝 Note 1   │                        │                 ││
│  ✨ Note 2   │                        │  (shadow +      ││
│  💡 Note 3   │                        │   rounded)      ││
│  🎨 Note 4   │                        │                 ││
│              │                        ╰─────────────────╯│
└──────────────┴───────────────────────────────────────────┘
                                        ↑
                                   Kelluva laatikko
                                   kaikki kulmat pyöristetty
```

---

## 🔄 HANDOFF

Toteuta molemmat parannukset. Emojit ovat suoraviivaisia (hash-funktio). Kelluva preview vaatii ehkä CSS-kokeilua grid-layoutin kanssa - testaa eri marginaali-arvoja.

---

*Briefing - Session #4 Part 2*
