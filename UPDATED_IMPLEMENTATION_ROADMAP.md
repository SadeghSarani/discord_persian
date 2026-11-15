# NEXUS Updated Implementation Roadmap
**Strategy:** Clean-Start Modular Monolith on PostgreSQL 16  
**Scope:** Complete Phase One Social Ecosystem (No deferrals to Phase Two)  

---

## 1. Roadmap Architecture & Critical Path

```mermaid
gantt
    title NEXUS Phase One Implementation Stages
    dateFormat  X
    axisFormat  Day %d
    
    section Foundation
    Stage 1: Clean PostgreSQL Provisioning & Schema Migration :active, s1, 0, 2
    Stage 2: Database-Backed Authentication & Sessions        :s2, after s1, 3
    Stage 3: Standalone Real-Time WebSocket Gateway          :s3, after s2, 3
    
    section Core Social
    Stage 4: Complete Moments Engine & Invites               :s4, after s3, 3
    Stage 5: Communities & Persistent Real-Time Chat         :s5, after s3, 4
    Stage 6: Social Identity, Profiles & Interests Taxonomy  :s6, after s2, 2
    
    section Gamification & Growth
    Stage 7: Progressive Gamification, XP & Badges           :s7, after s4, 3
    Stage 8: Verifiable Quests & Missions Engine            :s8, after s7, 3
    Stage 9: Referral Growth System & Anti-Fraud             :s9, after s6, 2
    
    section Intelligence & Entertainment
    Stage 10: Community Radar & Algorithmic Discovery Feed   :s10, after s5, 3
    Stage 11: Social Playground & WebRTC Media Signaling    :s11, after s5, 4
    
    section Polish & Verification
    Stage 12: Notification Center, Mobile UX & Final E2E     :s12, after s11, 3
```

---

## 2. Stage-by-Stage Implementation Blueprints

### Stage 1: Clean PostgreSQL Provisioning & Schema Migration
- **Objective:** Establish the clean PostgreSQL 16 database foundation with complete 16-domain Prisma models and deterministic seed data.
- **Modules Involved:** `infrastructure`, `prisma`.
- **Dependencies:** None.
- **File & Architectural Changes:**
  - Update `docker-compose.yml`: add `postgres:16-alpine` service with volume persistence on port `5432`.
  - Rewrite `prisma/schema.prisma`: configure `provider = "postgresql"` and embed all 16 domains (33 entities).
  - Create `prisma/seed.ts`: deterministic development seed data (Test Clan Leader, Test Member, 6 standardized Interest categories, 4 starter Quests, 5 starter Badges).
- **Security & Concurrency:** Verify compound unique constraints and foreign key cascade rules.
- **Testing & Verification:**
  - Execute `npx prisma migrate dev --name init_nexus_clean_postgresql`.
  - Execute `npx prisma db seed`.
  - Verify tables exist in PostgreSQL via query inspection.
- **Definition of Done:** Clean PostgreSQL migration succeeds; seed script populates verified personas; `prisma/dev.db` remains untouched as legacy archive.

---

### Stage 2: Database-Backed Authentication & Sessions
- **Objective:** Replace mock authentication with cryptographically secure, database-backed sessions in HttpOnly cookies, eliminating identity spoofing.
- **Modules Involved:** `auth`, `users`.
- **Dependencies:** Stage 1.
- **APIs:**
  - `POST /api/v1/auth/register` (Username, email, password, name)
  - `POST /api/v1/auth/login` (Identifier, password)
  - `POST /api/v1/auth/logout` (Clears session)
  - `GET /api/v1/auth/me` (Resolves session to current user)
  - `POST /api/v1/auth/revoke-all` (Global device logout)
- **Security Guard:** Middleware validates `__Host-nexus_session` cookie; extracts verified user ID; rejects client-supplied `userId` parameters with `400 Bad Request`.
- **Testing & Verification:**
  - Test registration with Argon2id password hash generation.
  - Test login with cookie issuance (`HttpOnly; Secure; SameSite=Lax`).
  - Test instant session revocation: deleting DB session immediately returns `401 Unauthorized` on next call.
- **Definition of Done:** User can register, login, refresh browser, remain logged in, and log out with complete session destruction.

---

