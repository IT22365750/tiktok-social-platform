import React from 'react';
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { RelativeTime } from '@/components/ui/RelativeTime';

export const MessageBubble: React.FC<{ message: Message; isMe: boolean }> = ({ message, isMe }) => {
  return (
    <div className={cn('flex flex-col mb-3', isMe ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed break-words shadow-sm',
          isMe
            ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-br-sm'
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm border border-zinc-200/60 dark:border-zinc-700/50'
        )}
      >
        {message.text}
      </div>
      <span className="text-[10px] text-zinc-400 mt-1 px-1">
        <RelativeTime dateString={message.createdAt} />
      </span>
    </div>
  );
};
