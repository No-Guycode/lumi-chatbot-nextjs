export async function POST(req) {
  const { password } = await req.json();
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

  if (password === ADMIN_PASSWORD) {
    return new Response(null, { status: 200 });
  }
  return new Response(null, { status: 401 });
}
