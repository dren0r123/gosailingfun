export interface YclientsCertificateTypeObject {
  id: number;
  title: string;
  balance: number;
  is_multi: boolean;
  company_group_id: number;
  item_type_id: number;
  expiration_type_id: number;
  expiration_date: string | null;
  expiration_timeout: number;
  expiration_timeout_unit_id: number;
  is_allow_empty_code: boolean;
  item_type?: {
    item_type_id: number;
    title: string;
  };
}

export interface YclientsCertificateObject {
  id: number;
  number: string;
  balance: number;
  default_balance: number;
  type_id: number;
  status_id: number;
  created_date: string;
  expiration_date: string | null;
  type: YclientsCertificateTypeObject;
  status: {
    id: number;
    slug: string;
    title: string;
  };
}

export interface YclientsResponsePayload {
  success: boolean;
  data: YclientsCertificateObject[];
  meta?: Record<string, unknown>;
}
