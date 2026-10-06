// Netlify serverless function: Widgets proxy with dual-backend fallback
// Serves /api/widgets -> {weather, gold, stocks, cricket[], trending[]}
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
  const path = '/api/widgets';
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
