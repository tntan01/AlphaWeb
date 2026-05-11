'use client'
// components/header.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import {
  Mail, Phone, MapPin, Search, ShoppingCart, ShieldCheck, Award,
  Wrench, Zap, ChevronDown
} from 'lucide-react';

// Khởi tạo Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Header() {
  const [productCategories, setProductCategories] = useState<any[]>([]);
  const [newsCategories, setNewsCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      // Lấy chuyên mục sản phẩm
      const { data: prodData } = await supabase
        .from('categories')
        .select('name, slug')
        .eq('type', 'product')
        .order('name');

      // Lấy chuyên mục tin tức (Công nghệ, Công ty, Tuyển dụng)
      const { data: postData } = await supabase
        .from('categories')
        .select('name, slug')
        .eq('type', 'post')
        .in('slug', ['tin-cong-nghe', 'tin-cong-ty', 'tuyen-dung'])
        .order('name');

      if (prodData) setProductCategories(prodData);
      if (postData) setNewsCategories(postData);
    };

    fetchCategories();
  }, []);

  return (
    <header className="w-full">
      {/* 1. TOP BAR - Giữ nguyên 100% */}
      <div className="hidden md:block bg-slate-900 text-white py-2 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-90">
          <div className="flex gap-8">
            <a href="mailto:contact@alpha-vn.com" className="flex items-center gap-2 hover:text-orange-400 transition-colors">
              <Mail size={12} className="text-orange-500" />
              <span>Email: contact@alpha-vn.com</span>
            </a>
            <a href="tel:0968060886" className="flex items-center gap-2 border-l border-white/20 pl-8 hover:text-orange-400 transition-colors">
              <Phone size={12} className="text-orange-500" />
              <span>Hotline: 0968 060 886</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-orange-500" />
            <span>Địa chỉ: A10 TT12 đường 19/5, phường Hà Đông, Hà Nội</span>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION - Căn chỉnh Menu cấp 2 */}
      <nav className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center group cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="relative h-14 md:h-18 w-auto flex items-center transition-all duration-300 group-hover:drop-shadow-md">
              <Image
                src="/images/logo.png"
                alt="Alpha Vietnam"
                width={280}
                height={70}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 h-full">
            <a href="/" className="text-orange-600 border-b-2 border-orange-600 pb-1">Trang chủ</a>

            <a href="/gioi-thieu" className="hover:text-orange-600 transition-colors pb-1">Giới thiệu</a>

            {/* DROPDOWN SẢN PHẨM - Căn giữa so với chữ Sản phẩm */}
            <div className="relative h-full flex items-center group">
              <span className="cursor-default hover:text-orange-600 transition-colors pb-1 flex items-center gap-1">
                Sản phẩm <ChevronDown size={12} />
              </span>
              {/* FIX: Sử dụng left-1/2 và -translate-x-1/2 để đổ menu ngay sát vị trí cấp 1 */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white border border-slate-100 shadow-2xl rounded-b-xl py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-0 group-hover:translate-y-0 border-t-2 border-t-orange-600">
                {productCategories.map((cat) => (
                  <a key={cat.slug} href={`/san-pham/${cat.slug}`} className="block px-6 py-2.5 hover:bg-slate-50 hover:text-orange-600 transition-colors">
                    {cat.name}
                  </a>
                ))}
              </div>
            </div>

            <a href="/du-an" className="hover:text-orange-600 transition-colors pb-1">Dự án</a>

            {/* DROPDOWN TIN TỨC - Căn giữa so với chữ Tin tức */}
            <div className="relative h-full flex items-center group">
              <span className="cursor-default hover:text-orange-600 transition-colors pb-1 flex items-center gap-1">
                Tin tức <ChevronDown size={12} />
              </span>
              {/* FIX: Sử dụng left-1/2 và -translate-x-1/2 để đổ menu ngay sát vị trí cấp 1 */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white border border-slate-100 shadow-2xl rounded-b-xl py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-0 group-hover:translate-y-0 border-t-2 border-t-orange-600">
                {newsCategories.map((cat) => (
                  <a key={cat.slug} href={`/tin-tuc/${cat.slug}`} className="block px-6 py-2.5 hover:bg-slate-50 hover:text-orange-600 transition-colors">
                    {cat.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Search className="w-5 h-5 text-slate-400 cursor-pointer hover:text-orange-600 transition-colors" strokeWidth={2} />
            <div className="relative cursor-pointer group">
              <ShoppingCart className="w-5 h-5 text-slate-400 group-hover:text-orange-600 transition-colors" strokeWidth={2} />
              <span className="absolute -top-2 -right-2 text-[9px] font-bold bg-orange-600 text-white w-4 h-4 flex items-center justify-center rounded-full shadow-md">0</span>
            </div>
            <button className="hidden md:block bg-slate-900 text-white px-7 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-orange-600 transition-all duration-300">
              LIÊN HỆ
            </button>
          </div>
        </div>
      </nav>

      {/* 3. TRUST RIBBON - Giữ nguyên 100% */}
      <section className="bg-slate-50 border-b border-slate-100 py-4 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center lg:justify-between items-center gap-x-12 gap-y-4 text-slate-500">
          {[
            { icon: <ShieldCheck size={16} />, text: 'Chính hãng Tier 1' },
            { icon: <Award size={16} />, text: 'Bảo hành 12-25 năm' },
            { icon: <Wrench size={16} />, text: 'Hỗ trợ kỹ thuật 24/7' },
            { icon: <MapPin size={16} />, text: 'Khảo sát tận nơi' },
            { icon: <Zap size={16} />, text: 'Lắp đặt toàn quốc' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 group cursor-default">
              <span className="text-orange-600 transition-transform group-hover:scale-110">{item.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.text}</span>
            </div>
          ))}
        </div>
      </section>
    </header>
  );
}