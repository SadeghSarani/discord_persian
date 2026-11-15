# NEXUS Database Architecture Specification
**Status:** Implementation Blueprint (Clean Start on PostgreSQL 16)  
**ORM:** Prisma 6.x  
**Primary Database:** PostgreSQL 16  
**Archive:** `prisma/dev.db` (Preserved offline as legacy prototype snapshot)  

---

## 1. Schema Conventions & Global Standards
1. **Primary Keys:** Standardized on `String` using CUID (`cuid()`) for distributed scalability, zero-collision generation across workers, and URL friendliness.
2. **Naming Conventions:** Table names are PascalCase; column names are camelCase; enum types are SCREAMING_SNAKE_CASE.
3. **Timestamp Standardization:** Every persistent entity includes `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt` using PostgreSQL `TIMESTAMP(3) WITH TIME ZONE`.
4. **Referential Integrity:** Enforce foreign keys with deliberate `onDelete` cascades:
   - User deletion cascades to owned sessions, authenticators, user interests, and participants.
   - Core historical audit records (`XpTransaction`, `ActivityEvent`, `MomentReport`) use `SetNull` or restrict to retain auditable integrity.
5. **No Null Abuse:** Optional fields are minimized. Enums are preferred over arbitrary strings for state machines.

---

## 2. Comprehensive Entity Specification

### 2.1 Identity, Authentication & Sessions

#### `User`
- **Purpose:** Core identity anchor for all social, gaming, and community interactions.
- **Fields:**
  - `id`: `String` (PK, `@default(cuid())`)
  - `username`: `String` (Unique, VarChar 32, lowercase alphanumeric + underscores)
  - `name`: `String` (VarChar 64, display name in Persian/English)
  - `email`: `String` (Unique, VarChar 255)
  - `avatarStyle`: `String` (VarChar 64, default `"golden_king"`)
  - `bio`: `String?` (VarChar 255)
  - `customStatus`: `String?` (VarChar 128)
  - `gameActivity`: `String?` (VarChar 128)
  - `role`: `String` (Default `"member"`)
  - `roleColor`: `String` (Default `"#8B7CFF"`)
  - `isVerified`: `Boolean` (Default `false`)
  - `isBanned`: `Boolean` (Default `false`)
  - `createdAt`: `DateTime` (`@default(now())`)
  - `updatedAt`: `DateTime` (`@updatedAt`)
- **Indexes & Constraints:** `@@unique([username])`, `@@unique([email])`, `@@index([createdAt])`.
- **Privacy & Ownership:** Email and ban status are strictly private to the user and platform administrators.

#### `AccountCredential`
- **Purpose:** Securely isolated credential store, decoupled from `User` to prevent accidental serialization.
- **Fields:**
  - `id`: `String` (PK)
  - `userId`: `String` (FK -> `User.id`, Unique, `onDelete: Cascade`)
  - `passwordHash`: `String` (Argon2id hash string)
  - `updatedAt`: `DateTime` (`@updatedAt`)
- **Indexes & Constraints:** `@@unique([userId])`.
- **Security:** Inaccessible from public queries; only queried by `AuthService.verifyCredentials()`.

#### `Session`
- **Purpose:** Database-backed sessions for instant global/device revocation and multi-device management.
- **Fields:**
  - `id`: `String` (PK)
  - `userId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `tokenHash`: `String` (Unique, SHA-256 of session cookie token)
  - `ipAddress`: `String?` (VarChar 45, IPv4/IPv6)
  - `userAgent`: `String?`
  - `lastActiveAt`: `DateTime` (`@default(now())`)
  - `expiresAt`: `DateTime` (Sliding 7-day or fixed 30-day window)
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@unique([tokenHash])`, `@@index([userId, expiresAt])`.
- **Lifecycle:** Hard-deleted on logout; batch cleaned when `expiresAt < NOW()`. Revocation terminates all WebSocket sessions tied to `userId`.

