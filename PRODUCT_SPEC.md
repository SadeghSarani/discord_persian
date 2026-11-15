# NEXUS — Product, Engineering & Design System Specification

**Document Type:** Product & Technical Implementation Blueprint  
**Target Agent:** Google Antigravity  
**Frontend:** Next.js + React + TypeScript  
**Realtime:** Existing WebSocket Infrastructure  
**Product Stage:** Pre-launch / Early Development  
**Product Direction:** Next-Generation Persian Social Platform  
**Document Version:** 1.0

---

# 1. PROJECT VISION

Build a next-generation Persian social platform that goes beyond traditional community and messaging applications.

The product must combine:

- Real-time communication
- Community discovery
- Temporary social experiences
- Gamification
- AI-powered social recommendations
- Multiplayer social activities
- User identity and personalization

The platform must not look or behave like a Discord clone.

It should have its own visual identity, interaction patterns, navigation system, and design language.

## Core Product Philosophy

Users should join the platform to communicate, but stay because of the experiences, people, discoveries, and activities available inside it.

## Primary Product Goals

1. Increase organic user acquisition.
2. Encourage users to invite friends.
3. Increase daily active usage.
4. Improve user retention.
5. Create an ecosystem of communities and social experiences.
6. Establish a recognizable Persian social brand.

---

# 2. EXISTING INFRASTRUCTURE

The following functionality has already been implemented.

| Feature | Status |
|---|---|
| Text Chat | Implemented |
| Voice Chat | Implemented |
| Servers / Communities | Implemented |
| Roles & Permissions | Implemented |
| Text Channels | Implemented |
| Video | Implemented |
| Friends | Implemented |
| User Profiles | Implemented |
| Notifications | Implemented |
| WebSocket | Implemented |

## Critical Development Rule

Do not rebuild existing functionality.

Before writing any code:

1. Inspect the entire repository.
2. Understand the existing application architecture.
3. Identify the current authentication system.
4. Identify existing database models and relations.
5. Inspect current WebSocket events and communication architecture.
6. Inspect existing UI components and styling.
7. Identify reusable components.
8. Identify technical limitations.

Extend the existing architecture rather than replacing it.

Never delete, rename, or migrate existing functionality without a clear technical reason.

---

# 3. PRODUCT MODULES

The platform should eventually consist of five major modules.

## 3.1 Discovery Engine

Purpose: Help users discover communities, people, events, and activities.

Features:

- Trending communities
- Active Moments
- Recommended users
- Popular discussions
- Trending topics
- Recommended servers
- Recently active communities
- Interest-based discovery

## 3.2 Engagement Engine

Purpose: Give users reasons to interact with the platform.

Features:

- Live Moments
- Social Challenges
- Multiplayer activities
- Group activities
- Polls
- Community events
- Interactive experiences

## 3.3 Intelligence Engine

Purpose: Introduce AI-powered experiences.

Features:

- AI community recommendations
- AI conversation summaries
- AI event suggestions
- AI-assisted community discovery
- AI moderation assistance
- AI-powered interest matching

AI must never have unrestricted access to private conversations or personal information. Access must follow explicit permissions and user consent.

## 3.4 Gamification Engine

Purpose: Improve engagement and retention.

Features:

- XP
- Levels
- Badges
- Achievements
- Daily quests
- Weekly quests
- Seasonal challenges
- Leaderboards
- Cosmetic rewards

Rewards must be based on meaningful activity, not spam or repetitive actions.

## 3.5 Social Core

Reuse the existing infrastructure:

- Users
- Servers
- Channels
- Messages
- Friends
- Roles
- Permissions
- Voice
- Video
- Notifications

All new modules must integrate with this existing core.

---

# 4. MVP PRIORITIES

Do not implement every proposed feature immediately.

The first release must focus on creating a functional viral growth loop.

## Phase 1 — Viral MVP

Priority: Critical

Implement:

1. Moments Engine
2. Public Discovery Feed
3. Referral System
4. Shareable User Profiles
5. Basic XP System
6. Basic Badges

## Phase 2 — Retention

Implement:

