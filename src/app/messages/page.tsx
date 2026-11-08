'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Send, Search, Sparkles, Check, Phone, Video } from 'lucide-react';
import { useSocialStore } from '@/stores/useSocialStore';
import { MessageBubble } from '@/components/messages/MessageBubble';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { cn } from '@/lib/utils';
import { RelativeTime } from '@/components/ui/RelativeTime';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversation, 
    messages, 
    sendMessage, 
    currentUser 
  } = useSocialStore();

  const [messageText, setMessageText] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const currentMessages = activeConv ? messages[activeConv.id] || [] : [];

  const filteredConversations = conversations.filter((c) =>
    c.participant.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.participant.username.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConv) return;
    sendMessage(activeConv.participant.id, messageText.trim());
    setMessageText('');
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] min-h-[500px] rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col md:flex-row">
      {/* Conversations List Sidebar */}
      <div className={cn(
        'w-full md:w-80 lg:w-96 border-r border-zinc-200 dark:border-zinc-800 flex flex-col',
        activeConversationId ? 'hidden md:flex' : 'flex'
      )}>
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              Direct Messages
            </h1>
          </div>
          <SearchInput
            value={filterQuery}
            onChange={setFilterQuery}
            placeholder="Search conversations..."
            className="py-2 text-xs"
          />
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {filteredConversations.map((conv) => {
            const isActive = activeConv?.id === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                className={cn(
                  'w-full p-4 flex items-center gap-3.5 text-left transition-colors cursor-pointer',
                  isActive
                    ? 'bg-purple-50/70 dark:bg-purple-950/30'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                )}
              >
                <Avatar
                  src={conv.participant.avatar}
                  alt={conv.participant.name}
                  size="md"
                  hasStoryRing={conv.participant.verified}
                  isOnline={true}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 truncate">
                      {conv.participant.name}
                    </p>
                    <span className="text-[10px] text-zinc-400">
                      {conv.lastMessage ? <RelativeTime dateString={conv.lastMessage.createdAt} /> : ''}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                    {conv.lastMessage?.text || 'Started a conversation'}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Conversation Chat Window */}
      {activeConv ? (
        <div className={cn(
          'flex-1 flex flex-col h-full bg-zinc-50/40 dark:bg-zinc-950/40',
          !activeConversationId ? 'hidden md:flex' : 'flex'
        )}>
          {/* Top Chat Bar */}
          <div className="p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveConversation(null)}
                className="md:hidden text-xs font-bold text-purple-600 mr-1"
              >
                ← Back
              </button>
              <Link href={`/profile?id=${activeConv.participant.id}`}>
                <Avatar src={activeConv.participant.avatar} alt={activeConv.participant.name} size="md" isOnline />
              </Link>
              <div>
                <Link
                  href={`/profile?id=${activeConv.participant.id}`}
                  className="font-bold text-sm text-zinc-900 dark:text-zinc-100 hover:text-purple-600 flex items-center gap-1.5"
                >
                  {activeConv.participant.name}
                  {activeConv.participant.verified && (
                    <span className="w-3.5 h-3.5 rounded-full bg-purple-600 text-white text-[8px] flex items-center justify-center font-bold">
                      ✓
                    </span>
                  )}
                </Link>
                <p className="text-[11px] text-emerald-500 font-medium">Active now</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toast('Voice call feature mocked! 📞')}
                className="rounded-full"
                title="Start audio call"
              >
                <Phone className="w-4 h-4 text-zinc-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toast('Video call feature mocked! 📹')}
                className="rounded-full"
                title="Start video call"
              >
                <Video className="w-4 h-4 text-zinc-500" />
              </Button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
            <div className="text-center py-6">
              <Avatar
                src={activeConv.participant.avatar}
                alt={activeConv.participant.name}
                size="lg"
                className="mx-auto mb-2"
              />
              <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{activeConv.participant.name}</p>
              <p className="text-xs text-zinc-400">@{activeConv.participant.username}</p>
              <p className="text-xs text-zinc-500 mt-2 max-w-xs mx-auto">{activeConv.participant.bio}</p>
            </div>

            {currentMessages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isMe={msg.senderId === currentUser.id}
              />
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={`Message ${activeConv.participant.name}...`}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <Button type="submit" variant="gradient" size="md" className="rounded-full">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center p-8 text-center text-zinc-400">
          Select a chat to begin messaging
        </div>
      )}
    </div>
  );
}
