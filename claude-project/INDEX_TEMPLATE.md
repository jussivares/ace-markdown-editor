# [PROJEKTIN NIMI] - INDEX

> **Päivitetty:** [PÄIVÄMÄÄRÄ]  
> **Versio:** 1.1

**⚠️ LUE TÄMÄ AINA SESSION ALUSSA!** Tämä dokumentti kertoo mitä prosessiohjeita ja skillejä on käytettävissä.

<!-- 
KÄYTTÖOHJE:
1. Korvaa [PROJEKTIN NIMI] projektisi nimellä
2. Päivitä rakenne vastaamaan projektiasi
3. Päivitä statukset projektin edetessä
4. Poista tämä kommenttilohko kun olet valmis
-->

---

## 📁 Projektin rakenne

```
[projekti-nimi]/
│
├── claude-project/                 ← CLAUDE.AI PROJEKTITIEDOSTOT
│   ├── SYSTEM_PROMPT.md            ← Projektin ohjeet (→ Custom instructions)
│   ├── INDEX.md                    ← Tämä tiedosto (PAKOLLINEN)
│   └── KEHITYSLOKI.md              ← Edistymisen seuranta (PAKOLLINEN)
│
├── docs/
│   ├── architecture/               ← ARKKITEHTUURIDOKUMENTIT
│   │   ├── ARCHITECTURE_OVERVIEW.md
│   │   ├── API_REFERENCE.md
│   │   └── DATABASE_SCHEMA.md
│   │
│   ├── specs/                      ← MÄÄRITTELYDOKUMENTIT
│   │   ├── MASTER_FUNCTIONAL.md    ← Toiminnallinen kokonaiskuva
│   │   ├── RESEARCH_*.md           ← Tutkimusdokumentit
│   │   ├── SPEC_*.md               ← Toiminnalliset määrittelyt
│   │   └── TECH_SPEC_*.md          ← Tekniset määrittelyt
│   │
│   ├── process/                    ← PROSESSIOHJEET
│   │   ├── PROCESS_Research_Methodology.md
│   │   ├── PROCESS_SPEC_Writing.md
│   │   ├── PROCESS_Document_Updates.md
│   │   ├── PROCESS_Database_Management.md
│   │   ├── PROCESS_Testing.md
│   │   ├── PROCESS_Code.md
│   │   ├── PROCESS_Debugging.md
│   │   ├── PROCESS_Implementation_Strategy.md
│   │   └── PROCESS_Market_Research.md
│   │
│   └── templates/                  ← DOKUMENTTITEMPLATET
│       ├── RESEARCH_TEMPLATE.md
│       ├── SPEC_TEMPLATE.md
│       ├── TECH_SPEC_TEMPLATE.md
│       ├── TECH_RESEARCH_TEMPLATE.md
│       └── BRIEFING_TEMPLATE.md
│
├── src/                            ← LÄHDEKOODI
│   └── [moduulit]
│
├── tests/                          ← TESTIT
│   └── [testit]
│
└── README.md
```

---

## 🛠️ PROSESSIOHJEET - Milloin käytetään mitäkin

**Sijainti:** `docs/process/`

| Prosessi | Tiedosto | Käytä kun... |
|----------|----------|--------------|
| **Research Methodology** | `PROCESS_Research_Methodology.md` | **⚠️ AINA ennen RESEARCH_*.md kirjoitusta!** |
| **SPEC Writing** | `PROCESS_SPEC_Writing.md` | Kirjoitat SPEC tai TECH_SPEC dokumenttia |
| **Document Updates** | `PROCESS_Document_Updates.md` | Tallennat dokumentteja, encoding-ongelmat |
| **Database Management** | `PROCESS_Database_Management.md` | Tietokantamuutokset, skeemasuunnittelu |
| **Testing** | `PROCESS_Testing.md` | TDD, testiskenaariot, testausstrategia |
| **Code** | `PROCESS_Code.md` | Koodausvaihe, RGRC-sykli |
| **Debugging** | `PROCESS_Debugging.md` | Vianselvitys, 3+ Fix Rule |
| **Implementation Strategy** | `PROCESS_Implementation_Strategy.md` | Hybridimalli, toteutusjärjestys |
| **Market Research** | `PROCESS_Market_Research.md` | Phase 0, kilpailija-analyysi |

### ⚠️ KRIITTINEN: RESEARCH/SPEC-dokumentit

**ENNEN kuin kirjoitat RESEARCH_*.md tai SPEC_*.md dokumenttia:**
1. LUE vastaava prosessiohje `docs/process/`-kansiosta
2. KÄYTÄ vastaava template `docs/templates/`-kansiosta
3. SEURAA prosessia askel askeleelta

---

## 🎯 SKILLIT - Lataa tarvittaessa

**Sijainti:** `/mnt/skills/user/[skill-nimi]/SKILL.md`

