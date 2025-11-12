const WRITE_FLAG = "ENABLE_SUPABASE_WRITES";

export const ensureWriteAccess = () => {
  if (process.env[WRITE_FLAG] !== "true") {
    throw new Error(
      `Write operations are disabled. Confirm with the team and set ${WRITE_FLAG}=true before mutating the database.`,
    );
  }
};

