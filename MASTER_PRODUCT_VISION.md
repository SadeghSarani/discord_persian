# MASTER PRODUCT VISION & DEVELOPMENT MASTER PLAN

**Project Type:** Next-Generation Social Platform  
**Document Version:** 1.0  
**Status:** Active Product Development  
**Primary Goal:** Build a differentiated, highly engaging, trend-driven social ecosystem.  
**Development Environment:** Antigravity AI Agent  
**Architecture Direction:** Modular Monolith  
**Document Language:** English (Technical Source of Truth)

---

# 1. IMPORTANT INSTRUCTIONS FOR ANTIGRAVITY

You are working on a long-term social platform project.

You must understand the complete product vision, existing infrastructure, technical requirements, development philosophy, and roadmap before performing any implementation.

This document is the primary product vision and strategic reference for this project.

Other technical specifications, including `PRODUCT_SPEC.md`, must be considered complementary documents.

## Mandatory Rules

1. Never assume a feature is implemented simply because its UI exists.
2. Always inspect the actual frontend, backend, database, APIs, WebSocket handlers, authentication, authorization, and tests.
3. Reuse existing infrastructure whenever technically appropriate.
4. Do not duplicate existing functionality.
5. Do not introduce unnecessary complexity or infrastructure.
6. Do not perform large refactoring without identifying a real architectural problem.
7. Do not make architectural decisions based only on personal preference.
8. All critical operations must be validated on the server.
9. Database consistency and transaction safety are mandatory.
10. Real-time events must be published only after successful database commits.
11. Security, privacy, abuse prevention, and concurrency must be considered for every feature.
12. Never mark functionality as COMPLETE without verifiable implementation evidence.
13. Never hide incomplete work behind mock data or frontend-only implementations.
14. Never silently remove or break existing functionality.
15. Every implementation task must have explicit acceptance criteria.

## Development Control Policy

Development must follow controlled stages:

- Inspect.
- Analyze.
- Design.
- Propose.
- Obtain approval where required.
- Implement.
- Test.
- Verify.
- Report.

Do not combine unrelated tasks into one large implementation.

Do not automatically proceed to the next major feature when the current feature has unresolved critical problems.

---

# 2. PRODUCT VISION

We are building a next-generation social platform inspired by the strengths of community-based platforms, but we are NOT building a Discord clone.

The product must establish its own identity, interaction model, discovery experience, and reasons for users to return.

The platform should become a place where people can:

- Discover interesting people.
- Find communities related to their interests.
- Create temporary social activities.
- Join spontaneous conversations.
- Meet people through shared activities.
- Play together.
- Build a recognizable social identity.
- Share experiences.
- Invite friends.
- Complete challenges.
- Earn achievements.
- Discover emerging trends.
- Participate in real-time social experiences.

The platform should combine:

1. Real-time communication.
2. Social discovery.
3. Temporary activities.
4. Community interaction.
5. Social identity.
6. Gamification.
7. Referral-based growth.
8. Interactive entertainment.
9. Trend-driven experiences.

## Core Product Philosophy

The platform should not depend exclusively on users creating content.

It should actively help users discover reasons to participate.

A user should be able to open the platform and quickly answer:

- What is happening right now?
- What can I join?
- Who shares my interests?
- What are people talking about?
- Which activities are worth participating in?
- What can I do with my friends?
- What new experiences are available?

The product must encourage meaningful participation rather than empty engagement.

---

# 3. EXISTING TECHNOLOGY AND INFRASTRUCTURE

The project is currently being developed using:

- Next.js
- React
- WebSocket for real-time communication
- PostgreSQL
- Prisma or Drizzle ORM, depending on the existing implementation

The following capabilities have already been developed or are part of the existing project:

- Text Chat
- Voice Chat
- Servers / Communities
- Roles & Permissions
- Text Channels
- Video
- Friends
- User Profiles
- Notifications
- WebSocket Communication

