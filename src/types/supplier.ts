export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  commodities: string[];
  lastPrice: Record<string, number>;
  rating: number;
  location: string;
}

export interface SupplierNotificationRequest {
  supplier_id: string;
  commodity?: string;
  message: string;
  confirmed: boolean;
  channel?: "whatsapp" | "email" | "mock";
}

export interface SupplierNotificationResult {
  sent: boolean;
  channel: string;
  timestamp: string;
  message: string;
  error?: string;
}
