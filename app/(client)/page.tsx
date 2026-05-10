// app/(client)/page.tsx
import React from 'react';
import { 
  Sun, ChevronRight, ArrowUpRight, MoveUpRight, ShoppingBag 
} from 'lucide-react';

export default function AlphaSolarHomepage() {
  // Dữ liệu mẫu giả lập từ Cơ sở dữ liệu cho 4 chuyên mục
  const MOCK_DB_DATA = [
    {
          category: "Pin năng lượng mặt trời",
          description: "Các dòng tấm pin hiệu suất cao Tier 1 từ Jinko Solar và LONGi Solar",
          products: [
            { id: 1, name: "Tấm pin Jinko Tiger Neo N-type 580W", price: "2.850.000", img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800" },
            { id: 2, name: "Tấm pin LONGi Hi-MO 6 Explorer 575W", price: "2.790.000", img: "https://images.unsplash.com/photo-1615630859219-0459703c34e6??auto=format&fit=crop&w=800" },
            { id: 3, name: "Pin Canadian Solar HiKu6 550W Mono", price: "2.650.000", img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800" },
            { id: 4, name: "Pin Trina Solar Vertex N-type 600W", price: "2.950.000", img: "https://images.unsplash.com/photo-1548337138-e87d889cc369?auto=format&fit=crop&w=800" },
          ]
        },
        {
          category: "Biến tần Inverter",
          description: "Hệ thống Inverter Hybrid và Hòa lưới từ các thương hiệu Tier 1",
          products: [
            { id: 5, name: "Inverter Hybrid Deye 5kW 1 Pha", price: "24.500.000", img: "https://images.unsplash.com/photo-1548337138-e87d889cc369?auto=format&fit=crop&w=800" },
            { id: 6, name: "Inverter Hòa lưới Growatt 10kW", price: "18.200.000", img: "https://images.unsplash.com/photo-1615630859219-0459703c34e6??auto=format&fit=crop&w=800" },
            { id: 7, name: "Inverter Hybrid Luxpower SNA 5kW", price: "16.800.000", img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800" },
            { id: 8, name: "Inverter GoodWe 5kW Hòa lưới", price: "12.500.000", img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800" },
          ]
        },
        {
          category: "Đèn năng lượng mặt trời",
          description: "Giải pháp chiếu sáng thông minh tiết kiệm điện năng cho đô thị",
          products: [
{ id: 9, name: "Đèn đường Solar UFO 500W Cao cấp", price: "850.000", img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800" },
{ id: 10, name: "Đèn pha Solar Light 200W Chống nước", price: "1.150.000", img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800" },
{ id: 11, name: "Đèn bàn chải Solar Street Light 300W", price: "1.450.000", img: "https://images.unsplash.com/photo-1615630859219-0459703c34e6??auto=format&fit=crop&w=800" },
{ id: 12, name: "Đèn treo tường cảm biến chuyển động", price: "290.000", img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800" }
          ]
        },
        {
          category: "Phụ kiện Solar",
          description: "Vật tư lắp đặt chuyên dụng đạt chuẩn kỹ thuật quốc tế",
          products: [
            { id: 13, name: "Cáp điện DC 4.0mm2 chuyên dụng Solar", price: "15.000", img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800" },
            { id: 14, name: "Jack kết nối MC4 chống nước IP67", price: "25.000", img: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800" },
            { id: 15, name: "Thanh ray nhôm AL6005-T5 áp mái", price: "185.000", img: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800" },
            { id: 16, name: "Tủ điện bảo vệ Solar 4-Way AC/DC", price: "1.250.000", img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800" },
          ]
        }
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-orange-100 selection:text-orange-600">
      
      {/* 4. HERO SECTION - Đã thu nhỏ pb-4 để xóa khoảng trống thừa */}
      <section className="relative pt-0 pb-4 px-6 bg-[#fbfbfb] border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Cột chữ bên trái (5 phần) */}
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

          {/* Cột ảnh bên phải (5 phần) */}
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

{/* ĐỐI TÁC CHIẾN LƯỢC - Đã sửa pb-6 để thu nhỏ khoảng cách với Sản phẩm */}
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

      {/* 5. PRODUCT CATEGORIES - Danh mục giải pháp */}
<section className="pt-12 pb-6 bg-white border-b border-slate-50">
  <div className="max-w-7xl mx-auto">
    {(() => {
      return MOCK_DB_DATA.map((section, idx) => (
        /* ĐÃ SỬA: Thay mb-20 thành mb-10 để thu nhỏ khoảng trống giữa các chuyên mục */
        <div key={idx} className="mb-10 last:mb-0">
          {/* Header chuyên mục */}
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

          {/* Grid sản phẩm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {section.products.map((product) => (
              <div key={product.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-square overflow-hidden bg-slate-50">
                  <img 
                    src={product.img} 
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
                      {product.price}<span className="text-[10px] ml-1 font-bold uppercase tracking-tighter">VNĐ</span>
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
      ));
    })()}
  </div>
</section>
    </div>
  );
}