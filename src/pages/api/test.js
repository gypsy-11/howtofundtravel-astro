export async function GET() {
  return new Response(JSON.stringify({ message: 'Test API working' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST({ request }) {
  const data = await request.json();
  return new Response(JSON.stringify({ 
    message: 'Test POST working',
    received: data 
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
