import api from "./axios"

export interface DashboardMonthlySummary {
    totalPostsThisMonth: number
    activeBannersThisMonth: number
    webStoriesThisMonth: number
    categoriesThisMonth: number
}

// Get dashboard summary for the current month
export const getDashboardMonthlySummary = async (): Promise<DashboardMonthlySummary> => {
    const response = await api.get("/dashboard/monthly-summary")
    return response.data.data
}