const readEnv = (name: string) => {
  const value = process.env[name];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(
      `${name} is not set. Configure it in .env.local before running the dashboard.`,
    );
  }
  return value;
};

const readOptionalEnv = (name: string) => {
  const value = process.env[name];
  return typeof value === "string" && value.length > 0 ? value : null;
};

export const getPublicEnv = () => ({
  supabaseUrl: readEnv("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
});

export const getServerEnv = () => ({
  supabaseServiceRoleKey: readEnv("SUPABASE_SERVICE_ROLE_KEY"),
  notionToken: readOptionalEnv("NOTION_API_TOKEN"),
  notionDatabaseId: readOptionalEnv("NOTION_DATABASE_ID"),
  googleClientEmail: readOptionalEnv("GOOGLE_CLIENT_EMAIL"),
  googlePrivateKey: readOptionalEnv("GOOGLE_PRIVATE_KEY"),
  googleDriveFolderId: readOptionalEnv("GOOGLE_DRIVE_FOLDER_ID"),
});

