'use client'
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Be_Vietnam_Pro } from 'next/font/google'
import { Code, Eye, Loader2, Settings, Image as ImageIcon } from 'lucide-react'

// 1. Cấu hình Font chuẩn tiếng Việt
const beVietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
})

// 2. Khởi tạo Supabase ngoài Component
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 3. Import Rich Text Editor (SSR = false)
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-64 bg-slate-50 animate-pulse rounded-[2rem]" />
})
import 'react-quill-new/dist/quill.snow.css'

export default function AddProduct() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // --- STATE DỮ LIỆU ---
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [isHtmlMode, setIsHtmlMode] = useState(false) // Thêm state chế độ HTML
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [gallery, setGallery] = useState<string[]>([])
  const [categoryId, setCategoryId] = useState('')
  const [brandId, setBrandId] = useState('')
  const [status, setStatus] = useState('published')
  const [stockStatus, setStockStatus] = useState('instock')

  // JSONB Fields
  const [specs, setSpecs] = useState([{ key: '', value: '' }])
  const [docs, setDocs] = useState([{ name: '', url: '' }])

  // Cấu hình Toolbar theo đúng thứ tự yêu cầu
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), [])

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, brandRes] = await Promise.all([
        supabase.from('categories').select('*').eq('type', 'product'),
        supabase.from('brands').select('*').order('name', { ascending: true })
      ])
      if (catRes.data) setCategories(catRes.data)
      if (brandRes.data) setBrands(brandRes.data)
    }
    fetchData()
  }, [])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    const s = val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').replace(/([^0-9a-z-\s])/g, '').replace(/(\s+)/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
    setSlug(s)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'gallery') => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) return
      const files = Array.from(e.target.files)
      const uploadPromises = files.map(async (file) => {
        const path = `products/${type}/${Date.now()}-${file.name}`
        const { error } = await supabase.storage.from('media').upload(path, file)
        if (error) throw error
        const { data } = supabase.storage.from('media').getPublicUrl(path)
        return data.publicUrl
      })
      const urls = await Promise.all(uploadPromises)
      if (type === 'main') setImageUrl(urls[0])
      else setGallery(prev => [...prev, ...urls])
    } catch (err: any) { alert(err.message) } finally { setUploading(false) }
  }

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    try {
      setUploading(true)
      const file = e.target.files?.[0]
      if (!file) return
      const path = `products/documents/${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('media').upload(path, file)
      if (error) throw error
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      const newDocs = [...docs]
      newDocs[index].url = data.publicUrl
      if (!newDocs[index].name) newDocs[index].name = file.name
      setDocs(newDocs)
    } catch (err: any) { alert(err.message) } finally { setUploading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Loại bỏ toàn bộ ký tự &nbsp; trước khi lưu vào database
    const cleanedDescription = description.replace(/&nbsp;/g, ' ')

    const specsObject = specs.reduce((acc: any, curr) => {
      if (curr.key.trim()) acc[curr.key.trim()] = curr.value
      return acc
    }, {})

    const { error } = await supabase.from('products').insert([{
      name, slug, description: cleanedDescription,
      price: price ? parseFloat(price) : 0,
      image_url: imageUrl,
      images: gallery,
      specifications: specsObject,
      documents: docs.filter(d => d.url),
      category_id: categoryId || null,
      brand_id: brandId || null,
      status,
      stock_status: stockStatus
    }])

    if (!error) {
      alert('Đã cập nhật sản phẩm Alpha thành công!')
      router.push('/admin/products')
    } else alert(error.message)
    setLoading(false)
  }

  return (
    <div className={`${beVietnam.className} max-w-6xl mx-auto pb-20 pt-10 px-4 antialiased`}>
      {/* Sửa lỗi không cho phép Enter/Space trong Editor do Tailwind reset */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .ql-editor { white-space: pre-wrap !important; }
        .ql-editor p { margin-bottom: 0.5em; }
      `}} />

      <header className="flex justify-between items-center mb-10 border-b pb-6">
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Thêm Sản phẩm <span className="text-blue-600">Alpha</span></h1>
        <button type="button" onClick={() => router.push('/admin/products')} className="px-6 py-2 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition">Hủy</button>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* CỘT TRÁI (Nội dung chính) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên thiết bị Alpha</label>
              <input value={name} onChange={handleNameChange} className="w-full p-4 text-xl font-bold bg-slate-50 border-none rounded-2xl mt-2 outline-blue-500" required />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giá bán (NUMERIC)</label>
                {/* Đã đồng bộ chiều cao h-12 và text-sm */}
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full h-12 px-4 bg-slate-50 border-none rounded-xl mt-2 font-bold text-blue-600 outline-none text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slug (SEO)</label>
                {/* Đã đồng bộ chiều cao h-12 và text-sm */}
                <input value={slug} readOnly className="w-full h-12 px-4 bg-slate-100 border-none rounded-xl mt-2 text-slate-400 font-mono text-sm outline-none" />
              </div>
            </div>

            {/* TRÌNH SOẠN THẢO */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Đặc điểm & mô tả</label>
                <button
                  type="button"
                  onClick={() => setIsHtmlMode(!isHtmlMode)}
                  className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 rounded-full text-[10px] font-black text-slate-600 hover:bg-slate-50 transition shadow-sm"
                >
                  <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">&lt; &gt;</span>
                  CHẾ ĐỘ HTML
                </button>
              </div>
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
                {isHtmlMode ? (
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full min-h-[300px] p-6 font-mono text-sm outline-none bg-slate-50"
                    placeholder="Nhập mã HTML tại đây..."
                  />
                ) : (
                  <ReactQuill theme="snow" value={description} onChange={setDescription} modules={modules} className="min-h-[300px]" />
                )}
              </div>
            </div>

            {/* THÔNG SỐ KỸ THUẬT */}
            <div className="pt-6 border-t border-slate-100">
              <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Thông số kỹ thuật</label>
              <div className="mt-4 space-y-3">
                {specs.map((spec, index) => (
                  <div key={index} className="flex gap-3 group">
                    <input placeholder="Tên" value={spec.key} onChange={e => {
                      const newSpecs = [...specs]; newSpecs[index].key = e.target.value; setSpecs(newSpecs)
                    }} className="flex-1 p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-blue-100" />
                    <input placeholder="Giá trị" value={spec.value} onChange={e => {
                      const newSpecs = [...specs]; newSpecs[index].value = e.target.value; setSpecs(newSpecs)
                    }} className="flex-1 p-3 bg-slate-50 rounded-xl text-sm outline-none border border-transparent focus:border-blue-100" />
                    <button type="button" onClick={() => setSpecs(specs.filter((_, i) => i !== index))} className="w-8 text-slate-300 hover:text-red-500 transition-colors">✕</button>
                  </div>
                ))}
                <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="text-xs font-black text-blue-600 uppercase mt-2 hover:text-blue-700 transition">+ Thêm dòng thông số</button>
              </div>
            </div>

            {/* TÀI LIỆU ĐÍNH KÈM */}
            <div className="pt-6 border-t border-slate-100">
              <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1">Tài liệu (PDF, CATALOGUE)</label>
              <div className="mt-4 space-y-4">
                {docs.map((doc, index) => (
                  <div key={index} className="flex gap-4 items-center bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 group transition-all hover:border-orange-200 shadow-sm">
                    <div className="flex-1 space-y-2">
                      <input
                        placeholder="Tên hiển thị (VD: Catalogue thiết bị)"
                        value={doc.name}
                        onChange={e => { const nd = [...docs]; nd[index].name = e.target.value; setDocs(nd) }}
                        className="w-full p-2 bg-white rounded-xl text-sm font-bold outline-none border border-transparent focus:border-orange-100"
                      />
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer">
                          <span className="text-[10px] font-black text-orange-700 bg-orange-50 px-3 py-1 rounded-full hover:bg-orange-100">Choose File</span>
                          <input type="file" accept=".pdf,.doc,.docx" onChange={e => handleDocUpload(e, index)} className="hidden" />
                        </label>
                        <span className="text-[10px] text-slate-500">{doc.url ? 'File OK' : 'No file chosen'}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDocs(docs.filter((_, i) => i !== index))}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                    >✕</button>
                  </div>
                ))}
                <button type="button" onClick={() => setDocs([...docs, { name: '', url: '' }])} className="flex items-center gap-2 text-[10px] font-black text-orange-600 uppercase mt-2 hover:text-orange-700 transition">
                  <span className="w-5 h-5 flex items-center justify-center bg-orange-600 text-white rounded-full font-bold">+</span>
                  Thêm tài liệu Alpha
                </button>
              </div>
            </div>
          </div>

          {/* GALLERY SẢN PHẨM - Chuyển sang cột trái */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 space-y-6">
            <h3 className="font-bold text-[#1e293b] text-xl flex items-center gap-3">
              <ImageIcon size={22} className="text-blue-500" /> Ảnh sản phẩm
            </h3>
            <div className="flex flex-wrap gap-4">
              <label className="w-32 h-32 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors group">
                <span className="text-2xl text-slate-300 group-hover:text-blue-500 transition-colors">+</span>
                <input type="file" multiple accept="image/*" onChange={e => handleUpload(e, 'gallery')} className="hidden" />
              </label>
              {gallery.map((url, i) => (
                <div key={i} className="w-32 h-32 relative rounded-2xl overflow-hidden border border-slate-100 group shadow-sm">
                  <img src={url} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                  <button type="button" onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold text-[10px] transition-opacity">XÓA</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (Cài đặt & Ảnh đại diện) */}
        <div className="flex flex-col gap-8">

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 space-y-6">
            <h3 className="font-bold text-[#1e293b] text-xl flex items-center gap-3">
              <Settings size={22} className="text-slate-400" /> Thiết lập
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Trạng thái kho</label>
                <select value={stockStatus} onChange={e => setStockStatus(e.target.value)} className={`w-full p-4 border-none rounded-2xl mt-1 outline-none font-black ${stockStatus === 'instock' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                  <option value="instock">🟢 CÒN HÀNG</option>
                  <option value="outstock">🔴 HẾT HÀNG</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Hãng sản xuất Alpha</label>
                <select value={brandId} onChange={e => setBrandId(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl mt-1 font-bold outline-none border-none text-slate-700" required>
                  <option value="">-- Chọn hãng --</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name.toUpperCase()}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Chuyên mục thiết bị</label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl mt-1 font-bold outline-none border-none text-slate-700" required>
                  <option value="">Sản phẩm</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Hiển thị Website</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl mt-1 font-bold outline-none border-none">
                  <option value="draft">Bản nháp (Draft)</option>
                  <option value="published">Công khai (Live)</option>
                </select>
              </div>
            </div>

            <button disabled={loading} className="w-full py-4 mt-4 bg-[#3b66f5] text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-95 disabled:bg-slate-200 uppercase tracking-widest text-sm">
              {loading ? 'Đang lưu...' : 'Cập nhật ngay'}
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 space-y-6">
            <h3 className="font-bold text-[#1e293b] text-xl flex items-center gap-3">
              <ImageIcon size={22} className="text-blue-500" /> Ảnh đại diện chính
            </h3>
            <div className="space-y-4">
              <div className="aspect-video bg-[#1d3d78] rounded-2xl overflow-hidden flex items-center justify-center relative shadow-inner">
                {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : <span className="text-white font-medium text-lg">Alpha Solar 14</span>}
                {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center animate-pulse text-blue-500 font-bold tracking-widest">UPLOAD...</div>}
              </div>
              <div className="flex items-center gap-4 px-2">
                <label className="cursor-pointer">
                  <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition">Choose File</span>
                  <input type="file" accept="image/*" onChange={e => handleUpload(e, 'main')} className="hidden" />
                </label>
                <span className="text-[10px] font-semibold text-slate-600">{imageUrl ? 'File selected' : 'No file chosen'}</span>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}