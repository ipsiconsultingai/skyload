# 사용자 관리 오류.

GET /admin/users 200 in 413ms (compile: 305ms, proxy.ts: 95ms, render: 13ms)
GET /manifest.webmanifest 200 in 7ms (compile: 2ms, proxy.ts: 3ms, render: 1703µs)
⨯ Error: supabaseKey is required.
at createAdminClient (libs/supabase/admin.ts:4:15)
at GET (app/api/admin/users/route.ts:78:42)
2 |
3 | export const createAdminClient = () =>

> 4 | createClient(

    |               ^

5 | process.env.NEXT_PUBLIC_SUPABASE_URL!,
6 | process.env.SUPABASE_SERVICE_ROLE_KEY!,
7 | { auth: { autoRefreshToken: false, persistSession: false } }
GET /api/admin/users?page=1&limit=20 500 in 327ms (compile: 89ms, proxy.ts: 57ms, render: 181ms)
⨯ Error: supabaseKey is required.
at createAdminClient (libs/supabase/admin.ts:4:15)
at GET (app/api/admin/users/route.ts:78:42)
2 |
3 | export const createAdminClient = () =>

> 4 | createClient(

    |               ^

5 | process.env.NEXT_PUBLIC_SUPABASE_URL!,
6 | process.env.SUPABASE_SERVICE_ROLE_KEY!,
7 | { auth: { autoRefreshToken: false, persistSession: false } }
GET /api/admin/users?page=1&limit=20 500 in 181ms (compile: 1699µs, proxy.ts: 45ms, render: 134ms)

# 생기부 관리에서 상세 보기시 정보가 없음.
