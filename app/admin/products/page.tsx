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

export default function ProductManager() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState('')
  const [selCategory, setSelCategory] = useState('')
  const [selBrand, setSelBrand] = useState('')
  const [selStock, setSelStock] = useState('')
  const [selStatus, setSelStatus] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10
  const totalPages = Math.ceil(totalCount / pageSize)

  const fetchMetadata = async () => {
    const [catData, brandData] = await Promise.all([
      supabase.from('categories').select('id, name').eq('type', 'product'),
      supabase.from('brands').select('id, name').order('name')
    ])
    if (catData.data) setCategories(catData.data)
    if (brandData.data) setBrands(brandData.data)
  }

  const fetchProducts = async () => {
    setLoading(true)
    let query = supabase
      .from('products')
      .select('*, categories(name), brands(name)', { count: 'exact' })

    if (searchTerm) query = query.ilike('name', `%${searchTerm}%`)
    if (selCategory) query = query.eq('category_id', selCategory)
    if (selBrand) query = query.eq('brand_id', selBrand)
    if (selStock) query = query.eq('stock_status', selStock)
    if (selStatus) query = query.eq('status', selStatus)

    const from = (currentPage - 1) * pageSize
    const to = from + pageSize - 1

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (!error && data) {
      setProducts(data)
      if (count !== null) setTotalCount(count)
    }
    setLoading(false)
  }

  useEffect(() => { fetchMetadata() }, [])
  useEffect(() => { fetchProducts() }, [currentPage, selCategory, selBrand, selStock, selStatus])

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Xóa sản phẩm "${name}" không ông Tân?`)) {
      await supabase.from('products').delete().eq('id', id)
      fetchProducts()
    }
  }

  return (
    <div className={`${beVietnam.className} space-y-8 antialiased pb-20 p-8 bg-[#f8fafc] min-h-screen`}>
      {/* HEADER */}
      <div className="flex justify-between items-center max-w-[1440px] mx-auto">
        <div>
          <h1 className="text-3xl font-[900] text-slate-800 tracking-tighter uppercase italic text-orange-600">Sản phẩm</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 bg-white inline-block px-4 py-1.5 rounded-full shadow-sm border border-slate-100">
            Tổng số sản phẩm ({totalCount})
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/products/add')}
          className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-100 active:scale-95"
        >
          + Đăng sản phẩm mới
        </button>
      </div>

      {/* BỘ LỌC */}
      <div className="max-w-[1440px] mx-auto bg-white p-4 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 border border-white">
        <form onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); fetchProducts(); }} className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="Tìm tên sản phẩm..."
            className="px-6 py-4 bg-slate-50 border-none rounded-[1.5rem] outline-none font-bold text-sm focus:ring-2 focus:ring-blue-100 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select className="px-5 py-4 bg-slate-50 border-none rounded-[1.5rem] outline-none font-bold text-[11px] uppercase cursor-pointer" value={selCategory} onChange={(e) => { setSelCategory(e.target.value); setCurrentPage(1); }}>
            <option value="">Chuyên mục</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="px-5 py-4 bg-slate-50 border-none rounded-[1.5rem] outline-none font-bold text-[11px] uppercase cursor-pointer" value={selBrand} onChange={(e) => { setSelBrand(e.target.value); setCurrentPage(1); }}>
            <option value="">Hãng sản xuất</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>

          <select className="px-5 py-4 bg-slate-50 border-none rounded-[1.5rem] outline-none font-bold text-[11px] uppercase cursor-pointer" value={selStock} onChange={(e) => { setSelStock(e.target.value); setCurrentPage(1); }}>
            <option value="">Kho hàng</option>
            <option value="instock">Còn hàng</option>
            <option value="outstock">Hết hàng</option>
          </select>

          <select className="px-5 py-4 bg-slate-50 border-none rounded-[1.5rem] outline-none font-bold text-[11px] uppercase cursor-pointer" value={selStatus} onChange={(e) => { setSelStatus(e.target.value); setCurrentPage(1); }}>
            <option value="">Trạng thái</option>
            <option value="published">Công khai</option>
            <option value="draft">Bản nháp</option>
          </select>
          <button type="submit" className="bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase hover:bg-blue-600 transition shadow-lg tracking-widest">
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* LƯỚI DỮ LIỆU */}
      <div className="max-w-[1440px] mx-auto bg-white rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] border border-white overflow-hidden">
        <table className="w-full text-left table-fixed border-collapse">
          <thead className="bg-[#f8fafc] border-b border-slate-100">
            <tr>
              <th className="py-10 px-8 text-[11px] font-[900] text-slate-400 uppercase tracking-[0.2em] text-left whitespace-nowrap w-[35%]">Sản phẩm & Hãng</th>
              <th className="py-10 px-4 text-[11px] font-[900] text-slate-400 uppercase tracking-[0.2em] text-left whitespace-nowrap w-[15%]">Chuyên mục</th>
              <th className="py-10 px-4 text-[11px] font-[900] text-slate-400 uppercase tracking-[0.2em] text-left whitespace-nowrap w-[15%]">Kho hàng</th>
              <th className="py-10 px-4 text-[11px] font-[900] text-slate-400 uppercase tracking-[0.2em] text-left whitespace-nowrap w-[15%]">Trạng thái</th>
              <th className="py-10 px-8 text-[11px] font-[900] text-slate-400 uppercase tracking-[0.2em] text-left whitespace-nowrap w-[20%]">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {!loading && products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/40 transition-all group text-left">
                <td className="py-8 px-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex-shrink-0 flex items-center justify-center p-1 shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                      {product.image_url ? (
                        <img src={product.image_url} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[8px] font-black text-slate-200 uppercase">Logo</span>
                      )}
                    </div>
                    <div className="min-w-0 pr-4">
                      <p className="font-[900] text-slate-800 text-sm leading-tight uppercase tracking-tight italic break-words">{product.name}</p>
                      <p className="text-[10px] text-blue-500 font-black mt-2 uppercase tracking-widest italic whitespace-nowrap">
                        {product.brands?.name || '---'} • {new Intl.NumberFormat('vi-VN').format(product.price)}đ
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-8 px-4 whitespace-nowrap">
                  <span className="text-[10px] font-black bg-slate-50 text-slate-500 px-4 py-2 rounded-xl border border-slate-100 uppercase tracking-widest">
                    {product.categories?.name || '---'}
                  </span>
                </td>
                <td className="py-8 px-4 whitespace-nowrap">
                  <span className={`text-[10px] font-black px-4 py-2 rounded-xl border uppercase tracking-widest inline-block ${product.stock_status === 'instock' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                    {product.stock_status === 'instock' ? '● CÒN HÀNG' : '○ HẾT HÀNG'}
                  </span>
                </td>
                <td className="py-8 px-4 whitespace-nowrap">
                  <span className={`text-[10px] font-black px-4 py-2 rounded-xl border uppercase tracking-widest inline-block ${product.status === 'published' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                    {product.status === 'published' ? 'CÔNG KHAI' : 'BẢN NHÁP'}
                  </span>
                </td>
                <td className="py-8 px-8 whitespace-nowrap">
                  <div className="flex items-center justify-start gap-6">
                    <Link href={`/admin/products/${product.id}`} className="text-blue-600 font-[900] text-[11px] uppercase tracking-widest hover:underline underline-offset-8 decoration-2">Sửa</Link>
                    <button onClick={() => handleDelete(product.id, product.name)} className="text-red-200 hover:text-red-600 font-[900] text-[11px] uppercase tracking-widest transition-colors">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PHÂN TRANG */}
        <div className="p-10 bg-[#f8fafc]/50 border-t border-slate-100 flex justify-between items-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
            Alpha System: <span className="text-slate-800 not-italic">{totalCount}</span> thiết bị
          </p>
          <div className="flex items-center gap-8">
            <p className="text-xs font-black text-blue-600 uppercase italic underline underline-offset-4">Trang {currentPage} / {totalPages || 1}</p>
            <div className="flex gap-4">
              <button disabled={currentPage === 1 || loading} onClick={() => setCurrentPage(p => p - 1)} className="px-10 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-[10px] font-black uppercase hover:bg-slate-100 transition shadow-sm active:scale-95">Trước</button>
              <button disabled={currentPage >= totalPages || loading} onClick={() => setCurrentPage(p => p + 1)} className="px-10 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-[10px] font-black uppercase hover:bg-slate-100 transition shadow-sm active:scale-95">Sau</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}