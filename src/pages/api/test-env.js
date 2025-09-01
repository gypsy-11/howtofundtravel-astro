export async function GET() {
  const apiKey = import.meta.env.MAILERLITE_API_KEY;
  
  return new Response(JSON.stringify({ 
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    apiKeyStart: apiKey ? apiKey.substring(0, 10) + '...' : 'none'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
