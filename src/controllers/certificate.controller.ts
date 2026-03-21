import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ERROR_MESSAGES } from '../const';
import { GenerateCertificateRequestPayload } from '../interfaces';
import { generatePdfCertificateStream, validateCertificateInYclients } from '../services';

export async function handleCertificateGeneration(
  expressRequest: ExpressRequest,
  expressResponse: ExpressResponse,
  next: NextFunction,
): Promise<void> {
  try {
    const requestPayload: GenerateCertificateRequestPayload = expressRequest.body;
    const { clientFullName, certificateIdentifier, templateDesignId, phone } = requestPayload;

    if (!clientFullName || !certificateIdentifier || !templateDesignId || !phone) {
      expressResponse.status(400);
      throw new Error(ERROR_MESSAGES.MISSING_FIELDS);
    }

    try {
      const isCertificateValid = await validateCertificateInYclients(certificateIdentifier, phone);

      if (!isCertificateValid) {
        expressResponse.status(404);
        throw new Error(ERROR_MESSAGES.INVALID_CERTIFICATE);
      }
    } catch (validationError: unknown) {
      if (validationError instanceof Error && validationError.message === ERROR_MESSAGES.YCLIENTS_RATE_LIMIT_EXCEEDED) {
        expressResponse.status(429);
        throw new Error(ERROR_MESSAGES.YCLIENTS_VALIDATION_TOO_MANY_REQUESTS, { cause: validationError });
      }
      if (expressResponse.statusCode === 200) expressResponse.status(500);
      throw validationError;
    }

    try {
      const pdfDocumentBuffer = await generatePdfCertificateStream(
        clientFullName,
        certificateIdentifier,
        templateDesignId,
      );

      expressResponse.setHeader('Content-Type', 'application/pdf');
      expressResponse.setHeader('Content-Disposition', 'attachment; filename="certificate.pdf"');

      expressResponse.send(pdfDocumentBuffer);
    } catch (pdfError: unknown) {
      if (pdfError instanceof Error && pdfError.message === ERROR_MESSAGES.TEMPLATE_NOT_FOUND) {
        expressResponse.status(400);
      }
      throw pdfError;
    }
  } catch (error: unknown) {
    next(error);
  }
}