IMPORTANT:

These capabilities have NOT been independently verified.

Audit their actual implementation before relying on them.

The existing codebase is the starting point. Do not rebuild working infrastructure unnecessarily.

---

# 4. PRODUCT FEATURES — PHASE ONE

## CRITICAL STRATEGIC DECISION

All the following major features belong to PHASE ONE.

The objective is to establish the complete social platform ecosystem before moving into advanced trend-driven development.

Do not postpone any of the following major product capabilities to Phase Two simply because the list is large.

However, implementation must be incremental, dependency-aware, and controlled.

Individual subfeatures may be delivered in smaller milestones.

---

# 5. MOMENTS — TEMPORARY SOCIAL ACTIVITIES

Moments are one of the most important product differentiators.

A Moment is a temporary social activity that allows users to gather around a specific intention, topic, or experience.

Examples:

- Looking for gaming teammates.
- Having a spontaneous conversation.
- Discussing a particular topic.
- Watching something together.
- Practicing a language.
- Meeting people with similar interests.
- Organizing a temporary group activity.

## Core Requirements

### Creation

Users must be able to create a Moment with:

- Title.
- Description.
- Category.
- Tags.
- Cover image, where supported.
- Maximum participant capacity.
- Start time.
- Expiration time.
- Visibility settings.

### Visibility

Support:

- Public.
- Friends.
- Private / Invitation Only.

Privacy must be enforced on the backend, not only through frontend filtering.

### Participation

Support:

- Join.
- Leave.
- Invite.
- Join through invitation link.
- Participant list.
- Live participant updates.
- Capacity enforcement.
- Host permissions.
- Moment status.
- Automatic expiration.

### Reliability

Prevent:

- Joining full Moments.
- Duplicate participation.
- Unauthorized access.
- Unauthorized invitations.
- Joining expired Moments.
- Race conditions when multiple users join simultaneously.

### Real-time Behavior

Participants should receive appropriate real-time updates when:

- Someone joins.
- Someone leaves.
- A Moment becomes full.
- A Moment ends.
- Relevant Moment details change.

All events must reflect committed database state.

---

# 6. DISCOVERY FEED

Discovery is the primary exploration experience.

It must help users discover:

- Active Moments.
- Interesting communities.
- Relevant people.
- Popular discussions.
- New social activities.
- Relevant interests.
- Emerging trends in future development stages.

## Core Requirements

- Personalized recommendations.
- Popular activities.
- Recently created Moments.
- Active communities.
- Category-based exploration.
- Search and filtering.
- Relevant recommendations.
- Empty states.
- Loading states.
- Responsive layouts.

## Important Rules

Discovery must respect:

- User privacy.
- Moment visibility.
- Community permissions.
- User blocking.
- User preferences.
- Content moderation policies.

Private activities must never appear in public Discovery results.

Do not expose private activity information through search, API responses, cached results, or recommendation systems.

---

# 7. REFERRAL SYSTEM

The platform must support a reliable referral-based growth system.

Users should have a unique referral link or code.

## Requirements

- Unique referral codes.
- Referral links.
- Referral attribution.
- Successful registration tracking.
- Activation tracking.
- Referral history.
- Referral rewards.
- Referral status.
- Abuse prevention.

## Referral Activation

A referral should not automatically count as successful just because someone registered.

Define activation using meaningful product activity.

For example:

- Account verification.
- Profile completion.
- Joining a community or Moment.
- Meaningful participation.

The exact activation rules must be configurable and documented.

## Anti-Fraud

Prevent:

- Self-referrals.
- Duplicate rewards.
- Repeated reward claims.
- Obvious automated registrations.
- Manipulated referral attribution.
- Reward farming.

Referral rewards must be processed idempotently and safely.

---

# 8. SOCIAL IDENTITY AND SHAREABLE PROFILES

Profiles should become an important part of the social experience.

Users must be able to express their identity and social activity.

## Requirements

