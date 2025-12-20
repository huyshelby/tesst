/**
 * Build full image URL from path
 * 
 * @param path - Image path (e.g., "/pictures/iphone/iphone-15.png")
 * @returns Full URL pointing to backend static server
 * 
 * @example
 * buildImageUrl("/pictures/banner/banner.png")
 * // => "http://localhost:4000/pictures/banner/banner.png"
 */
export function buildImageUrl(path?: string | null): string {
  try {
    if (!path || typeof path !== 'string') return '/placeholder.png';
    if (path.startsWith('http') || path.startsWith('data:')) return path;

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';
    const baseUrl = apiBaseUrl.replace(/\/api$/, '').replace(/\/$/, '');
    const cleanPath = path.replace(/^\//, '');

    return `${baseUrl}/${cleanPath}`;
  } catch (error) {
    console.error(`Error building image URL for path: "${path}"`, error);
    return '/placeholder.png';
  }
}
