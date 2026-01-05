# KEHITYSLOKI

> **Versio:** 1.0  
> **Päivitetty:** 2026-01-05  
> **Projekti:** ACE Markdown Editor

<!-- MUOKKAUSOHJE: Tee LISÄYKSIÄ, älä kirjoita uudestaan. -->

---

## Projektin vaihe

```
[████░░░░░░] 40% - Tekninen suunnittelu valmis (v1.2)
```

**Nykyinen fokus:** TECH_SPEC v1.2 valmis (Claude Review tehty), seuraavaksi koodaus (Task-01)

---

## 🚀 Toteutusstrategia

### Vaiheet

| Vaihe | Fokus | Tehtävä | Status |
|:-----:|-------|---------|:------:|
| **1** | Määrittely | SPEC_01 - Toiminnallinen määrittely | ✅ |
| **2** | Tekninen suunnittelu | TECH_SPEC_01 - Tekninen määrittely | ✅ |
| **3** | Foundation | Perusrakenne, CodeMirror, layout | ▶ |
| **4** | Core features | Preview, storage, note management | 🔲 |
| **5** | Polish | Export, theming, edge cases | 🔲 |

---

## Seuraava sessio

**Vaihe: 3 - Foundation (Koodaus alkaa)**

### Tehtävät:

| # | Tehtävä | Arvio | Status |
|:-:|---------|:-----:|:------:|
| 1 | Task-01: Projektin perusrakenne | 1h | 🔲 |
| 2 | Task-02: CSS Variables & Theming | 2h | 🔲 |
| 3 | Task-06: Storage Module | 2h | 🔲 |
| 4 | Task-03: Layout Foundation | 4h | 🔲 |

---

## Odottavat tehtävät

### Ennen koodausta

- [ ] TECH_SPEC_01 valmis ja hyväksytty
- [ ] Kehitysympäristö pystytetty
- [ ] Testausstrategia määritelty (manuaalinen vs. automaattinen)

### Myöhemmin

- [ ] iPad-testaus oikealla laitteella
- [ ] Suorituskykytestaus isoilla dokumenteilla

---

## Sessiohistoria

<!-- UUSIN SESSIO AINA YLIMMÄKSI -->

### Session #3 (2026-01-05) - Claude Review ja TECH_SPEC v1.2

**Tavoite:** Arkkitehtuurianalyysi ja TECH_SPEC:n laadunvarmistus

**Saavutukset:**

- ✅ Stack-arviointi: Vanilla JS + CM6 + marked + hljs + DOMPurify → HYVÄKSYTTY
- ✅ Storage-arviointi: localStorage riittää MVP:hen
- ✅ Gemini Review -käsittelyn validointi: kaikki 5 löydöstä käsitelty oikein
- ✅ TECH_SPEC v1.2 julkaistu (3 kriittistä virhettä korjattu)

**Löydetyt virheet (korjattu):**

| # | Virhe | Korjaus |
|---|-------|---------|
| 1 | CM6 import path väärä (`@codemirror/basic-setup`) | `basicSetup` tulee `codemirror`-paketista |
| 2 | highlight.js URL-ristiriita (random fork) | Yhtenäistetty esm.sh:lle |
| 3 | marked v15 highlight-optio vanhentunut | Lisätty `marked-highlight` riippuvuus |

**Lisäykset TECH_SPEC:iin:**

- Section 5.1: Application State
- State Flow: Note Selection (diagrammi)
- State Flow: Autosave vs Manual Save (diagrammi)

**Commitit:** `[pending]`

---

### Session #2 (2026-01-05) - TECH_SPEC ja arkkitehtuuri

**Tavoite:** Kirjoittaa tekninen määrittely ja päättää arkkitehtuuri

**Saavutukset:**

- ✅ TECH_SPEC_01_ACE_Markdown_Editor.md kirjoitettu (1086 riviä)
- ✅ 10 taskia määritelty (27h arvio MVP)
- ✅ 60+ test scenariota kirjoitettu
- ✅ Traceability Matrix täydennetty (kaikki 45 AC linkitetty taskeihin)
- ✅ CSS-arkkitehtuuri suunniteltu (variables, responsive breakpoints)
- ✅ Event bus -arkkitehtuuri dokumentoitu

**Arkkitehtuuripäätökset:**

| Päätös | Valinta | Perustelu |
|--------|---------|-----------|
| Moduulirakenne | 5 black box moduulia | Vaihdettavuus, selkeys |
| Kytkentä | Event bus + callbacks | Löyhä kytkentä, testattavuus |
| Ulkoiset kirjastot | Aina wrapataan | Platform layer -periaate |
| CSS | Custom properties | Teeman vaihto ilman JS |
| Testaus | Manuaalinen | Pieni projekti, UI-intensiivinen |

