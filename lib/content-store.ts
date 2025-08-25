import { create } from "zustand"
import * as postsService from "@/services/posts"
import * as bannersService from "@/services/banners"
import * as webstoriesService from "@/services/webstories"
import * as categoriesService from "@/services/categories"
import * as tagsService from "@/services/tags"
import { DashboardContentOverview, DashboardMonthlySummary, DashboardTotalCounts, getDashboardContentOverview, getDashboardMonthlySummary, getDashboardTotalCounts } from "@/services/dashboard"

interface ContentState {
  // Posts state
  posts: postsService.Post[]
  currentPost: postsService.Post | null
  postsLoading: boolean
  postsError: string | null
  postsPagination: {
    total: number
    page: number
    limit: number
  }

  // Banners state
  banners: bannersService.Banner[]
  bannersLoading: boolean
  bannersError: string | null

  // Web Stories state
  webstories: webstoriesService.WebStory[]
  webstoriesLoading: boolean
  webstoriesError: string | null
  webstoriesPagination: {
    total: number
    page: number
    limit: number
  }

  // Categories state
  categories: categoriesService.Category[]
  categoriesTree: categoriesService.Category[]
  categoriesLoading: boolean
  categoriesError: string | null

  // Tags state
  tags: tagsService.Tag[]
  popularTags: tagsService.Tag[]
  tagsLoading: boolean
  tagsError: string | null

  summaryLoading: boolean
  summary: DashboardMonthlySummary | null
  fetchSummary: () => Promise<void>
  summaryError: string | null

  contentOverviewLoading: boolean
  contentOverview: DashboardContentOverview | null
  fetchContentOverview: () => Promise<void>
  contentOverviewError: string | null

  totalCountsLoading: boolean
  totalCounts: DashboardTotalCounts | null
  fetchTotalCounts: () => Promise<void>
  totalCountsError: string | null

  // Posts actions
  fetchPosts: (params?: any) => Promise<void>
  fetchPost: (id: string) => Promise<void>
  createPost: (data: postsService.CreatePostData) => Promise<void>
  updatePost: (data: postsService.UpdatePostData) => Promise<void>
  deletePost: (id: string) => Promise<void>
  uploadPostImage: (file: File) => Promise<string>

  // Banners actions
  fetchBanners: () => Promise<void>
  createBanner: (data: FormData) => Promise<void>
  updateBanner: (data: bannersService.UpdateBannerData) => Promise<void>
  deleteBanner: (id: string) => Promise<void>
  reorderBanners: (id: string, newIndex: number) => Promise<void>
  uploadBannerImage: (file: File) => Promise<string>

  // Web Stories actions
  fetchWebStories: (params?: any) => Promise<void>
  createWebStory: (data: webstoriesService.CreateWebStoryData) => Promise<void>
  updateWebStory: (data: webstoriesService.UpdateWebStoryData) => Promise<void>
  deleteWebStory: (id: string) => Promise<void>
  uploadWebStoryVideo: (
    file: File,
    onProgress?: (progress: number) => void,
  ) => Promise<{ url: string; duration: number }>
  uploadWebStoryCover: (file: File) => Promise<string>
  reorderWebstories: (id: string, newIndex: number) => Promise<void>

  // Categories actions
  fetchCategories: (params?: any) => Promise<void>
  fetchCategoriesTree: () => Promise<void>
  createCategory: (data: categoriesService.CreateCategoryData) => Promise<void>
  updateCategory: (data: categoriesService.UpdateCategoryData) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  reorderCategories: (id: string, newIndex: number) => Promise<void>

  // Tags actions
  fetchTags: (params?: any) => Promise<void>
  fetchPopularTags: (limit?: number) => Promise<void>
  searchTags: (query: string) => Promise<tagsService.Tag[]>
  createTag: (data: tagsService.CreateTagData) => Promise<void>
  updateTag: (data: tagsService.UpdateTagData) => Promise<void>
  deleteTag: (id: string) => Promise<void>

  // Utility actions
  clearErrors: () => void
}

