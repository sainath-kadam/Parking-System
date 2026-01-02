import './config/timezone.js';
import app from './app.js';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { startBackupJob } from './jobs/mongoToCsv.job.js';

async function startServer() {
  await connectDB();
  startBackupJob();

  app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
  });
}

startServer();