**Keskustelu:**
- Selvennettiin SPEC-prosessin "moduuli" vs arkkitehtuurin "moduuli" -ero
- Moduuli SPECissä = dokumentaation organisointi
- Moduuli arkkitehtuurissa = black box -komponentti
- Päätettiin käyttää kevyt modulaarinen arkkitehtuuri (callbacks, ei events overkill)

**Commitit:** `[pending]`

---

### Session #1 (2026-01-05) - Projektin perustaminen ja SPEC

**Tavoite:** Perustaa GitHub-repo ja kirjoittaa toiminnallinen määrittely

**Saavutukset:**

- ✅ GitHub repo luotu: https://github.com/jussivares/ace-markdown-editor
- ✅ .gitignore lisätty
- ✅ SPEC_01_ACE_Markdown_Editor.md kirjoitettu (10 vaatimusta, 45 AC)
- ✅ README.md päivitetty
- ✅ INDEX.md ja KEHITYSLOKI.md luotu

**Päätökset:**

| Päätös | Valinta | Perustelu |
|--------|---------|-----------|
| Tiedostorakenne | Modulaarinen (ei single HTML) | iPad-tuki prioriteetti |
| Editor | CodeMirror 6 (esm.sh CDN) | Paras touch-tuki, suorituskyky |
| PDF export | window.print() + print CSS | 1:1 preview-vastaavuus |
| Tallennus | Autosave (2-3s debounce) + manuaalinen | Parempi UX iPadilla |
| Teema | Dark/Light toggle MVP:ssä | Käyttäjän toive |
| Moduulirakenne | Yksi moduuli (A-malli) | Yksinkertaisuus, tiivis integraatio |

**Commitit:** `385ed8e`

---

## Moduulien status

| Moduuli | SPEC | TECH_SPEC | CODE | TEST |
|---------|:----:|:---------:|:----:|:----:|
| ACE Markdown Editor | ✅ | ✅ | ▶ | 🔲 |

**Symbolit:** ✅ Valmis | 🔶 Työn alla | 🔲 Ei aloitettu | ▶ Seuraava

---

## Vaatimukset (SPEC_01)

| REQ | Kuvaus | Status |
|-----|--------|:------:|
| REQ-01 | Split-pane Layout | 🔲 |
| REQ-02 | Real-time Markdown Preview | 🔲 |
| REQ-03 | Syntax Highlighting (Editor) | 🔲 |
| REQ-04 | Syntax Highlighting (Preview) | 🔲 |
| REQ-05 | Note Management | 🔲 |
| REQ-06 | Export HTML | 🔲 |
| REQ-07 | Export PDF | 🔲 |
| REQ-08 | Preview Security (XSS) | 🔲 |
| REQ-09 | Dark/Light Theme | 🔲 |
| REQ-10 | Visual Feedback & Error Handling | 🔲 |

---

## Skillit

| Skill | Triggeri |
|-------|----------|
| `spec-writing` | "SPEC", "TECH_SPEC" |
| `document-updates` | "tallenna", "commit" |
| `testing` | "TDD", "testit" |
| `systems-architecture` | "arkkitehtuuri" |

---

## Avoimet kysymykset

### Ratkaistu ✅

| Kysymys | Ratkaisu | Sessio |
|---------|----------|--------|
| Single HTML vs modulaarinen? | Modulaarinen OK | #1 |
| CodeMirror 5 vs 6? | CM6 (parempi touch) | #1 |
| PDF export -toteutus? | window.print() + print CSS | #1 |
| Autosave vs manual? | Molemmat (autosave + save-nappi) | #1 |
| Testausstrategia? | Manuaalinen (pieni projekti, UI-intensiivinen) | #2 |
| Bundle vai ES modules? | ES modules (esm.sh CDN) | #2 |
| Moduulien kytkentä? | Event bus + callbacks | #2 |

### Avoin 🔲

| Kysymys | Prioriteetti | Huom |
|---------|--------------|------|
| - | - | Ei avoimia kysymyksiä |

---

## Opitut asiat 🎓

| Sessio | Oppi | Toimenpide |
|--------|------|------------|
| #1 | GitHub CLI vaatii kirjautumisen tai tokenin | Token toimii: `$env:GH_TOKEN="..."` |
| #1 | PowerShell käyttää `;` eikä `&&` | Muista syntaksi |
| #2 | "Moduuli" on kontekstiriippuvainen termi | SPEC: dokumentaation organisointi, Arkkitehtuuri: black box |
| #2 | Wrapper-periaate kriittinen | Kaikki ulkoiset kirjastot wrapataan |

---

## Muutoshistoria

| Versio | Päivämäärä | Muutokset |
|--------|------------|-----------|
| 1.0 | 2026-01-05 | Ensimmäinen versio, Session #1 |

---

## Liittyvät dokumentit

| Dokumentti | Yhteys |
|------------|--------|
| INDEX.md | Dokumenttien navigointi |
| SPEC_01_ACE_Markdown_Editor.md | Toiminnallinen määrittely |

---

*Dokumentti on osa ACE Markdown Editor -projektin dokumentaatiota.*
