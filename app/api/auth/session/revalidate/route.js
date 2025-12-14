// app/api/revalidate/route.js
import { revalidateTag } from 'next/cache';

export async function POST(request) {
  try {
    const { tags, secret } = await request.json();

    // Security Check
    if (secret !== process.env.REVALIDATION_SECRET) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Logic: If 'tag' is "collection-123", Next.js purges that specific cache
    if (tags && Array.isArray(tags)) {
        tags.forEach((tag) => revalidateTag(tag));
      }

    return Response.json({ 
      revalidated: true, 
      purged: tags, 
      at: new Date().toISOString() 
    });
  } catch (err) {
    return Response.json({ message: 'Invalid Request' }, { status: 400 });
  }
}