// Netlify search proxy
exports.handler = async (event) => {
  const q = event.queryStringParameters?.q || '';
  const limit = event.queryStringParameters?.limit || '10';
  if (!q) return { statusCode: 400, body: JSON.stringify({ error: 'Query required' }) };
  try {
    const url = `https://bharatkhoj-backend.onrender.com/api/search?q=${encodeURIComponent(q)}&limit=${limit}`;
    const resp = await fetch(url);
    const data = await resp.json();
    return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(data) };
  } catch (e) { return { statusCode: 500, body: JSON.stringify({ error: e.message }) }; }
};
