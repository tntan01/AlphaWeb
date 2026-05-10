'use client'
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Import Rich Text Editor (Tắt SSR để tránh lỗi Next.js)
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-slate-50 animate-pulse rounded-2xl" />
})
import 'react-quill-new/dist/quill.snow.css'

export default function AddPost() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [authors, setAuthors] = useState<any[]>([]) // Thêm danh sách tác giả
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // State quản lý Form
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [authorId, setAuthorId] = useState('') // Thêm authorId
  const [imageUrl, setImageUrl] = useState('')
  const [status, setStatus] = useState('draft')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Cấu hình thanh công cụ cho Rich Text
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), [])

  useEffect(() => {
    const fetchData = async () => {
      // Lấy chuyên mục tin tức
      const { data: cats } = await supabase.from('categories').select('*').eq('type', 'post')
      if (cats) setCategories(cats)
      
      // Lấy danh sách tài khoản làm tác giả (từ bảng profiles)
      const { data: profs } = await supabase.from('profiles').select('id, full_name')
      if (profs) setAuthors(profs)
    }
    fetchData()
  }, [supabase])

  const generateSlug = (text: string) => {
    let s = text.toLowerCase()
    s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    s = s.replace(/[đĐ]/g, 'd')
    s = s.replace(/([^0-9a-z-\s])/g, '')
    s = s.replace(/(\s+)/g, '-')
    s = s.replace(/-+/g, '-')
    return s.replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTitle(val)
    setSlug(generateSlug(val))
  }

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files?.[0]) return
      const file = e.target.files[0]
      const filePath = `posts/${Math.random()}.${file.name.split('.').pop()}`
      const { error } = await supabase.storage.from('media').upload(filePath, file)
      if (error) throw error
      const { data } = supabase.storage.from('media').getPublicUrl(filePath)
      setImageUrl(data.publicUrl)
    } catch (error: any) {
      alert('Lỗi upload: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('posts').insert([{
      title, 
      slug, 
      summary, 
      content, 
      category_id: categoryId || null, 
      author_id: authorId || null,
      featured_image: imageUrl,
      status
    }])

    if (!error) {
      alert('Đăng bài thành công!')
      router.push('/admin/posts')
      router.refresh()
    } else {
      alert('Lỗi: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between border-b pb-6 mt-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Soạn thảo tin tức</h1>
          <p className="text-slate-400 text-sm mt-1">Hệ thống nội dung Alpha Vietnam</p>
        </div>
        <button onClick={() => router.back()} className="px-6 py-2 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition">Hủy bỏ</button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* CỘT PHẢI: NỘI DUNG CHÍNH */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tiêu đề bài viết</label>
              <input 
                value={title} 
                onChange={handleTitleChange}
                placeholder="Nhập tiêu đề..."
                className="w-full p-4 text-2xl font-bold bg-slate-50 border-none rounded-2xl mt-2 outline-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Đường dẫn bài viết (Slug)</label>
              <input 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)}
                className="w-full p-3 text-sm font-mono border-none bg-gray-100 rounded-xl mt-2 text-gray-500"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mô tả ngắn (Summary)</label>
              <textarea 
                value={summary} 
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                placeholder="Tóm tắt nội dung..."
                className="w-full p-4 border-none bg-slate-50 rounded-2xl mt-2 outline-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nội dung chi tiết</label>
              <div className="mt-2 bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
                <ReactQuill 
                  theme="snow" 
                  value={content} 
                  onChange={setContent} 
                  modules={modules}
                  className="min-h-[400px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CỘT TRÁI: CẤU HÌNH */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-5">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">⚙️ Thiết lập</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Tác giả</label>
                <select 
                  value={authorId} 
                  onChange={(e) => setAuthorId(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border-none rounded-xl mt-1 outline-none cursor-pointer"
                >
                  <option value="">-- Chọn tác giả --</option>
                  {authors.map(a => <option key={a.id} value={a.id}>{a.full_name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Chuyên mục</label>
                <select 
                  value={categoryId} 
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border-none rounded-xl mt-1 outline-none cursor-pointer"
                  required
                >
                  <option value="">-- Chọn chuyên mục --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Trạng thái</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border-none rounded-xl mt-1 outline-none cursor-pointer font-bold"
                >
                  <option value="draft">🟠 Bản nháp</option>
                  <option value="published">🟢 Công khai</option>
                </select>
              </div>
            </div>

            <button 
              disabled={loading || uploading}
              className={`w-full py-4 text-white rounded-2xl font-bold shadow-lg transition-all active:scale-95 ${
                loading ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
              }`}
            >
              {loading ? 'Đang lưu...' : 'Lưu bài viết'}
            </button>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">🖼️ Ảnh đại diện</h3>
            <div className="aspect-video bg-slate-50 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center relative">
              {imageUrl ? (
                <img src={imageUrl} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <span className="text-slate-300 text-3xl block mb-2">📷</span>
                  <span className="text-slate-400 text-[10px] font-bold tracking-widest">CHƯA CÓ ẢNH</span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleUploadImage}
              className="text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        </div>
      </form>
    </div>
  )
}