# ACE Markdown Editor 📝

> **Versio:** 0.1.0 (MVP kehityksessä)  
> **Päivitetty:** 2026-01-05

iPad-first Markdown-muistiinpanoeditori reaaliaikaisella esikatselulla.

---

## 🎯 Mikä tämä on?

ACE Markdown Editor on selainpohjainen muistiinpanoeditori, joka on optimoitu **iPad 12,9"** -käyttöön. Kaikki toimii client-side ilman backendiä.

**Pääominaisuudet:**
- Split-pane layout (editor + live preview)
- Markdown-syntaksin korostus editorissa (CodeMirror 6)
- Koodiblokkien syntaksikorostus previewssa (highlight.js)
- Muistiinpanojen hallinta (localStorage)
- HTML- ja PDF-export
- Dark/Light -teema
- Responsiivinen (iPad, desktop, mobile)

---

## 📱 Tuetut alustat

| Alusta | Tuki | Layout |
|--------|------|--------|
| iPad 12,9" (landscape) | ⭐ Ensisijainen | Split-pane |
| iPad 12,9" (portrait) | ⭐ Ensisijainen | Edit/Preview tabs |
| Desktop | ✅ Täysi | Split-pane |
| Mobile | ✅ Täysi | Edit/Preview tabs |

---

## 🛠️ Teknologia

| Komponentti | Teknologia |
|-------------|------------|
| Editor | CodeMirror 6 |
| Markdown | marked.js |
| Code highlighting | highlight.js |
| Sanitizer | DOMPurify |
| Storage | localStorage |

---

## 📁 Projektirakenne

```
ace-markdown-editor/
├── docs/
│   ├── SPEC_01_ACE_Markdown_Editor.md   ← Toiminnallinen määrittely
│   ├── process/                          ← Prosessiohjeet
│   └── templates/                        ← Dokumenttitemplatet
├── src/                                  ← Sovelluksen lähdekoodi (tulossa)
├── .gitignore
└── README.md
```

---

## 🚀 Kehityksen tila

| Vaihe | Status |
|-------|--------|
| SPEC (määrittely) | ✅ Valmis |
| TECH_SPEC (tekninen) | 🔲 Seuraava |
| CODE (toteutus) | 🔲 Odottaa |
| TEST (testaus) | 🔲 Odottaa |

---

## 📄 Dokumentaatio

- [SPEC_01: Toiminnallinen määrittely](docs/SPEC_01_ACE_Markdown_Editor.md)

---

## 📄 Lisenssi

MIT License

---

*Built with ❤️ and AI assistance*
