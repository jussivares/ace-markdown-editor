# PROCESS: Gemini Review (MCP)

> **Versio:** 1.0  
> **Päivitetty:** 2025-01-04  
> **Tiedosto:** PROCESS_Gemini_Review.md

---

## Yleiskatsaus

Gemini toimii **review-kumppanina** Claude-pohjaisessa työnkulussa. Gemini MCP mahdollistaa suoran yhteyden Claude.ai:sta Geminiin ilman manuaalista copy-pastea.

```
┌─────────────────────────────────────────────────────────────┐
│  GEMINI MCP -TYÖNKULKU                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Claude.ai ──► gemini-cli:ask-gemini ──► Gemini API         │
│       ▲                                      │              │
│       └──────────── vastaus ◄────────────────┘              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Käytettävissä olevat työkalut

| Työkalu | Käyttötarkoitus |
|---------|-----------------|
| `gemini-cli:ask-gemini` | Päätyökalu - kysymykset, review, analyysi |
| `gemini-cli:brainstorm` | Ideointisessiot, vaihtoehdot |
| `gemini-cli:Help` | Työkalujen ohjeet |
| `gemini-cli:ping` | Yhteystesti |

---

## Milloin käyttää Geminiä?

### ✅ KÄYTÄ

| Tilanne | Työkalu | Esimerkki |
|---------|---------|-----------|
| SPEC/TECH_SPEC valmis | `ask-gemini` | Review ennen viimeistelyä |
| Koodi valmis reviewattavaksi | `ask-gemini` | Feature-tason review |
| Arkkitehtuuripäätös | `brainstorm` | Vaihtoehtojen kartoitus |
| Epävarmuus | `ask-gemini` | Second opinion |
| Testien kattavuus | `ask-gemini` | Test review |

### ❌ ÄLÄ KÄYTÄ

| Tilanne | Miksi ei |
|---------|----------|
| Rutiinitehtävät | Hidastaa turhaan |
| Selkeät päätökset | Ei lisäarvoa |
| Keskeneräinen työ | Liian aikaista |
| Nopeat korjaukset | Overkill |

---

## Tiedostoviittaukset

Gemini CLI on konfiguroitu näkemään projektimme:
- **Polku:** `C:\Users\Jussi\ClaudeProjektit\claude-planning-tool`
- **Konfiguraatio:** `~/.gemini/settings.json`

### @ -syntaksi

Voit viitata tiedostoihin suoraan promptissa:

```
@docs/specs/TECH_SPEC_03_Context_Manager.md
@src/claude_service.py
@KEHITYSLOKI.md
```

**Huom:** MCP-kontekstissa @ -syntaksi vaatii absoluuttisen polun tai suhteellisen polun projektin juuresta.

---

## Review-promptit

### SPEC Review

```
gemini-cli:ask-gemini prompt="Review this specification. Focus on:
1. Logical completeness - any gaps?
2. Contradictions or ambiguities  
3. Integration risks with other modules
4. Missing edge cases
5. Testability concerns

Be critical but constructive. List issues by priority (CRITICAL/MAJOR/MINOR).

@docs/specs/[TIEDOSTO].md"
```

### Code Review

```
gemini-cli:ask-gemini prompt="Review this code for:
1. Architecture alignment with spec
2. Error handling completeness
3. Test coverage gaps
4. Performance concerns
5. Security considerations

@src/[TIEDOSTO].py"
```

### Test Review

```
gemini-cli:ask-gemini prompt="Review these tests for completeness:
1. Are there missing edge cases?
2. Is naming clear and descriptive?
3. Are assertions comprehensive?
4. Is Arrange-Act-Assert structure followed?

@src/tests/[TIEDOSTO].py"
```

### Brainstorm / Second Opinion

```
gemini-cli:brainstorm prompt="We need to decide between approaches for [KONTEKSTI].

Option A: [kuvaus]
Option B: [kuvaus]

Constraints: [rajoitteet]

