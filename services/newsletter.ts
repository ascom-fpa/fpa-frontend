import api from "./axios"

export interface NewsletterSubscribeData {
  name: string
  email: string
}

export interface SendNewsletterData {
  id: string
  subject: string
}

// Newsletter subscription
export const newsletterSubscribe = async (payload: NewsletterSubscribeData): Promise<any> => {
  const response = await api.post("/mail/newsletter", payload)
  return response.data.data
}

// send newsletter email
export const sendNewsletterEmail = async (payload: SendNewsletterData): Promise<any> => {
  const response = await api.post("/mail/newsletter/send", payload)
  return response.data.data
}