export const getInstagramPosts = async (): Promise<any> => {
  const res = await fetch('/api/instagram');
  const data = await res.json();
  return data.data.filter((el: any) => el.media_type == "VIDEO" || el.media_type == "IMAGE").slice(0,6)
}