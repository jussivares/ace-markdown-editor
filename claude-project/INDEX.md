# ACE Markdown Editor - INDEX

> **Päivitetty:** 2026-01-05  
> **Versio:** 1.0

**⚠️ LUE TÄMÄ AINA SESSION ALUSSA!** Tämä dokumentti kertoo mitä prosessiohjeita ja skillejä on käytettävissä.

---

## 📁 Projektin rakenne

```
ace-markdown-editor/
│
├── claude-project/                 ← CLAUDE.AI PROJEKTITIEDOSTOT
│   ├── INDEX.md                    ← Tämä tiedosto (PAKOLLINEN)
│   └── KEHITYSLOKI.md              ← Edistymisen seuranta (PAKOLLINEN)
│
├── docs/
│   ├── SPEC_01_ACE_Markdown_Editor.md  ← Toiminnallinen määrittely ✅
│   ├── process/                    ← Prosessiohjeet (starter kit)
│   └── templates/                  ← Dokumenttitemplatet (starter kit)
│
├── src/                            ← Sovelluksen lähdekoodi (tulossa)
│   ├── index.html                  ← Pääsivu
│   ├── css/                        ← Tyylit
│   └── js/                         ← JavaScript-moduulit
│
├── .gitignore
└── README.md
```

---

## 🎯 Projektin yleiskuva

**Mikä:** iPad-first Markdown-muistiinpanoeditori  
**Stack:** Vanilla JS + CodeMirror 6 + marked.js + highlight.js + DOMPurify  
**Storage:** localStorage (ei backendiä)  
**Repo:** https://github.com/jussivares/ace-markdown-editor

---

## 📊 Dokumenttien statukset

| Dokumentti | Status | Sijainti |
|------------|--------|----------|
| SPEC_01 (toiminnallinen) | ✅ Valmis | `docs/SPEC_01_ACE_Markdown_Editor.md` |
| TECH_SPEC_01 (tekninen) | ✅ Valmis v1.2 | `docs/TECH_SPEC_01_ACE_Markdown_Editor.md` |
| Gemini Review | ✅ Valmis | `docs/REVIEW_Gemini_TECH_SPEC_01.md` |
| Claude Review | ✅ Integroitu v1.2:een | (TECH_SPEC muutoshistoria) |
| Koodi | ⏳ Seuraava | `src/` |

---

## 🛠️ PROSESSIOHJEET

**Sijainti:** `docs/process/`

| Prosessi | Tiedosto | Käytä kun... |
|----------|----------|--------------|
| **SPEC Writing** | `PROCESS_SPEC_Writing.md` | Kirjoitat SPEC tai TECH_SPEC dokumenttia |
| **Document Updates** | `PROCESS_Document_Updates.md` | Tallennat dokumentteja, encoding-ongelmat |
| **Testing** | `PROCESS_Testing.md` | TDD, testiskenaariot |
| **Code** | `PROCESS_Code.md` | Koodausvaihe |
| **Debugging** | `PROCESS_Debugging.md` | Vianselvitys |

---

## 🎯 SKILLIT

| Skill | Käyttö | Latauskomento |
|-------|--------|---------------|
| **systems-architecture** | Arkkitehtuuripäätökset | `Lue /mnt/skills/user/systems-architecture/SKILL.md` |
| **document-updates** | Tallennus GitHubiin | `Lue /mnt/skills/user/document-updates/SKILL.md` |
| **spec-writing** | SPEC-dokumenttien kirjoitus | `Lue /mnt/skills/user/spec-writing/SKILL.md` |
| **testing** | TDD, testiskenaariot | `Lue /mnt/skills/user/testing/SKILL.md` |

---

## 🚀 Pikaoppaat

### Session aloitus (PAKOLLINEN)
```
1. LUE INDEX (tämä dokumentti)
2. LUE KEHITYSLOKI → Tiedät missä mennään
3. git status → Onko uncommitted muutoksia?
4. Kysy käyttäjältä tavoite
```

### TECH_SPEC-dokumentin kirjoitus
```
1. LUE docs/process/PROCESS_SPEC_Writing.md
2. KOPIOI docs/templates/TECH_SPEC_TEMPLATE.md
3. SEURAA prosessia
4. TALLENNA ja commit
```

### Koodausvaihe
```
1. LUE TECH_SPEC
2. Toteuta ominaisuus kerrallaan
3. Testaa iPadilla ja desktopilla
4. Commit jokaisen toimivan ominaisuuden jälkeen
```

---

## 🔗 Linkit

| Resurssi | URL |
|----------|-----|
| GitHub repo | https://github.com/jussivares/ace-markdown-editor |
| CodeMirror 6 docs | https://codemirror.net/docs/ |
| marked.js | https://marked.js.org/ |
| highlight.js | https://highlightjs.org/ |
| DOMPurify | https://github.com/cure53/DOMPurify |

---

## Muutoshistoria

| Versio | Päivämäärä | Muutokset |
|--------|------------|-----------|
| 1.0 | 2026-01-05 | Ensimmäinen versio |

---

*Päivitä tätä dokumenttia kun lisäät uusia tiedostoja!*
