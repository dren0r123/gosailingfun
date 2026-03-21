import rateLimit from 'express-rate-limit';

import { ERROR_MESSAGES } from '../const';

export const certificateGenerationRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: ERROR_MESSAGES.TOO_MANY_REQUESTS_CERT_GEN },
  standardHeaders: true,
  legacyHeaders: false,
});
