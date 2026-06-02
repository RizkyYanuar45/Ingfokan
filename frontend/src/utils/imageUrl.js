export const getFullImageUrl = (path) => {
  if (!path) return "";
  
  // If it's already an absolute URL (starts with http:// or https://), return it as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  
  // For safety, remove leading slash if it exists and backendUrl ends with one, 
  // or handle duplication. Usually VITE_BACKEND_URL doesn't end with a slash.
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
  
  // Normalize backslashes (Windows) to forward slashes and remove extra leading slashes
  const normalizedPath = path.replace(/\\/g, "/").replace(/^\/+/, "");
  
  return `${backendUrl}/${normalizedPath}`;
};