1. Daily Quests
2. Weekly Quests
3. Community Radar
4. Interest-Based Discovery
5. Basic AI Assistant

## Phase 3 — Differentiation

Implement:

1. Social Playground
2. Multiplayer Mini Games
3. Advanced AI Recommendations
4. User-Created Games
5. Seasonal Events
6. Advanced Social Identity

Do not start Phase 2 or Phase 3 before Phase 1 is stable.

---

# 5. MOMENTS ENGINE

This is the primary new feature and the most important MVP module.

## Concept

Moments are temporary social activities that users can create and join.

Examples:

- Anyone up for gaming?
- Let's play Mafia.
- Looking for programming friends.
- Night conversation.
- Let's discuss AI.
- Who wants to watch a movie together?

Users should be able to discover and join activities without having to join permanent communities first.

## Moment Properties

Each Moment should contain:

- ID
- Creator
- Title
- Description
- Category
- Cover image (optional)
- Visibility
- Capacity
- Participant count
- Status
- Start time
- Expiration time
- Associated server (optional)
- Associated channel (optional)
- Creation timestamp

## Moment Visibility

- Public
- Friends Only
- Private / Invite Only

## Moment Status

- Scheduled
- Live
- Ended
- Cancelled

## Moment Categories

- Gaming
- Technology
- Programming
- Music
- Entertainment
- Friendship
- Conversation
- Education
- Other

Categories should be configurable from the backend.

## Moment User Flow

1. User opens Explore.
2. User discovers available Moments.
3. User opens a Moment.
4. User views its description and participants.
5. User clicks Join.
6. Backend validates capacity and permissions.
7. User becomes a participant.
8. User receives access to the associated communication space.
9. User can invite friends.
10. Moment ends automatically when its expiration condition is reached.

## Moment Requirements

- Real-time participant updates.
- Capacity validation.
- Automatic expiration.
- Join and leave functionality.
- Invite links.
- Creator permissions.
- Report functionality.
- Blocking integration.
- Rate limiting.
- Duplicate request protection.

Use existing chat and voice infrastructure whenever possible.

Do not create a separate messaging system for Moments.

---

# 6. REFERRAL SYSTEM

The referral system is essential for organic growth.

## Requirements

Each user should have a unique referral code and shareable URL.

Example:

`https://example.com/invite/USERCODE`

The URL should:

- Open the appropriate registration page.
- Preserve referral attribution.
- Work on mobile and desktop.
- Support social sharing.
- Handle invalid or expired codes.
- Prevent self-referrals.

## Referral Tracking

Track:

- Invitation created
- Invitation opened
- Registration completed
- Email or account verification completed, if applicable
- First meaningful activity
- Referral activated

Do not consider a registration alone as a successful referral.

A referral should become activated only after the new user completes a defined meaningful activity.

## Anti-Abuse

- Prevent self-referrals.
- Detect suspicious registration patterns.
- Prevent duplicate rewards.
- Apply server-side validation.
- Use rate limits.
- Keep an auditable referral history.

Never reward users simply for generating unlimited invitation links.

---

# 7. SOCIAL IDENTITY

Create a distinctive user identity system.

## Profile Components

- Avatar
- Display name
- Username
- Biography
- Interests
- Social level
- XP
- Achievements
- Badges
- Favorite communities
- Public activity highlights

## Shareable Identity Card

Every user should have a visually attractive public profile card.

It should be suitable for sharing on:

- Telegram
- Instagram
- X
- Other social networks

Provide:

- Public profile URL
- Social preview metadata
- Open Graph image
- Copy link action
- Native sharing where supported

Users must control which profile information is public.

Do not expose private activity, private servers, private conversations, or hidden profile fields.

---

# 8. GAMIFICATION SYSTEM

## XP System

Create an XP ledger.

Suggested initial XP rules:

| Action | XP |
|---|---:|
| Complete profile | 20 |
| Join a new community | 10 |
| Complete daily quest | 30 |
| Help another user | 15 |
| Create a successful Moment | 25 |
| Complete a group challenge | 40 |

These values are initial configuration suggestions, not permanent rules.

## Level Formula

Use a configurable progression formula.

