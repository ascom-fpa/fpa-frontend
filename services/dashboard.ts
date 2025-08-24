import api from "./axios"

export interface DashboardMonthlySummary {
    totalPostsThisMonth: number
    activeBannersThisMonth: number
    webStoriesThisMonth: number
    categoriesThisMonth: number
}

export interface DashboardContentOverview {
    totalPublishedPosts: number
    totalDraftPosts: number
    activeBanners: number
    webStories: number
    totalTags: number
    totalCategories: number
}

// Get dashboard summary for the current month
export const getDashboardMonthlySummary = async (): Promise<DashboardMonthlySummary> => {
    const response = await api.get("/dashboard/monthly-summary")
    return response.data.data
}

export const getDashboardContentOverview = async (): Promise<DashboardContentOverview> => {
    const response = await api.get("/dashboard/content-overview")
    return response.data.data
}