- Profile customization.
- Avatar.
- Cover image.
- Biography.
- Interests.
- Social achievements.
- XP.
- Level.
- Badges.
- Selected activity information.
- Community memberships, according to privacy settings.
- Shareable profile links.
- Public profile preview.
- Privacy controls.

## Shareable Profile Cards

Users should be able to share attractive profile cards outside the platform.

Consider:

- Open Graph metadata.
- Social preview images.
- Shareable URLs.
- Mobile-friendly public profile pages.

Never expose private profile information through public metadata.

---

# 9. GAMIFICATION SYSTEM

Gamification must encourage meaningful activity without becoming a system that rewards spam.

## XP System

Support:

- XP earning rules.
- XP history.
- Level progression.
- Configurable reward values.
- Duplicate reward prevention.
- XP transaction records.

## Badges

Support:

- Achievement badges.
- Activity-based badges.
- Community-based badges.
- Special event badges.
- Display preferences.

## Achievements

Achievements must have clearly defined conditions.

Examples:

- First Moment created.
- First community joined.
- First successful referral.
- Meaningful group participation.
- Consistent activity.

## Important Rules

- Rewards must be server-authoritative.
- XP must not be granted twice for the same eligible event.
- Reward rules must be documented.
- Suspicious activity must be detectable.
- Users must not be able to modify XP or achievements directly.

---

# 10. QUESTS AND MISSIONS

Quests introduce structured social activities.

## Requirements

- Daily quests.
- Weekly quests.
- Special event quests.
- Progress tracking.
- Completion conditions.
- XP rewards.
- Badge rewards.
- Expiration.
- Claiming rewards.
- Quest history.

Examples:

- Join a Moment.
- Participate in a community discussion.
- Invite a friend.
- Discover a new community.
- Complete a group activity.

Quest completion must be based on verifiable server-side events.

Do not trust client-submitted progress values.

Prevent duplicate completion and duplicate rewards.

---

# 11. COMMUNITY RADAR

Community Radar helps users discover relevant people and communities.

Recommendations may be based on:

- Shared interests.
- Shared communities.
- Relevant activities.
- Public participation.
- User-selected preferences.
- Legitimate social connections.

## Requirements

- People recommendations.
- Community recommendations.
- Relevance scoring.
- Recommendation explanations.
- Privacy controls.
- Block and mute filtering.
- Recommendation dismissal.
- Feedback collection.

## Privacy Requirements

Never reveal private activity, private membership, hidden relationships, or sensitive behavioral information through recommendations.

Avoid invasive profiling.

Recommendation explanations should be understandable.

---

# 12. INTERESTS SYSTEM

Interests are a foundation for discovery and personalization.

## Requirements

- Interest selection.
- Interest categories.
- Multiple interests per user.
- Interest management.
- Interest-based exploration.
- Interest-based community recommendations.
- Interest-based Moments discovery.

The system should support future expansion without requiring a complete database redesign.

---

# 13. SOCIAL PLAYGROUND

Social Playground introduces interactive entertainment into the platform.

The goal is to make group interaction more enjoyable.

## Initial Capabilities

Consider:

- Simple multiplayer games.
- Group quizzes.
- Trivia.
- Word games.
- Social challenges.
- Party games.
- Collaborative activities.

## Future Extensibility

Design the architecture so new games can be introduced without modifying unrelated core systems.

User-created games are part of the product vision.

However, user-created games require additional security, moderation, resource isolation, and abuse prevention.

Do not allow arbitrary untrusted code execution.

---

# 14. TREND-DRIVEN PRODUCT — PHASE TWO

This is the next major strategic direction after Phase One.

The platform should evolve from a social platform with multiple features into a dynamic, trend-aware social ecosystem.

IMPORTANT:

Trend-driven functionality is not a replacement for the Phase One features.

It is a new intelligence and discovery layer built on top of them.

The platform should understand what people are currently interested in and create relevant opportunities for interaction.