Initial suggestion:

`XP Required = 100 × Level²`

Avoid expensive calculations in the frontend. Calculate progression on the server.

## Badges

Examples:

- Early Member
- First Connection
- Community Builder
- Social Explorer
- Helpful Member
- Challenge Master
- Event Creator

## XP Security

- All XP calculations happen on the backend.
- Never accept arbitrary XP values from the frontend.
- Maintain transaction history.
- Prevent duplicate rewards.
- Implement daily reward limits.
- Record the reason for every transaction.

Use idempotency keys for reward operations.

---

# 9. QUEST SYSTEM

Implement after the core Moments and referral features are stable.

## Daily Quests

Examples:

- Join one Moment.
- Discover a new community.
- Start a conversation.
- Help another user.
- Complete a social activity.

## Weekly Quests

Examples:

- Join three different communities.
- Participate in five Moments.
- Complete a group challenge.
- Invite a friend who becomes active.

## Quest Properties

- ID
- Title
- Description
- Type
- XP Reward
- Requirements
- Start time
- End time
- Active status

Quest progress must be calculated from verified backend events.

Never trust frontend-submitted completion claims.

---

# 10. COMMUNITY RADAR

Create an intelligent discovery experience.

The Radar should display:

- Active communities
- Trending topics
- Popular Moments
- Upcoming events
- Recommended people
- Recently active discussions

The Radar must be useful even when the platform has few users.

Implement fallback states:

- Suggested communities
- Featured activities
- Starter Moments
- Curated challenges

Do not fabricate online users, activity counts, or popularity statistics.

---

# 11. DATABASE ARCHITECTURE

Reuse existing database models.

Do not duplicate existing User, Server, Channel, Message, or Notification models.

Add new models using the existing database conventions.

## Moments

### moments

- id
- creatorId
- title
- description
- category
- visibility
- capacity
- participantCount
- status
- startsAt
- expiresAt
- serverId (nullable)
- channelId (nullable)
- createdAt
- updatedAt

### moment_participants

- id
- momentId
- userId
- status
- joinedAt
- leftAt

### moment_invites

- id
- momentId
- inviterId
- tokenHash
- expiresAt
- maxUses
- usageCount
- createdAt

### moment_reports

- id
- momentId
- reporterId
- reason
- status
- createdAt

## Referrals

### referral_codes

- id
- userId
- code
- createdAt
- isActive

### referral_attributions

- id
- referrerId
- referredUserId
- referralCodeId
- source
- status
- createdAt
- activatedAt

## Gamification

### user_xp

- id
- userId
- totalXp
- currentLevel
- updatedAt

### xp_transactions

- id
- userId
- amount
- reason
- sourceType
- sourceId
- idempotencyKey
- createdAt

### badges

- id
- name
- description
- icon
- rarity
- criteria

### user_badges

- id
- userId
- badgeId
- awardedAt

## Quests

### quests

- id
- title
- description
- questType
- rewardXp
- requirements
- startsAt
- endsAt
- isActive

### quest_progress

- id
- questId
- userId
- progress
- status
- completedAt
- claimedAt

## Database Rules

- Add appropriate foreign keys.
- Add indexes for frequently queried fields.
- Add unique constraints for referral attribution.
- Add unique constraints for XP idempotency keys.
- Use transactions for critical operations.
- Avoid unnecessary denormalization.
- Handle concurrent Moment joins safely.
- Store timestamps consistently in UTC.

The existing database architecture takes precedence over these conceptual table definitions.

---

# 12. API ARCHITECTURE

Use versioned endpoints.

Base path:

`/api/v1`

## Moments API

| Method | Endpoint | Description |
|---|---|---|
| POST | /moments | Create Moment |
| GET | /moments | Discover Moments |
| GET | /moments/:id | Moment details |
| POST | /moments/:id/join | Join Moment |
| DELETE | /moments/:id/leave | Leave Moment |
| POST | /moments/:id/invite | Create invite |
| POST | /moments/:id/end | End Moment |

## Referral API