#### `PasswordResetToken`
- **Purpose:** Cryptographic single-use token for account recovery.
- **Fields:**
  - `id`: `String` (PK)
  - `userId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `tokenHash`: `String` (Unique, SHA-256)
  - `expiresAt`: `DateTime` (15-minute window)
  - `usedAt`: `DateTime?`
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@unique([tokenHash])`, `@@index([userId, expiresAt])`.

---

### 2.2 Social Graph, Privacy, Blocks & Mutes

#### `Friendship`
- **Purpose:** Tracks bidirectional social relationships and friend request lifecycles.
- **Fields:**
  - `id`: `String` (PK)
  - `requesterId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `addresseeId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `status`: `FriendshipStatus` (`PENDING`, `ACCEPTED`, `DECLINED`, `BLOCKED`)
  - `createdAt`: `DateTime` (`@default(now())`)
  - `updatedAt`: `DateTime` (`@updatedAt`)
- **Indexes & Constraints:** `@@unique([requesterId, addresseeId])`, `@@index([requesterId, status])`, `@@index([addresseeId, status])`. Check constraint: `requesterId != addresseeId`.

#### `UserBlock`
- **Purpose:** Hard privacy enforcement. Blocks mutual visibility, DMs, invites, and Radar presence.
- **Fields:**
  - `id`: `String` (PK)
  - `blockerId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `blockedId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@unique([blockerId, blockedId])`, `@@index([blockerId])`. Check constraint: `blockerId != blockedId`.

#### `UserMute`
- **Purpose:** Soft privacy enforcement. Hides messages and audio without notifying the target.
- **Fields:**
  - `id`: `String` (PK)
  - `muterId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `mutedId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `expiresAt`: `DateTime?` (Null = permanent)
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@unique([muterId, mutedId])`.

---

### 2.3 Interests Taxonomy & Discovery

#### `Interest`
- **Purpose:** Normalized topic taxonomy for user onboarding, Moments matching, and Community Radar.
- **Fields:**
  - `id`: `String` (PK)
  - `slug`: `String` (Unique, VarChar 64, e.g. `"fc-27"`, `"cybersecurity"`)
  - `nameFa`: `String` (VarChar 64)
  - `icon`: `String` (VarChar 32)
  - `category`: `String` (VarChar 32, e.g. `"Gaming"`, `"Tech"`, `"Music"`)
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@unique([slug])`, `@@index([category])`.

#### `UserInterest`
- **Purpose:** Join entity binding users to their chosen interests.
- **Fields:**
  - `id`: `String` (PK)
  - `userId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `interestId`: `String` (FK -> `Interest.id`, `onDelete: Cascade`)
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@unique([userId, interestId])`, `@@index([interestId])`.

---

### 2.4 Moments Engine

#### `Moment`
- **Purpose:** Ephemeral social spaces centered on an immediate intent or activity.
- **Fields:**
  - `id`: `String` (PK)
  - `creatorId`: `String` (FK -> `User.id`)
  - `title`: `String` (VarChar 100)
  - `description`: `String` (VarChar 300)
  - `category`: `String` (VarChar 32)
  - `tags`: `String[]` (PostgreSQL text array)
  - `visibility`: `MomentVisibility` (`PUBLIC`, `FRIENDS_ONLY`, `PRIVATE_INVITE`)
  - `capacity`: `Int` (2 to 50)
  - `participantCount`: `Int` (`@default(1)`)
  - `status`: `MomentStatus` (`LIVE`, `ENDED`, `CANCELLED`)
  - `startsAt`: `DateTime` (`@default(now())`)
  - `expiresAt`: `DateTime`
  - `createdAt`: `DateTime` (`@default(now())`)
  - `updatedAt`: `DateTime` (`@updatedAt`)
- **Indexes & Constraints:** `@@index([status, visibility, expiresAt])`, `@@index([creatorId])`, `@@index([category, status])`.
- **Concurrency & Invariant:** `participantCount <= capacity`. Incremented only via atomic conditional write.

#### `MomentParticipant`
- **Purpose:** Active membership and participation tracking in a Moment.
- **Fields:**
  - `id`: `String` (PK)
  - `momentId`: `String` (FK -> `Moment.id`, `onDelete: Cascade`)
  - `userId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `status`: `ParticipantStatus` (`ACTIVE`, `LEFT`)
  - `joinedAt`: `DateTime` (`@default(now())`)
  - `leftAt`: `DateTime?`
