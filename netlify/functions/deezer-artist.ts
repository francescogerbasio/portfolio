import type { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  const params = event.queryStringParameters ?? {};
  const id = params.id;
  const name = params.name;
  const albumsFor = params.albums_for;

  if (!id && !name && !albumsFor) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing required query parameter: id, name, or albums_for' })
    };
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
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `Upstream returned ${response.status}` })
      };
    }
    const data = await response.json();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400'
      },
      body: JSON.stringify(data)
    };
  } catch {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to reach upstream' })
    };
  }
};

export { handler };