## 14.1 Trend Discovery

Discover emerging topics and activities from legitimate signals such as:

- Public platform activity.
- User-selected interests.
- Moment creation patterns.
- Community discussions.
- Participation trends.
- Event activity.
- Approved external trend sources.

Do not assume every increase in activity represents a meaningful trend.

## 14.2 Real-Time Trending Topics

Create a system that can identify:

- Rising topics.
- Popular discussions.
- Emerging communities.
- Trending activities.
- Frequently discussed subjects.
- Time-sensitive social opportunities.

Trend scores must account for more than raw activity counts.

Consider:

- Activity velocity.
- Number of unique participants.
- Recent engagement.
- Trend duration.
- Relevance.
- Spam and manipulation signals.

## 14.3 Trend-Based Moments

Users should be able to discover or create Moments around current trends.

Examples:

- A trending game release.
- A popular sports event.
- A major entertainment release.
- A current technology discussion.
- A viral topic.
- A community event.

## 14.4 Dynamic Discovery Feed

Discovery should eventually become adaptive.

Its recommendations should reflect:

- Current interests.
- User preferences.
- Current trends.
- Social relevance.
- Activity freshness.
- Quality signals.

Avoid excessive repetition and filter low-quality or manipulated activity.

## 14.5 Trend-Based Quests

Introduce temporary challenges related to current events and trends.

Examples:

- Participate in a trending topic discussion.
- Join an event-related Moment.
- Discover a new trending community.

## 14.6 Trend Participation

The platform should make participation easy.

Users should be able to:

- Explore a trend.
- Join related activities.
- Create a Moment.
- Invite friends.
- Share discussions.
- Discover related communities.

## 14.7 Trend Analytics

Measure:

- Trend growth.
- Unique participants.
- Participation duration.
- Moment creation.
- Conversion to meaningful interaction.
- Community growth.

## 14.8 External Trend Integrations

Evaluate external data providers and APIs where appropriate.

Consider:

- Public event information.
- Entertainment trends.
- Gaming announcements.
- Technology news.
- Sports events.
- Public social signals where legally and technically accessible.

Respect provider terms, copyright, privacy, and API restrictions.

Never build the trend system around unauthorized scraping or private user data.

---

# 15. FUTURE AI CAPABILITIES

AI is a future enhancement, not an excuse to introduce unnecessary complexity into the initial architecture.

Potential capabilities:

- Personalized discovery.
- Interest recommendations.
- Smart community matching.
- Trend summarization.
- Conversation topic suggestions.
- Smart Moment recommendations.
- Quest personalization.
- Content categorization.

AI recommendations must remain explainable and respect privacy.

Core product functionality must not depend on an AI provider being available.

---

# 16. TECHNICAL ARCHITECTURE PRINCIPLES

## Architecture Strategy

Start with a Modular Monolith.

Do not introduce microservices at the beginning.

Organize the application into clear business modules.

Potential modules:

- Authentication
- Users
- Profiles
- Friends
- Communities
- Roles and Permissions
- Chat
- Voice
- Video
- Moments
- Discovery
- Referrals
- Gamification
- Quests
- Interests
- Recommendations
- Social Playground
- Notifications
- Analytics
- Trend Engine

These are logical module boundaries, not instructions to create separate services immediately.

Inspect the existing project structure before proposing any changes.

## Database

PostgreSQL is the preferred relational database.

Prisma or Drizzle may be used according to the existing implementation.

Requirements:

- Referential integrity.
- Appropriate indexes.
- Database constraints.
- Transaction safety.
- Unique constraints for idempotency.
- Efficient pagination.
- Auditable reward transactions.
- Migration safety.

The database is the source of truth.

## Redis

Introduce Redis only when an actual requirement justifies it.

Potential use cases:

- Distributed caching.
- Rate limiting.
- WebSocket scaling.
- Ephemeral coordination.
- Temporary counters.

