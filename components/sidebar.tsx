'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Phone, Box, ChevronRight } from 'lucide-react';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Sidebar() {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCats = async () => {
            const { data } = await supabase
                .from('categories')
                .select('name, slug')
                .eq('type', 'product')
                .order('name');
            if (data) setCategories(data);
        };
        fetchCats();
    }, []);

    return (
        /* Thêm lg:sticky, lg:top-10 và h-fit để Sidebar dính vào màn hình khi cuộn */
        <aside className="w-full lg:w-72 flex flex-col gap-8 lg:sticky lg:top-10 h-fit">
            {/* KHỐI SẢN PHẨM - Tông màu Đỏ Cam/Slate */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-slate-900 text-white px-6 py-4 flex items-center gap-3">
                    <Box size={18} className="text-orange-500" />
                    <h3 className="text-[11px] font-[900] uppercase tracking-widest italic">Danh mục Sản phẩm</h3>
                </div>
                <nav className="p-2">
                    {categories.map((cat) => (
                        <a
                            key={cat.slug}
                            href={`/san-pham/${cat.slug}`}
                            className="flex items-center justify-between px-4 py-3 text-[11px] font-bold text-slate-600 uppercase tracking-tight hover:bg-slate-50 hover:text-orange-600 rounded-xl transition-all group"
                        >
                            {cat.name}
                            <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    ))}
                </nav>
            </div>

            {/* KHỐI HỖ TRỢ TRỰC TUYẾN */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 text-white shadow-lg shadow-orange-200">
                <h3 className="text-[11px] font-[900] uppercase tracking-widest italic mb-4">Hỗ trợ kỹ thuật</h3>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                        <Phone size={18} />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase opacity-80">Hotline 24/7</p>
                        <p className="text-sm font-black tracking-wider">0968 060 886</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}