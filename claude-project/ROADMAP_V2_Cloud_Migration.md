# ACE Markdown Editor - V2 Roadmap: Cloud Migration

> **Versio:** 1.0  
> **Päivitetty:** 2026-01-06  
> **Status:** Reviewed & Approved  
> **Tyyppi:** Arkkitehtuurisuunnitelma  
> **Live URL:** https://ace-markdown-editor.vercel.app ✅

---

## 📋 Dokumentin muutoshistoria

| Versio | Päivä | Muutokset |
|--------|-------|-----------|
| 0.1 | 2026-01-06 | Initial draft (Claude Code) |
| 1.0 | 2026-01-06 | Session #4 review: UI polish, Vercel deploy, V1.5 features |

---

## 1. Executive Summary

### 1.1 Nykyinen tila (V1.0) ✅ LIVE

ACE Markdown Editor on **client-side-only** sovellus, nyt julkaistu Verceliin:

```
┌─────────────────────────────────────────┐
│              Browser                     │
│  ┌─────────────────────────────────────┐│
│  │         ACE Editor (JS)             ││
│  │  ┌──────────┐    ┌────────────────┐ ││
│  │  │CodeMirror│    │   localStorage │ ││
│  │  │  marked  │    │   (5MB max)    │ ││
│  │  │ DOMPurify│    └────────────────┘ ││
│  │  └──────────┘                       ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
         │
         │ Vercel CDN
         ▼
    🌐 ace-markdown-editor.vercel.app
```