### Stage 3: Standalone Real-Time WebSocket Gateway
- **Objective:** Deploy co-located Socket.IO Gateway process sharing session authentication and real-time event distribution.
- **Modules Involved:** `realtime`, `auth`.
- **Dependencies:** Stage 2 (Session cookies).
- **Architectural Deliverables:**
  - `src/gateway/server.ts`: Node.js process listening on port `3001`.
  - Handshake authentication: parses `__Host-nexus_session` cookie, verifies `Session` record in DB, rejects unauthenticated sockets.
  - Room subscription guards: checks permissions before joining `moment:<id>`, `channel:<id>`, or `user:<id>`.
  - Client hook: `src/lib/useSocket.ts` with auto-reconnection, heartbeat, and offline banner.
- **Testing & Verification:**
  - Connecting without cookie fails with `Unauthorized`.
  - Connecting with valid cookie attaches authenticated user to `socket.data.user`.
- **Definition of Done:** Bi-directional real-time communication operational between browser and gateway with authenticated room isolation.

---

### Stage 4: Complete Moments Engine & Concurrency Safety
- **Objective:** Finalize the Moments engine with atomic capacity locks, private cryptographic invites, and auto-expiration.
- **Modules Involved:** `moments`, `realtime`, `gamification`.
- **Dependencies:** Stage 2 (Auth), Stage 3 (Real-Time).
- **APIs:**
  - `GET /api/v1/moments` (Discoverable list with category & search)
  - `POST /api/v1/moments` (Create with category, capacity, duration)
  - `GET /api/v1/moments/[id]` (Detail view)
  - `POST /api/v1/moments/[id]/join` (Atomic capacity join)
  - `DELETE /api/v1/moments/[id]/join` (Leave moment)
  - `POST /api/v1/moments/[id]/invites` (Generate cryptographic invite token)
- **Concurrency Protection:**
  ```sql
  UPDATE "Moment"
  SET "participantCount" = "participantCount" + 1
  WHERE id = $1 AND "participantCount" < capacity AND status = 'LIVE';
  ```
- **Real-Time Integration:** Broadcasts `MOMENT_PARTICIPANT_JOINED`, `MOMENT_PARTICIPANT_LEFT`, `MOMENT_EXPIRED` to `moment:<id>` room.
- **Testing & Verification:**
  - Stress test: 20 simultaneous join requests against capacity-5 moment. Assert exactly 5 succeed, 15 receive `409 Conflict`.
- **Definition of Done:** Moments create, join, leave, invite, and auto-expire with zero over-capacity errors and live WebSocket sync.

---

### Stage 5: Communities & Persistent Real-Time Chat
- **Objective:** Replace in-memory mock Discord channels with persistent PostgreSQL servers, categories, channels, and messages.
- **Modules Involved:** `communities`, `chat`, `realtime`.
- **Dependencies:** Stage 2 (Auth), Stage 3 (Real-Time).
- **APIs:**
  - `GET/POST /api/v1/servers`
  - `GET/POST /api/v1/servers/[id]/channels`
  - `GET /api/v1/channels/[id]/messages` (Cursor-based pagination)
  - `POST /api/v1/channels/[id]/messages` (Send message)
  - `POST /api/v1/messages/[id]/reactions` (Toggle reaction)
- **Real-Time Integration:** Broadcasts `MESSAGE_CREATED`, `MESSAGE_REACTION` to `channel:<id>`.
- **Testing & Verification:**
  - Send message in Browser A; verify instantaneous render in Browser B and persistence across page reloads.
- **Definition of Done:** Servers, channels, and messages persist to PostgreSQL; chat updates in real-time with unread counters.

---

### Stage 6: Social Identity, Profiles & Interests Taxonomy
- **Objective:** Rich gamer profiles, custom avatar presets, shareable profile cards, and interest selection.
- **Modules Involved:** `users`, `interests`.
- **Dependencies:** Stage 2 (Auth).
- **APIs:**
  - `GET /api/v1/interests` (Standard taxonomy)
  - `PUT /api/v1/users/me/interests` (Update user interests)
  - `GET/PUT /api/v1/users/profile` (Update name, bio, avatarStyle, status)
  - `GET /api/v1/users/[username]/card` (Public preview with OG metadata)
- **UI Deliverables:** Interest selection modal, Profile modal with vector gamer avatars, shareable profile preview (`/u/[username]`).
- **Definition of Done:** Users can customize identity; interests persist to DB; external sharing renders rich OpenGraph preview card.

---

