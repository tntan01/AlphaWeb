'use client'
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Be_Vietnam_Pro } from 'next/font/google'

// 1. Font chuẩn tiếng Việt - Fix lỗi vỡ dấu
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

export default function EditProduct() {
  const router = useRouter()
  const { id } = useParams()
  
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [uploading, setUploading] = useState(false)

  // --- STATE DỮ LIỆU ---
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [gallery, setGallery] = useState<string[]>([])
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState('published')
  const [stockStatus, setStockStatus] = useState('instock')
  const [createdAt, setCreatedAt] = useState('')
  
  // JSONB States
  const [specs, setSpecs] = useState([{ key: '', value: '' }])
  const [docs, setDocs] = useState([{ name: '', url: '' }])

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  }), [])

  // NẠP DỮ LIỆU CŨ
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, productRes] = await Promise.all([
          supabase.from('categories').select('*').eq('type', 'product'),
          supabase.from('products').select('*').eq('id', id).single()
        ])

        if (catsRes.data) setCategories(catsRes.data)

        if (productRes.data) {
          const p = productRes.data
          setName(p.name || '')
          setSlug(p.slug || '')
          setDescription(p.description || '')
          setPrice(p.price?.toString() || '')
          setImageUrl(p.image_url || '')
          setGallery(p.images || [])
          setCategoryId(p.category_id || '')
          setStatus(p.status || 'published')
          setStockStatus(p.stock_status || 'instock')
          setCreatedAt(p.created_at || '')
          
          if (p.specifications && Object.keys(p.specifications).length > 0) {
            setSpecs(Object.entries(p.specifications).map(([key, value]) => ({ key, value: String(value) })))
          }
          if (p.documents && p.documents.length > 0) {
            setDocs(p.documents)
          }
        }
      } catch (err) {
        console.error("Lỗi:", err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchData()
  }, [id])

  // --- XỬ LÝ UPLOAD ---
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
      const newDocs = [...docs]; 
      newDocs[index].url = data.publicUrl; 
      if(!newDocs[index].name) newDocs[index].name = file.name;
      setDocs(newDocs)
    } catch (err: any) { alert(err.message) } finally { setUploading(false) }
  }

  // --- LƯU THAY ĐỔI ---
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)

    const specsObject = specs.reduce((acc: any, curr) => {
      if (curr.key.trim()) acc[curr.key.trim()] = curr.value
      return acc
    }, {})

    const { error } = await supabase.from('products').update({
      name, slug, description,
      price: price ? parseFloat(price) : 0,
      image_url: imageUrl,
      images: gallery,
      specifications: specsObject,
      documents: docs.filter(d => d.url),
      category_id: categoryId || null,
      status,
      stock_status: stockStatus
    }).eq('id', id)

    if (!error) {
      alert('Cập nhật Alpha thành công!')
      router.push('/admin/products')
      router.refresh()
    } else alert(error.message)
    setUpdating(false)
  }

  if (loading) return <div className={`${beVietnam.className} h-screen flex items-center justify-center font-black text-slate-400 animate-pulse uppercase tracking-widest`}>Loading Alpha Data...</div>

  return (
    <div className={`${beVietnam.className} max-w-6xl mx-auto pb-20 pt-10 px-4 antialiased`}>
      <header className="flex justify-between items-center mb-10 border-b pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Chỉnh sửa <span className="text-blue-600">Sản phẩm</span></h1>
          <p className="text-slate-400 text-[10px] font-black uppercase mt-1 tracking-widest">Ngày tạo: {new Date(createdAt).toLocaleDateString('vi-VN')}</p>
        </div>
        <button type="button" onClick={() => router.back()} className="px-6 py-2 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition">Quay lại</button>
      </header>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên thiết bị Alpha</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full p-4 text-xl font-bold bg-slate-50 border-none rounded-2xl mt-2 outline-blue-500" required />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giá bán (numeric)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-3 bg-slate-50 border-none rounded-xl mt-2 font-bold text-blue-600 outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slug (SEO)</label>
                <input value={slug} readOnly className="w-full p-3 bg-slate-100 border-none rounded-xl mt-2 text-slate-400 font-mono text-xs outline-none" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Đặc điểm & Mô tả</label>
              <div className="mt-2 bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-inner">
                <ReactQuill theme="snow" value={description} onChange={setDescription} modules={modules} className="min-h-[300px]" />
              </div>
            </div>

            {/* THÔNG SỐ KỸ THUẬT */}
            <div className="pt-6 border-t border-slate-100">
              <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Thông số kỹ thuật</label>
              <div className="mt-4 space-y-3">
                {specs.map((spec, i) => (
                  <div key={i} className="flex gap-3 group">
                    <input placeholder="Tên" value={spec.key} onChange={e => { const ns = [...specs]; ns[i].key = e.target.value; setSpecs(ns) }} className="flex-1 p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-blue-100" />
                    <input placeholder="Giá trị" value={spec.value} onChange={e => { const ns = [...specs]; ns[i].value = e.target.value; setSpecs(ns) }} className="flex-1 p-3 bg-slate-50 rounded-xl text-sm outline-none border border-transparent focus:border-blue-100" />
                    <button type="button" onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))} className="w-8 text-slate-300 hover:text-red-500 transition-colors">✕</button>
                  </div>
                ))}
                <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="text-xs font-black text-blue-600 uppercase mt-2 hover:text-blue-700 transition">+ Thêm dòng thông số</button>
              </div>
            </div>

            {/* TÀI LIỆU ĐÍNH KÈM - ĐÃ BỎ ĐƯỜNG DẪN DÀI */}
            <div className="pt-6 border-t border-slate-100">
              <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1">Tài liệu (PDF, Catalogue)</label>
              <div className="mt-4 space-y-4">
                {docs.map((doc, i) => (
                  <div key={i} className="flex gap-4 items-center bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 group transition-all hover:border-orange-200 shadow-sm">
                    <div className="flex-1 space-y-2">
                      <input 
                        placeholder="Tên hiển thị (VD: Catalogue thiết bị)" 
                        value={doc.name} 
                        onChange={e => { const nd = [...docs]; nd[i].name = e.target.value; setDocs(nd) }} 
                        className="w-full p-2 bg-white rounded-xl text-sm font-bold outline-none border border-transparent focus:border-orange-100" 
                      />
                      <div className="flex items-center gap-3">
                        <input 
                          type="file" 
                          accept=".pdf,.doc,.docx" 
                          onChange={e => handleDocUpload(e, i)} 
                          className="text-[10px] block w-full text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer" 
                        />
                        {/* Nhãn xác nhận file OK - Thay thế cho URL dài */}
                        {doc.url && (
                          <span className="flex-shrink-0 bg-green-500 text-white text-[8px] font-black px-2 py-1 rounded-md shadow-sm">
                            ✓ FILE OK
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setDocs(docs.filter((_, idx) => idx !== i))} 
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => setDocs([...docs, { name: '', url: '' }])} className="flex items-center gap-2 text-[10px] font-black text-orange-600 uppercase mt-2 hover:text-orange-700 transition">
                   <span className="w-5 h-5 flex items-center justify-center bg-orange-600 text-white rounded-full font-bold">+</span>
                   Thêm tài liệu Alpha
                </button>
              </div>
            </div>
          </div>

          {/* GALLERY */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 space-y-6">
            <h3 className="font-bold text-slate-800 px-2 uppercase tracking-tighter">🖼️ Gallery Sản phẩm</h3>
            <div className="grid grid-cols-4 gap-4">
              {gallery.map((url, i) => (
                <div key={i} className="aspect-square relative rounded-2xl overflow-hidden border border-slate-100 group shadow-sm">
                  <img src={url} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                  <button type="button" onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold text-[10px] transition-opacity">XÓA ẢNH</button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors group">
                <span className="text-2xl text-slate-300 group-hover:text-blue-500 transition-colors">+</span>
                <input type="file" multiple accept="image/*" onChange={e => handleUpload(e, 'gallery')} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 space-y-6">
            <h3 className="font-bold text-slate-800">⚙️ Thiết lập Alpha</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Trạng thái kho</label>
                <select value={stockStatus} onChange={e => setStockStatus(e.target.value)} className={`w-full p-4 border-none rounded-2xl mt-1 outline-none font-black ${stockStatus === 'instock' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                  <option value="instock">🟢 CÒN HÀNG</option>
                  <option value="outstock">🔴 HẾT HÀNG</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Chuyên mục thiết bị</label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-1 outline-none font-bold text-slate-700" required>
                  <option value="">-- Chọn mục --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Hiển thị website</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-1 outline-none font-black">
                  <option value="published">Công khai</option>
                  <option value="draft">Bản nháp</option>
                </select>
              </div>
            </div>
            <button disabled={updating} className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition active:scale-95 disabled:bg-slate-200 uppercase tracking-widest">
              {updating ? 'Đang lưu bài...' : 'Cập nhật ngay'}
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 space-y-4">
            <h3 className="font-bold text-slate-800 px-2">🖼️ Ảnh đại diện chính</h3>
            <div className="aspect-video bg-slate-50 rounded-3xl overflow-hidden border-2 border-dashed border-slate-100 flex items-center justify-center relative shadow-inner">
              {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : <span className="text-slate-300 font-bold text-xs uppercase tracking-widest">No Image</span>}
              {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center animate-pulse text-blue-500 font-bold tracking-widest">UPLOAD...</div>}
            </div>
            <input type="file" accept="image/*" onChange={e => handleUpload(e, 'main')} className="text-[10px] w-full mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 font-bold cursor-pointer" />
          </div>
        </div>

      </form>
    </div>
  )
}