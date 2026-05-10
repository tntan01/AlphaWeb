'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      alert('Sai tài khoản hoặc mật khẩu rồi ông Tân ơi!')
      setLoading(false)
    } else {
      // Dùng cách này để ép trình duyệt tải lại và nhận session mới 100%
      window.location.href = '/admin'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter">ALPHA <span className="text-blue-600">VN</span></h1>
          <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-[0.2em]">Hệ thống quản trị thiết bị</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Email nội bộ</label>
            <input
              type="email"
              placeholder="admin@alphavietnam.vn"
              required
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className={`w-full p-4 rounded-2xl font-bold text-white shadow-xl transition-all active:scale-95 ${
              loading ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
            }`}
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập ngay'}
          </button>
        </form>

        <div className="mt-10 text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">
          Alpha Vietnam Investment and Technology
        </div>
      </div>
    </div>
  )
}