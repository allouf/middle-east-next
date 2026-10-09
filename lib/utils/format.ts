export const parseBackendDate = (dateString: string) => {
  if (!dateString) return new Date();
  
  // If it's already an ISO string or has timezone info, parse it directly
  if (dateString.includes('T') || dateString.includes('Z') || dateString.includes('+')) {
    return new Date(dateString);
  }

  // If it's the backend format "YYYY-MM-DD HH:mm:ss" in GMT
  // Convert to ISO format "YYYY-MM-DDTHH:mm:ssZ" to ensure it's treated as UTC
  const isoString = dateString.replace(' ', 'T') + 'Z';
  const date = new Date(isoString);
  
  // If parsing failed (e.g. invalid date string), fallback to original constructor
  return isNaN(date.getTime()) ? new Date(dateString) : date;
};

export const formatRelativeTime = (dateString: string) => {
  const date = parseBackendDate(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 2592000)} months ago`;
};


export const formatDate = (dateString: string) => {
  const date = parseBackendDate(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })
}



// Format expiration date
export const formatExpirationDate = (hours) => {
  const date = new Date();
  date.setHours(date.getHours() + parseInt(hours));
  return date.toISOString().split('T')[0]; // Return only the date part (YYYY-MM-DD)
};

export const formatMoney = (n?: number | null) =>
  (n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
