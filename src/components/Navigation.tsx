import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X, Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from './ui/glass-card';

export function Navigation({ activePage, onNavigate }: { activePage?: 'home' | 'about' | 'admin', onNavigate?: (page: 'home' | 'about') => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '首页', id: 'home' as const },
    { name: '关于', id: 'about' as const },
  ];

  const handleNavClick = (id: 'home' | 'about') => {
    if (onNavigate) {
      onNavigate(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-4',
        scrolled ? 'py-2' : 'py-4'
      )}
    >
      <div className="max-w-5xl mx-auto">
        <GlassCard className="px-6 py-3 flex items-center justify-between rounded-full" hoverEffect={false}>
          {/* Logo */}
          <div 
            className="font-bold text-lg tracking-wider text-white flex items-center gap-2 cursor-pointer group"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm group-hover:rotate-12 transition-transform">
              钟
            </div>
            <span>钟意<span className="text-indigo-500">の</span>博客</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.id)}
                  className={cn(
                    "text-sm font-medium transition-colors relative",
                    activePage === link.id 
                      ? "text-white" 
                      : "text-white/70 hover:text-white"
                  )}
                >
                  {link.name}
                  {activePage === link.id && (
                    <motion.div 
                      layoutId="nav-indicator"
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3 border-l border-white/20 pl-6">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                  // Add a small visual feedback since our glass theme is mostly dark
                  const bg = document.querySelector('.bg-\\[\\#19191e\\]\\/40');
                  if (bg) {
                    bg.classList.add('bg-white/20');
                    setTimeout(() => bg.classList.remove('bg-white/20'), 300);
                  }
                }}
                className="p-2.5 rounded-xl hover:bg-white/20 transition-colors relative flex items-center justify-center overflow-hidden border border-white/5 shadow-sm"
              >
                <Sun className="w-4 h-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 text-white" />
                <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 text-white" />
              </motion.button>
              <motion.a 
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                href="#" 
                className="p-2.5 rounded-xl hover:bg-white/20 transition-colors border border-white/5 shadow-sm"
              >
                <Github className="w-4 h-4 text-white" />
              </motion.a>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </GlassCard>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-full left-4 right-4 mt-2 md:hidden"
            >
              <GlassCard className="p-4 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.id)}
                    className={cn(
                      "block px-4 py-2 text-sm font-medium rounded-lg text-left transition-colors",
                      activePage === link.id
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/5"
                    )}
                  >
                    {link.name}
                  </button>
                ))}
                <div className="flex items-center justify-between px-4 pt-4 border-t border-white/20">
                  <span className="text-sm text-white/70 font-medium">外观主题</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2.5 rounded-xl bg-white/10 flex items-center justify-center border border-white/5"
                  >
                    {theme === 'dark' ? <Moon className="w-4 h-4 text-white" /> : <Sun className="w-4 h-4 text-white" />}
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
