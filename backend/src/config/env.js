import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_DRIVE_FOLDER_ID: process.env.GDRIVE_FOLDER_ID
};