| Method | Endpoint | Description |
|---|---|---|
| POST | /referrals | Create referral |
| GET | /referrals/me | User referral statistics |
| GET | /referrals/:code | Validate referral code |

## Gamification API

| Method | Endpoint | Description |
|---|---|---|
| GET | /quests | List active quests |
| GET | /quests/me | User progress |
| POST | /quests/:id/claim | Claim reward |
| GET | /users/:id/achievements | User achievements |

## Profile API

Reuse existing profile endpoints wherever possible.

Add only the missing functionality:

- Public profile data
- Shareable profile metadata
- Achievement information
- Privacy settings

## API Requirements

- Authentication
- Authorization
- Input validation
- Consistent error responses
- Rate limiting
- Pagination
- Logging
- Request tracing
- Idempotency for sensitive operations

Use the existing validation framework if one is already installed.

---

# 13. WEBSOCKET ARCHITECTURE

Keep the existing WebSocket infrastructure.

Extend it with typed events.

## Events

### Moments

- moment:created
- moment:updated
- moment:joined
- moment:left
- moment:ended
- moment:capacity_reached

### Gamification

- xp:updated
- level:up
- badge:awarded
- quest:progress
- quest:completed

### Discovery

- discovery:updated

## Important Architecture Rule

The database is the source of truth.

Correct execution order:

1. Receive the client request.
2. Authenticate the user.
3. Validate permissions.
4. Execute the database transaction.
5. Commit the transaction.
6. Publish the WebSocket event.

Never publish a successful event before the database operation succeeds.

For reliability, consider a transactional outbox pattern for important events.

## Scaling

For multiple WebSocket instances, use a shared event distribution layer.

Redis Pub/Sub or a compatible WebSocket adapter can be used.

Do not introduce additional infrastructure unless the current deployment requires it.

---

# 14. CUSTOM DESIGN SYSTEM

This is a critical part of the project.

Create an original design language.

Do not copy Discord, Telegram, Slack, or other existing products.

## Design Direction

**Visual Identity:**

- Futuristic
- Minimal
- Premium
- Social
- Interactive
- Dark-first
- Elegant
- Subtle neon accents

The product should feel like a modern digital social universe, not a gaming dashboard.

Avoid excessive glow, oversized gradients, visual noise, and unnecessary animations.

## 14.1 Color System

Create CSS variables for every design token.

Initial palette:

### Base Colors

| Token | Value | Usage |
|---|---|---|
| Background | #090B12 | Main background |
| Surface | #101522 | Main panels |
| Surface Elevated | #171E2E | Elevated cards |
| Surface Hover | #1C2638 | Hover states |
| Border | #263044 | Borders |
| Text Primary | #F3F5FA | Main text |
| Text Secondary | #9AA6BA | Secondary text |
| Text Muted | #66738A | Muted text |

### Accent Colors

| Token | Value | Usage |
|---|---|---|
| Primary | #8B7CFF | Main actions |
| Primary Hover | #A196FF | Hover state |
| Secondary | #43C9D8 | Secondary accent |
| Success | #36C98F | Success states |
| Warning | #F3B75E | Warnings |
| Danger | #F06C7A | Errors |

### Gradient

Primary gradient:

`linear-gradient(135deg, #8B7CFF 0%, #43C9D8 100%)`

Use gradients sparingly.

Do not apply gradients to every card or button.

## 14.2 Typography

Use a modern Persian-compatible font system.

Recommended:

- Primary Persian: Vazirmatn
- Secondary Latin: Inter

Typography must support Persian, English, numbers, and mixed-language content.

Suggested sizes:

| Token | Size |
|---|---:|
| Display | 36px |
| Heading 1 | 28px |
| Heading 2 | 22px |
| Heading 3 | 18px |
| Body | 14px |
| Small | 12px |
| Caption | 11px |

Use appropriate font weights.

Maintain readability, especially for long Persian text.

## 14.3 Layout System

Use a consistent 4px spacing scale.

| Token | Value |
|---|---:|
| xs | 4px |
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 24px |
| 2xl | 32px |
| 3xl | 48px |

Recommended border radii:

- Small controls: 8px
- Buttons: 10px
- Cards: 14px
- Large panels: 18px
- Modal: 20px
- Pills: 999px

