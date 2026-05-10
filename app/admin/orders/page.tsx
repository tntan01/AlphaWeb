'use client'
import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Be_Vietnam_Pro } from 'next/font/google'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation' // Thêm cái này để đọc tham số URL

const beVietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const statusLabels: any = {
  all: 'Tất cả',
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao hàng',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
}

// Tách nội dung chính ra để dùng được Suspense (bắt buộc trong Next.js khi dùng useSearchParams)
function OrderListContent() {
  const searchParams = useSearchParams()
  const statusFromUrl = searchParams.get('status') // Đọc "pending" từ URL

  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Ưu tiên trạng thái từ URL, nếu không có thì mặc định là 'all'
  const [filterStatus, setFilterStatus] = useState(statusFromUrl || 'all')
  
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 10
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  // Hàm lấy dữ liệu
  const fetchOrders = async () => {
    setLoading(true)
    const from = (currentPage - 1) * itemsPerPage
    const to = from + itemsPerPage - 1

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          price_at_purchase,
          products (name)
        )
      `, { count: 'exact' })

    if (filterStatus !== 'all') {
      query = query.eq('status', filterStatus)
    }

    if (searchQuery) {
      query = query.or(`customer_name.ilike.%${searchQuery}%,customer_phone.ilike.%${searchQuery}%`)
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (!error) {
      setOrders(data || [])
      if (count !== null) setTotalCount(count)
    }
    setLoading(false)
  }

  // Cập nhật filterStatus nếu URL thay đổi (VD: khi bấm "Xử lý ngay" nhiều lần)
  useEffect(() => {
    if (statusFromUrl) {
      setFilterStatus(statusFromUrl)
      setCurrentPage(1)
    }
  }, [statusFromUrl])

  useEffect(() => {
    fetchOrders()
  }, [currentPage, filterStatus])

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    if (!error) setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
  }

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Ông Tân chắc chắn muốn xóa đơn hàng này?")) return
    const { error } = await supabase.from('orders').delete().eq('id', orderId)
    if (!error) { alert("Đã xóa thành công!"); fetchOrders(); }
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">Đơn hàng <span className="text-blue-600">Alpha</span></h1>
          <p className="text-slate-400 text-[10px] font-black mt-2 uppercase tracking-widest bg-slate-100 inline-block px-3 py-1 rounded-full">
            Đang hiển thị: {statusLabels[filterStatus]} ({totalCount})
          </p>
        </div>
      </header>

      {/* BỘ LỌC ĐA NĂNG */}
      <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 space-y-4">
        <form onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); fetchOrders(); }} className="flex gap-4">
          <div className="relative flex-1">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">🔍</span>
            <input 
              type="text" 
              placeholder="Tìm tên khách hoặc SĐT Alpha..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-sm transition-all"
            />
          </div>
          <button type="submit" className="px-10 py-4 bg-slate-800 text-white rounded-xl font-black text-xs uppercase hover:bg-slate-900 transition shadow-lg">Tìm kiếm</button>
        </form>

        <div className="flex items-center gap-4">
           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Lọc trạng thái:</label>
           <div className="flex flex-wrap gap-2">
             {Object.keys(statusLabels).map((st) => (
               <button 
                key={st}
                onClick={() => { setFilterStatus(st); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition ${
                  filterStatus === st ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
               >
                 {statusLabels[st]}
               </button>
             ))}
           </div>
        </div>
      </div>

      {/* DANH SÁCH BẢNG */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sản phẩm</th>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tổng tiền / Trạng thái</th>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Quản lý</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={4} className="p-24 text-center font-black text-slate-300 animate-pulse text-xs uppercase">Đang tải Alpha Orders...</td></tr>
            ) : orders.map((order) => {
              const groupedItems = order.order_items?.reduce((acc: any, item: any) => {
                const name = item.products?.name || 'Sản phẩm Alpha'
                if (!acc[name]) acc[name] = { ...item, name }
                else acc[name].quantity += item.quantity
                return acc
              }, {})
              const displayItems = groupedItems ? Object.values(groupedItems) : []

              return (
                <tr key={order.id} className="hover:bg-slate-50/50 transition group">
                  <td className="p-8">
                    <p className="font-black text-slate-800 text-lg leading-tight">{order.customer_name}</p>
                    <p className="text-blue-600 font-black text-xs mt-1">{order.customer_phone}</p>
                    <p className="text-slate-400 text-[10px] mt-2 italic font-medium">{new Date(order.created_at).toLocaleString('vi-VN')}</p>
                  </td>
                  <td className="p-8">
                    <div className="space-y-2">
                      {displayItems.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="bg-blue-600 text-white px-2 py-0.5 rounded-lg text-[9px] font-black">x{item.quantity}</span>
                          <span className="text-xs font-bold text-slate-600 line-clamp-1">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-8 text-center">
                    <p className="font-black text-slate-900 text-xl tracking-tighter">
                      {new Intl.NumberFormat('vi-VN').format(order.total_price)}đ
                    </p>
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`mt-3 text-[9px] font-black px-4 py-2 rounded-full border-none outline-none cursor-pointer uppercase shadow-sm ${
                        order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                        order.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <option value="pending">⏳ Chờ xử lý</option>
                      <option value="confirmed">✅ Xác nhận</option>
                      <option value="shipping">🚚 Đang giao</option>
                      <option value="completed">🟢 Hoàn thành</option>
                      <option value="cancelled">❌ Đã hủy</option>
                    </select>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex flex-col items-end gap-2">
                      <Link href={`/admin/orders/${order.id}`} className="text-blue-600 font-black text-[10px] uppercase hover:underline underline-offset-4">Xem chi tiết</Link>
                      <button onClick={() => deleteOrder(order.id)} className="text-red-300 hover:text-red-600 font-black text-[10px] uppercase transition-colors">Xóa đơn</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* PHÂN TRANG */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiển thị {orders.length} / {totalCount} đơn hàng</p>
          <div className="flex items-center gap-6">
            <p className="text-xs font-black text-blue-600 uppercase tracking-tighter">Trang {currentPage} / {totalPages || 1}</p>
            <div className="flex gap-3">
              <button disabled={currentPage === 1 || loading} onClick={() => setCurrentPage(prev => prev - 1)} className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase hover:bg-slate-100 disabled:opacity-20 transition shadow-sm active:scale-95">Trước</button>
              <button disabled={currentPage >= totalPages || loading} onClick={() => setCurrentPage(prev => prev + 1)} className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase hover:bg-slate-100 disabled:opacity-20 transition shadow-sm active:scale-95">Sau</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Component bao ngoài dùng Suspense
export default function OrderManager() {
  return (
    <div className={`${beVietnam.className} antialiased pb-20`}>
      <Suspense fallback={<div className="p-24 text-center font-black animate-pulse text-slate-300">KHỞI TẠO ALPHA ORDERS...</div>}>
        <OrderListContent />
      </Suspense>
    </div>
  )
}