export type GSTIN = string;

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorGstin: GSTIN;
  invoiceDate: Date;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  source: 'PURCHASE_REGISTER' | 'GSTR_2A' | 'GSTR_2B';
  status: 'MATCHED' | 'FLAGGED' | 'UNMATCHED';
}

export interface Vendor {
  gstin: GSTIN;
  name: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface MatchResult {
  purchaseInvoiceId: string;
  gstrInvoiceId?: string;
  confidenceScore: number;
  matchType: 'EXACT' | 'FUZZY' | 'ML' | 'NONE';
  status: 'MATCHED' | 'FLAGGED' | 'UNMATCHED';
}

export interface RiskAssessment {
  vendorGstin: GSTIN;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  contributingFactors: string[];
}