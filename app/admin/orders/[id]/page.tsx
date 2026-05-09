'use client'
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter, useParams } from 'next/navigation'
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

// --- BỘ TỪ ĐIỂN TRẠNG THÁI ALPHA VN ---
const statusMap: any = {
  pending: { label: 'Chờ xử lý', color: 'bg-orange-100 text-orange-600' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-600' },
  shipping: { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-600' },
  completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-600' },
  cancelled: { label: 'Đã hủy đơn', color: 'bg-red-50 text-red-400' },
}

export default function OrderDetail() {
  const router = useRouter()
  const { id } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price_at_purchase,
            products (name, image_url)
          )
        `)
        .eq('id', id)
        .single()

      if (!error) setOrder(data)
      setLoading(false)
    }
    if (id) fetchOrderDetail()
  }, [id])

  const updateStatus = async (newStatus: string) => {
    setUpdating(true)
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id)
    
    if (!error) setOrder({ ...order, status: newStatus })
    setUpdating(false)
  }

  if (loading) return <div className={`${beVietnam.className} h-screen flex items-center justify-center font-black text-slate-400 animate-pulse uppercase`}>Alpha VN Loading...</div>
  if (!order) return <div className="p-20 text-center font-bold">Không tìm thấy đơn hàng.</div>

  // Logic gộp sản phẩm
  const groupedItems = order.order_items?.reduce((acc: any, item: any) => {
    const name = item.products?.name || 'Sản phẩm Alpha'
    if (!acc[name]) acc[name] = { ...item, name, image: item.products?.image_url }
    else acc[name].quantity += item.quantity
    return acc
  }, {})
  const displayItems = groupedItems ? Object.values(groupedItems) : []

  // Lấy nhãn tiếng Việt
  const currentStatus = statusMap[order.status] || { label: order.status, color: 'bg-slate-100 text-slate-500' }

  return (
    <div className={`${beVietnam.className} max-w-5xl mx-auto pb-20 pt-10 px-4 antialiased`}>
      <div className="flex justify-between items-center mb-10">
        <button onClick={() => router.back()} className="text-[10px] font-black text-slate-400 uppercase hover:text-slate-800 transition">← Danh sách đơn</button>
        <div className="flex gap-4">
          <button onClick={() => window.print()} className="px-6 py-2 bg-slate-50 text-slate-500 rounded-xl font-black text-[10px] uppercase hover:bg-slate-200 transition">In hóa đơn</button>
          <button onClick={() => updateStatus('completed')} className="px-6 py-2 bg-green-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg shadow-green-100 hover:bg-green-700 transition">Hoàn thành ngay</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50">
            <div className="flex justify-between items-start mb-8">
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Chi tiết hàng hóa</h2>
               <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${currentStatus.color}`}>
                 {currentStatus.label}
               </div>
            </div>
            
            <div className="divide-y divide-slate-50">
              {displayItems.map((item: any, idx: number) => (
                <div key={idx} className="py-6 flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 shadow-inner">
                    {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-300 font-black">NULL</div>}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-slate-800 text-lg leading-tight line-clamp-2">{item.name}</p>
                    <p className="text-xs font-bold text-slate-400 mt-1">Đơn giá: {new Intl.NumberFormat('vi-VN').format(item.price_at_purchase)}đ</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-blue-600 uppercase mb-1 bg-blue-50 px-2 py-0.5 rounded inline-block">x{item.quantity}</p>
                    <p className="font-black text-slate-900 text-lg">{new Intl.NumberFormat('vi-VN').format(item.price_at_purchase * item.quantity)}đ</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t-4 border-double border-slate-100 flex justify-between items-center text-slate-900">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng thanh toán</p>
              <p className="text-3xl font-black tracking-tighter">
                {new Intl.NumberFormat('vi-VN').format(order.total_price)}đ
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Ghi chú vận chuyển</h3>
            <p className="text-slate-600 font-bold italic text-sm">
              {order.note || "Không có ghi chú nào cho đơn hàng này."}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50">
            <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-widest mb-8">Khách hàng</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Họ và tên</label>
                <p className="text-lg font-black text-slate-800 mt-1">{order.customer_name}</p>
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Liên hệ</label>
                <p className="text-lg font-black text-blue-600 mt-1">{order.customer_phone}</p>
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Địa chỉ nhận</label>
                <p className="font-bold text-slate-600 mt-2 leading-relaxed text-sm">{order.customer_address}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
            <h3 className="font-black uppercase text-[10px] tracking-widest mb-6 text-slate-500">Cập nhật đơn hàng</h3>
            <div className="grid grid-cols-1 gap-3">
              <button disabled={updating} onClick={() => updateStatus('confirmed')} className="w-full py-4 bg-slate-800 rounded-2xl font-black text-[10px] uppercase hover:bg-blue-600 transition tracking-widest">Xác nhận đơn</button>
              <button disabled={updating} onClick={() => updateStatus('shipping')} className="w-full py-4 bg-slate-800 rounded-2xl font-black text-[10px] uppercase hover:bg-purple-600 transition tracking-widest">Đang giao hàng</button>
              <button disabled={updating} onClick={() => updateStatus('cancelled')} className="w-full py-4 bg-slate-800 rounded-2xl font-black text-[10px] uppercase hover:bg-red-600 transition text-red-400 hover:text-white tracking-widest">Hủy đơn hàng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}