## 14.4 Shadows

Use subtle shadows.

Example:

`0 8px 32px rgba(0, 0, 0, 0.22)`

Avoid excessive glowing shadows.

## 14.5 Iconography

Use one consistent icon family.

Recommended: Lucide Icons.

Rules:

- Consistent stroke width.
- No random emoji replacing interface icons.
- Consistent icon sizing.
- Tooltips for ambiguous icons.
- Proper active and disabled states.

---

# 15. COMPONENT DESIGN SYSTEM

Build reusable components.

Suggested component inventory:

## Navigation

- AppSidebar
- MainNavigation
- MobileNavigation
- UserMenu
- NotificationMenu
- CommunitySwitcher

## Social Components

- UserAvatar
- UserPresence
- UserCard
- ProfileCard
- CommunityCard
- MomentCard
- MomentParticipantList
- ActivityFeed
- InterestTag

## Gamification Components

- XPBar
- LevelBadge
- AchievementCard
- QuestCard
- QuestProgress
- BadgeCollection

## General Components

- Button
- IconButton
- Input
- Textarea
- Select
- Dropdown
- Modal
- Drawer
- Tooltip
- Toast
- Skeleton
- EmptyState
- ErrorState
- LoadingState

All components must use the shared design tokens.

Avoid hardcoded colors inside individual components.

---

# 16. MAIN APPLICATION LAYOUT

Create a distinctive application shell.

## Desktop Layout

Recommended structure:

- Left navigation: 240px
- Main content: flexible width
- Right contextual panel: 280px when needed

Do not force three columns on every page.

Use contextual right panels only when they provide meaningful information.

### Main Navigation

1. Home
2. Explore
3. Moments
4. Communities
5. Messages
6. Friends
7. Quests
8. Profile

The existing server and channel navigation should remain accessible.

Do not remove existing chat functionality.

## Mobile Layout

Create a dedicated responsive experience.

- Bottom navigation
- Responsive cards
- Mobile-friendly drawers
- Touch-friendly controls
- Responsive Moment creation
- Compact user profiles

Do not simply shrink the desktop sidebar.

---

# 17. PAGE SPECIFICATIONS

## 17.1 Home

Purpose: Give users an immediate reason to interact.

Sections:

- Personalized greeting
- Active Moments
- Recommended communities
- Trending activities
- Friends currently online
- Daily quests
- Recent activity

The first screen must prioritize actions over statistics.

## 17.2 Explore

Purpose: Discovery.

Sections:

- Search
- Trending
- Moments
- Communities
- People
- Categories
- Recommendations

Provide filters and sorting.

## 17.3 Moments

Purpose: Temporary social experiences.

Layout:

- Page heading
- Create Moment button
- Category filters
- Search
- Live Moments feed
- Upcoming Moments
- Joined Moments

Moment cards must display:

- Title
- Creator
- Category
- Participant count
- Capacity
- Status
- Start time
- Join button

Never display fabricated participant counts.

## 17.4 Moment Details

Display:

- Title
- Description
- Creator profile
- Participants
- Capacity
- Start time
- Expiration
- Visibility
- Join / Leave actions
- Invite action
- Report action

The interface must react to real-time participant changes.

## 17.5 Profile

Display:

- Avatar
- Username
- Biography
- Interests
- Level
- XP
- Badges
- Achievements
- Favorite communities

Provide privacy controls.

## 17.6 Quests

Display:

- Daily quests
- Weekly quests
- Completion progress
- Rewards
- Completed quests

Clearly distinguish claimed and unclaimed rewards.

## 17.7 Communities

Preserve the current community experience.

Add:

- Community discovery
- Community recommendations
- Active status
- Featured communities

Existing roles, permissions, channels, and messaging must continue working.

---

# 18. INTERACTION AND ANIMATION

Motion should improve usability, not distract users.

Recommended interactions:

- Smooth page transitions
- Subtle card hover
- Button feedback
- Animated XP progress
- Badge unlock animation
- Moment join transition
- Toast notifications
- Skeleton loading
- Smooth drawers and modals

