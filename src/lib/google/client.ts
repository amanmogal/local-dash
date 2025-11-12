import { google } from "googleapis";

import { getServerEnv } from "../env";

let driveClient: ReturnType<typeof google.drive> | null = null;

export const getGoogleDriveClient = () => {
  const { googleClientEmail, googlePrivateKey } = getServerEnv();

  if (!googleClientEmail || !googlePrivateKey) {
    return null;
  }

  if (driveClient) {
    return driveClient;
  }

  const auth = new google.auth.JWT({
    email: googleClientEmail,
    key: googlePrivateKey.replace(/\\n/g, "\n"),
    scopes: [
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive",
    ],
  });

  driveClient = google.drive({ version: "v3", auth });

  return driveClient;
};

export const isGoogleDriveConfigured = (): boolean => {
  const { googleClientEmail, googlePrivateKey, googleDriveFolderId } = getServerEnv();
  return (
    googleClientEmail !== null &&
    googlePrivateKey !== null &&
    googleDriveFolderId !== null
  );
};

