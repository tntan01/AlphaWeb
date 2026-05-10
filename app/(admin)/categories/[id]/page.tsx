'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter, useParams } from 'next/navigation'

export default function EditCategory() {
  const { id } = useParams() // Lấy ID từ URL
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [parentId, setParentId] = useState<string | null>(null)
  const [type, setType] = useState('post')
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const loadData = async () => {
      // 1. Lấy danh sách chuyên mục (để chọn mục Cha)
      const { data: allCats } = await supabase.from('categories').select('*')
      if (allCats) setCategories(allCats)

      // 2. Lấy dữ liệu hiện tại của chuyên mục đang sửa
      const { data: currentCat, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

      if (currentCat) {
        setName(currentCat.name)
        setSlug(currentCat.slug)
        setParentId(currentCat.parent_id)
        setType(currentCat.type)
      }
      setLoading(false)
    }
    loadData()
  }, [id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase
      .from('categories')
      .update({ name, slug, parent_id: parentId, type })
      .eq('id', id)

    if (!error) {
      alert("Cập nhật thành công!")
      router.push('/admin/categories') // Quay lại trang quản lý
      router.refresh()
    } else {
      alert("Lỗi: " + error.message)
    }
  }

  if (loading) return <p className="p-10">Đang tải dữ liệu...</p>

  return (
    <div className="max-w-2xl mx-auto p-10 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-6">Sửa chuyên mục: {name}</h1>
      
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Tên chuyên mục</label>
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded mt-1" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Slug (Đường dẫn)</label>
          <input 
            value={slug} 
            onChange={(e) => setSlug(e.target.value)}
            className="w-full p-2 border rounded mt-1 bg-gray-50" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Loại nội dung</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="post">Bài viết (Tin tức/Giới thiệu)</option>
            <option value="product">Sản phẩm (Thiết bị)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Chuyên mục cha</label>
          <select 
            value={parentId || ''} 
            onChange={(e) => setParentId(e.target.value || null)}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="">--- Không có (Là mục gốc) ---</option>
            {categories
              .filter(c => c.id !== id && !c.parent_id) // Không cho mục tự làm con chính nó
              .map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))
            }
          </select>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded font-bold">
            Lưu thay đổi
          </button>
          <button 
            type="button" 
            onClick={() => router.back()}
            className="flex-1 bg-gray-200 text-gray-700 p-2 rounded font-bold"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  )
}