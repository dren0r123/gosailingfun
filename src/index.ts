import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import dns from 'dns';
import express, { Express as ExpressApplication, Request, Response } from 'express';
import fs from 'fs';
import helmet from 'helmet';
import https from 'https';
import path from 'path';

// Fix for Node 17+ ENETUNREACH error on IPv6.
// Forces Node.js to prefer IPv4 when resolving DNS like smtp.gmail.com
dns.setDefaultResultOrder('ipv4first');

import { ERROR_MESSAGES } from './const';
import { certificateRouter } from './routes';

const expressApplication: ExpressApplication = express();

// Trust the first proxy. Essential for rate limiting when deployed behind a reverse proxy (like Render)
expressApplication.set('trust proxy', 1);

const serverPortNumber = process.env.PORT ? Number(process.env.PORT) : 3000;
const host = process.env.HOST ?? 'localhost';
const env = (process.env.NODE_ENV || 'development').trim();

expressApplication.use(helmet());

const allowedCorsOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];

expressApplication.use(
  cors({
    origin: (requestOriginHeader, corsCallbackFunction) => {
      if (!requestOriginHeader) return corsCallbackFunction(null, true);
      if (allowedCorsOrigins.includes(requestOriginHeader)) {
        return corsCallbackFunction(null, true);
      }
      const corsErrorMessage = ERROR_MESSAGES.CORS_NOT_ALLOWED;
      return corsCallbackFunction(new Error(corsErrorMessage), false);
    },
    optionsSuccessStatus: 200,
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
  // Only listen if NOT running on Vercel. Vercel Serverless Functions don't use app.listen()
  if (!process.env.VERCEL) {
    const server = expressApplication.listen(serverPortNumber, () => {
      console.log(`[ ready prod ] Listening at http://${host}:${serverPortNumber}/api`);
    });
    server.on('error', console.error);
  }
}

// Export the app for Vercel serverless deployment
export default expressApplication;
