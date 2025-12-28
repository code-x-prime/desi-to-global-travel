import * as React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const Sidebar = React.forwardRef(({ className, ...props }, ref) => (
    <aside
        ref={ref}
        className={cn(
            "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background transition-transform",
            className
        )}
        {...props}
    />
))
Sidebar.displayName = "Sidebar"

const SidebarNav = ({ items, className }) => {
    const pathname = usePathname()

    return (
        <nav className={cn("space-y-1 p-4", className)}>
            {items.map((item) => {
                const isActive = pathname === item.href
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        {item.icon && <item.icon className="h-5 w-5" />}
                        {item.label}
                    </Link>
                )
            })}
        </nav>
    )
}

export { Sidebar, SidebarNav }

