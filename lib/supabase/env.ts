export function getSupabaseEnvironment() {
  // NEXT_PUBLIC variables must be referenced statically so Next.js can inline
  // them into the browser bundle. Dynamic access such as process.env[name]
  // works on the server but resolves to undefined in client components.
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!publishableKey) {
    throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }

  if (!url) {
    throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL");
  }

  return {
    publishableKey,
    url,
  };
}
