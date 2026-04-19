'use client';

import { useState, useEffect, useRef } from 'react';
import { Palette, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const themes = [
  { id: 'blue', color: 'bg-[#1E3A8A]', name: 'King Blue' },
  { id: 'King blue', color: 'bg-[#006C35]', name: 'Emerald' },
  { id: 'red', color: 'bg-red-500', name: 'Rose' },
  { id: 'yellow', color: 'bg-yellow-500', name: 'Amber' },
  { id: 'purple', color: 'bg-purple-500', name: 'Violet' },
  { id: 'orange', color: 'bg-orange-500', name: 'Sunset' },
  { id: 'teal', color: 'bg-teal-500', name: 'Teal Ocean' },
];

export default function ColorThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState('blue');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('DrivingLicenseIssuanceSystem-color-theme') || 'blue';
    setCurrentTheme(saved);
    document.documentElement.setAttribute('data-color-theme', saved);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const setTheme = (id: string) => {
    setCurrentTheme(id);
    localStorage.setItem('DrivingLicenseIssuanceSystem-color-theme', id);
    document.documentElement.setAttribute('data-color-theme', id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex shrink-0 items-center justify-center border border-transparent bg-transparent text-neutral-400 hover:text-white rounded-full transition-all duration-300 hover:bg-white/10 w-9 h-9 cursor-pointer"
      >
        <Palette className="w-5 h-5" />
        <span className="sr-only">Change color theme</span>
      </button>

      {isOpen && (
        <div className="absolute end-0 top-full mt-2 w-48 bg-neutral-900/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl z-50">
          <div className="px-2 py-2 mb-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Color Palette</p>
          </div>
          <div className="grid grid-cols-1 gap-1">
            {themes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setTheme(theme.id)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer w-full text-start",
                  currentTheme === theme.id ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-4 h-4 rounded-full shadow-lg border border-white/10", theme.color)} />
                  <span className="text-xs font-bold">{theme.name}</span>
                </div>
                {currentTheme === theme.id && <Check className="w-3.5 h-3.5 text-primary-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}