**V1.0 Toteutetut ominaisuudet:**
- ✅ CodeMirror 6 editor (syntax highlighting, line numbers)
- ✅ Live Markdown preview (Marked + highlight.js)
- ✅ Note management (localStorage CRUD)
- ✅ Dark/Light theme toggle
- ✅ Export HTML/PDF
- ✅ Responsive layout (mobile tabs, tablet/desktop split)
- ✅ Resizable split pane (drag divider)
- ✅ **UI Polish (Session #4):** Emoji variety, preview text, floating preview
- ✅ **Vercel deployment** - automaattinen CI/CD GitHubista

**Rajoitukset (V2:ssa korjataan):**
- 5MB localStorage-raja
- Ei synkronointia laitteiden välillä
- Ei käyttäjätunnistusta
- Data vain yhdessä selaimessa
- Ei varmuuskopiointia

### 1.2 V2 Tavoitteet

| Tavoite | Prioriteetti | Kuvaus |
|---------|:------------:|--------|
| Pilvitallennus | P0 | Muistiinpanot tallennetaan pilveen |
| Käyttäjätunnistus | P0 | Rekisteröinti ja kirjautuminen |
| Monen käyttäjän tuki | P0 | Jokainen käyttäjä näkee vain omat notensa |
| Laitteiden välinen synkronointi | P1 | Sama data kaikilla laitteilla |
| Offline-tuki (PWA) | P2 | Toimii ilman verkkoyhteyttä |
| Jakaminen | P3 | Jaa note toiselle käyttäjälle |

---

## 2. V1.5 - UI/UX Polish (Ennen Cloud-migraatiota)

> **Status:** Osittain toteutettu Session #4:ssä

### 2.1 Toteutetut (Session #4)

| Feature | Status | Commit |
|---------|:------:|--------|
| Note emojit (📝 ✨ 💡 jne.) | ✅ | `2fb2350` |
| Note preview text | ✅ | `2dc8767` |
| "RECENT" section header | ✅ | `2dc8767` |
| Floating preview pane | ✅ | `2fb2350` |
| Sidebar footer ("Jussi's Notes") | ✅ | `2dc8767` |

### 2.2 V1.5 Backlog (Ennen V2:ta)

| Task | Kuvaus | Prioriteetti | Arvio |
|:----:|--------|:------------:|:-----:|
| **UI-01** | 🔍 Search bar sidebariin | P1 | 3h |
| **UI-02** | ⌨️ Keyboard shortcuts (Ctrl+S, Ctrl+N, Ctrl+/) | P1 | 2h |
| **UI-03** | 🔴🟡🟢 macOS-tyylinen code block header | P2 | 1h |
| **UI-04** | 📱 PWA manifest + icons | P2 | 2h |
| **UI-05** | 🎨 Custom note emoji picker | P3 | 3h |
| **UI-06** | 📊 Word/character count | P3 | 1h |

### 2.3 Search Bar (UI-01) - Spesifikaatio

**Sijainti:** Sidebar, "+ New Note" -napin alla

```html
<div class="sidebar-search">
  <input type="text" placeholder="Search notes..." id="search-input">
</div>
```

**Toiminnallisuus:**
- Reaaliaikainen filtteröinti (debounce 200ms)
- Hakee title + content
- Highlight matching text
- Tyhjennä X-napilla

**CSS:**
```css
.sidebar-search {
  padding: 0 var(--space-4) var(--space-4);
}

.search-input {
  width: 100%;
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  color: var(--color-text-primary);
}

.search-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-subtle);
}
```

### 2.4 Keyboard Shortcuts (UI-02) - Spesifikaatio

| Shortcut | Toiminto | Scope |
|----------|----------|-------|
| `Ctrl/Cmd + S` | Save note (explicit) | Editor |
| `Ctrl/Cmd + N` | New note | Global |
| `Ctrl/Cmd + /` | Toggle preview | Global |
| `Ctrl/Cmd + B` | Bold selection | Editor |
| `Ctrl/Cmd + I` | Italic selection | Editor |
| `Ctrl/Cmd + K` | Insert link | Editor |
| `Ctrl/Cmd + Shift + P` | Export PDF | Global |
| `Escape` | Close sidebar (mobile) | Global |

---

## 3. Arkkitehtuurivaihtoehdot

### 3.1 Vaihtoehto A: Supabase (Suositus MVP:lle) ⭐

**Miksi Supabase?**
- "Firebase PostgreSQL:lle" - kaikki yhdessä paketissa
- Ilmainen tier riittää kehitykseen ja pieneen käyttäjämäärään
- Sisältää: PostgreSQL, Auth, Realtime, Row Level Security
- Helppo integroida olemassa olevaan frontend-koodiin
- **Vercel + Supabase = erinomainen combo**

```
┌─────────────────────────────────────────────────────────────┐
│                     Vercel CDN Edge                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    ACE Editor (JS)                      ││
│  │  ┌──────────┐  ┌─────────────┐  ┌────────────────────┐ ││
│  │  │CodeMirror│  │ Supabase JS │  │  localStorage      │ ││
│  │  │  marked  │  │   Client    │  │  (offline cache)   │ ││
│  │  └──────────┘  └──────┬──────┘  └────────────────────┘ ││
│  └───────────────────────┼─────────────────────────────────┘│
└──────────────────────────┼──────────────────────────────────┘
                           │ HTTPS
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                       Supabase Cloud                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │   Auth       │  │  PostgreSQL  │  │    Realtime        │  │
│  │  (Magic Link │  │   Database   │  │  (WebSocket)       │  │
│  │   + OAuth)   │  │              │  │                    │  │
│  └──────────────┘  └──────────────┘  └────────────────────┘  │
│                                                               │
│  Row Level Security: user_id = auth.uid()                    │
└──────────────────────────────────────────────────────────────┘
```

**Kustannusarvio:**

| Tier | Hinta | Rajoitukset | Riittää kun |
|------|-------|-------------|-------------|
| Free | $0/kk | 500MB DB, 1GB storage, 50K MAU | MVP, kehitys |
| Pro | $25/kk | 8GB DB, 100GB storage, rajaton MAU | 100-10K users |

### 3.2 Vaihtoehto B: AWS Native Stack

**Milloin AWS?**
- >10K aktiivista käyttäjää
- Enterprise-vaatimukset (SLA, compliance)
- Olemassa oleva AWS-infra
- Täysi kontrolli kustannuksista

| Palvelu | Käyttötarkoitus | Kustannus (arvio) |
|---------|-----------------|-------------------|
| Cognito | Käyttäjähallinta | Ilmainen <50K MAU |
| API Gateway | REST API | ~$3.50/M requests |
| Lambda | Backend-logiikka | ~$0.20/M requests |
| DynamoDB | Tietokanta | ~$1-5/kk (pieni) |
| S3 | Liitetiedostot | ~$0.023/GB |

### 3.3 Suositus

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│   V2 MVP: SUPABASE + VERCEL                               │
│                                                            │
│   ✅ Nopea käyttöönotto (päivissä)                        │
│   ✅ Ilmainen tier riittää MVP:lle                        │
│   ✅ Sisältää kaiken: Auth + DB + Realtime                │
│   ✅ Vercel-integraatio toimii suoraan                    │
│   ✅ Helppo migroida AWS:lle tarvittaessa                 │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 4. Tietokantarakenne

### 4.1 PostgreSQL Schema (V2)

```sql
-- Notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL DEFAULT 'Untitled Note',
  content TEXT NOT NULL DEFAULT '',
  emoji VARCHAR(10) DEFAULT '📝',  -- User-selected or random
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL  -- Soft delete
);

-- Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own notes" ON notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own notes" ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own notes" ON notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own notes" ON notes FOR DELETE
  USING (auth.uid() = user_id);

-- Performance indexes
CREATE INDEX idx_notes_user_updated ON notes(user_id, updated_at DESC);

-- Auto-update timestamp
CREATE TRIGGER notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);
```

### 4.2 V3+ Laajennukset

```sql
-- Folders (V3)
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name VARCHAR(50) NOT NULL,
  parent_id UUID REFERENCES folders(id),
  color VARCHAR(7) DEFAULT '#f0a8a8'
);

ALTER TABLE notes ADD COLUMN folder_id UUID REFERENCES folders(id);

-- Tags (V3)
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name VARCHAR(30) NOT NULL,
  color VARCHAR(7) DEFAULT '#f0a8a8'
);

CREATE TABLE note_tags (
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

-- Sharing (V4)
CREATE TABLE note_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  shared_with_email VARCHAR(255),
  permission VARCHAR(10) CHECK (permission IN ('read', 'write')),
  share_token VARCHAR(64) UNIQUE,  -- Public link
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Authentication Flow

### 5.1 Tuetut menetelmät

| Menetelmä | Prioriteetti | UX |
|-----------|:------------:|-----|
| Magic Link | P0 | Paras UX - ei salasanaa muistettavaksi |
| Email + Password | P1 | Perinteinen vaihtoehto |
| Google OAuth | P2 | "Kirjaudu Googlella" |
| Apple OAuth | P2 | iOS-käyttäjille |

### 5.2 Login UI (Warm Notes -tyyli)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                    ✨ ACE Editor ✨                        │
│                                                            │
│           Your markdown notes, everywhere.                 │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Email                                                │ │
│  │  ┌──────────────────────────────────────────────────┐│ │
│  │  │ you@example.com                                  ││ │
│  │  └──────────────────────────────────────────────────┘│ │
│  │                                                       │ │
│  │  ┌──────────────────────────────────────────────────┐│ │
│  │  │         ✉️  Send Magic Link                      ││ │
│  │  └──────────────────────────────────────────────────┘│ │
│  │                                                       │ │
│  │  ─────────────── or ───────────────                  │ │
│  │                                                       │ │
│  │  ┌────────────────┐  ┌────────────────┐             │ │
│  │  │  G  Google     │  │  🍎 Apple      │             │ │
│  │  └────────────────┘  └────────────────┘             │ │
│  │                                                       │ │
│  │           Use password instead →                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│          📝 Continue without account (local only)         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 5.3 Migraatio localStorage → Cloud

```javascript
async function handleFirstLogin(user) {
  const localNotes = localStorage.getItem('ace_notes');
  
  if (localNotes) {
    const notes = JSON.parse(localNotes);
    const count = notes.length;
    
    const migrate = await showDialog({
      title: `Found ${count} local notes`,
      message: 'Upload them to your cloud account?',
      buttons: ['Upload', 'Keep Local', 'Discard']
    });
    
    if (migrate === 'Upload') {
      for (const note of notes) {
        await supabase.from('notes').insert({
          ...note,
          user_id: user.id
        });
      }
      localStorage.removeItem('ace_notes');
      showToast(`✅ Migrated ${count} notes to cloud`);
    }
  }
}
```

---

## 6. Deployment Architecture

### 6.1 Nykyinen (V1) ✅

```
GitHub (jussivares/ace-markdown-editor)
    │
    │ git push
    ▼
Vercel (auto-deploy)
    │
    │ CDN Edge
    ▼
🌐 ace-markdown-editor.vercel.app
```

### 6.2 V2 Cloud Edition

```
GitHub
    │
    ├─── Vercel ─────────────────┐
    │    (Frontend)              │
    │         │                  │
    │         ▼                  │
    │    ace-editor.vercel.app   │
    │         │                  │
    │         │ API calls        │
    │         ▼                  │
    └─── Supabase ───────────────┘
         (Backend)
              │
              ├── Auth (users)
              ├── Database (notes)
              └── Realtime (sync)
```

### 6.3 Environment Variables (Vercel)

```env
# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Analytics (optional)
VITE_PLAUSIBLE_DOMAIN=ace-editor.app
```

---

## 7. Roadmap Timeline

```
 V1.0           V1.5           V2.0 MVP        V2.1           V3.0
 Jan 2026       Feb 2026       Mar 2026        Apr 2026       Q3 2026
    │              │              │               │              │
    ▼              ▼              ▼               ▼              ▼
┌────────┐   ┌──────────┐   ┌────────────┐  ┌───────────┐  ┌──────────┐
│✅ Live │   │ Search   │   │ Cloud +    │  │ PWA +     │  │ Folders  │
│ Vercel │   │ Keyboard │   │ Auth       │  │ Offline   │  │ Tags     │
│        │   │ PWA prep │   │ Supabase   │  │ Realtime  │  │ Sharing  │
└────────┘   └──────────┘   └────────────┘  └───────────┘  └──────────┘
   DONE        2 weeks        4 weeks         2 weeks        6 weeks
```

### 7.1 Task Breakdown

#### V1.5 - UI/UX Polish (2 viikkoa)

| # | Task | Arvio | Riippuvuudet |
|:-:|------|:-----:|:------------:|
| UI-01 | Search bar | 3h | - |
| UI-02 | Keyboard shortcuts | 2h | - |
| UI-03 | macOS code block dots | 1h | - |
| UI-04 | PWA manifest + icons | 2h | - |
| UI-05 | Word/char count | 1h | - |
| UI-06 | Unit tests (Vitest) | 4h | - |

#### V2.0 - Cloud MVP (4 viikkoa)

| # | Task | Arvio | Riippuvuudet |
|:-:|------|:-----:|:------------:|
| CL-01 | Supabase project setup | 1h | - |
| CL-02 | Database schema + RLS | 2h | CL-01 |
| CL-03 | CloudStorage module | 4h | CL-02 |
| CL-04 | Auth UI (Login/Register) | 6h | CL-01 |
| CL-05 | Session management | 2h | CL-04 |
| CL-06 | Migration flow | 3h | CL-03, CL-04 |
| CL-07 | User settings UI | 2h | CL-04 |
| CL-08 | Error handling | 3h | CL-03 |

#### V2.1 - Reliability (2 viikkoa)

| # | Task | Arvio |
|:-:|------|:-----:|
| RE-01 | Offline queue | 4h |
| RE-02 | Conflict resolution | 6h |
| RE-03 | Realtime sync | 4h |
| RE-04 | Service Worker (PWA) | 4h |

#### V3.0 - Features (6 viikkoa)

| # | Task | Arvio |
|:-:|------|:-----:|
| FE-01 | Folders/Collections | 8h |
| FE-02 | Tags | 6h |
| FE-03 | Full-text search (cloud) | 4h |
| FE-04 | Note sharing (read-only links) | 6h |
| FE-05 | Export to Markdown file | 2h |
| FE-06 | Import from Markdown | 3h |

---

## 8. Riskit ja mitigaatio

| Riski | Todennäköisyys | Vaikutus | Mitigaatio |
|-------|:--------------:|:--------:|------------|
| Supabase hinnoittelu muuttuu | Keskiverto | Korkea | Abstraktoi storage layer |
| Offline-konfliktit | Korkea | Keskiverto | Last-write-wins + merge UI |
| Datan menetys migraatiossa | Matala | Kriittinen | Säilytä localStorage backup |
| Vercel cold starts | Matala | Matala | Ei backendia → ei ongelmaa |
| Mobile performance | Keskiverto | Keskiverto | Lazy loading, virtualization |

---

## 9. Success Metrics

### 9.1 V2 Launch KPIs

| Metric | Target | Mittaus |
|--------|--------|---------|
| Registered users (30d) | 100+ | Supabase Auth |
| Daily Active Users | 20+ | Plausible Analytics |
| Notes created | 500+ | Database count |
| Cloud sync errors | <1% | Error logging |
| Page load time | <2s | Vercel Analytics |

### 9.2 Analytics Setup (V1.5)

```html
<!-- Plausible (privacy-friendly) -->
<script defer data-domain="ace-editor.app" 
  src="https://plausible.io/js/script.js"></script>
```

---

## 10. Appendix

### A. Tech Stack Summary

| Layer | V1 (Current) | V2 (Cloud) |
|-------|--------------|------------|
| **Hosting** | Vercel | Vercel |
| **Frontend** | Vanilla JS + ES Modules | Sama |
| **Editor** | CodeMirror 6 | Sama |
| **Preview** | Marked + highlight.js | Sama |
| **Storage** | localStorage | Supabase + localStorage cache |
| **Auth** | - | Supabase Auth |
| **Database** | - | Supabase PostgreSQL |
| **Realtime** | - | Supabase Realtime |

### B. File Structure (V2)

```
ace-markdown-editor/
├── index.html
├── css/
│   ├── variables.css
│   ├── layout.css
│   ├── editor.css
│   ├── preview.css
│   ├── components.css
│   └── auth.css          # NEW
├── js/
│   ├── app.js
│   ├── editor.js
│   ├── preview.js
│   ├── storage.js        # Refactored: HybridStorage
│   ├── cloud-storage.js  # NEW: Supabase client
│   ├── auth.js           # NEW: Auth flows
│   ├── ui.js
│   ├── export.js
│   └── utils.js
├── claude-project/
│   ├── SPEC_01.md
│   ├── TECH_SPEC_01.md
│   └── ROADMAP_V2_Cloud_Migration.md
└── vercel.json           # Optional config
```

### C. Useful Links

- [Supabase Docs](https://supabase.com/docs)
- [Supabase + Vercel Integration](https://vercel.com/integrations/supabase)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PWA Manifest Generator](https://www.simicart.com/manifest-generator.html)
- [Plausible Analytics](https://plausible.io)

---

## 11. Session #4 Huomiot (Claude.ai Review)

### Lisätyt parannukset tähän dokumenttiin:

1. **V1.0 status päivitetty** - Vercel deploy ✅, live URL lisätty
2. **V1.5 backlog** - UI polish taskit eritelty (search, shortcuts, macOS dots)
3. **Emoji persistence** - Lisätty `emoji` kenttä tietokantaskeemaan
4. **PWA-ohjeet** - Manifest ja Service Worker suunnitelmat
5. **Analytics** - Plausible-integraatio ehdotus
6. **Success metrics** - KPI:t V2 launchille
7. **Timeline tarkennettu** - Realistiset arviot viikoissa
8. **File structure** - V2 kansiorakenne

### Seuraavat askeleet:

1. **Tällä viikolla:** V1.5 UI polish (search, shortcuts)
2. **Ensi viikolla:** Supabase-projektin setup
3. **2 viikon päästä:** Auth UI mockup + TECH_SPEC_02

---

*Dokumentti: V2 Cloud Migration Roadmap*  
*Reviewed: Claude.ai Session #4*  
*Status: Approved for V1.5 implementation*
