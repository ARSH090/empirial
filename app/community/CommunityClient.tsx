'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Plus,
  Send,
  Sparkles,
  ShieldCheck,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { MOCK_POSTS } from '@/lib/data/community-data';
import { CommunityPost } from '@/lib/types';
import { openAuthModal } from '@/lib/utils/auth-store';

export function CommunityClient() {
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_POSTS);
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [activePostId, setActivePostId] = useState<string | null>(null);

  // New post modal / state
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newTag, setNewTag] = useState<'KNOWLEDGE' | 'RULES' | 'PSYCHOLOGY' | 'OFFERS'>('KNOWLEDGE');
  const [newFirmTag, setNewFirmTag] = useState('FTMO');

  // Comment input state
  const [commentText, setCommentText] = useState('');

  const handleVote = (postId: string, type: 'up' | 'down') => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            upvotes: type === 'up' ? p.upvotes + 1 : p.upvotes,
            downvotes: type === 'down' ? p.downvotes + 1 : p.downvotes,
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    const created: CommunityPost = {
      id: 'post-' + Date.now(),
      title: newTitle,
      body: newBody,
      user_name: 'Anuraj Trader',
      user_avatar: 'AT',
      is_verified: true,
      firm_tag: newFirmTag,
      category_tag: newTag,
      upvotes: 1,
      downvotes: 0,
      views: 12,
      comments_count: 0,
      created_at: new Date().toISOString(),
      comments: [],
    };

    setPosts([created, ...posts]);
    setIsCreatingPost(false);
    setNewTitle('');
    setNewBody('');
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const newComment = {
            id: 'c-' + Date.now(),
            user_name: 'Anuraj Trader',
            content: commentText,
            created_at: new Date().toISOString(),
            upvotes: 0,
          };
          return {
            ...p,
            comments_count: p.comments_count + 1,
            comments: [...(p.comments || []), newComment],
          };
        }
        return p;
      })
    );
    setCommentText('');
  };

  const filteredPosts = posts.filter((p) => {
    if (selectedTag !== 'ALL' && p.category_tag !== selectedTag) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>GLOBAL TRADER DISCUSSIONS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Trader Community Forum & Strategies
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Discuss pass strategies, broker slippage, payout timelines, risk psychology, and rule updates with 48,500+ verified traders.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingPost(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion Thread (+100 pts)</span>
        </button>
      </div>

      {/* Category Tag Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {['ALL', 'KNOWLEDGE', 'RULES', 'PSYCHOLOGY', 'OFFERS'].map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedTag === tag
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'bg-elevation-surface hover:bg-elevation-raised text-slate-300 border border-white/5'
            }`}
          >
            {tag === 'ALL' ? 'All Threads' : `#${tag}`}
          </button>
        ))}
      </div>

      {/* New Post Creator Modal */}
      {isCreatingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-elevation-modal border border-white/15 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Create New Discussion Thread</h3>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Thread Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Best session times for passing 100K challenge..."
                  required
                  className="w-full bg-elevation-base border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value as any)}
                    className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="KNOWLEDGE">KNOWLEDGE (Strategy / Setup)</option>
                    <option value="RULES">RULES (Consistency / Drawdown)</option>
                    <option value="PSYCHOLOGY">PSYCHOLOGY (Discipline / Risk)</option>
                    <option value="OFFERS">OFFERS (Discount Codes)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Related Firm Tag</label>
                  <input
                    type="text"
                    value={newFirmTag}
                    onChange={(e) => setNewFirmTag(e.target.value)}
                    placeholder="e.g. FTMO, Funding Pips"
                    className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Thread Content (Markdown supported)</label>
                <textarea
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  rows={6}
                  placeholder="Share your detailed analysis, journal entries, or questions..."
                  required
                  className="w-full bg-elevation-base border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingPost(false)}
                  className="px-4 py-2 rounded-xl bg-elevation-card hover:bg-elevation-overlay text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold shadow-lg shadow-cyan-500/20"
                >
                  Publish Thread (+100 pts)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts Stream */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-elevation-surface border border-white/10 hover:border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-5 transition-all shadow-xl"
          >
            {/* Header: User + Tags */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xs text-black shadow">
                  {post.user_avatar || post.user_name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{post.user_name}</span>
                    {post.is_verified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {post.firm_tag && (
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300">
                    {post.firm_tag}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[10px] font-bold text-cyan-400">
                  #{post.category_tag}
                </span>
              </div>
            </div>

            {/* Post Title & Body */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white leading-snug">
                {post.title}
              </h2>
              <div className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                {post.body}
              </div>
            </div>

            {/* Engagement Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                {/* Upvote Button */}
                <button
                  onClick={() => handleVote(post.id, 'up')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-elevation-card hover:bg-emerald-950/40 border border-white/5 hover:border-emerald-500/40 text-emerald-400 font-bold transition-all cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{post.upvotes}</span>
                </button>

                {/* Downvote Button */}
                <button
                  onClick={() => handleVote(post.id, 'down')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-elevation-card hover:bg-rose-950/40 border border-white/5 hover:border-rose-500/40 text-rose-400 font-bold transition-all cursor-pointer"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>{post.downvotes}</span>
                </button>

                {/* Comments Counter */}
                <button
                  onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-elevation-card hover:bg-elevation-overlay border border-white/5 text-slate-300 font-medium transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.comments_count} Comments</span>
                </button>
              </div>

              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <Eye className="w-3.5 h-3.5" />
                <span>{post.views} views</span>
              </span>
            </div>

            {/* Expandable Comments Drawer */}
            {activePostId === post.id && (
              <div className="pt-4 border-t border-white/5 space-y-4 animate-in fade-in duration-150">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Thread Responses ({post.comments?.length || 0})
                </h4>

                {/* Comments List */}
                <div className="space-y-3">
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                      <div key={comment.id} className="p-3 rounded-xl bg-elevation-card border border-white/5 text-xs space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <strong className="text-cyan-400">{comment.user_name}</strong>
                          <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-300">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">No comments yet. Be the first to reply!</p>
                  )}
                </div>

                {/* Comment Input */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a constructive reply..."
                    className="flex-1 bg-elevation-base border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
