// components/footer.tsx
import React from 'react';
import Image from 'next/image';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a1120] text-slate-400 pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* CỘT 1: LOGO & GIỚI THIỆU */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-3 rounded-xl inline-block shadow-lg">
              <Image 
                src="/images/logo.png" 
                alt="Alpha Vietnam" 
                width={160} 
                height={40} 
                className="object-contain" 
              />
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              CÔNG TY TNHH ĐẦU TƯ VÀ CÔNG NGHỆ ALPHA VIỆT NAM — Nhà cung cấp giải pháp năng lượng mặt trời chuyên nghiệp và đối tác ủy quyền Tier 1.
            </p>
            
            {/* SOCIAL ICONS - Dùng SVG để tránh lỗi thư viện */}
            <div className="flex gap-3">
              {/* Facebook */}
              <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              {/* Youtube */}
              <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
              </a>
              {/* Zalo */}
              <a href="#" className="w-12 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-300">
                <span className="text-[10px] font-bold uppercase">Zalo</span>
              </a>
            </div>
          </div>

          {/* CỘT 2: SẢN PHẨM */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-white font-bold uppercase tracking-wider text-sm relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-[1px] after:bg-orange-600/50">
              SẢN PHẨM
            </h4>
            <ul className="space-y-4 text-sm mt-8">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Pin mặt trời</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Biến tần Inverter</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Ắc quy Lithium</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Đèn mặt trời</a></li>
            </ul>
          </div>

          {/* CỘT 3: THÔNG TIN */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-white font-bold uppercase tracking-wider text-sm relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-[1px] after:bg-orange-600/50">
              THÔNG TIN
            </h4>
            <ul className="space-y-4 text-sm mt-8">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Dự án tiêu biểu</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Tin tức kỹ thuật</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Chính sách bảo hành</a></li>
            </ul>
          </div>

          {/* CỘT 4: LIÊN HỆ */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-white font-bold uppercase tracking-wider text-sm relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-[1px] after:bg-orange-600/50">
              LIÊN HỆ
            </h4>
            <ul className="space-y-5 text-sm mt-8">
              <li className="flex gap-4">
                <MapPin size={18} className="text-orange-600 shrink-0 mt-1" />
                <span className="leading-relaxed text-slate-300">A10 TT12 đường 19/5, Hà Đông, Hà Nội</span>
              </li>
              <li className="flex gap-4">
                <Phone size={18} className="text-orange-600 shrink-0" />
                <span className="text-slate-300">0968 060 886</span>
              </li>
              <li className="flex gap-4">
                <Mail size={18} className="text-orange-600 shrink-0" />
                <a href="mailto:contact@alpha-vn.com" className="hover:text-orange-500 transition-colors text-slate-300">contact@alpha-vn.com</a>
              </li>
              <li className="flex gap-4">
                <Globe size={18} className="text-orange-600 shrink-0" />
                <a href="https://alpha-vn.com" target="_blank" className="hover:text-orange-500 transition-colors text-slate-300">alpha-vn.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* COPYRIGHT & LINKS PHỤ */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
          <p>© 2026 Alpha Vietnam Investment and Technology. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}