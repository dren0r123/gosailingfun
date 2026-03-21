import axios from 'axios';

import { ERROR_MESSAGES } from '../const';
import { AppError } from '../errors';
import { YclientsCertificateObject, YclientsResponsePayload } from '../interfaces';

export async function validateCertificateInYclients(code: string, phone: string): Promise<boolean> {
  try {
    const yclientsApiUrl = process.env.YCLIENTS_API_URL || 'https://api.yclients.com/api/v1/loyalty/certificates';
    const companyId = process.env.YCLIENTS_COMPANY_ID || '';
    const bearerToken = process.env.YCLIENTS_BEARER_TOKEN || '';
    const userToken = process.env.YCLIENTS_USER_TOKEN || '';

    const requestUrl = `${yclientsApiUrl}?company_id=${companyId}&phone=${phone}`;

    const yclientsResponse = await axios.get<YclientsResponsePayload>(requestUrl, {
      headers: {
        Accept: 'application/vnd.yclients.v2+json',
        Authorization: `Bearer ${bearerToken}, User ${userToken}`,
        'Content-Type': 'application/json',
      },
    });

    const { data: responsePayload } = yclientsResponse;

    if (!responsePayload.success || !responsePayload.data?.length) {
      return false;
    }

    const certificate = responsePayload.data.find(({ number }) => number === code);

    if (!certificate) {
      return false;
    }

    const isActive = certificate.status?.slug === 'active';
    const hasBalance = certificate.balance > 0;
    const isNotExpired = checkIsNotExpired(certificate);

    return isActive && hasBalance && isNotExpired;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new AppError(429, ERROR_MESSAGES.YCLIENTS_VALIDATION_TOO_MANY_REQUESTS);
      }
      return false;
    }
    throw error;
  }
}

const checkIsNotExpired = (certificate: YclientsCertificateObject): boolean => {
  const expirationTypeId = certificate.type?.expiration_type_id;

  // 0 - без ограничения срока действия
  if (expirationTypeId === 0) {
    return true;
  }

  // Изначально проверяем вычисленную дату сгорания у самого сертификата
  if (certificate.expiration_date) {
    return new Date(certificate.expiration_date).getTime() > Date.now();
  }

  // 1 - фиксированная дата (если не указана у самого сертификата, берем из типа)
  if (expirationTypeId === 1 && certificate.type?.expiration_date) {
    return new Date(certificate.type.expiration_date).getTime() > Date.now();
  }

  // 2 - фиксированный срок (вычисляем дату сгорания относительно даты создания, если ее нет)
  if (expirationTypeId === 2 && certificate.created_date && certificate.type?.expiration_timeout) {
    const expirationDate = new Date(certificate.created_date);
    const timeout = certificate.type.expiration_timeout;
    const unitId = certificate.type.expiration_timeout_unit_id;

    switch (unitId) {
      case 1: // День
        expirationDate.setDate(expirationDate.getDate() + timeout);
        break;
      case 2: // Неделя
        expirationDate.setDate(expirationDate.getDate() + timeout * 7);
        break;
      case 3: // Месяц
        expirationDate.setMonth(expirationDate.getMonth() + timeout);
        break;
      case 4: // Год
        expirationDate.setFullYear(expirationDate.getFullYear() + timeout);
        break;
    }

    return expirationDate.getTime() > Date.now();
  }

  return false;
};
