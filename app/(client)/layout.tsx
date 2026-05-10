// app/(client)/layout.tsx
import React from 'react';
import '@/app/globals.css'; // Sử dụng @ để đảm bảo tìm thấy file CSS dù layout nằm sâu trong thư mục (client)
import Header from '@/components/header';
import Footer from '@/components/footer';

export const metadata = {
  title: 'Alpha Vietnam - Giải pháp Năng lượng Mặt trời Chuyên nghiệp',
  description: 'Nhà cung cấp tấm pin Jinko Solar, LONGi Solar và Biến tần Inverter chính hãng. Giải pháp năng lượng sạch tối ưu cho doanh nghiệp và hộ gia đình.',
  keywords: ['Alpha Vietnam', 'Pin mặt trời Jinko', 'LONGi Solar', 'Inverter Deye', 'Inverter Growatt', 'Năng lượng mặt trời Hà Nội'],
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Menu chính xuất hiện ở tất cả các trang thuộc nhóm (client) */}
      <Header />
      
      {/* Nội dung thay đổi của từng trang (Trang chủ, Sản phẩm, Tin tức...) */}
      <main className="flex-grow selection:bg-orange-100 selection:text-orange-600">
        {children}
      </main>
      
      {/* Chân trang xuất hiện ở tất cả các trang thuộc nhóm (client) */}
      <Footer />
    </div>
  );
}