import DOMPurify from 'isomorphic-dompurify';

// Security configurations for different content types
export const SANITIZER_CONFIGS = {
  // Strict configuration for user-generated content
  STRICT: {
    USE_PROFILES: {},
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'i', 'b',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'title', 'class'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'style'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'style'],
    SANITIZE_DOM: true,
    KEEP_CONTENT: true,
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false
  },

  // Moderate configuration for trusted content
  MODERATE: {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
    SANITIZE_DOM: true,
    KEEP_CONTENT: true,
    ALLOW_DATA_ATTR: false
  },

  // Permissive configuration for admin content
  PERMISSIVE: {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'iframe'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick'],
    SANITIZE_DOM: true,
    KEEP_CONTENT: true
  }
};

// Utility function to sanitize HTML with predefined configs
export const sanitizeHtml = (
  html: string, 
  config: keyof typeof SANITIZER_CONFIGS = 'MODERATE'
): string => {
  if (!html) return '';
  
  return DOMPurify.sanitize(html, SANITIZER_CONFIGS[config]);
};

// Custom sanitizer for specific use cases
export const customSanitize = (
  html: string,
  options: {
    allowedTags?: string[];
    allowedAttributes?: string[];
    forbidTags?: string[];
    forbidAttributes?: string[];
  } = {}
): string => {
  if (!html) return '';
  
  const config = {
    USE_PROFILES: {},
    ALLOWED_TAGS: options.allowedTags,
    ALLOWED_ATTR: options.allowedAttributes,
    FORBID_TAGS: options.forbidTags,
    FORBID_ATTR: options.forbidAttributes,
    SANITIZE_DOM: true,
    KEEP_CONTENT: true
  };
  
  return DOMPurify.sanitize(html, config);
};

// Validate if HTML contains potentially dangerous content
export const validateHtmlSafety = (html: string): {
  isSafe: boolean;
  warnings: string[];
} => {
  const warnings: string[] = [];
  
  // Check for dangerous tags
  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form'];
  const dangerousTagRegex = new RegExp(`<\\s*(${dangerousTags.join('|')})\\b`, 'gi');
  
  if (dangerousTagRegex.test(html)) {
    warnings.push('Contains potentially dangerous HTML tags');
  }
  
  // Check for event handlers
  const eventHandlerRegex = /\bon\w+\s*=/gi;
  if (eventHandlerRegex.test(html)) {
    warnings.push('Contains JavaScript event handlers');
  }
  
  // Check for javascript: protocol
  const jsProtocolRegex = /javascript:/gi;
  if (jsProtocolRegex.test(html)) {
    warnings.push('Contains javascript: protocol');
  }
  
  return {
    isSafe: warnings.length === 0,
    warnings
  };
};
