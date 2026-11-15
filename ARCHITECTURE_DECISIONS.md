# NEXUS Architecture Decisions Records (ADRs)

This document formalizes the fundamental technical and operational decisions governing the clean-start implementation of DISCAF / NEXUS.

---

## ADR-01: Primary Database — PostgreSQL 16 & Prisma ORM

### Context
The prototype began with SQLite. SQLite locks the entire database file during writes (`SQLITE_BUSY`), lacks native array types, lacks connection pooling, and cannot perform pessimistic row-level locking (`SELECT ... FOR UPDATE`), making high-concurrency moments joins and multiplayer state sync unviable.

### Decision
Adopt **PostgreSQL 16** via **Prisma ORM** as the single source of truth for the entire platform.

### Rationale & Trade-offs
- **Pros:**
  - ACID guarantees with robust transaction isolation (`READ COMMITTED` / `SERIALIZABLE`).
  - Row-level locking eliminates race conditions when multiple users join a limited-capacity Moment simultaneously.
  - Native JSONB support for game states (`PlaygroundSession.gameState`) and outbox payloads.
  - Native text array support (`Moment.tags`).
  - Strong connection pooling (`pgbouncer` compatible) for production workloads.
- **Cons:**
  - Requires dedicated container/process management unlike embedded SQLite.
- **Alternatives Considered:**
  - *Keep SQLite with WAL mode:* Inadequate for multi-instance scaling and production traffic.
  - *Drizzle ORM:* Excellent performance, but Prisma's mature schema migrations and type safety already integrated in the repo make Prisma the lower-risk, higher-velocity choice.

---

## ADR-02: Authentication — Database-Backed Sessions in Secure HttpOnly Cookies

### Context
Modern web architectures frequently debate stateless JWTs vs. stateful database sessions. In a social gaming platform with live chat, voice calls, moderation bans, and multi-device logins, immediate session invalidation is paramount.

### Decision
Implement **Database-Backed Sessions** using cryptographically secure 32-byte tokens stored in `__Host-nexus_session` HttpOnly cookies and mapped to the `Session` table in PostgreSQL.

### Rationale & Trade-offs
- **Pros:**
  - **Immediate Revocation:** Banning an abusive user, resetting passwords, or clicking "Log out of all devices" instantly purges session records. Subsequent REST calls and WebSocket handshakes fail immediately.
  - **Zero Token Drift:** User role updates (e.g. promoted to moderator) take effect immediately without waiting for a JWT to expire.
  - **Multi-Device Transparency:** Users can view their active devices with IP and User-Agent info.
- **Cons:**
  - Requires a database lookup per authenticated request (mitigated by indexing `tokenHash` and optional Redis caching in Phase 1.5).
- **Active WebSocket Invalidation Mechanism:**
  - When a user logs out, is banned, or calls `revokeAllSessions`, the auth service emits an internal event `SESSION_REVOKED { userId, sessionId }`.
  - The Gateway process listens to this event, cross-references connected socket instances by `socket.data.user.id`, dispatches an `AUTH_REVOKED` packet to the client, and immediately calls `socket.disconnect(true)` to forcibly sever active connections.
- **CSRF Defense Invariant:**
  - HttpOnly cookies prevent script-based token exfiltration, but are automatically transmitted by browsers on cross-site requests.
  - To prevent CSRF attacks, the API middleware enforces `SameSite=Lax` on cookies and validates custom headers (`X-Nexus-Requested-With`) and request `Origin === process.env.APP_URL` on all state-mutating requests (`POST`, `PUT`, `DELETE`, `PATCH`).
- **Alternatives Considered:**
  - *Stateless JWTs:* Revocation requires distributed blacklists in Redis, adding the exact statefulness JWTs aim to avoid.
  - *Auth.js (NextAuth v5):* High configuration friction with Next.js 16 canary and React 19; difficult to share sessions cleanly with independent WebSocket gateways.

---

## ADR-03: Real-Time Infrastructure — Co-located Standalone Gateway Process

### Context
Next.js Server Actions and Route Handlers are designed for stateless, short-lived request/response cycles. WebSocket connections require persistent, long-lived TCP sockets.

### Decision
Deploy a **Co-located Standalone Real-Time Gateway** process inside the repository (`src/gateway/` or `server.ts`) alongside the Next.js application, sharing domain types and the database connection pool.

### Rationale & Trade-offs
- **Pros:**
  - Prevents WebSocket CPU spikes from degrading Next.js server-side rendering (SSR).
  - Preserves the Modular Monolith: zero microservice infrastructure, shared `package.json`, shared Prisma client.
  - Seamless authentication: Gateway reads the exact same `__Host-nexus_session` cookie during the HTTP upgrade handshake.
