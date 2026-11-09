'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame, PlusCircle, MessageSquare, Bell, Upload, Sparkles } from 'lucide-react';
import { useSocialStore } from '@/stores/useSocialStore';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { searchQuery, setSearchQuery, currentUser, createPost, notifications, conversations } = useSocialStore();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleVideoSelected = (file: File | undefined) => {
    if (!file) return;
    setSelectedVideo(file);
    setVideoUrl('');
    setIsUploadOpen(true);
  };

  const openVideoPicker = () => {
    videoInputRef.current?.click();
  };

  useEffect(() => {
    const handleMobileUpload = () => openVideoPicker();
    window.addEventListener('toksocial:open-upload', handleMobileUpload);
    return () => window.removeEventListener('toksocial:open-upload', handleMobileUpload);
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      toast.error('Please enter a caption for your post');
      return;
    }
    const parsedTags = tags
      .split(/[\s,#]+/)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const uploadedVideoUrl = selectedVideo ? URL.createObjectURL(selectedVideo) : videoUrl;
    createPost(caption, parsedTags, uploadedVideoUrl || undefined);
    toast.success('Your video was uploaded successfully! 🎉');
    setCaption('');
    setTags('');
    setVideoUrl('');
    setSelectedVideo(null);
    setIsUploadOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full h-[4.5rem] bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-500 p-[2px] transition-transform duration-300 group-hover:scale-105 shadow-md shadow-purple-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-white">
              <Flame className="w-5 h-5 text-orange-400 fill-orange-400 animate-pulse" />
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              TokSocial
            </span>
            <span className="block text-[10px] tracking-widest font-bold text-zinc-400 -mt-1 uppercase">
              Pulse
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md hidden md:block">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search creators, hashtags, recipes, dances..."
          />
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Create / Upload Button */}
          <Button
            onClick={openVideoPicker}
            variant="gradient"
            size="sm"
            className="flex shadow-purple-500/20"
            title="Upload a video"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">Upload</span>
          </Button>

          {/* Messages Link */}
          <Link
            href="/messages"
            className="relative p-2.5 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Direct Messages"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadMessages > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {unreadMessages}
              </span>
            )}
          </Link>

          {/* Notifications Link */}
          <Link
            href="/notifications"
            className="relative p-2.5 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Activity Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </Link>

          {/* Theme Switcher */}
          <ThemeToggle compact />

          {/* User Profile Avatar */}
          <Link href="/profile" className="ml-1 shrink-0" title="View Profile">
            <Avatar src={currentUser.avatar} alt={currentUser.name} size="sm" hasStoryRing />
          </Link>
        </div>
      </div>

      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="sr-only"
        onChange={(e) => {
          handleVideoSelected(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Create New Post"
        maxWidth="lg"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's happening? Share a dance vibe, recipe, tutorial or life moment..."
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
              Hashtags (comma or space separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. dance, recipe, tech, vibes"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
              Video URL (Optional sample .mp4 link)
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://... (or leave empty to use our premium preview reel)"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label
              className="flex items-center justify-center gap-2 w-full px-3.5 py-3 text-sm font-semibold rounded-xl border border-dashed border-purple-300 dark:border-purple-700/70 text-purple-700 dark:text-purple-300 bg-purple-50/60 dark:bg-purple-950/20 hover:bg-purple-100/70 dark:hover:bg-purple-950/40 transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                openVideoPicker();
              }}
            >
              <Upload className="w-4 h-4" />
              {selectedVideo ? selectedVideo.name : 'Choose a video from your device'}
            </label>
            <p className="text-[11px] text-zinc-400 mt-1.5">
              Select a video file or use the URL field above.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <p className="text-xs text-purple-900 dark:text-purple-300">
              Posts publish immediately into your feed and profile tabs. Likes, saves, comments, and shares are fully interactive with state saved locally!
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              <Upload className="w-4 h-4 mr-2" />
              Publish Post
            </Button>
          </div>
        </form>
      </Modal>
    </header>
  );
};
