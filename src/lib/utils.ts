import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCompactNumber(number: number): string {
  if (number >= 1_000_000) {
    return (number / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (number >= 1_000) {
    return (number / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return number.toString();
}

const STATIC_NOW = 1773000000000;

export function formatRelativeTime(dateString: string, isStaticServer: boolean = false): string {
  const date = new Date(dateString);
  const now = isStaticServer ? STATIC_NOW : (typeof window !== 'undefined' ? Date.now() : STATIC_NOW);
  const diffInSeconds = Math.max(0, Math.floor((now - date.getTime()) / 1000));

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
