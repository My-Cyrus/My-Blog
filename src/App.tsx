/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { WebGLRainBackground } from '@/components/WebGLRainBackground';
import { Navigation } from '@/components/Navigation';
import { GlassCard } from '@/components/ui/glass-card';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import { ArrowRight, Clock, Heart, Eye, Search, ArrowUp, CalendarDays, BookOpen, ArrowLeft, MessageSquare, Send, Loader2, Sparkles, User, Mail, Github, Twitter, BarChart3, Settings, PenTool, Trash2 } from 'lucide-react';

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left z-[100]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-2xl bg-indigo-500/90 hover:bg-indigo-600 text-white shadow-[0_8px_32px_0_rgba(99,102,241,0.4)] backdrop-blur-md transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

const CATEGORIES = ['全部', '技术', '前端', '设计', '随笔'];

function BlogList({ searchQuery, activeCategory, onPostClick, posts }: { searchQuery: string, activeCategory: string, onPostClick: (id: number) => void, posts: any[] }) {
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === '全部' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid gap-8 mt-10 relative min-h-[400px]">
      <AnimatePresence mode="popLayout">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, i) => (
            <motion.div
              layout
              key={post.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <GlassCard className="p-1 cursor-pointer group" onClick={() => onPostClick(post.id)}>
                <div className="p-6 sm:p-8 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-xs border border-indigo-500/30 shadow-inner">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-4 text-xs font-medium text-white/60">
                        <span className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-md"><CalendarDays className="w-3.5 h-3.5" />{post.date}</span>
                        <span className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-md text-indigo-400"><BookOpen className="w-3.5 h-3.5" />阅读需 {post.readTime}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors mb-3 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed line-clamp-2">
                        {post.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-5 text-sm text-white/60 font-medium">
                        <div className="flex items-center gap-1.5 group-hover:text-pink-400 transition-colors">
                          <Heart className="w-4 h-4" />
                          {post.likes}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4" />
                          {post.views}
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center group-hover:bg-indigo-600 text-white/70 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-[0_0_15px_rgba(79,70,229,0.5)] group-hover:scale-110">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="col-span-full py-24 text-center text-white/50"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <Search className="w-10 h-10 opacity-40" />
            </div>
            <p className="text-lg">未找到相关文章</p>
            {searchQuery && <p className="text-sm mt-2 opacity-70">换个关键词试试看</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PostDetail({ postId, onBack }: { postId: number, onBack: () => void }) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [flyingHearts, setFlyingHearts] = useState<{id: number, x: number}[]>([]);

  useEffect(() => {
    // Fetch full post and record view
    fetch(`/api/posts/${postId}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLikes(data.likes);
        setLoading(false);
        // Record view
        fetch(`/api/posts/${postId}/view`, { method: 'POST' });
      });
  }, [postId]);

  const handleLike = () => {
    if (hasLiked) return;
    
    // Optimistic update
    setLikes(prev => prev + 1);
    setHasLiked(true);
    
    // Add flying hearts
    const newHearts = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 120,
      y: -Math.random() * 100 - 30,
      scale: Math.random() * 0.8 + 0.5,
      rotation: (Math.random() - 0.5) * 60,
      delay: Math.random() * 0.2
    }));
    setFlyingHearts(prev => [...prev, ...newHearts]);
    setTimeout(() => {
      setFlyingHearts(prev => prev.filter(h => !newHearts.find(n => n.id === h.id)));
    }, 2000);

    fetch(`/api/posts/${postId}/like`, { method: 'POST' });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[50vh]">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
    </div>
  );
  if (!post) return null;

  return (
    <>
      <ScrollProgress />
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: 30 }}
        className="max-w-4xl mx-auto pb-24"
      >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors group px-2"
      >
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/20 transition-colors shadow-sm">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="font-medium">返回列表</span>
      </button>

      <GlassCard className="p-1" hoverEffect={false}>
        <div className="p-8 sm:p-12 rounded-xl bg-white/5">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-xs border border-indigo-500/30">
              {post.category}
            </span>
            <div className="flex items-center gap-4 text-xs font-medium text-white/60">
              <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" />{post.date}</span>
              <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />{post.readTime}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-white/70 font-medium mb-10 pb-10 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                钟
              </div>
              <span>钟意</span>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <span className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-md text-indigo-400"><BookOpen className="w-4 h-4" /> 预计阅读 {post.readTime}</span>
              
              <div className="relative inline-block">
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 transition-colors ${hasLiked ? 'text-pink-500' : 'hover:text-pink-500'}`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} /> {likes}
                </button>
                <AnimatePresence>
                  {flyingHearts.map(heart => (
                    <motion.div
                      key={heart.id}
                      initial={{ opacity: 0, y: 0, x: 0, scale: 0, rotate: 0 }}
                      animate={{ 
                        opacity: [0, 1, 1, 0], 
                        y: [0, heart.y * 0.5, heart.y], 
                        x: [0, heart.x * 0.8, heart.x],
                        scale: [0, heart.scale * 1.2, heart.scale],
                        rotate: [0, heart.rotation, heart.rotation * 1.5]
                      }}
                      transition={{ duration: 1.2, delay: heart.delay, ease: "easeOut" }}
                      className="absolute left-1/2 bottom-full pointer-events-none -translate-x-1/2"
                      style={{ originX: 0.5, originY: 0.5 }}
                    >
                      <Heart className="w-5 h-5 text-pink-500 fill-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-indigo-400" /> {post.views}</span>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none text-white/80 leading-loose text-lg space-y-6">
            {/* Super simple markdown parser for the demo */}
            {post.content.split('\n\n').map((paragraph: string, i: number) => {
              if (paragraph.startsWith('## ')) {
                return <h3 key={i} className="text-2xl font-bold text-white mt-10 mb-4">{paragraph.replace('## ', '')}</h3>;
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote key={i} className="border-l-4 border-indigo-500 pl-4 italic text-white/60 my-8">
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              }
              return <p key={i}>{paragraph}</p>;
            })}
          </div>
          
          <div className="mt-16 flex flex-col items-center justify-center relative">
             <motion.button 
               whileHover={!hasLiked ? { scale: 1.05 } : {}}
               whileTap={!hasLiked ? { scale: 0.95 } : {}}
               onClick={handleLike}
               className={`relative flex items-center justify-center gap-3 px-10 py-4 rounded-full font-bold shadow-2xl overflow-hidden transition-all duration-500 ${hasLiked ? 'bg-white/5 text-pink-400 border border-pink-500/20 shadow-pink-500/10 cursor-default' : 'bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 text-white hover:shadow-pink-500/30 cursor-pointer'}`}
             >
               <Heart className={`w-6 h-6 transition-transform duration-500 ${hasLiked ? 'fill-current scale-110' : ''}`} />
               <span className="text-lg tracking-wide">{hasLiked ? '感谢你的点赞' : '赞赏本文'}</span>
               {hasLiked && (
                 <motion.div 
                   className="absolute inset-0 bg-pink-400/20 mix-blend-overlay"
                   initial={{ scale: 0, opacity: 1 }}
                   animate={{ scale: 2.5, opacity: 0 }}
                   transition={{ duration: 0.8, ease: "easeOut" }}
                 />
               )}
             </motion.button>
             <p className="mt-4 text-sm text-white/40 font-medium tracking-wider">
               {likes} 个人觉得很赞
             </p>
             
             {/* Center flying hearts for the big button */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none">
                <AnimatePresence>
                  {flyingHearts.map(heart => (
                    <motion.div
                      key={`btn-${heart.id}`}
                      initial={{ opacity: 0, y: 0, x: 0, scale: 0, rotate: 0 }}
                      animate={{ 
                        opacity: [0, 1, 1, 0], 
                        y: [0, heart.y * 1.5, heart.y * 2], 
                        x: [0, heart.x * 1.2, heart.x * 2],
                        scale: [0, heart.scale * 1.5, heart.scale],
                        rotate: [0, heart.rotation, heart.rotation * 2]
                      }}
                      transition={{ duration: 1.5, delay: heart.delay, ease: "easeOut" }}
                      className="absolute left-1/2 bottom-0 pointer-events-none -translate-x-1/2"
                    >
                      <Heart className="w-8 h-8 text-pink-400 fill-pink-400 drop-shadow-[0_0_12px_rgba(236,72,153,0.8)] mix-blend-screen" />
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>
          </div>
          
          <CommentSection postId={postId} />
        </div>
      </GlassCard>
    </motion.div>
    </>
  );
}

function CommentSection({ postId }: { postId: number }) {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  const fetchComments = useCallback(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then(res => res.json())
      .then(data => setComments(data));
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);
    
    fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newComment, user: '游客 (我)' })
    })
    .then(res => res.json())
    .then(newC => {
      setComments([newC, ...comments]);
      setNewComment('');
      setLoading(false);
    });
  };

  return (
    <div className="mt-16 pt-12 border-t border-white/10 relative">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="w-6 h-6 text-indigo-400" />
        <h3 className="text-2xl font-bold text-white">评论区 ({comments.length})</h3>
      </div>

      <div className="mb-10 group transition-all relative overflow-hidden rounded-2xl p-0.5 bg-white/5">
        <form onSubmit={handleSubmit} className="relative flex flex-col gap-4 p-4 sm:p-6 rounded-2xl bg-[#19191e]/40">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="分享你的想法..."
            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none min-h-[120px] backdrop-blur-sm shadow-inner"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/30"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {loading ? '发送中...' : '发布评论'}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {comments.map((comment, i) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="p-5 sm:p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 border border-indigo-500/20 shadow-sm">
                    <span className="text-indigo-300 font-bold text-sm">
                      {comment.user.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{comment.user}</h4>
                      <span className="text-xs font-medium text-white/50 px-2 py-1 bg-black/20 rounded-md">{comment.date}</span>
                    </div>
                    <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="max-w-3xl mx-auto mt-12 mb-24"
    >
      <GlassCard className="p-8 sm:p-12">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl mb-6 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/50 to-purple-500/50 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500"></div>
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" 
              alt="钟意" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <h1 className="text-4xl font-extrabold text-white mb-2">钟意</h1>
          <p className="text-lg text-indigo-400 font-medium mb-6">前端开发者 / 数字游民 / 独立创造者</p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-indigo-600 hover:text-white transition-all">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-blue-500 hover:text-white transition-all">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-rose-500 hover:text-white transition-all">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none text-white/80">
          <h3 className="flex items-center gap-2 text-2xl font-bold mb-4 text-white">
            <Sparkles className="text-indigo-400 w-6 h-6" /> 关于我
          </h3>
          <p className="leading-loose text-lg">
            你好，我是钟意。我热爱创造拥有极致体验的数字产品。在这个喧嚣的世界里，我相信技术和设计能够带来宁静与美好。
            目前我主要专注于 <strong>React、TypeScript、Next.js</strong> 和现代 CSS 技术。
          </p>
          
          <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <h3 className="flex items-center gap-2 text-2xl font-bold mb-4 text-white">
            <User className="text-indigo-400 w-6 h-6" /> 我的理念
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></div>
              <span><strong>设计驱动开发</strong>：代码是实现设计的手段，用户体验永远放在第一位。</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1.5 w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"></div>
              <span><strong>细节决定成败</strong>：一个微小的过渡动画，一次恰到好处的触觉反馈，都能让产品与众不同。</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1.5 w-2 h-2 rounded-full bg-pink-500 flex-shrink-0"></div>
              <span><strong>保持克制</strong>：做减法比做加法更难，最好的界面是让人感觉不到它的存在。</span>
            </li>
          </ul>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function AdminDashboard({ posts, background, onBackgroundChange }: { posts: any[], background: any, onBackgroundChange: (bg: any) => void }) {
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState(false);

  const updateBackground = (updates: any) => {
    const newBg = { ...background, ...updates };
    onBackgroundChange(newBg);
    fetch('/api/background', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(err => console.error('Failed to update background', err));
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        updateBackground({ type, url: base64Url });
        setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-24">
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-400" /> 后台管理登录
          </h2>
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-black/20 border border-white/10 text-white rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="请输入密码 (demo: 123456)"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (password === '123456') setIsAuthenticated(true);
                else alert('密码错误');
              }
            }}
          />
          <button 
            onClick={() => { if (password === '123456') setIsAuthenticated(true); else alert('密码错误'); }}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-lg font-bold transition-colors"
          >
            登录
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="max-w-4xl mx-auto mt-8 mb-24"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-indigo-400" /> 管理后台
        </h1>
      </div>

      <GlassCard className="p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" /> 沉浸背景设置
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <div className="flex-1 text-white/70 text-sm">
            你可以上传自定义的图片或视频作为前端动态雨滴毛玻璃效果的背景。<br/>
            上传后，前端所有用户将立刻看到新的背景体验。
          </div>
          <div className="relative">
            <input 
              type="file" 
              accept="image/*,video/*" 
              onChange={handleUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <button className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors ${uploading ? 'bg-white/10 text-white/50' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}>
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PenTool className="w-5 h-5" />}
              {uploading ? '正在处理...' : '上传图片或视频'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">环境音效 (音频)</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={background.sound || false} onChange={e => updateBackground({ sound: e.target.checked })} />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white font-medium">心形模式 (Heart Mode)</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={background.heart !== false} onChange={e => updateBackground({ heart: e.target.checked })} />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
            </label>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-white font-medium">降雨量</span>
              <span className="text-white/50">{background.rain < 0 ? 'Auto' : background.rain?.toFixed(2) || 'Auto'}</span>
            </div>
            <input type="range" min="-0.05" max="1" step="0.01" value={background.rain ?? -0.05} onChange={e => updateBackground({ rain: parseFloat(e.target.value) })} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-white font-medium">雾 (模糊)</span>
              <span className="text-white/50">{background.fog < 0 ? 'Auto' : background.fog?.toFixed(1) || 'Auto'}</span>
            </div>
            <input type="range" min="-0.5" max="8" step="0.1" value={background.fog ?? -0.5} onChange={e => updateBackground({ fog: parseFloat(e.target.value) })} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-white font-medium">折射 (Refraction)</span>
              <span className="text-white/50">{background.refract?.toFixed(1) || '1.0'}</span>
            </div>
            <input type="range" min="0" max="4" step="0.1" value={background.refract ?? 1.0} onChange={e => updateBackground({ refract: parseFloat(e.target.value) })} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <GlassCard className="p-6">
          <div className="flex items-center gap-4 text-white/60 mb-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span className="font-medium">文章总数</span>
          </div>
          <div className="text-4xl font-bold text-white">{posts.length}</div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center gap-4 text-white/60 mb-2">
            <Heart className="w-5 h-5 text-pink-400" />
            <span className="font-medium">收获点赞</span>
          </div>
          <div className="text-4xl font-bold text-white">{totalLikes}</div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center gap-4 text-white/60 mb-2">
            <Eye className="w-5 h-5 text-indigo-400" />
            <span className="font-medium">总浏览量</span>
          </div>
          <div className="text-4xl font-bold text-white">{totalViews}</div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <PenTool className="w-5 h-5 text-indigo-400" /> 文章管理
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-sm font-semibold text-white/50">
                <th className="pb-3 pr-4">标题</th>
                <th className="pb-3 px-4">分类</th>
                <th className="pb-3 px-4">日期</th>
                <th className="pb-3 px-4 text-right">数据</th>
                <th className="pb-3 pl-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-b border-white/5 last:border-0 group">
                  <td className="py-4 pr-4 font-medium text-white">{post.title}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs text-white/70">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-white/50">{post.date}</td>
                  <td className="py-4 px-4 text-right text-sm">
                    <div className="flex items-center justify-end gap-3 text-white/50">
                      <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-pink-400" /> {post.likes}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-indigo-400" /> {post.views}</span>
                    </div>
                  </td>
                  <td className="py-4 pl-4 text-right">
                    <button className="p-1.5 text-white/40 hover:text-indigo-400 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100">
                      <PenTool className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-white/40 hover:text-rose-400 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100 ml-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [activePostId, setActivePostId] = useState<number | null>(null);
  const [activePage, setActivePage] = useState<'home' | 'about'>('home');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [posts, setPosts] = useState<any[]>([]);
  const [background, setBackground] = useState({ type: 'image', url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2000&auto=format&fit=crop', sound: false, heart: true, rain: -0.05, fog: -0.5, refract: 1.0 });

  useEffect(() => {
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  useEffect(() => {
    const fetchBg = () => {
      fetch('/api/background')
        .then(res => res.json())
        .then(data => {
          if (data && data.url) {
            setBackground(prev => JSON.stringify(prev) !== JSON.stringify(data) ? data : prev);
          }
        })
        .catch(() => {});
    };
    fetchBg();
    const interval = setInterval(fetchBg, 5000);
    return () => clearInterval(interval);
  }, []);

  // Poll for posts periodically so admin updates
  useEffect(() => {
    if (currentPath.startsWith('/admin')) {
      const interval = setInterval(() => {
        fetch('/api/posts')
          .then(res => res.json())
          .then(data => setPosts(data));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentPath]);

  useEffect(() => {
    if (activePostId || activePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activePostId, activePage]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <WebGLRainBackground background={background} />
      <Navigation activePage={activePage} onNavigate={(p) => {
        if (currentPath.startsWith('/admin')) {
            window.history.pushState({}, '', '/');
            setCurrentPath('/');
        }
        setActivePostId(null);
        setActivePage(p);
      }} />
      
      <main className="max-w-4xl mx-auto px-4 pt-32 pb-24 min-h-screen">
        <AnimatePresence mode="wait">
          {currentPath.startsWith('/admin') ? (
            <AdminDashboard key="admin" posts={posts} background={background} onBackgroundChange={setBackground} />
          ) : activePage === 'about' ? (
            <AboutPage key="about" />
          ) : activePostId ? (
            <PostDetail key="detail" postId={activePostId} onBack={() => setActivePostId(null)} />
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.header 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12 text-center"
              >
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center text-4xl text-white font-bold mb-6 rotate-3 hover:rotate-0 transition-transform cursor-pointer"
                >
                  钟
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                  探索 Web 的无限可能
                </h1>
                <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                  分享全栈开发、交互设计与前沿技术的探索之旅。基于 Node.js 与 React，打造极致的艺术视觉与微交互体验。
                </p>
              </motion.header>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 sticky top-24 z-40 max-w-2xl mx-auto flex flex-col gap-4"
              >
                <GlassCard className="flex items-center gap-3 px-5 py-3.5 rounded-full" hoverEffect={false}>
                  <Search className="w-5 h-5 text-white/50" />
                  <input 
                    type="text" 
                    placeholder="搜索文章标题或内容..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40"
                  />
                </GlassCard>

                {/* Category Filters */}
                <div className="flex items-center justify-center flex-wrap gap-2">
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                        activeCategory === category 
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-105' 
                          : 'bg-white/10 text-white/70 hover:bg-white/20 backdrop-blur-md border border-white/10'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </motion.div>

              <BlogList searchQuery={searchQuery} activeCategory={activeCategory} onPostClick={setActivePostId} posts={posts} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <BackToTop />
    </ThemeProvider>
  );
}
