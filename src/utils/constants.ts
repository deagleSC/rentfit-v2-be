// User Roles
export const USER_ROLES = {
  LANDLORD: 'landlord',
  TENANT: 'tenant',
  ADMIN: 'admin',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Agreement Types
export const AGREEMENT_TYPES = {
  ELEVEN_MONTHS: '11_months',
  LONG_TERM: 'long_term',
} as const;

// Agreement Status
export const AGREEMENT_STATUS = {
  DRAFT: 'draft',
  PENDING_SIGNATURE: 'pending_signature',
  ACTIVE: 'active',
  RENEWING: 'renewing',
  TERMINATED: 'terminated',
  DISPUTE: 'dispute',
} as const;

// Property Status
export const PROPERTY_STATUS = {
  VACANT: 'vacant',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
} as const;

// Payment Types
export const PAYMENT_TYPES = {
  RENT: 'rent',
  DEPOSIT: 'deposit',
  MAINTENANCE: 'maintenance',
  PENALTY: 'penalty',
  REFUND: 'refund',
  OTHER: 'other',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  PAID: 'paid',
  OVERDUE: 'overdue',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  UPI: 'upi',
  BANK_TRANSFER: 'bank_transfer',
  CASH: 'cash',
  CARD: 'card',
  OTHER: 'other',
} as const;

// Inspection Types
export const INSPECTION_TYPES = {
  MOVE_IN: 'move_in',
  MOVE_OUT: 'move_out',
  PERIODIC: 'periodic',
} as const;

// Ticket Types
export const TICKET_TYPES = {
  MAINTENANCE: 'maintenance',
  RENT_RECEIPT_ISSUE: 'rent_receipt_issue',
  AGREEMENT_RENEWAL: 'agreement_renewal',
  EARLY_EXIT: 'early_exit',
  DISPUTE: 'dispute',
  PAYMENT_ISSUE: 'payment_issue',
  GENERAL: 'general',
} as const;

// Ticket Status
export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  ESCALATED: 'escalated',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  RENT_DUE: 'rent_due',
  RENT_OVERDUE: 'rent_overdue',
  PAYMENT_RECEIVED: 'payment_received',
  AGREEMENT_EXPIRING: 'agreement_expiring',
  AGREEMENT_SIGNED: 'agreement_signed',
  TICKET_UPDATE: 'ticket_update',
  INSPECTION_SCHEDULED: 'inspection_scheduled',
  SYSTEM: 'system',
  OTHER: 'other',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;
