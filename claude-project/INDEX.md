# ACE Markdown Editor - INDEX

> **Päivitetty:** 2026-01-06
> **Versio:** 1.1

**⚠️ LUE TÄMÄ AINA SESSION ALUSSA!** Tämä dokumentti kertoo mitä prosessiohjeita ja skillejä on käytettävissä.

---

## 📁 Projektin rakenne

```
ace-markdown-editor/
│
├── claude-project/                 ← CLAUDE.AI PROJEKTITIEDOSTOT
│   ├── INDEX.md                    ← Tämä tiedosto (PAKOLLINEN)
│   ├── KEHITYSLOKI.md              ← Edistymisen seuranta (PAKOLLINEN)
│   ├── ROADMAP_V2_Cloud_Migration.md ← V2 suunnitelma (pilvi + auth)
│   └── HANDOFF_Session4.md         ← Session handoff -dokumentti
│
├── docs/
│   ├── SPEC_01_ACE_Markdown_Editor.md   ← Toiminnallinen määrittely ✅
│   ├── TECH_SPEC_01_ACE_Markdown_Editor.md ← Tekninen määrittely ✅
│   ├── process/                    ← Prosessiohjeet
│   └── templates/                  ← Dokumenttitemplatet
│
├── css/                            ← Tyylit ✅
│   ├── variables.css               ← Design tokens, theming
│   ├── layout.css                  ← Grid, responsive, split-pane
│   ├── components.css              ← Buttons, toasts, sidebar
│   ├── editor.css                  ← CodeMirror container
│   ├── preview.css                 ← Rendered markdown
│   └── print.css                   ← @media print
│
├── js/                             ← JavaScript-moduulit ✅
│   ├── app.js                      ← Orchestrator, event bus
│   ├── editor.js                   ← CodeMirror 6 wrapper
│   ├── preview.js                  ← marked + DOMPurify wrapper
│   ├── storage.js                  ← localStorage CRUD
│   ├── export.js                   ← HTML & PDF export
│   ├── ui.js                       ← Layout, theme, toasts
│   └── utils.js                    ← UUID, debounce
│
├── index.html                      ← Pääsivu (entry point) ✅
├── CLAUDE.md                       ← Claude Code -ohjeet
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

## 📊 Projektin status

| Osa-alue | Status | Huomiot |
|----------|--------|---------|
| SPEC_01 (toiminnallinen) | ✅ Valmis | 10 vaatimusta, 45 AC |
| TECH_SPEC_01 (tekninen) | ✅ Valmis v1.2 | 11 taskia määritelty |
| Koodi (Task-01...09) | ✅ Valmis | Core features toteutettu |
| Warm Notes Dark Theme | ✅ Valmis | Visuaalinen uudistus |
| Code Review | ✅ Valmis | 4 löydöstä korjattu |
| Task-10 (Keyboard Shortcuts) | 🔲 Odottaa | - |
| Task-11 (Unit Tests) | ▶ Seuraava | Vitest |
| V2 Roadmap (Cloud + Auth) | 📋 Suunniteltu | Supabase suositus |

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
| **V2 Roadmap** | `claude-project/ROADMAP_V2_Cloud_Migration.md` |
| CodeMirror 6 docs | https://codemirror.net/docs/ |
| marked.js | https://marked.js.org/ |
| highlight.js | https://highlightjs.org/ |
| DOMPurify | https://github.com/cure53/DOMPurify |
| Supabase (V2) | https://supabase.com/docs |

---

## Muutoshistoria

| Versio | Päivämäärä | Muutokset |
|--------|------------|-----------|
| 1.1 | 2026-01-06 | Päivitetty projektirakenne, status ajan tasalle |
| 1.0 | 2026-01-05 | Ensimmäinen versio |

---

*Päivitä tätä dokumenttia kun lisäät uusia tiedostoja!*