Suggested animation durations:

| Interaction | Duration |
|---|---:|
| Hover | 150ms |
| Button | 120ms |
| Dropdown | 180ms |
| Modal | 220ms |
| Page transition | 200ms |

Respect `prefers-reduced-motion`.

Avoid continuous animations that consume unnecessary resources.

---

# 19. SECURITY AND MODERATION

Security must be part of the architecture from the beginning.

Requirements:

- Server-side authorization
- Input validation
- Rate limiting
- CSRF protection where applicable
- XSS protection
- Safe file uploads
- Invite token security
- Spam prevention
- Block and report functionality
- Moderation audit logs
- XP fraud prevention
- Private profile protection

For AI features:

- Do not expose API keys to the browser.
- Validate model outputs.
- Apply usage limits.
- Respect user consent.
- Never send private conversations to external AI services without appropriate authorization.

---

# 20. ANALYTICS AND GROWTH METRICS

Integrate product analytics.

Recommended events:

- user_registered
- user_activated
- moment_created
- moment_joined
- moment_completed
- referral_shared
- referral_registered
- referral_activated
- quest_completed
- profile_shared
- community_joined

## Key Metrics

### Acquisition

- New registrations
- Referral registrations
- Referral conversion rate

### Activation

- Percentage of users completing first meaningful activity
- Time to first interaction
- First Moment participation

### Engagement

- Daily Active Users
- Weekly Active Users
- Moments created per day
- Moments joined per user

### Retention

- Day 1 retention
- Day 7 retention
- Day 30 retention

### Viral Growth

- Invites per active user
- Referral activation rate
- Organic registrations
- Viral coefficient

Do not optimize for registrations alone.

Prioritize activated users and meaningful social interactions.

---

# 21. RECOMMENDED PROJECT STRUCTURE

Adapt this structure to the existing repository.

Do not reorganize the entire project unnecessarily.

Example:

```text
src/
  app/
    (main)/
      home/
      explore/
      moments/
      communities/
      messages/
      friends/
      quests/
      profile/

    api/
      v1/

  components/
    ui/
    layout/
    social/
    moments/
    gamification/

  modules/
    social/
    moments/
      components/
      services/
      repositories/
      schemas/
      types/

    referrals/
    gamification/
    quests/
    discovery/
    ai/

  lib/
    auth/
    database/
    websocket/
    cache/
    validation/

  hooks/
  styles/
  types/
```

Each module should have clear responsibilities.

Avoid putting business logic directly inside React components or API route handlers.

---

# 22. DEVELOPMENT ROADMAP

## Sprint 0 — Repository Audit

Tasks:

- Inspect existing architecture.
- Identify current database.
- Identify current WebSocket implementation.
- Identify current authentication and permissions.
- Review the existing UI.
- Identify reusable components.
- Document technical risks.

Deliverable: Architecture audit report.

Do not implement new features before completing the audit.

## Sprint 1 — Design System

Tasks:

- Create design tokens.
- Establish typography.
- Implement component primitives.
- Build navigation.
- Implement responsive application shell.
- Create loading and empty states.

Deliverable: Reusable custom design system.

## Sprint 2 — Moments Backend

Tasks:

- Database migrations.
- Moment creation.
- Moment listing.
- Moment details.
- Join and leave.
- Capacity validation.
- Expiration jobs.
- Authorization.
- WebSocket integration.

Deliverable: Functional Moments API and realtime behavior.

## Sprint 3 — Moments Frontend

Tasks:

- Moments feed.
- Moment creation modal.
- Moment details page.
- Participant list.
- Real-time updates.
- Responsive layouts.
- Error and loading states.

Deliverable: Complete Moments experience.

## Sprint 4 — Referral and Profile Sharing

Tasks:

- Referral code generation.
- Invitation URLs.
- Referral attribution.
- Registration integration.
- Shareable profile cards.
- Open Graph metadata.
- Referral analytics.

Deliverable: Viral acquisition foundation.

## Sprint 5 — Gamification

Tasks:

- XP ledger.
- Level calculation.
- Badge definitions.
- Achievement awarding.
- Profile integration.
- Anti-abuse rules.

