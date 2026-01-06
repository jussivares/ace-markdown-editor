# ACE Markdown Editor - V2 Roadmap: Cloud Migration

> **Versio:** 1.1  
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
| 1.1 | 2026-01-06 | Restored missing sections: AWS arch, code examples, tech debt |

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

**Supabase-integraatio (esimerkki):**

```javascript
// cloud-storage.js - V2 Supabase client
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export class CloudStorage {
  async saveNote(note) {
    const { data, error } = await supabase
      .from('notes')
      .upsert({
        id: note.id,
        user_id: supabase.auth.getUser().id,
        title: note.title,
        content: note.content,
        emoji: note.emoji,
        updated_at: new Date().toISOString()
      });
    if (error) throw error;
    return data;
  }

  async getAllNotes() {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async deleteNote(id) {
    // Soft delete
    const { error } = await supabase
      .from('notes')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }
}
```

### 3.2 Vaihtoehto B: AWS Native Stack

**Milloin AWS?**
- Tarvitaan täysi kontrolli infrasta
- Suuri skaalautuvuustarve (>10K käyttäjää)
- Olemassa oleva AWS-osaaminen/tili
- Enterprise-tason vaatimukset

```
┌─────────────────────────────────────────────────────────────┐
│                          Browser                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    ACE Editor (JS)                      ││
│  │  ┌──────────┐  ┌─────────────┐  ┌────────────────────┐ ││
│  │  │CodeMirror│  │  AWS SDK    │  │  localStorage      │ ││
│  │  │  marked  │  │  Amplify    │  │  (offline cache)   │ ││
│  │  └──────────┘  └──────┬──────┘  └────────────────────┘ ││
│  └───────────────────────┼─────────────────────────────────┘│
└──────────────────────────┼──────────────────────────────────┘
                           │ HTTPS
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                         AWS Cloud                             │
│                                                               │
│  ┌──────────────┐      ┌──────────────────────────────────┐  │
│  │   Cognito    │      │          API Gateway             │  │
│  │   (Auth)     │      │                                  │  │
│  └──────────────┘      └──────────────┬───────────────────┘  │
│                                       │                       │
│                                       ▼                       │
│                        ┌──────────────────────────────────┐  │
│                        │       Lambda Functions           │  │
│                        │  ┌────────┐ ┌────────┐          │  │
│                        │  │ GET    │ │ POST   │          │  │
│                        │  │ /notes │ │ /notes │          │  │
│                        │  └────────┘ └────────┘          │  │
│                        └──────────────┬───────────────────┘  │
│                                       │                       │
│              ┌────────────────────────┴───────────────────┐  │
│              ▼                                            ▼  │
│  ┌──────────────────────┐              ┌─────────────────┐  │
│  │   RDS PostgreSQL     │      tai     │    DynamoDB     │  │
│  │   (relaatiotiedot)   │              │   (serverless)  │  │
│  └──────────────────────┘              └─────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**AWS-komponentit:**

| Palvelu | Käyttötarkoitus | Kustannus (arvio) |
|---------|-----------------|-------------------|
| Cognito | Käyttäjähallinta | Ilmainen <50K MAU |
| API Gateway | REST API endpoint | ~$3.50/M requests |
| Lambda | Backend-logiikka | ~$0.20/M requests |
| RDS (PostgreSQL) | Tietokanta | ~$15/kk (t3.micro) |
| DynamoDB | Vaihtoehto RDS:lle | ~$1/kk (pieni käyttö) |
| S3 | Liitetiedostot (V3) | ~$0.023/GB |

**PostgreSQL vs DynamoDB:**

| Ominaisuus | PostgreSQL | DynamoDB |
|------------|------------|----------|
| Kyselyt | Monipuoliset (SQL) | Rajoitetut (key-based) |
| Skaalautuvuus | Manuaalinen | Automaattinen |
| Kustannus | Kiinteä baseline | Pay-per-use |
| Relaatiot | Täysi tuki | Ei natiivitukea |
| Full-text search | Sisäänrakennettu | Ei (tarvitsee OpenSearch) |
| **Suositus** | V2-V3 | V4+ (suuri skaalaus) |

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
-- Users (Supabase Auth hoitaa, mutta viittaus)
-- auth.users (id, email, created_at, ...)

-- Notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL DEFAULT 'Untitled Note',
  content TEXT NOT NULL DEFAULT '',
  emoji VARCHAR(10) DEFAULT '📝',  -- User-selected or random
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,  -- Soft delete

  -- Indeksit
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Käyttäjä näkee vain omat notensa
CREATE POLICY "Users can only see own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);

-- Indeksit suorituskykyyn
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_updated_at ON notes(user_id, updated_at DESC);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### 4.2 V3+ Laajennukset (tulevaisuus)

```sql
-- Folders/Tags (V3)
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name VARCHAR(50) NOT NULL,
  parent_id UUID REFERENCES folders(id),
  color VARCHAR(7) DEFAULT '#f0a8a8',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note-Folder relation
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
  shared_with_user_id UUID REFERENCES auth.users(id),
  shared_with_email VARCHAR(255),  -- Voi jakaa ennen rekisteröitymistä
  permission VARCHAR(10) CHECK (permission IN ('read', 'write')),
  share_token VARCHAR(64) UNIQUE,  -- Public link
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Authentication Flow

