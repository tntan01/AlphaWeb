'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Be_Vietnam_Pro } from 'next/font/google'
import Link from 'next/link'

const beVietnam = Be_Vietnam_Pro({
    subsets: ['vietnamese'],
    weight: ['400', '700', '900'],
    display: 'swap',
})

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function BrandManager() {
    const [brands, setBrands] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const pageSize = 10
    const totalPages = Math.ceil(totalCount / pageSize)

    const fetchBrands = async () => {
        setLoading(true)
        let query = supabase.from('brands').select('*', { count: 'exact' })
        if (searchTerm) query = query.ilike('name', `%${searchTerm}%`)
        const from = (currentPage - 1) * pageSize
        const to = from + pageSize - 1
        const { data, count, error } = await query.order('name', { ascending: true }).range(from, to)
        if (!error && data) {
            setBrands(data)
            if (count !== null) setTotalCount(count)
        }
        setLoading(false)
    }

    useEffect(() => { fetchBrands() }, [currentPage])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1)
        fetchBrands()
    }

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Xóa hãng "${name}"? Các sản phẩm thuộc hãng này sẽ bị mất liên kết!`)) {
            const { error } = await supabase.from('brands').delete().eq('id', id)
            if (!error) fetchBrands()
        }
    }

    const stripHtml = (html: string) => {
        if (!html) return '';
        return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
    };

    return (
        <div className={`${beVietnam.className} space-y-8 antialiased pb-20 p-8 bg-[#f8fafc] min-h-screen`}>
            {/* HEADER */}
            <div className="flex justify-between items-center max-w-[1440px] mx-auto">
                <div>
                    <h1 className="text-3xl font-[900] text-slate-800 tracking-tighter uppercase italic">Thương hiệu</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 bg-white inline-block px-4 py-1 rounded-full shadow-sm border border-slate-100">
                        Số thương hiệu hiện có ({totalCount})
                    </p>
                </div>
                <button
                    onClick={() => router.push('/admin/brands/add')}
                    className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-100 active:scale-95"
                >
                    + Thêm thương hiệu mới
                </button>
            </div>

            {/* BỘ LỌC */}
            <div className="max-w-[1440px] mx-auto bg-white p-2 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 border border-white">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Tìm tên thương hiệu..."
                        className="flex-1 p-5 bg-slate-50 border-none rounded-[2rem] outline-none font-bold text-base focus:ring-2 focus:ring-blue-100 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="bg-slate-900 text-white px-12 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition shadow-lg">
                        Tìm kiếm
                    </button>
                </form>
            </div>

            {/* LƯỚI DỮ LIỆU */}
            <div className="max-w-[1440px] mx-auto bg-white rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] border border-white overflow-hidden">
                <table className="w-full text-left table-fixed border-collapse">
                    <thead className="bg-[#f8fafc] border-b border-slate-100">
                        <tr>
                            <th className="py-6 px-10 text-[11px] font-[900] text-slate-400 uppercase tracking-[0.25em] text-left whitespace-nowrap w-[45%]">Thương hiệu & Logo</th>
                            <th className="py-6 px-6 text-[11px] font-[900] text-slate-400 uppercase tracking-[0.25em] text-left whitespace-nowrap w-[15%]">Đường dẫn</th>
                            <th className="py-6 px-6 text-[11px] font-[900] text-slate-400 uppercase tracking-[0.25em] text-left whitespace-nowrap w-[25%]">Giới thiệu</th>
                            <th className="py-6 px-10 text-[11px] font-[900] text-slate-400 uppercase tracking-[0.25em] text-left whitespace-nowrap w-[15%]">Quản lý</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan={4} className="p-32 text-center font-black text-slate-300 animate-pulse text-xs uppercase">Đang đồng bộ Alpha...</td></tr>
                        ) : brands.map((brand) => (
                            <tr key={brand.id} className="hover:bg-slate-50/40 transition-all group">
                                <td className="py-6 px-10 text-left">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex-shrink-0 flex items-center justify-center p-3 shadow-sm group-hover:shadow-md transition-all group-hover:scale-105">
                                            {brand.logo_url ? (
                                                <img src={brand.logo_url} className="max-w-full max-h-full object-contain" alt={brand.name} />
                                            ) : (
                                                <span className="text-[8px] font-black text-slate-200 uppercase">Logo</span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-[900] text-slate-800 text-lg uppercase tracking-tight italic leading-tight">{brand.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 px-6 text-left">
                                    <span className="text-[10px] font-mono bg-white text-slate-400 px-3 py-2 rounded-xl border border-slate-100">
                                        /{brand.slug}
                                    </span>
                                </td>
                                <td className="py-6 px-6 text-left">
                                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed break-words line-clamp-2">
                                        {brand.description ? stripHtml(brand.description) : 'Chưa có mô tả.'}
                                    </p>
                                </td>
                                <td className="py-6 px-10 text-left">
                                    <div className="flex items-center justify-start gap-6">
                                        <Link
                                            href={`/admin/brands/${brand.id}`}
                                            className="text-blue-600 font-[900] text-[11px] uppercase tracking-widest hover:underline underline-offset-8 decoration-2"
                                        >
                                            Sửa
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(brand.id, brand.name)}
                                            className="text-red-200 hover:text-red-600 font-[900] text-[11px] uppercase tracking-widest transition-colors"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* PHÂN TRANG */}
                <div className="p-10 bg-[#f8fafc]/50 border-t border-slate-100 flex justify-between items-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                        TỔNG SỐ: <span className="text-slate-800 not-italic">{totalCount}</span> THƯƠNG HIỆU
                    </p>
                    <div className="flex items-center gap-10">
                        <p className="text-xs font-black text-blue-600 uppercase italic">Trang {currentPage} / {totalPages || 1}</p>
                        <div className="flex gap-4">
                            <button disabled={currentPage === 1 || loading} onClick={() => setCurrentPage(p => p - 1)} className="px-10 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-[10px] font-black uppercase hover:bg-slate-100 transition shadow-sm active:scale-95">Trước</button>
                            <button disabled={currentPage >= totalPages || loading} onClick={() => setCurrentPage(p => p + 1)} className="px-10 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-[10px] font-black uppercase hover:bg-slate-100 transition shadow-sm active:scale-95">Sau</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}