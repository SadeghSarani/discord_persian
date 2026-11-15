/**
 * NEXUS Realtime Event Contracts & Typed Namespaces
 * Follows kebab-case or dot-notated conventions: `domain.event`
 */

export const REALTIME_EVENTS = {
  // Session & Auth
  SESSION_REVOKED: 'session.revoked',
  AUTH_ERROR: 'auth.error',

  // Presence
  PRESENCE_UPDATE: 'presence.update',
  PRESENCE_ONLINE: 'presence.online',
  PRESENCE_OFFLINE: 'presence.offline',

  // Moments
  MOMENT_CREATED: 'moment.created',
  MOMENT_UPDATED: 'moment.updated',
  MOMENT_JOINED: 'moment.joined',
  MOMENT_LEFT: 'moment.left',
  MOMENT_EXPIRED: 'moment.expired',
  MOMENT_CANCELLED: 'moment.cancelled',

  // Communities & Channels
  COMMUNITY_CREATED: 'community.created',
  COMMUNITY_UPDATED: 'community.updated',
  COMMUNITY_MEMBER_JOINED: 'community.member_joined',
  COMMUNITY_MEMBER_LEFT: 'community.member_left',
  COMMUNITY_MEMBER_BANNED: 'community.member_banned',
  CHANNEL_MESSAGE_CREATED: 'message.created',
  CHANNEL_MESSAGE_UPDATED: 'message.updated',
  CHANNEL_MESSAGE_DELETED: 'message.deleted',
  CHANNEL_MESSAGE_REACTION_ADDED: 'message.reaction_added',
  CHANNEL_MESSAGE_REACTION_REMOVED: 'message.reaction_removed',

  // Social Graph
  FRIENDSHIP_REQUESTED: 'friendship.requested',
  FRIENDSHIP_ACCEPTED: 'friendship.accepted',

  // Direct Messages
  DM_MESSAGE_CREATED: 'dm.message.created',

  // Notifications
  NOTIFICATION_CREATED: 'notification.created',

  // Playground
  PLAYGROUND_STATE: 'playground.state',

  // Voice/Video Signaling
  SIGNALING_OFFER: 'signaling.offer',
  SIGNALING_ANSWER: 'signaling.answer',
  SIGNALING_ICE: 'signaling.ice',
  SIGNALING_PEER_JOINED: 'signaling.peer_joined',
  SIGNALING_PEER_LEFT: 'signaling.peer_left',
} as const;

export type RealtimeEventName = typeof REALTIME_EVENTS[keyof typeof REALTIME_EVENTS];

/**
 * Standard Room Patterns
 */
export const ROOM_PATTERNS = {
  user: (userId: string) => `user:${userId}`,
  community: (communityId: string) => `community:${communityId}`,
  channel: (channelId: string) => `channel:${channelId}`,
  moment: (momentId: string) => `moment:${momentId}`,
  conversation: (conversationId: string) => `dm:${conversationId}`,
  playground: (sessionId: string) => `playground:${sessionId}`,
  signaling: (channelId: string) => `signaling:${channelId}`,
} as const;

export interface RealtimeEnvelope<T = any> {
  eventId: string;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  payload: T;
  timestamp: string;
}
