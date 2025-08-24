"use client"

import { useAuthStore } from "@/lib/auth-store"
import { useContentStore } from "@/lib/content-store"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, ImageIcon, Video, FolderTree, Users, BarChart3, TrendingUp, Eye } from "lucide-react"

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const {
    posts,
    banners,
    webstories,
    categories,
    tags,
    summary,
    fetchSummary,
    fetchContentOverview,
    contentOverview,
  } = useContentStore()

  useEffect(() => {
    // fetchPosts()
    // fetchBanners()
    // fetchWebStories()
    // fetchCategories()
    // fetchTags()
    fetchContentOverview()
    fetchSummary()
  }, [])

  const recentActivity = [
    { action: "New post published", item: "Breaking News: Tech Update", time: "2 hours ago" },
    { action: "Banner updated", item: "Homepage Hero Banner", time: "4 hours ago" },
    { action: "Web story created", item: "Sports Highlights", time: "6 hours ago" },
    { action: "Category added", item: "Technology", time: "1 day ago" },
  ]

  return (
    <div className="space-y-6 mt-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name || "Admin"}</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your news portal today.</p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {user?.role === "super_admin" ? "Super Admin" : "Admin"}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{summary?.totalPostsThisMonth}</div>
            <p className="text-xs text-muted-foreground">Artigos publicados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Banners ativos</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{summary?.activeBannersThisMonth}</div>
            <p className="text-xs text-muted-foreground">Atualmente exibidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Web Stories</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{summary?.webStoriesThisMonth}</div>
            <p className="text-xs text-muted-foreground">Histórias interativas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categorias</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{summary?.categoriesThisMonth}</div>
            <p className="text-xs text-muted-foreground">Categorias de conteúdo</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Create New Post
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <ImageIcon className="mr-2 h-4 w-4" />
              Manage Banners
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Video className="mr-2 h-4 w-4" />
              Add Web Story
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              User Management
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest changes and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground truncate">{activity.item}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Content Overview
          </CardTitle>
          <CardDescription>Summary of your content management system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Published Posts</span>
                <span className="text-sm font-medium">{contentOverview?.totalPublishedPosts || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Draft Posts</span>
                <span className="text-sm font-medium">{contentOverview?.totalDraftPosts || 0}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Banners</span>
                <span className="text-sm font-medium">{contentOverview?.activeBanners || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Tags</span>
                <span className="text-sm font-medium">{contentOverview?.totalTags || 0}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Web Stories</span>
                <span className="text-sm font-medium">{contentOverview?.webStories || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Categories</span>
                <span className="text-sm font-medium">{contentOverview?.totalCategories || 0}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
