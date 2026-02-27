
export type GSTIN = string;

export type InvoiceStatus = 'MATCHED' | 'PARTIAL_MATCH' | 'FAILED' | 'FLAGGED' | 'UNMATCHED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type MatchType = 'EXACT' | 'FUZZY' | 'ML' | 'NONE' | 'IRN_LINKED';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorGstin: GSTIN;
  recipientGstin?: GSTIN;
  invoiceDate: Date;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  source: 'PURCHASE_REGISTER' | 'GSTR_1' | 'GSTR_2A' | 'GSTR_2B';
  status: InvoiceStatus;
  riskScore: number;
  flags?: string[];
  // New Schema Fields
  irn?: string;
  einvoiceStatus?: 'Generated' | 'Cancelled' | 'Missing';
  itcClaimed?: number;
  paymentCoverageRatio?: number;
}

export interface Vendor {
  gstin: GSTIN;
  name: string;
  legalName?: string;
  stateCode?: string;
  registrationType?: 'Regular' | 'Composition';
  riskScore: number;
  riskLevel: RiskLevel;
  networkMetrics?: {
    chainDepth: number;
    clusterRisk: number;
    degreeCentrality: number;
  };
}

export interface RiskAssessment {
  vendorGstin: GSTIN;
  riskScore: number;
  riskLevel: RiskLevel;
  contributingFactors: string[];
  rulesTriggered: {
    ruleId: string;
    weight: number;
    scoreContribution: number;
  }[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'VENDOR' | 'INVOICE' | 'BUYER' | 'RETURN' | 'IRN';
  riskLevel?: RiskLevel;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: 'REPORTED_IN' | 'PRESENT_IN' | 'TAX_PAYMENT_FOUND' | 'EWAY_BILL_LINKED' | 'MATCHED_WITH' | 'MISMATCH_WITH' | 'HAS_IRN' | 'CLAIMED_BY';
}
