// Netlify serverless function: Search proxy with dual-backend fallback
// Primary: Phone server (unlimited, free) | Fallback: Render (backup)
const PHONE = 'https://driver-veteran-vinyl-scripts.trycloudflare.com';
const RENDER = 'https://bharatkhoj-backend.onrender.com';

async function tryFetch(url, timeoutMs = 25000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const resp = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    return await resp.json();
  } catch (e) {
    clearTimeout(t);
    throw e;
  }
}

exports.handler = async (event) => {
  const q = event.queryStringParameters?.q || '';
  const limit = event.queryStringParameters?.limit || '10';
  const type = event.queryStringParameters?.type || 'web';
  const page = event.queryStringParameters?.page || '1';
  
  if (!q) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Query required' }) };
  }
  
  const path = `/api/search?q=${encodeURIComponent(q)}&limit=${limit}&type=${encodeURIComponent(type)}&page=${encodeURIComponent(page)}`;
  
  // Try phone first, fall back to Render
  try {
    const data = await tryFetch(PHONE + path);
    data._backend = 'phone';
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    };
  } catch (e1) {
    try {
      const data = await tryFetch(RENDER + path);
      data._backend = 'render';
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(data)
      };
    } catch (e2) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Both backends failed' }) };
    }
  }
};
