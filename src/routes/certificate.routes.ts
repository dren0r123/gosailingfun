import { Router as ExpressRouter } from 'express';

import { checkCertificateValidity, handleCertificateGeneration } from '../controllers';
import { certificateGenerationRateLimiter } from '../middlewares';

const certificateRouter = ExpressRouter();

certificateRouter.post('/validate', certificateGenerationRateLimiter, checkCertificateValidity);
certificateRouter.post('/generate', certificateGenerationRateLimiter, handleCertificateGeneration);

export { certificateRouter };
