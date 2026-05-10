'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export default function CategoryManager() {
  const [categories, setCategories] = useState<any[]>([])
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState<string | null>(null)
  const [type, setType] = useState('post')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const router = useRouter()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 1. Lấy danh sách chuyên mục
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true })
    if (data) setCategories(data)
  }

  useEffect(() => { fetchCategories() }, [])

  // 2. Hàm tạo Slug tự động
  const generateSlug = (text: string) => {
    return text.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // 3. Xử lý Thêm chuyên mục (Fix lỗi Foreign Key)
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const slug = generateSlug(name)
    const finalParentId = parentId === "" || parentId === null ? null : parentId

    const { error } = await supabase
      .from('categories')
      .insert([{ 
        name, 
        slug, 
        parent_id: finalParentId, 
        type 
      }])

    if (!error) {
      setName('')
      setParentId(null)
      fetchCategories()
    } else {
      alert("Lỗi: " + error.message)
    }
    setIsSubmitting(false)
  }

  // 4. Xử lý Xóa chuyên mục
  const handleDelete = async (id: string, catName: string) => {
    const confirmDelete = confirm(`Ông có chắc muốn xóa "${catName}" không?`)
    if (confirmDelete) {
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (!error) fetchCategories()
      else alert("Không xóa được: " + error.message)
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Cấu trúc Menu Alpha Vietnam</h1>
        <button onClick={() => router.push('/admin')} className="text-sm text-blue-600 hover:underline">
          ← Quay lại Admin
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* CỘT TRÁI: FORM THÊM MỚI */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit sticky top-8">
          <h2 className="text-xl font-bold mb-6 text-blue-800">➕ Thêm mục mới</h2>
          <form onSubmit={handleAdd} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase">Tên chuyên mục</label>
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full p-3 border border-gray-200 rounded-xl mt-1 outline-blue-500" 
                required 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase">Loại nội dung</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl mt-1">
                <option value="post">Bài viết (Tin tức/Giới thiệu)</option>
                <option value="product">Sản phẩm (Thiết bị)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase">Thuộc mục cha</label>
              <select value={parentId || ""} onChange={(e) => setParentId(e.target.value || null)} className="w-full p-3 border border-gray-200 rounded-xl mt-1">
                <option value="">--- Là mục Gốc ---</option>
                {categories.filter(c => !c.parent_id).map(parent => (
                  <option key={parent.id} value={parent.id}>{parent.name}</option>
                ))}
              </select>
            </div>
            <button disabled={isSubmitting} className="w-full p-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
              {isSubmitting ? 'Đang lưu...' : 'Thêm vào Menu'}
            </button>
          </form>
        </div>

        {/* CỘT PHẢI: DANH SÁCH HIỂN THỊ (NÚT LUÔN HIỆN) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-500 mb-4 px-2">Xem trước Menu</h2>
          
          {categories.filter(c => !c.parent_id).map(parent => (
            <div key={parent.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              
              {/* Mục Cha */}
              <div className="px-5 py-4 flex justify-between items-center bg-white border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                  <span className="font-bold text-gray-800 text-lg">{parent.name}</span>
                </div>
                
                {/* Khu vực nút bấm */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => router.push(`/admin/categories/${parent.id}`)} 
                    className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-100 transition"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(parent.id, parent.name)} 
                    className="bg-red-50 text-red-500 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-red-100 transition"
                  >
                    Xóa
                  </button>
                </div>
              </div>

              {/* Mục Con */}
              <div className="bg-gray-50/30 p-2">
                {categories.filter(c => c.parent_id === parent.id).map(child => (
                  <div key={child.id} className="flex justify-between items-center ml-8 mr-4 py-3 border-l-2 border-gray-200 pl-6 hover:bg-white rounded-r-xl transition-all">
                    <span className="text-gray-700 font-medium">{child.name}</span>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => router.push(`/admin/categories/${child.id}`)} 
                        className="text-blue-500 hover:text-blue-700 text-xs font-bold px-2 py-1"
                      >
                        Sửa
                      </button>
                      <button 
                        onClick={() => handleDelete(child.id, child.name)} 
                        className="text-red-400 hover:text-red-600 text-xs font-bold px-2 py-1"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}

          {categories.length === 0 && (
            <p className="text-center py-20 text-gray-400">Chưa có chuyên mục nào.</p>
          )}
        </div>

      </div>
    </div>
  )
}