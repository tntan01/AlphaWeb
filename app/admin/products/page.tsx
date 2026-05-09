'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Be_Vietnam_Pro } from 'next/font/google'

const beVietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ProductManager() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // --- BỘ LỌC ĐA TIÊU CHÍ ---
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStock, setFilterStock] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  
  // --- PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 10
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  // 1. Lấy danh sách chuyên mục cho bộ lọc
  useEffect(() => {
    const fetchCats = async () => {
      const { data } = await supabase.from('categories').select('*').eq('type', 'product')
      if (data) setCategories(data)
    }
    fetchCats()
  }, [])

  // 2. Hàm lấy dữ liệu sản phẩm kèm bộ lọc
  const fetchProducts = async () => {
    setLoading(true)
    const from = (currentPage - 1) * itemsPerPage
    const to = from + itemsPerPage - 1

    let query = supabase
      .from('products')
      .select('*, categories(name)', { count: 'exact' })

    if (searchQuery) query = query.ilike('name', `%${searchQuery}%`)
    if (filterCategory !== 'all') query = query.eq('category_id', filterCategory)
    if (filterStock !== 'all') query = query.eq('stock_status', filterStock)
    if (filterStatus !== 'all') query = query.eq('status', filterStatus)

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (!error) {
      setProducts(data || [])
      setTotalCount(count || 0)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [currentPage, filterCategory, filterStock, filterStatus])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts()
  }

  return (
    <div className={`${beVietnam.className} space-y-8 antialiased pb-20`}>
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">Sản phẩm Alpha</h1>
          <p className="text-slate-400 text-[10px] font-black mt-2 uppercase tracking-widest bg-slate-100 inline-block px-3 py-1 rounded-full">
             Kết quả: {totalCount} thiết bị
          </p>
        </div>
        <Link href="/admin/products/add" className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition active:scale-95 text-xs uppercase tracking-widest">
          + Đăng sản phẩm
        </Link>
      </div>

      {/* --- THANH TÌM KIẾM VÀ BỘ LỌC ĐA TIÊU CHÍ --- */}
      <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">🔍</span>
            <input 
              type="text"
              placeholder="Tìm theo tên thiết bị (VD: Apollo, Inverter...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-slate-700 transition-all"
            />
          </div>
          <button type="submit" className="px-10 py-4 bg-slate-800 text-white rounded-xl font-black text-xs uppercase hover:bg-slate-900 transition-all">Tìm kiếm</button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Chuyên mục</label>
            <select value={filterCategory} onChange={e => {setFilterCategory(e.target.value); setCurrentPage(1)}} className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold outline-none cursor-pointer">
              <option value="all">TẤT CẢ CHUYÊN MỤC</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Kho hàng</label>
            <select value={filterStock} onChange={e => {setFilterStock(e.target.value); setCurrentPage(1)}} className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold outline-none cursor-pointer">
              <option value="all">TẤT CẢ TÌNH TRẠNG</option>
              <option value="instock">🟢 CÒN HÀNG</option>
              <option value="outstock">🔴 HẾT HÀNG</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Trạng thái web</label>
            <select value={filterStatus} onChange={e => {setFilterStatus(e.target.value); setCurrentPage(1)}} className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold outline-none cursor-pointer">
              <option value="all">TẤT CẢ TRẠNG THÁI</option>
              <option value="published">CÔNG KHAI</option>
              <option value="draft">BẢN NHÁP</option>
            </select>
          </div>
        </div>
      </div>

      {/* BẢNG DANH SÁCH */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sản phẩm Alpha</th>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá niêm yết</th>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Quản lý</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={4} className="p-24 text-center animate-pulse font-black text-slate-300 uppercase text-xs">Truy xuất dữ liệu Alpha...</td></tr>
            ) : products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-8 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-[1.25rem] bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0">
                      {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-300 font-black">NULL</div>}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-lg leading-tight line-clamp-2">{p.name}</p>
                      <p className="text-[10px] text-blue-500 font-black uppercase mt-1 bg-blue-50 inline-block px-2 py-0.5 rounded">{p.categories?.name || 'Sản phẩm'}</p>
                    </div>
                  </td>
                  <td className="p-8 font-black text-slate-900 text-lg">{new Intl.NumberFormat('vi-VN').format(p.price)}đ</td>
                  <td className="p-8 text-center space-y-2">
                    <div className={`text-[9px] font-black px-3 py-1 rounded-full inline-block ${p.stock_status === 'instock' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {p.stock_status === 'instock' ? '🟢 CÒN HÀNG' : '🔴 HẾT HÀNG'}
                    </div>
                    <br/>
                    <div className={`text-[8px] font-black px-2 py-0.5 rounded-md inline-block uppercase tracking-widest ${p.status === 'published' ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-slate-400'}`}>
                      {p.status === 'published' ? 'Công khai' : 'Bản nháp'}
                    </div>
                  </td>
                  <td className="p-8 text-right space-x-6">
                    <Link href={`/admin/products/${p.id}`} className="text-blue-600 font-black text-xs uppercase hover:underline">Sửa</Link>
                    <button className="text-red-300 hover:text-red-600 font-black text-xs uppercase transition-colors">Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="p-24 text-center text-slate-400 text-xs font-black uppercase italic">Không tìm thấy sản phẩm Alpha nào...</td></tr>
            )}
          </tbody>
        </table>

        {/* PHÂN TRANG - ĐÃ CẬP NHẬT VỊ TRÍ THEO MẪU */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Hiển thị {products.length} / {totalCount} sản phẩm
          </p>
          
          <div className="flex items-center gap-6">
            <p className="text-xs font-black text-blue-600 uppercase tracking-tighter">
              Trang {currentPage} / {totalPages || 1}
            </p>
            
            <div className="flex gap-3">
              <button 
                disabled={currentPage === 1 || loading} 
                onClick={() => setCurrentPage(prev => prev - 1)} 
                className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase hover:bg-slate-100 disabled:opacity-20 transition shadow-sm active:scale-95"
              >
                Trước
              </button>
              <button 
                disabled={currentPage === totalPages || loading || totalCount === 0} 
                onClick={() => setCurrentPage(prev => prev + 1)} 
                className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase hover:bg-slate-100 disabled:opacity-20 transition shadow-sm active:scale-95"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}