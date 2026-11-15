'use client';

import React from 'react';
import { Plus, Compass, MessageSquare, Download, Flame } from 'lucide-react';
import { Server } from '@/types/discord';

interface ServerSidebarProps {
  servers: Server[];
  activeServerId: string;
  onSelectServer: (id: string) => void;
  onOpenCreateModal: () => void;
  onOpenMoments?: () => void;
  isMomentsActive?: boolean;
}

export const ServerSidebar: React.FC<ServerSidebarProps> = ({
  servers,
  activeServerId,
  onSelectServer,
  onOpenCreateModal,
  onOpenMoments,
  isMomentsActive = false,
}) => {
  return (
    <nav
      className="w-[72px] bg-[#1e1f22] flex flex-col items-center py-3 space-y-2 select-none z-30 shrink-0 h-full overflow-y-auto no-scrollbar"
      dir="rtl"
    >
      {/* 1. Direct Messages / Discord IR Icon */}
      <div className="relative group flex items-center justify-center w-full">
        {/* Discord Active / Hover Indicator Pill on the right edge (RTL) */}
        <div
          className={`absolute -right-0.5 w-1 bg-white rounded-l-full transition-all duration-200 ${
            activeServerId === 'home' && !isMomentsActive
              ? 'h-10 opacity-100'
              : 'h-0 opacity-0 group-hover:h-5 group-hover:opacity-100'
          }`}
        />
        <button
          onClick={() => onSelectServer('home')}
          className={`w-12 h-12 flex items-center justify-center transition-all duration-200 relative group ${
            activeServerId === 'home' && !isMomentsActive
              ? 'rounded-[16px] bg-[#5865F2] text-white shadow-[0_4px_12px_rgba(88,101,242,0.4)]'
              : 'rounded-[24px] group-hover:rounded-[16px] bg-[#313338] text-[#dbdee1] group-hover:bg-[#5865F2] group-hover:text-white'
          }`}
          title="پیام‌های مستقیم و خانه"
        >
          {/* Discord Clyde Logo Representation */}
          <svg className="w-7 h-7 fill-current" viewBox="0 0 127.14 96.36">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
          </svg>
        </button>
      </div>

      {/* 2. Moments Pill (دورهمی‌های زنده) */}
      <div className="relative group flex items-center justify-center w-full">
        <div
          className={`absolute -right-0.5 w-1 bg-white rounded-l-full transition-all duration-200 ${
            isMomentsActive
              ? 'h-10 opacity-100'
              : 'h-0 opacity-0 group-hover:h-5 group-hover:opacity-100'
          }`}
        />
        <button
          onClick={onOpenMoments}
          className={`w-12 h-12 flex items-center justify-center transition-all duration-200 relative group ${
            isMomentsActive
              ? 'rounded-[16px] bg-[#eb459e] text-white shadow-[0_4px_12px_rgba(235,69,158,0.4)]'
              : 'rounded-[24px] group-hover:rounded-[16px] bg-[#313338] text-[#dbdee1] group-hover:bg-[#eb459e] group-hover:text-white'
          }`}
          title="دورهمی‌ها و مامنت‌های زنده"
        >
          <Flame className="w-6 h-6" />
        </button>
      </div>

      {/* Discord Horizontal Divider */}
      <div className="w-8 h-[2px] bg-[#35363c] rounded" />

      {/* 3. Server List */}
      <div className="flex-1 w-full space-y-2 flex flex-col items-center">
        {servers.map((server) => {
          const isActive = server.id === activeServerId && !isMomentsActive;
          return (
            <div key={server.id} className="relative group flex items-center justify-center w-full">
              <div
                className={`absolute -right-0.5 w-1 bg-white rounded-l-full transition-all duration-200 ${
                  isActive
                    ? 'h-10 opacity-100'
                    : 'h-0 opacity-0 group-hover:h-5 group-hover:opacity-100'
                }`}
              />
              <button
                onClick={() => onSelectServer(server.id)}
                className={`w-12 h-12 flex items-center justify-center text-sm font-extrabold transition-all duration-200 ${
                  isActive
                    ? 'rounded-[16px] bg-[#5865F2] text-white shadow-[0_4px_12px_rgba(88,101,242,0.4)]'
                    : 'rounded-[24px] group-hover:rounded-[16px] bg-[#313338] text-[#dbdee1] group-hover:bg-[#5865F2] group-hover:text-white'
                }`}
                title={server.name}
              >
                {server.icon && server.icon.length <= 2 ? (
                  <span className="text-xl">{server.icon}</span>
                ) : (
                  <span>{server.acronym || server.name.charAt(0)}</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* 4. Add Server Action Button */}
      <div className="relative group flex items-center justify-center w-full">
        <button
          onClick={onOpenCreateModal}
          className="w-12 h-12 rounded-[24px] group-hover:rounded-[16px] bg-[#313338] hover:bg-[#23a55a] text-[#23a55a] hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
          title="افزودن سرور"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* 5. Explore Public Servers Button */}
      <div className="relative group flex items-center justify-center w-full">
        <button
          onClick={onOpenMoments}
          className="w-12 h-12 rounded-[24px] group-hover:rounded-[16px] bg-[#313338] hover:bg-[#23a55a] text-[#23a55a] hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
          title="کشف سرورهای عمومی"
        >
          <Compass className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};
