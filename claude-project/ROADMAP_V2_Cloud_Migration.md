# ACE Markdown Editor - V2 Roadmap: Cloud Migration

> **Versio:** 0.1 (Draft)
> **Päivitetty:** 2026-01-06
> **Status:** Suunnittelu
> **Tyyppi:** Arkkitehtuurisuunnitelma

---

## 1. Executive Summary

### 1.1 Nykyinen tila (V1)

ACE Markdown Editor on **client-side-only** sovellus:

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
```

**Rajoitukset:**
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
| Offline-tuki | P2 | Toimii ilman verkkoyhteyttä |
| Jakaminen | P3 | Jaa note toiselle käyttäjälle |

---

## 2. Arkkitehtuurivaihtoehdot

### 2.1 Vaihtoehto A: Supabase (Suositus MVP:lle)

**Miksi Supabase?**
- "Firebase PostgreSQL:lle" - kaikki yhdessä paketissa
- Ilmainen tier riittää kehitykseen ja pieneen käyttäjämäärään
- Sisältää: PostgreSQL, Auth, Realtime, Row Level Security
- Helppo integroida olemassa olevaan frontend-koodiin

```
┌─────────────────────────────────────────────────────────────┐
│                          Browser                             │
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
│  │  (Cognito-   │  │   Database   │  │  (WebSocket)       │  │
│  │   tyylinen)  │  │              │  │                    │  │
│  └──────────────┘  └──────────────┘  └────────────────────┘  │
│                                                               │
│  Row Level Security: user_id = auth.uid()                    │
└──────────────────────────────────────────────────────────────┘
```

**Kustannusarvio:**
| Tier | Hinta | Rajoitukset |
|------|-------|-------------|
| Free | $0/kk | 500MB DB, 1GB storage, 50K MAU |
| Pro | $25/kk | 8GB DB, 100GB storage, rajaton MAU |

**Supabase-integraatio (esimerkki):**

```javascript
// storage.js - V2 refaktorointi
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xxx.supabase.co',
  'public-anon-key'
);

export class CloudStorage {
  async saveNote(note) {
    const { data, error } = await supabase
      .from('notes')
      .upsert({
        id: note.id,
        user_id: supabase.auth.user().id,
        title: note.title,
        content: note.content,
        updated_at: new Date().toISOString()
      });
    return data;
  }

  async getAllNotes() {
    const { data } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });
    return data;
  }
}
```

---

### 2.2 Vaihtoehto B: AWS Native Stack

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

---

### 2.3 Suositus

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│   V2 MVP: SUPABASE                                        │
│                                                            │
│   - Nopea käyttöönotto (päivissä, ei viikoissa)          │
│   - Ilmainen tier riittää kehitykseen                    │
│   - Sisältää kaiken: Auth + DB + Realtime                │
│   - Helppo migroida AWS:lle myöhemmin tarvittaessa       │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 3. Tietokantarakenne

### 3.1 PostgreSQL Schema

```sql
-- Users (Supabase Auth hoitaa, mutta viittaus)
-- auth.users (id, email, created_at, ...)

-- Notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL DEFAULT 'Untitled Note',
  content TEXT NOT NULL DEFAULT '',
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

### 3.2 V3+ Laajennukset (tulevaisuus)

