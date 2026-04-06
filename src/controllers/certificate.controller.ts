import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ERROR_MESSAGES } from '../const';
import { AppError } from '../errors';
import { GenerateCertificateRequestPayload, ValidateCertificateRequestPayload } from '../interfaces';
import { generatePdfCertificateStream, sendCertificateEmail, validateCertificateInYclients } from '../services';

export async function checkCertificateValidity(
  expressRequest: ExpressRequest,
  expressResponse: ExpressResponse,
  next: NextFunction,
): Promise<void> {
  try {
    const requestPayload: ValidateCertificateRequestPayload = expressRequest.body;
    const { code, phone } = requestPayload || {};

    const missingFields: string[] = [];
    if (!code) missingFields.push('code');
    if (!phone) missingFields.push('phone');

    if (missingFields.length > 0) {
      throw new AppError(400, `${ERROR_MESSAGES.MISSING_FIELDS}: ${missingFields.join(', ')}`);
    }

    const isCertificateValid = await validateCertificateInYclients(code, phone);

    if (!isCertificateValid) {
      throw new AppError(400, ERROR_MESSAGES.INVALID_CERTIFICATE);
    }

    expressResponse.sendStatus(200);
  } catch (error: unknown) {
    next(error);
  }
}

export async function handleCertificateGeneration(
  expressRequest: ExpressRequest,
  expressResponse: ExpressResponse,
  next: NextFunction,
): Promise<void> {
  try {
    const requestPayload: GenerateCertificateRequestPayload = expressRequest.body;
    const { clientName, code, templateId = 1, phone, email } = requestPayload || {};

    const missingFields: string[] = [];
    if (!clientName) missingFields.push('clientName');
    if (!code) missingFields.push('code');
    if (!phone) missingFields.push('phone');

    if (missingFields.length > 0) {
      throw new AppError(400, `${ERROR_MESSAGES.MISSING_FIELDS}: ${missingFields.join(', ')}`);
    }

    const isCertificateValid = await validateCertificateInYclients(code, phone);

    if (!isCertificateValid) {
      throw new AppError(404, ERROR_MESSAGES.INVALID_CERTIFICATE);
    }

    const pdfDocumentBuffer = await generatePdfCertificateStream(clientName, code, templateId);

    if (email) {
      await sendCertificateEmail(email, pdfDocumentBuffer);
    }

    expressResponse.sendStatus(200);
  } catch (error: unknown) {
    next(error);
  }
}
