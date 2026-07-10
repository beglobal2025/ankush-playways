function requireEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getSupabaseEnvironment() {
  return {
    publishableKey: requireEnvironmentVariable("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    url: requireEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL"),
  };
}
