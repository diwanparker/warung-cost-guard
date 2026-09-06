import type { SupplierNotificationRequest, SupplierNotificationResult } from "@/types/supplier";

export interface NotificationProvider {
  send(request: SupplierNotificationRequest): Promise<SupplierNotificationResult>;
}