### 5.1 Tuetut kirjautumismenetelmät (V2)

| Menetelmä | Prioriteetti | Kuvaus |
|-----------|:------------:|--------|
| Magic Link | P0 | Paras UX - salasanaton email-linkki |
| Email + Password | P1 | Perinteinen rekisteröinti |
| Google OAuth | P2 | "Kirjaudu Googlella" |
| Apple OAuth | P2 | "Kirjaudu Applella" (iOS-tuki) |

### 5.2 Auth State Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      App Initialization                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
                   ┌───────────────┐
                   │ Check Session │
                   │  (Supabase)   │
                   └───────┬───────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
    ┌─────────────────┐      ┌─────────────────┐
    │   Logged Out    │      │   Logged In     │
    │                 │      │                 │
    │  Show Login     │      │  Load Notes     │
    │  Screen         │      │  from Cloud     │
    └────────┬────────┘      └────────┬────────┘
             │                        │
             ▼                        ▼
    ┌─────────────────┐      ┌─────────────────┐
    │ Login/Register  │      │ Sync with       │
    │                 │      │ localStorage    │
    │ - Email/Pass    │      │ (offline cache) │
    │ - Magic Link    │      │                 │
    │ - OAuth         │      │                 │
    └────────┬────────┘      └─────────────────┘
             │
             ▼
    ┌─────────────────┐
    │  On Success:    │
    │  Migrate local  │
    │  notes to cloud │
    └─────────────────┘
```

### 5.3 Login UI (Warm Notes -tyyli)

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
│  │           Forgot password?                            │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│          📝 Continue without account (local only)         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 6. Migraatiostrategia (localStorage → Cloud)

### 6.1 Ongelma

Olemassa olevilla käyttäjillä on dataa localStoragessa. Miten siirretään pilveen?

### 6.2 Ratkaisu: Hybrid Storage + Migration Prompt

```javascript
// storage.js - V2 Hybrid approach

export class HybridStorage {
  constructor(cloudStorage, localStorage) {
    this.cloud = cloudStorage;
    this.local = localStorage;
  }

  async initialize() {
    const user = await this.cloud.getCurrentUser();

    if (user) {
      // Kirjautunut - käytä pilveä
      const localNotes = this.local.getAllNotes();

      if (localNotes.length > 0) {
        // Tarjoa migraatiota
        await this.offerMigration(localNotes);
      }

      return this.cloud.getAllNotes();
    } else {
      // Ei kirjautunut - käytä localStoragea (V1 mode)
      return this.local.getAllNotes();
    }
  }

  async offerMigration(localNotes) {
    const confirmed = await showDialog({
      title: `Found ${localNotes.length} local notes`,
      message: 'Upload them to your cloud account?',
      buttons: ['Upload', 'Keep Local', 'Discard']
    });

    if (confirmed === 'Upload') {
      for (const note of localNotes) {
        await this.cloud.saveNote(note);
      }
      // Tyhjennä localStorage onnistuneen migraation jälkeen
      this.local.clear();
      showToast(`✅ Migrated ${localNotes.length} notes to cloud`);
    }
  }

  async saveNote(note) {
    const user = await this.cloud.getCurrentUser();

    if (user) {
      // Tallenna pilveen + local cache
      const saved = await this.cloud.saveNote(note);
      this.local.cacheNote(saved);  // Offline-tuki
      return saved;
    } else {
      return this.local.saveNote(note);
    }
  }
}
```

### 6.3 Offline-first Strategy (V2.1)

```
┌─────────────────────────────────────────────────────────────┐
│                    Save Note Flow                            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
                   ┌───────────────┐
                   │ Save to Local │ ← Aina ensin (nopea)
                   │   Storage     │
                   └───────┬───────┘
                           │
                           ▼
                   ┌───────────────┐
                   │ Online?       │
                   └───────┬───────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
    ┌─────────────────┐      ┌─────────────────┐
    │   YES: Sync     │      │   NO: Queue     │
    │   to Cloud      │      │   for Later     │
    │   immediately   │      │                 │
    └─────────────────┘      └────────┬────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │ When Online:    │
                             │ Process Queue   │
                             │ (background)    │
                             └─────────────────┘
