import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import errorMiddleware from './middlewares/error.middleware.js';
import routes from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

const swaggerDocument = YAML.load('./documentation/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorMiddleware);

export default app;
