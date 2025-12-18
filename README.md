# AI Dev Starter Kit 🚀

> **Versio:** 1.0  
> **Päivitetty:** 2024-12-18

AI-avusteisen ohjelmistokehityksen starter kit - prosessit, templatet ja filosofia.

---

## 🎯 Mikä tämä on?

Tämä starter kit sisältää kaiken mitä tarvitset **AI-avusteisen ohjelmistokehitysprojektin** käynnistämiseen:

- **Prosessiohjeet** - Todistetut käytännöt SPEC-kirjoituksesta TDD:hen
- **Dokumenttitemplatet** - Valmiit pohjat kaikille dokumenteille
- **Claude-projekti templatet** - System prompt, INDEX ja KEHITYSLOKI
- **"Neo-Waterfall" metodologia** - AI:n mahdollistama perusteellinen suunnittelu

---

## 📦 Sisältö

```
ai-dev-starter-kit/
│
├── claude-project/                     ← Claude.ai -projektin templatet
│   ├── SYSTEM_PROMPT_TEMPLATE.md       ← Projektin ohjeet (kopioi claude.ai:hin)
│   ├── INDEX_TEMPLATE.md               ← Dokumenttikartta
│   └── KEHITYSLOKI_TEMPLATE.md         ← Edistymisen seuranta
│
├── docs/
│   ├── process/                        ← Prosessiohjeet (9 kpl)
│   │   ├── PROCESS_SPEC_Writing.md     ← 11-vaiheinen SPEC-prosessi
│   │   ├── PROCESS_Document_Updates.md ← Tallennus ja versionhallinta
│   │   ├── PROCESS_Market_Research.md  ← Phase 0: Markkinatutkimus
│   │   ├── PROCESS_Database_Management.md
│   │   ├── PROCESS_Testing.md          ← TDD ja testausstrategia
│   │   ├── PROCESS_Code.md             ← Koodausprosessi
│   │   ├── PROCESS_Debugging.md        ← Debuggaus-prosessi
│   │   ├── PROCESS_Implementation_Strategy.md ← Hybridimalli
│   │   └── PROCESS_Research_Methodology.md
│   │
│   └── templates/                      ← Dokumenttitemplatet (5 kpl)
│       ├── SPEC_TEMPLATE.md            ← Toiminnallinen määrittely
│       ├── TECH_SPEC_TEMPLATE.md       ← Tekninen määrittely
│       ├── RESEARCH_TEMPLATE.md        ← Tutkimusdokumentti
│       ├── TECH_RESEARCH_TEMPLATE.md   ← Tekninen tutkimus
│       └── BRIEFING_TEMPLATE.md        ← Claude Code -briefing
│
└── README.md                           ← Tämä tiedosto
```

---

## 🚀 Käyttöönotto

### Vaihe 1: Kloonaa tai kopioi tämä repo

**Vaihtoehto A: Kloonaa suoraan**

```bash
git clone https://github.com/jussivares/ai-dev-starter-kit.git my-new-project
cd my-new-project
rm -rf .git
git init
git add .
git commit -m "Initial commit from ai-dev-starter-kit"
```

**Vaihtoehto B: Käytä GitHub Template -toimintoa**

1. Mene osoitteeseen https://github.com/jussivares/ai-dev-starter-kit
2. Klikkaa "Use this template" → "Create a new repository"
3. Anna uudelle repolle nimi ja luo se

**Vaihtoehto C: Lataa ZIP**

1. Klikkaa "Code" → "Download ZIP"
2. Pura haluamaasi kansioon
3. Alusta git: `git init`

---

### Vaihe 2: Luo Claude-projekti (claude.ai)

1. **Mene claude.ai:hin** ja luo uusi projekti
2. **Kopioi System Prompt:**
   - Avaa `claude-project/SYSTEM_PROMPT_TEMPLATE.md`
   - Korvaa `[PLACEHOLDER]`-kohdat projektiisi sopiviksi
   - Liitä projektin "Custom instructions" -kenttään
3. **Lisää projektitiedostot:**
   - `INDEX_TEMPLATE.md` → Muokkaa ja lisää projektiin
   - `KEHITYSLOKI_TEMPLATE.md` → Muokkaa ja lisää projektiin

---

### Vaihe 3: Muokkaa templatet projektiisi

| Tiedosto | Toimenpide |
|----------|------------|
| `SYSTEM_PROMPT_TEMPLATE.md` | Korvaa projektin nimi, polut, teknologiat |
| `INDEX_TEMPLATE.md` | Lisää moduulit sitä mukaa kun syntyvät |
| `KEHITYSLOKI_TEMPLATE.md` | Aloita tyhjällä, täytä sessioiden myötä |

---

### Vaihe 4: Aloita kehitys!

