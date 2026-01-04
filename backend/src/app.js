import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cron from 'node-cron';
import { runBillingJob } from './jobs/billing.job.js';

import errorMiddleware from './middlewares/error.middleware.js';
import routes from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);
cron.schedule('0 1 * * *', async () => {
  await runBillingJob(process.env.SYSTEM_USER_ID);
});

//const swaggerDocument = YAML.load('./documentation/swagger.yaml');
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorMiddleware);

export default app;