```sql
-- Folders/Tags (V3)
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name VARCHAR(50) NOT NULL,
  parent_id UUID REFERENCES folders(id),
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Authentication Flow

### 4.1 Tuetut kirjautumismenetelmät (V2)

| Menetelmä | Prioriteetti | Kuvaus |
|-----------|:------------:|--------|
| Email + Password | P0 | Perinteinen rekisteröinti |
| Magic Link | P1 | Salasanaton email-linkki |
| Google OAuth | P2 | "Kirjaudu Googlella" |
| Apple OAuth | P2 | "Kirjaudu Applella" (iOS-tuki) |

### 4.2 Auth State Flow

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

### 4.3 UI-komponentit (Auth)

```
┌────────────────────────────────────────────────────────────┐
│                     Login Screen                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│                    ACE Markdown Editor                     │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Email                                                │ │
│  │  ┌──────────────────────────────────────────────────┐│ │
│  │  │ user@example.com                                 ││ │
│  │  └──────────────────────────────────────────────────┘│ │
│  │                                                       │ │
│  │  Password                                             │ │
│  │  ┌──────────────────────────────────────────────────┐│ │
│  │  │ ••••••••                                         ││ │
│  │  └──────────────────────────────────────────────────┘│ │
│  │                                                       │ │
│  │  ┌──────────────────────────────────────────────────┐│ │
│  │  │              Sign In                             ││ │
│  │  └──────────────────────────────────────────────────┘│ │
│  │                                                       │ │
│  │  ─────────────── or ───────────────                  │ │
│  │                                                       │ │
│  │  ┌────────────────┐  ┌────────────────┐             │ │
│  │  │  G  Google     │  │  🍎 Apple      │             │ │
│  │  └────────────────┘  └────────────────┘             │ │
│  │                                                       │ │
│  │  Don't have an account? Sign up                      │ │
│  │  Forgot password?                                     │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 5. Migraatiostrategia (localStorage → Cloud)

### 5.1 Ongelma

Olemassa olevilla käyttäjillä on dataa localStoragessa. Miten siirretään pilveen?

