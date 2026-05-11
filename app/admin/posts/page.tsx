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

export default function PostManager() {
  const [posts, setPosts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState('')
  const [selCategory, setSelCategory] = useState('')
  const [selStatus, setSelStatus] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10
  const totalPages = Math.ceil(totalCount / pageSize)

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

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Xóa bài "${title}" không ông Tân?`)) {
      await supabase.from('posts').delete().eq('id', id)
      fetchPosts()
    }
  }

  return (
    <div className={`${beVietnam.className} space-y-8 antialiased pb-20 p-8 bg-[#f8fafc] min-h-screen`}>
      {/* HEADER */}
      <div className="flex justify-between items-center max-w-[1440px] mx-auto">
        <div>
          {/* Yêu cầu 1: Giảm kích thước tiêu đề từ text-5xl xuống text-3xl */}
          <h1 className="text-3xl font-[900] text-slate-800 tracking-tighter uppercase italic">Tin tức <span className="text-blue-600">Alpha</span></h1>

          {/* Yêu cầu 2: Đổi Content Management System sang Bài viết */}
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 bg-white inline-block px-4 py-1.5 rounded-full shadow-sm border border-slate-100">
            Bài viết ({totalCount})
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/posts/add')}
          className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-100 active:scale-95"
        >
          + Viết bài mới
        </button>
      </div>

      {/* BỘ LỌC */}
      <div className="max-w-[1440px] mx-auto bg-white p-4 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 border border-white">
        <form onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); fetchPosts(); }} className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Tìm theo tiêu đề bài viết..."
            className="px-6 py-4 bg-slate-50 border-none rounded-[1.5rem] outline-none focus:ring-2 focus:ring-blue-100 font-bold text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select className="px-5 py-4 bg-slate-50 border-none rounded-[1.5rem] outline-none font-bold text-[11px] uppercase cursor-pointer" value={selCategory} onChange={(e) => { setSelCategory(e.target.value); setCurrentPage(1); }}>
            <option value="">Tất cả chuyên mục</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="px-5 py-4 bg-slate-50 border-none rounded-[1.5rem] outline-none font-bold text-[11px] uppercase cursor-pointer" value={selStatus} onChange={(e) => { setSelStatus(e.target.value); setCurrentPage(1); }}>
            <option value="">Tất cả trạng thái</option>
            <option value="published">Công khai</option>
            <option value="draft">Bản nháp</option>
          </select>
          <button type="submit" className="bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase hover:bg-blue-600 transition tracking-widest shadow-lg">
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* LƯỚI DỮ LIỆU TIN TỨC */}
      <div className="max-w-[1440px] mx-auto bg-white rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] border border-white overflow-hidden">
        <table className="w-full text-left table-fixed border-collapse">
          <thead className="bg-[#f8fafc] border-b border-slate-100">
            <tr>
              <th className="py-10 px-10 text-[11px] font-[900] text-slate-400 uppercase tracking-[0.2em] text-left w-[50%]">Tiêu đề bài viết</th>
              <th className="py-10 px-6 text-[11px] font-[900] text-slate-400 uppercase tracking-[0.2em] text-left whitespace-nowrap w-[15%]">Chuyên mục</th>
              <th className="py-10 px-6 text-[11px] font-[900] text-slate-400 uppercase tracking-[0.2em] text-left whitespace-nowrap w-[15%]">Trạng thái</th>
              <th className="py-10 px-10 text-[11px] font-[900] text-slate-400 uppercase tracking-[0.2em] text-left whitespace-nowrap w-[20%]">Quản lý</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={4} className="p-32 text-center font-[900] text-slate-300 animate-pulse text-xs uppercase tracking-widest">Đang truy xuất tin tức...</td></tr>
            ) : posts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50/40 transition-all group">
                <td className="py-10 px-10 text-left">
                  <p className="font-[900] text-slate-800 text-base leading-tight uppercase tracking-tight italic break-words">{post.title}</p>
                  <p className="text-[10px] text-blue-500 font-black mt-2 uppercase tracking-widest italic whitespace-nowrap">Ngày đăng: {new Date(post.created_at).toLocaleDateString('vi-VN')}</p>
                </td>
                <td className="py-10 px-6 text-left whitespace-nowrap">
                  <span className="text-[10px] font-black bg-slate-50 text-slate-500 px-4 py-2 rounded-xl border border-slate-100 uppercase tracking-widest">
                    {post.categories?.name || 'Tin tức'}
                  </span>
                </td>
                <td className="py-10 px-6 text-left whitespace-nowrap">
                  <span className={`text-[10px] font-black px-4 py-2 rounded-xl border uppercase tracking-widest ${post.status === 'published' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                    {post.status === 'published' ? '● CÔNG KHAI' : '○ BẢN NHÁP'}
                  </span>
                </td>
                <td className="py-10 px-10 text-left whitespace-nowrap">
                  <div className="flex items-center justify-start gap-6">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-blue-600 font-[900] text-[11px] uppercase tracking-widest hover:underline underline-offset-8 decoration-2"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="text-red-200 hover:text-red-600 font-[900] text-[11px] uppercase tracking-widest transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PHÂN TRANG */}
        <div className="p-10 bg-[#f8fafc]/50 border-t border-slate-100 flex justify-between items-center">
          {/* Yêu cầu 3: Đổi Alpha Content thành TỔNG SỐ: XX BÀI VIẾT ĐÃ ĐĂNG */}
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
            TỔNG SỐ: <span className="text-slate-800 not-italic">{totalCount}</span> BÀI VIẾT ĐÃ ĐĂNG
          </p>
          <div className="flex items-center gap-10">
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