- **Cons:**
  - Requires running two processes in development/production (e.g. Next.js on `:3000`, Gateway on `:3001`).
- **Scaling Gate:**
  - *Single Instance:* In-memory adapter for rooms and presence.
  - *Scale Gate (Multi-Instance):* When deploying $>1$ gateway instance, enable `@socket.io/redis-adapter` via environment variable `REDIS_URL`.

---

## ADR-04: Reliability — Transactional Outbox Pattern

### Context
When a user joins a Moment, creates a channel message, or unlocks an achievement, two things must happen:
1. The state changes in the database.
2. An event is broadcasted over WebSockets to other connected users.
If the database commits but the network blips before the socket emits, the UI becomes inconsistent. If the socket emits first but the database rolls back, users see phantom data.

### Decision
Implement the **Transactional Outbox Pattern** for critical domain events via the `TransactionalOutbox` table.

### Implementation Pattern
```typescript
await prisma.$transaction(async (tx) => {
  // 1. Perform business mutation
  const participant = await tx.momentParticipant.create({ ... });
  await tx.moment.update({ ... });
  
  // 2. Insert outbox record within the exact same transaction
  await tx.transactionalOutbox.create({
    data: {
      aggregateType: 'Moment',
      aggregateId: momentId,
      eventType: 'MOMENT_PARTICIPANT_JOINED',
      payload: { momentId, user: participant.user, currentCount }
    }
  });
});
// 3. Fast-path publisher delivers immediately, background poller sweeps any failed deliveries
```

### Critical Delivery & Deduplication Invariant
1. **At-Least-Once Delivery:** The Outbox guarantees that events are never lost. However, network timeouts, retries, or worker crashes mean events **may be delivered more than once**. Exactly-once delivery across networks is physically impossible.
2. **Mandatory Idempotent Consumers:** Every event consumer (WebSocket gateway, Quest evaluation worker, Notification dispatcher) **must** maintain an idempotency check (e.g. tracking `processedEventIds` in Redis/DB or applying database unique constraints) to ensure duplicate events do not double-increment progress, double-award XP, or spam users.

---

## ADR-05: Real Voice & Video Architecture — WebRTC Signaling vs. Media SFU

### Context
Audio and video calling cannot be simulated in production. Group calls require a clear separation between signaling and media routing.

### Decision
1. **Signaling via Socket.IO:** SDP offers, SDP answers, and ICE candidates route through the Gateway over Socket.IO rooms (`voice:<roomId>`).
2. **Small Rooms ($\le 4$ Participants):** Full-mesh WebRTC peer-to-peer (zero server media bandwidth).
3. **Large Communities ($> 4$ Participants):** Media routes through a **Selective Forwarding Unit (SFU)** using an open-source LiveKit instance or mediasoup router.
4. **NAT Traversal:** Standard public STUN servers for address discovery; Coturn container configured for relaying behind enterprise symmetric NATs.

---

## ADR-06: File Storage — Presigned S3-Compatible Object Storage

### Context
Message attachments, community icons, and profile banners require persistent storage that does not inflate database backups or load application server disk.

### Decision
Use **S3-Compatible Object Storage** (MinIO for local development, AWS S3 / Cloudflare R2 for production) with **Presigned Upload URLs**.

### Flow:
1. Client requests upload ticket: `POST /api/v1/storage/presigned-url` with `mimeType` and `fileSize`.
2. Server validates mime type, checks quotas, generates a presigned `PUT` URL.
3. Client uploads binary directly to S3.
4. Client sends message referencing the confirmed storage key.
5. Storage keys are immutable and served via CDN.

---

## ADR-07: Testing Strategy — Test Pyramid & Concurrency Focus

### Context
Arbitrary line coverage targets lead to shallow snapshot tests on aesthetic UI components while missing race conditions and security bugs.

### Decision
Establish a rigorous, prioritized testing strategy:
1. **Unit Tests (Vitest):**
   - 100% coverage on math and security rules: XP progression curve, level calculations, token hashing, rate limit algorithms.
2. **Concurrency & Integration Tests (Vitest + PostgreSQL Test DB):**
   - Simultaneous Moment Join Stress Test: 20 concurrent join promises against a moment with capacity 5. Assert: exactly 5 succeed, 15 receive `409 Conflict`, final `participantCount == 5`.
   - Idempotency Test: Duplicate XP claims and duplicate referral redemptions.
3. **End-to-End Tests (Playwright):**
   - Automated multi-browser tests: Browser A creates a Moment; Browser B joins; Browser A receives real-time WebSocket update; Browser B's XP increases.
