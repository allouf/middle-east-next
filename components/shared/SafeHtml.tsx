"use client";

import React, { useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";
import { sanitizeHtml, SANITIZER_CONFIGS } from "@/lib/security/htmlSanitizer";

type SafeHtmlProps = {
  html?: string | null;
  className?: string;
  config?: keyof typeof SANITIZER_CONFIGS;
  allowedTags?: string[];
  allowedAttributes?: string[];
  strict?: boolean;
};

const SafeHtml: React.FC<SafeHtmlProps> = ({ 
  html, 
  className, 
  config = 'MODERATE',
  allowedTags,
  allowedAttributes,
  strict = false 
}) => {
  const sanitizedHtml = useMemo(() => {
    if (!html) return "";
    
    // Use predefined config if no custom options provided
    if (!allowedTags && !allowedAttributes) {
      const sanitizationConfig = strict ? 'STRICT' : config;
      return sanitizeHtml(html, sanitizationConfig);
    }
    
    // Custom configuration
    const customConfig = {
      USE_PROFILES: {},
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: allowedAttributes,
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
      SANITIZE_DOM: true,
      KEEP_CONTENT: true,
      ALLOW_DATA_ATTR: !strict,
      ALLOW_UNKNOWN_PROTOCOLS: !strict
    };
    
    return DOMPurify.sanitize(html, customConfig);
  }, [html, config, allowedTags, allowedAttributes, strict]);

  if (!sanitizedHtml) return null;

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default SafeHtml;