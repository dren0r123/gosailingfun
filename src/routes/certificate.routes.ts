import { Router as ExpressRouter } from 'express';

import { handleCertificateGeneration } from '../controllers';
import { certificateGenerationRateLimiter } from '../middlewares';

const certificateRouter = ExpressRouter();

certificateRouter.post('/generate', certificateGenerationRateLimiter, handleCertificateGeneration);

export { certificateRouter };
