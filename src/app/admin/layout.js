import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { headers } from 'next/headers'

export default async function AdminLayout({ children }) {
    const headersList = await headers()
    const isLoginPage = headersList.get('x-is-login-page') === 'true'

    // Skip session check and layout for login page
    if (isLoginPage) {
        return <>{children}</>
    }

    const session = await getSession()

    if (!session) {
        redirect('/admin/login')
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto bg-white md:ml-72">
                <div className="min-h-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
