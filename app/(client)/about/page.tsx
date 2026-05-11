'use client'
// src/app/(client)/about/page.tsx
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

export default function AboutListPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const { data } = await supabase
                    .from('posts')
                    .select('*, categories!inner(slug)')
                    .eq('categories.slug', 'gioi-thieu')
                    .eq('status', 'published')
                    .order('created_at', { ascending: false });
                if (data) setPosts(data);
            } catch (err) {
                console.error("Alpha VN Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className={`${beVietnam.className} bg-white min-h-screen antialiased`}>
            {/* Layout 2 cột: pt-2 để sát Header nhất */}
            <div className="max-w-7xl mx-auto px-6 pt-2 pb-20 flex flex-col lg:flex-row gap-12">

                {/* CỘT TRÁI: SIDEBAR */}
                <Sidebar />

                {/* CỘT PHẢI: DANH SÁCH BÀI VIẾT */}
                <main className="flex-1">

                    {/* Thanh tiêu đề: Dải cam mỏng 2px, dài 80px (Industrial Style) */}
                    <div className="bg-slate-50 px-6 py-4 mb-8 rounded-t-[1.5rem] rounded-br-[1.5rem] relative overflow-hidden shadow-sm border border-slate-100/50">
                        <h1 className="text-[12px] font-[900] text-slate-800 uppercase italic tracking-[0.25em] relative z-10">
                            Về Alpha Việt Nam
                        </h1>
                        <div className="absolute bottom-0 left-0 w-20 h-[3px] bg-orange-600"></div>
                    </div>

                    {loading ? (
                        <div className="py-24 flex flex-col items-center justify-center text-slate-300">
                            <Loader2 className="animate-spin text-orange-600 mb-2" size={24} />
                            <p className="text-[9px] font-black uppercase tracking-widest italic">Đang tải dữ liệu Alpha...</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 border-b border-slate-100">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="py-8 flex flex-col md:flex-row gap-8 group hover:bg-slate-50/40 transition-all duration-300 px-4 -mx-4 rounded-2xl"
                                >
                                    {/* 1. ẢNH ĐẠI DIỆN: Đã sửa Link thành /gioi-thieu/ */}
                                    <Link href={`/gioi-thieu/${post.slug}`} className="w-full md:w-44 h-28 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center shadow-sm">
                                        <img
                                            src={post.image_url || '/images/logo.png'}
                                            className={`w-full h-full ${post.image_url ? 'object-cover' : 'object-contain p-5'} group-hover:scale-105 transition-transform duration-700`}
                                            alt={post.title}
                                        />
                                    </Link>

                                    {/* 2. NỘI DUNG */}
                                    <div className="flex-1 flex flex-col relative">
                                        <Link href={`/gioi-thieu/${post.slug}`}>
                                            <h2 className="text-sm font-[900] text-slate-900 uppercase italic tracking-tight mb-1.5 group-hover:text-orange-600 transition-colors leading-snug">
                                                {post.title}
                                            </h2>
                                        </Link>

                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 italic flex items-center gap-1.5">
                                            <Calendar size={11} className="text-orange-600/60" />
                                            {new Date(post.created_at).toLocaleDateString('vi-VN')}
                                        </div>

                                        {/* MÔ TẢ: Lấy dữ liệu từ cột SUMMARY, màu slate-500 rõ nét hơn */}
                                        <p className="text-slate-500 text-[12px] leading-relaxed line-clamp-2 font-medium mb-4 opacity-90">
                                            {post.summary || "Tìm hiểu thêm về năng lực và giải pháp công nghệ từ Alpha Việt Nam..."}
                                        </p>

                                        {/* NÚT CHI TIẾT: Đã sửa Link thành /gioi-thieu/ */}
                                        <div className="mt-auto flex justify-end">
                                            <Link
                                                href={`/gioi-thieu/${post.slug}`}
                                                className="text-orange-600 text-[10px] font-black uppercase tracking-tighter italic flex items-center gap-1 hover:gap-2 transition-all hover:underline underline-offset-4"
                                            >
                                                Xem chi tiết <ChevronRight size={12} strokeWidth={3} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {posts.length === 0 && !loading && (
                        <div className="py-20 text-center font-black uppercase italic text-slate-200 tracking-widest text-[9px]">
                            Dữ liệu đang được cập nhật...
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}