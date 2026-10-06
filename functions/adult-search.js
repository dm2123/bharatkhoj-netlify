// Netlify serverless function: Adult search proxy (18+) with dual-backend fallback
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
  
  if (!q) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Query required' }) };
  }
  
  const path = `/api/adult-search?q=${encodeURIComponent(q)}&limit=${limit}`;
  
  try {
    const data = await tryFetch(PHONE + path);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    };
  } catch (e1) {
    try {
      const data = await tryFetch(RENDER + path);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(data)
      };
    } catch (e2) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Both backends failed', results: [] }) };
    }
  }
};
