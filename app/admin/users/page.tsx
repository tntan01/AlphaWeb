'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Be_Vietnam_Pro } from 'next/font/google'
import { useRouter } from 'next/navigation' // Thêm router để điều hướng

const beVietnam = Be_Vietnam_Pro({ subsets: ['vietnamese'], weight: ['400', '700', '900'] })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const ALL_MENUS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'orders', label: 'Đơn hàng' },
  { id: 'products', label: 'Sản phẩm' },
  { id: 'posts', label: 'Tin tức' },
  { id: 'categories', label: 'Chuyên mục' },
]

export default function UserManager() {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').order('full_name')
    if (data) setUsers(data)
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  // Cập nhật quyền/trạng thái nhanh
  const updateUserInfo = async (userId: string, updates: any) => {
    const { error } = await supabase.from('profiles').update(updates).eq('id', userId)
    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u))
    }
  }

  // Xử lý Checkbox Menu
  const togglePermission = (user: any, menuId: string) => {
    const current = user.permissions || []
    const next = current.includes(menuId) 
      ? current.filter((i: string) => i !== menuId) 
      : [...current, menuId]
    updateUserInfo(user.id, { permissions: next })
  }

  return (
    <div className={`${beVietnam.className} space-y-8 antialiased pb-20`}>
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">Nhân sự Alpha VN</h1>
          <p className="text-slate-400 text-[10px] font-black mt-2 uppercase tracking-widest bg-slate-100 inline-block px-3 py-1 rounded-full">Quản lý phân quyền hệ thống</p>
        </div>
        
        {/* NÚT THÊM MỚI ĐÃ ĐƯỢC BỔ SUNG */}
        <button 
          onClick={() => router.push('/admin/users/add')}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-100 active:scale-95"
        >
          + Thêm nhân sự
        </button>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Người dùng</th>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quyền Menu trái</th>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Loại</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
               <tr><td colSpan={4} className="p-20 text-center font-black text-slate-300 animate-pulse text-xs uppercase">Đang truy xuất đội ngũ Alpha...</td></tr>
            ) : users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition">
                <td className="p-8">
                  <p className="font-black text-slate-800 text-lg leading-tight">{user.full_name}</p>
                  <p className="text-blue-600 font-bold text-xs mt-1">{user.email}</p>
                </td>
                <td className="p-8">
                  <button 
                    onClick={() => updateUserInfo(user.id, { is_active: !user.is_active })}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition ${
                      user.is_active ? 'bg-green-100 text-green-600 border border-green-200' : 'bg-red-50 text-red-400 border border-red-100'
                    }`}
                  >
                    {user.is_active ? '● Đang chạy' : '○ Đã dừng'}
                  </button>
                </td>
                <td className="p-8">
                  <div className="flex flex-wrap gap-2">
                    {ALL_MENUS.map(menu => (
                      <label key={menu.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                        user.permissions?.includes(menu.id) 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={user.permissions?.includes(menu.id)} 
                          onChange={() => togglePermission(user, menu.id)}
                        />
                        <span className="text-[9px] font-black uppercase tracking-tighter">{menu.label}</span>
                      </label>
                    ))}
                  </div>
                </td>
                <td className="p-8 text-right">
                  <select 
                    value={user.role}
                    onChange={(e) => updateUserInfo(user.id, { role: e.target.value })}
                    className="bg-slate-100 border-none rounded-xl font-black text-[10px] uppercase p-3 outline-none cursor-pointer hover:bg-slate-200 transition"
                  >
                    <option value="staff">Nhân viên</option>
                    <option value="admin">Quản trị</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}