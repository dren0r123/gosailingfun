import axios from 'axios';

import { ERROR_MESSAGES } from '../const';
import { YclientsResponsePayload } from '../interfaces';

export async function validateCertificateInYclients(certificateIdentifier: string, phone: string): Promise<boolean> {
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

    return responsePayload.data.some(certificateObject => certificateObject.number === certificateIdentifier);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new Error(ERROR_MESSAGES.YCLIENTS_RATE_LIMIT_EXCEEDED, { cause: error });
      }
      return false;
    }
    throw error;
  }
}