```
Suositeltu aloitusjärjestys:

1. 📋 Phase 0: Market Research (valinnainen)
   → Lue PROCESS_Market_Research.md
   
2. 🔍 RESEARCH-vaihe
   → Käytä RESEARCH_TEMPLATE.md
   
3. 📝 SPEC-vaihe  
   → Käytä SPEC_TEMPLATE.md
   → Seuraa PROCESS_SPEC_Writing.md
   
4. 🔧 TECH_RESEARCH + TECH_SPEC
   → Käytä TECH_RESEARCH_TEMPLATE.md ja TECH_SPEC_TEMPLATE.md
   
5. 💻 CODE-vaihe
   → Seuraa PROCESS_Code.md ja PROCESS_Testing.md
```

---

## 🛠️ Skillit

Starter kit olettaa että sinulla on seuraavat **Claude-skillit** asennettuna:

| Skill | Tarkoitus |
|-------|-----------|
| `spec-writing` | SPEC-dokumenttien kirjoitus |
| `document-updates` | Dokumenttien tallennus ja versionhallinta |
| `market-research` | Phase 0: Markkinatutkimus |
| `database-management` | Tietokantaskeeman hallinta |
| `testing` | TDD ja testausstrategia |
| `systems-architecture` | Arkkitehtuuriperiaatteet |

**Skillien asennus:** Skillit asennetaan Claude.ai:n asetuksista erikseen.

---

## 📖 Ydinfilosofia

### "Neo-Waterfall" AI:n aikakaudella

Perinteinen vesiputousmalli epäonnistui koska ihmiset:
- Unohtavat yksityiskohdat
- Väsyvät pitkiin projekteihin
- Vaihtuvat kesken projektin

**AI muuttaa tämän:**
- Claude ylläpitää suurta kontekstia johdonmukaisesti
- Dokumentaatio pysyy ajan tasalla
- "Muisti" ei häviä sessioiden välillä

**Tulos:** Perusteellinen etukäteissuunnittelu on taas mahdollista ja kannattavaa.

### Kaksoisrooli

Claude toimii **sekä suunnittelijana että tutkijana**:

```
┌─────────────────────────────────────────────────────────────┐
│  SUUNNITTELIJA              TUTKIJA                        │
│  ─────────────              ───────                        │
│  Kysyy oikeat kysymykset    Hakee vastaukset               │
│  Tunnistaa vaihtoehdot      Vertailee ratkaisuja           │
│  Tekee suositukset          Dokumentoi lähteet             │
│  Kirjoittaa SPECit          Kirjoittaa RESEARCHit          │
└─────────────────────────────────────────────────────────────┘
```

### Ydinperiaatteet

| Periaate | Selitys |
|----------|---------|
| **Tutki ensin, kysy sitten** | Claude tekee tiedonhaun ennen käyttäjäkysymystä |
| **Vaihtoehdot + Ehdotus** | Anna valinnat + oma suositus perusteluineen |
| **Dokumentti AINA itsenäinen** | Ei viittauksia edellisiin versioihin |
| **MVP ensin** | Täydellinen myöhemmin |

---

## 📚 Prosessien yhteenveto

| Prosessi | Kuvaus | Milloin käytetään |
|----------|--------|-------------------|
| **SPEC Writing** | 11-vaiheinen määrittelyprosessi | Uusi moduuli |
| **Market Research** | Kilpailija- ja markkina-analyysi | Uusi projekti |
| **Implementation Strategy** | Hybridimalli: koodaa + speksaa | Toteutusvaihe |
| **Testing** | TDD, RGRC-sykli | Koodausvaihe |
| **Debugging** | Systemaattinen vianselvitys | Bugit |
| **Document Updates** | Tallennus, encoding, versiointi | Aina |

---

## 🔗 Audit Trail -ketju

Starter kit tukee täydellistä jäljitettävyyttä:

```
REQ-01 (Vaatimus)
    │
    ├── AC-01 (Acceptance Criterion)
    │       │
    │       ├── Task-01
    │       │       │
    │       │       ├── TS-01.1 (Test Scenario)
    │       │       │       │
    │       │       │       └── test_method_returns_expected()
    │       │       │
    │       │       └── TS-01.2
    │       │               │
    │       │               └── test_method_handles_edge_case()
    │       │
    │       └── Task-02
    │               │
    │               └── TS-02.1
    │
    └── AC-02
            │
            └── Task-03
```

---

## 🤝 Kontribuutiot

Tämä starter kit perustuu käytännön kokemukseen AI-avusteisesta ohjelmistokehityksestä. Parannusehdotukset ja pull requestit ovat tervetulleita!

---

## 📄 Lisenssi

MIT License - vapaa käyttö ja muokkaus.

---

## 🙏 Kiitokset

Tämä starter kit on kehitetty osana Claude API -suunnittelutyökalu -projektia. Erityiskiitokset:

- **Claude (Anthropic)** - AI-avusteinen suunnittelu ja dokumentointi
- **Obra Superpowers** - TDD- ja debugging-skillit

---

*Aloita projektisi oikein - anna AI:n auttaa suunnittelussa!* 🚀
