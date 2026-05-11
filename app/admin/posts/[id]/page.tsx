'use client'
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Code, Eye, Loader2, Settings, Image as ImageIcon } from 'lucide-react'

// 1. KHỞI TẠO SUPABASE
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Import Rich Text Editor (Tắt SSR để tránh lỗi)
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-96 bg-slate-50 animate-pulse rounded-2xl" />
})
import 'react-quill-new/dist/quill.snow.css'

export default function EditPost() {
  const router = useRouter()
  const { id } = useParams()

  const [categories, setCategories] = useState<any[]>([])
  const [authors, setAuthors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [isCodeView, setIsCodeView] = useState(false)

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
      try {
        const [catsRes, profilesRes, postRes] = await Promise.all([
          supabase.from('categories').select('*').eq('type', 'post'),
          supabase.from('profiles').select('id, full_name'),
          supabase.from('posts').select('*').eq('id', id).single()
        ])

        if (catsRes.data) setCategories(catsRes.data)
        if (profilesRes.data) setAuthors(profilesRes.data)

        if (postRes.data) {
          const p = postRes.data
          setTitle(p.title || '')
          setSlug(p.slug || '')
          setImageUrl(p.featured_image || '')
          setCategoryId(p.category_id || '')
          setAuthorId(p.author_id || '')
          setStatus(p.status || 'draft')
          setContent(p.content || '')
          setSummary(p.summary || '')
        }
      } catch (err) {
        console.error("Alpha VN Error:", err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchData()
  }, [id])

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
    } catch (err: any) {
      alert("Lỗi upload: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)

    const sanitizedContent = content.replace(/&nbsp;/g, ' ');
    const sanitizedSummary = summary.replace(/&nbsp;/g, ' ');

    const { error } = await supabase.from('posts').update({
      title,
      slug,
      summary: sanitizedSummary,
      content: sanitizedContent,
      featured_image: imageUrl,
      category_id: categoryId || null,
      author_id: authorId || null,
      status,
      updated_at: new Date().toISOString()
    }).eq('id', id)

    if (!error) {
      alert('Đã cập nhật thành công!')
      router.push('/admin/posts');
      router.refresh();
    } else {
      alert("Lỗi: " + error.message)
    }
    setUpdating(false)
  }

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-slate-400 animate-pulse italic">ALPHA SYSTEM LOADING...</div>

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 pt-6 px-4">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
            Chỉnh sửa <span className="text-blue-600">bài viết</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 uppercase font-bold">ID: {id}</p>
        </div>
        <button onClick={() => router.back()} className="px-6 py-2 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition">Hủy bỏ</button>
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* CỘT PHẢI: NỘI DUNG CHÍNH */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tiêu đề bài viết</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 text-lg font-bold bg-slate-50 border-none rounded-2xl mt-2 outline-blue-500 shadow-inner"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Slug (Đường dẫn)</label>
              <input
                value={slug}
                readOnly
                className="w-full p-3 text-sm font-mono border-none bg-gray-100 rounded-xl mt-2 text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mô tả ngắn (Summary)</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
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

        {/* CỘT TRÁI: CẤU HÌNH (SIDEBAR) */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Settings size={20} className="text-slate-400" /> Thiết lập
            </h3>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-wider">Tác giả bài viết</label>
                <select
                  value={authorId}
                  onChange={(e) => setAuthorId(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-1 outline-none font-bold text-slate-700 appearance-none shadow-sm"
                >
                  <option value="">-- Chọn tác giả --</option>
                  {authors.map(a => <option key={a.id} value={a.id}>{a.full_name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-wider">Chuyên mục thiết bị</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-1 outline-none font-bold text-slate-700 appearance-none shadow-sm"
                  required
                >
                  <option value="">-- Chọn chuyên mục --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-wider">Hiển thị Website</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-1 outline-none font-bold text-slate-700 appearance-none shadow-sm"
                >
                  <option value="draft">Bản nháp (Draft)</option>
                  <option value="published">Công khai (Live)</option>
                </select>
              </div>
            </div>

            <button
              disabled={updating || uploading}
              className={`w-full py-5 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${updating ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}
            >
              {updating ? <Loader2 className="animate-spin" size={20} /> : 'CẬP NHẬT NGAY'}
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-5">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <ImageIcon size={20} className="text-blue-600" /> Ảnh đại diện chính
            </h3>

            <div className="aspect-video bg-[#1e3a8a] rounded-[2rem] overflow-hidden flex items-center justify-center relative shadow-inner">
              {imageUrl ? (
                <img src={imageUrl} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="text-center p-4">
                  <span className="text-white/80 text-xl font-bold">Alpha Solar 15</span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[11px] font-black uppercase hover:bg-blue-100 transition">
                Choose File
                <input type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
              </label>
              <span className="text-[10px] text-slate-400 font-bold truncate">
                {imageUrl ? "Image uploaded" : "No file chosen"}
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}