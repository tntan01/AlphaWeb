// page.tsx - Next.js (App Router)
// Website: Alpha Vietnam Investment and Technology Co., Ltd
// Tối ưu: Thu gọn khoảng cách giữa Đối tác và Sản phẩm, giữ Typography chuyên nghiệp

import React from 'react';
import Image from 'next/image';
import { 
  Battery, Sun, Zap, Wrench, PhoneCall, ShoppingCart, Search,
  ArrowUpRight, ShieldCheck, Globe, Clock, MapPin,
  CreditCard, Award, ChevronRight, Mail, Phone, ShoppingBag
} from 'lucide-react';
// GIẢ LẬP DỮ LIỆU TỪ DATABASE CHO 4 MỤC SẢN PHẨM
const PRODUCT_CATEGORIES = [
  {
    id: 'pin-mat-troi',
    title: 'Pin Năng Lượng Mặt Trời',
    description: 'Các dòng tấm pin hiệu suất cao Tier 1 từ Jinko Solar và LONGi Solar',
    products: [
      { id: 1, name: 'Jinko Tiger Neo N-type 580W', brand: 'Jinko Solar', price: 'Liên hệ', img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=400' },
      { id: 2, name: 'LONGi Hi-MO 6 Explorer 575W', brand: 'LONGi Solar', price: 'Liên hệ', img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=400' },
      { id: 3, name: 'Jinko Tiger Pro 545W Mono', brand: 'Jinko Solar', price: 'Liên hệ', img: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=400' },
      { id: 4, name: 'LONGi Hi-MO 5m 415W Black', brand: 'LONGi Solar', price: 'Liên hệ', img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=400' },
    ]
  },
  {
    id: 'inverter',
    title: 'Biến Tần Inverter',
    description: 'Giải pháp chuyển đổi năng lượng Hybrid và Hòa lưới chuẩn quốc tế',
    products: [
      { id: 5, name: 'Growatt MIN 5000TL-X', brand: 'Growatt', price: 'Liên hệ', img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=400' },
      { id: 6, name: 'Deye Hybrid 5kW 1 Pha', brand: 'Deye', price: 'Liên hệ', img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=400' },
      { id: 7, name: 'Growatt MOD 10KTL3-X', brand: 'Growatt', price: 'Liên hệ', img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=400' },
      { id: 8, name: 'Deye 12kW 3 Pha Hybrid', brand: 'Deye', price: 'Liên hệ', img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=400' },
    ]
  },
  {
    id: 'den-nang-luong',
    title: 'Đèn Năng Lượng Mặt Trời',
    description: 'Hệ thống chiếu sáng thông minh 0đ cho đường phố và sân vườn',
    products: [
      { id: 9, name: 'Đèn Đường Bàn Chải 300W', brand: 'Alpha Solar', price: 'Liên hệ', img: 'https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=400' },
      { id: 10, name: 'Đèn Pha UFO 500W Cao Cấp', brand: 'Q-SUN', price: 'Liên hệ', img: 'https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=400' },
      { id: 11, name: 'Đèn Liền Thể All-in-one 120W', brand: 'Anern', price: 'Liên hệ', img: 'https://images.unsplash.com/photo-1508182314998-3bd49473002f?q=80&w=400' },
      { id: 12, name: 'Đèn Sân Vườn Solar Light', brand: 'Alpha Solar', price: 'Liên hệ', img: 'https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=400' },
    ]
  },
  {
    id: 'pin-uon-cong',
    title: 'Pin Năng Lượng Mặt Trời Uốn Cong',
    description: 'Dòng pin Flexible siêu mỏng, nhẹ cho bề mặt cong và di động',
    products: [
      { id: 13, name: 'Tấm Pin Uốn Cong 100W Mono', brand: 'Alpha Tech', price: 'Liên hệ', img: 'https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=400' },
      { id: 14, name: 'Pin Linh Hoạt ETFE 150W', brand: 'Alpha Tech', price: 'Liên hệ', img: 'https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=400' },
      { id: 15, name: 'Pin Uốn Cong Bề Mặt Thuyền 200W', brand: 'Alpha Tech', price: 'Liên hệ', img: 'https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=400' },
      { id: 16, name: 'Tấm Pin Mỏng Nhẹ 50W Portable', brand: 'Alpha Tech', price: 'Liên hệ', img: 'https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=400' },
    ]
  }
];
export default function AlphaSolarHomepage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased selection:bg-orange-100 selection:text-orange-600">
      
      {/* 1. TOP BAR */}
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

      {/* 2. NAVIGATION */}
      <nav className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center group cursor-pointer">
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

          <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <a href="#" className="text-orange-600 border-b-2 border-orange-600 pb-1">Trang chủ</a>
            <a href="#" className="hover:text-orange-600 transition-colors pb-1">Sản phẩm</a>
            <a href="#" className="hover:text-orange-600 transition-colors pb-1">Dịch vụ kỹ thuật</a>
            <a href="#" className="hover:text-orange-600 transition-colors pb-1">Dự án</a>
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

      {/* 3. TRUST RIBBON */}
      <div className="bg-slate-50 border-b border-slate-100 py-3 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center lg:justify-between items-center gap-x-12 gap-y-4 text-slate-500">
          {[
            { icon: <ShieldCheck size={14} />, text: 'Chính hãng Tier 1' },
            { icon: <Award size={14} />, text: 'Bảo hành 10 năm' },
            { icon: <Wrench size={14} />, text: 'Hỗ trợ kỹ thuật 24/7' },
            { icon: <MapPin size={14} />, text: 'Khảo sát tận nơi' },
            { icon: <CreditCard size={14} />, text: 'Trả góp 0% lãi suất' },
            { icon: <Zap size={14} />, text: 'Lắp đặt toàn quốc' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 group cursor-default">
              <span className="text-orange-600 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </span>
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. HERO SECTION */}
      <section className="relative pt-8 md:pt-12 pb-16 px-6 bg-[#fbfbfb] overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <span className="inline-block text-[11px] font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded mb-6 uppercase tracking-widest border border-orange-100">
              Alpha Vietnam Investment and Technology
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.15] mb-6 tracking-tight">
              Năng lượng <br />
              <span className="text-orange-600">Sạch & Thông minh</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg mb-10 font-medium opacity-90">
              Giải pháp năng lượng mặt trời toàn diện: Cung cấp Pin, Inverter, ắc quy lưu trữ và dịch vụ kỹ thuật chuyên nghiệp.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <button className="bg-orange-600 text-white px-9 py-4.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-slate-900 transition-all duration-300 flex items-center gap-3 group">
                XEM SẢN PHẨM <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-orange-600 transition-colors flex items-center gap-2 font-bold">
                Yêu cầu lắp đặt <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[16/10] lg:aspect-[4/3] rounded-3xl bg-slate-200 overflow-hidden shadow-2xl border-4 border-white relative group">
              <img 
                src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1200" 
                alt="Dự án Alpha Solar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-5">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-orange-200">
                <Sun size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 leading-none">30MW+</p>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mt-1 italic leading-none">Công suất <br /> dự kiến 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BRAND MARQUEE - Đã thu gọn pb-4 để siết khoảng cách bên dưới */}
      <section className="pt-10 pb-4 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-8">Đối tác chiến lược & Thương hiệu phân phối</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <span className="text-2xl font-black tracking-tighter cursor-default">JINKO SOLAR</span>
            <span className="text-2xl font-black tracking-tighter cursor-default">LONGi</span>
            <span className="text-2xl font-black tracking-tighter cursor-default">GROWATT</span>
            <span className="text-2xl font-black tracking-tighter cursor-default">DEYE</span>
            <span className="text-2xl font-black tracking-tighter cursor-default">CANADIAN</span>
          </div>
        </div>
      </section>

     {/* 6. PRODUCT CATEGORIES - CHỮ ĐÃ NHỎ XUỐNG VÀ SIẾT KHOẢNG CÁCH */}
      <section className="py-12 bg-white"> 
        <div className="max-w-7xl mx-auto px-6 space-y-12"> 
          
          {PRODUCT_CATEGORIES.map((category) => (
            <div key={category.id} className="space-y-6"> 
              
              <div className="flex justify-between items-end border-l-4 border-orange-600 pl-6">
                <div>
                  {/* GIẢM CHỮ TIÊU ĐỀ XUỐNG text-xl */}
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">{category.title}</h2>
                  {/* GIẢM CHỮ MÔ TẢ XUỐNG text-xs */}
                  <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{category.description}</p>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-400 hover:text-orange-600 transition-colors tracking-widest border-b border-slate-200 hover:border-orange-600 pb-1">
                  Xem tất cả <ChevronRight size={12} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.products.map((product) => (
                  <div key={product.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-[0_20px_30px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 flex flex-col cursor-pointer">
                    <div className="relative aspect-square overflow-hidden bg-slate-50">
                      <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <ShoppingBag size={18} className="text-orange-600" />
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest mb-1">{product.brand}</span>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug mb-3 group-hover:text-orange-600 transition-colors">{product.name}</h3>
                      <div className="mt-auto pt-3 border-t border-slate-50 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 italic">{product.price}</span>
                        <button className="text-[9px] font-bold uppercase text-slate-900 group-hover:text-orange-600 transition-colors">Chi tiết</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </section>
      {/* 7. FOOTER CHUYÊN NGHIỆP - SỬ DỤNG SVG ĐỂ FIX LỖI IMPORT */}
      <footer className="bg-[#0f172a] text-slate-400 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-3 rounded-lg inline-block">
                <Image src="/images/logo.png" alt="Alpha Vietnam" width={180} height={45} className="object-contain" />
              </div>
              <p className="text-sm leading-relaxed max-w-sm">
                CÔNG TY TNHH ĐẦU TƯ VÀ CÔNG NGHỆ ALPHA VIỆT NAM — Nhà cung cấp giải pháp năng lượng mặt trời chuyên nghiệp và đối tác ủy quyền Tier 1.
              </p>
              <div className="flex gap-3 pt-2">
                {/* Dùng mã SVG trực tiếp cho Facebook, Linkedin, Youtube */}
                <a href="#" className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.45 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-300">
                   <span className="text-[10px] font-bold">Zalo</span>
                </a>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <h4 className="text-white font-bold uppercase tracking-widest text-sm border-b border-orange-600/30 pb-2">Sản phẩm</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Pin mặt trời</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Biến tần Inverter</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Ắc quy Lithium</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Đèn mặt trời</a></li>
              </ul>
            </div>
            <div className="lg:col-span-3 space-y-6">
              <h4 className="text-white font-bold uppercase tracking-widest text-sm border-b border-orange-600/30 pb-2">Thông tin</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Dự án tiêu biểu</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Tin tức kỹ thuật</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Chính sách bảo hành</a></li>
              </ul>
            </div>
            <div className="lg:col-span-3 space-y-6">
              <h4 className="text-white font-bold uppercase tracking-widest text-sm border-b border-orange-600/30 pb-2">Liên hệ</h4>
              <ul className="space-y-5 text-sm">
                <li className="flex gap-3"><MapPin size={18} className="text-orange-600 shrink-0" /><span>A10 TT12 đường 19/5, Hà Đông, Hà Nội</span></li>
                <li className="flex gap-3"><Phone size={18} className="text-orange-600 shrink-0" /><span>0968 060 886</span></li>
                <li className="flex gap-3"><Mail size={18} className="text-orange-600 shrink-0" /><a href="mailto:contact@alpha-vn.com" className="hover:text-orange-500">contact@alpha-vn.com</a></li>
                <li className="flex gap-3 italic"><Globe size={18} className="text-orange-600 shrink-0" /><span>alpha-vn.com</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50">
            <p>© 2026 Alpha Vietnam Investment and Technology. All rights reserved.</p>
            <div className="flex gap-6"><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a><a href="#" className="hover:text-white transition-colors">Sitemap</a></div>
          </div>
        </div>
      </footer>
    </div>
  );
}