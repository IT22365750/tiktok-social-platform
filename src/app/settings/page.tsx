'use client';

import React from 'react';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Globe, 
  Bell, 
  Shield, 
  Video, 
  Sparkles, 
  RotateCcw,
  Check
} from 'lucide-react';
import { useSocialStore } from '@/stores/useSocialStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Language } from '@/types';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { 
    settings, 
    updateSettings, 
    updateNotificationPreferences, 
    setLanguage 
  } = useSocialStore();

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English (US)' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
  ];

  const handleResetData = () => {
    localStorage.removeItem('tiktok-social-store');
    toast.success('App storage reset to defaults! Reloading...');
    setTimeout(() => window.location.reload(), 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Settings Header */}
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
          <SettingsIcon className="w-6 h-6 text-purple-600" />
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Customize your interface theme, notifications, privacy, and account experience.
        </p>
      </div>

      <div className="space-y-5">
        {/* Appearance & Theme */}
        <Card className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                Appearance & Theme
              </h2>
              <p className="text-xs text-zinc-500">Choose between light, dark, or system appearance.</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Active Color Theme:
            </span>
            <ThemeToggle />
          </div>
        </Card>

        {/* Language Selection */}
        <Card className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                Display Language
              </h2>
              <p className="text-xs text-zinc-500">Select your preferred application interface language.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            {languages.map((lang) => {
              const isSelected = settings.language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    toast.success(`Language set to ${lang.name}! 🌐`);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/80 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span>{lang.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                Notification Preferences
              </h2>
              <p className="text-xs text-zinc-500">Fine-tune which alerts trigger push badges and updates.</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                id: 'likes',
                label: 'Likes on your posts',
                desc: 'Get notified when someone loves your video.',
                checked: settings.notifications.likes,
              },
              {
                id: 'comments',
                label: 'Comments and replies',
                desc: 'Alerts when someone mentions or responds to you.',
                checked: settings.notifications.comments,
              },
              {
                id: 'newFollowers',
                label: 'New followers',
                desc: 'Instant updates whenever someone follows your channel.',
                checked: settings.notifications.newFollowers,
              },
              {
                id: 'directMessages',
                label: 'Direct messages',
                desc: 'Notifications when someone sends you a message.',
                checked: settings.notifications.directMessages,
              },
              {
                id: 'soundEnabled',
                label: 'Sound effects',
                desc: 'Play subtle audio feedback on interactions.',
                checked: settings.notifications.soundEnabled,
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
              >
                <div>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.label}</p>
                  <p className="text-[11px] text-zinc-400">{item.desc}</p>
                </div>

                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => {
                    updateNotificationPreferences({ [item.id]: e.target.checked });
                    toast.success('Preferences updated!');
                  }}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Media & Privacy Controls */}
        <Card className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                Playback & Privacy
              </h2>
              <p className="text-xs text-zinc-500">Manage video streaming quality and privacy settings.</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
              <div>
                <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">Autoplay feed videos</p>
                <p className="text-[11px] text-zinc-400">Play videos automatically as you scroll through your stream.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoplayVideos}
                onChange={(e) => {
                  updateSettings({ autoplayVideos: e.target.checked });
                  toast.success('Autoplay setting updated!');
                }}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
              <div>
                <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">High-Definition Streaming</p>
                <p className="text-[11px] text-zinc-400">Load full 1080p video resolutions when Wi-Fi is available.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.highQualityVideo}
                onChange={(e) => {
                  updateSettings({ highQualityVideo: e.target.checked });
                  toast.success('HD streaming updated!');
                }}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
              <div>
                <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">Private account mode</p>
                <p className="text-[11px] text-zinc-400">Only approved followers can view your uploaded clips.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.privateAccount}
                onChange={(e) => {
                  updateSettings({ privateAccount: e.target.checked });
                  toast.success('Account privacy updated!');
                }}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
              />
            </div>
          </div>
        </Card>

        {/* Data Persistence & Reset */}
        <Card className="p-5 sm:p-6 border-dashed border-zinc-300 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-purple-500" />
              Reset Local Storage
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Restore mock posts, notifications, and interaction states back to initial presets.
            </p>
          </div>
          <Button onClick={handleResetData} variant="ghost" size="sm" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30">
            Reset All Mock Data
          </Button>
        </Card>
      </div>
    </div>
  );
}
