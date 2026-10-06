// Netlify serverless function: AI Overview proxy with dual-backend fallback
// Google-jaisa: search results ke upar short AI summary (sirf informational queries)
const PHONE = 'https://driver-veteran-vinyl-scripts.trycloudflare.com';
const RENDER = 'https://bharatkhoj-backend.onrender.com';

async function tryFetch(url, timeoutMs = 45000) {
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

  if (!q) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Query required' }) };
  }

  const path = `/api/ai-overview?q=${encodeURIComponent(q)}`;

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
      return { statusCode: 500, body: JSON.stringify({ show: false, reason: 'both_backends_failed' }) };
    }
  }
};
