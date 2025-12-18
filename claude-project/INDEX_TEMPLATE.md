# INDEX - Projektin dokumenttikartta

> **Versio:** 1.0  
> **Päivitetty:** [PÄIVÄMÄÄRÄ]  
> **Projekti:** [PROJEKTIN NIMI]

<!-- 
KÄYTTÖOHJE:
1. Korvaa [PLACEHOLDER]-kohdat projektikohtaisilla tiedoilla
2. Lisää moduulit sitä mukaa kun ne syntyvät
3. Päivitä status-merkit kun dokumentit valmistuvat
4. Poista tämä kommenttilohko kun olet valmis
-->

---

## Projektin status

```
[░░░░░░░░░░] 0% - Aloitusvaihe
```

**Seuraava askel:** [Kuvaile seuraava tehtävä]

---

## ⚡ Quick Reference: Milloin mikäkin dokumentti/skill?

### Päivittäinen käyttö

| Tilanne | Dokumentti/Skill | Sijainti |
|---------|------------------|----------|
| **Session aloitus** | KEHITYSLOKI | Kontekstissa |
| **Mistä löytyy X?** | INDEX (tämä) | Kontekstissa |
| **Moduulin status?** | MASTER_FUNCTIONAL | Kontekstissa/GitHub |

### Skillit (ladataan tarvittaessa)

| Tilanne | Skill | Triggeri |
|---------|-------|----------|
| **SPEC/RESEARCH kirjoitus** | `spec-writing` | "kirjoita SPEC", "aloita RESEARCH" |
| **Dokumentin tallennus** | `document-updates` | "tallenna", "commit", "encoding" |
| **Uusi projekti** | `market-research` | "Phase 0", "kilpailija-analyysi" |
| **Tietokantamuutos** | `database-management` | "skeema", "taulu", "migraatio" |
| **Testaus** | `testing` | "TDD", "testiskenaariot" |
| **Arkkitehtuuri** | `systems-architecture` | "rajapinta", "primitiivi" |

**Skillin käyttö:**
```
view /mnt/skills/user/[skill-nimi]/SKILL.md
```

### Skillien ja prosessiohjeiden suhde

```
SKILL (kevyt, kontekstissa)     →  PROSESSIOHJE (täysi, GitHubissa)
───────────────────────────────────────────────────────────────────
spec-writing                    →  PROCESS_SPEC_Writing.md
document-updates                →  PROCESS_Document_Updates.md
market-research                 →  PROCESS_Market_Research.md
database-management             →  PROCESS_Database_Management.md
testing                         →  PROCESS_Testing.md
systems-architecture            →  (sisäänrakennettu)
```

---

## 📚 Dokumentaatiokerrokset

### Kerros 1: Aina kontekstissa

| Dokumentti | Tarkoitus | Token-arvio |
|------------|-----------|-------------|
| **System Prompt** | Säännöt, työtapa, skill-triggerit | ~15K |
| **INDEX** | Tiedostokartta, quick reference | ~10K |
| **KEHITYSLOKI** | Missä mennään, seuraavat askeleet | ~8K |
| **Yhteensä** | | **~33K** |

### Kerros 2: Skillit (ladataan tarvittaessa)

| Skill | Koko |
|-------|------|
| spec-writing | ~6K |
| document-updates | ~5K |
| market-research | ~4K |
| database-management | ~5K |
| testing | ~7K |
| systems-architecture | ~9K |

### Kerros 3: GitHub (haetaan tarvittaessa)

| Dokumentti | Milloin | Koko |
|------------|---------|------|
| ARCHITECTURE_OVERVIEW | Arkkitehtuurikysymykset | vaihtelee |
| API_REFERENCE | Koodausvaihe | vaihtelee |
| MASTER_FUNCTIONAL | Moduulistatukset | vaihtelee |
| PROCESS_* | Skillin ohjaamana | vaihtelee |
| SPEC_*, TECH_SPEC_* | Kun työstetään moduulia | vaihtelee |

---

## Dokumenttihierarkia

```
[PROJEKTIN KANSIO]/
│
├── docs/
│   ├── process/                      ← Prosessiohjeet
│   │   ├── PROCESS_SPEC_Writing.md
│   │   ├── PROCESS_Document_Updates.md
│   │   ├── PROCESS_Database_Management.md
│   │   ├── PROCESS_Market_Research.md
│   │   ├── PROCESS_Testing.md
│   │   ├── PROCESS_Code.md
│   │   └── PROCESS_Research_Methodology.md
│   │
│   ├── research/                     ← Tutkimusdokumentit
│   │   ├── RESEARCH_01_[Moduuli].md
│   │   └── TECH_RESEARCH_01_[Moduuli].md
│   │
│   ├── specs/                        ← Toiminnalliset määrittelyt
│   │   └── SPEC_01_[Moduuli].md
│   │
│   ├── tech-specs/                   ← Tekniset määrittelyt
│   │   └── TECH_SPEC_01_[Moduuli].md
│   │
│   ├── briefings/                    ← Claude Code briefingit
│   │   └── BRIEFING_[Moduuli]_Task01.md
│   │
│   └── templates/                    ← Dokumenttitemplatet
│       ├── SPEC_TEMPLATE.md
│       ├── TECH_SPEC_TEMPLATE.md
│       └── BRIEFING_TEMPLATE.md
│
├── KEHITYSLOKI.md
├── INDEX.md
├── CLAUDE.md                         ← Claude Code -ohjeet
├── MASTER_FUNCTIONAL.md
└── README.md
```

---

## Moduulien dokumentaatiostatus

<!-- LISÄÄ MODUULIT PROJEKTIN EDETESSÄ -->

| Moduuli | RESEARCH | SPEC | TECH_RESEARCH | TECH_SPEC | CODE |
|---------|----------|------|---------------|-----------|------|
| [Moduuli 1] | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |
| [Moduuli 2] | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |
| [Moduuli 3] | 🔲 | 🔲 | 🔲 | 🔲 | 🔲 |

**Symbolit:** ✅ Valmis | 🔶 Työn alla | 🔲 Ei aloitettu

---

## Session aloitus -pikaohje

### 1. Lue KEHITYSLOKI

```
[Käytä Desktop Commanderia tai GitHub API:a]
```

### 2. Tarkista Git status (Windows)

```bash
git status
```

### 3. Kysy käyttäjältä tavoite

→ Ehdota aktiivisesti KEHITYSLOKI:n perusteella

---

## Yleiset käytännöt

### "Liittyvät dokumentit" -osio

Jokaisen dokumentin loppuun tulee taulukko:

```markdown
## Liittyvät dokumentit

| Dokumentti | Yhteys |
|------------|--------|
| PROCESS_X.md | Miten liittyy |
| SPEC_XX.md | Miten liittyy |
```

---

## Muutoshistoria

| Versio | Päivämäärä | Muutokset |
|--------|------------|-----------|
| 1.0 | [PÄIVÄMÄÄRÄ] | Ensimmäinen versio |

---

## Liittyvät dokumentit

| Dokumentti | Yhteys |
|------------|--------|
| **System Prompt** | Skill-triggerit ja säännöt |
| **KEHITYSLOKI** | Projektin edistyminen |
| **MASTER_FUNCTIONAL** | Moduulistatukset |

---

*Dokumentti on osa [PROJEKTIN NIMI] -projektin dokumentaatiota.*
