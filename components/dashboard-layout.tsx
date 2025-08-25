"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, ImageIcon, Video, Tag, FolderOpen, BarChart3, Settings, LogOut, Menu, Search, Plus, UserCircle2, FocusIcon } from "lucide-react"
import { useContentStore } from "@/lib/content-store"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  const { user, logout } = useAuthStore()
  const { totalCounts, fetchTotalCounts } = useContentStore()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", href: "/admin" },
    { icon: FileText, label: "Posts", href: "/admin/posts", count: totalCounts?.totalPosts },
    { icon: ImageIcon, label: "Banners", href: "/admin/banners", count: totalCounts?.totalBanners },
    { icon: Video, label: "Web Stories", href: "/admin/webstories", count: totalCounts?.totalWebStories },
    { icon: FolderOpen, label: "Categorias", href: "/admin/categories", count: totalCounts?.totalCategories },
    { icon: Tag, label: "Tags", href: "/admin/tags", count: totalCounts?.totalTags },
    { icon: FocusIcon, label: "Fato em foco", href: "/admin/relevants", count: totalCounts?.totalRelevants },
    { icon: UserCircle2, label: "Usuários", href: "/admin/users", count: totalCounts?.totalUsers },
    { icon: Settings, label: "Configurações", href: "/admin/settings" },
  ]


  useEffect(() => {
    fetchTotalCounts()
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">Portal FPA | Admin</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {sidebarItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${item.href == pathname
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {typeof item.count != 'undefined' && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.count}
                  </Badge>
                )}
              </a>
            ))}
          </nav>

          {/* User Profile */}
          <div className="border-t border-sidebar-border p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="cursor-pointer group w-full justify-start gap-2 h-auto p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/admin-avatar.png" />
                    <AvatarFallback>{user?.name?.charAt(0) || "A"}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">{user?.name || "Admin User"}</span>
                    <span className="text-muted-foreground group-hover:text-gray-400">{user?.email || "admin@news.com"}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/admin/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search posts, categories..."
                className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" className="gap-2 cursor-pointer" onClick={() => router.push("/admin/posts/new")}>
              <Plus className="h-4 w-4" />
              Nova matéria
            </Button>
            {/* <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button> */}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}