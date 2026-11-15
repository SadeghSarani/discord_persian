# NEXUS Domain Boundaries & Modular Monolith Architecture

This document governs the organizational boundaries, interfaces, and dependency rules of the DISCAF / NEXUS application.

---

## 1. Architectural Guardrails
1. **Zero Domain Logic in Presentation / Delivery Layers:**
   - React components (`src/components/`, `src/app/**/page.tsx`) must NEVER query Prisma directly or execute raw business validation. They only read from typed REST APIs or typed client stores.
   - Route Handlers (`src/app/api/v1/**/route.ts`) act strictly as thin HTTP adaptors: parsing input, invoking the domain service, and translating domain responses/errors to HTTP status codes.
2. **Encapsulation:** Domain modules live in `src/modules/<domain>/`. Modules own their database operations and expose a **public service interface**. Cross-domain table mutations are strictly forbidden.
3. **Event-Driven Decoupling:** Cross-cutting concerns (e.g. updating Quest progress upon joining a Moment, or awarding XP upon sending a referral) must be triggered via typed in-memory event buses or the Transactional Outbox, never by direct cross-service database coupling.

---

## 2. Module Boundaries & Contract Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MODULAR MONOLITH SERVICE REGISTRY                     │
├───────────────────┬───────────────────────────────────┬─────────────────────┤
│ Domain Module     │ Owned Entities                    │ Public Service      │
├───────────────────┼───────────────────────────────────┼─────────────────────┤
│ 1. auth           │ AccountCredential, Session,       │ AuthService         │
│                   │ PasswordResetToken                │                     │
│ 2. users          │ User, Friendship, UserBlock,      │ UserService,        │
│                   │ UserMute                          │ SocialGraphService  │
│ 3. interests      │ Interest, UserInterest            │ InterestService     │
│ 4. moments        │ Moment, MomentParticipant,        │ MomentService       │
│                   │ MomentInvite, MomentReport        │                     │
│ 5. communities    │ Community, CommunityRole,         │ CommunityService,   │
│                   │ CommunityMember, CommunityBan,    │ ChannelService      │
│                   │ CommunityInvite, Category, Channel│                     │
│ 6. chat           │ Message, MessageAttachment,       │ ChatService,        │
│                   │ MessageEditHistory, Rx, ReadState │ DirectMessageService│
│ 7. gamification   │ UserXp, XpTransaction,           │ GamificationService,│
│                   │ Badge, UserBadge                  │ BadgeService        │
│ 8. quests         │ Quest, QuestProgress              │ QuestService        │
│ 9. referrals      │ ReferralCode, ReferralAttribution │ ReferralService     │
│ 10. playground    │ PlaygroundSession, Participant    │ PlaygroundService   │
│ 11. realtime      │ VoiceRoom, VoiceParticipant       │ RealtimeGateway,    │
│                   │                                   │ VoiceService        │
│ 12. notifications │ Notification                      │ NotificationService │
│ 13. discovery     │ None (Reads Public Entities)      │ DiscoveryService,   │
│                   │                                   │ RadarService        │
│ 14. outbox        │ TransactionalOutbox               │ OutboxService       │
│ 15. analytics     │ ActivityEvent                     │ AnalyticsService    │
└───────────────────┴───────────────────────────────────┴─────────────────────┘
```

---

## 3. Detailed Module Specifications

### 3.1 Module: `auth`
- **Owned Entities:** `AccountCredential`, `Session`, `PasswordResetToken`.
- **Public Service Interface (`AuthService`):**
  - `register(data: RegisterDTO): Promise<{ user: User, sessionToken: string }>`
  - `login(credentials: LoginDTO): Promise<{ user: User, sessionToken: string }>`
  - `validateSession(sessionToken: string): Promise<AuthenticatedUser | null>`
  - `logout(sessionToken: string): Promise<void>`
  - `revokeAllSessions(userId: string): Promise<void>`
  - `requestPasswordReset(email: string): Promise<void>`
  - `resetPassword(token: string, newPassword: string): Promise<void>`
- **Published Events:** `USER_REGISTERED`, `USER_LOGGED_IN`, `SESSION_REVOKED`.
- **Dependencies:** `users` (reads User profile).
- **Forbidden Dependencies:** `chat`, `moments`, `communities`.

### 3.2 Module: `users`
- **Owned Entities:** `User`, `Friendship`, `UserBlock`, `UserMute`.
- **Public Service Interface (`UserService`, `SocialGraphService`):**
  - `getProfileById(userId: string, viewerId?: string): Promise<UserProfileDTO>`
  - `updateProfile(userId: string, data: UpdateProfileDTO): Promise<User>`
  - `sendFriendRequest(requesterId: string, addresseeId: string): Promise<Friendship>`
  - `respondFriendRequest(friendshipId: string, userId: string, accept: boolean): Promise<void>`
  - `blockUser(blockerId: string, targetId: string): Promise<void>`
  - `unblockUser(blockerId: string, targetId: string): Promise<void>`
  - `isBlocked(userA: string, userB: string): Promise<boolean>`
- **Published Events:** `FRIEND_REQUEST_SENT`, `FRIEND_REQUEST_ACCEPTED`, `USER_BLOCKED`.
- **Dependencies:** None.

### 3.3 Module: `moments`
- **Owned Entities:** `Moment`, `MomentParticipant`, `MomentInvite`, `MomentReport`.
- **Public Service Interface (`MomentService`):**
  - `createMoment(creatorId: string, data: CreateMomentDTO): Promise<Moment>`
  - `joinMoment(momentId: string, userId: string, inviteToken?: string): Promise<Moment>`
  - `leaveMoment(momentId: string, userId: string): Promise<void>`
  - `getMomentById(momentId: string, viewerId?: string): Promise<MomentDetailDTO | null>`
  - `generateInvite(momentId: string, inviterId: string): Promise<MomentInvite>`
  - `expireOverdueMoments(): Promise<number>`
- **Published Events:** `MOMENT_CREATED`, `MOMENT_JOINED`, `MOMENT_LEFT`, `MOMENT_EXPIRED`.
- **Dependencies:** `users` (checks blocks), `gamification` (dispatches XP).
- **Forbidden Dependencies:** `chat`, `communities`.

### 3.4 Module: `communities`
- **Owned Entities:** `Server`, `ServerRole`, `ServerMember`, `ChannelCategory`, `Channel`.
- **Public Service Interface (`CommunityService`):**
  - `createServer(ownerId: string, data: CreateServerDTO): Promise<Server>`
  - `joinServer(serverId: string, userId: string): Promise<ServerMember>`
  - `leaveServer(serverId: string, userId: string): Promise<void>`
  - `createChannel(serverId: string, actorId: string, data: CreateChannelDTO): Promise<Channel>`
  - `hasPermission(serverId: string, userId: string, permission: PermissionBit): Promise<boolean>`
- **Published Events:** `SERVER_CREATED`, `MEMBER_JOINED_SERVER`, `CHANNEL_CREATED`.
- **Dependencies:** `users`.

### 3.5 Module: `chat`
- **Owned Entities:** `Message`, `MessageAttachment`, `MessageEditHistory`, `MessageReaction`, `ChannelReadState`, `Conversation`, `ConversationParticipant`, `DirectMessage`.
- **Public Service Interface (`ChatService`, `DirectMessageService`):**
  - `sendChannelMessage(channelId: string, senderId: string, content: string): Promise<Message>`
  - `editChannelMessage(messageId: string, senderId: string, content: string): Promise<Message>`
  - `addReaction(messageId: string, userId: string, emoji: string): Promise<void>`
  - `sendDirectMessage(conversationId: string, senderId: string, content: string): Promise<DirectMessage>`
  - `markChannelRead(channelId: string, userId: string, messageId: string): Promise<void>`
- **Published Events:** `MESSAGE_SENT`, `MESSAGE_EDITED`, `REACTION_ADDED`, `DM_SENT`.
- **Dependencies:** `communities` (permission check), `users` (block checks).

### 3.6 Module: `gamification`
- **Owned Entities:** `UserXp`, `XpTransaction`, `Badge`, `UserBadge`.
- **Public Service Interface (`GamificationService`, `BadgeService`):**
  - `awardXp(userId: string, amount: number, reason: string, sourceType: string, idempotencyKey: string): Promise<UserXp>`
  - `getUserXp(userId: string): Promise<{ totalXp: number, level: number }>`
  - `evaluateBadges(userId: string): Promise<Badge[]>`
  - `getUserBadges(userId: string): Promise<UserBadge[]>`
- **Published Events:** `XP_AWARDED`, `LEVEL_UP`, `BADGE_UNLOCKED`.
- **Dependencies:** `users`.
- **Forbidden Dependencies:** May NOT import `moments`, `chat`, or `quests`. Instead, it listens to published domain events.

### 3.7 Module: `quests`
- **Owned Entities:** `Quest`, `QuestProgress`.
- **Public Service Interface (`QuestService`):**
  - `getActiveQuests(userId: string): Promise<QuestWithProgressDTO[]>`
  - `recordAction(userId: string, actionType: string): Promise<void>`
  - `claimReward(questId: string, userId: string): Promise<{ xpAwarded: number }>`
- **Published Events:** `QUEST_PROGRESS_UPDATED`, `QUEST_COMPLETED`, `QUEST_REWARD_CLAIMED`.
- **Dependencies:** `gamification` (awards XP).

### 3.8 Module: `referrals`
- **Owned Entities:** `ReferralCode`, `ReferralAttribution`.
- **Public Service Interface (`ReferralService`):**
  - `getOrCreateReferralCode(userId: string): Promise<ReferralCode>`
  - `attributeReferral(code: string, newUserId: string, ipAddress?: string): Promise<void>`
  - `validateAndActivateReferral(referredUserId: string): Promise<boolean>`
- **Published Events:** `REFERRAL_REGISTERED`, `REFERRAL_ACTIVATED`.
- **Dependencies:** `users`, `gamification` (awards referral XP).

### 3.9 Module: `discovery` & `radar`
- **Owned Entities:** None (Read-only aggregation engine).
- **Public Service Interface (`DiscoveryService`, `RadarService`):**
  - `getDiscoveryFeed(userId?: string, category?: string, query?: string): Promise<DiscoveryItem[]>`
  - `getRadarRecommendations(userId: string): Promise<{ people: RadarUser[], communities: RadarServer[] }>`
- **Rules:**
  - Enforces privacy filters: excludes `visibility != 'PUBLIC'`, excludes blocked users, excludes private channels.
  - Computes Jaccard interest overlap for Radar recommendations.
- **Dependencies:** `moments`, `communities`, `interests`, `users`.

### 3.10 Module: `playground`
- **Owned Entities:** `PlaygroundSession`, `PlaygroundParticipant`.
- **Public Service Interface (`PlaygroundService`):**
  - `createSession(hostId: string, gameType: PlaygroundGameType, contextId?: string): Promise<PlaygroundSession>`
  - `joinSession(sessionId: string, userId: string): Promise<PlaygroundParticipant>`
  - `submitMove(sessionId: string, userId: string, moveData: any): Promise<PlaygroundSession>`
- **Published Events:** `PLAYGROUND_GAME_STARTED`, `PLAYGROUND_MOVE_MADE`, `PLAYGROUND_GAME_ENDED`.
- **Dependencies:** `gamification` (awards mini-game XP), `users`.

### 3.11 Module: `realtime`
- **Owned Entities:** `VoiceRoom`, `VoiceParticipant`.
- **Public Service Interface (`RealtimeGateway`, `VoiceService`):**
  - `authenticateSocket(cookieString: string): Promise<AuthenticatedUser | null>`
  - `broadcastToRoom(room: string, event: string, payload: any): void`
  - `joinVoiceRoom(roomId: string, userId: string): Promise<VoiceRoom>`
  - `leaveVoiceRoom(roomId: string, userId: string): Promise<void>`
- **Published Events:** `VOICE_USER_JOINED`, `VOICE_USER_LEFT`, `VOICE_SPEAKING_UPDATE`.
- **Dependencies:** `auth`, `users`.
