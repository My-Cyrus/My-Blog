import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// In-memory data
let currentBackground = {
  type: 'image',
  url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2000&auto=format&fit=crop',
  sound: false,
  heart: true,
  rain: -0.05,
  fog: -0.5,
  refract: 1.0
};

let POSTS = [
  { id: 1, title: '2026年全栈开发指南：React 19 与 Tailwind v4', description: '探索在最新技术栈下的现代 Web 开发实践，从服务端组件到全新的 CSS 引擎，全面解析最佳实践与架构设计。', date: '2026-07-01', category: '技术', readTime: '8 分钟', likes: 128, views: 3402, content: '在这个快速发展的时代，Web 开发技术日新月异。从最早的静态 HTML 页面，到如今的复杂全栈应用，前端与后端的边界越来越模糊。本文将深入探讨在现代 Web 开发中，如何利用最新的技术栈（如 React 19、Next.js 16 等）构建高性能、高交互性的应用。\n\n## 服务端组件的崛起\nReact 19 带来了 Server Components 的成熟落地，这改变了我们思考应用架构的方式。我们现在可以在服务端进行重度计算和数据获取，仅仅将序列化的 UI 发送给客户端。\n\n## Tailwind CSS v4\n全新的引擎不仅速度更快，而且对自定义变量和主题的支持更加原生。告别繁琐的配置文件，迎接更流畅的开发体验。' },
  { id: 2, title: '毛玻璃特效(Glassmorphism)在现代Web中的应用', description: '深入探讨如何使用 CSS backdrop-filter 和 WebGL 打造极具质感的现代 UI 界面，以及性能优化的关键点。', date: '2026-06-28', category: '设计', readTime: '5 分钟', likes: 256, views: 5120, content: '视觉体验是用户对产品的第一印象。毛玻璃（Glassmorphism）风格通过半透明背景、背景模糊（backdrop-filter）和鲜明的颜色叠加，营造出一种空间感和高级感。\n\n结合 Framer Motion 的弹性动画，我们可以让冰冷的界面元素拥有“生命力”。\n\n> “优秀的设计不仅是看起来好看，更重要的是用起来舒服。”\n\n无论是按钮的悬停反馈，还是页面切换时的平滑过渡，微交互都在无形中提升了用户的沉浸感。我们不仅要写出能够运行的代码，更要打磨出令人愉悦的体验。' },
  { id: 3, title: '如何使用 Framer Motion 实现丝滑微交互', description: '通过具体案例分享使用 Framer Motion 构建流畅页面过渡、果冻弹跳效果及复杂编排动画的核心技巧。', date: '2026-06-15', category: '前端', readTime: '12 分钟', likes: 89, views: 2100, content: '微交互（Micro-interactions）是提升产品质感的杀手锏。Framer Motion 作为 React 生态中最强大的动画库之一，其声明式的 API 让复杂动画变得触手可及。\n\n## 布局动画 (Layout Animations)\n通过简单的 `layout` 属性，Framer Motion 就能自动计算元素位置和尺寸的变化，实现丝滑的过渡效果。\n\n## 弹簧物理 (Spring Physics)\n抛弃僵硬的线性或者 ease 动画，使用弹簧物理能让界面更自然。' },
  { id: 4, title: '写在2026：数字游民的自我修养', description: '分享作为一名前端开发者，如何在快节奏的技术迭代与数字游民生活中寻找平衡与内心的宁静。', date: '2026-05-20', category: '随笔', readTime: '4 分钟', likes: 432, views: 8900, content: '作为数字游民，我们的办公室可能是巴厘岛的一家咖啡馆，也可能是清迈的某个共享办公空间。\n\n在享受地理自由的同时，如何保持高效和自律？\n\n1. **规律作息**：不要因为没有打卡制度就日夜颠倒。\n2. **持续学习**：技术迭代太快，保持好奇心。\n3. **数字排毒**：每周给自己半天时间，完全远离屏幕，去亲近自然。' },
];

let COMMENTS: Record<number, any[]> = {
  1: [
    { id: 1, user: '技术探索者', content: '毛玻璃效果加上背景特效，这视觉体验太绝了！学习到了。', date: '2小时前' },
  ],
  2: [
    { id: 2, user: 'UI爱好者', content: 'Framer Motion 的动画确实能极大地提升前端交互质感，感谢博主分享。', date: '5小时前' }
  ]
}

// API Routes
app.get('/api/posts', (req, res) => {
  // Return posts without full content to save bandwidth for list view
  const summaries = POSTS.map(({ content, ...rest }) => rest);
  res.json(summaries);
});

app.get('/api/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const post = POSTS.find(p => p.id === id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.post('/api/posts/:id/like', (req, res) => {
  const id = parseInt(req.params.id);
  const post = POSTS.find(p => p.id === id);
  if (post) {
    post.likes += 1;
    res.json({ likes: post.likes });
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.post('/api/posts/:id/view', (req, res) => {
  const id = parseInt(req.params.id);
  const post = POSTS.find(p => p.id === id);
  if (post) {
    post.views += 1;
    res.json({ views: post.views });
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.get('/api/posts/:id/comments', (req, res) => {
  const id = parseInt(req.params.id);
  res.json(COMMENTS[id] || []);
});

app.post('/api/posts/:id/comments', (req, res) => {
  const id = parseInt(req.params.id);
  const { content, user } = req.body;
  if (!content) return res.status(400).json({ error: 'Content required' });
  
  if (!COMMENTS[id]) COMMENTS[id] = [];
  
  const newComment = {
    id: Date.now(),
    user: user || '游客',
    content,
    date: '刚刚'
  };
  
  COMMENTS[id].unshift(newComment);
  res.json(newComment);
});

app.get('/api/background', (req, res) => {
  res.json(currentBackground);
});

app.post('/api/background', (req, res) => {
  const { type, url, sound, heart, rain, fog, refract } = req.body;
  if (type !== undefined) currentBackground.type = type;
  if (url !== undefined) currentBackground.url = url;
  if (sound !== undefined) currentBackground.sound = sound;
  if (heart !== undefined) currentBackground.heart = heart;
  if (rain !== undefined) currentBackground.rain = rain;
  if (fog !== undefined) currentBackground.fog = fog;
  if (refract !== undefined) currentBackground.refract = refract;
  res.json(currentBackground);
});

// Vite Middleware for Development or Static Serving for Production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
