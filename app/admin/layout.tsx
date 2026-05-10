'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Be_Vietnam_Pro } from 'next/font/google'

const beVietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ALL_MENU_ITEMS = [
  { id: 'dashboard', name: 'Dashboard', path: '/admin', icon: '📊' },
  { id: 'orders', name: 'Đơn hàng mới', path: '/admin/orders', icon: '🛒', tag: 'NEW' },
  { id: 'products', name: 'Sản phẩm', path: '/admin/products', icon: '📦' },
  { id: 'brands', name: 'Hãng sản xuất', path: '/admin/brands', icon: '🏷️' }, // FIX: id từ 'users' -> 'brands'
  { id: 'posts', name: 'Tin tức', path: '/admin/posts', icon: '📰' },
  { id: 'categories', name: 'Chuyên mục', path: '/admin/categories', icon: '📂' },
  { id: 'users', name: 'Nhân sự', path: '/admin/users', icon: '👥' }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkSecurity = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          window.location.href = '/login'
          return
        }

        const { data: userProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error || !userProfile) throw new Error("Security Error")

        if (!userProfile.is_active) {
          alert("Tài khoản tạm dừng hoạt động.")
          await supabase.auth.signOut()
          window.location.href = '/login'
          return
        }

        setProfile(userProfile)
        setLoading(false)
      } catch (err) {
        window.location.href = '/login'
      }
    }
    checkSecurity()
  }, [pathname])

  const handleLogout = async () => {
    if (confirm("Xác nhận thoát hệ thống Alpha VN?")) {
      await supabase.auth.signOut()
      window.location.href = '/login'
    }
  }

  const canSee = (menuId: string) => {
    if (!profile) return false
    if (profile.role === 'admin') return true
    return profile.permissions?.includes(menuId)
  }

  const getMenuClass = (path: string) => {
    const base = "w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all text-sm font-bold "
    // So khớp đường dẫn chính xác cho trang Dashboard và các trang con
    const isActive = path === '/admin' ? pathname === '/admin' : pathname.startsWith(path)

    return isActive
      ? base + "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
      : base + "text-slate-400 hover:bg-slate-700 hover:text-white"
  }

  if (loading) return (
    <div className={`${beVietnam.className} h-screen w-full flex items-center justify-center bg-slate-900`}>
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className={`${beVietnam.className} flex min-h-screen bg-gray-100 antialiased`}>
      <aside className="w-72 bg-slate-800 text-white fixed h-full shadow-2xl z-50 flex flex-col">
        <div className="p-8 border-b border-slate-700/50">
          <h2 className="text-2xl font-[900] tracking-tighter text-blue-400 italic">ALPHA <span className="text-white">VN</span></h2>
          <p className="text-[9px] text-slate-500 font-black uppercase mt-1 tracking-[0.2em]">Control Center</p>
        </div>

        <nav className="flex-1 mt-8 px-4 space-y-1 overflow-y-auto">
          {ALL_MENU_ITEMS.map((item) => (
            canSee(item.id) && (
              <Link key={item.id} href={item.path} className={getMenuClass(item.path)}>
                <span className="text-lg">{item.icon}</span>
                <span className="truncate">{item.name}</span>
                {item.tag && (
                  <span className="ml-auto bg-orange-500 text-[8px] px-2 py-1 rounded-md text-white animate-bounce italic font-black">
                    {item.tag}
                  </span>
                )}
              </Link>
            )
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/30">
          <div className="bg-slate-900/50 p-4 rounded-[2rem] border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black shadow-lg uppercase text-xs">
                {profile?.full_name?.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black truncate">{profile?.full_name}</p>
                <p className="text-[9px] text-slate-500 font-black uppercase italic">{profile?.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full mt-4 py-2 text-[10px] font-black uppercase text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-red-400/10">
              🚪 Thoát hệ thống
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-72">
        <div className="p-12 min-h-screen max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}