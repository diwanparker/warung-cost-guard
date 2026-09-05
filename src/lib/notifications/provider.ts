import type { NotificationRequest, NotificationResult } from "@/types/action";

export interface NotificationProvider {
  send(request: NotificationRequest): Promise<NotificationResult>;
}
