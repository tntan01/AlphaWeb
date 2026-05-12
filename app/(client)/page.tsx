// app/(client)/page.tsx
import React from 'react';
import {
  Sun, ChevronRight, ArrowUpRight, MoveUpRight, ShoppingBag
} from 'lucide-react';
// Import từ thư viện gốc như bạn đã thay đổi
import { createClient } from '@supabase/supabase-js';

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU ---
interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

interface CategorySection {
  category: string;
  description: string;
  products: Product[];
}

export default async function AlphaSolarHomepage() {
  // KHẮC PHỤC LỖI: Truyền URL và Key từ biến môi trường vào hàm khởi tạo
  // Bỏ 'await' vì createClient từ thư viện gốc là hàm đồng bộ
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // --- TRUY VẤN DỮ LIỆU TỪ DATABASE THEO YÊU CẦU ---

  // 1. Tìm ID của category cha có slug là 'san-pham'
  const { data: parentCat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'san-pham')
    .single();

  let displayData: CategorySection[] = [];

  if (parentCat) {
    // 2. Lấy các danh mục con và sản phẩm thỏa mãn điều kiện show_on_homepage = true
    const { data: categoriesWithProducts } = await supabase
      .from('categories')
      .select(`
        name,
        description,
        products (
          id,
          name,
          price,
          image_url,
          show_on_homepage
        )
      `)
      .eq('parent_id', parentCat.id)
      .eq('type', 'product')
      .eq('products.show_on_homepage', true); // Lọc sản phẩm hiển thị trang chủ

    if (categoriesWithProducts) {
      displayData = categoriesWithProducts.map((item: any) => ({
        category: item.name,
        description: item.description || '',
        // 3. Sắp xếp theo tên và lấy tối đa 4 sản phẩm mỗi loại
        products: (item.products || [])
          .sort((a: any, b: any) => a.name.localeCompare(b.name))
          .slice(0, 4)
      }));
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <div className="min-h-screen bg-white selection:bg-orange-100 selection:text-orange-600">

      {/* 4. HERO SECTION - GIỮ NGUYÊN GIAO DIỆN */}
      <section className="relative pt-0 pb-4 px-6 bg-[#fbfbfb] border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          <div className="space-y-10 pt-6 pb-6 lg:pb-10">
            <div>
              <span className="inline-block text-[10px] font-bold text-orange-700 bg-orange-100/50 px-3 py-1 rounded mb-6 uppercase tracking-[0.15em]">
                Alpha Vietnam Investment and Technology
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.2] mb-6 tracking-tight">
                Năng lượng <br />
                <span className="text-orange-600">Sạch & Thông minh</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">
                Giải pháp năng lượng mặt trời toàn diện cho doanh nghiệp và hộ gia đình: Chuyên phân phối Pin Jinko, LONGi, hệ thống Inverter Hybrid, ắc quy lưu trữ và dịch vụ kỹ thuật chuyên nghiệp.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-8">
              <button className="bg-orange-600 text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-900 transition-all duration-300 shadow-lg shadow-orange-200 flex items-center gap-3 group">
                XEM SẢN PHẨM <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a href="#" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-orange-600 transition-colors group">
                YÊU CẦU LẮP ĐẶT <MoveUpRight size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          <div className="relative pt-6 pb-6 lg:pb-10">
            <div className="relative aspect-[4/3] rounded-[2rem] bg-slate-200 overflow-hidden shadow-2xl border-[6px] border-white ring-1 ring-slate-100">
              <img
                src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1200"
                alt="Alpha Solar Project"
                className="w-full h-full object-cover opacity-95"
              />
            </div>

            <div className="absolute bottom-16 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-4 hidden md:flex">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                <Sun size={24} />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 leading-none tracking-tight">30MW+</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-1.5">CÔNG SUẤT DỰ KIẾN 2026</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ĐỐI TÁC CHIẾN LƯỢC */}
      <section className="pt-12 pb-6 bg-white border-b border-slate-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-12">
            ĐỐI TÁC CHIẾN LƯỢC & THƯƠNG HIỆU PHÂN PHỐI
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-x-12 lg:gap-x-20 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {["JINKO SOLAR", "LONGi", "GROWATT", "DEYE", "CANADIAN"].map((brand) => (
              <span key={brand} className="text-xl md:text-2xl font-black text-slate-400 tracking-tighter">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRODUCT CATEGORIES - HIỂN THỊ DỮ LIỆU ĐỘNG */}
      <section className="pt-12 pb-6 bg-white border-b border-slate-50">
        <div className="max-w-7xl mx-auto">
          {displayData.length > 0 ? (
            displayData.map((section, idx) => (
              <div key={idx} className="mb-10 last:mb-0">
                <div className="flex justify-between items-end mb-10">
                  <div className="max-w-xl flex items-center gap-4">
                    <div className="h-10 w-1 bg-orange-600 rounded-full"></div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900 uppercase tracking-tight">{section.category}</h2>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{section.description}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-orange-600 transition-all underline decoration-slate-200 underline-offset-8">
                    Xem tất cả <ChevronRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {section.products.map((product) => (
                    <div key={product.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                      <div className="relative aspect-square overflow-hidden bg-slate-50">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-95"
                        />
                        <div className="absolute top-4 right-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <button className="bg-white p-3 rounded-xl shadow-lg text-slate-900 hover:bg-orange-600 hover:text-white transition-colors">
                            <ShoppingBag size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-orange-600 transition-colors text-sm">
                          {product.name}
                        </h3>
                        <div className="flex justify-between items-center mt-4 border-t border-slate-50 pt-4">
                          <div className="text-orange-600 font-black text-lg">
                            {formatPrice(product.price)}
                            <span className="text-[10px] ml-1 font-bold uppercase tracking-tighter">VNĐ</span>
                          </div>
                          <a
                            href={`/san-pham/${product.id}`}
                            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                          >
                            Chi tiết
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-slate-400 font-medium">
              Không tìm thấy sản phẩm nào hoặc chưa có dữ liệu...
            </div>
          )}
        </div>
      </section>
    </div>
  );
}