```

---

## 7. Deployment Architecture

### 7.1 Nykyinen (V1) ✅

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

### 7.2 V2 Cloud Edition

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

---

## 8. V2 Roadmap

### 8.1 Vaiheet

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

### 8.2 Task Breakdown

#### Phase 1: V1.5 - UI/UX Polish (2 viikkoa)

| Task | Kuvaus | Arvio | Status |
|:----:|--------|:-----:|:------:|
| UI-01 | Search bar | 3h | 🔲 |
| UI-02 | Keyboard Shortcuts (Ctrl+S, Ctrl+N, etc.) | 2h | 🔲 |
| UI-03 | macOS code block dots | 1h | 🔲 |
| UI-04 | PWA manifest + icons | 2h | 🔲 |
| UI-05 | Word/char count | 1h | 🔲 |
| UI-06 | Unit Tests (Vitest) - storage, preview, utils | 4h | 🔲 |
| UI-07 | iPad-testaus oikealla laitteella | 2h | 🔲 |

#### Phase 2: V2.0 - Cloud MVP (4 viikkoa)

| Task | Kuvaus | Arvio | Riippuvuudet |
|:----:|--------|:-----:|:------------:|
| CL-01 | Supabase-projektin setup | 1h | - |
| CL-02 | Tietokantaskeema (notes table + RLS) | 2h | CL-01 |
| CL-03 | CloudStorage-moduuli (storage.js refaktorointi) | 4h | CL-02 |
| CL-04 | Auth UI (Login/Register/Logout) | 6h | CL-01 |
| CL-05 | Session management (auto-refresh tokens) | 2h | CL-04 |
| CL-06 | Migration flow (localStorage → cloud) | 3h | CL-03, CL-04 |
| CL-07 | User settings (avatar, name) | 2h | CL-04 |
| CL-08 | Error handling (network errors, auth errors) | 3h | CL-03 |

#### Phase 3: V2.1 - Reliability (2 viikkoa)

| Task | Kuvaus | Arvio |
|:----:|--------|:-----:|
| RE-01 | Offline queue (save when back online) | 4h |
| RE-02 | Conflict resolution (last-write-wins / merge) | 6h |
| RE-03 | Realtime sync (Supabase subscriptions) | 4h |
| RE-04 | Service Worker (PWA offline support) | 4h |

#### Phase 4: V3.0 - Features (6 viikkoa)

| Task | Kuvaus | Arvio |
|:----:|--------|:-----:|
| FE-01 | Folders/Collections | 8h |
| FE-02 | Tags | 6h |
| FE-03 | Search (full-text) | 4h |
| FE-04 | Note sharing (read-only links) | 6h |
| FE-05 | Export to Markdown file | 2h |
| FE-06 | Import from Markdown | 3h |
| FE-07 | Collaborative editing (V4 prep) | TBD |

---

## 9. Kustannusarvio

### 9.1 Supabase (Suositus V2)

| Käyttäjämäärä | Tier | Kustannus/kk |
|---------------|------|--------------|
| 1-100 | Free | $0 |
| 100-1000 | Pro | $25 |
| 1000-10000 | Pro + addons | ~$50-100 |
| 10000+ | → AWS migration | Vaihtelee |

### 9.2 AWS (Vertailu)

| Käyttäjämäärä | Komponentit | Kustannus/kk |
|---------------|-------------|--------------|
| 1-100 | Cognito Free + Lambda + DynamoDB | ~$5 |
| 100-1000 | + RDS t3.micro | ~$20-30 |
| 1000-10000 | + RDS t3.small + ElastiCache | ~$100-200 |

**Suositus:** Aloita Supabasella, migroi AWS:lle jos käyttäjämäärä ylittää 10K tai tarvitaan custom-infraa.

---

## 10. Riskit ja mitigaatio

| Riski | Todennäköisyys | Vaikutus | Mitigaatio |
|-------|:--------------:|:--------:|------------|
| Supabase hinnoittelu muuttuu | Keskiverto | Korkea | Abstraktoi storage layer, mahdollista AWS-migraatio |
| Offline-konfliktit | Korkea | Keskiverto | Last-write-wins + merge UI konflikteille |
| Datan menetys migraatiossa | Matala | Kriittinen | Säilytä localStorage backup, varmista ennen poistoa |
| Auth token expiry | Keskiverto | Matala | Auto-refresh, graceful logout |
| CORS-ongelmat | Keskiverto | Matala | Supabase hoitaa automaattisesti |
| Vercel cold starts | Matala | Matala | Ei backendia → ei ongelmaa |
| Mobile performance | Keskiverto | Keskiverto | Lazy loading, virtualization |

---

## 11. Tekninen velka (V1 → V2)

### 11.1 Refaktorointitarpeet

| Komponentti | Muutos | Syy |
|-------------|--------|-----|
| `storage.js` | Abstraktoi interface | Cloud/Local vaihdettavuus |
| `app.js` | Auth state lisäys | Kirjautumistila globaaliin stateen |
| `index.html` | Login-näkymä | Uusi reitti/näkymä |
| Event bus | Auth-eventit | `auth:login`, `auth:logout`, `auth:error` |

### 11.2 Säilytettävät osat (ei muutoksia)

- CodeMirror wrapper (editor.js)
- Preview (preview.js)
- Export (export.js)
- UI/Layout (ui.js, CSS) - vain Login UI lisäys
- Utils (utils.js)

---

## 12. Success Metrics

### 12.1 V2 Launch KPIs

| Metric | Target | Mittaus |
|--------|--------|---------|
| Registered users (30d) | 100+ | Supabase Auth |
| Daily Active Users | 20+ | Plausible Analytics |
| Notes created | 500+ | Database count |
| Cloud sync errors | <1% | Error logging |
| Page load time | <2s | Vercel Analytics |

### 12.2 Analytics Setup (V1.5)

```html
<!-- Plausible (privacy-friendly) -->
<script defer data-domain="ace-editor.app" 
  src="https://plausible.io/js/script.js"></script>
