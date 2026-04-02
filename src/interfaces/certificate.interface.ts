export interface GenerateCertificateRequestPayload {
  clientName: string;
  code: string;
  phone: string;
  email?: string;
  templateId?: number | string;
}
