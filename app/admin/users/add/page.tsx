'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Be_Vietnam_Pro } from 'next/font/google'

const beVietnam = Be_Vietnam_Pro({ subsets: ['vietnamese'], weight: ['400', '700', '900'] })

const ALL_MENUS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'orders', label: 'Đơn hàng' },
  { id: 'products', label: 'Sản phẩm' },
  { id: 'posts', label: 'Tin tức' },
  { id: 'categories', label: 'Chuyên mục' },
  { id: 'users', label: 'Nhân sự' },
]

export default function AddUser() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'staff',
    permissions: ['dashboard']
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    const result = await res.json()
    if (res.ok) {
      alert("Đã thêm nhân viên " + formData.full_name + " vào hệ thống Alpha!")
      router.push('/admin/users')
    } else {
      alert("Lỗi: " + result.error)
    }
    setLoading(false)
  }

  const togglePermission = (id: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(id) 
        ? prev.permissions.filter(p => p !== id) 
        : [...prev.permissions, id]
    }))
  }

  return (
    <div className={`${beVietnam.className} max-w-3xl mx-auto space-y-10 antialiased pb-20`}>
      <header>
        <button onClick={() => router.back()} className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 hover:text-slate-800 transition">← Quay lại</button>
        <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">Thêm nhân sự mới</h1>
        <p className="text-slate-400 text-xs font-bold mt-2">Cấp tài khoản và phân quyền cho nhân viên Alpha VN</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-50 space-y-8">
        {/* THÔNG TIN CƠ BẢN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Họ và tên</label>
            <input required type="text" placeholder="Nguyễn Văn A" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-bold"
              onChange={e => setFormData({...formData, full_name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Đăng nhập</label>
            <input required type="email" placeholder="nv-a@alphavn.com" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-bold"
              onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Mật khẩu khởi tạo</label>
            <input required type="password" placeholder="••••••••" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-bold"
              onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Chức vụ</label>
            <select className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-black text-xs uppercase"
              onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="staff">Nhân viên (Staff)</option>
              <option value="admin">Quản trị viên (Admin)</option>
            </select>
          </div>
        </div>

        {/* PHÂN QUYỀN TRUY CẬP */}
        <div className="pt-8 border-t border-slate-50">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block mb-4">Quyền truy cập Menu</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ALL_MENUS.map(menu => (
              <label key={menu.id} className={`flex items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                formData.permissions.includes(menu.id) ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
              }`}>
                <input type="checkbox" className="hidden" checked={formData.permissions.includes(menu.id)} onChange={() => togglePermission(menu.id)} />
                <span className="text-[10px] font-black uppercase tracking-widest">{menu.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button disabled={loading} type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl active:scale-95 disabled:opacity-50">
          {loading ? 'Đang khởi tạo nhân sự...' : '🚀 Xác nhận thêm nhân viên'}
        </button>
      </form>
    </div>
  )
}