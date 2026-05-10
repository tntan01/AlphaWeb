'use client'
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

// 1. KHỞI TẠO NGOÀI COMPONENT: Để tránh khởi tạo lại khi gõ phím gây giật lag
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Import Rich Text Editor chuẩn React 19
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-slate-50 animate-pulse rounded-2xl" />
})
import 'react-quill-new/dist/quill.snow.css'

export default function EditPost() {
  const router = useRouter()
  const { id } = useParams()
  
  // Các trạng thái danh sách
  const [categories, setCategories] = useState<any[]>([])
  const [authors, setAuthors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [uploading, setUploading] = useState(false)

  // 2. STATE ĐẦY ĐỦ 11 TRƯỜNG THEO DATABASE
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('') 
  const [featuredImage, setFeaturedImage] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [status, setStatus] = useState('draft')

  // Cấu hình Toolbar (Dùng useMemo để không bị load lại)
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, profilesRes, postRes] = await Promise.all([
          supabase.from('categories').select('id, name').eq('type', 'post'),
          supabase.from('profiles').select('id, full_name'),
          supabase.from('posts').select('*').eq('id', id).single()
        ])

        if (catsRes.data) setCategories(catsRes.data)
        if (profilesRes.data) setAuthors(profilesRes.data)

        if (postRes.data) {
          const p = postRes.data
          setTitle(p.title || '')
          setSlug(p.slug || '')
          setSummary(p.summary || '')
          setContent(p.content || '')
          setFeaturedImage(p.featured_image || '')
          setCategoryId(p.category_id || '')
          setAuthorId(p.author_id || '')
          setStatus(p.status || 'draft')
        }
      } catch (err) {
        console.error("Lỗi Alpha Data:", err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchData()
  }, [id]) // Chỉ chạy lại khi ID thay đổi

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files?.[0]) return
      const file = e.target.files[0]
      const filePath = `posts/${Date.now()}-${file.name}`

      const { error } = await supabase.storage.from('media').upload(filePath, file)
      if (error) throw error

      const { data } = supabase.storage.from('media').getPublicUrl(filePath)
      setFeaturedImage(data.publicUrl)
    } catch (err: any) {
      alert("Lỗi upload: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    
    // Gửi toàn bộ 11 trường (ID giữ nguyên, các trường khác cập nhật)
    const { error } = await supabase.from('posts').update({
      title,
      slug,
      summary,
      content,
      featured_image: featuredImage,
      category_id: categoryId || null,
      author_id: authorId || null,
      status,
      updated_at: new Date().toISOString() // Tự động cập nhật thời gian sửa
    }).eq('id', id)

    if (!error) {
      alert('Đã cập nhật bài viết thành công!')
      router.push('/admin/posts')
      router.refresh()
    } else {
      alert("Lỗi: " + error.message)
    }
    setUpdating(false)
  }

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-slate-400 animate-pulse">Đang tải dữ liệu Alpha Vietnam...</div>

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 pt-10">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-slate-800 tracking-tighter">EDIT <span className="text-blue-600">POST</span></h1>
        <button type="button" onClick={() => router.back()} className="px-6 py-2 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition shadow-sm">Thoát</button>
      </header>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* KHỐI NỘI DUNG CHÍNH (6 TRƯỜNG) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 space-y-8">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Tiêu đề bài viết</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-5 text-2xl font-bold bg-slate-50 border-none rounded-3xl mt-2 focus:ring-4 focus:ring-blue-50 outline-none transition-all" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Đường dẫn (Slug)</label>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full p-4 bg-slate-100 border-none rounded-2xl mt-2 text-slate-500 font-mono text-sm outline-none cursor-not-allowed" readOnly />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">ID Bài viết</label>
                <input value={id} className="w-full p-4 bg-slate-100 border-none rounded-2xl mt-2 text-slate-300 font-mono text-sm outline-none" readOnly />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Mô tả tóm tắt (Summary)</label>
              <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="w-full p-5 bg-slate-50 border-none rounded-3xl mt-2 focus:ring-4 focus:ring-blue-50 outline-none" />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nội dung chi tiết (Rich Text)</label>
              <div className="mt-2 bg-white rounded-3xl overflow-hidden border border-slate-100 min-h-[500px]">
                <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} className="h-[450px]" />
              </div>
            </div>
          </div>
        </div>

        {/* KHỐI THÔNG TIN BỔ TRỢ (5 TRƯỜNG) */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 space-y-6">
            <h3 className="font-black text-slate-800 text-lg border-b pb-4">PHÂN LOẠI & TÁC GIẢ</h3>
            
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Tác giả (Author_id)</label>
                <select value={authorId} onChange={(e) => setAuthorId(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-2 outline-none appearance-none font-bold text-slate-700">
                  <option value="">-- Chọn tác giả --</option>
                  {authors.map(a => <option key={a.id} value={a.id}>{a.full_name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Chuyên mục (Category_id)</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-2 outline-none appearance-none font-bold text-slate-700" required>
                  <option value="">-- Chọn chuyên mục --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Trạng thái (Status)</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-2 outline-none font-black">
                  <option value="draft" className="text-orange-500">BẢN NHÁP</option>
                  <option value="published" className="text-green-600">CÔNG KHAI</option>
                </select>
              </div>
            </div>

            <button disabled={updating} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-95 disabled:bg-slate-200">
              {updating ? 'ĐANG CẬP NHẬT...' : 'LƯU THAY ĐỔI'}
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 space-y-4">
            <h3 className="font-black text-slate-800 text-lg">ẢNH ĐẠI DIỆN</h3>
            <div className="aspect-video bg-slate-100 rounded-[2rem] overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center relative">
              {featuredImage ? (
                <img src={featuredImage} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <span className="text-slate-300 font-black text-xs uppercase tracking-widest">No Image</span>
              )}
              {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center animate-pulse text-blue-500 font-bold">Uploading...</div>}
            </div>
            <input type="file" accept="image/*" onChange={handleUploadImage} className="text-[10px] w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 font-bold cursor-pointer" />
          </div>
        </div>
      </form>
    </div>
  )
}