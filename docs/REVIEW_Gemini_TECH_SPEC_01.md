# Gemini Review: TECH_SPEC_01

> **Päivämäärä:** 2026-01-05  
> **Reviewer:** Gemini 2.5 Pro (via MCP)  
> **Dokumentti:** TECH_SPEC_01_ACE_Markdown_Editor.md v1.0  
> **Status:** ✅ Kaikki löydökset käsitelty

---

## Yhteenveto

Gemini suoritti arkkitehtuurikatselmoinnin TECH_SPEC_01:lle. Katselmointi tunnisti 5 löydöstä ja yhden bonus-huomion. Kaikki on käsitelty ja integroitu TECH_SPEC v1.1:een.

| Kriittisyys | Löydöksiä | Käsitelty |
|-------------|-----------|-----------|
| 🔴 Critical | 1 | ✅ |
| 🟠 Major | 3 | ✅ |
| 🟡 Minor | 1 | ✅ |
| 💡 Bonus | 1 | ✅ |

---

## Finding #1: CDN Dependencies [🔴 CRITICAL]

### Ongelma

```javascript
// Alkuperäinen - EI versiolukitusta
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js'
```

**Riskit:**
- Breaking changes CDN:n päivittyessä
- Supply-chain attack mahdollisuus
- Ei SRI (Subresource Integrity) hasheja
- Ei offline-tukea

### Ratkaisu (MVP)

✅ **Versiolukitus:** Kaikki kirjastot lukittu tarkkoihin versioihin  
✅ **Import Map:** Keskitetty hallinta index.html:ssä  
✅ **Error Handling:** Graceful degradation CDN-virheissä  
❌ **Service Worker:** Siirretty V2:een (offline-tuki)

```html
<script type="importmap">
{
  "imports": {
    "@codemirror/view": "https://esm.sh/@codemirror/view@6.35.0",
    "marked": "https://cdn.jsdelivr.net/npm/marked@15.0.6/lib/marked.esm.js",
    "dompurify": "https://cdn.jsdelivr.net/npm/dompurify@3.2.4/dist/purify.es.mjs"
  }
}
</script>
```

---

## Finding #2: No Automated Testing [🟠 MAJOR]

### Ongelma

Alkuperäinen TECH_SPEC määritteli vain manuaalisen testauksen, vaikka arkkitehtuuri on hyvin testattava (puhtaat moduulit, wrapper pattern).

### Ratkaisu

✅ **Task-11 lisätty:** Vitest TDD kriittisille moduuleille (+3h)  
✅ **PROCESS-yhteensopiva:** Noudattaa projektin PROCESS_Testing.md -ohjeita (RGRC, AAA)

**Testattavat moduulit:**
- `storage.js` - CRUD, error handling, edge cases
- `preview.js` - XSS sanitization (turvallisuuskriittinen!)
- `utils.js` - UUID generation, debounce

**Ei MVP:ssä:**
- UI-testit (manuaalinen riittää)
- CodeMirror-integraatiotestit (luotetaan CM6:een)

---

## Finding #3: PDF Export Bug [🟠 MAJOR]

### Ongelma

```javascript
// Alkuperäinen - tulostaa nykyisen näkymän, EI annettua notea
exportPDF(note) {
  window.print();  // ← Bugi: ignoroi note-parametrin
}
```

### Ratkaisu

✅ **Iframe-tekniikka:** Luo hidden iframe, renderöi annettu note, tulosta iframe

```javascript
exportPDF(note) {
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:absolute;left:-9999px;';
  document.body.appendChild(iframe);
  
  const html = this._generatePrintHTML(note);
  iframe.contentDocument.write(html);
  iframe.contentDocument.close();
  
  iframe.contentWindow.onload = () => {
    iframe.contentWindow.print();
  };
  
  iframe.contentWindow.onafterprint = () => {
    document.body.removeChild(iframe);
  };
}
```

---

## Finding #4: CodeMirror CSS Override Fragile [🟠 MAJOR]

