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

export default function PostManager() {
  const [posts, setPosts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Trạng thái lọc
  const [searchTerm, setSearchTerm] = useState('')
  const [selCategory, setSelCategory] = useState('')
  const [selStatus, setSelStatus] = useState('')
  
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10 
  const totalPages = Math.ceil(totalCount / pageSize)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name').eq('type', 'post')
    if (data) setCategories(data)
  }

  const fetchPosts = async () => {
    setLoading(true)
    let query = supabase
      .from('posts')
      .select('*, categories(name)', { count: 'exact' })

    if (searchTerm) query = query.ilike('title', `%${searchTerm}%`)
    if (selCategory) query = query.eq('category_id', selCategory)
    if (selStatus) query = query.eq('status', selStatus)

    const from = (currentPage - 1) * pageSize
    const to = from + pageSize - 1
    
    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (data) {
      setPosts(data)
      if (count !== null) setTotalCount(count)
    }
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [])
  useEffect(() => { fetchPosts() }, [currentPage, selCategory, selStatus])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) 
    fetchPosts()
  }

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Xóa bài "${title}" không ông Tân?`)) {
      await supabase.from('posts').delete().eq('id', id)
      fetchPosts()
    }
  }

  return (
    <div className={`${beVietnam.className} space-y-6 antialiased pb-20`}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Quản trị Tin tức</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Alpha Vietnam Content Management</p>
        </div>
        <button 
          onClick={() => router.push('/admin/posts/add')}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-100"
        >
          + Viết bài mới
        </button>
      </div>

      {/* BỘ LỌC */}
      <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="text" 
            placeholder="Tìm theo tiêu đề..." 
            className="p-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="p-4 bg-slate-50 border-none rounded-xl outline-none font-bold text-xs uppercase cursor-pointer"
            value={selCategory}
            onChange={(e) => { setSelCategory(e.target.value); setCurrentPage(1); }}
          >
            <option value="">Tất cả chuyên mục</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select 
            className="p-4 bg-slate-50 border-none rounded-xl outline-none font-bold text-xs uppercase cursor-pointer"
            value={selStatus}
            onChange={(e) => { setSelStatus(e.target.value); setCurrentPage(1); }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="published">Công khai</option>
            <option value="draft">Bản nháp</option>
          </select>
          <button type="submit" className="bg-slate-800 text-white rounded-xl font-black text-xs uppercase hover:bg-slate-900 transition tracking-widest shadow-lg">
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* DANH SÁCH */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiêu đề bài viết</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Chuyên mục</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={4} className="p-20 text-center font-black text-slate-300 animate-pulse text-xs uppercase">Đang tải dữ liệu...</td></tr>
            ) : posts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-6">
                  <p className="font-black text-slate-800 text-base leading-tight line-clamp-1">{post.title}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter italic">Ngày đăng: {new Date(post.created_at).toLocaleDateString('vi-VN')}</p>
                </td>
                <td className="p-6">
                  <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-lg uppercase tracking-tighter">
                    {post.categories?.name || 'Tin tức'}
                  </span>
                </td>
                <td className="p-6 text-center">
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${
                    post.status === 'published' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                  }`}>
                    {post.status === 'published' ? '● CÔNG KHAI' : '○ BẢN NHÁP'}
                  </span>
                </td>
                <td className="p-6 text-right space-x-4">
                  <Link href={`/admin/posts/${post.id}`} className="text-blue-600 font-black text-[10px] uppercase hover:underline">Sửa</Link>
                  <button onClick={() => handleDelete(post.id, post.title)} className="text-red-300 hover:text-red-600 font-black text-[10px] uppercase transition-colors">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PHÂN TRANG - ĐÃ CẬP NHẬT VỊ TRÍ */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Bên trái: Tổng số lượng */}
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Hiển thị {posts.length} / {totalCount} bài viết
          </p>
          
          {/* Bên phải: Trang hiện tại + Nút điều hướng */}
          <div className="flex items-center gap-6">
            <p className="text-xs font-black text-blue-600 uppercase tracking-tighter">
              Trang {currentPage} / {totalPages || 1}
            </p>
            
            <div className="flex gap-3">
              <button 
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase hover:bg-slate-100 disabled:opacity-20 transition shadow-sm active:scale-95"
              >
                Trước
              </button>
              <button 
                disabled={currentPage >= totalPages || loading}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase hover:bg-slate-100 disabled:opacity-20 transition shadow-sm active:scale-95"
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