'use client'
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Code, Eye, Loader2, Settings, Image as ImageIcon } from 'lucide-react'

// 1. KHỞI TẠO SUPABASE
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Import Rich Text Editor (Tắt SSR để tránh lỗi Next.js)
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-96 bg-slate-50 animate-pulse rounded-[2rem]" />
})
import 'react-quill-new/dist/quill.snow.css'

export default function AddPost() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [authors, setAuthors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // 🔥 TRẠNG THÁI CHẾ ĐỘ XEM CODE HTML
  const [isCodeView, setIsCodeView] = useState(false)

  // State quản lý Form
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [status, setStatus] = useState('draft')

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      ['code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), [])

  useEffect(() => {
    const fetchData = async () => {
      const { data: cats } = await supabase.from('categories').select('*').eq('type', 'post')
      if (cats) setCategories(cats)
      const { data: profs } = await supabase.from('profiles').select('id, full_name')
      if (profs) setAuthors(profs)
    }
    fetchData()
  }, [])

  // Hàm tạo Slug tự động
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
      const filePath = `posts/${Date.now()}-${file.name}`
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

    // 🔥 VỆ SINH DỮ LIỆU
    const sanitizedContent = content.replace(/&nbsp;/g, ' ')
    const sanitizedSummary = summary.replace(/&nbsp;/g, ' ')

    const { error } = await supabase.from('posts').insert([{
      title,
      slug,
      summary: sanitizedSummary,
      content: sanitizedContent,
      category_id: categoryId || null,
      author_id: authorId || null,
      featured_image: imageUrl,
      status
    }])

    if (!error) {
      alert('Đã đăng bài thành công!')
      router.push('/admin/posts')
      router.refresh()
    } else {
      alert('Lỗi: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 pt-6 px-4">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
            SOẠN THẢO <span className="text-blue-600">BÀI VIẾT MỚI</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Hệ thống nội dung Alpha Vietnam</p>
        </div>
        <button onClick={() => router.back()} type="button" className="px-6 py-2 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition">Hủy bỏ</button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* CỘT TRÁI: NỘI DUNG CHÍNH (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tiêu đề bài viết</label>
              <input
                value={title}
                onChange={handleTitleChange}
                placeholder="Nhập tiêu đề..."
                className="w-full p-4 text-lg font-bold bg-slate-50 border-none rounded-2xl mt-2 outline-blue-500 shadow-inner"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Slug (Tự động tạo)</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full p-3 text-sm font-mono border-none bg-gray-100 rounded-xl mt-2 text-gray-400 shadow-inner"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mô tả ngắn (Summary)</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                placeholder="Tóm tắt nội dung..."
                className="w-full p-4 text-sm border-none bg-slate-50 rounded-2xl mt-2 outline-blue-500 shadow-inner"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nội dung chi tiết</label>
                <button
                  type="button"
                  onClick={() => setIsCodeView(!isCodeView)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all ${isCodeView ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {isCodeView ? <><Eye size={12} /> View Mode</> : <><Code size={12} /> HTML Mode</>}
                </button>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-inner min-h-[500px]">
                {isCodeView ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-[500px] p-6 font-mono text-sm bg-slate-900 text-green-400 outline-none resize-none"
                    spellCheck={false}
                    placeholder="Nhập mã HTML tại đây..."
                  />
                ) : (
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    className="h-[450px]"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: THIẾT LẬP (1/3) - THEO ẢNH CỦA BẠN */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
            <h3 className="font-bold text-[#1e293b] text-xl flex items-center gap-3">
              <Settings size={22} className="text-slate-400" /> Thiết lập
            </h3>

            <div className="space-y-5">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Tác giả bài viết</label>
                <select
                  value={authorId}
                  onChange={(e) => setAuthorId(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-none rounded-[1.25rem] mt-2 outline-none font-bold text-slate-700 appearance-none shadow-sm"
                >
                  <option value="">-- Chọn tác giả --</option>
                  {authors.map(a => <option key={a.id} value={a.id}>{a.full_name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Chuyên mục thiết bị</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-none rounded-[1.25rem] mt-2 outline-none font-bold text-slate-700 appearance-none shadow-sm"
                  required
                >
                  <option value="">-- Chọn chuyên mục --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Hiển thị Website</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-none rounded-[1.25rem] mt-2 outline-none font-bold text-slate-800 appearance-none shadow-sm"
                >
                  <option value="draft">Bản nháp (Draft)</option>
                  <option value="published">Công khai (Live)</option>
                </select>
              </div>
            </div>

            <button
              disabled={loading || uploading}
              type="submit"
              className={`w-full py-5 text-white rounded-[1.25rem] font-black uppercase tracking-widest shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2 ${loading ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'CẬP NHẬT NGAY'}
            </button>
          </div>

          {/* BOX ẢNH ĐẠI DIỆN - THEO ẢNH CỦA BẠN */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-5">
            <h3 className="font-bold text-[#1e293b] text-xl flex items-center gap-3">
              <ImageIcon size={22} className="text-blue-500" /> Ảnh đại diện chính
            </h3>

            <div className="aspect-[16/10] bg-[#1a365d] rounded-[2rem] overflow-hidden flex items-center justify-center relative shadow-inner">
              {imageUrl ? (
                <img src={imageUrl} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="text-center p-6">
                  <span className="text-white text-2xl font-bold opacity-90">Alpha Solar 15</span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-[2rem]">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              )}
            </div>

            <div className="pt-2">
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={handleUploadImage}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-6 py-2.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold cursor-pointer hover:bg-blue-100 transition-colors mr-3"
              >
                Choose File
              </label>
              <span className="text-xs font-bold text-slate-800">No file chosen</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}