### Stage 7: Gamification, Progressive XP & Badges
- **Objective:** Server-authoritative gamification with verified progressive level curve and duplicate prevention.
- **Modules Involved:** `gamification`, `moments`, `realtime`.
- **Dependencies:** Stage 2 (Auth), Stage 4 (Moments).
- **Formula:** $\text{Level} = \lfloor(1 + \sqrt{1 + 8 \times \text{XP} / 150}) / 2\rfloor$.
- **APIs:**
  - `GET /api/v1/gamification/xp-history`
  - `GET /api/v1/gamification/badges`
- **Idempotency:** Unique `idempotencyKey` on `XpTransaction` prevents double-minting for repeated activity.
- **Real-Time Integration:** Emits `XP_AWARDED` and `LEVEL_UP` with celebratory confetti triggers.
- **Definition of Done:** Creating/joining moments grants exact XP; level updates dynamically; badges unlock when criteria are met.

---

### Stage 8: Verifiable Quests & Missions Engine
- **Objective:** Daily and weekly missions evaluated by server-side events.
- **Modules Involved:** `quests`, `gamification`, `realtime`.
- **Dependencies:** Stage 7 (Gamification), Stage 4 (Moments), Stage 5 (Chat).
- **APIs:**
  - `GET /api/v1/quests` (Active missions with current progress)
  - `POST /api/v1/quests/[id]/claim` (Claim completed reward)
- **Event Triggers:** `MOMENT_JOINED` increments `JOIN_MOMENT` quests; `MESSAGE_SENT` increments `CHAT_MESSAGES` quests.
- **Definition of Done:** Real activity advances quest counters; completed quests award XP upon claim; rewards claimable once only.

---

### Stage 9: Referral Growth System & Anti-Fraud
- **Objective:** Growth engine with verified user activations to prevent reward farming.
- **Modules Involved:** `referrals`, `users`, `gamification`.
- **Dependencies:** Stage 2 (Auth), Stage 6 (Profiles).
- **APIs:**
  - `GET /api/v1/referrals/code`
  - `POST /api/v1/referrals/claim`
  - `GET /api/v1/referrals/stats`
- **Anti-Fraud Rules:** Prohibits self-referral; referral transitions to `ACTIVATED` only after referred user completes profile AND participates in $\ge 1$ Moment or Community.
- **Definition of Done:** Unique referral links generate; attribution logs; rewards grant idempotently upon verified activation.

---

### Stage 10: Community Radar & Algorithmic Discovery Feed
- **Objective:** Discovery engine driven by interest matching, activity velocity, and strict privacy filtering.
- **Modules Involved:** `discovery`, `interests`, `moments`, `communities`.
- **Dependencies:** Stage 4 (Moments), Stage 5 (Communities), Stage 6 (Interests).
- **APIs:**
  - `GET /api/v1/discovery/feed` (Ranked public moments and active communities)
  - `GET /api/v1/radar/recommendations` (People & servers matched via Jaccard interest overlap)
- **Privacy Enforcement:** Private moments, private channels, and blocked users are mathematically excluded from result sets.
- **Definition of Done:** Discovery highlights active public moments; Radar suggests relevant members sharing public interests.

---

### Stage 11: Social Playground & WebRTC Media Signaling
- **Objective:** Networked multiplayer turn-based games and live voice/video calling.
- **Modules Involved:** `playground`, `realtime`, `communities`.
- **Dependencies:** Stage 3 (Real-Time Gateway), Stage 5 (Communities).
- **APIs:**
  - `POST /api/v1/playground/session` (Create game room)
  - `POST /api/v1/voice/token` (Issue WebRTC signaling ticket)
- **Capabilities:**
  - Multiplayer networked Tic-Tac-Toe and Quiz rooms over WebSockets.
  - WebRTC signaling for audio/video calling, speaking halos, and screen sharing.
- **Definition of Done:** Two users play turn-based game in real-time with synchronized board state; voice signaling connects live audio.

---

### Stage 12: Notification Center, Mobile Polish & Final E2E Audit
- **Objective:** Centralized notifications, mobile responsive navigation, and complete test suite verification.
- **Modules Involved:** `notifications`, `layout`, `testing`.
- **Dependencies:** All previous stages.
- **Deliverables:**
  - In-app notification center bell with unread badge counter.
  - Mobile responsive drawer navigation replacing desktop sidebars below 768px.
  - Automated Playwright E2E suite covering all 12 stages.
- **Definition of Done:** 100% Phase One capabilities verified with automated tests; zero regressions; production deployment readiness.
