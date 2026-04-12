export interface GenerateCertificateRequestPayload {
  clientName: string;
  code: string;
  phone: string;
  email?: string;
  templateId?: number | string;
  wishes?: string;
}

export interface ValidateCertificateRequestPayload {
  code: string;
  phone: string;
}
