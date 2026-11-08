# 🌟 TokSocial Pulse — TikTok-Style Creator Media Platform

A modern, responsive, high-performance TikTok-style creator social media frontend built from scratch with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Zustand**, and **Framer Motion**.

---

## 🚀 Live Demo & Preview
Designed with a signature **Purple & Orange** gradient palette, featuring seamless **Dark and Light mode** support, full state persistence via **LocalStorage**, and interactive touch/click gestures.

---

## 📱 Pages Implemented

1. **Home Feed (`/`)**
   - TikTok-style vertical video cards with play/pause controls, mute/unmute audio toggles, and animated music track marquee.
   - Interactive double-tap to like with bursting heart animation.
   - Like, save/bookmark, share (copies direct URL to clipboard), and add/view comments modal.
   - Tab switching between **For You** and **Following** creator feeds.

2. **Search & Explore (`/search`)**
   - Interactive multi-category discovery: **Top Results**, **Creators**, **Videos**, and **Hashtags**.
   - Live query filtering with trending keyword quick-chips (`#dance`, `#foodtok`, `#cyberpunk`, etc.).
   - Follow / Unfollow buttons with instant state persistence.

3. **Creator Profile (`/profile`)**
   - Complete profile header with verified badge, follower/following counts, bio, website links, and share profile action.
   - Tab switcher: **Posts**, **Saved (private bookmarks)**, and **Liked videos**.
   - Edit Profile modal with name, bio, and website updates saved locally.

4. **Notifications (`/notifications`)**
   - Categorized notifications for likes, comments, mentions, new followers, and system milestones.
   - Category filtering pills (**All**, **Likes**, **Comments**, **Followers**).
   - "Mark all as read" button with unread count badges.

5. **Direct Messages (`/messages`)**
   - Split-pane messenger with conversation list, search bar, and active chat window.
   - Real-time mock message sending with timestamp bubbles and sound/call buttons.
   - Unread badges across sidebar and navbar.

6. **Settings (`/settings`)**
   - Appearance theme switcher (**Dark**, **Light**, **System**).
   - Language selector with multiple options (English, Spanish, French, German, Japanese).
   - Granular notification preferences toggles.
   - Autoplay, HD streaming, and private account switches.
   - One-click LocalStorage reset button.

---

## 🎨 Design System & Highlights
- **Palette**: Royal Purple (`#8b5cf6` / `#9333ea`) & Radiant Orange (`#f97316`)
- **Typography**: Inter with tabular numbers and clean letter spacing.
- **Glassmorphism**: Backdrop blur headers, floating video player controls, and frosted pills.
- **Micro-interactions**: Double-tap heart pop, spring tab indicators, toast notifications with `react-hot-toast`.
- **Responsive**: Desktop sidebar + mobile bottom navigation bar with responsive grid adjustments.

---

## 🛠️ Tech Stack & Architecture

```
src/
├── app/
│   ├── layout.tsx         # Root layout with ThemeProvider, Navbar, Sidebar & MobileNav
│   ├── page.tsx           # Home Feed (For You / Following)
│   ├── search/page.tsx    # Explore, Search & Hashtags
│   ├── profile/page.tsx   # Creator Profile & Content Tabs
│   ├── notifications/page.tsx # Notifications & Filter Tabs
│   ├── messages/page.tsx  # Direct Messages & Conversation Stream
│   └── settings/page.tsx  # Settings, Themes, Languages & Preferences
├── components/
│   ├── ui/                # Button, Avatar, Card, Modal, SearchInput, TabSwitcher, Skeleton, EmptyState
│   ├── layout/            # Navbar, Sidebar, MobileNav, ThemeProvider
│   ├── feed/              # PostCard with video player & comments modal
│   ├── profile/           # Profile header & tab grids
│   ├── notifications/     # NotificationItem
│   └── messages/          # MessageBubble
├── data/
│   └── mockData.ts        # Comprehensive mock dataset for users, videos & notifications
├── stores/
│   └── useSocialStore.ts  # Zustand store with LocalStorage persistence
├── types/
│   └── index.ts           # Complete TypeScript interfaces
└── lib/
    └── utils.ts           # Tailwind merge & formatting helpers
```

---

## 💻 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the application.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 🚀 Deployment to Vercel
This project is configured out-of-the-box for seamless zero-config deployment on Vercel:
1. Push this repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. The build command `npm run build` will prerender all routes cleanly as verified.
