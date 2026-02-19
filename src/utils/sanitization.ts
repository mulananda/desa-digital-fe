// src/utils/sanitization.ts

/**
 * Sanitize search parameters untuk cache security
 * - Remove special characters
 * - Normalize whitespace
 * - Limit length
 * - Convert to lowercase
 */
export function sanitizeSearchParam(input?: string): string | null {
  if (!input) return null;

  // 1. Trim whitespace
  let sanitized = input.trim();

  if (sanitized.length === 0) return null;

  // 2. Limit length (prevent DOS amplification)
  const MAX_LENGTH = 100;
  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.substring(0, MAX_LENGTH);
  }

  // 3. Normalize - lowercase untuk consistent caching
  sanitized = sanitized.toLowerCase();

  // 4. Remove leading/trailing special chars
  sanitized = sanitized.replace(/^[^\w\s]+|[^\w\s]+$/g, "");

  // 5. Allow alphanumeric, spaces, common punctuation (normalized)
  sanitized = sanitized
    .replace(/[^\w\s\-\.]/g, "") // Keep: letters, numbers, space, dash, dot
    .replace(/\s+/g, " ") // Normalize multiple spaces to single
    .trim();

  return sanitized.length > 0 ? sanitized : null;
}

/**
 * Validate search input untuk form validation
 * Detect injection attempts
 */
export function validateSearchInput(input: string): {
  valid: boolean;
  error?: string;
} {
  if (!input) {
    return { valid: true }; // Empty is OK
  }

  // Check untuk injection attempts
  const suspiciousPatterns = [
    /--|;|<|>|{|}|`/, // SQL injection
    /onload|onerror|onclick/i, // XSS
    /\.\.\/|\.\.\\/, // Path traversal
    /script|iframe|object/i, // Scripts
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(input)) {
      return {
        valid: false,
        error: "Karakter tidak diizinkan dalam pencarian",
      };
    }
  }

  if (input.length > 100) {
    return {
      valid: false,
      error: "Pencarian terlalu panjang (max 100 karakter)",
    };
  }

  return { valid: true };
}

/**
 * Sanitize HTML attributes
 * Escape quotes, angle brackets
 */
export function sanitizeAttribute(text?: string): string {
  if (!text) return "";

  return text
    .trim()
    .substring(0, 255)
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Validate image URL untuk prevent phishing/malicious redirects
 * Allow localhost untuk development, https untuk production
 */
export function validateImageUrl(url?: string): string {
  if (!url) return ""; // Return empty, let component handle default

  // Check if in development mode (compatible with all module systems)
  const isDev =
    typeof window !== "undefined" && window.location.hostname === "localhost";

  try {
    // Handle http://localhost URLs (development only)
    if (
      url.startsWith("http://localhost:") ||
      url.startsWith("http://127.0.0.1:")
    ) {
      // Allow localhost URLs di development
      if (isDev) {
        // Additional check: prevent obvious malicious content
        if (url.includes("javascript:") || url.includes("data:")) {
          console.warn("Malicious javascript protocol detected");
          return "";
        }
        return url; // ✅ Allow localhost in dev
      } else {
        // Block http:// URLs in production
        console.warn("Insecure image URL (http) in production, blocking");
        return "";
      }
    }

    // Only allow https in production
    if (url.startsWith("https://")) {
      // Optional: whitelist allowed domains untuk production
      const allowedDomains = [
        "cdn.example.com",
        "images.example.com",
        "via.placeholder.com", // ✅ Allow placeholder service
      ];

      try {
        const urlObj = new URL(url);
        if (
          !allowedDomains.some((domain) => urlObj.hostname.endsWith(domain))
        ) {
          console.warn("Image from untrusted domain");
          return "";
        }
      } catch {
        return "";
      }

      return url;
    }

    // Relative paths (always safe)
    if (url.startsWith("/")) {
      return url; // ✅ Relative path is OK
    }

    // Check untuk path traversal
    if (url.includes("..")) {
      console.warn("Suspicious image path detected (traversal)");
      return "";
    }

    // Relative path tanpa leading slash
    if (!url.includes("http") && !url.includes("..")) {
      return url; // ✅ Relative path is OK
    }

    // Unknown format - reject untuk safety
    console.warn("Unknown image URL format");
    return "";
  } catch (error) {
    console.error("URL validation error:", error);
    return "";
  }
}
