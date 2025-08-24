"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FileText,
  ImageIcon,
  Video,
  Tag,
  FolderOpen,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  Plus,
  TrendingUp,
  Users,
  Eye,
  MessageSquare,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const sidebarItems = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard", active: true },
  { icon: FileText, label: "Posts", href: "/dashboard/posts", count: 24 },
  { icon: ImageIcon, label: "Banners", href: "/dashboard/banners", count: 8 },
  { icon: Video, label: "Web Stories", href: "/dashboard/webstories", count: 12 },
  { icon: FolderOpen, label: "Categories", href: "/dashboard/categories", count: 6 },
  { icon: Tag, label: "Tags", href: "/dashboard/tags", count: 45 },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

const statsCards = [
  {
    title: "Total Posts",
    value: "2,847",
    change: "+12%",
    trend: "up",
    icon: FileText,
    description: "Published articles",
  },
  {
    title: "Page Views",
    value: "1.2M",
    change: "+8%",
    trend: "up",
    icon: Eye,
    description: "This month",
  },
  {
    title: "Active Users",
    value: "45.2K",
    change: "+23%",
    trend: "up",
    icon: Users,
    description: "Monthly active",
  },
  {
    title: "Comments",
    value: "892",
    change: "-3%",
    trend: "down",
    icon: MessageSquare,
    description: "This week",
  },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">NewsPortal</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {sidebarItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {item.count && (
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
                <Button variant="ghost" className="w-full justify-start gap-2 h-auto p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/admin-avatar.png" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">Admin User</span>
                    <span className="text-muted-foreground">admin@news.com</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
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
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your news portal.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className={`h-3 w-3 ${stat.trend === "up" ? "text-primary" : "text-destructive"}`} />
                <span className={`font-medium ${stat.trend === "up" ? "text-primary" : "text-destructive"}`}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Latest published articles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Breaking News: Technology Advances</p>
                  <p className="text-xs text-muted-foreground">Published 2 hours ago</p>
                </div>
                <Badge variant="secondary">Published</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
            <CardDescription>Most viewed content categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Technology", count: "1.2K views", color: "bg-chart-1" },
              { name: "Sports", count: "890 views", color: "bg-chart-2" },
              { name: "Politics", count: "756 views", color: "bg-chart-3" },
              { name: "Entertainment", count: "623 views", color: "bg-chart-4" },
            ].map((category) => (
              <div key={category.name} className="flex items-center gap-4">
                <div className={`h-3 w-3 rounded-full ${category.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{category.name}</p>
                  <p className="text-xs text-muted-foreground">{category.count}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