### Ongelma

```css
/* Alkuperäinen - hauraat selektorit */
.cm-editor { background: var(--bg); }
.cm-content { font-family: var(--font); }
.cm-cursor { border-color: var(--accent); }
```

CM6:n sisäiset luokat voivat muuttua päivityksissä → tyylit hajoavat.

### Ratkaisu

✅ **EditorView.theme() API:** Käytetään CM6:n virallista theming-rajapintaa

```javascript
const lightTheme = EditorView.theme({
  '&': { backgroundColor: 'var(--color-bg-primary)' },
  '.cm-content': { fontFamily: 'var(--font-mono)' },
  '.cm-cursor': { borderLeftColor: 'var(--color-accent)' }
}, { dark: false });
```

**Huom:** `editor.css` sisältää vain container-tyylit, EI CM6-overrideja.

---

## Finding #5: Note Edge Cases [🟡 MINOR]

### Ongelma

Dokumentoimattomat edge caset:
- Mitä tapahtuu kun note luodaan ilman otsikkoa?
- Mitä jos otsikko > 100 merkkiä?
- Mikä note avataan käynnistyksessä?

### Ratkaisu

✅ **Dokumentoitu TECH_SPEC 1.3:een:**

| Tilanne | Käyttäytyminen |
|---------|----------------|
| Uusi note ilman otsikkoa | `title = 'Untitled Note'` |
| Otsikko > 100 merkkiä | Katkaistaan: `title.slice(0, 100)` |
| Ensimmäinen käynnistys | Tyhjätila + "Create your first note" |
| `lastOpenNoteId` ei löydy | Avataan uusin note tai tyhjätila |

---

## Bonus: Event Bus Try-Catch [💡 IMPROVEMENT]

### Ongelma

```javascript
// Alkuperäinen - yksi virhe kaataa kaikki subscriberit
emit(event, ...args) { 
  events[event].forEach(cb => cb(...args)); 
}
```

### Ratkaisu

✅ **Try-catch wrapper:**

```javascript
emit(event, ...args) { 
  events[event]?.forEach(cb => {
    try {
      cb(...args);
    } catch (err) {
      console.error(`Event handler error [${event}]:`, err);
    }
  });
}
```

---

## V2 Roadmap (ei MVP:ssä)

Gemini tunnisti myös seuraavat parannusehdotukset, jotka on siirretty V2:een:

| Feature | Syy siirtoon |
|---------|--------------|
| Service Worker (offline) | +4-6h, monimutkainen |
| Cloud sync | Arkkitehtuurimuutos |
| iPad keyboard shortcuts | Nice-to-have |
| Bundler (Vite) | Ristiriidassa "no bundler" -päätöksen kanssa |

---

## Muutokset TECH_SPEC:iin

| Osio | Muutos | Finding |
|------|--------|---------|
| 1.3 Primitiivi | Note edge cases -taulukko | #5 |
| 1.4 Riippuvuudet | Versiolukitus + import map + error handling | #1 |
| 4.4 export.js | Iframe-tekniikka dokumentoitu | #3 |
| 5. Event Bus | try-catch wrapper | Bonus |
| Task-04 | EditorView.theme() implementation notes | #4 |
| Task-09 | Viittaus iframe-tekniikkaan | #3 |
| Task-11 | Uusi task: Unit Tests (Vitest) | #2 |
| 8. Task Summary | 11 taskia, 30h | #2 |
| 12. DoD | Unit testit lisätty | #2 |

---

## Liittyvät dokumentit

| Dokumentti | Kuvaus |
|------------|--------|
| TECH_SPEC_01_ACE_Markdown_Editor.md | Päivitetty v1.1 |
| PROCESS_Testing.md | TDD-prosessi (Vitest-sovellus) |
| PROCESS_Gemini_Review.md | Katselmoinnin prosessi |

---

*Katselmointi suoritettu Claude AI + Gemini AI -yhteistyönä.*
