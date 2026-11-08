'use client';

import React, { useEffect, useState } from 'react';
import { formatRelativeTime } from '@/lib/utils';

export const RelativeTime: React.FC<{
  dateString: string;
  className?: string;
}> = ({ dateString, className }) => {
  const [formatted, setFormatted] = useState<string>('');

  useEffect(() => {
    setFormatted(formatRelativeTime(dateString));
  }, [dateString]);

  if (!formatted) {
    return (
      <span className={className} suppressHydrationWarning>
        {formatRelativeTime(dateString, true)}
      </span>
    );
  }

  return <span className={className}>{formatted}</span>;
};
