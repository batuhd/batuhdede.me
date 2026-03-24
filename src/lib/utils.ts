import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates and sanitizes URLs to prevent XSS attacks
 * Only allows http:, https:, and relative URLs starting with /
 * Returns null if URL is invalid
 */
export function sanitizeUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  
  // Trim whitespace
  const trimmedUrl = url.trim();
  
  // Check for data: or javascript: protocols (XSS vectors)
  if (/^(data:|javascript:|vbscript:|file:|about:|blob:)/i.test(trimmedUrl)) {
    return null;
  }
  
  // Allow relative URLs starting with /
  if (trimmedUrl.startsWith('/')) {
    return trimmedUrl;
  }
  
  // Allow http: and https: protocols
  if (/^https?:\/\//i.test(trimmedUrl)) {
    try {
      new URL(trimmedUrl);
      return trimmedUrl;
    } catch {
      return null;
    }
  }
  
  // Allow mailto: for email addresses
  if (/^mailto:/i.test(trimmedUrl)) {
    return trimmedUrl;
  }
  
  // Reject all other protocols
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmedUrl)) {
    return null;
  }
  
  return null;
}

/**
 * Validates if a string is a valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates if a string is a valid image URL
 * Checks for common image extensions or data URIs
 */
export function isValidImageUrl(url: string): boolean {
  const sanitized = sanitizeUrl(url);
  if (!sanitized) return false;
  
  // Check for common image extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|ico|bmp|tiff?)(\?.*)?$/i;
  
  // Check if it's a data URL for images
  const isDataImage = /^data:image\//i.test(url);
  
  return imageExtensions.test(sanitized) || isDataImage;
}

/**
 * Strips HTML tags from a string to prevent XSS
 * Useful for displaying plain text from markdown/HTML content
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Truncates text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
