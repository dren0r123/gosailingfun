import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ERROR_MESSAGES } from '../const';
import { AppError } from '../errors';
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
      throw new AppError(400, ERROR_MESSAGES.MISSING_FIELDS);
    }

    const isCertificateValid = await validateCertificateInYclients(certificateIdentifier, phone);

    if (!isCertificateValid) {
      throw new AppError(404, ERROR_MESSAGES.INVALID_CERTIFICATE);
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
