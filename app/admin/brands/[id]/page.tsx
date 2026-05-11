'use client'
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Be_Vietnam_Pro } from 'next/font/google'
import { Code, Eye, Loader2, Settings, Image as ImageIcon } from 'lucide-react'

const beVietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-64 bg-slate-50 animate-pulse rounded-[2rem]" />
})
import 'react-quill-new/dist/quill.snow.css'

export default function EditBrand() {
  const router = useRouter()
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [uploading, setUploading] = useState(false)

  // --- STATE DỮ LIỆU ---
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')

  // State cho HTML Mode
  const [isHtmlMode, setIsHtmlMode] = useState(false)

  // Cấu hình Toolbar theo thứ tự yêu cầu
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), [])

  // Xử lý làm sạch dữ liệu &nbsp; và cập nhật nội dung
  const handleDescriptionChange = (content: string) => {
    const cleaned = content.replace(/&nbsp;/g, ' ');
    setDescription(cleaned);
  }

  // NẠP DỮ LIỆU CŨ
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const { data, error } = await supabase.from('brands').select('*').eq('id', id).single()
        if (error) throw error
        if (data) {
          setName(data.name || '')
          setSlug(data.slug || '')
          setDescription(data.description || '')
          setLogoUrl(data.logo_url || '')
          setWebsiteUrl(data.website_url || '')
        }
      } catch (err: any) {
        alert("Lỗi truy xuất Alpha: " + err.message)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchBrand()
  }, [id])

  // XỬ LÝ UPLOAD LOGO
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = e.target.files?.[0]
      if (!file) return
      const path = `brands/${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('media').upload(path, file)
      if (error) throw error
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      setLogoUrl(data.publicUrl)
    } catch (err: any) { alert(err.message) } finally { setUploading(false) }
  }

  // LƯU THAY ĐỔI
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)

    const { error } = await supabase.from('brands').update({
      name, slug,
      description: description.replace(/&nbsp;/g, ' '),
      logo_url: logoUrl,
      website_url: websiteUrl
    }).eq('id', id)

    if (!error) {
      alert('Cập nhật hãng thành công!')
      router.push('/admin/brands')
      router.refresh()
    } else alert(error.message)
    setUpdating(false)
  }

  if (loading) return <div className={`${beVietnam.className} h-screen flex items-center justify-center font-black text-slate-400 animate-pulse uppercase tracking-widest`}>Loading Alpha Brand...</div>

  return (
    <div className={`${beVietnam.className} max-w-6xl mx-auto pb-20 pt-10 px-4 antialiased`}>
      {/* Khắc phục lỗi Space/Enter của Quill bằng CSS bổ trợ */}
      <style jsx global>{`
        .ql-editor {
          white-space: pre-wrap !important;
          min-height: 250px;
          font-family: inherit;
        }
      `}</style>

      <header className="flex justify-between items-center mb-10 border-b pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Sửa <span className="text-blue-600">thông tin thương hiệu</span></h1>
          <p className="text-slate-400 text-[10px] font-black uppercase mt-1 tracking-widest">Mã định danh: {id}</p>
        </div>
        <button type="button" onClick={() => router.back()} className="px-6 py-2 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition">Quay lại</button>
      </header>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên thương hiệu</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full p-4 text-xl font-bold bg-slate-50 border-none rounded-2xl mt-2 outline-blue-500" required />
            </div>

            <div className="grid grid-cols-2 gap-6 items-end">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slug (SEO)</label>
                <input value={slug} readOnly className="w-full p-4 bg-slate-100 border-none rounded-xl mt-2 text-slate-400 font-mono text-sm outline-none h-[52px]" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Website URL</label>
                <input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-xl mt-2 font-bold text-blue-600 outline-none text-sm h-[52px]" placeholder="https://..." />
              </div>
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giới thiệu hãng</label>
                {/* Nút HTML MODE thiết kế hiện đại, bo góc */}
                <button
                  type="button"
                  onClick={() => setIsHtmlMode(!isHtmlMode)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${isHtmlMode ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                  HTML MODE
                </button>
              </div>

              <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-inner">
                {isHtmlMode ? (
                  <textarea
                    value={description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    className="w-full min-h-[250px] p-6 font-mono text-sm bg-slate-900 text-blue-300 outline-none focus:ring-0"
                    placeholder="Dán mã HTML vào đây..."
                  />
                ) : (
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={handleDescriptionChange}
                    modules={modules}
                    className="min-h-[250px]"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 space-y-6">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Settings size={20} className="text-slate-400" /> Thao tác
            </h3>
            <button disabled={updating} className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition active:scale-95 disabled:bg-slate-200 uppercase tracking-widest">
              {updating ? 'Đang lưu...' : 'Cập nhật ngay'}
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 space-y-4">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <ImageIcon size={20} className="text-blue-600" /> Logo
            </h3>
            <div className="aspect-square bg-slate-50 rounded-3xl overflow-hidden border-2 border-dashed border-slate-100 flex items-center justify-center relative shadow-inner p-8">
              {logoUrl ? <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" /> : <span className="text-slate-300 font-bold text-xs uppercase tracking-widest">No Logo</span>}
              {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center animate-pulse text-blue-500 font-bold tracking-widest text-[10px]">UPLOAD...</div>}
            </div>
            <input type="file" accept="image/*" onChange={handleUpload} className="text-[10px] w-full mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 font-bold cursor-pointer" />
          </div>
        </div>
      </form>
    </div>
  )
}