### 5.2 Ratkaisu: Hybrid Storage + Migration Prompt

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
    const confirmed = confirm(
      `Found ${localNotes.length} local notes. ` +
      `Would you like to upload them to your cloud account?`
    );

    if (confirmed) {
      for (const note of localNotes) {
        await this.cloud.saveNote(note);
      }
      // Tyhjennä localStorage onnistuneen migraation jälkeen
      this.local.clear();
      showToast(`Migrated ${localNotes.length} notes to cloud`, 'success');
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

### 5.3 Offline-first Strategy (V2.1)

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

## 6. V2 Roadmap

### 6.1 Vaiheet

```
 V1.0 (Nyt)     V1.5           V2.0 MVP        V2.1           V3.0
    │             │               │               │              │
    ▼             ▼               ▼               ▼              ▼
┌────────┐  ┌──────────┐  ┌────────────┐  ┌───────────┐  ┌──────────┐
│Local   │  │Keyboard  │  │Cloud +     │  │Offline    │  │Folders   │
│Storage │  │Shortcuts │  │Auth MVP    │  │Support    │  │& Tags    │
│Only    │  │+ Unit    │  │            │  │           │  │          │
│        │  │Tests     │  │            │  │           │  │          │
└────────┘  └──────────┘  └────────────┘  └───────────┘  └──────────┘
   Done       Next          Q1 2026        Q2 2026        Q3 2026
```

### 6.2 Task Breakdown

#### Phase 1: V1.5 - Foundation Completion (Current Sprint)

| Task | Kuvaus | Arvio | Status |
|:----:|--------|:-----:|:------:|
| Task-10 | Keyboard Shortcuts (Ctrl+S, Ctrl+N, etc.) | 2h | 🔲 |
| Task-11 | Unit Tests (Vitest) - storage, preview, utils | 3h | ▶ |
| Task-12 | iPad-testaus oikealla laitteella | 2h | 🔲 |

#### Phase 2: V2.0 - Cloud MVP

| Task | Kuvaus | Arvio | Riippuvuudet |
|:----:|--------|:-----:|:------------:|
| Task-20 | Supabase-projektin setup | 1h | - |
| Task-21 | Tietokantaskeema (notes table + RLS) | 2h | Task-20 |
| Task-22 | CloudStorage-moduuli (storage.js refaktorointi) | 4h | Task-21 |
| Task-23 | Auth UI (Login/Register/Logout) | 6h | Task-20 |
| Task-24 | Session management (auto-refresh tokens) | 2h | Task-23 |
| Task-25 | Migration flow (localStorage → cloud) | 3h | Task-22, Task-23 |
| Task-26 | User settings (avatar, name) | 2h | Task-23 |
| Task-27 | Error handling (network errors, auth errors) | 3h | Task-22 |

#### Phase 3: V2.1 - Reliability

| Task | Kuvaus | Arvio |
|:----:|--------|:-----:|
| Task-30 | Offline queue (save when back online) | 4h |
| Task-31 | Conflict resolution (last-write-wins / merge) | 6h |
| Task-32 | Realtime sync (Supabase subscriptions) | 4h |
| Task-33 | Service Worker (PWA offline support) | 4h |

#### Phase 4: V3.0 - Features

| Task | Kuvaus | Arvio |
|:----:|--------|:-----:|
| Task-40 | Folders/Collections | 8h |
| Task-41 | Tags | 6h |
| Task-42 | Search (full-text) | 4h |
| Task-43 | Note sharing (read-only links) | 6h |
| Task-44 | Collaborative editing (V4 prep) | TBD |

---

## 7. Kustannusarvio

### 7.1 Supabase (Suositus V2)

| Käyttäjämäärä | Tier | Kustannus/kk |
|---------------|------|--------------|
| 1-100 | Free | $0 |
| 100-1000 | Pro | $25 |
| 1000-10000 | Pro + addons | ~$50-100 |
| 10000+ | → AWS migration | Vaihtelee |

### 7.2 AWS (Vertailu)

| Käyttäjämäärä | Komponentit | Kustannus/kk |
|---------------|-------------|--------------|
| 1-100 | Cognito Free + Lambda + DynamoDB | ~$5 |
| 100-1000 | + RDS t3.micro | ~$20-30 |
| 1000-10000 | + RDS t3.small + ElastiCache | ~$100-200 |

**Suositus:** Aloita Supabasella, migroi AWS:lle jos käyttäjämäärä ylittää 10K tai tarvitaan custom-infraa.

---

## 8. Riskit ja mitigaatio

| Riski | Todennäköisyys | Vaikutus | Mitigaatio |
|-------|:--------------:|:--------:|------------|
| Supabase hinnoittelu muuttuu | Keskiverto | Korkea | Abstraktoi storage layer, mahdollista AWS-migraatio |
| Offline-konfliktit | Korkea | Keskiverto | Last-write-wins + merge UI konflikteille |
| Datan menetys migraatiossa | Matala | Kriittinen | Säilytä localStorage backup, varmista ennen poistoa |
| Auth token expiry | Keskiverto | Matala | Auto-refresh, graceful logout |
| CORS-ongelmat | Keskiverto | Matala | Supabase hoitaa automaattisesti |

---

## 9. Tekninen velka (V1 → V2)

### 9.1 Refaktorointitarpeet

| Komponentti | Muutos | Syy |
|-------------|--------|-----|
| `storage.js` | Abstraktoi interface | Cloud/Local vaihdettavuus |
| `app.js` | Auth state lisäys | Kirjautumistila globaaliin stateen |
| `index.html` | Login-näkymä | Uusi reitti/näkymä |
| Event bus | Auth-eventit | `auth:login`, `auth:logout`, `auth:error` |

### 9.2 Säilytettävät osat

- CodeMirror wrapper (editor.js) - ei muutoksia
- Preview (preview.js) - ei muutoksia
- Export (export.js) - ei muutoksia
- UI/Layout (ui.js, CSS) - vain Login UI lisäys
- Utils (utils.js) - ei muutoksia

---

## 10. Seuraavat askeleet

### Välittömästi (V1.5)

1. ✅ Toteuta Task-10: Keyboard Shortcuts
2. ✅ Toteuta Task-11: Unit Tests
3. 🔲 iPad-testaus

### V2 Preparation

1. 🔲 Luo Supabase-projekti (free tier)
2. 🔲 Kokeile Supabase Auth demossa
3. 🔲 Suunnittele Login UI mockup
4. 🔲 Kirjoita TECH_SPEC_02 (V2 Cloud Edition)

---

## 11. Liitteet

### A. Hyödyllisiä linkkejä

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth JS](https://supabase.com/docs/reference/javascript/auth-signup)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [AWS Amplify](https://docs.amplify.aws/) (vaihtoehto)

### B. Esimerkki .env (V2)

```env
# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Optional: AWS alternative
# AWS_REGION=eu-north-1
# AWS_COGNITO_USER_POOL_ID=eu-north-1_xxx
# AWS_COGNITO_CLIENT_ID=xxx
```

---

*Dokumentti: V2 Cloud Migration Roadmap*
*Luotu: 2026-01-06*
*Status: Draft - awaiting review*
