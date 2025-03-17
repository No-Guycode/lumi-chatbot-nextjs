let settings = { rateLimit: 5, maxTokens: 1000 };

export async function GET() {
  return Response.json(settings);
}

export async function POST(req) {
  const newSettings = await req.json();
  settings = { ...settings, ...newSettings };
  return new Response(null, { status: 200 });
}
