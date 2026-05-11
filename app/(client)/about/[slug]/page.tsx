'use client'
// src/app/(client)/about/[slug]/page.tsx
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Be_Vietnam_Pro } from 'next/font/google';
import Sidebar from '@/components/sidebar';
import { Loader2, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const beVietnam = Be_Vietnam_Pro({
    subsets: ['vietnamese'],
    weight: ['400', '500', '700', '900'],
    display: 'swap',
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AboutDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const [post, setPost] = useState<any>(null);
    const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const resolvedParams = React.use(params);
    const slug = resolvedParams.slug;

    useEffect(() => {
        const fetchPostAndRelated = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                // 1. Lấy bài viết chi tiết
                const { data, error } = await supabase
                    .from('posts')
                    .select('*, categories(name)')
                    .eq('slug', slug)
                    .single();

                if (data) {
                    const cleanContent = data.content.replace(/&nbsp;/g, ' ');
                    const cleanSummary = data.summary ? data.summary.replace(/&nbsp;/g, ' ') : '';
                    setPost({ ...data, content: cleanContent, summary: cleanSummary });

                    // 2. Lấy tin liên quan từ trường featured_image
                    const { data: related } = await supabase
                        .from('posts')
                        .select('*')
                        .eq('category_id', data.category_id)
                        .neq('slug', slug)
                        .limit(5)
                        .order('created_at', { ascending: false });

                    setRelatedPosts(related || []);
                }
            } catch (err) {
                console.error("Alpha VN Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPostAndRelated();
    }, [slug]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Alpha Loading...</p>
        </div>
    );

    if (!post) return <div className="py-20 text-center opacity-30 italic font-bold">Dữ liệu trống.</div>;

    const noImagePlaceholder = "https://placehold.co/200x150/f1f5f9/94a3b8?text=No+Image";

    return (
        <div className={`${beVietnam.className} bg-white min-h-screen antialiased overflow-x-hidden`}>
            <div className="max-w-7xl mx-auto px-4 md:px-6 pt-2 pb-20 flex flex-col lg:flex-row gap-10">

                <aside className="w-full lg:w-80 flex-shrink-0">
                    <Sidebar />
                </aside>

                <main className="flex-1 min-w-0">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden flex flex-col">

                        {/* HEADER */}
                        <div className="px-8 md:px-12 pt-10 pb-6 bg-slate-50/50">
                            <h1 className="text-[18px] md:text-[22px] font-[900] text-slate-900 uppercase italic tracking-tight leading-tight">
                                {post.title}
                            </h1>

                            {/* Ngày tháng dưới tiêu đề chính */}
                            <div className="flex items-center gap-1.5 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                                <Calendar size={12} className="text-orange-600" />
                                {new Date(post.created_at).toLocaleDateString('vi-VN')}
                            </div>

                            <div className="w-12 h-[3px] bg-orange-600 mt-4"></div>
                        </div>

                        {/* MÔ TẢ */}
                        {post.summary && (
                            <div className="px-8 md:px-12 pt-6 pb-2 bg-orange-50/20">
                                <p className="text-slate-500 text-[13px] leading-relaxed italic font-medium">
                                    {post.summary}
                                </p>
                            </div>
                        )}

                        {/* NỘI DUNG CHI TIẾT */}
                        <div className="px-8 md:px-12 py-8 bg-white">
                            <article
                                className="alpha-article-final w-full"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </div>

                        {/* TIN KHÁC: Phân tách rõ ràng */}
                        {relatedPosts.length > 0 && (
                            <div className="px-8 md:px-12 pb-12 pt-10 bg-slate-50/80 border-t-[8px] border-slate-100">
                                <h3 className="text-[18px] font-[900] text-slate-900 uppercase italic mb-8 flex items-center gap-3">
                                    <span className="w-8 h-[3px] bg-orange-600"></span>
                                    Tin khác
                                </h3>
                                <div className="grid gap-6">
                                    {relatedPosts.map((item) => (
                                        <Link
                                            key={item.slug}
                                            href={`/gioi-thieu/${item.slug}`}
                                            className="group flex items-center gap-4 pb-4 border-b border-slate-200 last:border-0 last:pb-0"
                                        >
                                            {/* Ảnh đại diện nhỏ */}
                                            <div className="w-16 h-12 md:w-20 md:h-14 flex-shrink-0 rounded-lg overflow-hidden bg-white border border-slate-200 shadow-sm">
                                                <img
                                                    src={item.featured_image || noImagePlaceholder}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/images/logo.png';
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-col flex-1 min-w-0">
                                                <span className="text-[14px] font-bold text-slate-700 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2 leading-snug">
                                                    {item.title}
                                                </span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {/* Icon lịch đã đổi sang màu cam theo yêu cầu */}
                                                    <Calendar size={10} className="text-orange-600" />
                                                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                                                        {new Date(item.created_at).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                            </div>
                                            <ChevronRight className="flex-shrink-0 text-slate-300 group-hover:text-orange-600 transition-all" size={16} />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </main>
            </div>

            <style jsx global>{`
                .alpha-article-final p, 
                .alpha-article-final span, 
                .alpha-article-final li {
                    word-break: normal !important;
                    overflow-wrap: break-word !important;
                    word-wrap: break-word !important;
                    text-align: left !important;
                    hyphens: none !important;
                    color: #334155; 
                    font-size: 15px; 
                    line-height: 1.8; 
                    margin-bottom: 1.5rem; 
                    font-weight: 500;
                }

                .alpha-article-final h2 { 
                    font-weight: 900; font-style: italic; text-transform: uppercase; 
                    font-size: 13px; color: #ea580c; margin: 3rem 0 1rem; 
                }

                .alpha-article-final img { 
                    max-width: 100% !important; height: auto !important; 
                    border-radius: 1.5rem; margin: 3rem auto; display: block;
                    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05);
                }

                .alpha-article-final strong { color: #0f172a; font-weight: 900; }
            `}</style>
        </div>
    );
}