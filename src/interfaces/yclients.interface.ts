export interface YclientsCertificateObject {
  id: number;
  number: string;
}

export interface YclientsResponsePayload {
  success: boolean;
  data: YclientsCertificateObject[];
  meta?: Record<string, unknown>;
}
