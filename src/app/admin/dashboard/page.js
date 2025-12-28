import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, Image as ImageIcon, Mail, Globe, FolderTree, Plus, TrendingUp, CheckCircle2, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'
import { Badge } from '@/components/ui/badge'

async function getStats() {
    try {
        const [packages, galleryImages, inquiries, destinations, totalPackages, totalInquiries] = await Promise.all([
            prisma.tourPackage.count({ where: { isActive: true } }),
            prisma.galleryImage.count({ where: { isActive: true } }),
            prisma.inquiry.count({ where: { isRead: false } }),
            prisma.destination.count({ where: { isActive: true } }),
            prisma.tourPackage.count(),
            prisma.inquiry.count(),
        ])

        return { packages, galleryImages, inquiries, destinations, totalPackages, totalInquiries }
    } catch (error) {
        console.error('Error fetching stats:', error)
        return { packages: 0, galleryImages: 0, inquiries: 0, destinations: 0, totalPackages: 0, totalInquiries: 0 }
    }
}

async function getRecentInquiries() {
    try {
        return await prisma.inquiry.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                isRead: true,
                createdAt: true,
            },
        })
    } catch (error) {
        console.error('Error fetching recent inquiries:', error)
        return []
    }
}

function StatCardSkeleton() {
    return (
        <Card className="border-0 shadow-lg bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-14 w-14 rounded-xl" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-10 w-20 mb-2" />
                <Skeleton className="h-3 w-24" />
            </CardContent>
        </Card>
    )
}

function DashboardStats() {
    return (
        <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                    <StatCardSkeleton key={i} />
                ))}
            </div>
        }>
            <StatsContent />
        </Suspense>
    )
}

