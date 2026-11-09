import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Post, User, Notification, Conversation, Message, UserSettings } from '@/types';
import { mockPosts, mockUsers, mockNotifications, mockConversations, initialMessages, currentUser } from '@/data/mockData';

interface SocialStore {
  // Current active user
  currentUser: User;
  users: User[];
  
  // Posts & Interactions
  posts: Post[];
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  toggleLikeComment: (postId: string, commentId: string) => void;
  sharePost: (postId: string) => void;
  createPost: (caption: string, tags: string[], videoUrl?: string, thumbnailUrl?: string) => void;

  // Following state
  toggleFollowUser: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;

  // Notifications
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;

  // Direct Messaging
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  setActiveConversation: (id: string | null) => void;
  sendMessage: (receiverId: string, text: string) => void;

  // Settings & Preferences
  settings: UserSettings;
  updateSettings: (partial: Partial<UserSettings>) => void;
  updateNotificationPreferences: (partial: Partial<UserSettings['notifications']>) => void;
  setTheme: (theme: UserSettings['theme']) => void;
  setLanguage: (lang: UserSettings['language']) => void;

  // Active view filters / search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useSocialStore = create<SocialStore>()(
  persist(
    (set, get) => ({
      currentUser: currentUser,
      users: mockUsers,
      posts: mockPosts,
      notifications: mockNotifications,
      conversations: mockConversations,
      activeConversationId: 'conv_1',
      messages: initialMessages,
      searchQuery: '',

      settings: {
        theme: 'dark',
        language: 'en',
        autoplayVideos: true,
        privateAccount: false,
        highQualityVideo: true,
        notifications: {
          likes: true,
          comments: true,
          newFollowers: true,
          directMessages: true,
          soundEnabled: true,
          emailDigest: false,
        },
      },

      toggleLikePost: (postId: string) => {
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id === postId) {
              const isLiked = !post.isLiked;
              return {
                ...post,
                isLiked,
                likesCount: isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
              };
            }
            return post;
          }),
        }));
      },

      toggleSavePost: (postId: string) => {
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id === postId) {
              const isSaved = !post.isSaved;
              return {
                ...post,
                isSaved,
                savesCount: isSaved ? post.savesCount + 1 : Math.max(0, post.savesCount - 1),
              };
            }
            return post;
          }),
        }));
      },

      addComment: (postId: string, text: string) => {
        const { currentUser } = get();
        const newComment = {
          id: `comment_${Date.now()}`,
          postId,
          userId: currentUser.id,
          username: currentUser.username,
          userAvatar: currentUser.avatar,
          text,
          createdAt: new Date().toISOString(),
          likesCount: 0,
          isLiked: false,
        };

        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                commentsCount: post.commentsCount + 1,
                comments: [newComment, ...post.comments],
              };
            }
            return post;
          }),
        }));
      },

      toggleLikeComment: (postId: string, commentId: string) => {
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                comments: post.comments.map((c) => {
                  if (c.id === commentId) {
                    const isLiked = !c.isLiked;
                    return {
                      ...c,
                      isLiked,
                      likesCount: isLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1),
                    };
                  }
                  return c;
                }),
              };
            }
            return post;
          }),
        }));
      },

      sharePost: (postId: string) => {
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId ? { ...post, sharesCount: post.sharesCount + 1 } : post
          ),
        }));
      },

      createPost: (caption: string, tags: string[], videoUrl?: string, thumbnailUrl?: string) => {
        const { currentUser } = get();
        const newPost: Post = {
          id: `post_${Date.now()}`,
          author: currentUser,
          caption,
          tags,
          musicTitle: 'Original Audio - ' + currentUser.name,
          musicAuthor: currentUser.name,
          thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
          videoUrl: videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-dancing-1230-large.mp4',
          aspectRatio: 'vertical',
          likesCount: 0,
          commentsCount: 0,
          sharesCount: 0,
          savesCount: 0,
          isLiked: false,
          isSaved: false,
          createdAt: new Date().toISOString(),
          comments: [],
        };

        set((state) => ({
          posts: [newPost, ...state.posts],
        }));
      },

      toggleFollowUser: (userId: string) => {
        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.id === userId) {
              const isFollowing = !u.isFollowing;
              return {
                ...u,
                isFollowing,
                followersCount: isFollowing ? u.followersCount + 1 : Math.max(0, u.followersCount - 1),
              };
            }
            return u;
          });

          // Also update authors inside posts
          const updatedPosts = state.posts.map((post) => {
            if (post.author.id === userId) {
              const isFollowing = !post.author.isFollowing;
              return {
                ...post,
                author: {
                  ...post.author,
                  isFollowing,
                  followersCount: isFollowing ? post.author.followersCount + 1 : Math.max(0, post.author.followersCount - 1),
                },
              };
            }
            return post;
          });

          return {
            users: updatedUsers,
            posts: updatedPosts,
          };
        });
      },

      updateUser: (userId, updates) => {
        set((state) => {
          const updatedUsers = state.users.map((user) =>
            user.id === userId ? { ...user, ...updates } : user
          );
          const updatedCurrentUser =
            state.currentUser.id === userId
              ? { ...state.currentUser, ...updates }
              : state.currentUser;

          return {
            currentUser: updatedCurrentUser,
            users: updatedUsers,
            posts: state.posts.map((post) =>
              post.author.id === userId
                ? { ...post, author: { ...post.author, ...updates } }
                : post
            ),
          };
        });
      },

      markNotificationAsRead: (id: string) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        }));
      },

      markAllNotificationsAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      deleteNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      setActiveConversation: (id: string | null) => {
        set({ activeConversationId: id });
        if (id) {
          // Mark conversation as read
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c.id === id ? { ...c, unreadCount: 0 } : c
            ),
          }));
        }
      },

      sendMessage: (receiverId: string, text: string) => {
        const { currentUser, conversations, messages, users } = get();
        let targetConv = conversations.find((c) => c.participant.id === receiverId);

        let convId = targetConv?.id;
        if (!convId) {
          const participantUser = users.find((u) => u.id === receiverId) || {
            id: receiverId,
            username: 'user_' + receiverId,
            name: 'User',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            bio: '',
            followersCount: 0,
            followingCount: 0,
            likesCount: 0,
          };
          convId = `conv_${Date.now()}`;
          targetConv = {
            id: convId,
            participant: participantUser,
            unreadCount: 0,
            updatedAt: new Date().toISOString(),
          };
        }

        const newMessage: Message = {
          id: `msg_${Date.now()}`,
          senderId: currentUser.id,
          receiverId,
          text,
          createdAt: new Date().toISOString(),
          read: true,
        };

        const existingMessages = messages[convId] || [];

        set((state) => ({
          messages: {
            ...state.messages,
            [convId!]: [...existingMessages, newMessage],
          },
          conversations: [
            {
              ...targetConv!,
              lastMessage: newMessage,
              updatedAt: new Date().toISOString(),
            },
            ...state.conversations.filter((c) => c.id !== convId),
          ],
          activeConversationId: convId,
        }));
      },

      updateSettings: (partial) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...partial,
          },
        }));
      },

      updateNotificationPreferences: (partial) => {
        set((state) => ({
          settings: {
            ...state.settings,
            notifications: {
              ...state.settings.notifications,
              ...partial,
            },
          },
        }));
      },

      setTheme: (theme) => {
        set((state) => ({
          settings: {
            ...state.settings,
            theme,
          },
        }));
      },

      setLanguage: (language) => {
        set((state) => ({
          settings: {
            ...state.settings,
            language,
          },
        }));
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },
    }),
    {
      name: 'tiktok-social-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        posts: state.posts,
        users: state.users,
        notifications: state.notifications,
        conversations: state.conversations,
        messages: state.messages,
        settings: state.settings,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<SocialStore>;
        const storedUsers = persisted.users || [];
        const users = mockUsers.map((defaultUser) => {
          const storedUser = storedUsers.find((user) => user.id === defaultUser.id);
          return storedUser ? { ...defaultUser, ...storedUser } : defaultUser;
        });
        const storedCurrentUser = persisted.currentUser;
        const currentUser = {
          ...(users.find((user) => user.id === 'current_user') || currentState.currentUser),
          ...(storedCurrentUser || {}),
          avatar: currentState.currentUser.avatar,
        };
        const mergedUsers = users.map((user) =>
          user.id === currentUser.id ? currentUser : user
        );
        const storedPosts = persisted.posts || [];
        const savedPostIds = new Set(storedPosts.map((post) => post.id));
        const posts = [
          ...currentState.posts.filter((post) => !savedPostIds.has(post.id)),
          ...storedPosts,
        ];

        return {
          ...currentState,
          ...persisted,
          currentUser,
          users: mergedUsers,
          posts: posts.map((post) => {
            const author = mergedUsers.find((user) => user.id === post.author.id);
            return author ? { ...post, author } : post;
          }),
        };
      },
    }
  )
);
