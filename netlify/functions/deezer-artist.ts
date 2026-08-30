import type { Handler, HandlerResponse } from '@netlify/functions';

const jsonResponse = (
  statusCode: number,
  body: unknown,
  cacheControl = 'no-store'
): HandlerResponse => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': cacheControl
  },
  body: JSON.stringify(body)
});

const handler: Handler = async (event) => {
  const params = event.queryStringParameters ?? {};
  const id = params.id;
  const name = params.name;
  const albumsFor = params.albums_for;

  if (!id && !name && !albumsFor) {
    return jsonResponse(400, { error: 'Missing required query parameter: id, name, or albums_for' });
  }

  try {
    let url: string;
    if (albumsFor) {
      url = `https://api.deezer.com/artist/${encodeURIComponent(albumsFor)}/albums?limit=50`;
    } else if (id) {
      url = `https://api.deezer.com/artist/${encodeURIComponent(id)}`;
    } else {
      url = `https://api.deezer.com/search/artist?q=${encodeURIComponent(name as string)}&limit=5`;
    }
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) {
      return jsonResponse(response.status, { error: `Upstream returned ${response.status}` });
    }
    const data = await response.json();
    return jsonResponse(200, data, 'public, max-age=86400');
  } catch {
    return jsonResponse(502, { error: 'Failed to reach upstream' });
  }
};

export { handler };
