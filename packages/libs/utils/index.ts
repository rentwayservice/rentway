export const PROJECT_ID =
  (process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID as string) ||
  "wwbsckdsbrocvvbmttgj";

export function getPublicUrl(url: string, bucket: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/${bucket}/${url}?format=WebP&quality=${75}`;
}
