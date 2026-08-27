'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Edit } from 'lucide-react';
import { MOCK_BLOG_POSTS } from '@/lib/data/blog-data';
import { BlogPost } from '@/lib/types';
import { getBlogPosts, createBlogPost, deleteBlogPost } from '@/lib/firebase/services';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Strategy & Risk');
  const [excerpt, setExcerpt] = useState('');

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getBlogPosts();
        if (data && data.length > 0) {
          setPosts(data);
        } else {
          setPosts(MOCK_BLOG_POSTS);
        }
      } catch (err) {
        console.error('Failed to load posts:', err);
        setPosts(MOCK_BLOG_POSTS);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await deleteBlogPost(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete post:', err);
      // Fallback
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newPost: Omit<BlogPost, 'id'> = {
      slug: title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
      title,
      excerpt,
      content: excerpt,
      author: {
        name: 'EMPIRIAL Editorial Desk',
        role: 'Market Analyst',
        avatar: '',
      },
      read_time: '5 min read',
      category,
      published_at: new Date().toISOString().split('T')[0],
      cover_image: '',
    };

    try {
      const id = await createBlogPost(newPost);
      setPosts([{ id, ...newPost }, ...posts]);
    } catch (err) {
      console.error('Failed to create post:', err);
      // Fallback
      setPosts([{ id: 'blog-' + Date.now(), ...newPost }, ...posts]);
    }

    setIsAdding(false);
    setTitle('');
    setExcerpt('');
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-400 font-mono">Loading blog posts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Educational Blog Article CMS</h1>
          <p className="text-xs text-slate-400">Publish guides, risk management strategies, and compliance analyses.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-elevation-surface border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Draft New Educational Article</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article Title"
              required
              className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category (e.g. Rules & Compliance)"
              className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Article summary / excerpt..."
              rows={3}
              className="w-full bg-elevation-base border border-white/10 rounded-xl p-3 text-xs text-white"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg bg-elevation-card text-xs text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-purple-500 text-white font-bold text-xs"
            >
              Publish Article
            </button>
          </div>
        </form>
      )}

      {/* Articles Table */}
      <div className="bg-elevation-surface border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-elevation-card text-slate-400 uppercase font-bold text-[10px]">
              <th className="p-4">Article Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Author</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-elevation-raised/60">
                <td className="p-4 font-bold text-white max-w-sm truncate">{p.title}</td>
                <td className="p-4 text-cyan-400 font-semibold">{p.category}</td>
                <td className="p-4 text-slate-300">{p.author.name}</td>
                <td className="p-4 text-slate-400 font-mono">{p.published_at}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 rounded bg-rose-950/40 text-rose-400 hover:bg-rose-900/60"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
