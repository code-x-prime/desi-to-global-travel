'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, Image as ImageIcon, Mail, LogOut, Globe, FolderTree, Star, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'
import { motion } from 'framer-motion'

const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/packages', label: 'Tour Packages', icon: Package },
    { href: '/admin/destinations', label: 'Destinations', icon: Globe },
    { href: '/admin/categories', label: 'Categories', icon: FolderTree },
    { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
    { href: '/admin/home-content', label: 'Home Content', icon: Star },
    { href: '/admin/inquiries', label: 'Inquiries', icon: Mail },
]

function SidebarContent({ onLinkClick }) {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
            router.push('/admin/login')
            router.refresh()
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Premium Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-[#0d3980] via-[#0d3980] to-[#1a4fa0] relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#33baea]/10 rounded-full blur-2xl" />

                <div className="relative z-10 flex items-center gap-4">

                    <div>
                        <h1 className="text-xl font-serif font-bold text-white mb-0.5">Admin Panel</h1>
                        <p className="text-xs text-white/90 font-sans font-medium">Desi To Global Travel</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                {navItems.map((item, index) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                    const Icon = item.icon
                    return (
                        <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                href={item.href}
                                onClick={onLinkClick}
                                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive
                                    ? 'bg-gradient-to-r from-[#0d3980] to-[#1a4fa0] text-white shadow-lg shadow-[#0d3980]/25'
                                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-[#0d3980]'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#0d3980] group-hover:scale-110'}`} />
                                <span className="font-sans font-semibold text-sm">{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="ml-auto h-2 w-2 bg-white rounded-full"
                                    />
                                )}
                            </Link>
                        </motion.div>
                    )
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 font-sans font-semibold transition-all duration-300 rounded-xl group"
                >
                    <LogOut className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                    Logout
                </Button>
            </div>
        </div>
    )
}

export function AdminSidebar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-72 bg-white border-r border-gray-100 shadow-lg fixed left-0 top-0 h-screen flex-col z-40">
                <SidebarContent />
            </aside>

            {/* Mobile Menu Button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-11 w-11 bg-white/95 backdrop-blur-sm border-2 border-gray-200 shadow-lg hover:bg-white hover:border-[#0d3980] transition-all duration-300 rounded-xl"
                        >
                            <Menu className="h-5 w-5 text-[#0d3980]" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0 bg-white border-r border-gray-100">
                        <SidebarContent onLinkClick={() => setMobileMenuOpen(false)} />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}