Deliverable: Basic social progression system.

## Sprint 6 — Testing and Launch Preparation

Tasks:

- Unit tests.
- Integration tests.
- End-to-end tests.
- Security review.
- Performance checks.
- Mobile testing.
- Analytics validation.

Deliverable: Launch-ready MVP.

---

# 23. ACCEPTANCE CRITERIA

The MVP is not complete until all of the following are satisfied.

## Moments

- Users can create Moments.
- Users can discover public Moments.
- Users can join and leave.
- Capacity cannot be exceeded.
- Participant updates are realtime.
- Expired Moments are handled correctly.
- Unauthorized access is rejected.

## Referrals

- Every user can obtain a referral link.
- Attribution survives the registration flow.
- Self-referrals are rejected.
- Duplicate rewards are prevented.
- Activated referrals are measurable.

## Gamification

- XP is calculated server-side.
- XP transactions are recorded.
- Duplicate rewards are prevented.
- Levels update correctly.
- Badges are awarded according to verified criteria.

## Design System

- All new pages use shared tokens.
- Desktop and mobile layouts work.
- RTL works correctly.
- Loading and empty states exist.
- Buttons and controls have accessible states.
- No major visual inconsistency exists.

## Existing Features

- Chat still works.
- Voice still works.
- Video still works.
- Servers still work.
- Roles and permissions still work.
- Friends still work.
- Notifications still work.

No regression is acceptable in existing functionality.

---

# 24. INSTRUCTIONS FOR ANTIGRAVITY

You are acting as a senior full-stack engineer, product designer, UX architect, and technical lead.

Your task is to implement this specification in the existing repository.

Follow these rules strictly:

1. Start by inspecting the repository.
2. Do not assume the current architecture.
3. Do not replace working systems unnecessarily.
4. Reuse existing authentication and authorization.
5. Reuse existing database models.
6. Reuse existing WebSocket infrastructure.
7. Follow the custom Design System.
8. Build reusable React components.
9. Use strict TypeScript types.
10. Validate all user input.
11. Keep business logic outside UI components.
12. Handle loading, empty, success, and error states.
13. Implement proper responsive behavior.
14. Support Persian RTL and mixed Persian-English content.
15. Preserve existing application functionality.
16. Never use mock data in production functionality.
17. Never fabricate user counts or online status.
18. Add tests for critical business logic.
19. Apply database migrations safely.
20. Document important architectural decisions.

## Implementation Workflow

Do not attempt to implement the entire project in one operation.

Use this workflow:

**Step 1:** Audit the repository and write an implementation plan.

**Step 2:** Present the proposed architecture and identify conflicts with existing code.

**Step 3:** Implement the Design System and application shell.

**Step 4:** Implement the Moments backend.

**Step 5:** Implement the Moments frontend.

**Step 6:** Implement referrals and profile sharing.

**Step 7:** Implement gamification.

**Step 8:** Run tests and fix regressions.

After each phase:

- Summarize completed work.
- List modified files.
- Report database changes.
- Report tests performed.
- Identify remaining issues.

Do not mark a feature as complete if it only has a visual frontend without functional backend integration.

Do not use fake buttons, fake interactions, placeholder API responses, or simulated production functionality.

If a required decision depends on unknown existing infrastructure, inspect the code first. Ask only when a decision cannot safely be inferred.

---

# 25. FINAL PRODUCT QUALITY BAR

The finished product must feel like a premium, original social platform.

It must not feel like:

- A Discord clone.
- A generic admin dashboard.
- A collection of disconnected features.
- A template-based SaaS interface.

It should feel like:

- A living social ecosystem.
- A place for discovering people.
- A place for spontaneous activities.
- A place for communities.
- A place where users develop their digital identity.

**Primary MVP Objective:**

Create a system where a user can discover an interesting social activity, join it, interact with people, share it with friends, and bring new users into the platform.

The first priority is not the number of features.

The first priority is creating a repeatable social experience that users genuinely want to share.

**Build the foundation correctly. Preserve existing functionality. Make every new feature meaningful, polished, measurable, and scalable.**
