import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { GenerateCertificateRequestPayload } from '../interfaces';
import { generatePdfCertificateStream, validateCertificateInYclients } from '../services';

export async function handleCertificateGeneration(
  expressRequest: ExpressRequest,
  expressResponse: ExpressResponse,
  next: NextFunction,
): Promise<void> {
  try {
    const requestPayload: GenerateCertificateRequestPayload = expressRequest.body;
    const { clientFullName, certificateIdentifier, templateDesignId } = requestPayload;

    if (!clientFullName || !certificateIdentifier || !templateDesignId) {
      expressResponse.status(400);
      throw new Error('Missing required fields in request payload');
    }

    try {
      const isCertificateValid = await validateCertificateInYclients(certificateIdentifier);

      if (!isCertificateValid) {
        expressResponse.status(404);
        throw new Error('Certificate not found or invalid in YCLIENTS');
      }
    } catch (validationError: unknown) {
      if (validationError instanceof Error && validationError.message === 'YCLIENTS_RATE_LIMIT_EXCEEDED') {
        expressResponse.status(429);
        throw new Error('Too many requests to YCLIENTS validation service', { cause: validationError });
      }
      if (expressResponse.statusCode === 200) expressResponse.status(500);
      throw validationError;
    }

    const pdfDocumentBuffer = await generatePdfCertificateStream(
      clientFullName,
      certificateIdentifier,
      templateDesignId,
    );

    expressResponse.setHeader('Content-Type', 'application/pdf');
    expressResponse.setHeader('Content-Disposition', 'attachment; filename="certificate.pdf"');

    expressResponse.send(pdfDocumentBuffer);
  } catch (error: unknown) {
    next(error);
  }
}
