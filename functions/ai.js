// Netlify serverless function: AI Mode proxy
exports.handler = async (event) => {
  const q = event.queryStringParameters?.q || '';
  
  if (!q) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Query required' }) };
  }
  
  try {
    const url = `https://recipient-void-grill-staff.trycloudflare.com/api/ai?q=${encodeURIComponent(q)}`;
    const resp = await fetch(url);
    const data = await resp.json();
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
