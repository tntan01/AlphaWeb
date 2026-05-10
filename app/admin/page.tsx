'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Be_Vietnam_Pro } from 'next/font/google'
import Link from 'next/link'

const beVietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '700', '900'],
  display: 'swap',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // State thống kê
  const [pendingCount, setPendingCount] = useState(0)
  const [counts, setCounts] = useState({
    products: 0,
    brands: 0,
    posts: 0
  })

  useEffect(() => {
    const fetchAllStats = async () => {
      setLoading(true)

      // Chạy song song các query để tối ưu tốc độ
      const [ordersRes, productsRes, brandsRes, postsRes] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('brands').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true })
      ])

      if (ordersRes.count !== null) setPendingCount(ordersRes.count)

      setCounts({
        products: productsRes.count || 0,
        brands: brandsRes.count || 0,
        posts: postsRes.count || 0
      })

      setLoading(false)
    }

    fetchAllStats()
  }, [])

  return (
    <div className={`${beVietnam.className} space-y-10 antialiased pb-20`}>
      {/* 1. CHÀO MỪNG */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter italic">Chào mừng trở lại!</h1>
          <p className="text-slate-400 text-sm font-bold mt-1 uppercase tracking-widest">Hệ thống quản trị Alpha Vietnam Investment and Technology</p>
        </div>
      </header>

      {/* 2. KHU VỰC THỐNG KÊ "NÓNG" - GIỮ NGUYÊN TÍNH NĂNG ĐƠN HÀNG */}
      <div className="bg-white p-1 rounded-[3rem] shadow-2xl shadow-orange-100 border border-orange-50 overflow-hidden">
        <div className="bg-gradient-to-br from-orange-50 to-white p-10 rounded-[2.8rem] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-4xl shadow-xl shadow-orange-200 animate-pulse">
              ⏳
            </div>
            <div>
              <p className="text-orange-600 font-black uppercase text-xs tracking-widest mb-1">Đơn hàng chưa xử lý</p>
              <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic">
                {loading ? '...' : pendingCount} <span className="text-2xl text-slate-400">Đơn</span>
              </h2>
            </div>
          </div>
          <Link
            href="/admin/orders?status=pending"
            className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl active:scale-95"
          >
            Xử lý ngay
          </Link>
        </div>
      </div>

      {/* 3. TRUY CẬP NHANH & THỐNG KÊ CHI TIẾT */}
      <div className="space-y-6">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic">⚡ Thống kê & Truy cập nhanh</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Thẻ: Sản phẩm */}
          <Link href="/admin/products" className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-100 hover:shadow-2xl hover:border-blue-100 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition duration-500">📦</div>
              <span className="text-2xl font-black text-blue-600 italic tracking-tighter">{loading ? '..' : counts.products}</span>
            </div>
            <p className="font-black text-slate-800 uppercase text-xs tracking-widest">Sản phẩm Alpha</p>
            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase italic">Solar, Inverter, Apollo...</p>
          </Link>

          {/* Thẻ: Hãng sản xuất (MỚI THÊM) */}
          <Link href="/admin/brands" className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-100 hover:shadow-2xl hover:border-amber-100 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition duration-500">🏷️</div>
              <span className="text-2xl font-black text-amber-600 italic tracking-tighter">{loading ? '..' : counts.brands}</span>
            </div>
            <p className="font-black text-slate-800 uppercase text-xs tracking-widest">Hãng sản xuất</p>
            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase italic">Đối tác & Thương hiệu</p>
          </Link>

          {/* Thẻ: Tin tức */}
          <Link href="/admin/posts" className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-100 hover:shadow-2xl hover:border-purple-100 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition duration-500">📝</div>
              <span className="text-2xl font-black text-purple-600 italic tracking-tighter">{loading ? '..' : counts.posts}</span>
            </div>
            <p className="font-black text-slate-800 uppercase text-xs tracking-widest">Tin tức & Dự án</p>
            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase italic">Kỹ thuật & Xu hướng</p>
          </Link>

          {/* Thẻ: Cài đặt hệ thống */}
          <Link href="/admin/users" className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-100 hover:shadow-2xl hover:border-slate-200 transition-all group">
            <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition duration-500">👥</div>
            <p className="font-black text-slate-800 uppercase text-xs tracking-widest">Nhân sự Alpha</p>
            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase italic">Tài khoản & Phân quyền</p>
          </Link>
        </div>
      </div>
    </div>
  )
}