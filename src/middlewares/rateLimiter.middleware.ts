import rateLimit from 'express-rate-limit';

export const certificateGenerationRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many requests for certificate generation, please try again after 1 minute' },
  standardHeaders: true,
  legacyHeaders: false,
});