Do not use Redis as the only storage for important business state.

## Background Jobs

BullMQ may be introduced when background processing becomes necessary.

Potential jobs:

- Moment expiration.
- Referral activation.
- Quest evaluation.
- Notification delivery.
- Trend aggregation.
- Analytics processing.

Jobs must be retry-safe and idempotent.

## WebSocket

Real-time communication must be reliable.

Requirements:

- Authenticated connections.
- Authorization for subscriptions and events.
- Event validation.
- Appropriate room isolation.
- Reconnection handling.
- Duplicate event protection where necessary.
- Consistent event ordering where required.

Publish business events only after the database transaction commits.

Consider a transactional outbox pattern when reliable event delivery becomes necessary.

---

# 17. SECURITY AND ABUSE PREVENTION

Security is a core product requirement.

Every feature must consider:

- Authentication.
- Authorization.
- Ownership validation.
- Input validation.
- Rate limiting.
- Spam prevention.
- Privacy.
- Abuse reporting.
- Blocking.
- Moderation.
- Duplicate operations.
- Concurrency.
- Resource exhaustion.

Sensitive operations must be enforced server-side.

Never trust the frontend to enforce permissions.

Never trust user-submitted XP, referral status, quest completion, or participant counts.

For private features, test direct API access and WebSocket subscriptions, not only the UI.

---

# 18. DESIGN SYSTEM AND USER EXPERIENCE

The product must have its own visual identity.

Do not copy Discord or Telegram.

## Design Direction

- Modern.
- Professional.
- Minimal.
- Futuristic.
- Dark-first.
- Premium.
- Social.
- Highly responsive.

## Color Palette

| Token | Color |
|---|---|
| Background | #090B12 |
| Surface | #101522 |
| Elevated | #171E2E |
| Hover | #1C2638 |
| Border | #263044 |
| Primary Text | #F3F5FA |
| Secondary Text | #9AA6BA |
| Muted | #66738A |
| Primary Accent | #8B7CFF |
| Secondary Accent | #43C9D8 |
| Success | #36C98F |
| Warning | #F3B75E |
| Danger | #F06C7A |

## Typography

- Persian: Vazirmatn.
- English: Inter.

## UX Requirements

- Responsive layouts.
- Dedicated mobile experience.
- Consistent spacing.
- Consistent component behavior.
- Accessible interactions.
- Loading states.
- Empty states.
- Error states.
- Success feedback.
- Clear navigation.
- Appropriate animations.
- Performance-conscious rendering.

Mobile should not simply be a compressed desktop interface.

The interface must be evaluated as a complete user journey.

---

# 19. PRODUCT ANALYTICS

The product must be measurable.

Do not confuse feature implementation with product success.

## Core Metrics

- DAU.
- WAU.
- MAU.
- D1 Retention.
- D7 Retention.
- D30 Retention.
- Activation Rate.
- Referral Conversion.
- Moment Creation Rate.
- Moment Join Rate.
- Discovery View-to-Join Conversion.
- Quest Completion Rate.
- Profile Sharing Rate.
- Community Engagement.
- Playground Participation.

## Feature-Specific Metrics

### Moments

- Creation rate.
- Join conversion.
- Average participants.
- Completion rate.
- Repeat participation.

### Discovery

- Feed impressions.
- Click-through rate.
- Join conversion.
- Recommendation relevance.

### Referral

- Invitations sent.
- Registrations.
- Activated referrals.
- Referral abuse rate.

### Gamification

- XP earned.
- Achievement unlocks.
- Repeat activity.
- Retention correlation.

### Quests

- Quest impressions.
- Start rate.
- Completion rate.
- Reward claim rate.

### Social Playground

- Sessions created.
- Sessions joined.
- Average session duration.
- Repeat sessions.

Use PostHog or another appropriate analytics solution after evaluating the current implementation.

Respect consent and applicable privacy regulations.

---