```

---

## 13. Liitteet

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

### C. Environment Variables (.env)

```env
# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Analytics (optional)
VITE_PLAUSIBLE_DOMAIN=ace-editor.app

# Optional: AWS alternative
# AWS_REGION=eu-north-1
# AWS_COGNITO_USER_POOL_ID=eu-north-1_xxx
# AWS_COGNITO_CLIENT_ID=xxx
```

### D. Useful Links

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth JS](https://supabase.com/docs/reference/javascript/auth-signup)
- [Supabase + Vercel Integration](https://vercel.com/integrations/supabase)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [AWS Amplify](https://docs.amplify.aws/) (vaihtoehto)
- [PWA Manifest Generator](https://www.simicart.com/manifest-generator.html)
- [Plausible Analytics](https://plausible.io)

---

## 14. Session #4 Huomiot (Claude.ai Review)

### Lisätyt parannukset v1.0:

1. **V1.0 status päivitetty** - Vercel deploy ✅, live URL lisätty
2. **V1.5 backlog** - UI polish taskit eritelty (search, shortcuts, macOS dots)
3. **Emoji persistence** - Lisätty `emoji` kenttä tietokantaskeemaan
4. **PWA-ohjeet** - Manifest ja Service Worker suunnitelmat
5. **Analytics** - Plausible-integraatio ehdotus
6. **Success metrics** - KPI:t V2 launchille
7. **Timeline tarkennettu** - Realistiset arviot viikoissa
8. **File structure** - V2 kansiorakenne

### Palautetut osiot v1.1:

9. **AWS arkkitehtuurikaavio** - Täysi ASCII-kaavio
10. **PostgreSQL vs DynamoDB** - Vertailutaulukko
11. **CloudStorage koodiesimerkki** - Supabase client
12. **HybridStorage koodi** - Migraatiologiikka
13. **Auth State Flow kaavio** - Visualisointi
14. **Offline-first kaavio** - V2.1 strategia
15. **Tekninen velka osio** - Refaktorointitarpeet
16. **.env esimerkki** - AWS vaihtoehdot mukana

### Seuraavat askeleet:

1. **Tällä viikolla:** V1.5 UI polish (search, shortcuts)
2. **Ensi viikolla:** Supabase-projektin setup
3. **2 viikon päästä:** Auth UI mockup + TECH_SPEC_02

---

*Dokumentti: V2 Cloud Migration Roadmap*  
*Versio: 1.1 (Complete)*
*Reviewed: Claude.ai Session #4*  
*Status: Approved for V1.5 implementation*
