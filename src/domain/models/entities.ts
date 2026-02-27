
/**
 * @fileOverview Refined Domain Models for PramanaGST
 * Based on Final Dataset Schema Implemented (Audit V1)
 */

export type GSTIN = string;

export type InvoiceStatus = 'MATCHED' | 'PARTIAL_MATCH' | 'FAILED' | 'FLAGGED' | 'UNMATCHED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type GraphNodeType = 
  | 'ROOT_NODE' 
  | 'SUPPLIER' 
  | 'BUYER' 
  | 'INVOICE' 
  | 'RETURN_PERIOD' 
  | 'IRN' 
  | 'PAYMENT' 
  | 'CREDIT_NOTE';

export type GraphEdgeType = 
  | 'ITC_CLAIMED' 
  | 'ITC_AVAILABLE' 
  | 'TAX_PAID' 
  | 'TAX_NOT_PAID' 
  | 'IRN_VALID' 
  | 'IRN_CANCELLED' 
  | 'HIGH_RISK' 
  | 'MATCHED' 
  | 'MISMATCHED'
  | 'ISSUED'
  | 'RECEIVED_BY'
  | 'REPORTED_IN';

export interface Invoice {
  id: string; // Internal system ID
  invoiceNumber: string;
  vendorGstin: GSTIN; // Supplier GSTIN
  recipientGstin: GSTIN; // Recipient GSTIN
  invoiceDate: Date;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  source: 'GSTR_1' | 'GSTR_2A' | 'GSTR_2B' | 'PURCHASE_REGISTER';
  status: InvoiceStatus;
  riskScore: number;
  flags?: string[];
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

export interface PaymentEvidence {
  supplierGstin: GSTIN;
  returnPeriod: string;
  taxPaid: number;
}

export interface GraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  riskLevel?: RiskLevel;
  properties?: Record<string, any>;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: GraphEdgeType;
  status?: 'CLEAN' | 'WARNING' | 'RISK' | 'PENDING';
  properties?: Record<string, any>;
}

export interface RiskAssessment {
  vendorGstin: GSTIN;
  riskScore: number;
  riskLevel: RiskLevel;
  contributingFactors: string[];
  graphEvidence?: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
}
