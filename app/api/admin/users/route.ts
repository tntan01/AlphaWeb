import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Dùng Service Role Key để có quyền Admin tối cao (Chỉ chạy ở Server)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { email, password, full_name, role, permissions } = await req.json()

    // 1. Tạo User trong hệ thống Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name }
    })

    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })

    // 2. Cập nhật thông tin vào bảng profiles (đã có trigger tạo sẵn hoặc tạo mới)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        full_name,
        role,
        permissions,
        is_active: true,
        email // Lưu email để dễ quản lý
      })
      .eq('id', authUser.user.id)

    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 })

    return NextResponse.json({ message: 'Tạo nhân viên thành công!' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}