- **Indexes & Constraints:** `@@unique([momentId, userId])`, `@@index([momentId, status])`.

#### `MomentInvite`
- **Purpose:** Cryptographic invitation link management for private moments.
- **Fields:**
  - `id`: `String` (PK)
  - `momentId`: `String` (FK -> `Moment.id`, `onDelete: Cascade`)
  - `inviterId`: `String` (FK -> `User.id`)
  - `tokenHash`: `String` (Unique, SHA-256)
  - `maxUses`: `Int` (`@default(10)`)
  - `usageCount`: `Int` (`@default(0)`)
  - `expiresAt`: `DateTime`
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@unique([tokenHash])`, `@@index([momentId])`.

#### `MomentReport`
- **Purpose:** Moderation reporting for inappropriate or abusive activities.
- **Fields:**
  - `id`: `String` (PK)
  - `momentId`: `String` (FK -> `Moment.id`, `onDelete: Cascade`)
  - `reporterId`: `String` (FK -> `User.id`)
  - `reason`: `String` (Text)
  - `status`: `ReportStatus` (`PENDING`, `INVESTIGATING`, `RESOLVED`, `DISMISSED`)
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@index([status, createdAt])`.

---

### 2.5 Communities, Roles & Granular Permissions

#### `Community`
- **Purpose:** Persistent community spaces hosting text and voice channels (canonical model name; UI displays as سرورها و انجمن‌ها).
- **Fields:**
  - `id`: `String` (PK)
  - `ownerId`: `String` (FK -> `User.id`)
  - `name`: `String` (VarChar 64)
  - `icon`: `String?` (URL / Asset Key)
  - `description`: `String` (VarChar 255)
  - `isPublic`: `Boolean` (`@default(true)`)
  - `createdAt`: `DateTime` (`@default(now())`)
  - `updatedAt`: `DateTime` (`@updatedAt`)
- **Indexes & Constraints:** `@@index([ownerId])`, `@@index([isPublic, createdAt])`.

#### `CommunityRole`
- **Purpose:** Granular permission system for community moderation.
- **Fields:**
  - `id`: `String` (PK)
  - `communityId`: `String` (FK -> `Community.id`, `onDelete: Cascade`)
  - `name`: `String` (VarChar 32)
  - `color`: `String` (VarChar 16)
  - `position`: `Int` (`@default(0)`)
  - `permissions`: `BigInt` (Bitmask flags: `MANAGE_COMMUNITY`, `MANAGE_CHANNELS`, `KICK_MEMBERS`, `BAN_MEMBERS`, `SEND_MESSAGES`, `ATTACH_FILES`, `MANAGE_MESSAGES`, `CONNECT_VOICE`, `SPEAK_VOICE`)
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@unique([communityId, name])`, `@@index([communityId, position])`.

#### `CommunityMember`
- **Purpose:** Junction entity for community membership and assigned roles.
- **Fields:**
  - `id`: `String` (PK)
  - `communityId`: `String` (FK -> `Community.id`, `onDelete: Cascade`)
  - `userId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `nickname`: `String?` (VarChar 32)
  - `roleId`: `String?` (FK -> `CommunityRole.id`, `onDelete: SetNull`)
  - `joinedAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@unique([communityId, userId])`, `@@index([communityId, roleId])`.

