export const min = (a,b)=>(a<b?a:b);

export const getImageUrl = (pathSegment) => {
    // 1. Get the base URI and clean any trailing slash
    const apiUrl = process.env.NEXT_PUBLIC_API_URI?.replace(/\/$/, '');
  
    if (!apiUrl || !pathSegment) {
      // Handle cases where API URI or path is missing
      return ''; 
    }
    
    // 2. Ensure path segment uses forward slashes (fixes Windows backslash issue)
    const fixedPathSegment = pathSegment.replace(/\\/g, '/');
  
    // 3. Concatenate the parts
    return `${apiUrl}${fixedPathSegment}`;
  };