# 20. PHASE ONE DELIVERY STRATEGY

All major Phase One features must be delivered.

However, development must follow technical dependencies.

Recommended execution sequence:

## Stage A — Foundation Audit

- Existing architecture.
- Authentication.
- Authorization.
- Database.
- API.
- WebSocket.
- Testing infrastructure.
- Design System.

## Stage B — Social Foundation

- Interests.
- Profile improvements.
- Shareable profiles.
- Required social privacy controls.

## Stage C — Core Social Activities

- Moments.
- Invitations.
- Real-time participants.
- Automatic expiration.

## Stage D — Discovery

- Discovery Feed.
- Search.
- Filtering.
- Recommendations.
- Privacy-aware visibility.

## Stage E — Growth

- Referral System.
- Referral attribution.
- Activation.
- Reward processing.
- Anti-fraud.

## Stage F — Gamification

- XP.
- Levels.
- Badges.
- Achievements.
- Quests.

## Stage G — Community Intelligence

- Community Radar.
- Interest matching.
- People recommendations.
- Community recommendations.

## Stage H — Social Playground

- Initial group games.
- Multiplayer interactions.
- Session management.
- Extensible game architecture.

## Stage I — Full Platform Verification

- End-to-end testing.
- Security testing.
- Concurrency testing.
- Responsive testing.
- Performance testing.
- Analytics validation.

This sequence is a proposed dependency-aware plan, not permission to skip the initial audit or modify existing infrastructure blindly.

---

# 21. PHASE TWO — TREND-DRIVEN EVOLUTION

Phase Two starts after Phase One capabilities are implemented and verified.

Focus areas:

1. Trend Detection Engine.
2. Trending Topics.
3. Dynamic Discovery.
4. Trend-Based Moments.
5. Trend-Based Quests.
6. Real-Time Trend Participation.
7. Trend Analytics.
8. External Trend Integrations.
9. AI-Powered Personalization.

The trend engine must be designed as an extension of the existing modular architecture.

Do not rewrite the platform to introduce it.

---

# 22. QUALITY GATES

A feature cannot be considered complete merely because development has finished.

Every feature must pass these quality gates:

## Gate 1 — Functional

The complete user journey works.

## Gate 2 — Backend

Business logic is implemented and validated server-side.

## Gate 3 — Database

Data integrity and transaction safety are verified.

## Gate 4 — Security

Authorization, privacy, and abuse prevention are verified.

## Gate 5 — Concurrency

Relevant simultaneous operations are tested.

## Gate 6 — Real-Time

WebSocket behavior and event consistency are verified where applicable.

## Gate 7 — UX

Responsive behavior and interaction quality are verified.

## Gate 8 — Analytics

Important events and product metrics are verified.

## Gate 9 — Regression

Existing features continue working.

---

# 23. FEATURE STATUS CLASSIFICATION

Use these exact statuses during audits:

- COMPLETE
- PARTIAL
- UI_ONLY
- BACKEND_ONLY
- MISSING
- BROKEN
- UNVERIFIED

Every status must have supporting evidence.

For each feature, report:

- Frontend implementation.
- Backend implementation.
- Database implementation.
- API implementation.
- WebSocket implementation, if applicable.
- Authentication and authorization.
- Security.
- Tests.
- UX quality.
- Known limitations.

Never mark a feature COMPLETE if critical parts are missing.

---

# 24. REQUIRED DOCUMENTATION

Maintain these documents in the project root:

## MASTER_PRODUCT_VISION.md

The strategic product vision and complete roadmap.

## PRODUCT_SPEC.md

Detailed product and technical specifications.

## ARCHITECTURE.md

Actual application architecture, modules, dependencies, and infrastructure.

## DATABASE_SCHEMA.md

Database models, relationships, constraints, and indexes.

## API_SPEC.md

API routes, request/response contracts, and authorization rules.

## WEBSOCKET_SPEC.md

