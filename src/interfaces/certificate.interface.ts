export interface GenerateCertificateRequestPayload {
  clientName: string;
  code: string;
  phone: string;
  templateId?: number | string;
}
