'use client';

import React, { useState, useEffect } from 'react';
import { initialServers, initialMessages, currentUser, sampleUsers } from '@/data/mockData';
import { Server, Channel, Message, User } from '@/types/discord';
import { MomentItem } from '@/types/moments';
import { ServerSidebar } from '@/components/ServerSidebar';
import { ChannelSidebar } from '@/components/ChannelSidebar';
import { ChatArea } from '@/components/ChatArea';
import { MemberList } from '@/components/MemberList';
import { VoiceVideoRoom } from '@/components/VoiceVideoRoom';
import { ProfileModal } from '@/components/ProfileModal';
import { AuthModal } from '@/components/AuthModal';
import { CreateChannelModal } from '@/components/CreateChannelModal';
import { CreateServerModal } from '@/components/CreateServerModal';
import AppNavigation, { NavigationTab } from '@/components/layout/AppNavigation';
import MomentsFeed from '@/components/moments/MomentsFeed';
import { fa } from '@/lib/i18n/fa';

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('moments');
  const [servers, setServers] = useState<Server[]>(initialServers);
  const [activeServerId, setActiveServerId] = useState<string>(initialServers[0].id);
  const [activeUser, setActiveUser] = useState<User>(currentUser);
  const [allUsers, setAllUsers] = useState<User[]>(sampleUsers);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check existing session on load
  useEffect(() => {
    async function checkCurrentSession() {
      try {
        const res = await fetch('/api/v1/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            const userObj: User = {
              id: data.user.id,
              name: data.user.name,
              username: data.user.username,
              avatarStyle: data.user.avatarStyle,
              status: 'online',
              customStatus: data.user.customStatus || 'آنلاین در نکسوس 🎮',
              role: data.user.role || 'عضو رسمی',
              roleColor: data.user.roleColor || '#8b5cf6',
            };
            setActiveUser(userObj);
            setIsAuthenticated(true);
            setAllUsers((prev) => [userObj, ...prev.filter((u) => u.id !== userObj.id)]);
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
    }
    checkCurrentSession();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setActiveUser(currentUser);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Active channel within active server
  const currentServer = servers.find((s) => s.id === activeServerId) || servers[0];
  const firstChannel =
    currentServer.categories[0]?.channels[0] || {
      id: 'default',
      name: 'عمومی',
      type: 'text' as const,
    };

  const [activeChannel, setActiveChannel] = useState<Channel>(firstChannel);
  const [activeVoiceChannel, setActiveVoiceChannel] = useState<Channel | null>(null);

  // Messages state
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(initialMessages);

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [isCreateServerOpen, setIsCreateServerOpen] = useState(false);

  // Voice & Audio controls
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  // Handle switching server
  const handleSelectServer = (serverId: string) => {
    setActiveServerId(serverId);
    const targetServer = servers.find((s) => s.id === serverId);
    if (targetServer && targetServer.categories.length > 0) {
      const firstCat = targetServer.categories[0];
      if (firstCat.channels.length > 0) {
        setActiveChannel(firstCat.channels[0]);
      }
    }
  };

  // Handle selecting a channel
  const handleSelectChannel = (channel: Channel) => {
    if (channel.type === 'voice') {
      setActiveVoiceChannel(channel);
      setActiveChannel(channel);
    } else {
      setActiveChannel(channel);
    }
  };

  // Handle profile update
  const handleUpdateProfile = (updated: Partial<User>) => {
    setActiveUser((prev) => {
      const newUser = { ...prev, ...updated };
      setAllUsers((users) =>
        users.map((u) => (u.id === newUser.id ? newUser : u))
      );
      return newUser;
    });
  };

  // Handle Login / Register
  const handleLogin = (newUser: User) => {
    setActiveUser(newUser);
    setIsAuthenticated(true);
    setAllUsers((prev) => [newUser, ...prev.filter((u) => u.id !== newUser.id)]);
  };

  // Handle sending message
  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatarStyle: activeUser.avatarStyle,
      role: activeUser.role,
      roleColor: activeUser.roleColor,
      content: text,
      timestamp: new Date().toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      reactions: [],
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeChannel.id]: [...(prev[activeChannel.id] || []), newMessage],
    }));
  };

  // Handle adding reaction
  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessagesMap((prev) => {
      const channelMsgs = prev[activeChannel.id] || [];
      const updated = channelMsgs.map((msg) => {
        if (msg.id !== messageId) return msg;

        const reactions = msg.reactions || [];
        const existingReactIndex = reactions.findIndex((r) => r.emoji === emoji);

        if (existingReactIndex > -1) {
          const currentReaction = reactions[existingReactIndex];
          const hasReacted = currentReaction.users.includes(activeUser.id);

          const updatedUsers = hasReacted
            ? currentReaction.users.filter((id) => id !== activeUser.id)
            : [...currentReaction.users, activeUser.id];

          const updatedCount = updatedUsers.length;

          const newReactions = [...reactions];
          if (updatedCount === 0) {
            newReactions.splice(existingReactIndex, 1);
          } else {
            newReactions[existingReactIndex] = {
              ...currentReaction,
              count: updatedCount,
              users: updatedUsers,
            };
          }
          return { ...msg, reactions: newReactions };
        } else {
          return {
            ...msg,
            reactions: [
              ...reactions,
              {
                emoji,
                count: 1,
                users: [activeUser.id],
              },
            ],
          };
        }
      });

      return {
        ...prev,
        [activeChannel.id]: updated,
      };
    });
  };

  // Create Channel Callback
  const handleCreateChannel = (
    name: string,
    type: 'text' | 'voice',
    categoryId: string
  ) => {
    const newChan: Channel = {
      id: `ch_${Date.now()}`,
      name,
      type,
    };

    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== currentServer.id) return s;
        return {
          ...s,
          categories: s.categories.map((cat) => {
            if (cat.id !== categoryId) return cat;
            return {
              ...cat,
              channels: [...cat.channels, newChan],
            };
          }),
        };
      })
    );

    setActiveChannel(newChan);
    if (type === 'voice') {
      setActiveVoiceChannel(newChan);
    }
  };

  // Create Server Callback
  const handleCreateServer = (newServer: Server) => {
    setServers((prev) => [...prev, newServer]);
    setActiveServerId(newServer.id);
    if (newServer.categories[0]?.channels[0]) {
      setActiveChannel(newServer.categories[0].channels[0]);
    }
  };

  // Navigate from a Moment into active interaction
  const handleEnterMoment = (moment: MomentItem) => {
    setActiveTab('communities');
    const voiceChan = currentServer.categories
      .flatMap((c) => c.channels)
      .find((c) => c.type === 'voice');
    if (voiceChan) {
      setActiveVoiceChannel(voiceChan);
      setActiveChannel(voiceChan);
    }
  };

  const renderCommunitiesArea = () => {
    if (activeChannel.type === 'voice') {
      return (
        <VoiceVideoRoom
          channel={activeChannel}
          currentUser={activeUser}
          connectedUsers={allUsers}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          onDisconnect={() => {
            setActiveVoiceChannel(null);
            const textChan = currentServer.categories
              .flatMap((c) => c.channels)
              .find((c) => c.type === 'text');
            if (textChan) setActiveChannel(textChan);
          }}
        />
      );
    }

    return (
      <ChatArea
        channel={activeChannel}
        messages={messagesMap[activeChannel.id] || []}
        onSendMessage={handleSendMessage}
        onAddReaction={handleAddReaction}
        currentUser={activeUser}
      />
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[var(--nexus-bg)] text-[var(--nexus-text)]" dir="rtl">
      {/* 1. NEXUS Header Navigation */}
      <AppNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userXp={125}
        userLevel={2}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        isLoggedIn={isAuthenticated}
        currentUserName={activeUser.name}
        currentUserRole={activeUser.role}
      />

      {/* 2. Main Content Body */}
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'moments' && (
          <MomentsFeed
            currentUserId={activeUser.id}
            onEnterMoment={handleEnterMoment}
          />
        )}

        {activeTab === 'communities' && (
          <div className="flex-1 flex h-full overflow-hidden">
            {/* Server Rail */}
            <ServerSidebar
              servers={servers}
              activeServerId={activeServerId}
              onSelectServer={handleSelectServer}
              onOpenCreateModal={() => setIsCreateServerOpen(true)}
              onOpenAuthModal={() => setIsAuthOpen(true)}
            />

            {/* Channel Sidebar */}
            <ChannelSidebar
              server={currentServer}
              activeChannelId={activeChannel.id}
              onSelectChannel={handleSelectChannel}
              currentUser={activeUser}
              isMuted={isMuted}
              isDeafened={isDeafened}
              onToggleMute={() => setIsMuted(!isMuted)}
              onToggleDeafen={() => setIsDeafened(!isDeafened)}
              activeVoiceChannel={activeVoiceChannel}
              onDisconnectVoice={() => setActiveVoiceChannel(null)}
              onOpenCreateChannelModal={() => setIsCreateChannelOpen(true)}
              onOpenProfile={() => setIsProfileOpen(true)}
            />

            {/* Communities Workspace */}
            <div className="flex-1 flex h-full min-w-0">
              {renderCommunitiesArea()}

              {/* Members List */}
              <MemberList
                members={allUsers}
                onSelectMember={() => setIsProfileOpen(true)}
              />
            </div>
          </div>
        )}

        {activeTab === 'discovery' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[var(--nexus-bg)]">
            <div className="w-16 h-16 rounded-2xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] flex items-center justify-center text-3xl mb-4 text-[var(--nexus-accent)]">
              🧭
            </div>
            <h2 className="text-lg font-black text-white mb-2">{fa.discovery.title}</h2>
            <p className="text-xs text-[var(--nexus-text-muted)] max-w-md leading-relaxed mb-6 font-medium">
              {fa.discovery.subtitle}
            </p>
            <button
              onClick={() => setActiveTab('moments')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--nexus-primary)] to-[var(--nexus-primary-dark)] text-white text-xs font-bold shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-all"
            >
              مشاهده دورهمی‌های فعال
            </button>
          </div>
        )}
      </main>

      {/* Global Modals */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={activeUser}
        onUpdateUser={handleUpdateProfile}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
      />

      <CreateChannelModal
        isOpen={isCreateChannelOpen}
        onClose={() => setIsCreateChannelOpen(false)}
        onCreate={handleCreateChannel}
        categories={currentServer.categories.map((c) => ({
          id: c.id,
          name: c.name,
        }))}
      />

      <CreateServerModal
        isOpen={isCreateServerOpen}
        onClose={() => setIsCreateServerOpen(false)}
        onCreate={handleCreateServer}
      />
    </div>
  );
}
