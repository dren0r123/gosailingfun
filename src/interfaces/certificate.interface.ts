export interface GenerateCertificateRequestPayload {
  clientFullName: string;
  certificateIdentifier: string;
  templateDesignId: number | string;
  phone: string;
}
