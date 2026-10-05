// Netlify discover proxy
exports.handler = async (event) => {
  const page = event.queryStringParameters?.page || '1';
  try {
    const url = `https://bharatkhoj-backend.onrender.com/api/discover?page=${page}`;
    const resp = await fetch(url);
    const data = await resp.json();
    return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(data) };
  } catch (e) { return { statusCode: 500, body: JSON.stringify({ error: e.message }) }; }
};
