import api from "./axios"

export interface NewsletterSubscribeData {
  name: string
  email: string
}

// Create new banner
export const newsletterSubscribe = async (payload: NewsletterSubscribeData): Promise<any> => {
  const response = await api.post("/mail/newsletter", payload)
  return response.data.data
}