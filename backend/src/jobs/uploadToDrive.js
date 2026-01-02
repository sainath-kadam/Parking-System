import fs from 'fs';
import { google } from 'googleapis';
import { ENV } from '../config/env.js';

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/drive.file']
});

const drive = google.drive({ version: 'v3', auth });

export async function uploadToDrive(filePath) {
  const fileMetadata = {
    name: filePath.split('/').pop(),
    parents: [ENV.GOOGLE_DRIVE_FOLDER_ID]
  };

  const media = {
    mimeType: 'text/csv',
    body: fs.createReadStream(filePath)
  };

  await drive.files.create({
    resource: fileMetadata,
    media,
    fields: 'id'
  });
}
