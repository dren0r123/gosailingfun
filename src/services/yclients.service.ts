import axios from 'axios';

import { YclientsResponsePayload } from '../interfaces';

export async function validateCertificateInYclients(certificateIdentifier: string): Promise<boolean> {
  try {
    const yclientsResponse = await axios.get<YclientsResponsePayload>(
      'https://api.yclients.com/api/v1/loyalty/certificates?company_id=1743224&phone=79235137888',
      {
        headers: {
          Accept: 'application/vnd.yclients.v2+json',
          Authorization: 'Bearer 569na6pz9m6jz8x6aauw, User c47eb83df24d4dadadf92cd12aa367c2',
          'Content-Type': 'application/json',
        },
      },
    );

    const { data: responsePayload } = yclientsResponse;

    if (!responsePayload.success || !responsePayload.data?.length) {
      return false;
    }

    return responsePayload.data.some(certificateObject => certificateObject.number === certificateIdentifier);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new Error('YCLIENTS_RATE_LIMIT_EXCEEDED', { cause: error });
      }
      return false;
    }
    throw error;
  }
}