async function StatsContent() {
    const stats = await getStats()

    const statCards = [
        {
            title: 'Active Packages',
            value: stats.packages,
            total: stats.totalPackages,
            icon: Package,
            gradient: 'from-[#0d3980] to-[#1a4fa0]',
            bgGradient: 'from-[#0d3980]/10 to-[#1a4fa0]/5',
            iconBg: 'bg-[#0d3980]/10',
            iconColor: 'text-[#0d3980]',
            link: '/admin/packages',
        },
        {
            title: 'Gallery Images',
            value: stats.galleryImages,
            total: null,
            icon: ImageIcon,
            gradient: 'from-[#33baea] to-[#4ac8f0]',
            bgGradient: 'from-[#33baea]/10 to-[#4ac8f0]/5',
            iconBg: 'bg-[#33baea]/10',
            iconColor: 'text-[#33baea]',
            link: '/admin/gallery',
        },
        {
            title: 'Unread Inquiries',
            value: stats.inquiries,
            total: stats.totalInquiries,
            icon: Mail,
            gradient: 'from-[#f9c701] to-[#ffd633]',
            bgGradient: 'from-[#f9c701]/10 to-[#ffd633]/5',
            iconBg: 'bg-[#f9c701]/10',
            iconColor: 'text-[#f9c701]',
            link: '/admin/inquiries',
            badge: stats.inquiries > 0 ? 'New' : null,
        },
        {
            title: 'Destinations',
            value: stats.destinations,
            total: null,
            icon: Globe,
            gradient: 'from-[#33baea] to-[#0d3980]',
            bgGradient: 'from-[#33baea]/10 to-[#0d3980]/5',
            iconBg: 'bg-[#33baea]/10',
            iconColor: 'text-[#33baea]',
            link: '/admin/destinations',
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {statCards.map((stat) => {
                const Icon = stat.icon
                return (
                    <Link key={stat.title} href={stat.link}>
                        <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-full bg-white group overflow-hidden relative">
                            {/* Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                            <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-xs sm:text-sm font-semibold text-gray-600 font-sans mb-1 truncate">
                                        {stat.title}
                                    </CardTitle>
                                    {stat.badge && (
                                        <Badge className="bg-red-500 text-white text-xs font-sans px-2 py-0.5">
                                            {stat.badge}
                                        </Badge>
                                    )}
                                </div>
                                <div className={`h-12 w-12 sm:h-14 sm:w-14 ${stat.iconBg} group-hover:scale-110 transition-transform duration-300 flex items-center justify-center rounded-xl relative z-10 flex-shrink-0`}>
                                    <Icon className={`h-5 w-5 sm:h-7 sm:w-7 ${stat.iconColor}`} />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <div className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent font-serif`}>
                                        {stat.value}
                                    </div>
                                    {stat.total !== null && stat.total !== stat.value && (
                                        <span className="text-xs sm:text-sm text-gray-400 font-sans">
                                            / {stat.total}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <CardDescription className="text-xs font-sans">
                                        Click to manage
                                    </CardDescription>
                                    <ArrowRight className="h-3 w-3 text-gray-400 group-hover:text-[#0d3980] group-hover:translate-x-1 transition-all duration-300" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )
            })}
        </div>
    )
}

async function RecentInquiries() {
    const inquiries = await getRecentInquiries()

    if (inquiries.length === 0) {
        return (
            <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-sans text-sm">No inquiries yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-2 sm:space-y-3">
            {inquiries.map((inquiry) => (
                <Link
                    key={inquiry.id}
                    href="/admin/inquiries"
                    className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-md flex items-center justify-center flex-shrink-0 ${inquiry.isRead ? 'bg-gray-100' : 'bg-[#f9c701]/10'}`}>
                            <Mail className={`h-4 w-4 sm:h-5 sm:w-5 ${inquiry.isRead ? 'text-gray-400' : 'text-[#f9c701]'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-gray-900 font-sans truncate">
                                {inquiry.name}
                            </p>
                            <p className="text-xs text-gray-500 font-sans truncate">
                                {inquiry.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        {!inquiry.isRead && (
                            <Badge className="bg-red-500 text-white text-xs">New</Badge>
                        )}
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-[#0d3980] group-hover:translate-x-1 transition-all" />
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default async function AdminDashboard() {
    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-full">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#0d3980] mb-2">
                            Dashboard
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 font-sans">
                            Welcome back! Here&apos;s what&apos;s happening with your travel business.
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-sans text-gray-700">All systems operational</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <DashboardStats />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Quick Actions */}
                <Card className="border-0 shadow-lg bg-white lg:col-span-2">
                    <CardHeader className="border-b border-gray-100 p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg sm:text-xl font-serif font-bold text-[#0d3980] flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                                Quick Actions
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <Button asChild className="h-auto p-3 sm:p-4 justify-start bg-gradient-to-r from-[#0d3980] to-[#1a4fa0] hover:from-[#0a2d66] hover:to-[#0d3980] text-white font-sans shadow-lg hover:shadow-xl transition-all text-sm sm:text-base">
                                <Link href="/admin/packages/new">
                                    <div className="flex items-center gap-2 sm:gap-3 w-full">
                                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        <div className="text-left min-w-0 flex-1">
                                            <div className="font-semibold text-xs sm:text-sm">Add New Package</div>
                                            <div className="text-xs text-white/80 hidden sm:block">Create a tour package</div>
                                        </div>
                                    </div>
                                </Link>
                            </Button>

                            <Button asChild variant="outline" className="h-auto p-3 sm:p-4 justify-start border-2 border-[#33baea] text-[#33baea] hover:bg-[#33baea]/10 font-sans hover:border-[#33baea] transition-all text-sm sm:text-base">
                                <Link href="/admin/gallery/upload">
                                    <div className="flex items-center gap-2 sm:gap-3 w-full">
                                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-[#33baea]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        <div className="text-left min-w-0 flex-1">
                                            <div className="font-semibold text-xs sm:text-sm">Upload Images</div>
                                            <div className="text-xs text-gray-500 hidden sm:block">Add to gallery</div>
                                        </div>
                                    </div>
                                </Link>
                            </Button>

                            <Button asChild variant="outline" className="h-auto p-3 sm:p-4 justify-start border-2 border-[#0d3980] text-[#0d3980] hover:bg-[#0d3980]/10 font-sans hover:border-[#0d3980] transition-all text-sm sm:text-base">
                                <Link href="/admin/destinations/new">
                                    <div className="flex items-center gap-2 sm:gap-3 w-full">
                                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-[#0d3980]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        <div className="text-left min-w-0 flex-1">
                                            <div className="font-semibold text-xs sm:text-sm">Add Destination</div>
                                            <div className="text-xs text-gray-500 hidden sm:block">Create new destination</div>
                                        </div>
                                    </div>
                                </Link>
                            </Button>

                            <Button asChild variant="outline" className="h-auto p-3 sm:p-4 justify-start border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-sans transition-all text-sm sm:text-base">
                                <Link href="/admin/categories/new">
                                    <div className="flex items-center gap-2 sm:gap-3 w-full">
                                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FolderTree className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        <div className="text-left min-w-0 flex-1">
                                            <div className="font-semibold text-xs sm:text-sm">Add Category</div>
                                            <div className="text-xs text-gray-500 hidden sm:block">Organize content</div>
                                        </div>
                                    </div>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Inquiries */}
                <Card className="border-0 shadow-lg bg-white">
                    <CardHeader className="border-b border-gray-100 p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg sm:text-xl font-serif font-bold text-[#0d3980] flex items-center gap-2">
                                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                                Recent Inquiries
                            </CardTitle>
                            <Link href="/admin/inquiries" className="text-xs text-[#33baea] hover:text-[#0d3980] font-sans font-semibold">
                                View All
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                        <Suspense fallback={
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Skeleton className="h-10 w-10 rounded-md" />
                                        <div className="flex-1">
                                            <Skeleton className="h-4 w-32 mb-2" />
                                            <Skeleton className="h-3 w-40" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }>
                            <RecentInquiries />
                        </Suspense>
                    </CardContent>
                </Card>
            </div>

            {/* System Status */}
            <div className="mt-4 sm:mt-6">
                <Card className="border-0 shadow-lg bg-white">
                    <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-lg sm:text-xl font-serif font-bold text-[#0d3980] flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                            System Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs sm:text-sm font-semibold text-gray-900 font-sans">Database</p>
                                    <p className="text-xs text-green-600 font-sans">Connected</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs sm:text-sm font-semibold text-gray-900 font-sans">Storage</p>
                                    <p className="text-xs text-blue-600 font-sans">Active</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs sm:text-sm font-semibold text-gray-900 font-sans">Email Service</p>
                                    <p className="text-xs text-purple-600 font-sans">Ready</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