What are the tradeoffs? Which do you recommend?"
```

---

## Review-tasot

### Taso 1: Self-Review (Claude Code)
- **Milloin:** Jokaisen taskin jälkeen
- **Fokus:** TDD-compliance, koodin laatu
- **Tulos:** Korjaukset ENNEN etenemistä

### Taso 2: Feature Review (Gemini via MCP)
- **Milloin:** Featuren valmistuttua
- **Fokus:** Arkkitehtuuri, edge cases, kokonaisuus
- **Tulos:** Hyväksyntä tai muutospyynnöt

### Taso 3: Human Review (Jussi)
- **Milloin:** Moduulin valmistuttua / Strategiset päätökset
- **Fokus:** Liiketoiminta, prioriteetit, visio
- **Tulos:** Go/No-Go päätös

---

## Eskalaatioprotokolla

```
┌─────────────────────────────────────────────────────────────┐
│  ESKALAATIOTASOT                                            │
├─────────────────────────────────────────────────────────────┤
│  TASO 1: Claude päättää itse                                │
│    → Nimeäminen, muotoilu, pienet refaktoroinnit            │
│                                                             │
│  TASO 2: Claude + Gemini konsensus                          │
│    → Arkkitehtuurivalinnat, teknologiapäätökset             │
│    → Jos erimielisyys → TASO 3                              │
│                                                             │
│  TASO 3: Ihminen päättää (Jussi)                            │
│    → Strategiset suuntavalinnat                             │
│    → AI:den erimielisyydet                                  │
│    → Riskit ja epävarmuudet                                 │
└─────────────────────────────────────────────────────────────┘
```

### Eskalaatio-template

Kun Claude ja Gemini ovat eri mieltä:

```markdown
⚠️ **ESKALAATIO: AI:t eri mieltä**

**KYSYMYS:** [kuvaus]

**CLAUDE:** [näkemys + perustelut]

**GEMINI:** [näkemys + perustelut]

**Kumman lähestymistavan valitset?**
```

---

## Definition of Done -päivitys

### Feature-Level DoD

- [ ] All tasks complete (task-DoD)
- [ ] All tests pass (`pytest` green)
- [ ] Code coverage >80% (new code)
- [ ] Static analysis passes (`mypy`, `ruff`)
- [ ] Traceability Matrix updated
- [ ] **Gemini feature review approved (via MCP)**
- [ ] KEHITYSLOKI updated

---

## Tekninen konfiguraatio

### Claude Desktop MCP -konfiguraatio

```json
// ~\AppData\Roaming\Claude\claude_desktop_config.json
"gemini-cli": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "gemini-mcp-tool-windows-fixed@latest"],
  "env": {
    "NODE_ENV": "production",
    "DEBUG": ""
  }
}
```

### Gemini CLI -konfiguraatio

```json
// ~/.gemini/settings.json
{
  "security": {
    "auth": {
      "selectedType": "oauth-personal"
    }
  },
  "context": {
    "includeDirectories": [
      "C:\\Users\\Jussi\\ClaudeProjektit\\claude-planning-tool"
    ]
  }
}
```

---

## Vianmääritys

### Yleisimmät ongelmat

| Ongelma | Ratkaisu |
|---------|----------|
| "spawn gemini ENOENT" | Tarkista PATH, käynnistä Desktop uudelleen |
| JSON-varoitukset | Kosmeettisia, voi sivuuttaa |
| @ -syntaksi ei toimi | Käytä absoluuttista polkua |
| Timeout | Lyhennä promptia, käytä Flash-mallia |

### Debug

```
gemini-cli:ping prompt="test"
```

---

## Liittyvät dokumentit

| Dokumentti | Yhteys |
|------------|--------|
| CLAUDE_REFERENCE.md | Review-tasot, DoD |
| PROCESS_Code.md | TDD, self-review |
| RESEARCH_05_Claude_Gemini_Collaboration.md | Tausta-analyysi |
| System Prompt v3.4 | Projektin ohjeet |

---

## Muutoshistoria

| Versio | Päivämäärä | Muutokset |
|--------|------------|-----------|
| 1.0 | 2025-01-04 | Ensimmäinen versio - MCP-integraatio |

---

*Tämä dokumentti kuvaa Gemini MCP:n käytön projektissamme.*