#### `CommunityBan`
- **Purpose:** Tracks banned users prohibited from rejoining a community.
- **Fields:**
  - `id`: `String` (PK)
  - `communityId`: `String` (FK -> `Community.id`, `onDelete: Cascade`)
  - `userId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `reason`: `String?` (VarChar 255)
  - `bannedById`: `String` (FK -> `User.id`)
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@unique([communityId, userId])`.

#### `CommunityInvite`
- **Purpose:** Invite links with expiration and usage counters for communities.
- **Fields:**
  - `id`: `String` (PK)
  - `communityId`: `String` (FK -> `Community.id`, `onDelete: Cascade`)
  - `inviterId`: `String` (FK -> `User.id`)
  - `code`: `String` (Unique, VarChar 16)
  - `maxUses`: `Int?`
  - `usageCount`: `Int` (`@default(0)`)
  - `expiresAt`: `DateTime?`
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@unique([code])`, `@@index([communityId])`.

#### `ChannelCategory`
- **Purpose:** Visual grouping for channels within a community.
- **Fields:**
  - `id`: `String` (PK)
  - `communityId`: `String` (FK -> `Community.id`, `onDelete: Cascade`)
  - `name`: `String` (VarChar 32)
  - `position`: `Int` (`@default(0)`)
- **Indexes & Constraints:** `@@index([communityId, position])`.

#### `Channel`
- **Purpose:** Communication room (Text or Voice) inside a community.
- **Fields:**
  - `id`: `String` (PK)
  - `communityId`: `String` (FK -> `Community.id`, `onDelete: Cascade`)
  - `categoryId`: `String?` (FK -> `ChannelCategory.id`, `onDelete: SetNull`)
  - `name`: `String` (VarChar 64)
  - `type`: `ChannelType` (`TEXT`, `VOICE`)
  - `topic`: `String?` (VarChar 255)
  - `isPrivate`: `Boolean` (`@default(false)`)
  - `position`: `Int` (`@default(0)`)
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@index([communityId, categoryId, position])`.

---

### 2.6 Messages, History, Reactions & Direct Messages

#### `Message`
- **Purpose:** Text communication record inside community channels.
- **Fields:**
  - `id`: `String` (PK)
  - `channelId`: `String` (FK -> `Channel.id`, `onDelete: Cascade`)
  - `userId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `content`: `String` (Text)
  - `isPinned`: `Boolean` (`@default(false)`)
  - `isEdited`: `Boolean` (`@default(false)`)
  - `createdAt`: `DateTime` (`@default(now())`)
  - `updatedAt`: `DateTime` (`@updatedAt`)
- **Indexes & Constraints:** `@@index([channelId, createdAt(sort: Desc)])` (critical for efficient cursor-based message pagination).

#### `MessageAttachment`
- **Purpose:** Files, images, and media attached to messages.
- **Fields:**
  - `id`: `String` (PK)
  - `messageId`: `String` (FK -> `Message.id`, `onDelete: Cascade`)
  - `fileKey`: `String` (S3/Storage Object Key)
  - `fileName`: `String` (VarChar 255)
  - `fileSize`: `Int`
  - `mimeType`: `String` (VarChar 64)
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@index([messageId])`.

#### `MessageEditHistory`
- **Purpose:** Audit trail for edited messages.
- **Fields:**
  - `id`: `String` (PK)
  - `messageId`: `String` (FK -> `Message.id`, `onDelete: Cascade`)
  - `previousContent`: `String` (Text)
  - `editedAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@index([messageId, editedAt(sort: Desc)])`.

#### `MessageReaction`
- **Purpose:** Emoji reactions on messages.
- **Fields:**
  - `id`: `String` (PK)
  - `messageId`: `String` (FK -> `Message.id`, `onDelete: Cascade`)
  - `userId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `emoji`: `String` (VarChar 16)
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@unique([messageId, userId, emoji])`.

