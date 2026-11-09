'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export const KeyboardShortcuts = () => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isTyping = target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);

      if (event.key === 'Escape') {
        window.dispatchEvent(new CustomEvent('toksocial:close-modal'));
        return;
      }

      if (isTyping || event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === '/') {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('toksocial:focus-search'));
      } else if (event.key.toLowerCase() === 'u') {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('toksocial:open-upload'));
      } else if (event.key === '?') {
        event.preventDefault();
        toast('Shortcuts: / search · U upload · H home · ? help', { icon: '⌨️' });
      } else if (event.key.toLowerCase() === 'h' && pathname !== '/') {
        event.preventDefault();
        router.push('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pathname, router]);

  return null;
};