export const useContentStore = create<ContentState>((set, get) => ({
  // Initial state
  posts: [],
  currentPost: null,
  postsLoading: false,
  postsError: null,
  postsPagination: { total: 0, page: 1, limit: 10 },

  banners: [],
  bannersLoading: false,
  bannersError: null,

  webstories: [],
  webstoriesLoading: false,
  webstoriesError: null,
  webstoriesPagination: { total: 0, page: 1, limit: 10 },

  categories: [],
  categoriesTree: [],
  categoriesLoading: false,
  categoriesError: null,

  tags: [],
  popularTags: [],
  tagsLoading: false,
  tagsError: null,

  summaryLoading: false,
  summary: null,
  summaryError: null,

  fetchSummary: async () => {
    set({ summaryLoading: true, summaryError: null })
    try {
      const data = await getDashboardMonthlySummary()
      set({ summary: data, summaryLoading: false })
    } catch (error: any) {
      set({
        summaryLoading: false,
        summaryError: error?.response?.data?.message || "Failed to fetch dashboard summary.",
      })
    }
  },

  contentOverviewLoading: false,
  contentOverview: null,
  contentOverviewError: null,

  fetchContentOverview: async () => {
    set({ contentOverviewLoading: true, contentOverviewError: null })
    try {
      const data = await getDashboardContentOverview()
      set({ contentOverview: data, contentOverviewLoading: false })
    } catch (error: any) {
      set({
        contentOverviewLoading: false,
        contentOverviewError: error?.response?.data?.message || "Failed to fetch dashboard content Overview.",
      })
    }
  },

  totalCountsLoading: false,
  totalCounts: null,
  totalCountsError: null,

  fetchTotalCounts: async () => {
    set({ totalCountsLoading: true, totalCountsError: null })
    try {
      const data = await getDashboardTotalCounts()
      set({ totalCounts: data, totalCountsLoading: false })
    } catch (error: any) {
      set({
        totalCountsLoading: false,
        totalCountsError: error?.response?.data?.message || "Failed to fetch dashboard content Overview.",
      })
    }
  },

  // Posts actions
  fetchPosts: async (params) => {
    set({ postsLoading: true, postsError: null })
    try {
      const response = await postsService.getPosts(params)
      set({
        posts: response.posts,
        postsPagination: {
          total: response.total,
          page: response.page,
          limit: response.limit,
        },
        postsLoading: false,
      })
    } catch (error: any) {
      set({
        postsLoading: false,
        postsError: error.response?.data?.message || "Failed to fetch posts",
      })
    }
  },

  fetchPost: async (id: string) => {
    set({ postsLoading: true, postsError: null })
    try {
      const post = await postsService.getPost(id)
      set({ currentPost: post, postsLoading: false })
    } catch (error: any) {
      set({
        postsLoading: false,
        postsError: error.response?.data?.message || "Failed to fetch post",
      })
    }
  },

  createPost: async (data) => {
    set({ postsLoading: true, postsError: null })
    try {
      const newPost = await postsService.createPost(data)
      set((state) => ({
        posts: [newPost, ...state.posts],
        postsLoading: false,
      }))
    } catch (error: any) {
      set({
        postsLoading: false,
        postsError: error.response?.data?.message || "Failed to create post",
      })
      throw error
    }
  },

  updatePost: async (data) => {
    set({ postsLoading: true, postsError: null })
    try {
      const updatedPost = await postsService.updatePost(data)
      set((state) => ({
        posts: state.posts.map((post) => (post.id === data.id ? updatedPost : post)),
        currentPost: state.currentPost?.id === data.id ? updatedPost : state.currentPost,
        postsLoading: false,
      }))
    } catch (error: any) {
      set({
        postsLoading: false,
        postsError: error.response?.data?.message || "Failed to update post",
      })
      throw error
    }
  },

  deletePost: async (id: string) => {
    set({ postsLoading: true, postsError: null })
    try {
      await postsService.deletePost(id)
      set((state) => ({
        posts: state.posts.filter((post) => post.id !== id),
        postsLoading: false,
      }))
    } catch (error: any) {
      set({
        postsLoading: false,
        postsError: error.response?.data?.message || "Failed to delete post",
      })
      throw error
    }
  },

  uploadPostImage: async (file: File) => {
    try {
      const response = await postsService.uploadPostImage(file)
      return response.url
    } catch (error: any) {
      set({ postsError: error.response?.data?.message || "Failed to upload image" })
      throw error
    }
  },

  // Banners actions
  fetchBanners: async () => {
    set({ bannersLoading: true, bannersError: null })
    try {
      const banners = await bannersService.getBanners()
      set({ banners, bannersLoading: false })
    } catch (error: any) {
      set({
        bannersLoading: false,
        bannersError: error.response?.data?.message || "Failed to fetch banners",
      })
    }
  },

  createBanner: async (data) => {
    set({ bannersLoading: true, bannersError: null })
    try {
      const newBanner = await bannersService.createBanner(data)
      set((state) => ({
        banners: [...state.banners, newBanner],
        bannersLoading: false,
      }))
    } catch (error: any) {
      set({
        bannersLoading: false,
        bannersError: error.response?.data?.message || "Failed to create banner",
      })
      throw error
    }
  },

  updateBanner: async (data) => {
    set({ bannersLoading: true, bannersError: null })
    try {
      const updatedBanner = await bannersService.updateBanner(data)
      set((state) => ({
        banners: state.banners.map((banner) => (banner.id === data.id ? updatedBanner : banner)),
        bannersLoading: false,
      }))
    } catch (error: any) {
      set({
        bannersLoading: false,
        bannersError: error.response?.data?.message || "Failed to update banner",
      })
      throw error
    }
  },

  deleteBanner: async (id: string) => {
    set({ bannersLoading: true, bannersError: null })
    try {
      await bannersService.deleteBanner(id)
      set((state) => ({
        banners: state.banners.filter((banner) => banner.id !== id),
        bannersLoading: false,
      }))
    } catch (error: any) {
      set({
        bannersLoading: false,
        bannersError: error.response?.data?.message || "Failed to delete banner",
      })
      throw error
    }
  },

  reorderBanners: async (id: string, newIndex: number) => {
    set({ bannersLoading: true, bannersError: null })
    try {
      await bannersService.reorderBanners(id, newIndex)
      // Reorder banners in state to match the new order
      const { banners } = get()
      // const reorderedBanners = bannerIds.map((id) => banners.find((banner) => banner.id === id)!).filter(Boolean)
      // set({ banners: reorderedBanners, bannersLoading: false })
    } catch (error: any) {
      set({
        bannersLoading: false,
        bannersError: error.response?.data?.message || "Failed to reorder banners",
      })
      throw error
    }
  },

  uploadBannerImage: async (file: File) => {
    try {
      const response = await bannersService.uploadBannerImage(file)
      return response.url
    } catch (error: any) {
      set({ bannersError: error.response?.data?.message || "Failed to upload banner image" })
      throw error
    }
  },

  // Web Stories actions
  fetchWebStories: async (params) => {
    set({ webstoriesLoading: true, webstoriesError: null })
    try {
      const response = await webstoriesService.getWebStories(params)
      console.log('line 382:', response)
      set({
        webstories: response,
        webstoriesLoading: false,
      })
    } catch (error: any) {
      set({
        webstoriesLoading: false,
        webstoriesError: error.response?.data?.message || "Failed to fetch web stories",
      })
    }
  },

  createWebStory: async (data) => {
    set({ webstoriesLoading: true, webstoriesError: null })

    const formData = new FormData()
    formData.append("title", data.title)
    if (data.description) formData.append("description", data.description)
    formData.append("videoFile", data.videoFile!)
    if (data.coverFile) formData.append("coverFile", data.coverFile)

    try {
      const newWebStory = await webstoriesService.createWebStory(formData)
      set((state) => ({
        webstories: [newWebStory, ...state.webstories],
        webstoriesLoading: false,
      }))
    } catch (error: any) {
      set({
        webstoriesLoading: false,
        webstoriesError: error.response?.data?.message || "Failed to create web story",
      })
      throw error
    }
  },

  updateWebStory: async (data) => {
    set({ webstoriesLoading: true, webstoriesError: null })
    try {
      const updatedWebStory = await webstoriesService.updateWebStory(data)
      set((state) => ({
        webstories: state.webstories.map((story) => (story.id === data.id ? updatedWebStory : story)),
        webstoriesLoading: false,
      }))
    } catch (error: any) {
      set({
        webstoriesLoading: false,
        webstoriesError: error.response?.data?.message || "Failed to update web story",
      })
      throw error
    }
  },

  deleteWebStory: async (id: string) => {
    set({ webstoriesLoading: true, webstoriesError: null })
    try {
      await webstoriesService.deleteWebStory(id)
      set((state) => ({
        webstories: state.webstories.filter((story) => story.id !== id),
        webstoriesLoading: false,
      }))
    } catch (error: any) {
      set({
        webstoriesLoading: false,
        webstoriesError: error.response?.data?.message || "Failed to delete web story",
      })
      throw error
    }
  },

  uploadWebStoryVideo: async (file: File, onProgress) => {
    try {
      return await webstoriesService.uploadWebStoryVideo(file, onProgress)
    } catch (error: any) {
      set({ webstoriesError: error.response?.data?.message || "Failed to upload video" })
      throw error
    }
  },

  uploadWebStoryCover: async (file: File) => {
    try {
      const response = await webstoriesService.uploadWebStoryCover(file)
      return response.url
    } catch (error: any) {
      set({ webstoriesError: error.response?.data?.message || "Failed to upload cover image" })
      throw error
    }
  },
  reorderWebstories: async (id: string, newIndex: number) => {
    await webstoriesService.reorderWebstories(id, newIndex)
    const data = await webstoriesService.getWebStories()
    set({ webstories: data })
  },

  // Categories actions
  fetchCategories: async (params) => {
    set({ categoriesLoading: true, categoriesError: null })
    try {
      const response = await categoriesService.getCategories(params)
      set({ categories: response, categoriesLoading: false })
    } catch (error: any) {
      set({
        categoriesLoading: false,
        categoriesError: error.response?.data?.message || "Failed to fetch categories",
      })
    }
  },

  fetchCategoriesTree: async () => {
    set({ categoriesLoading: true, categoriesError: null })
    try {
      const categoriesTree = await categoriesService.getCategoriesTree()
      set({ categoriesTree, categoriesLoading: false })
    } catch (error: any) {
      set({
        categoriesLoading: false,
        categoriesError: error.response?.data?.message || "Failed to fetch categories tree",
      })
    }
  },

  createCategory: async (data) => {
    set({ categoriesLoading: true, categoriesError: null })
    try {
      const newCategory = await categoriesService.createCategory(data)
      set((state) => ({
        categories: [...state.categories, newCategory],
        categoriesLoading: false,
      }))
    } catch (error: any) {
      set({
        categoriesLoading: false,
        categoriesError: error.response?.data?.message || "Failed to create category",
      })
      throw error
    }
  },

  updateCategory: async (data) => {
    set({ categoriesLoading: true, categoriesError: null })
    try {
      const updatedCategory = await categoriesService.updateCategory(data)
      set((state) => ({
        categories: state.categories.map((category) => (category.id === data.id ? updatedCategory : category)),
        categoriesLoading: false,
      }))
    } catch (error: any) {
      set({
        categoriesLoading: false,
        categoriesError: error.response?.data?.message || "Failed to update category",
      })
      throw error
    }
  },

  deleteCategory: async (id: string) => {
    set({ categoriesLoading: true, categoriesError: null })
    try {
      await categoriesService.deleteCategory(id)
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
        categoriesLoading: false,
      }))
    } catch (error: any) {
      set({
        categoriesLoading: false,
        categoriesError: error.response?.data?.message || "Failed to delete category",
      })
      throw error
    }
  },
  reorderCategories: async (id: string, newIndex: number) => {
    await categoriesService.reorderCategories(id, newIndex)
    const data = await categoriesService.getCategories()
    set({ categories: data })
  },

  // Tags actions
  fetchTags: async (params) => {
    set({ tagsLoading: true, tagsError: null })
    try {
      const response = await tagsService.getTags(params)
      set({ tags: response, tagsLoading: false })
    } catch (error: any) {
      set({
        tagsLoading: false,
        tagsError: error.response?.data?.message || "Failed to fetch tags",
      })
    }
  },

  fetchPopularTags: async (limit) => {
    set({ tagsLoading: true, tagsError: null })
    try {
      const popularTags = await tagsService.getPopularTags(limit)
      set({ popularTags, tagsLoading: false })
    } catch (error: any) {
      set({
        tagsLoading: false,
        tagsError: error.response?.data?.message || "Failed to fetch popular tags",
      })
    }
  },

  searchTags: async (query: string) => {
    try {
      return await tagsService.searchTags(query)
    } catch (error: any) {
      set({ tagsError: error.response?.data?.message || "Failed to search tags" })
      throw error
    }
  },

  createTag: async (data) => {
    set({ tagsLoading: true, tagsError: null })
    try {
      const newTag = await tagsService.createTag(data)
      set((state) => ({
        tags: [...state.tags, newTag],
        tagsLoading: false,
      }))
    } catch (error: any) {
      set({
        tagsLoading: false,
        tagsError: error.response?.data?.message || "Failed to create tag",
      })
      throw error
    }
  },

  updateTag: async (data) => {
    set({ tagsLoading: true, tagsError: null })
    try {
      const updatedTag = await tagsService.updateTag(data)
      set((state) => ({
        tags: state.tags.map((tag) => (tag.id === data.id ? updatedTag : tag)),
        tagsLoading: false,
      }))
    } catch (error: any) {
      set({
        tagsLoading: false,
        tagsError: error.response?.data?.message || "Failed to update tag",
      })
      throw error
    }
  },

  deleteTag: async (id: string) => {
    set({ tagsLoading: true, tagsError: null })
    try {
      await tagsService.deleteTag(id)
      set((state) => ({
        tags: state.tags.filter((tag) => tag.id !== id),
        tagsLoading: false,
      }))
    } catch (error: any) {
      set({
        tagsLoading: false,
        tagsError: error.response?.data?.message || "Failed to delete tag",
      })
      throw error
    }
  },

  // Utility actions
  clearErrors: () =>
    set({
      postsError: null,
      bannersError: null,
      webstoriesError: null,
      categoriesError: null,
      tagsError: null,
    }),
}))