#### `ChannelReadState`
- **Purpose:** Per-user unread badge counters and notification triggers.
- **Fields:**
  - `id`: `String` (PK)
  - `channelId`: `String` (FK -> `Channel.id`, `onDelete: Cascade`)
  - `userId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `lastReadMessageId`: `String?`
  - `lastReadAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@unique([channelId, userId])`.

#### `Conversation` (DMs)
- **Purpose:** Private 1-on-1 or multi-user direct message threads.
- **Fields:**
  - `id`: `String` (PK)
  - `type`: `ConversationType` (`DIRECT`, `GROUP`)
  - `updatedAt`: `DateTime` (`@updatedAt`)
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@index([updatedAt(sort: Desc)])`.

#### `ConversationParticipant`
- **Purpose:** Membership and read state for direct message conversations.
- **Fields:**
  - `id`: `String` (PK)
  - `conversationId`: `String` (FK -> `Conversation.id`, `onDelete: Cascade`)
  - `userId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `lastReadAt`: `DateTime?`
- **Indexes & Constraints:** `@@unique([conversationId, userId])`.

#### `DirectMessage`
- **Purpose:** Messages within private direct conversations.
- **Fields:**
  - `id`: `String` (PK)
  - `conversationId`: `String` (FK -> `Conversation.id`, `onDelete: Cascade`)
  - `senderId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `content`: `String` (Text)
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@index([conversationId, createdAt(sort: Desc)])`.

---

### 2.7 Gamification, XP, Badges & Quests

#### `UserXp`
- **Purpose:** Aggregated user level and lifetime experience points.
- **Fields:**
  - `id`: `String` (PK)
  - `userId`: `String` (FK -> `User.id`, Unique, `onDelete: Cascade`)
  - `totalXp`: `Int` (`@default(0)`)
  - `currentLevel`: `Int` (`@default(1)`)
  - `updatedAt`: `DateTime` (`@updatedAt`)
- **Indexes & Constraints:** `@@unique([userId])`, `@@index([totalXp(sort: Desc)])` (for leaderboard queries).

#### `XpTransaction`
- **Purpose:** Immutable append-only audit ledger of every XP award.
- **Fields:**
  - `id`: `String` (PK)
  - `userId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `amount`: `Int`
  - `reason`: `String` (VarChar 255)
  - `sourceType`: `String` (VarChar 32, e.g. `"moment_create"`, `"moment_join"`, `"quest_claim"`, `"referral_activation"`)
  - `sourceId`: `String?` (VarChar 64)
  - `idempotencyKey`: `String` (Unique, VarChar 128)
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@unique([idempotencyKey])`, `@@index([userId, createdAt(sort: Desc)])`.

#### `Badge`
- **Purpose:** Achievement badges that users can display on their profile.
- **Fields:**
  - `id`: `String` (PK)
  - `code`: `String` (Unique, VarChar 32, e.g. `"founder"`, `"moment_master"`, `"social_connector"`)
  - `nameFa`: `String` (VarChar 64)
  - `description`: `String` (VarChar 255)
  - `icon`: `String` (VarChar 32)
  - `rarity`: `BadgeRarity` (`COMMON`, `RARE`, `EPIC`, `LEGENDARY`)
  - `criteria`: `String` (JSON configuration of unlock criteria)
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@unique([code])`.

#### `UserBadge`
- **Purpose:** Badges unlocked by a specific user.
- **Fields:**
  - `id`: `String` (PK)
  - `userId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `badgeId`: `String` (FK -> `Badge.id`, `onDelete: Cascade`)
  - `isPinned`: `Boolean` (`@default(false)`)
  - `awardedAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@unique([userId, badgeId])`.

#### `Quest`
- **Purpose:** Server-verified structured missions (Daily/Weekly).
- **Fields:**
  - `id`: `String` (PK)
  - `code`: `String` (Unique, VarChar 32)
  - `title`: `String` (VarChar 100)
  - `description`: `String` (VarChar 255)
  - `questType`: `QuestType` (`DAILY`, `WEEKLY`, `SPECIAL`)
  - `rewardXp`: `Int`
  - `actionType`: `String` (VarChar 32, e.g. `"MOMENT_JOIN"`, `"CHAT_MESSAGE"`, `"GAME_PLAY"`)
  - `targetCount`: `Int` (`@default(1)`)
  - `startsAt`: `DateTime`
  - `endsAt`: `DateTime`
  - `isActive`: `Boolean` (`@default(true)`)
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@unique([code])`, `@@index([isActive, endsAt])`.