| Skill | Käyttö | Latauskomento |
|-------|--------|---------------|
| **systems-architecture** | Arkkitehtuuripäätökset, rajapinnat, primitiivit | `Lue /mnt/skills/user/systems-architecture/SKILL.md` |
| **document-updates** | Tallennus GitHubiin, encoding, versiointi | `Lue /mnt/skills/user/document-updates/SKILL.md` |
| **spec-writing** | SPEC/RESEARCH-dokumenttien kirjoitus | `Lue /mnt/skills/user/spec-writing/SKILL.md` |
| **database-management** | Tietokantaskeeman ylläpito | `Lue /mnt/skills/user/database-management/SKILL.md` |
| **testing** | TDD, testiskenaariot | `Lue /mnt/skills/user/testing/SKILL.md` |
| **market-research** | Phase 0, markkinatutkimus | `Lue /mnt/skills/user/market-research/SKILL.md` |

### Milloin käyttää mitäkin skilliä:

| Tilanne | Käytä |
|---------|-------|
| **Arkkitehtuuripäätös** | `systems-architecture` skill |
| **RESEARCH/SPEC-dokumentti** | Prosessiohje + `spec-writing` skill |
| **Tallennus GitHubiin** | `document-updates` skill |
| **Tietokantamuutos** | `database-management` skill |
| **Testien kirjoitus** | `testing` skill |

---

## 📋 TEMPLATET

**Sijainti:** `docs/templates/`

| Template | Käyttö |
|----------|--------|
| `RESEARCH_TEMPLATE.md` | RESEARCH_*.md dokumenttien pohja |
| `SPEC_TEMPLATE.md` | Toiminnallinen määrittely |
| `TECH_SPEC_TEMPLATE.md` | Tekninen määrittely |
| `TECH_RESEARCH_TEMPLATE.md` | Tekninen tutkimus |
| `BRIEFING_TEMPLATE.md` | Claude Code -briefing |

---

## 📊 Dokumenttien statukset

| Status | Merkitys |
|--------|----------|
| ✅ | Valmis / Hyväksytty |
| 🔄 | Työn alla / Seuraava |
| ⏳ | Odottaa / Ei aloitettu |
| ❌ | Hylätty / Vanhentunut |

---

## 🎯 Moduulit ja niiden status

<!-- PÄIVITÄ PROJEKTIKOHTAISESTI -->

| Moduuli | SPEC | TECH_SPEC | Koodi | Testit |
|---------|------|-----------|-------|--------|
| [Moduuli 1] | ⏳ | ⏳ | ⏳ | ⏳ |
| [Moduuli 2] | ⏳ | ⏳ | ⏳ | ⏳ |
| [Moduuli 3] | ⏳ | ⏳ | ⏳ | ⏳ |

---

## 🚀 Pikaoppaat

### Session aloitus (PAKOLLINEN)
```
1. LUE INDEX (tämä dokumentti)
   → Tiedät mitä prosesseja/skillejä on käytettävissä

2. LUE KEHITYSLOKI
   → Tiedät missä mennään ja mitä seuraavaksi

3. git status (Windows)
   → Onko uncommitted muutoksia?

4. Kysy käyttäjältä tavoite
```

### RESEARCH-dokumentin kirjoitus
```
1. LUE docs/process/PROCESS_Research_Methodology.md
2. KOPIOI docs/templates/RESEARCH_TEMPLATE.md
3. LATAA skill: systems-architecture (jos arkkitehtuuripäätös)
4. SEURAA prosessia
5. TALLENNA: lataa document-updates skill
```

### SPEC-dokumentin kirjoitus
```
1. LUE docs/process/PROCESS_SPEC_Writing.md
2. KOPIOI docs/templates/SPEC_TEMPLATE.md tai TECH_SPEC_TEMPLATE.md
3. SEURAA 11-vaiheista prosessia
4. TALLENNA: lataa document-updates skill
```

### Arkkitehtuuripäätös
```
1. LATAA skill: systems-architecture
2. KÄYTÄ checklist:
   - Primitiivi tunnistettu?
   - Black box -rajat selkeät?
   - Voidaanko vaihtaa myöhemmin?
3. DOKUMENTOI päätös
```

---

## 🔗 Liittyvät dokumentit

| Dokumentti | Yhteys |
|------------|--------|
| SYSTEM_PROMPT.md | Projektin ohjeet |
| KEHITYSLOKI.md | Edistymisen seuranta |
| MASTER_FUNCTIONAL.md | Toiminnallinen kokonaiskuva |

---

## Muutoshistoria

| Versio | Päivämäärä | Muutokset |
|--------|------------|-----------|
| 1.1 | 2025-12-18 | Lisätty kattava prosessi- ja skill-lista, pikaoppaat |
| 1.0 | [PÄIVÄMÄÄRÄ] | Ensimmäinen versio |

---

*Päivitä tätä dokumenttia kun lisäät uusia tiedostoja!*
