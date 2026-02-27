
export type GSTIN = string;

export type InvoiceStatus = 'MATCHED' | 'PARTIAL_MATCH' | 'FAILED' | 'FLAGGED' | 'UNMATCHED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type MatchType = 'EXACT' | 'FUZZY' | 'ML' | 'NONE' | 'IRN_LINKED';

/**
 * SSD Section 10: Knowledge Graph Model Node Labels
 */
export type GraphNodeType = 'TAXPAYER' | 'INVOICE' | 'RETURN' | 'PAYMENT' | 'IRN';

/**
 * SSD Section 6.2: Required Relationships
 */
export type GraphEdgeType = 
  | 'ISSUED' 
  | 'RECEIVED_BY' 
  | 'REPORTED_IN' 
  | 'PAID_TAX' 
  | 'HAS_IRN' 
  | 'CLAIMED_IN';

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

export interface GraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  riskLevel?: RiskLevel;
  properties?: Record<string, any>;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: GraphEdgeType;
  properties?: Record<string, any>;
}