#### `QuestProgress`
- **Purpose:** Individual user mission tracking.
- **Fields:**
  - `id`: `String` (PK)
  - `questId`: `String` (FK -> `Quest.id`, `onDelete: Cascade`)
  - `userId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `currentCount`: `Int` (`@default(0)`)
  - `status`: `QuestStatus` (`IN_PROGRESS`, `COMPLETED`, `CLAIMED`)
  - `completedAt`: `DateTime?`
  - `claimedAt`: `DateTime?`
  - `updatedAt`: `DateTime` (`@updatedAt`)
- **Indexes & Constraints:** `@@unique([questId, userId])`, `@@index([userId, status])`.

---

### 2.8 Referrals & Anti-Fraud

#### `ReferralCode`
- **Purpose:** Unique invite code assigned to each user.
- **Fields:**
  - `id`: `String` (PK)
  - `userId`: `String` (FK -> `User.id`, Unique, `onDelete: Cascade`)
  - `code`: `String` (Unique, VarChar 16)
  - `isActive`: `Boolean` (`@default(true)`)
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@unique([userId])`, `@@unique([code])`.

#### `ReferralAttribution`
- **Purpose:** Tracks invited users and verified activation to prevent farming.
- **Fields:**
  - `id`: `String` (PK)
  - `referrerId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `referredUserId`: `String` (FK -> `User.id`, Unique, `onDelete: Cascade`)
  - `status`: `ReferralStatus` (`PENDING`, `ACTIVATED`, `REJECTED`)
  - `ipAddress`: `String?` (VarChar 45)
  - `fingerprint`: `String?` (Client browser fingerprint hash)
  - `createdAt`: `DateTime` (`@default(now())`)
  - `activatedAt`: `DateTime?`
- **Indexes & Constraints:** `@@unique([referredUserId])`, `@@index([referrerId, status])`. Check constraint: `referrerId != referredUserId`.

---

### 2.9 Social Playground (Multiplayer Mini-Games)

#### `PlaygroundSession`
- **Purpose:** Multiplayer game room state and turns.
- **Fields:**
  - `id`: `String` (PK)
  - `gameType`: `PlaygroundGameType` (`TICTACTOE`, `TRIVIA`, `WORD_CHAIN`)
  - `hostId`: `String` (FK -> `User.id`)
  - `channelId`: `String?` (FK -> `Channel.id`, `onDelete: SetNull`)
  - `momentId`: `String?` (FK -> `Moment.id`, `onDelete: SetNull`)
  - `status`: `GameSessionStatus` (`WAITING`, `ACTIVE`, `FINISHED`, `ABANDONED`)
  - `gameState`: `Json` (Current board / question index / turn tracker)
  - `winnerId`: `String?` (FK -> `User.id`, `onDelete: SetNull`)
  - `createdAt`: `DateTime` (`@default(now())`)
  - `endedAt`: `DateTime?`
- **Indexes & Constraints:** `@@index([status, createdAt])`.

#### `PlaygroundParticipant`
- **Purpose:** Player roles and scores in a game session.
- **Fields:**
  - `id`: `String` (PK)
  - `sessionId`: `String` (FK -> `PlaygroundSession.id`, `onDelete: Cascade`)
  - `userId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `role`: `String` (VarChar 16, e.g. `"PLAYER_X"`, `"PLAYER_O"`, `"CONTESTANT"`, `"SPECTATOR"`)
  - `score`: `Int` (`@default(0)`)
