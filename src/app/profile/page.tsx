'use client';

import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Grid, 
  Bookmark, 
  Heart, 
  Edit3, 
  Share2, 
  Link as LinkIcon, 
  Calendar, 
  Check, 
  Sparkles,
  Lock,
  Plus
} from 'lucide-react';
import { useSocialStore } from '@/stores/useSocialStore';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { TabSwitcher } from '@/components/ui/TabSwitcher';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { formatCompactNumber, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

function ProfileContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');

  const { currentUser, users, posts, toggleFollowUser, updateUser } = useSocialStore();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'liked'>('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editWebsite, setEditWebsite] = useState(currentUser.website || '');
  const [editCoverPhoto, setEditCoverPhoto] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | undefined>();
  const [copiedLink, setCopiedLink] = useState(false);
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);

  // Determine which user profile to display
  const targetUser = userId ? users.find((u) => u.id === userId) || currentUser : currentUser;
  const isSelf = targetUser.id === currentUser.id;

  useEffect(() => {
    if (!editCoverPhoto) {
      setCoverPreview(targetUser.coverPhoto);
      return;
    }

    const previewUrl = URL.createObjectURL(editCoverPhoto);
    setCoverPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [editCoverPhoto, targetUser.coverPhoto]);

  // Filter content tabs
  const userPosts = posts.filter((p) => p.author.id === targetUser.id);
  const savedPosts = posts.filter((p) => p.isSaved);
  const likedPosts = posts.filter((p) => p.isLiked);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(currentUser.id, {
      name: editName,
      bio: editBio,
      website: editWebsite,
      ...(editCoverPhoto ? { coverPhoto: URL.createObjectURL(editCoverPhoto) } : {}),
    });
    toast.success('Profile updated successfully! ✨');
    setEditCoverPhoto(null);
    setIsEditModalOpen(false);
  };

  const handleShareProfile = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    toast.success('Profile link copied! 🔗');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        {/* Profile Cover */}
        <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
          {targetUser.coverPhoto ? (
            <img
              src={targetUser.coverPhoto}
              alt={`${targetUser.name} cover`}
              className="w-full h-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-pink-800/30 to-orange-900/50" />
        </div>

        <div className="relative pt-6 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
          {/* Avatar & Main Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            <Avatar
              src={targetUser.avatar}
              alt={targetUser.name}
              size="xl"
              hasStoryRing={targetUser.verified}
              className="ring-4 ring-white dark:ring-zinc-900 shadow-xl -mt-10 sm:-mt-0"
            />
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
                  {targetUser.name}
                </h1>
                {targetUser.verified && (
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold" title="Verified Creator">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-zinc-400">@{targetUser.username}</p>
              {targetUser.category && (
                <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                  {targetUser.category}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            {isSelf ? (
              <Button onClick={() => setIsEditModalOpen(true)} variant="outline" size="sm" className="rounded-full">
                <Edit3 className="w-4 h-4 mr-1.5" />
                Edit Profile
              </Button>
            ) : (
              <Button
                onClick={() => toggleFollowUser(targetUser.id)}
                variant={targetUser.isFollowing ? 'outline' : 'gradient'}
                size="sm"
                className="rounded-full"
              >
                {targetUser.isFollowing ? 'Following' : '+ Follow'}
              </Button>
            )}

            <Button onClick={handleShareProfile} variant="ghost" size="icon" className="rounded-full" title="Share profile">
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Counter Stats Bar */}
        <div className="flex items-center justify-center sm:justify-start gap-8 py-5 my-4 border-y border-zinc-100 dark:border-zinc-800/80">
          <div className="text-center sm:text-left">
            <span className="block text-lg font-black text-zinc-900 dark:text-zinc-100">
              {formatCompactNumber(targetUser.followingCount)}
            </span>
            <span className="text-xs text-zinc-400 font-medium">Following</span>
          </div>

          <div className="text-center sm:text-left">
            <span className="block text-lg font-black text-zinc-900 dark:text-zinc-100">
              {formatCompactNumber(targetUser.followersCount)}
            </span>
            <span className="text-xs text-zinc-400 font-medium">Followers</span>
          </div>

          <div className="text-center sm:text-left">
            <span className="block text-lg font-black text-zinc-900 dark:text-zinc-100">
              {formatCompactNumber(targetUser.likesCount)}
            </span>
            <span className="text-xs text-zinc-400 font-medium">Likes</span>
          </div>
        </div>

        {/* Bio and Links */}
        <div className="space-y-2 text-xs sm:text-sm">
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-2xl">
            {targetUser.bio}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
            {targetUser.website && (
              <a
                href={targetUser.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-medium hover:underline"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                {targetUser.website.replace('https://', '')}
              </a>
            )}
            {targetUser.joinedDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {targetUser.joinedDate}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Posts / Saved / Liked */}
      <div className="flex items-center justify-center sm:justify-start">
        <TabSwitcher
          variant="underline"
          tabs={[
            { id: 'posts', label: 'Posts', count: userPosts.length, icon: <Grid className="w-4 h-4" /> },
            ...(isSelf
              ? [
                  { id: 'saved' as const, label: 'Saved', count: savedPosts.length, icon: <Bookmark className="w-4 h-4" /> },
                  { id: 'liked' as const, label: 'Liked', count: likedPosts.length, icon: <Heart className="w-4 h-4" /> },
                ]
              : []),
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* Grid Content Display */}
      {activeTab === 'posts' && (
        userPosts.length === 0 ? (
          <EmptyState
            icon={<Grid className="w-8 h-8" />}
            title="No posts yet"
            description={isSelf ? "Upload your first video to share with your audience!" : "This creator hasn't published any videos yet."}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {userPosts.map((post) => (
              <Link
                key={post.id}
                href={`/?post=${post.id}`}
                className="group relative aspect-[9/14] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm block"
              >
                <img
                  src={post.thumbnailUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-white self-end bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full">
                    ▶ {formatCompactNumber(post.likesCount)}
                  </span>
                  <p className="text-xs font-semibold text-white line-clamp-2 leading-snug drop-shadow-md">
                    {post.caption}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )
      )}

      {activeTab === 'saved' && (
        savedPosts.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="w-8 h-8" />}
            title="No saved videos"
            description="Videos you bookmark for inspiration or future viewing will appear here privately."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {savedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/?post=${post.id}`}
                className="group relative aspect-[9/14] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm block"
              >
                <img
                  src={post.thumbnailUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-white self-end bg-orange-500 px-2 py-0.5 rounded-full">
                    Saved
                  </span>
                  <p className="text-xs font-semibold text-white line-clamp-2 leading-snug drop-shadow-md">
                    {post.caption}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )
      )}

      {activeTab === 'liked' && (
        likedPosts.length === 0 ? (
          <EmptyState
            icon={<Heart className="w-8 h-8" />}
            title="No liked videos yet"
            description="Double tap videos in your feed to like them and view them here anytime."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {likedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/?post=${post.id}`}
                className="group relative aspect-[9/14] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm block"
              >
                <img
                  src={post.thumbnailUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-white self-end bg-rose-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-white" /> {formatCompactNumber(post.likesCount)}
                  </span>
                  <p className="text-xs font-semibold text-white line-clamp-2 leading-snug drop-shadow-md">
                    {post.caption}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
        maxWidth="md"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
              Cover Photo
            </label>
            <button
              type="button"
              onClick={() => coverPhotoInputRef.current?.click()}
              className="relative w-full h-24 rounded-xl overflow-hidden border border-dashed border-purple-300 dark:border-purple-700 bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-purple-700 dark:text-purple-300"
            >
              <img
                src={coverPreview || ''}
                alt="Cover preview"
                className="w-full h-full object-cover opacity-70"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-white">
                {editCoverPhoto ? editCoverPhoto.name : 'Choose a new cover photo'}
              </span>
            </button>
            <input
              ref={coverPhotoInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => setEditCoverPhoto(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
              Bio
            </label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
              Website
            </label>
            <input
              type="url"
              value={editWebsite}
              onChange={(e) => setEditWebsite(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-400">Loading creator profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
