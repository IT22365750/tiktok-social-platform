'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Music2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Send,
  Sparkles,
  Check,
  MoreHorizontal
} from 'lucide-react';
import { Post } from '@/types';
import { useSocialStore } from '@/stores/useSocialStore';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatCompactNumber, cn } from '@/lib/utils';
import { RelativeTime } from '@/components/ui/RelativeTime';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: Post;
  autoPlay?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, autoPlay = false }) => {
  const { toggleLikePost, toggleSavePost, sharePost, addComment, toggleLikeComment, toggleFollowUser, settings } = useSocialStore();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (autoPlay && settings.autoplayVideos && videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [autoPlay, settings.autoplayVideos]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleDoubleTap = () => {
    if (!post.isLiked) {
      toggleLikePost(post.id);
    }
    setShowHeartAnimation(true);
    setTimeout(() => setShowHeartAnimation(false), 900);
  };

  const handleShare = () => {
    sharePost(post.id);
    navigator.clipboard?.writeText(window.location.origin + `/?post=${post.id}`);
    setCopiedShare(true);
    toast.success('Link copied to clipboard! 🚀');
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput.trim());
    setCommentInput('');
    toast.success('Comment posted! 💬');
  };

  return (
    <article className="w-full max-w-xl mx-auto rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/90 shadow-sm overflow-hidden mb-6 transition-all">
      {/* Header Info */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/profile?id=${post.author.id}`}>
            <Avatar src={post.author.avatar} alt={post.author.name} size="md" hasStoryRing={post.author.verified} />
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <Link
                href={`/profile?id=${post.author.id}`}
                className="font-bold text-sm text-zinc-900 dark:text-zinc-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                {post.author.name}
              </Link>
              {post.author.verified && (
                <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[9px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400">
              @{post.author.username} • <RelativeTime dateString={post.createdAt} />
            </p>
          </div>
        </div>

        {post.author.id !== 'current_user' && (
          <Button
            onClick={() => toggleFollowUser(post.author.id)}
            variant={post.author.isFollowing ? 'ghost' : 'outline'}
            size="sm"
            className="rounded-full text-xs"
          >
            {post.author.isFollowing ? 'Following' : '+ Follow'}
          </Button>
        )}
      </div>

      {/* Media Player Container */}
      <div
        className="relative w-full aspect-[9/13] sm:aspect-[9/12] max-h-[580px] bg-black select-none cursor-pointer group overflow-hidden"
        onClick={togglePlay}
        onDoubleClick={handleDoubleTap}
      >
        {post.videoUrl ? (
          <video
            ref={videoRef}
            src={post.videoUrl}
            poster={post.thumbnailUrl}
            playsInline
            loop
            muted={isMuted}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={post.thumbnailUrl}
            alt={post.caption}
            className="w-full h-full object-cover"
          />
        )}

        {/* Double click heart explosion */}
        <AnimatePresence>
          {showHeartAnimation && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl filter" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play / Pause Overlay Icon */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200',
            isPlaying ? 'opacity-0' : 'opacity-100 bg-black/20'
          )}
        >
          <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
          </div>
        </div>

        {/* Bottom Volume & Music Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs max-w-[75%] border border-white/10">
            <Music2 className="w-3.5 h-3.5 text-purple-400 shrink-0 animate-spin" />
            <span className="truncate">{post.musicTitle}</span>
          </div>

          <button
            onClick={toggleMute}
            className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 hover:bg-black/80 transition-colors cursor-pointer"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
          </button>
        </div>

        {/* Floating Side Action Rail */}
        <div className="absolute right-3 bottom-16 flex flex-col items-center gap-4 z-10 pointer-events-auto">
          {/* Like */}
          <div className="flex flex-col items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLikePost(post.id);
              }}
              className={cn(
                'w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 active:scale-75 shadow-lg',
                post.isLiked
                  ? 'bg-rose-500 text-white shadow-rose-500/30'
                  : 'bg-black/50 hover:bg-black/70 text-white border border-white/15'
              )}
            >
              <Heart className={cn('w-5 h-5', post.isLiked && 'fill-white')} />
            </button>
            <span className="text-[11px] font-bold text-white mt-1 drop-shadow-md">
              {formatCompactNumber(post.likesCount)}
            </span>
          </div>

          {/* Comment */}
          <div className="flex flex-col items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsCommentsOpen(true);
              }}
              className="w-11 h-11 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/70 text-white border border-white/15 backdrop-blur-md transition-all active:scale-75 shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            <span className="text-[11px] font-bold text-white mt-1 drop-shadow-md">
              {formatCompactNumber(post.commentsCount)}
            </span>
          </div>

          {/* Bookmark / Save */}
          <div className="flex flex-col items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSavePost(post.id);
                toast(post.isSaved ? 'Removed from saved' : 'Saved to favorites! 🔖', {
                  icon: post.isSaved ? '🗑️' : '✨',
                });
              }}
              className={cn(
                'w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-75 shadow-lg',
                post.isSaved
                  ? 'bg-orange-500 text-white shadow-orange-500/30'
                  : 'bg-black/50 hover:bg-black/70 text-white border border-white/15'
              )}
            >
              <Bookmark className={cn('w-5 h-5', post.isSaved && 'fill-white')} />
            </button>
            <span className="text-[11px] font-bold text-white mt-1 drop-shadow-md">
              {formatCompactNumber(post.savesCount)}
            </span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="w-11 h-11 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/70 text-white border border-white/15 backdrop-blur-md transition-all active:scale-75 shadow-lg"
            >
              {copiedShare ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
            </button>
            <span className="text-[11px] font-bold text-white mt-1 drop-shadow-md">
              {formatCompactNumber(post.sharesCount)}
            </span>
          </div>
        </div>
      </div>

      {/* Caption & Hashtags */}
      <div className="p-4 space-y-2">
        <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
          <Link href={`/profile?id=${post.author.id}`} className="font-bold mr-2 text-zinc-950 dark:text-white">
            {post.author.username}
          </Link>
          {post.caption}
        </p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-orange-500 hover:underline"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* View Comments trigger */}
        {post.commentsCount > 0 && (
          <button
            onClick={() => setIsCommentsOpen(true)}
            className="text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 pt-1 block"
          >
            View all {post.commentsCount} comments...
          </button>
        )}
      </div>

      {/* Comments Drawer / Modal */}
      <Modal
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        title={`Comments (${post.commentsCount})`}
        maxWidth="lg"
      >
        <div className="flex flex-col h-[400px]">
          {/* Comments List */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {post.comments.length === 0 ? (
              <div className="text-center py-12 text-zinc-400 text-sm">
                No comments yet. Be the first to share your thoughts! 🚀
              </div>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <Avatar src={comment.userAvatar} alt={comment.username} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                        {comment.username}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        <RelativeTime dateString={comment.createdAt} />
                      </span>
                    </div>
                    <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1">{comment.text}</p>
                  </div>
                  <button
                    onClick={() => toggleLikeComment(post.id, comment.id)}
                    className="flex flex-col items-center text-zinc-400 hover:text-rose-500"
                  >
                    <Heart
                      className={cn('w-3.5 h-3.5', comment.isLiked && 'text-rose-500 fill-rose-500')}
                    />
                    <span className="text-[10px] mt-0.5">{comment.likesCount}</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Comment input form */}
          <form onSubmit={handleCommentSubmit} className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2.5 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <Button type="submit" variant="gradient" size="sm" className="rounded-full">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      </Modal>
    </article>
  );
};