- **Indexes & Constraints:** `@@unique([sessionId, userId])`.

---

### 2.10 Voice & Video Metadata

#### `VoiceRoom`
- **Purpose:** Active signaling channel for WebRTC mesh or SFU room coordination.
- **Fields:**
  - `id`: `String` (PK)
  - `channelId`: `String?` (Unique, FK -> `Channel.id`, `onDelete: Cascade`)
  - `momentId`: `String?` (Unique, FK -> `Moment.id`, `onDelete: Cascade`)
  - `activeCallers`: `Int` (`@default(0)`)
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@unique([channelId])`, `@@unique([momentId])`.

#### `VoiceParticipant`
- **Purpose:** Active media stream presence and mute states.
- **Fields:**
  - `id`: `String` (PK)
  - `roomId`: `String` (FK -> `VoiceRoom.id`, `onDelete: Cascade`)
  - `userId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `isMuted`: `Boolean` (`@default(false)`)
  - `isDeafened`: `Boolean` (`@default(false)`)
  - `isVideoOn`: `Boolean` (`@default(false)`)
  - `isScreenSharing`: `Boolean` (`@default(false)`)
  - `joinedAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@unique([roomId, userId])`.

---

### 2.11 Notifications

#### `Notification`
- **Purpose:** In-app notification center alerts.
- **Fields:**
  - `id`: `String` (PK)
  - `userId`: `String` (FK -> `User.id`, `onDelete: Cascade`)
  - `type`: `NotificationType` (`MOMENT_INVITE`, `FRIEND_REQUEST`, `XP_AWARD`, `BADGE_UNLOCKED`, `SERVER_INVITE`)
  - `title`: `String` (VarChar 100)
  - `body`: `String` (VarChar 255)
  - `data`: `Json?` (Target URL, entity ID, metadata)
  - `isRead`: `Boolean` (`@default(false)`)
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@index([userId, isRead, createdAt(sort: Desc)])`.

---

### 2.12 Reliability & Phase Two Trend Signals

#### `TransactionalOutbox`
- **Purpose:** At-least-once guaranteed delivery of domain events to WebSocket and background consumers.
- **Fields:**
  - `id`: `String` (PK)
  - `aggregateType`: `String` (VarChar 32, e.g. `"Moment"`, `"User"`, `"Message"`)
  - `aggregateId`: `String` (VarChar 64)
  - `eventType`: `String` (VarChar 64, e.g. `"MOMENT_CREATED"`, `"XP_AWARDED"`)
  - `payload`: `Json`
  - `isPublished`: `Boolean` (`@default(false)`)
  - `publishedAt`: `DateTime?`
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@index([isPublished, createdAt])`.
- **Consumer Invariant:** Workers must process idempotently (`processedEventIds` cache).

#### `ActivityEvent`
- **Purpose:** Anonymized, normalized engagement log for Phase Two activity velocity calculation.
- **Fields:**
  - `id`: `String` (PK)
  - `eventType`: `String` (VarChar 32, e.g. `"MOMENT_JOIN"`, `"MESSAGE_SENT"`, `"GAME_PLAYED"`)
  - `category`: `String` (VarChar 32)
  - `interestSlug`: `String?` (VarChar 64)
  - `entityId`: `String` (VarChar 64)
  - `isPublic`: `Boolean` (`@default(true)`)
  - `createdAt`: `DateTime` (`@default(now())`)
- **Indexes & Constraints:** `@@index([isPublic, category, createdAt(sort: Desc)])`, `@@index([eventType, createdAt(sort: Desc)])`.
- **Strict Privacy Rule:** Never logs message bodies, private moments, private channel interactions, or sensitive user identifiers.
- **Retention:** Aggregated into 1-hour rollup buckets after 14 days and purged.
