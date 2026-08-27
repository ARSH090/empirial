import React from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, User } from 'lucide-react';
import { MOCK_BLOG_POSTS } from '@/lib/data/blog-data';

export const metadata = {
  title: 'Prop Trading Educational Intelligence & Guides | EMPIRIAL 2.0',
  description: 'In-depth trading guides, mathematical drawdown preservation, consistency rule breakdowns, and psychological frameworks.',
};

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>INSTITUTIONAL PROP EDUCATION</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Prop Trading Knowledge & Guides
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Master challenge risk models, asymmetric drawdowns, lot size consistency rules, and ICT execution mechanics.
        </p>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_BLOG_POSTS.map((post) => (
          <article
            key={post.id}
            className="bg-elevation-surface border border-white/10 hover:border-cyan-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all hover:shadow-2xl hover:shadow-cyan-950/20 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.read_time}</span>
                </span>
              </div>

              <Link href={`/blog/${post.slug}`} className="block group">
                <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                  {post.title}
                </h2>
              </Link>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white">
                  {post.author.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{post.author.name}</h4>
                  <p className="text-[10px] text-slate-400">{post.author.role}</p>
                </div>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
