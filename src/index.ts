import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express as ExpressApplication, Request, Response } from 'express';
import fs from 'fs';
import helmet from 'helmet';
import https from 'https';
import path from 'path';

import { ERROR_MESSAGES } from './const';
import { certificateRouter } from './routes';

dotenv.config();

const expressApplication: ExpressApplication = express();
const serverPortNumber = process.env.PORT ? Number(process.env.PORT) : 3000;
const host = process.env.HOST ?? 'localhost';
const env = (process.env.NODE_ENV || 'development').trim();

expressApplication.use(helmet());

const allowedCorsOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];

expressApplication.use(
  cors({
    origin: (requestOriginHeader, corsCallbackFunction) => {
      if (!requestOriginHeader) return corsCallbackFunction(null, true);
      if (allowedCorsOrigins.indexOf(requestOriginHeader) === -1) {
        const corsErrorMessage = ERROR_MESSAGES.CORS_NOT_ALLOWED;
        return corsCallbackFunction(new Error(corsErrorMessage), false);
      }
      return corsCallbackFunction(null, true);
    },
  }),
);

expressApplication.use(express.json());

const apiRouter = express.Router();
apiRouter.use('/certificate', certificateRouter);

// Healthcheck
expressApplication.get('/', (req: Request, res: Response) => {
  res.sendStatus(200);
});

expressApplication.use('/api', apiRouter);

import { errorHandler } from './middlewares';

// --- Error Handling ---
expressApplication.use(errorHandler);

// --- Server Start ---
if (env === 'development') {
  try {
    const options = {
      key: fs.readFileSync(path.join(process.cwd(), 'ssl', 'server.key')),
      cert: fs.readFileSync(path.join(process.cwd(), 'ssl', 'server.crt')),
    };

    https.createServer(options, expressApplication).listen(serverPortNumber, () => {
      console.log(`[ ready dev ] https://${host}:${serverPortNumber}/api`);
    });
  } catch {
    console.warn('[ warn ] SSL certificates not found, falling back to HTTP');
    expressApplication.listen(serverPortNumber, () => {
      console.log(`[ ready dev ] http://${host}:${serverPortNumber}/api`);
    });
  }
} else {
  const server = expressApplication.listen(serverPortNumber, () => {
    console.log(`[ ready prod ] Listening at http://${host}:${serverPortNumber}/api`);
  });
  server.on('error', console.error);
}
