export const min = (a,b)=>(a<b?a:b);

export const getImageUrl = (pathSegment = "") => {
  const base = process.env.NEXT_PUBLIC_API_URI || "";

  if (!base || !pathSegment) return "";

  const cleanBase = base.replace(/\/+$/, "");
  const cleanPath = pathSegment.replace(/\\/g, "/").replace(/^\/+/, "");

  return `${cleanBase}/${cleanPath}`;
};