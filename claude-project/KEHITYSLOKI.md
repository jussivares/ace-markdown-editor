# KEHITYSLOKI

> **Versio:** 1.0  
> **Päivitetty:** 2026-01-05  
> **Projekti:** ACE Markdown Editor

<!-- MUOKKAUSOHJE: Tee LISÄYKSIÄ, älä kirjoita uudestaan. -->

---

## Projektin vaihe

```
[██░░░░░░░░] 20% - Määrittelyvaihe
```

**Nykyinen fokus:** SPEC valmis, seuraavaksi TECH_SPEC

---

## 🚀 Toteutusstrategia

### Vaiheet

| Vaihe | Fokus | Tehtävä | Status |
|:-----:|-------|---------|:------:|
| **1** | Määrittely | SPEC_01 - Toiminnallinen määrittely | ✅ |
| **2** | Tekninen suunnittelu | TECH_SPEC_01 - Tekninen määrittely | ▶ |
| **3** | Foundation | Perusrakenne, CodeMirror, layout | 🔲 |
| **4** | Core features | Preview, storage, note management | 🔲 |
| **5** | Polish | Export, theming, edge cases | 🔲 |

---

## Seuraava sessio

**Vaihe: 2 - Tekninen suunnittelu**

### Tehtävät:

| # | Tehtävä | Status |
|:-:|---------|:------:|
| 1 | TECH_SPEC_01 kirjoitus | 🔲 |
| 2 | Tiedostorakenteen suunnittelu | 🔲 |
| 3 | CodeMirror 6 -konfiguraation määrittely | 🔲 |
| 4 | CSS-arkkitehtuuri (theming, responsive) | 🔲 |
| 5 | Print CSS (PDF export) | 🔲 |

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
| ACE Markdown Editor | ✅ | ▶ | 🔲 | 🔲 |

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

### Avoin 🔲

| Kysymys | Prioriteetti | Huom |
|---------|--------------|------|
| Testausstrategia? | P2 | Manuaalinen vs Playwright |
| Bundle vai ES modules? | P1 | Ratkaistava TECH_SPEC:ssä |

---

## Opitut asiat 🎓

| Sessio | Oppi | Toimenpide |
|--------|------|------------|
| #1 | GitHub CLI vaatii kirjautumisen tai tokenin | Token toimii: `$env:GH_TOKEN="..."` |
| #1 | PowerShell käyttää `;` eikä `&&` | Muista syntaksi |

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
