export const getInstagramPosts = async (): Promise<any> => {
  const res = await fetch('/api/instagram');
  const data = await res.json();
  return data.data.slice(0,3)
}