Events, payloads, authorization, and real-time behavior.

## SECURITY.md

Security requirements, threat scenarios, and mitigation strategies.

## ANALYTICS_SPEC.md

Event definitions, funnels, and product metrics.

## IMPLEMENTATION_STATUS.md

Verified implementation status for all major features.

These documents must describe the actual implementation, not imagined architecture.

Update documentation when relevant implementation changes are approved and completed.

Do not overwrite useful existing documentation without reviewing it first.

---

# 25. FIRST ASSIGNMENT — INNOVATION AUDIT

When this document is first introduced, DO NOT START IMPLEMENTING FEATURES.

Your first responsibility is to understand the existing project.

Perform a comprehensive read-only audit.

## Inspect

1. Frontend architecture.
2. Backend architecture.
3. Database schema.
4. Existing API routes.
5. WebSocket implementation.
6. Authentication.
7. Authorization.
8. Existing social features.
9. Existing Moments or similar functionality.
10. Discovery functionality.
11. Referral functionality.
12. Gamification functionality.
13. Profile functionality.
14. Notification system.
15. Security.
16. Automated tests.
17. Design System.
18. Responsive behavior.
19. Performance concerns.
20. Dependencies and infrastructure.

## Required Audit Scenarios

Where the relevant feature exists, inspect and test:

- Multiple simultaneous users joining one Moment.
- Joining a full Moment.
- Unauthorized access to private Moments.
- Duplicate Join and Leave requests.
- Expired Moment access.
- Referral self-invitation.
- Duplicate referral rewards.
- Duplicate XP rewards.
- Quest completion manipulation.
- Unauthorized profile information exposure.
- Private activity appearing in Discovery.
- Unauthorized WebSocket subscriptions.
- User blocking and privacy enforcement.

If a test cannot safely be executed, report it as UNVERIFIED and explain why.

## Strict Read-Only Rule

During the initial audit:

- Do not modify any file.
- Do not install dependencies.
- Do not run database migrations.
- Do not change environment variables.
- Do not alter database records.
- Do not refactor.
- Do not generate replacement implementations.
- Do not silently fix discovered issues.

You may execute safe, non-mutating inspection and test commands.

If a test might modify data or infrastructure, request approval first.

## Required Audit Report

Create a comprehensive report in the response or a separate proposed report.

Include:

1. Executive Summary.
2. Actual Architecture.
3. Existing Feature Inventory.
4. Feature-by-Feature Status.
5. Evidence and File Paths.
6. Database Assessment.
7. API Assessment.
8. WebSocket Assessment.
9. Authentication and Authorization Assessment.
10. Security Findings.
11. Concurrency Findings.
12. UX and Responsive Findings.
13. Test Coverage.
14. Missing Features.
15. Broken Features.
16. Technical Debt.
17. Architectural Risks.
18. Product Gaps.
19. Recommended Priorities.
20. Suggested Implementation Sequence.

For each important finding, include:

- Severity: CRITICAL / HIGH / MEDIUM / LOW.
- Evidence.
- Affected files or modules.
- Actual impact.
- Recommended solution.
- Whether implementation requires architectural changes.

Clearly distinguish verified facts from assumptions.

Do not invent file paths, models, endpoints, tests, or implementation details.

## Stop Condition

After completing the audit:

STOP.

Do not implement any changes.

Wait for explicit approval before starting the next stage.

---

# 26. FINAL PRODUCT STANDARD

The ultimate goal is not to maximize the number of features.

The goal is to create a social platform that gives people compelling reasons to:

- Open the platform.
- Discover something interesting.
- Participate.
- Meet people.
- Build relationships.
- Return.
- Invite friends.
- Share experiences.

Every feature must contribute to a coherent social ecosystem.

Technical excellence and product value are equally important.

Build a platform with its own identity.

Do not build a copy of an existing product.

**Think in systems. Build incrementally. Verify everything. Prioritize meaningful user experiences.**
